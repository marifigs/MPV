import { Section } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { Icons } from '@/lib/icons';
import { rutina, tips, diagnosticos } from '@/data';
import { RutinaChecklist } from '@/components/rutina-checklist';
import type { Diagnostico } from '@/types/data';

export const metadata = {
  title: 'Rutina diaria — Manual Plantas Vivas',
};

const URGENCIA_CONFIG: Record<Diagnostico['urgencia'], { label: string; color: string; bg: string; border: string }> = {
  alta:   { label: 'Actuar ahora',  color: 'var(--color-danger)',    bg: 'rgba(168,52,52,0.05)',  border: 'var(--color-danger)'    },
  normal: { label: 'Revisar',       color: 'var(--color-warning)',   bg: 'rgba(200,150,60,0.05)', border: 'var(--color-warning)'   },
  baja:   { label: 'Observar',      color: 'var(--color-green-soft)', bg: 'var(--color-surface-2)', border: 'var(--color-green-soft)' },
};

export default function RutinaPage() {
  return (
    <div className="space-y-12">
      <Section
        eyebrow="Hábito diario"
        title="Rutina"
        description="Sigue este checklist cada día. La constancia mantiene a las plantas y reduce la merma."
      />

      <RutinaChecklist rutina={rutina} />

      {/* ── ¿Qué hago si...? — diagnóstico situacional ──────────────────── */}
      <section className="space-y-5">
        {/* Header */}
        <div>
          <p className="eyebrow mb-2" style={{ color: 'var(--color-green-deep)' }}>Diagnóstico en sala</p>
          <h2
            className="display"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontStyle: 'italic', lineHeight: 0.9 }}
          >
            ¿Qué hago si…?
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed" style={{ color: 'var(--color-ink-soft)', maxWidth: '58ch' }}>
            Situaciones frecuentes en sala y la acción correcta. Basado en guías de la Royal Horticultural Society (RHS) y el Missouri Botanical Garden.
          </p>
        </div>

        <ul className="space-y-3">
          {diagnosticos.map((d) => {
            const cfg = URGENCIA_CONFIG[d.urgencia];
            return (
              <li
                key={d.id}
                style={{
                  borderLeft: `2px solid ${cfg.border}`,
                  borderTop: '0.5px solid var(--color-rule)',
                  borderRight: '0.5px solid var(--color-rule)',
                  borderBottom: '0.5px solid var(--color-rule)',
                  background: cfg.bg,
                }}
              >
                {/* Observación */}
                <div
                  className="flex items-start gap-3 px-5 py-3"
                  style={{ borderBottom: '0.5px solid var(--color-rule)' }}
                >
                  <span
                    className="mt-0.5 shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5"
                    style={{ color: cfg.color, background: `${cfg.bg}`, border: `0.5px solid ${cfg.border}` }}
                  >
                    {cfg.label}
                  </span>
                  <p className="font-medium text-[15px] leading-snug" style={{ color: 'var(--color-ink)' }}>
                    {d.observacion}
                  </p>
                </div>
                {/* Acción */}
                <div className="px-5 py-4 space-y-2">
                  <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-ink)' }}>
                    {d.accion}
                  </p>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-ink-soft)', opacity: 0.6 }}>
                    Fuente: {d.fuente}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <Section eyebrow="Buenas prácticas" title="Tips del experto">
        <ul className="grid gap-3 md:grid-cols-2">
          {tips.map((t) => (
            <li key={t.id}>
              <Card className="flex h-full gap-3 p-5">
                <Icons.bulb
                  aria-hidden
                  className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-warning)]"
                  strokeWidth={1.5}
                />
                <div>
                  <h3 className="font-medium text-[15px] leading-tight">{t.titulo}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
                    {t.texto}
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
