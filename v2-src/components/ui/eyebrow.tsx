import * as React from 'react';
import { cn } from '@/lib/cn';

export function Eyebrow({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'font-medium text-[12px] uppercase tracking-[0.08em] text-[var(--color-ink-soft)]',
        className
      )}
      {...props}
    />
  );
}
