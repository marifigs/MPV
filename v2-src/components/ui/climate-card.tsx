import Link from 'next/link';
import { Icons, type IconName } from '@/lib/icons';
import { cn } from '@/lib/cn';

interface ClimateCardProps {
  zonaId: string;
  titulo: string;
  descripcion: string;
  riegoGeneral: string;
  icon: IconName;
  href?: string;
  className?: string;
}

export function ClimateCard({
  zonaId,
  titulo,
  descripcion,
  riegoGeneral,
  icon,
  href,
  className,
}: ClimateCardProps) {
  const Icon = Icons[icon];
  const link = href ?? `/climas/${zonaId}`;
  return (
    <Link
      href={link}
      className={cn(
        'group flex flex-col gap-3 rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-5 transition-colors',
        'hover:border-[var(--color-green-soft)] hover:bg-[var(--color-surface-2)]',
        'min-h-[180px]',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--color-green-deep)] text-[var(--color-cream)]">
          <Icon aria-hidden className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <h3 className="serif text-[20px] leading-tight text-[var(--color-ink)]">
          {titulo}
        </h3>
      </div>
      <p className="text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
        {descripcion}
      </p>
      <p className="mt-auto text-[13px] text-[var(--color-ink)]">
        <span className="eyebrow text-[var(--color-green-deep)]">Riego</span>
        <span className="ml-2">{riegoGeneral}</span>
      </p>
    </Link>
  );
}
