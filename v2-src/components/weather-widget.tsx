'use client';

/**
 * WeatherWidget — muestra condiciones actuales de la tienda
 * usando Open-Meteo (gratuito, sin API key, CORS-friendly).
 * API: https://open-meteo.com/
 */

import * as React from 'react';

interface WeatherData {
  temperature: number;       // °C
  apparentTemperature: number;
  precipitation: number;     // mm en la hora actual
  windSpeed: number;         // km/h
  weatherCode: number;       // WMO code
  isDay: boolean;
}

// WMO weather interpretation codes → label en español
function describeWeather(code: number, isDay: boolean): { label: string; icon: string } {
  if (code === 0)                    return { label: 'Despejado',        icon: isDay ? '☀' : '🌙' };
  if (code <= 2)                     return { label: 'Parcialmente nublado', icon: '⛅' };
  if (code === 3)                    return { label: 'Nublado',          icon: '☁' };
  if (code <= 49)                    return { label: 'Niebla',           icon: '🌫' };
  if (code <= 55)                    return { label: 'Llovizna',         icon: '🌦' };
  if (code <= 65)                    return { label: 'Lluvia',           icon: '🌧' };
  if (code <= 77)                    return { label: 'Nieve',            icon: '❄' };
  if (code <= 82)                    return { label: 'Chubascos',        icon: '🌧' };
  if (code <= 99)                    return { label: 'Tormenta',         icon: '⛈' };
  return                                    { label: 'Variable',         icon: '🌤' };
}

// Risk adjustment label based on actual temperature
function riskHint(temp: number, precip: number): { label: string; color: string } | null {
  if (temp >= 30) return { label: `Calor extremo — regar con urgencia`,  color: 'var(--color-danger)' };
  if (temp >= 25) return { label: `Temperatura alta — verificar humedad`, color: 'var(--color-warning)' };
  if (temp <= 2)  return { label: `Riesgo de helada — proteger interiores`, color: '#4B9CD3' };
  if (temp <= 7)  return { label: `Frío — reducir riego, proteger del viento`, color: '#5BAACC' };
  if (precip > 2) return { label: `Lluvia activa — no regar hoy`,        color: '#3A9BBF' };
  return null;
}

interface Props {
  lat: number;
  lon: number;
  tiendaNombre: string;
}

export function WeatherWidget({ lat, lon, tiendaNombre }: Props) {
  const [weather, setWeather]   = React.useState<WeatherData | null>(null);
  const [loading, setLoading]   = React.useState(true);
  const [error, setError]       = React.useState(false);
  const [updatedAt, setUpdatedAt] = React.useState<string>('');

  React.useEffect(() => {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code,is_day` +
      `&timezone=America%2FSantiago`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then((data) => {
        const c = data.current;
        setWeather({
          temperature:         Math.round(c.temperature_2m),
          apparentTemperature: Math.round(c.apparent_temperature),
          precipitation:       c.precipitation,
          windSpeed:           Math.round(c.wind_speed_10m),
          weatherCode:         c.weather_code,
          isDay:               c.is_day === 1,
        });
        setUpdatedAt(
          new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
        );
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [lat, lon]);

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="animate-pulse rounded-2xl"
        style={{
          border: '0.5px solid var(--color-rule)',
          background: 'var(--color-surface-2)',
          padding: '20px 24px',
          height: '96px',
        }}
      />
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error || !weather) {
    return (
      <div
        className="rounded-2xl"
        style={{
          border: '0.5px solid var(--color-rule)',
          background: 'var(--color-surface-2)',
          padding: '16px 20px',
        }}
      >
        <p style={{ fontSize: '12px', color: 'var(--color-ink-soft)' }}>
          No se pudo obtener el clima actual. Verifica tu conexión.
        </p>
      </div>
    );
  }

  const { label: weatherLabel, icon: weatherIcon } = describeWeather(weather.weatherCode, weather.isDay);
  const hint = riskHint(weather.temperature, weather.precipitation);

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        border: '0.5px solid var(--color-rule)',
        background: 'var(--color-surface)',
      }}
    >
      {/* Main row */}
      <div className="flex items-center justify-between gap-4 px-5 py-4">

        {/* Temperature — display italic */}
        <div className="flex items-end gap-3">
          <span
            className="display"
            style={{
              fontSize: 'clamp(44px, 6vw, 64px)',
              lineHeight: 1,
              fontStyle: 'italic',
              color: 'var(--color-ink)',
              letterSpacing: '-0.04em',
            }}
          >
            {weather.temperature}°
          </span>
          <div style={{ paddingBottom: '6px' }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-ink)' }}>
              {weatherIcon} {weatherLabel}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--color-ink-soft)', marginTop: '2px' }}>
              Sensación {weather.apparentTemperature}° · Viento {weather.windSpeed} km/h
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className="text-right shrink-0">
          <p style={{
            fontSize: '10px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--color-ink-soft)',
          }}>
            Clima actual
          </p>
          {weather.precipitation > 0 && (
            <p style={{ fontSize: '12px', color: '#4B9CD3', marginTop: '3px' }}>
              💧 {weather.precipitation} mm/h
            </p>
          )}
          <p style={{ fontSize: '11px', color: 'var(--color-ink-soft)', opacity: 0.55, marginTop: '4px' }}>
            Actualizado {updatedAt}
          </p>
        </div>
      </div>

      {/* Risk hint bar (only when conditions affect plant care) */}
      {hint && (
        <div
          style={{
            borderTop: '0.5px solid var(--color-rule)',
            background: `${hint.color}10`,
            padding: '10px 20px',
          }}
        >
          <p style={{ fontSize: '12px', fontWeight: 500, color: hint.color }}>
            {hint.label}
          </p>
        </div>
      )}
    </div>
  );
}
