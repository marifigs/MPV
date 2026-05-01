import * as React from 'react';
import { cn } from '@/lib/cn';

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
    <section className={cn('mb-16', className)} {...rest}>
      {(eyebrow || title || description || actions) && (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-2">
            {eyebrow ? (
              <p className="eyebrow">{eyebrow}</p>
            ) : null}
            {title ? (
              <h2
                className="serif text-[var(--color-ink)]"
                style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', letterSpacing: '-0.03em' }}
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="max-w-[60ch] text-[var(--color-ink-soft)] leading-relaxed">
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
