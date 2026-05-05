'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabase';
import type { AuditEvent, AuditSession } from '@/types/supabase';

type EventRow = AuditEvent & { session: Pick<AuditSession, 'user_email'> | null };

const EVENT_LABELS: Record<string, { label: string; color: string }> = {
  pageview:         { label: 'Vista de página',       color: 'var(--color-green-deep)' },
  scroll_milestone: { label: 'Scroll milestone',      color: 'var(--color-green-soft)' },
  scroll_exit:      { label: 'Salida con scroll',     color: 'var(--color-ink-soft)'   },
  rage_click:       { label: '⚡ Rage click',          color: 'var(--color-danger)'     },
  form_field:       { label: 'Campo de formulario',   color: 'var(--color-gold)'       },
  js_error:         { label: '⚠ Error JS',             color: 'var(--color-warning)'    },
  search:           { label: 'Búsqueda',              color: 'var(--color-green-deep)' },
  plant_view:       { label: 'Ver planta',            color: 'var(--color-green-deep)' },
  store_view:       { label: 'Ver tienda',            color: 'var(--color-green-deep)' },
  logout:           { label: 'Cierre de sesión',      color: 'var(--color-ink-soft)'   },
};

export default function AuditoriaPage() {
  const [events, setEvents] = React.useState<EventRow[]>([]);
  const [sessions, setSessions] = React.useState<AuditSession[]>([]);
  const [tab, setTab] = React.useState<'events' | 'sessions'>('sessions');
  const [filterEmail, setFilterEmail] = React.useState('');
  const [filterPath, setFilterPath] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      const [{ data: ev }, { data: sess }] = await Promise.all([
        supabase
          .from('audit_events')
          .select('*, session:audit_sessions(user_email)')
          .order('created_at', { ascending: false })
          .limit(500),
        supabase
          .from('audit_sessions')
          .select('*')
          .order('started_at', { ascending: false })
          .limit(200),
      ]);
      setEvents((ev as EventRow[]) ?? []);
      setSessions(sess ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filteredSessions = sessions.filter(s =>
    (!filterEmail || s.user_email.toLowerCase().includes(filterEmail.toLowerCase()))
  );

  const filteredEvents = events.filter(e =>
    (!filterEmail || (e.session?.user_email ?? '').toLowerCase().includes(filterEmail.toLowerCase())) &&
    (!filterPath || e.path.includes(filterPath))
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-1" style={{ color: 'var(--color-green-soft)' }}>Panel de administración</p>
        <h1 className="display" style={{ fontSize: '28px', fontStyle: 'italic' }}>Auditoría</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b" style={{ borderColor: 'var(--color-rule)' }}>
        {(['sessions', 'events'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.1em] transition-all"
            style={{
              color: tab === t ? 'var(--color-ink)' : 'var(--color-ink-soft)',
              borderBottom: tab === t ? '2px solid var(--color-green-deep)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {t === 'sessions' ? `Sesiones (${sessions.length})` : `Eventos (${events.length})`}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          value={filterEmail}
          onChange={e => setFilterEmail(e.target.value)}
          placeholder="Filtrar por correo…"
          className="input-base"
          style={{ maxWidth: '260px' }}
        />
        {tab === 'events' && (
          <input
            value={filterPath}
            onChange={e => setFilterPath(e.target.value)}
            placeholder="Filtrar por ruta (ej: /plantas)…"
            className="input-base"
            style={{ maxWidth: '280px' }}
          />
        )}
      </div>

      {tab === 'sessions' ? (
        <div className="overflow-x-auto" style={{ border: '0.5px solid var(--color-rule)' }}>
          <table className="w-full text-[13px]">
            <thead style={{ background: 'var(--color-surface-2)', borderBottom: '0.5px solid var(--color-rule)' }}>
              <tr>
                {['Usuario', 'Ingresó', 'Última actividad', 'Duración', 'Páginas', 'Estado'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-[11px] uppercase tracking-[0.1em]"
                    style={{ color: 'var(--color-ink-soft)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map(s => {
                const isOnline = Date.now() - new Date(s.last_seen_at).getTime() < 90_000;
                return (
                  <tr key={s.id} style={{ borderTop: '0.5px solid var(--color-rule)', background: 'var(--color-surface)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-ink)' }}>{s.user_email}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-ink-soft)' }}>{fmt(s.started_at)}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-ink-soft)' }}>{fmt(s.last_seen_at)}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-ink-soft)' }}>
                      {s.duration_seconds ? fmtDur(s.duration_seconds) : '—'}
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-ink-soft)' }}>{s.page_count}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5"
                        style={{
                          background: isOnline ? '#d1fae5' : 'var(--color-surface-2)',
                          color: isOnline ? '#065f46' : 'var(--color-ink-soft)',
                        }}
                      >
                        {isOnline ? '● En línea' : 'Offline'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto" style={{ border: '0.5px solid var(--color-rule)' }}>
          <table className="w-full text-[13px]">
            <thead style={{ background: 'var(--color-surface-2)', borderBottom: '0.5px solid var(--color-rule)' }}>
              <tr>
                {['Usuario', 'Evento', 'Ruta', 'Hora'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-[11px] uppercase tracking-[0.1em]"
                    style={{ color: 'var(--color-ink-soft)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(e => (
                <tr key={e.id} style={{ borderTop: '0.5px solid var(--color-rule)', background: 'var(--color-surface)' }}>
                  <td className="px-4 py-3" style={{ color: 'var(--color-ink)' }}>
                    {e.session?.user_email ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-medium" style={{ color: EVENT_LABELS[e.event_type]?.color ?? 'var(--color-ink-soft)' }}>
                      {EVENT_LABELS[e.event_type]?.label ?? e.event_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px]" style={{ color: 'var(--color-ink-soft)' }}>{e.path}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-ink-soft)' }}>{fmt(e.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function fmt(iso: string) {
  return new Intl.DateTimeFormat('es-CL', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso));
}
function fmtDur(secs: number) {
  const m = Math.floor(secs / 60);
  return m > 0 ? `${m}m ${secs % 60}s` : `${secs}s`;
}
function LoadingSpinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-rule)] border-t-[var(--color-green-deep)]" />
    </div>
  );
}
