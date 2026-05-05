'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!loading && user) router.replace('/');
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (error) {
      setError('Correo o contraseña incorrectos.');
    } else {
      router.replace('/');
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: 'var(--color-cream)' }}
    >
      <div className="w-full max-w-[380px]">
        {/* Logo / header */}
        <div className="mb-10 text-center">
          <p
            className="eyebrow mb-3"
            style={{ color: 'var(--color-green-soft)', letterSpacing: '0.18em' }}
          >
            Easy Chile · Cencosud
          </p>
          <h1
            className="display"
            style={{
              fontStyle: 'italic',
              fontSize: '32px',
              lineHeight: 1,
              color: 'var(--color-ink)',
            }}
          >
            Manual de<br />Plantas Vivas
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block mb-1.5 text-[12px] font-medium uppercase tracking-[0.12em]"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-[14px] outline-none transition-all"
              style={{
                border: '0.5px solid var(--color-rule)',
                background: 'var(--color-surface)',
                color: 'var(--color-ink)',
                borderRadius: '2px',
              }}
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1.5 text-[12px] font-medium uppercase tracking-[0.12em]"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-[14px] outline-none transition-all"
              style={{
                border: '0.5px solid var(--color-rule)',
                background: 'var(--color-surface)',
                color: 'var(--color-ink)',
                borderRadius: '2px',
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[13px]" style={{ color: 'var(--color-warning)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-[13px] font-semibold uppercase tracking-[0.12em] transition-all"
            style={{
              background: submitting ? 'var(--color-ink-soft)' : 'var(--color-green-deep)',
              color: 'var(--color-cream)',
              borderRadius: '2px',
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p
          className="mt-8 text-center text-[12px]"
          style={{ color: 'var(--color-ink-soft)', opacity: 0.55 }}
        >
          Acceso solo para colaboradores autorizados.<br />
          ¿Sin cuenta? Contacta a tu jefe de área.
        </p>
      </div>
    </div>
  );
}
