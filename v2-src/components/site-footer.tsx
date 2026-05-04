import { Icons } from '@/lib/icons';

export function SiteFooter() {
  return (
    <footer style={{ background: 'var(--color-forest)', borderTop: 'none' }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14 sm:py-16">

        {/* ── Top row ── */}
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
              style={{ background: 'rgba(245,241,232,0.08)', color: 'rgba(245,241,232,0.55)' }}
            >
              <Icons.sprout aria-hidden className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div>
              <p
                className="serif tracking-tight"
                style={{ fontSize: '17px', color: 'rgba(245,241,232,0.80)', lineHeight: 1.2 }}
              >
                Manual de Plantas Vivas
              </p>
              <p style={{ fontSize: '11px', color: 'rgba(245,241,232,0.30)', marginTop: '2px', letterSpacing: '0.06em' }}>
                Easy Chile · Cencosud S.A.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-1">
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'rgba(245,241,232,0.30)',
              marginBottom: '8px',
            }}>
              Responsable del área
            </p>
            <p style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(245,241,232,0.75)' }}>
              María Fernanda Figueroa
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(245,241,232,0.38)', letterSpacing: '0.02em' }}>
              National Lead · Terrazas y Jardín
            </p>
            <a
              href="mailto:fernanda.figueroasalgado@cencosud.cl"
              style={{
                display: 'inline-block',
                marginTop: '6px',
                fontSize: '12px',
                color: 'rgba(245,241,232,0.50)',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(245,241,232,0.85)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,241,232,0.50)')}
            >
              fernanda.figueroasalgado@cencosud.cl
            </a>
          </div>

          {/* Logo */}
          <div className="flex items-start">
            <img
              src="/MPV/v2/cencosud-logo.png"
              alt="Cencosud"
              className="w-auto"
              style={{ height: '28px', opacity: 0.28, filter: 'brightness(2)' }}
              decoding="async"
              loading="lazy"
            />
          </div>
        </div>

        {/* ── Bottom rule + copyright ── */}
        <div
          className="mt-10 pt-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: '0.5px solid rgba(245,241,232,0.07)' }}
        >
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 400,
            color: 'rgba(245,241,232,0.22)',
            letterSpacing: '0.04em',
          }}>
            © 2026 Cencosud S.A. · Uso exclusivo para vendedores
          </span>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            color: 'rgba(245,241,232,0.14)',
            letterSpacing: '0.04em',
          }}>
            v2 · Manual Plantas Vivas
          </span>
        </div>
      </div>
    </footer>
  );
}
