'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons, type IconName } from '@/lib/icons';
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
    <header className="sticky top-0 z-40 border-b border-[var(--color-rule)] bg-[var(--color-surface)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-surface)]/80">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-[var(--color-green-deep)]">
            <Icons.sprout aria-hidden className="h-6 w-6" strokeWidth={1.75} />
            <div className="flex flex-col leading-none">
              <span className="serif text-[15px] font-semibold tracking-tight">
                Plantas Vivas
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                Easy Chile
              </span>
            </div>
          </Link>
        </div>
        <nav
          aria-label="Secciones"
          className="-mb-px flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                  'group flex shrink-0 items-center gap-2 rounded-t-md px-3.5 py-2.5 text-[14px] font-medium transition-colors',
                  'min-h-[44px]',
                  active
                    ? 'border-b-2 border-[var(--color-green-deep)] text-[var(--color-green-deep)]'
                    : 'border-b-2 border-transparent text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
                )}
              >
                <Icon
                  aria-hidden
                  className="h-[18px] w-[18px]"
                  strokeWidth={active ? 2 : 1.75}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
