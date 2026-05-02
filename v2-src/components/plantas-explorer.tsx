'use client';

import * as React from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { catalog } from '@/data';
import type { CatalogPlant } from '@/data';
import { SearchBar } from '@/components/ui/search-bar';
import { Icons } from '@/lib/icons';
import { cn } from '@/lib/cn';
import { getPlantVideoBySlug } from '@/lib/plant-video-map';

// ── Helpers ──────────────────────────────────────────────────────────────────
function capitalize(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Fuse setup ───────────────────────────────────────────────────────────────
const fuse = new Fuse(catalog, {
  keys: [
    { name: 'nombre', weight: 0.8 },
    { name: 'grupo', weight: 0.2 },
  ],
  threshold: 0.34,
  ignoreLocation: true,
  minMatchCharLength: 2,
});

const PAGE = 80;

// ── Component ─────────────────────────────────────────────────────────────────
export function PlantasExplorer() {
  const [q, setQ] = React.useState('');
  const [subrubro, setSubrubro] = React.useState('');
  const [shown, setShown] = React.useState(PAGE);

  const filtered = React.useMemo<CatalogPlant[]>(() => {
    let list: CatalogPlant[] = catalog;
    if (q.trim().length >= 2) {
      list = fuse.search(q).map((r) => r.item);
    }
    if (subrubro) list = list.filter((p) => p.subrubro === subrubro);
    return list;
  }, [q, subrubro]);

  React.useEffect(() => {
    setShown(PAGE);
  }, [q, subrubro]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <SearchBar
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onClear={() => setQ('')}
          placeholder="Buscar planta por nombre…"
          aria-label="Buscar planta"
        />
        <select
          value={subrubro}
          onChange={(e) => setSubrubro(e.target.value)}
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
        {catalog.length} plantas
      </p>

      {/* Grid */}
      <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.slice(0, shown).map((p) => (
          <li key={p.id}>
            <LuxuryPlantCard plant={p} />
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

// ── Card video (plays when visible) ──────────────────────────────────────────
function CardVideo({ videoFile }: { videoFile: string }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.2 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      muted loop playsInline preload="none"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    >
      <source src={`/MPV/v2/videos/${videoFile}.mp4`} type="video/mp4" />
    </video>
  );
}

// ── Card overlay (shared between image and video cards) ───────────────────────
function CardOverlay({ label, nombre }: { label: string; nombre: string }) {
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.22) 45%, transparent 68%)',
      }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
        <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.50)', marginBottom: '4px', fontSize: '10px' }}>
          {label}
        </p>
        <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'white', fontSize: '18px', lineHeight: 1.25, fontWeight: 400 }}>
          {capitalize(nombre)}
        </p>
      </div>
    </>
  );
}

// ── Luxury portrait card ──────────────────────────────────────────────────────
function LuxuryPlantCard({ plant }: { plant: CatalogPlant }) {
  const label = plant.subrubro === 'PLANTAS DE INTERIOR' ? 'Interior' : 'Exterior';
  const videoFile = getPlantVideoBySlug(plant.folderSlug);

  return (
    <Link
      href={`/plantas/${plant.id}`}
      className={cn('group block overflow-hidden rounded-xl transition-transform duration-300 hover:scale-[1.02]')}
      style={{ aspectRatio: '3/4', display: 'block', position: 'relative' }}
    >
      {videoFile ? (
        /* ── Video card ── */
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
          <CardVideo videoFile={videoFile} />
          <CardOverlay label={label} nombre={plant.nombre} />
        </div>
      ) : plant.fotoUrl ? (
        /* ── Photo card ── */
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
          <img
            src={`/MPV/v2/${plant.fotoUrl}`}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            className="group-hover:scale-105"
          />
          <CardOverlay label={label} nombre={plant.nombre} />
        </div>
      ) : (
        /* ── Placeholder card ── */
        <div style={{ background: plant.fotoPlaceholder, height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <p aria-hidden style={{ fontFamily: 'var(--font-display)', fontSize: '96px', opacity: 0.08, lineHeight: 1, color: 'var(--color-ink)', position: 'absolute', top: '12px', left: '16px', userSelect: 'none' }}>
            {plant.nombre[0]}
          </p>
          <p className="eyebrow" style={{ color: 'var(--color-ink-soft)', marginBottom: '4px', fontSize: '10px' }}>{label}</p>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '18px', lineHeight: 1.25, fontWeight: 400, color: 'var(--color-ink)' }}>
            {capitalize(plant.nombre)}
          </p>
        </div>
      )}
    </Link>
  );
}
