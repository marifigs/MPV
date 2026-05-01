'use client';

import * as React from 'react';
import { useMiTienda } from '@/hooks/use-mi-tienda';
import { Icons } from '@/lib/icons';

interface SaveMiTiendaProps {
  tiendaId: string;
}

export function SaveMiTienda({ tiendaId }: SaveMiTiendaProps) {
  const { tiendaId: stored, setTiendaId, hydrated } = useMiTienda();
  const [feedback, setFeedback] = React.useState<string | null>(null);

  if (!hydrated) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex h-12 items-center gap-2 rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] px-4 text-[15px] text-[var(--color-ink-soft)]"
      >
        <Icons.store aria-hidden className="h-4 w-4" strokeWidth={1.75} />
        Cargando…
      </button>
    );
  }

  const isSaved = stored === tiendaId;

  function toggle() {
    if (isSaved) {
      setTiendaId(null);
      setFeedback('Quitado de mi tienda');
    } else {
      setTiendaId(tiendaId);
      setFeedback('Guardado como mi tienda');
    }
    setTimeout(() => setFeedback(null), 1800);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isSaved}
      className="inline-flex h-12 items-center gap-2 rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] px-4 text-[15px] font-medium hover:border-[var(--color-green-soft)] hover:bg-[var(--color-surface-2)]"
    >
      {isSaved ? (
        <Icons.check aria-hidden className="h-4 w-4 text-[var(--color-success)]" strokeWidth={2} />
      ) : (
        <Icons.store aria-hidden className="h-4 w-4" strokeWidth={1.75} />
      )}
      {feedback ?? (isSaved ? 'Mi tienda' : 'Guardar como mi tienda')}
    </button>
  );
}
