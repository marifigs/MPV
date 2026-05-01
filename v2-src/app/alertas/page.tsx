import { Section } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Icons } from '@/lib/icons';
import { alertas } from '@/data';
import { cn } from '@/lib/cn';

export const metadata = {
  title: 'Alertas — Manual Plantas Vivas',
};

const SEVERIDAD_STYLE = {
  leve: { label: 'Leve', tone: 'bg-[var(--color-surface-2)] text-[var(--color-ink-soft)]', accent: 'border-l-[var(--color-green-soft)]' },
  media: { label: 'Atención', tone: 'bg-[#FBF1DC] text-[#6F4F0F]', accent: 'border-l-[var(--color-warning)]' },
  critica: { label: 'Crítica', tone: 'bg-[#F7E1DE] text-[#6F1B16]', accent: 'border-l-[var(--color-danger)]' },
} as const;

export default function AlertasPage() {
  return (
    <div className="space-y-10">
      <Section
        eyebrow="Diagnóstico rápido"
        title="Señales de alerta"
        description="Aprende a leer lo que tus plantas te dicen. Detección a tiempo evita la merma."
      />
      <ul className="grid gap-3 md:grid-cols-2">
        {alertas.map((a) => {
          const style = SEVERIDAD_STYLE[a.severidad];
          return (
            <li key={a.id}>
              <Card className={cn('flex h-full flex-col gap-3 border-l-4 p-5', style.accent)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Icons.alert aria-hidden className="h-5 w-5 text-[var(--color-warning)]" strokeWidth={1.75} />
                    <h3 className="serif text-[18px] leading-tight">{a.titulo}</h3>
                  </div>
                  <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.06em]', style.tone)}>
                    {style.label}
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed text-[var(--color-ink)]">{a.accion}</p>
              </Card>
            </li>
          );
        })}
      </ul>

      <Section title="Regla de oro ante cualquier duda">
        <Alert variant="success" title="Cuando no sepas qué hacer">
          <p className="leading-relaxed">
            Si la planta se ve mal y no sabes qué tiene → <strong>retírala de la exhibición</strong>,
            colócala en zona de recuperación y avisa a tu supervisor. Es mejor una planta menos en
            exhibición que arruinar la imagen del área completa.
          </p>
        </Alert>
      </Section>

      <Card tone="soft" className="p-6">
        <Eyebrow className="text-[var(--color-green-deep)]">Cómo usar esta página</Eyebrow>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
          Identifica el síntoma visible más cercano al de tu planta y sigue la acción descrita.
          Para problemas que se repiten, consulta la ficha del grupo en el catálogo de plantas.
        </p>
      </Card>
    </div>
  );
}
