'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabase';
import type { HeatmapPoint } from '@/types/supabase';

const ROUTES = ['/', '/plantas', '/rutina', '/estacional', '/plagas', '/faq'];
const COLORS = [
  [0, 0, 255, 0],       // blue   (cold)
  [0, 255, 255, 80],    // cyan
  [0, 255, 0, 140],     // lime
  [255, 255, 0, 180],   // yellow
  [255, 128, 0, 210],   // orange
  [255, 0, 0, 255],     // red    (hot)
] as const;

function lerpColor(t: number): [number, number, number, number] {
  const scaled = t * (COLORS.length - 1);
  const i = Math.min(Math.floor(scaled), COLORS.length - 2);
  const f = scaled - i;
  const from = COLORS[i]!;
  const to = COLORS[i + 1]!;
  return from.map((c, k) => Math.round(c + f * (to[k]! - c))) as [number, number, number, number];
}

function renderHeatmap(canvas: HTMLCanvasElement, points: HeatmapPoint[], radius = 28) {
  const { width, height } = canvas;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, width, height);

  if (points.length === 0) return;

  // Pass 1: intensity map on offscreen canvas
  const off = new OffscreenCanvas(width, height);
  const octx = off.getContext('2d')!;
  octx.globalAlpha = 0.15;
  for (const p of points) {
    const x = p.x * width;
    const y = p.y * height;
    const grad = octx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    octx.fillStyle = grad;
    octx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  // Pass 2: colorize via LUT
  const imgData = octx.getImageData(0, 0, width, height);
  const colored = ctx.createImageData(width, height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const intensity = (imgData.data[i] ?? 0) / 255;
    if (intensity === 0) continue;
    const [r, g, b, a] = lerpColor(intensity);
    colored.data[i] = r;
    colored.data[i + 1] = g;
    colored.data[i + 2] = b;
    colored.data[i + 3] = Math.round(a * intensity);
  }
  ctx.putImageData(colored, 0, 0);
}

export default function HeatmapPage() {
  const [route, setRoute] = React.useState('/');
  const [points, setPoints] = React.useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [totalPoints, setTotalPoints] = React.useState(0);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  async function loadPoints(path: string) {
    setLoading(true);
    const { data, count } = await supabase
      .from('heatmap_points')
      .select('*', { count: 'exact' })
      .eq('path', path)
      .order('created_at', { ascending: false })
      .limit(5000);
    setPoints(data ?? []);
    setTotalPoints(count ?? 0);
    setLoading(false);
  }

  React.useEffect(() => { loadPoints(route); }, [route]);

  // Render heatmap whenever points or canvas size change
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || loading) return;
    renderHeatmap(canvas, points);
  }, [points, loading]);

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-1" style={{ color: 'var(--color-green-soft)' }}>Panel de administración</p>
        <h1 className="display" style={{ fontSize: '28px', fontStyle: 'italic' }}>Mapa de calor</h1>
        <p className="mt-2 text-[13px]" style={{ color: 'var(--color-ink-soft)' }}>
          Visualización de clicks y toques por página. Rojo = zona de mayor interacción.
        </p>
      </div>

      {/* Route selector */}
      <div className="flex flex-wrap gap-2">
        {ROUTES.map(r => (
          <button
            key={r}
            onClick={() => setRoute(r)}
            className="px-4 py-2 text-[12px] font-medium transition-all"
            style={
              route === r
                ? { background: 'var(--color-ink)', color: 'var(--color-cream)' }
                : { border: '0.5px solid var(--color-rule)', background: 'var(--color-surface)', color: 'var(--color-ink-soft)' }
            }
          >
            {r === '/' ? 'Inicio' : r.replace('/', '')}
          </button>
        ))}
      </div>

      {/* Stats */}
      <p className="text-[13px]" style={{ color: 'var(--color-ink-soft)' }}>
        <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>
          {totalPoints.toLocaleString('es-CL')}
        </span>{' '}
        interacciones registradas en <span className="font-mono">{route}</span>
        {totalPoints > 5000 && ' (mostrando las 5.000 más recientes)'}
      </p>

      {/* Canvas */}
      <div
        className="relative overflow-hidden"
        style={{
          border: '0.5px solid var(--color-rule)',
          background: 'var(--color-surface-2)',
          borderRadius: '4px',
          aspectRatio: '16/9',
        }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-rule)] border-t-[var(--color-green-deep)]" />
          </div>
        )}
        {!loading && points.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[13px]" style={{ color: 'var(--color-ink-soft)' }}>
              Sin datos para esta página aún
            </p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          style={{ width: '100%', height: '100%', opacity: loading ? 0 : 1, transition: 'opacity 0.3s' }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: 'var(--color-ink-soft)' }}>
          Frío
        </span>
        <div
          style={{
            flex: 1,
            height: '8px',
            borderRadius: '4px',
            background: 'linear-gradient(to right, rgba(0,0,255,0.4), rgba(0,255,255,0.6), rgba(0,255,0,0.7), rgba(255,255,0,0.8), rgba(255,128,0,0.9), rgba(255,0,0,1))',
          }}
        />
        <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: 'var(--color-ink-soft)' }}>
          Caliente
        </span>
      </div>
    </div>
  );
}
