import * as React from 'react';
import { Icons, type IconName } from '@/lib/icons';
import { cn } from '@/lib/cn';

type Variant = 'info' | 'success' | 'warning' | 'danger';

const VARIANT_STYLES: Record<Variant, { box: string; icon: string; iconName: IconName }> = {
  info: {
    box: 'bg-[var(--color-surface-2)] border-[var(--color-rule)] text-[var(--color-ink)]',
    icon: 'text-[var(--color-green-soft)]',
    iconName: 'bulb',
  },
  success: {
    box: 'bg-[#EAF3EA] border-[#C9DEC9] text-[#1F4527]',
    icon: 'text-[var(--color-success)]',
    iconName: 'check',
  },
  warning: {
    box: 'bg-[#FBF1DC] border-[#EFD9A4] text-[#6F4F0F]',
    icon: 'text-[var(--color-warning)]',
    iconName: 'alert',
  },
  danger: {
    box: 'bg-[#F7E1DE] border-[#E8B5AC] text-[#6F1B16]',
    icon: 'text-[var(--color-danger)]',
    iconName: 'alert',
  },
};

interface AlertProps {
  variant?: Variant;
  title?: string;
  icon?: IconName;
  children?: React.ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', title, icon, children, className }: AlertProps) {
  const styles = VARIANT_STYLES[variant];
  const IconCmp = Icons[icon ?? styles.iconName];
  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg border px-4 py-3',
        styles.box,
        className
      )}
      role={variant === 'danger' || variant === 'warning' ? 'alert' : 'note'}
    >
      <IconCmp aria-hidden className={cn('mt-0.5 h-5 w-5 shrink-0', styles.icon)} strokeWidth={1.75} />
      <div className="flex min-w-0 flex-col gap-1">
        {title ? <p className="font-medium leading-snug">{title}</p> : null}
        {children ? <div className="text-[14px] leading-relaxed">{children}</div> : null}
      </div>
    </div>
  );
}
