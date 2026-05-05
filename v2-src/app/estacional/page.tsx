import { estacional } from '@/data';
import type { Estacion } from '@/types/data';

export const metadata = {
  title: 'Calendario estacional — Manual Plantas Vivas',
};

const MES_ACTUAL = new Date().getMonth() + 1; // 1–12

function getEstacionActual(estaciones: Estacion[]): string {
  return estaciones.find(e => e.meses.includes(MES_ACTUAL))?.id ?? '';
}

const ESTACION_COLOR: Record<string, { accent: string; bg: string }> = {
  otono:    { accent: 'var(--color-gold)',       bg: 'rgba(168,126,52,0.05)'  },
  invierno: { accent: '#5B7FA6',                 bg: 'rgba(91,127,166,0.05)'  },
  primavera:{ accent: 'var(--color-green-deep)',  bg: 'rgba(45,90,61,0.05)'   },
  verano:   { accent: 'var(--color-terracotta)',  bg: 'rgba(184,78,56,0.05)'  },
};

export default function EstacionalPage() {
  const actual = getEstacionActual(estacional);

  return (
    <div className="space-y-12">

      {/* Header */}
      <header style={{ borderBottom: '0.5px solid var(--color-rule)', paddingBottom: '2rem' }}>
        <p className="eyebrow mb-4" style={{ color: 'var(--color-green-soft)' }}>Chile · Hemisferio Sur</p>
        <h1 className="display" style={{ fontSize: 'clamp(40px, 6vw, 80px)', fontStyle: 'italic', lineHeight: 0.88 }}>
          Calendario estacional
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed" style={{ color: 'var(--color-ink-soft)', maxWidth: '58ch' }}>
          Qué plantas destacar, qué cuidados priorizar y qué riesgos anticipar — según la temporada en Chile.
        </p>
      </header>

      {/* Temporadas */}
      {estacional.map(estacion => {
        const esCurrent = estacion.id === actual;
        const { accent, bg } = ESTACION_COLOR[estacion.id] ?? { accent: 'var(--color-ink)', bg: 'var(--color-surface-2)' };

        return (
          <section
            key={estacion.id}
            style={{
              border: esCurrent ? `1.5px solid ${accent}` : '0.5px solid var(--color-rule)',
              background: esCurrent ? bg : 'transparent',
            }}
          >
            {/* Season header */}
            <div
              className="flex flex-wrap items-baseline justify-between gap-3 px-6 py-5"
              style={{ borderBottom: '0.5px solid var(--color-rule)' }}
            >
              <div className="flex items-baseline gap-4">
                <h2
                  className="display"
                  style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontStyle: 'italic', lineHeight: 0.9, color: accent }}
                >
                  {estacion.nombre}
                </h2>
                <span className="text-[13px]" style={{ color: 'var(--color-ink-soft)' }}>
                  {estacion.mesesNombre}
                </span>
              </div>
              {esCurrent && (
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1"
                  style={{ background: accent, color: 'var(--color-cream)' }}
                >
                  Temporada actual
                </span>
              )}
            </div>

            <div className="px-6 py-5 space-y-6">
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-ink-soft)' }}>
                {estacion.descripcion}
              </p>

              <div className="grid gap-6 md:grid-cols-2">

                {/* Plantas destacadas */}
                <div>
                  <p className="eyebrow mb-3" style={{ color: accent }}>Plantas del momento</p>
                  <ul className="space-y-2">
                    {estacion.plantasDestacadas.map(p => (
                      <li
                        key={p.nombre}
                        className="flex gap-3 text-[14px]"
                        style={{ paddingBottom: '0.5rem', borderBottom: '0.5px solid var(--color-rule)' }}
                      >
                        <span className="font-medium shrink-0" style={{ color: 'var(--color-ink)', minWidth: '120px' }}>
                          {p.nombre}
                        </span>
                        <span style={{ color: 'var(--color-ink-soft)' }}>{p.motivo}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cuidados + Riesgos */}
                <div className="space-y-5">
                  <div>
                    <p className="eyebrow mb-2" style={{ color: 'var(--color-green-deep)' }}>Cuidados clave</p>
                    <ul className="space-y-1.5">
                      {estacion.cuidadosClave.map((c, i) => (
                        <li key={i} className="flex gap-2 text-[13px] leading-relaxed" style={{ color: 'var(--color-ink)' }}>
                          <span style={{ color: accent, fontWeight: 600, flexShrink: 0 }}>—</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="eyebrow mb-2" style={{ color: 'var(--color-danger)' }}>Riesgos a anticipar</p>
                    <ul className="space-y-1.5">
                      {estacion.riesgos.map((r, i) => (
                        <li key={i} className="flex gap-2 text-[13px] leading-relaxed" style={{ color: 'var(--color-ink)' }}>
                          <span style={{ color: 'var(--color-danger)', fontWeight: 600, flexShrink: 0 }}>—</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Zonas */}
              <div
                className="grid gap-3 sm:grid-cols-2"
                style={{ borderTop: '0.5px solid var(--color-rule)', paddingTop: '1.25rem' }}
              >
                <div>
                  <p className="eyebrow mb-1" style={{ color: 'var(--color-ink-soft)' }}>Zona norte (Desértico · Semiárido)</p>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-ink)' }}>{estacion.zonaNorte}</p>
                </div>
                <div>
                  <p className="eyebrow mb-1" style={{ color: 'var(--color-ink-soft)' }}>Zona sur (Montaña · Frío húmedo)</p>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-ink)' }}>{estacion.zonaSur}</p>
                </div>
              </div>
            </div>
          </section>
        );
      })}

    </div>
  );
}
