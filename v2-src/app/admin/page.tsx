'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabase';
import type { AuditSession, Profile } from '@/types/supabase';

const ONLINE_THRESHOLD_MS = 90_000; // 90s — 3 missed heartbeats = offline

interface SessionWithProfile extends AuditSession {
  profile?: { full_name: string | null; store: string | null };
}

export default function AdminOverviewPage() {
  const [sessions, setSessions] = React.useState<SessionWithProfile[]>([]);
  const [stats, setStats] = React.useState({ total_users: 0, sessions_today: 0, avg_duration: 0 });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const onlineThreshold = new Date(Date.now() - ONLINE_THRESHOLD_MS).toISOString();

      const [{ data: sessionsData }, { data: profilesData }, { count: totalUsers }, { count: sessionsToday }] =
        await Promise.all([
          supabase
            .from('audit_sessions')
            .select('*')
            .gte('last_seen_at', onlineThreshold)
            .order('last_seen_at', { ascending: false }),
          supabase.from('profiles').select('id, full_name, store'),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('audit_sessions').select('id', { count: 'exact', head: true }).gte('started_at', todayStart),
        ]);

      const profileMap = Object.fromEntries((profilesData ?? []).map((p: Pick<Profile, 'id' | 'full_name' | 'store'>) => [p.id, p]));
      const enriched = (sessionsData ?? []).map((s: AuditSession) => ({
        ...s,
        profile: profileMap[s.user_id],
      }));

      setSessions(enriched);
      setStats({
        total_users: totalUsers ?? 0,
        sessions_today: sessionsToday ?? 0,
        avg_duration: 0,
      });
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, []);

  const onlineNow = sessions.filter(s =>
    Date.now() - new Date(s.last_seen_at).getTime() < ONLINE_THRESHOLD_MS
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow mb-1" style={{ color: 'var(--color-green-soft)' }}>Panel de administración</p>
        <h1 className="display" style={{ fontSize: '28px', fontStyle: 'italic' }}>Resumen</h1>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="En línea ahora" value={onlineNow.length} accent="green" />
        <StatCard label="Sesiones hoy" value={stats.sessions_today} />
        <StatCard label="Usuarios activos" value={stats.total_users} />
      </div>

      {/* Online users table */}
      <section>
        <SectionHeader>
          En línea ahora
          <OnlineDot />
        </SectionHeader>
        {onlineNow.length === 0 ? (
          <EmptyState text="Nadie conectado en este momento" />
        ) : (
          <Table
            cols={['Usuario', 'Tienda', 'Página actual', 'Desde hace']}
            rows={onlineNow.map(s => [
              s.profile?.full_name ?? s.user_email,
              s.profile?.store ?? '—',
              s.user_email,
              formatAge(s.started_at),
            ])}
          />
        )}
      </section>

      {/* Recent sessions */}
      <section>
        <SectionHeader>Últimas sesiones</SectionHeader>
        <Table
          cols={['Usuario', 'Ingresó', 'Duración', 'Páginas']}
          rows={sessions.slice(0, 20).map(s => [
            s.profile?.full_name ?? s.user_email,
            formatDate(s.started_at),
            s.duration_seconds ? formatDuration(s.duration_seconds) : '—',
            String(s.page_count),
          ])}
        />
      </section>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-CL', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso));
}
function formatAge(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'recién';
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${m % 60}min`;
}
function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="p-6" style={{ border: '0.5px solid var(--color-rule)', background: 'var(--color-surface)' }}>
      <p className="eyebrow mb-2" style={{ color: accent === 'green' ? 'var(--color-green-deep)' : 'var(--color-ink-soft)' }}>
        {label}
      </p>
      <p className="display" style={{ fontSize: '40px', fontStyle: 'italic', lineHeight: 1 }}>
        {value}
      </p>
    </div>
  );
}

function OnlineDot() {
  return (
    <span className="inline-flex items-center gap-1.5 ml-3">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-[11px] text-emerald-600 font-medium">en vivo</span>
    </span>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="eyebrow" style={{ color: 'var(--color-ink-soft)' }}>{children}</span>
      <div style={{ flex: 1, height: '0.5px', background: 'var(--color-rule)' }} />
    </div>
  );
}

function Table({ cols, rows }: { cols: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto" style={{ border: '0.5px solid var(--color-rule)' }}>
      <table className="w-full text-[13px]">
        <thead style={{ background: 'var(--color-surface-2)', borderBottom: '0.5px solid var(--color-rule)' }}>
          <tr>
            {cols.map(c => (
              <th key={c} className="px-4 py-3 text-left font-semibold text-[11px] uppercase tracking-[0.1em]"
                style={{ color: 'var(--color-ink-soft)' }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderTop: '0.5px solid var(--color-rule)', background: 'var(--color-surface)' }}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3" style={{ color: j === 0 ? 'var(--color-ink)' : 'var(--color-ink-soft)' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="py-8 text-center text-[13px]" style={{ color: 'var(--color-ink-soft)', border: '0.5px solid var(--color-rule)' }}>
      {text}
    </p>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-rule)] border-t-[var(--color-green-deep)]" />
    </div>
  );
}
