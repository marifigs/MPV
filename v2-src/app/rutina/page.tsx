import { Section } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { Icons } from '@/lib/icons';
import { rutina, tips } from '@/data';
import { RutinaChecklist } from '@/components/rutina-checklist';

export const metadata = {
  title: 'Rutina diaria — Manual Plantas Vivas',
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
