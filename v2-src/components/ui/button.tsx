import * as React from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-[var(--color-green-deep)] text-[var(--color-cream)] hover:bg-[#234a32] active:bg-[#1d3f2a] disabled:bg-[var(--color-rule)] disabled:text-[var(--color-ink-soft)]',
  secondary:
    'border border-[var(--color-rule)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:border-[var(--color-green-soft)] hover:bg-[var(--color-surface-2)]',
  ghost:
    'text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]',
  danger:
    'bg-[var(--color-danger)] text-[var(--color-cream)] hover:brightness-95',
};

const SIZES: Record<Size, string> = {
  sm: 'h-10 px-3 text-[14px] rounded-md',
  md: 'h-12 px-5 text-[15px] rounded-lg',
  lg: 'h-14 px-6 text-[16px] rounded-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-colors',
          'min-w-[48px]',
          'disabled:cursor-not-allowed disabled:opacity-60',
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
