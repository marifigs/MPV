"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Leaf, Globe, ClipboardList, AlertTriangle } from "@/lib/icons";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/plantas", label: "Plantas", icon: Leaf },
  { href: "/tiendas", label: "Mi Tienda", icon: Store },
  { href: "/clima", label: "Clima", icon: Globe },
  { href: "/rutina", label: "Rutina", icon: ClipboardList },
  { href: "/alertas", label: "Alertas", icon: AlertTriangle },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <nav
      className="border-t border-[var(--rule)] bg-[var(--surface)] md:border-t-0 md:border-r"
      aria-label="Navegación principal"
    >
      {/* Mobile: bottom tab bar */}
      <ul className="flex items-center justify-around px-1 py-1 md:hidden">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-0.5 rounded-[var(--radius-sm)] px-2 text-[10px] font-medium transition-colors",
                  active
                    ? "text-[var(--green-deep)]"
                    : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={cn("size-5", active && "text-[var(--green-deep)]")}
                  aria-hidden
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Desktop: sidebar */}
      <ul className="hidden flex-col gap-1 p-3 md:flex">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex min-h-[44px] items-center gap-3 rounded-[var(--radius-md)] px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--green-deep)] text-white"
                    : "text-[var(--ink-soft)] hover:bg-[var(--surface-raised)] hover:text-[var(--ink)]"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
