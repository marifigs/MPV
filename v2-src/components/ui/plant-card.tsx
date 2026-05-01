import Link from 'next/link';
import { Icons, type IconName } from '@/lib/icons';
import { cn } from '@/lib/cn';

interface PlantCardProps {
  id: string;
  nombre: string;
  grupo: string;
  subrubro?: string;
  total?: number;
  icon?: IconName;
  href?: string;
  className?: string;
}

export function PlantCard({
  id,
  nombre,
  grupo,
  subrubro,
  total,
  icon = 'sprout',
  href,
  className,
}: PlantCardProps) {
  const Icon = Icons[icon];
  const link = href ?? `/plantas/${id}`;
  return (
    <Link
      href={link}
      className={cn(
        'group flex flex-col gap-3 rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-4 transition-colors',
        'hover:border-[var(--color-green-soft)] hover:bg-[var(--color-surface-2)]',
        'min-h-[112px]',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green-deep)]">
          <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="line-clamp-2 text-[15px] font-medium leading-snug text-[var(--color-ink)]">
            {nombre}
          </span>
          <span className="mt-1 text-[12px] uppercase tracking-[0.06em] text-[var(--color-ink-soft)]">
            {grupo}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between text-[12px] text-[var(--color-ink-soft)]">
        <span>{subrubro ?? ''}</span>
        {typeof total === 'number' ? (
          <span>
            <span className="font-medium text-[var(--color-ink)]">{total}</span> en stock
          </span>
        ) : null}
      </div>
    </Link>
  );
}
