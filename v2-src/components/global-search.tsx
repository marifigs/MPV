'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { Icons } from '@/lib/icons';
import { plantas, tiendas, zonas, ZONA_LABELS } from '@/data';
import { cn } from '@/lib/cn';

type Hit =
  | { kind: 'planta'; id: string; nombre: string; meta: string }
  | { kind: 'tienda'; id: string; nombre: string; meta: string }
  | { kind: 'clima'; id: string; nombre: string; meta: string };

const HITS: Hit[] = [
  ...plantas.map<Hit>((p) => ({
    kind: 'planta',
    id: p.id,
    nombre: p.nombre,
    meta: p.grupo,
  })),
  ...tiendas.map<Hit>((t) => ({
    kind: 'tienda',
    id: t.id,
    nombre: t.nombre,
    meta: ZONA_LABELS[t.zona],
  })),
  ...zonas.map<Hit>((z) => ({
    kind: 'clima',
    id: z.id,
    nombre: z.titulo,
    meta: z.riegoGeneral,
  })),
];

const fuse = new Fuse(HITS, {
  keys: [
    { name: 'nombre', weight: 0.7 },
    { name: 'meta', weight: 0.3 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
});

const KIND_LABEL = {
  planta: 'Planta',
  tienda: 'Tienda',
  clima: 'Clima',
} as const;

export function GlobalSearchTrigger() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIdx, setActiveIdx] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      setQuery('');
      setActiveIdx(0);
    }
  }, [open]);

  const results = React.useMemo(() => {
    if (query.trim().length < 2) return [] as Hit[];
    return fuse.search(query).slice(0, 30).map((r) => r.item);
  }, [query]);

  const grouped = React.useMemo(() => {
    const g: Record<Hit['kind'], Hit[]> = { planta: [], tienda: [], clima: [] };
    for (const r of results) g[r.kind].push(r);
    return g;
  }, [results]);

  const flatList = React.useMemo<Hit[]>(
    () => [...grouped.planta, ...grouped.tienda, ...grouped.clima],
    [grouped]
  );

  function go(hit: Hit) {
    const path =
      hit.kind === 'planta'
        ? `/plantas/${hit.id}`
        : hit.kind === 'tienda'
          ? `/mi-tienda/${hit.id}`
          : `/climas/${hit.id}`;
    setOpen(false);
    router.push(path);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(flatList.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = flatList[activeIdx];
      if (hit) go(hit);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir búsqueda global (Cmd+K)"
        className="flex items-center gap-2 rounded-full border border-[var(--color-rule)] bg-[var(--color-surface-2)] px-3 py-2 text-[13px] text-[var(--color-ink-soft)] hover:border-[var(--color-green-soft)] hover:bg-[var(--color-surface)]"
      >
        <Icons.search aria-hidden className="h-4 w-4" strokeWidth={1.75} />
        <span>Buscar</span>
        <kbd className="hidden rounded bg-[var(--color-surface)] px-1.5 py-0.5 text-[11px] font-medium tracking-wide text-[var(--color-ink-soft)] sm:inline">
          ⌘K
        </kbd>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Búsqueda global"
          className="fixed inset-0 z-50 flex items-start justify-center bg-[rgba(26,31,27,0.45)] p-4 sm:pt-24"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] shadow-[var(--shadow-pop)]">
            <div className="flex items-center gap-3 border-b border-[var(--color-rule)] px-4 py-3">
              <Icons.search aria-hidden className="h-5 w-5 text-[var(--color-ink-soft)]" strokeWidth={1.75} />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Buscar plantas, tiendas o climas…"
                className="flex-1 bg-transparent text-[16px] outline-none placeholder:text-[var(--color-ink-soft)]"
              />
              <kbd className="rounded bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--color-ink-soft)]">
                Esc
              </kbd>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {flatList.length === 0 ? (
                <p className="px-5 py-10 text-center text-[14px] text-[var(--color-ink-soft)]">
                  {query.length < 2
                    ? 'Escribe al menos 2 letras para buscar.'
                    : 'Sin resultados.'}
                </p>
              ) : (
                <div>
                  {(['planta', 'tienda', 'clima'] as const).map((kind) => {
                    const list = grouped[kind];
                    if (list.length === 0) return null;
                    return (
                      <div key={kind} className="px-2 py-2">
                        <p className="px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-ink-soft)]">
                          {KIND_LABEL[kind]}
                        </p>
                        <ul>
                          {list.map((hit) => {
                            const idx = flatList.indexOf(hit);
                            const active = idx === activeIdx;
                            return (
                              <li key={`${hit.kind}-${hit.id}`}>
                                <button
                                  type="button"
                                  onClick={() => go(hit)}
                                  onMouseEnter={() => setActiveIdx(idx)}
                                  className={cn(
                                    'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left',
                                    active
                                      ? 'bg-[var(--color-surface-2)]'
                                      : 'hover:bg-[var(--color-surface-2)]'
                                  )}
                                >
                                  <span className="serif text-[15px] text-[var(--color-ink)]">
                                    {hit.nombre}
                                  </span>
                                  <span className="ml-auto text-[12px] text-[var(--color-ink-soft)]">
                                    {hit.meta}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
