'use client';

import * as React from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { plantas } from '@/data';
import { GRUPO_ICON, GRUPO_LABEL } from '@/lib/group-icons';
import { Icons } from '@/lib/icons';
import { SearchBar } from '@/components/ui/search-bar';
import type { Planta, GrupoCuidado, SubrubroPlanta } from '@/types/data';
import { cn } from '@/lib/cn';

const GRUPO_OPCIONES = Array.from(new Set(plantas.map((p) => p.grupo))).sort();

const fuse = new Fuse(plantas, {
  keys: [
    { name: 'nombre', weight: 0.8 },
    { name: 'grupo', weight: 0.2 },
  ],
  threshold: 0.34,
  ignoreLocation: true,
  minMatchCharLength: 2,
});

const PAGE = 60;

export function PlantasExplorer() {
  const [q, setQ] = React.useState('');
  const [grupo, setGrupo] = React.useState<GrupoCuidado | ''>('');
  const [subrubro, setSubrubro] = React.useState<SubrubroPlanta | ''>('');
  const [shown, setShown] = React.useState(PAGE);

  const filtered = React.useMemo<Planta[]>(() => {
    let list: Planta[] = plantas;
    if (q.trim().length >= 2) {
      list = fuse.search(q).map((r) => r.item);
    }
    if (grupo) list = list.filter((p) => p.grupo === grupo);
    if (subrubro) list = list.filter((p) => p.subrubro === subrubro);
    return list;
  }, [q, grupo, subrubro]);

  React.useEffect(() => {
    setShown(PAGE);
  }, [q, grupo, subrubro]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <SearchBar
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onClear={() => setQ('')}
          placeholder="Buscar planta por nombre…"
          aria-label="Buscar planta"
        />
        <select
          value={grupo}
          onChange={(e) => setGrupo(e.target.value as GrupoCuidado | '')}
          className="h-12 rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] px-4 text-[14px] text-[var(--color-ink)] cursor-pointer hover:border-[var(--color-green-soft)] transition-colors"
          aria-label="Filtrar por grupo"
        >
          <option value="">Todos los grupos</option>
          {GRUPO_OPCIONES.map((g) => (
            <option key={g} value={g}>
              {GRUPO_LABEL[g] ?? g}
            </option>
          ))}
        </select>
        <select
          value={subrubro}
          onChange={(e) => setSubrubro(e.target.value as SubrubroPlanta | '')}
          className="h-12 rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] px-4 text-[14px] text-[var(--color-ink)] cursor-pointer hover:border-[var(--color-green-soft)] transition-colors"
          aria-label="Filtrar por interior o exterior"
        >
          <option value="">Interior y exterior</option>
          <option value="PLANTAS DE INTERIOR">Solo interior</option>
          <option value="PLANTAS DE EXTERIOR">Solo exterior</option>
        </select>
      </div>

      {/* Count */}
      <p className="text-[13px] text-[var(--color-ink-soft)]">
        <span className="font-semibold text-[var(--color-ink)]">{filtered.length}</span> de{' '}
        {plantas.length} plantas
      </p>

      {/* Grid */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.slice(0, shown).map((p) => (
          <li key={p.id}>
            <PlantaCardItem planta={p} />
          </li>
        ))}
      </ul>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface-2)] px-8 py-12 text-center">
          <Icons.sprout
            aria-hidden
            className="mx-auto mb-3 h-8 w-8 text-[var(--color-green-soft)]"
            strokeWidth={1.25}
          />
          <p className="text-[15px] text-[var(--color-ink-soft)]">
            Sin resultados con esos filtros.
          </p>
        </div>
      ) : null}

      {/* Load more */}
      {shown < filtered.length ? (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setShown((s) => s + PAGE)}
            className="h-12 rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] px-8 text-[14px] font-medium text-[var(--color-ink)] hover:border-[var(--color-green-deep)] hover:shadow-[var(--shadow-soft)] transition-all"
          >
            Cargar más ({filtered.length - shown})
          </button>
        </div>
      ) : null}
    </div>
  );
}

function PlantaCardItem({ planta }: { planta: Planta }) {
  const Icon = Icons[GRUPO_ICON[planta.grupo]];
  return (
    <Link
      href={`/plantas/${planta.id}`}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] transition-all',
        'hover:border-[var(--color-green-deep)] hover:shadow-[var(--shadow-card)]'
      )}
    >
      {/* Photo / placeholder */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: '200px',
          background: planta.fotoUrl ? undefined : planta.fotoPlaceholder,
        }}
      >
        {planta.fotoUrl ? (
          <img
            src={`/MPV/v2/${planta.fotoUrl}`}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon
              aria-hidden
              className="h-14 w-14 opacity-40"
              strokeWidth={1}
              style={{ color: 'var(--color-cream)' }}
            />
          </div>
        )}
        {/* Interior/exterior badge */}
        <span className="absolute left-3 top-3 rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.07em] text-white backdrop-blur-sm">
          {planta.subrubro === 'PLANTAS DE INTERIOR' ? 'Interior' : 'Exterior'}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[15px] font-semibold leading-snug text-[var(--color-ink)] line-clamp-2">
          {planta.nombre}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-ink-soft)]">
          {GRUPO_LABEL[planta.grupo] ?? planta.grupo}
        </span>
        <div className="mt-auto flex items-center justify-between text-[12px] text-[var(--color-ink-soft)] pt-2 border-t border-[var(--color-rule)]">
          <span>SKU {planta.sku}</span>
          <span>
            <span className="font-semibold text-[var(--color-ink)]">{planta.total}</span> en stock
          </span>
        </div>
      </div>
    </Link>
  );
}
