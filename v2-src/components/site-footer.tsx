import { Icons } from '@/lib/icons';

export function SiteFooter() {
  return (
    <footer style={{ background: 'var(--color-forest)', borderTop: 'none' }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14 sm:py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">

          {/* Left: brand */}
          <div className="flex items-center gap-3">
            <span
              className="grid h-9 w-9 place-items-center rounded-lg"
              style={{ background: 'rgba(245,241,232,0.08)', color: 'rgba(245,241,232,0.60)' }}
            >
              <Icons.sprout aria-hidden className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span
              className="serif tracking-tight"
              style={{ fontSize: '17px', color: 'rgba(245,241,232,0.75)' }}
            >
              Manual de Plantas Vivas
            </span>
          </div>

          {/* Right: meta + logo */}
          <div className="flex items-center gap-5">
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.5rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: 'rgba(245,241,232,0.22)',
            }}>
              Easy Chile · Cencosud S.A. · Uso exclusivo para vendedores
            </p>
            <img
              src="/MPV/v2/cencosud-logo.png"
              alt="Cencosud"
              className="w-auto"
              style={{ height: '32px', opacity: 0.35, filter: 'brightness(2)' }}
              decoding="async"
              loading="lazy"
            />
          </div>
        </div>

        {/* Bottom hairline + year */}
        <div
          className="mt-10 pt-6 flex items-center justify-between"
          style={{ borderTop: '0.5px solid rgba(245,241,232,0.06)' }}
        >
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.5rem',
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: 'rgba(245,241,232,0.14)',
          }}>
            © 2026 Cencosud S.A.
          </span>
        </div>
      </div>
    </footer>
  );
}
