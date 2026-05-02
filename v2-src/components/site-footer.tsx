import { Icons } from '@/lib/icons';

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-rule)] bg-[var(--color-surface-2)]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--color-green-deep)] text-[var(--color-cream)]">
              <Icons.sprout aria-hidden className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="serif text-[17px] font-semibold tracking-tight text-[var(--color-ink)]">
              Manual de Plantas Vivas
            </span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--color-ink-soft)]/60">
              Easy Chile · Cencosud S.A. · Uso exclusivo para vendedores
            </p>
            <img
              src="/MPV/v2/cencosud-logo.png"
              alt="Cencosud"
              className="h-9 w-auto opacity-85"
              decoding="async"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
