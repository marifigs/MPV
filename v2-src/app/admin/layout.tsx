'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/contexts/auth-context';

const NAV = [
  { href: '/admin', label: 'Resumen' },
  { href: '/admin/usuarios', label: 'Usuarios' },
  { href: '/admin/auditoria', label: 'Auditoría' },
  { href: '/admin/heatmap', label: 'Heatmap' },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      {/* Admin top bar */}
      <div
        style={{
          borderBottom: '0.5px solid var(--color-rule)',
          background: 'var(--color-surface)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between h-12">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[11px] font-medium uppercase tracking-[0.16em]"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              ← App
            </Link>
            <span style={{ width: '0.5px', height: '16px', background: 'var(--color-rule)' }} />
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: 'var(--color-green-deep)' }}
            >
              Admin
            </span>
            <nav className="flex gap-4">
              {NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[12px] font-medium transition-colors"
                  style={{
                    color: pathname === href ? 'var(--color-ink)' : 'var(--color-ink-soft)',
                    borderBottom: pathname === href ? '1.5px solid var(--color-green-deep)' : 'none',
                    paddingBottom: '2px',
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[12px]" style={{ color: 'var(--color-ink-soft)' }}>
              {profile?.email}
            </span>
            <button
              onClick={signOut}
              className="text-[11px] uppercase tracking-[0.12em] font-medium"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-10">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAdmin>
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}
