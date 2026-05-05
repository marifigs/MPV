import { plagas } from '@/data';
import type { Plaga } from '@/types/data';

export const metadata = {
  title: 'Guía de plagas — Manual Plantas Vivas',
};

const URGENCIA: Record<Plaga['urgencia'], { label: string; color: string; bg: string }> = {
  alta:   { label: 'Actuar ahora', color: 'var(--color-danger)',  bg: 'rgba(168,52,52,0.06)'  },
  normal: { label: 'Vigilar',      color: 'var(--color-warning)', bg: 'rgba(200,150,60,0.06)' },
};

const TIPO_LABEL: Record<Plaga['tipo'], string> = {
  insecto: 'Insecto',
  ácaro:   'Ácaro',
  hongo:   'Hongo',
};

export default function PlagasPage() {
  const criticas = plagas.filter(p => p.urgencia === 'alta');
  const vigilar  = plagas.filter(p => p.urgencia === 'normal');

  return (
    <div className="space-y-12">

      {/* Header */}
      <header style={{ borderBottom: '0.5px solid var(--color-rule)', paddingBottom: '2rem' }}>
        <p className="eyebrow mb-4" style={{ color: 'var(--color-green-soft)' }}>Referencia rápida</p>
        <h1 className="display" style={{ fontSize: 'clamp(40px, 6vw, 80px)', fontStyle: 'italic', lineHeight: 0.88 }}>
          Guía de plagas
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed" style={{ color: 'var(--color-ink-soft)', maxWidth: '58ch' }}>
          Las 6 plagas más frecuentes en sala. Identifica la señal, actúa de inmediato y evita el contagio entre plantas.
          Basado en Royal Horticultural Society (RHS) y Missouri Botanical Garden.
        </p>
      </header>

      {/* Críticas */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="display" style={{ fontSize: 'clamp(22px, 2.5vw, 34px)', fontStyle: 'italic', lineHeight: 0.9 }}>
            Aislar de inmediato
          </h2>
          <div style={{ flex: 1, height: '0.5px', background: 'var(--color-danger)', opacity: 0.3 }} />
        </div>
        <ul className="space-y-4">
          {criticas.map(p => <PlagaCard key={p.id} plaga={p} />)}
        </ul>
      </section>

      {/* Vigilar */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="display" style={{ fontSize: 'clamp(22px, 2.5vw, 34px)', fontStyle: 'italic', lineHeight: 0.9 }}>
            Vigilar y tratar
          </h2>
          <div style={{ flex: 1, height: '0.5px', background: 'var(--color-warning)', opacity: 0.3 }} />
        </div>
        <ul className="space-y-4">
          {vigilar.map(p => <PlagaCard key={p.id} plaga={p} />)}
        </ul>
      </section>

      {/* Regla de oro */}
      <aside
        style={{
          borderLeft: '2px solid var(--color-green-deep)',
          paddingLeft: '1.25rem',
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
        }}
      >
        <p className="eyebrow mb-1" style={{ color: 'var(--color-green-deep)' }}>Regla de oro</p>
        <p className="text-[15px] leading-relaxed" style={{ color: 'var(--color-ink)' }}>
          Toda planta nueva entra en cuarentena al menos una semana antes de ponerse junto a otras.
          La mayoría de los brotes de plaga en sala se originan en stock recién llegado.
        </p>
      </aside>

    </div>
  );
}

function PlagaCard({ plaga }: { plaga: Plaga }) {
  const cfg = URGENCIA[plaga.urgencia];
  return (
    <li
      style={{
        borderTop: '0.5px solid var(--color-rule)',
        borderRight: '0.5px solid var(--color-rule)',
        borderBottom: '0.5px solid var(--color-rule)',
        borderLeft: `2px solid ${cfg.color}`,
        background: cfg.bg,
      }}
    >
      {/* Top */}
      <div
        className="flex flex-wrap items-start justify-between gap-3 px-5 py-4"
        style={{ borderBottom: '0.5px solid var(--color-rule)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.14em] px-2 py-0.5"
              style={{ color: cfg.color, border: `0.5px solid ${cfg.color}` }}
            >
              {cfg.label}
            </span>
            <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: 'var(--color-ink-soft)', opacity: 0.6 }}>
              {TIPO_LABEL[plaga.tipo]}
            </span>
          </div>
          <h3 className="display text-[22px]" style={{ fontStyle: 'italic', lineHeight: 1.1 }}>
            {plaga.nombre}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {/* Señales */}
        <div>
          <p className="eyebrow mb-1.5" style={{ color: 'var(--color-ink-soft)' }}>Qué ves en sala</p>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-ink)' }}>
            {plaga.señales}
          </p>
        </div>

        {/* Plantas */}
        <div>
          <p className="eyebrow mb-2" style={{ color: 'var(--color-ink-soft)' }}>Más afectadas</p>
          <div className="flex flex-wrap gap-1.5">
            {plaga.plantas.map(nombre => (
              <span
                key={nombre}
                className="text-[12px] px-2 py-0.5"
                style={{ border: '0.5px solid var(--color-rule)', color: 'var(--color-ink-soft)', background: 'var(--color-surface)' }}
              >
                {nombre}
              </span>
            ))}
          </div>
        </div>

        {/* Acción */}
        <div style={{ borderTop: '0.5px solid var(--color-rule)', paddingTop: '1rem' }}>
          <p className="eyebrow mb-1.5" style={{ color: cfg.color }}>Qué hacer</p>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-ink)' }}>
            {plaga.accion}
          </p>
        </div>
      </div>
    </li>
  );
}
