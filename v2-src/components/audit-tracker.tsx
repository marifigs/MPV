'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';

// ── Constants ─────────────────────────────────────────────────────────────────
const HEARTBEAT_MS   = 30_000;
const SESSION_KEY    = 'mpv-audit-session';
const SCROLL_MILESTONES = [25, 50, 75, 90, 100];
const RAGE_WINDOW_MS = 500;
const RAGE_MIN_CLICKS = 3;
const RAGE_RADIUS_PX = 30;

function getSessionId() { return sessionStorage.getItem(SESSION_KEY); }
function setSessionId(id: string) { sessionStorage.setItem(SESSION_KEY, id); }

// ── Event sender — fire-and-forget ────────────────────────────────────────────
async function sendEvent(
  sessionId: string,
  userId: string,
  path: string,
  eventType: string,
  metadata?: Record<string, unknown>
) {
  await supabase.from('audit_events').insert({
    session_id: sessionId,
    user_id: userId,
    event_type: eventType,
    path,
    metadata: metadata ?? null,
  });
}

// Keepalive version for pagehide / visibilitychange
async function sendEventKeepalive(
  sessionId: string,
  userId: string,
  path: string,
  eventType: string,
  metadata?: Record<string, unknown>
) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) return;
  fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/audit_events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${token}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify([{ session_id: sessionId, user_id: userId, event_type: eventType, path, metadata: metadata ?? null }]),
    keepalive: true,
  }).catch(() => {});
}

// ── Main tracker ──────────────────────────────────────────────────────────────
export function AuditTracker() {
  const { user } = useAuth();
  const pathname = usePathname();

  // All refs before any conditional — rules of hooks
  const sessionRef      = React.useRef<string | null>(null);
  const startRef        = React.useRef<number>(Date.now());
  const pageCountRef    = React.useRef(0);
  const heartbeatRef    = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // Scroll tracking
  const maxScrollRef    = React.useRef(0);
  const scrollRafRef    = React.useRef<number | null>(null);
  const milestonesFired = React.useRef<Set<number>>(new Set());

  // Heatmap buffer
  const heatmapBuf      = React.useRef<Array<{ x: number; y: number; path: string }>>([]);
  const lastHeatmap     = React.useRef(0);

  // Rage click buffer
  const clickBuf        = React.useRef<Array<{ t: number; x: number; y: number }>>([]);

  // Form abandonment: field name → touched (boolean)
  const touchedFields   = React.useRef<Map<string, boolean>>(new Map());

  const isLogin = pathname.startsWith('/login');

  // ── Helpers ───────────────────────────────────────────────────────────────
  function getSid() { return sessionRef.current ?? getSessionId(); }
  function getUid() { return user?.id ?? ''; }

  // ── Create or resume audit session ───────────────────────────────────────
  React.useEffect(() => {
    if (!user || isLogin) return;
    const existing = getSessionId();
    if (existing) { sessionRef.current = existing; return; }
    (async () => {
      const { data, error } = await supabase
        .from('audit_sessions')
        .insert({ user_id: user.id, user_email: user.email ?? '', user_agent: navigator.userAgent })
        .select('id')
        .single();
      if (!error && data) {
        sessionRef.current = data.id as string;
        setSessionId(data.id as string);
        startRef.current = Date.now();
      }
    })();
  }, [user, isLogin]);

  // ── Heartbeat (online status) ─────────────────────────────────────────────
  React.useEffect(() => {
    if (!user || isLogin) return;
    heartbeatRef.current = setInterval(async () => {
      const sid = getSid();
      if (!sid) return;
      await supabase.from('audit_sessions').update({ last_seen_at: new Date().toISOString() }).eq('id', sid);
    }, HEARTBEAT_MS);
    return () => { if (heartbeatRef.current) clearInterval(heartbeatRef.current); };
  }, [user, isLogin]);

  // ── Session close + scroll exit on tab leave ──────────────────────────────
  React.useEffect(() => {
    if (!user || isLogin) return;

    async function closeSession() {
      const sid = getSid();
      if (!sid) return;
      const duration = Math.round((Date.now() - startRef.current) / 1000);

      // Scroll exit event
      await sendEventKeepalive(sid, getUid(), pathname, 'scroll_exit', {
        scroll_pct: maxScrollRef.current,
        time_on_page_ms: Date.now() - startRef.current,
      });

      // Flush heatmap buffer
      if (heatmapBuf.current.length > 0) {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (token) {
          const points = heatmapBuf.current.map(p => ({ session_id: sid, user_id: getUid(), path: p.path, x: p.x, y: p.y }));
          heatmapBuf.current = [];
          fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/heatmap_points`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 'Authorization': `Bearer ${token}`, 'Prefer': 'return=minimal' },
            body: JSON.stringify(points),
            keepalive: true,
          }).catch(() => {});
        }
      }

      // Form abandonment
      const uid = getUid();
      for (const [fieldName] of touchedFields.current) {
        await sendEventKeepalive(sid, uid, pathname, 'form_field', { field_name: fieldName, field_action: 'abandon' });
      }
      touchedFields.current.clear();

      // Close session record
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/audit_sessions?id=eq.${sid}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 'Authorization': `Bearer ${token}`, 'Prefer': 'return=minimal' },
          body: JSON.stringify({ ended_at: new Date().toISOString(), duration_seconds: duration, page_count: pageCountRef.current }),
          keepalive: true,
        }).catch(() => {});
      }
      sessionStorage.removeItem(SESSION_KEY);
    }

    const onVisibility = () => { if (document.visibilityState === 'hidden') closeSession(); };
    window.addEventListener('pagehide', closeSession);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', closeSession);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [user, isLogin, pathname]);

  // ── Pageview on route change ──────────────────────────────────────────────
  React.useEffect(() => {
    if (!user || isLogin) return;
    const sid = getSid();
    if (!sid) return;
    // Reset per-page state
    maxScrollRef.current = 0;
    milestonesFired.current.clear();
    startRef.current = Date.now();
    pageCountRef.current += 1;
    sendEvent(sid, getUid(), pathname, 'pageview');
  }, [pathname, user, isLogin]);

  // ── Scroll depth tracking ─────────────────────────────────────────────────
  React.useEffect(() => {
    if (!user || isLogin) return;

    function onScroll() {
      if (scrollRafRef.current) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null;
        const scrolled = window.scrollY + window.innerHeight;
        const total = Math.max(document.body.scrollHeight, window.innerHeight);
        const pct = Math.round((scrolled / total) * 100);
        if (pct > maxScrollRef.current) maxScrollRef.current = pct;
        for (const milestone of SCROLL_MILESTONES) {
          if (pct >= milestone && !milestonesFired.current.has(milestone)) {
            milestonesFired.current.add(milestone);
            const sid = getSid();
            if (sid) sendEvent(sid, getUid(), pathname, 'scroll_milestone', {
              milestone,
              scroll_pct: pct,
              time_on_page_ms: Date.now() - startRef.current,
            });
          }
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollRafRef.current) { cancelAnimationFrame(scrollRafRef.current); scrollRafRef.current = null; }
    };
  }, [user, isLogin, pathname]);

  // ── Click heatmap + rage click detection ─────────────────────────────────
  React.useEffect(() => {
    if (!user || isLogin) return;

    function onPointer(e: PointerEvent) {
      const now = Date.now();
      const x = e.clientX;
      const y = e.clientY;
      const xNorm = Math.min(1, Math.max(0, x / window.innerWidth));
      const yNorm = Math.min(1, Math.max(0, (y + window.scrollY) / Math.max(document.body.scrollHeight, window.innerHeight)));

      // Heatmap buffer (throttled)
      if (now - lastHeatmap.current >= 300) {
        lastHeatmap.current = now;
        heatmapBuf.current.push({ x: xNorm, y: yNorm, path: pathname });
        if (heatmapBuf.current.length >= 20) {
          const sid = getSid();
          const uid = user?.id;
          if (sid && uid) {
            const points = heatmapBuf.current.map(p => ({ session_id: sid, user_id: uid, path: p.path, x: p.x, y: p.y }));
            heatmapBuf.current = [];
            supabase.from('heatmap_points').insert(points);
          }
        }
      }

      // Rage click detection
      clickBuf.current.push({ t: now, x, y });
      // Keep only clicks in the last RAGE_WINDOW_MS
      clickBuf.current = clickBuf.current.filter(c => now - c.t <= RAGE_WINDOW_MS);

      if (clickBuf.current.length >= RAGE_MIN_CLICKS) {
        const recent = clickBuf.current;
        const xMin = Math.min(...recent.map(c => c.x));
        const xMax = Math.max(...recent.map(c => c.x));
        const yMin = Math.min(...recent.map(c => c.y));
        const yMax = Math.max(...recent.map(c => c.y));
        const spread = Math.sqrt(Math.pow(xMax - xMin, 2) + Math.pow(yMax - yMin, 2));
        if (spread <= RAGE_RADIUS_PX) {
          const sid = getSid();
          if (sid) {
            const target = e.target as HTMLElement | null;
            sendEvent(sid, getUid(), pathname, 'rage_click', {
              click_x: Math.round(x), click_y: Math.round(y),
              viewport_w: window.innerWidth, viewport_h: window.innerHeight,
              element_tag: target?.tagName?.toLowerCase() ?? '',
              element_text: target?.textContent?.trim().slice(0, 80) ?? '',
              element_id: target?.id ?? '',
            });
          }
          clickBuf.current = []; // reset after rage click
        }
      }
    }

    window.addEventListener('pointerdown', onPointer, { capture: true });
    return () => window.removeEventListener('pointerdown', onPointer, { capture: true });
  }, [user, isLogin, pathname]);

  // ── Form field tracking ───────────────────────────────────────────────────
  React.useEffect(() => {
    if (!user || isLogin) return;

    function onFocusIn(e: FocusEvent) {
      const target = e.target as HTMLElement;
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      const input = target as HTMLInputElement;
      if (input.type === 'password') return;
      const name = input.name || input.id || input.placeholder || target.tagName.toLowerCase();
      if (!touchedFields.current.has(name)) {
        touchedFields.current.set(name, true);
        const sid = getSid();
        if (sid) sendEvent(sid, getUid(), pathname, 'form_field', { field_name: name, field_type: input.type, field_action: 'focus' });
      }
    }

    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, [user, isLogin, pathname]);

  // ── JS error tracking ─────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!user || isLogin) return;

    function onError(e: ErrorEvent) {
      if (!e.message || e.message === 'Script error.') return;
      const sid = getSid();
      if (!sid) return;
      sendEvent(sid, getUid(), pathname, 'js_error', {
        error_message: e.message,
        error_source: e.filename ?? '',
      });
    }

    function onUnhandledRejection(e: PromiseRejectionEvent) {
      const msg = e.reason instanceof Error ? e.reason.message : String(e.reason ?? 'Unhandled rejection');
      if (!msg || msg === 'Script error.') return;
      const sid = getSid();
      if (!sid) return;
      sendEvent(sid, getUid(), pathname, 'js_error', { error_message: msg });
    }

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, [user, isLogin, pathname]);

  return null;
}
