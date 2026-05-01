import Link from 'next/link';
import { Icons, type IconName } from '@/lib/icons';
import { cn } from '@/lib/cn';

interface StoreCardProps {
  id: string;
  nombre: string;
  zonaLabel: string;
  zonaIcon: IconName;
  tipoLabel?: string;
  href?: string;
  className?: string;
}

export function StoreCard({
  id,
  nombre,
  zonaLabel,
  zonaIcon,
  tipoLabel,
  href,
  className,
}: StoreCardProps) {
  const Icon = Icons[zonaIcon];
  const link = href ?? `/mi-tienda/${id}`;
  return (
    <Link
      href={link}
      className={cn(
        'group flex items-start gap-3 rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-4 transition-colors',
        'hover:border-[var(--color-green-soft)] hover:bg-[var(--color-surface-2)]',
        'min-h-[80px]',
        className
      )}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green-deep)]">
        <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="serif text-[16px] leading-tight text-[var(--color-ink)]">
          {nombre}
        </span>
        <span className="mt-1 text-[13px] text-[var(--color-ink-soft)]">
          {zonaLabel}
          {tipoLabel ? <span className="opacity-70"> · {tipoLabel}</span> : null}
        </span>
      </div>
      <Icons.chevronRight
        aria-hidden
        className="mt-1 h-4 w-4 shrink-0 text-[var(--color-ink-soft)] transition-transform group-hover:translate-x-0.5"
        strokeWidth={1.75}
      />
    </Link>
  );
}
