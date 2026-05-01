import * as React from 'react';
import { cn } from '@/lib/cn';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: 'default' | 'soft' | 'highlight' | 'inset';
};

const TONES: Record<NonNullable<CardProps['tone']>, string> = {
  default: 'bg-[var(--color-surface)] border-[var(--color-rule)]',
  soft: 'bg-[var(--color-surface-2)] border-[var(--color-rule)]',
  highlight:
    'bg-[var(--color-green-deep)] text-[var(--color-cream)] border-transparent',
  inset: 'bg-[var(--color-surface-3)] border-[var(--color-rule)]',
};

export function Card({
  className,
  tone = 'default',
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border shadow-[var(--shadow-soft)]',
        TONES[tone],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 p-5 sm:p-6', className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('serif text-[22px] leading-tight tracking-tight', className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-[14px] leading-snug text-[var(--color-ink-soft)]', className)}
      {...props}
    />
  );
}

export function CardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('p-5 sm:p-6 pt-0', className)}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 border-t border-[var(--color-rule)] px-5 py-4 sm:px-6',
        className
      )}
      {...props}
    />
  );
}
