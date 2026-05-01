'use client';

import * as React from 'react';
import { Icons } from '@/lib/icons';
import { Checklist, type ChecklistItem } from '@/components/ui/checklist';
import { Card } from '@/components/ui/card';
import { Eyebrow } from '@/components/ui/eyebrow';
import { useRutinaDiaria } from '@/hooks/use-rutina-diaria';
import type { PasoRutina } from '@/types/data';

interface RutinaChecklistProps {
  rutina: PasoRutina[];
}

const MOMENTO_LABEL: Record<PasoRutina['momento'], string> = {
  apertura: 'Apertura',
  mediodia: 'Mediodía',
  cierre: 'Cierre',
};

const MOMENTO_ICON = {
  apertura: 'sunrise',
  mediodia: 'sun',
  cierre: 'sunset',
} as const;

export function RutinaChecklist({ rutina }: RutinaChecklistProps) {
  const allIds = React.useMemo(
    () => rutina.flatMap((m) => m.pasos.map((_, i) => `${m.id}-${i}`)),
    [rutina]
  );
  const { hydrated, marcados, racha, completados, total, todoCompletado, toggle, resetHoy } =
    useRutinaDiaria(allIds);

  const pct = total === 0 ? 0 : Math.round((completados / total) * 100);

  return (
    <div className="space-y-7">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Eyebrow className="text-[var(--color-green-deep)]">Hoy</Eyebrow>
            <p className="serif mt-1 text-[28px] leading-tight">
              {hydrated ? `${completados} de ${total} pasos completados` : 'Cargando…'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {racha > 0 ? (
              <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-green-deep)] px-3 py-1.5 text-[var(--color-cream)]">
                <Icons.flame aria-hidden className="h-4 w-4" strokeWidth={1.75} />
                <span className="text-[13px] font-medium">{racha} día{racha === 1 ? '' : 's'} de racha</span>
              </div>
            ) : null}
            <button
              type="button"
              onClick={resetHoy}
              className="text-[13px] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
            >
              Reiniciar hoy
            </button>
          </div>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
          <div
            className="h-full bg-[var(--color-green-deep)] transition-[width] duration-300"
            style={{ width: `${pct}%` }}
            aria-hidden
          />
        </div>
        {todoCompletado ? (
          <p className="mt-3 text-[14px] text-[var(--color-success)]">
            ¡Listo! Día completado. Vuelve mañana para sumar a tu racha.
          </p>
        ) : null}
      </Card>

      {rutina.map((momento) => {
        const Icon = Icons[MOMENTO_ICON[momento.momento]];
        const items: ChecklistItem[] = momento.pasos.map((paso, i) => ({
          id: `${momento.id}-${i}`,
          label: paso,
        }));
        return (
          <section key={momento.id} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--color-green-deep)] text-[var(--color-cream)]">
                <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <Eyebrow>{MOMENTO_LABEL[momento.momento]} · {momento.duracionMin} min</Eyebrow>
                <h2 className="serif text-[22px] leading-tight">{momento.titulo}</h2>
              </div>
            </div>
            <Checklist items={items} checked={marcados} onToggle={toggle} />
          </section>
        );
      })}
    </div>
  );
}
