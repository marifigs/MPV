'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/supabase';

export default function UsuariosPage() {
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function loadProfiles() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setProfiles(data ?? []);
    setLoading(false);
  }

  React.useEffect(() => { loadProfiles(); }, []);

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('profiles').update({ is_active: !current }).eq('id', id);
    setProfiles(p => p.map(u => u.id === id ? { ...u, is_active: !current } : u));
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="eyebrow mb-1" style={{ color: 'var(--color-green-soft)' }}>Panel de administración</p>
          <h1 className="display" style={{ fontSize: '28px', fontStyle: 'italic' }}>Usuarios</h1>
        </div>
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] transition-all"
          style={{ background: 'var(--color-green-deep)', color: 'var(--color-cream)', borderRadius: '2px' }}
        >
          + Crear usuario →
        </a>
      </div>

      {/* Instruction box */}
      <div
        className="p-5 text-[13px] leading-relaxed"
        style={{ border: '0.5px solid var(--color-gold)', background: 'hsl(40 60% 97%)' }}
      >
        <p className="font-semibold mb-1" style={{ color: 'var(--color-gold)' }}>Cómo crear un nuevo usuario</p>
        <ol className="list-decimal list-inside space-y-1" style={{ color: 'var(--color-ink-soft)' }}>
          <li>Ir a <strong>supabase.com/dashboard</strong> → tu proyecto → <strong>Authentication → Users</strong></li>
          <li>Clic en <strong>&ldquo;Add user&rdquo;</strong> → ingresar email y contraseña</li>
          <li>Para dar rol de admin, ejecutar en <strong>SQL Editor</strong>:<br />
            <code className="text-[11px] mt-1 block px-3 py-1.5" style={{ background: 'var(--color-surface-2)', fontFamily: 'monospace' }}>
              UPDATE profiles SET role = &apos;admin&apos; WHERE email = &apos;correo@ejemplo.com&apos;;
            </code>
          </li>
        </ol>
      </div>

      {/* Users table */}
      <div className="overflow-x-auto" style={{ border: '0.5px solid var(--color-rule)' }}>
        <table className="w-full text-[13px]">
          <thead style={{ background: 'var(--color-surface-2)', borderBottom: '0.5px solid var(--color-rule)' }}>
            <tr>
              {['Nombre', 'Correo', 'Rol', 'Tienda', 'Alta', 'Estado'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-[11px] uppercase tracking-[0.1em]"
                  style={{ color: 'var(--color-ink-soft)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {profiles.map(p => (
              <tr key={p.id} style={{ borderTop: '0.5px solid var(--color-rule)', background: 'var(--color-surface)' }}>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-ink)' }}>{p.full_name ?? '—'}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-ink-soft)' }}>{p.email}</td>
                <td className="px-4 py-3">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5"
                    style={{
                      background: p.role === 'admin' ? 'var(--color-green-deep)' : 'var(--color-surface-2)',
                      color: p.role === 'admin' ? 'var(--color-cream)' : 'var(--color-ink-soft)',
                    }}
                  >
                    {p.role === 'admin' ? 'Admin' : 'Vendedor'}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-ink-soft)' }}>{p.store ?? '—'}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-ink-soft)' }}>
                  {new Intl.DateTimeFormat('es-CL', { dateStyle: 'short' }).format(new Date(p.created_at))}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(p.id, p.is_active)}
                    className="text-[11px] font-medium uppercase tracking-[0.1em] px-2.5 py-1 transition-all"
                    style={{
                      border: '0.5px solid var(--color-rule)',
                      color: p.is_active ? 'var(--color-green-deep)' : 'var(--color-warning)',
                      background: 'var(--color-surface)',
                    }}
                  >
                    {p.is_active ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
              </tr>
            ))}
            {profiles.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[13px]" style={{ color: 'var(--color-ink-soft)' }}>
                  Sin usuarios aún
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
