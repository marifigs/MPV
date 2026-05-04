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
              className="grid h-8 w-8 place-items-center rounded-lg"
              style={{
                background: 'var(--color-green-deep)',
                color: 'var(--color-cream)',
                transition: 'transform 0.5s var(--ease-luxury)',
              }}
            >
              <Icons.sprout aria-hidden className="h-4 w-4" strokeWidth={2} />
            </span>

            {/* Brand text */}
            <div className="flex flex-col leading-none">
              <span
                className="serif tracking-tight"
                style={{ fontSize: '15px', color: 'var(--color-ink)' }}
              >
                Plantas Vivas
              </span>
              <span style={{
                marginTop: '2px',
                fontFamily: 'var(--font-sans)',
                fontSize: '9px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: 'var(--color-ink-soft)',
                opacity: 0.55,
              }}>
                Easy Chile
              </span>
            </div>
          </Link>

          {/* Right: search + logo */}
          <div className="flex items-center gap-4">
            <GlobalSearchTrigger />
            <img
              src="/MPV/v2/easy-logo.png"
              alt="Easy Cencosud"
              className="h-11 w-auto sm:h-13"
              decoding="async"
            />
          </div>
        </div>

        {/* Nav — icon-free, uppercase micro-text */}
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
                className="relative flex shrink-0 items-center px-3.5 py-3 min-h-[44px] transition-colors duration-300"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '10.5px',
                  fontWeight: active ? 500 : 400,
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: active
                    ? 'var(--color-ink)'
                    : 'var(--color-ink-soft)',
                  opacity: active ? 1 : 0.6,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
