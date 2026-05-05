'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';

const HEARTBEAT_MS = 30_000;
const HEATMAP_THROTTLE_MS = 300;
const SESSION_KEY = 'mpv-audit-session';

function getSessionId() { return sessionStorage.getItem(SESSION_KEY); }
function setSessionId(id: string) { sessionStorage.setItem(SESSION_KEY, id); }

// ── Main tracker ──────────────────────────────────────────────────────────────
export function AuditTracker() {
  const { user } = useAuth();
  const pathname = usePathname();
  // All refs declared before any conditional return (rules of hooks)
  const sessionRef = React.useRef<string | null>(null);
  const startRef = React.useRef<number>(Date.now());
  const pageCountRef = React.useRef(0);
  const heatmapBuffer = React.useRef<Array<{ x: number; y: number; path: string }>>([]);
  const lastHeatmap = React.useRef(0);
  const heartbeatRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const isLogin = pathname.startsWith('/login');

  // ── Create or resume session ─────────────────────────────────────────────
  React.useEffect(() => {
    if (!user || isLogin) return;
    const existing = getSessionId();
    if (existing) { sessionRef.current = existing; return; }
    async function createSession() {
      const { data, error } = await supabase
        .from('audit_sessions')
        .insert({ user_id: user!.id, user_email: user!.email ?? '', user_agent: navigator.userAgent })
        .select('id')
        .single();
      if (!error && data) {
        sessionRef.current = data.id;
        setSessionId(data.id);
        startRef.current = Date.now();
      }
    }
    createSession();
  }, [user, isLogin]);

  // ── Heartbeat ────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!user || isLogin) return;
    heartbeatRef.current = setInterval(async () => {
      const sid = sessionRef.current;
      if (!sid) return;
      await supabase.from('audit_sessions')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', sid);
    }, HEARTBEAT_MS);
    return () => { if (heartbeatRef.current) clearInterval(heartbeatRef.current); };
  }, [user, isLogin]);

  // ── Close session on tab leave / close ──────────────────────────────────
  React.useEffect(() => {
    if (!user || isLogin) return;
    async function closeSession() {
      const sid = sessionRef.current;
      if (!sid) return;
      const duration = Math.round((Date.now() - startRef.current) / 1000);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      const headers = {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${token}`,
        'Prefer': 'return=minimal',
      };
      const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1`;
      if (heatmapBuffer.current.length > 0) {
        const points = heatmapBuffer.current.map(p => ({
          session_id: sid, user_id: user!.id, path: p.path, x: p.x, y: p.y,
        }));
        heatmapBuffer.current = [];
        fetch(`${base}/heatmap_points`, { method: 'POST', headers, body: JSON.stringify(points), keepalive: true }).catch(() => {});
      }
      fetch(`${base}/audit_sessions?id=eq.${sid}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ ended_at: new Date().toISOString(), duration_seconds: duration, page_count: pageCountRef.current }),
        keepalive: true,
      }).catch(() => {});
      sessionStorage.removeItem(SESSION_KEY);
    }
    window.addEventListener('pagehide', closeSession);
    const onVisibility = () => { if (document.visibilityState === 'hidden') closeSession(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', closeSession);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [user, isLogin]);

  // ── Track pageview on route change ──────────────────────────────────────
  React.useEffect(() => {
    if (!user || isLogin) return;
    const sid = sessionRef.current ?? getSessionId();
    if (!sid) return;
    pageCountRef.current += 1;
    supabase.from('audit_events').insert({ session_id: sid, user_id: user.id, event_type: 'pageview', path: pathname });
  }, [pathname, user, isLogin]);

  // ── Heatmap click capture ────────────────────────────────────────────────
  React.useEffect(() => {
    if (!user || isLogin) return;
    function onPointer(e: PointerEvent) {
      const now = Date.now();
      if (now - lastHeatmap.current < HEATMAP_THROTTLE_MS) return;
      lastHeatmap.current = now;
      const xNorm = e.clientX / window.innerWidth;
      const yNorm = (e.clientY + window.scrollY) / Math.max(document.body.scrollHeight, window.innerHeight);
      heatmapBuffer.current.push({
        x: Math.min(1, Math.max(0, xNorm)),
        y: Math.min(1, Math.max(0, yNorm)),
        path: pathname,
      });
      if (heatmapBuffer.current.length >= 20) {
        const sid = sessionRef.current ?? getSessionId();
        if (!sid) { heatmapBuffer.current = []; return; }
        const userId = user?.id;
        if (!userId) { heatmapBuffer.current = []; return; }
        const points = heatmapBuffer.current.map(p => ({
          session_id: sid, user_id: userId, path: p.path, x: p.x, y: p.y,
        }));
        heatmapBuffer.current = [];
        supabase.from('heatmap_points').insert(points);
      }
    }
    window.addEventListener('pointerdown', onPointer);
    return () => window.removeEventListener('pointerdown', onPointer);
  }, [user, pathname, isLogin]);

  return null;
}
