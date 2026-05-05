'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

// Auth is opt-in via env var — disabled until Supabase is configured
const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true';

// Routes accessible without authentication
const PUBLIC_PATHS = ['/login'];

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p));

  React.useEffect(() => {
    if (!AUTH_ENABLED || loading || isPublic) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (requireAdmin && profile?.role !== 'admin') {
      router.replace('/');
    }
  }, [user, profile, loading, requireAdmin, router, isPublic]);

  // Auth disabled globally or public page — render freely
  if (!AUTH_ENABLED || isPublic) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-rule)] border-t-[var(--color-green-deep)]" />
      </div>
    );
  }

  if (!user) return null;
  if (requireAdmin && profile?.role !== 'admin') return null;

  return <>{children}</>;
}
