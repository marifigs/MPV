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
    <div className="space-y-5">
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
          className="h-12 rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 text-[15px]"
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
          className="h-12 rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 text-[15px]"
          aria-label="Filtrar por interior o exterior"
        >
          <option value="">Interior y exterior</option>
          <option value="PLANTAS DE INTERIOR">Solo interior</option>
          <option value="PLANTAS DE EXTERIOR">Solo exterior</option>
        </select>
      </div>

      <p className="text-[13px] text-[var(--color-ink-soft)]">
        {filtered.length} de {plantas.length} plantas
      </p>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.slice(0, shown).map((p) => (
          <li key={p.id}>
            <PlantaCardItem planta={p} />
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface-2)] p-6 text-center text-[var(--color-ink-soft)]">
          Sin resultados con esos filtros.
        </p>
      ) : null}

      {shown < filtered.length ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShown((s) => s + PAGE)}
            className="h-12 rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] px-6 text-[15px] font-medium hover:border-[var(--color-green-soft)]"
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
        'group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] transition-colors',
        'hover:border-[var(--color-green-soft)] hover:bg-[var(--color-surface-2)]'
      )}
    >
      <div
        className="relative h-36 w-full"
        style={{ background: planta.fotoUrl ? undefined : planta.fotoPlaceholder }}
      >
        {planta.fotoUrl ? (
          <img
            src={`/MPV/v2/${planta.fotoUrl}`}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-[var(--color-cream)]/80">
            <Icon aria-hidden className="h-12 w-12" strokeWidth={1.25} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="line-clamp-2 text-[15px] font-medium leading-snug">
          {planta.nombre}
        </span>
        <span className="text-[12px] uppercase tracking-[0.06em] text-[var(--color-ink-soft)]">
          {GRUPO_LABEL[planta.grupo] ?? planta.grupo}
        </span>
        <div className="mt-auto flex items-center justify-between text-[12px] text-[var(--color-ink-soft)]">
          <span>
            {planta.subrubro === 'PLANTAS DE INTERIOR' ? 'Interior' : 'Exterior'}
          </span>
          <span>
            <span className="font-medium text-[var(--color-ink)]">{planta.total}</span> stock
          </span>
        </div>
      </div>
    </Link>
  );
}
