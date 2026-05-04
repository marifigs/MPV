'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons, type IconName } from '@/lib/icons';
import { GlobalSearchTrigger } from './global-search';
import { cn } from '@/lib/cn';

type NavItem = { href: string; label: string; icon: IconName };

const ITEMS: NavItem[] = [
  { href: '/', label: 'Inicio', icon: 'home' },
  { href: '/mi-tienda', label: 'Mi tienda', icon: 'store' },
  { href: '/plantas', label: 'Plantas', icon: 'sprout' },
  { href: '/climas', label: 'Climas', icon: 'globe' },
  { href: '/alertas', label: 'Alertas', icon: 'alert' },
  { href: '/rutina', label: 'Rutina', icon: 'checklist' },
  { href: '/liquidacion', label: 'Liquidación', icon: 'tag' },
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

        {/* Nav tabs */}
        <nav
          aria-label="Secciones"
          className="-mb-px flex gap-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {ITEMS.map((item) => {
            const Icon = Icons[item.icon];
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group relative flex shrink-0 items-center gap-1.5 px-3.5 py-3 min-h-[44px]',
                  'transition-colors duration-300',
                  active
                    ? 'text-[var(--color-green-deep)]'
                    : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
                )}
                style={{ fontSize: '13px', fontWeight: active ? 500 : 400 }}
              >
                <Icon
                  aria-hidden
                  className="h-[14px] w-[14px] shrink-0"
                  strokeWidth={active ? 2.25 : 1.75}
                />
                <span>{item.label}</span>
                {/* Active indicator — thin hairline */}
                {active && (
                  <span
                    className="absolute bottom-0 left-0 right-0 rounded-t-full"
                    style={{ height: '1.5px', background: 'var(--color-green-deep)' }}
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
