import Link from 'next/link';
import { Icons } from '@/lib/icons';

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div className="space-y-4">
        <Icons.sprout aria-hidden className="mx-auto h-12 w-12 text-[var(--color-green-deep)]" strokeWidth={1.25} />
        <h1 className="serif text-[40px] leading-tight tracking-tight">Página no encontrada</h1>
        <p className="mx-auto max-w-prose text-[var(--color-ink-soft)]">
          Esa ruta no existe en el manual. Vuelve al inicio o usa la búsqueda global con <kbd>⌘K</kbd>.
        </p>
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 border border-[var(--color-green-deep)] px-5 text-[13px] font-medium tracking-wide text-[var(--color-green-deep)] transition-colors hover:bg-[var(--color-green-deep)] hover:text-[var(--color-cream)]"
        >
          <Icons.home aria-hidden className="h-4 w-4" strokeWidth={1.75} />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
