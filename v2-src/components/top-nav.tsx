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
    <header className="sticky top-0 z-40 border-b border-[var(--color-rule)] bg-[var(--color-surface)]/96 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Brand row */}
        <div className="flex items-center justify-between gap-4 py-3.5">
          <Link
            href="/"
            className="group flex items-center gap-3 text-[var(--color-green-deep)]"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--color-green-deep)] text-[var(--color-cream)] transition-transform group-hover:scale-[0.96]">
              <Icons.sprout aria-hidden className="h-4 w-4" strokeWidth={2} />
            </span>
            <div className="flex flex-col leading-none">
              <span className="serif text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                Plantas Vivas
              </span>
              <span
                className="mt-0.5 font-medium text-[9.5px] uppercase tracking-[0.18em]"
                style={{ color: 'var(--color-ink-soft)', opacity: 0.7 }}
              >
                Easy Chile
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
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
          className="-mb-px flex gap-0.5 overflow-x-auto pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                  'group flex shrink-0 items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium transition-colors relative min-h-[44px]',
                  active
                    ? 'text-[var(--color-green-deep)]'
                    : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
                )}
              >
                <Icon
                  aria-hidden
                  className="h-[15px] w-[15px] shrink-0"
                  strokeWidth={active ? 2.25 : 1.75}
                />
                <span>{item.label}</span>
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-green-deep)] rounded-t-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
