'use client';

import * as React from 'react';
import Fuse from 'fuse.js';
import { tiendas, ZONA_LABELS, TIPO_TIENDA_LABELS } from '@/data';
import { SearchBar } from '@/components/ui/search-bar';
import { StoreCard } from '@/components/ui/store-card';
import { useMiTienda } from '@/hooks/use-mi-tienda';
import { Icons } from '@/lib/icons';
import { zonaIcon, type ZonaClimaticaKey } from '@/lib/icons';
import type { Tienda, ZonaClimatica } from '@/types/data';
import Link from 'next/link';

const fuse = new Fuse(tiendas, {
  keys: ['nombre'],
  threshold: 0.34,
  ignoreLocation: true,
  minMatchCharLength: 2,
});

export function TiendaExplorer() {
  const [q, setQ] = React.useState('');
  const [zona, setZona] = React.useState<ZonaClimatica | ''>('');
  const { tiendaId, hydrated } = useMiTienda();

  const filtered = React.useMemo<Tienda[]>(() => {
    let list: Tienda[] = tiendas;
    if (q.trim().length >= 2) list = fuse.search(q).map((r) => r.item);
    if (zona) list = list.filter((t) => t.zona === zona);
    return [...list].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }, [q, zona]);

  const fija = hydrated && tiendaId ? tiendas.find((t) => t.id === tiendaId) : null;

  return (
    <div className="space-y-5">
      {fija ? (
        <Link
          href={`/mi-tienda/${fija.id}`}
          className="flex items-center gap-3 rounded-xl border border-[var(--color-green-soft)] bg-[var(--color-surface-2)] p-4 text-[var(--color-ink)] transition-colors hover:border-[var(--color-green-deep)]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--color-green-deep)] text-[var(--color-cream)]">
            <Icons.store aria-hidden className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div className="flex flex-col">
            <span className="eyebrow text-[var(--color-green-deep)]">Tu tienda guardada</span>
            <span className="serif text-[18px] leading-tight">{fija.nombre}</span>
            <span className="text-[13px] text-[var(--color-ink-soft)]">
              {ZONA_LABELS[fija.zona]} · {TIPO_TIENDA_LABELS[fija.tipo]}
            </span>
          </div>
          <Icons.chevronRight aria-hidden className="ml-auto h-5 w-5 text-[var(--color-ink-soft)]" strokeWidth={1.75} />
        </Link>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <SearchBar
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onClear={() => setQ('')}
          placeholder="Buscar tienda…"
          aria-label="Buscar tienda"
        />
        <select
          value={zona}
          onChange={(e) => setZona(e.target.value as ZonaClimatica | '')}
          className="h-12 rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 text-[15px]"
          aria-label="Filtrar por clima"
        >
          <option value="">Todos los climas</option>
          {(Object.keys(ZONA_LABELS) as ZonaClimatica[]).map((z) => (
            <option key={z} value={z}>
              {ZONA_LABELS[z]}
            </option>
          ))}
        </select>
      </div>

      <p className="text-[13px] text-[var(--color-ink-soft)]">
        {filtered.length} tiendas
      </p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {filtered.map((t) => (
          <li key={t.id}>
            <StoreCard
              id={t.id}
              nombre={t.nombre}
              zonaLabel={ZONA_LABELS[t.zona]}
              zonaIcon={zonaIcon[t.zona as ZonaClimaticaKey]}
              tipoLabel={TIPO_TIENDA_LABELS[t.tipo]}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
