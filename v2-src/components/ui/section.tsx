import * as React from 'react';
import { cn } from '@/lib/cn';
import { Eyebrow } from './eyebrow';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function Section({
  eyebrow,
  title,
  description,
  actions,
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section className={cn('mb-10', className)} {...rest}>
      {(eyebrow || title || description || actions) && (
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {title ? (
              <h2 className="serif text-[28px] sm:text-[32px] leading-tight tracking-tight text-[var(--color-ink)]">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="max-w-[60ch] text-[var(--color-ink-soft)]">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}
