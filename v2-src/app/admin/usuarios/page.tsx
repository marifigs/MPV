'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import type { Profile } from '@/types/supabase';

export default function UsuariosPage() {
  const { session } = useAuth();
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ full_name: '', email: '', password: '', role: 'vendor', store: '' });
  const [creating, setCreating] = React.useState(false);
  const [formError, setFormError] = React.useState('');

  async function loadProfiles() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setProfiles(data ?? []);
    setLoading(false);
  }

  React.useEffect(() => { loadProfiles(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setFormError('');
    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        caller_token: session?.access_token,
      }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      setFormError(data.error ?? 'Error al crear usuario');
    } else {
      setShowForm(false);
      setForm({ full_name: '', email: '', password: '', role: 'vendor', store: '' });
      loadProfiles();
    }
  }

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
        <button
          onClick={() => setShowForm(v => !v)}
          className="px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] transition-all"
          style={{
            background: 'var(--color-green-deep)',
            color: 'var(--color-cream)',
            borderRadius: '2px',
          }}
        >
          {showForm ? 'Cancelar' : '+ Crear usuario'}
        </button>
      </div>

      {/* Create user form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 space-y-4"
          style={{ border: '0.5px solid var(--color-green-deep)', background: 'var(--color-surface)' }}
        >
          <p className="eyebrow" style={{ color: 'var(--color-green-deep)' }}>Nuevo usuario</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre completo">
              <input
                required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                className="input-base" placeholder="María González"
              />
            </Field>
            <Field label="Correo electrónico">
              <input
                type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-base" placeholder="maria@easy.cl"
              />
            </Field>
            <Field label="Contraseña inicial">
              <input
                type="password" required minLength={8} value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input-base" placeholder="Mínimo 8 caracteres"
              />
            </Field>
            <Field label="Tienda (opcional)">
              <input
                value={form.store} onChange={e => setForm(f => ({ ...f, store: e.target.value }))}
                className="input-base" placeholder="Easy Maipú"
              />
            </Field>
            <Field label="Rol">
              <select
                value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="input-base"
              >
                <option value="vendor">Vendedor</option>
                <option value="admin">Administrador</option>
              </select>
            </Field>
          </div>
          {formError && <p className="text-[13px]" style={{ color: 'var(--color-warning)' }}>{formError}</p>}
          <button
            type="submit" disabled={creating}
            className="px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.1em]"
            style={{ background: 'var(--color-ink)', color: 'var(--color-cream)', borderRadius: '2px' }}
          >
            {creating ? 'Creando…' : 'Crear usuario'}
          </button>
        </form>
      )}

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
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-ink)' }}>
                  {p.full_name ?? '—'}
                </td>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block mb-1.5 text-[11px] font-medium uppercase tracking-[0.12em]"
        style={{ color: 'var(--color-ink-soft)' }}>
        {label}
      </label>
      {children}
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
