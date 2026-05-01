'use client';

import * as React from 'react';
import { Icons } from '@/lib/icons';
import { useShare } from '@/hooks/use-share';

interface ShareButtonProps {
  title: string;
  text?: string;
}

export function ShareButton({ title, text }: ShareButtonProps) {
  const { share } = useShare();
  const [feedback, setFeedback] = React.useState<string | null>(null);

  async function onClick() {
    if (typeof window === 'undefined') return;
    const result = await share({
      title,
      text: text ?? title,
      url: window.location.href,
    });
    setFeedback(
      result === 'shared' ? 'Compartido' :
      result === 'copied' ? 'Enlace copiado' :
      'No fue posible compartir'
    );
    setTimeout(() => setFeedback(null), 2000);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-12 items-center gap-2 rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] px-4 text-[15px] font-medium hover:border-[var(--color-green-soft)] hover:bg-[var(--color-surface-2)]"
    >
      <Icons.share aria-hidden className="h-4 w-4" strokeWidth={1.75} />
      {feedback ?? 'Compartir'}
    </button>
  );
}
