import { Icons } from '@/lib/icons';

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-[var(--color-rule)] bg-[var(--color-surface-2)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 sm:px-6 py-6 text-[13px] text-[var(--color-ink-soft)]">
        <div className="flex items-center gap-2">
          <Icons.sprout aria-hidden className="h-4 w-4" strokeWidth={1.75} />
          <span className="serif font-semibold text-[var(--color-ink)]">
            Manual de Plantas Vivas
          </span>
        </div>
        <p>Easy Chile · Cencosud S.A. · Uso exclusivo para vendedores.</p>
      </div>
    </footer>
  );
}
