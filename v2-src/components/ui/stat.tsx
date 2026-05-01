import * as React from 'react';
import { cn } from '@/lib/cn';

interface StatProps {
  value: string | number;
  label: string;
  hint?: string;
  className?: string;
}

export function Stat({ value, label, hint, className }: StatProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-5',
        className
      )}
    >
      <span className="serif text-[36px] leading-none text-[var(--color-green-deep)]">
        {value}
      </span>
      <span className="text-[13px] uppercase tracking-[0.08em] text-[var(--color-ink-soft)]">
        {label}
      </span>
      {hint ? <span className="text-[13px] text-[var(--color-ink-soft)]">{hint}</span> : null}
    </div>
  );
}
