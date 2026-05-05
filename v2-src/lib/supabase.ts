import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

// Lazy singleton — only created when Supabase env vars are present.
// During static export builds (GitHub Pages), vars are absent and the client is
// never instantiated; all auth components skip gracefully via null checks.
export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase env vars not configured');
  _client = createClient(url, key, { auth: { persistSession: true, storageKey: 'mpv-auth' } });
  return _client;
}

// Convenience proxy — works identically to the direct client but tolerates
// missing env vars by returning no-op queries when supabase isn't configured.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop: string) {
    try {
      const client = getSupabase();
      const val = (client as unknown as Record<string, unknown>)[prop];
      return typeof val === 'function' ? val.bind(client) : val;
    } catch {
      // No-op fallback when env vars aren't set (e.g. static export build)
      if (prop === 'auth') return { getSession: () => Promise.resolve({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) };
      return () => ({ data: null, error: null, select: () => ({}), single: () => ({}) });
    }
  },
});
