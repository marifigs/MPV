'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/lib/icons';
import { GlobalSearchTrigger } from './global-search';

type NavItem = { href: string; label: string };

const ITEMS: NavItem[] = [
  { href: '/', label: 'Inicio' },
  { href: '/mi-tienda', label: 'Mi tienda' },
  { href: '/plantas', label: 'Plantas' },
  { href: '/climas', label: 'Climas' },
  { href: '/estacional', label: 'Temporada' },
  { href: '/plagas', label: 'Plagas' },
  { href: '/faq', label: 'FAQ' },
  { href: '/alertas', label: 'Alertas' },
  { href: '/rutina', label: 'Rutina' },
  { href: '/liquidacion', label: 'Liquidación' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/' || pathname === '';
  return pathname.startsWith(href);
}

export function TopNav() {
  const pathname = usePathname() ?? '/';

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{
        borderBottom: '0.5px solid var(--color-rule)',
        background: 'rgba(246,242,234,0.94)',
      }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Brand row */}
        <div className="flex items-center justify-between gap-4 py-4">
          <Link
            href="/"
            className="group flex items-center gap-3"
            style={{ color: 'var(--color-green-deep)' }}
          >
            {/* Logo mark */}
            <span
              className="grid h-9 w-9 place-items-center rounded-lg"
              style={{
                background: 'var(--color-green-deep)',
                color: 'var(--color-cream)',
                transition: 'transform 0.5s var(--ease-luxury)',
              }}
            >
              <Icons.sprout aria-hidden className="h-4.5 w-4.5" strokeWidth={2} />
            </span>

            {/* Brand text */}
            <div className="flex flex-col leading-none">
              <span
                className="serif tracking-tight"
                style={{ fontSize: '17px', color: 'var(--color-ink)' }}
              >
                Plantas Vivas
              </span>
              <span style={{
                marginTop: '3px',
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'var(--color-ink-soft)',
                opacity: 0.4,
              }}>
                Manual operativo
              </span>
            </div>
          </Link>

          {/* Right: search */}
          <div className="flex items-center gap-5">
            <GlobalSearchTrigger />
          </div>
        </div>

        {/* Nav — icon-free, editorial register */}
        <nav
          aria-label="Secciones"
          className="flex gap-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className="relative flex shrink-0 items-center px-4 py-3.5 min-h-[44px] transition-colors duration-300"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: active ? 500 : 400,
                  letterSpacing: '0.01em',
                  color: active
                    ? 'var(--color-ink)'
                    : 'var(--color-ink-soft)',
                  opacity: active ? 1 : 0.7,
                }}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute bottom-0 left-4 right-4"
                    style={{ height: '0.5px', background: 'var(--color-ink)', opacity: 0.4 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
