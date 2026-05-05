'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabase';

interface PageviewRow {
  path: string;
  created_at: string;
  session_id: string;
}

interface PageStat {
  path: string;
  views: number;
  entrances: number;
  exits: number;
  bounces: number;
}

interface Transition {
  from: string;
  to: string;
  count: number;
}

const PATH_LABELS: Record<string, string> = {
  '/':          'Inicio',
  '/plantas':   'Plantas',
  '/rutina':    'Rutina',
  '/tiendas':   'Tiendas',
  '/admin':     'Admin',
};

function label(path: string) {
  return PATH_LABELS[path] ?? path;
}

export default function FunnelPage() {
  const [pageStats, setPageStats] = React.useState<PageStat[]>([]);
  const [transitions, setTransitions] = React.useState<Transition[]>([]);
  const [topEntries, setTopEntries] = React.useState<{ path: string; count: number }[]>([]);
  const [topExits, setTopExits] = React.useState<{ path: string; count: number }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [days, setDays] = React.useState(7);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      const since = new Date(Date.now() - days * 86400_000).toISOString();

      const { data: rows } = await supabase
        .from('audit_events')
        .select('path, created_at, session_id')
        .eq('event_type', 'pageview')
        .gte('created_at', since)
        .order('session_id', { ascending: true })
        .order('created_at', { ascending: true })
        .limit(5000) as { data: PageviewRow[] | null };

      if (!rows) { setLoading(false); return; }

      // ── Per-page stats ──────────────────────────────────────────────────────
      const viewMap = new Map<string, number>();
      const entranceMap = new Map<string, number>();
      const exitMap = new Map<string, number>();
      const bounceMap = new Map<string, number>();

      // Group by session preserving order
      const bySession = new Map<string, PageviewRow[]>();
      for (const r of rows) {
        if (!bySession.has(r.session_id)) bySession.set(r.session_id, []);
        bySession.get(r.session_id)!.push(r);
      }

      const transMap = new Map<string, number>();

      for (const sessionRows of bySession.values()) {
        // Count views
        for (const r of sessionRows) {
          viewMap.set(r.path, (viewMap.get(r.path) ?? 0) + 1);
        }

        // Entry (first page) + exit (last page)
        const first = sessionRows[0]?.path;
        const last = sessionRows[sessionRows.length - 1]?.path;
        if (!first || !last) continue;
        entranceMap.set(first, (entranceMap.get(first) ?? 0) + 1);
        exitMap.set(last, (exitMap.get(last) ?? 0) + 1);

        // Bounce: single-page session
        if (sessionRows.length === 1) {
          bounceMap.set(first, (bounceMap.get(first) ?? 0) + 1);
        }

        // Transitions: consecutive pages
        for (let i = 0; i < sessionRows.length - 1; i++) {
          const from = sessionRows[i]?.path;
          const to = sessionRows[i + 1]?.path;
          if (!from || !to || from === to) continue;
          const key = `${from}|||${to}`;
          transMap.set(key, (transMap.get(key) ?? 0) + 1);
        }
      }

      const stats: PageStat[] = Array.from(viewMap.entries())
        .map(([path, views]) => ({
          path,
          views,
          entrances: entranceMap.get(path) ?? 0,
          exits: exitMap.get(path) ?? 0,
          bounces: bounceMap.get(path) ?? 0,
        }))
        .sort((a, b) => b.views - a.views);

      const trans: Transition[] = Array.from(transMap.entries())
        .map(([key, count]) => {
          const parts = key.split('|||');
          return { from: parts[0] ?? '', to: parts[1] ?? '', count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

      const entries = Array.from(entranceMap.entries())
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      const exits = Array.from(exitMap.entries())
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      setPageStats(stats);
      setTransitions(trans);
      setTopEntries(entries);
      setTopExits(exits);
      setLoading(false);
    }
    load();
  }, [days]);

  const maxViews = pageStats[0]?.views ?? 1;
  const maxTrans = transitions[0]?.count ?? 1;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="eyebrow mb-1" style={{ color: 'var(--color-green-soft)' }}>Panel de administración</p>
          <h1 className="display" style={{ fontSize: '28px', fontStyle: 'italic' }}>Funnel de páginas</h1>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all"
              style={{
                background: days === d ? 'var(--color-green-deep)' : 'var(--color-surface-2)',
                color: days === d ? 'var(--color-cream)' : 'var(--color-ink-soft)',
                border: '0.5px solid var(--color-rule)',
              }}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : pageStats.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Page views bar chart */}
          <section>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: 'var(--color-ink-soft)' }}>
              Vistas por página
            </h2>
            <div className="space-y-3">
              {pageStats.map(s => (
                <div key={s.path} className="flex items-center gap-4">
                  <div className="text-[12px] font-mono" style={{ width: '160px', flexShrink: 0, color: 'var(--color-ink-soft)' }}>
                    {label(s.path)}
                  </div>
                  <div style={{ flex: 1, position: 'relative', height: '26px' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: 0, top: 0, bottom: 0,
                        width: `${(s.views / maxViews) * 100}%`,
                        background: 'var(--color-green-deep)',
                        opacity: 0.85,
                        minWidth: '4px',
                      }}
                    />
                    <span
                      className="absolute left-2 text-[12px] font-semibold"
                      style={{ color: 'var(--color-cream)', lineHeight: '26px' }}
                    >
                      {s.views}
                    </span>
                  </div>
                  <div className="text-[11px] text-right" style={{ width: '220px', flexShrink: 0, color: 'var(--color-ink-soft)' }}>
                    <span title="Entradas">{s.entrances} entradas</span>
                    {' · '}
                    <span title="Salidas">{s.exits} salidas</span>
                    {s.bounces > 0 && (
                      <> · <span title="Rebotes" style={{ color: 'var(--color-warning)' }}>{s.bounces} rebotes</span></>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Entry & exit pages side by side */}
          <div className="grid grid-cols-2 gap-6">
            <section style={{ border: '0.5px solid var(--color-rule)', padding: '20px' }}>
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: 'var(--color-ink-soft)' }}>
                Páginas de entrada
              </h2>
              <div className="space-y-2">
                {topEntries.map(e => (
                  <div key={e.path} className="flex justify-between items-center text-[13px]">
                    <span style={{ color: 'var(--color-ink)' }}>{label(e.path)}</span>
                    <span className="font-semibold" style={{ color: 'var(--color-green-deep)' }}>{e.count}</span>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ border: '0.5px solid var(--color-rule)', padding: '20px' }}>
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: 'var(--color-ink-soft)' }}>
                Páginas de salida
              </h2>
              <div className="space-y-2">
                {topExits.map(e => (
                  <div key={e.path} className="flex justify-between items-center text-[13px]">
                    <span style={{ color: 'var(--color-ink)' }}>{label(e.path)}</span>
                    <span className="font-semibold" style={{ color: 'var(--color-warning)' }}>{e.count}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Transition flow */}
          <section>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: 'var(--color-ink-soft)' }}>
              Flujo entre páginas (top {transitions.length} transiciones)
            </h2>
            <div style={{ border: '0.5px solid var(--color-rule)' }}>
              <table className="w-full text-[13px]">
                <thead style={{ background: 'var(--color-surface-2)', borderBottom: '0.5px solid var(--color-rule)' }}>
                  <tr>
                    {['Desde', 'Hacia', 'Viajes', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-[11px] uppercase tracking-[0.1em]"
                        style={{ color: 'var(--color-ink-soft)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transitions.map((t, i) => (
                    <tr key={i} style={{ borderTop: '0.5px solid var(--color-rule)', background: 'var(--color-surface)' }}>
                      <td className="px-4 py-2.5 font-mono text-[12px]" style={{ color: 'var(--color-ink-soft)' }}>
                        {label(t.from)}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[12px]" style={{ color: 'var(--color-ink)' }}>
                        → {label(t.to)}
                      </td>
                      <td className="px-4 py-2.5 font-semibold" style={{ color: 'var(--color-green-deep)' }}>
                        {t.count}
                      </td>
                      <td className="px-4 py-2.5" style={{ width: '200px' }}>
                        <div style={{ height: '6px', background: 'var(--color-surface-2)', borderRadius: '2px' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${(t.count / maxTrans) * 100}%`,
                              background: 'var(--color-green-soft)',
                              borderRadius: '2px',
                              minWidth: '4px',
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-rule)] border-t-[var(--color-green-deep)]" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-20 text-center text-[13px]" style={{ color: 'var(--color-ink-soft)' }}>
      Sin datos de navegación para este período.
    </div>
  );
}
