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

const PAGE = 48;

// ── Component ─────────────────────────────────────────────────────────────────
export function PlantasExplorer() {
  const [q, setQ] = React.useState('');
  const [subrubro, setSubrubro] = React.useState('');
  const [shown, setShown] = React.useState(PAGE);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

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

  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setShown(s => s + PAGE); },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onClear={() => setQ('')}
            placeholder="Buscar planta por nombre…"
            aria-label="Buscar planta"
          />
        </div>
        <div className="flex gap-2">
          {[
            { v: '', label: 'Todas' },
            { v: 'PLANTAS DE INTERIOR', label: 'Interior' },
            { v: 'PLANTAS DE EXTERIOR', label: 'Exterior' },
          ].map(({ v, label }) => (
            <button
              key={v}
              type="button"
              onClick={() => setSubrubro(v)}
              className="px-4 py-2 text-[13px] font-medium transition-all"
              style={
                subrubro === v
                  ? { background: 'var(--color-ink)', color: 'var(--color-cream)' }
                  : { border: '0.5px solid var(--color-rule)', background: 'var(--color-surface)', color: 'var(--color-ink-soft)' }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-[13px] text-[var(--color-ink-soft)]">
        <span className="font-semibold text-[var(--color-ink)]">{filtered.length}</span>
        {filtered.length !== catalog.length && ` de ${catalog.length}`} plantas
      </p>

      {/* Grid */}
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-5">
        {filtered.slice(0, shown).map((p, index) => (
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

      {/* Infinite scroll sentinel */}
      {shown < filtered.length && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-rule)] border-t-[var(--color-green-deep)]" />
        </div>
      )}
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
        background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.18) 48%, transparent 70%)',
      }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 20px' }}>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '10px',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.28em',
          color: 'rgba(255,255,255,0.42)',
          marginBottom: '5px',
        }}>
          {label}
        </p>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          color: 'white',
          fontSize: '19px',
          lineHeight: 1.2,
          fontWeight: 400,
          letterSpacing: '-0.01em',
        }}>
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
  const cardRef = React.useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const yRel = (e.clientY - rect.top) / rect.height;
    const yOffset = (yRel - 0.5) * -12;
    const media = cardRef.current?.querySelector('img, video') as HTMLElement | null;
    if (media) {
      media.style.transform = `scale(1.1) translateY(${yOffset}px)`;
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.boxShadow = '0 28px 72px rgba(24,32,26,0.22), 0 8px 24px rgba(24,32,26,0.12)';
    // Only promote to GPU layer on hover — never hold 80+ compositor layers at once
    const media = cardRef.current?.querySelector('img, video') as HTMLElement | null;
    if (media) media.style.willChange = 'transform';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.boxShadow = 'none';
    const media = cardRef.current?.querySelector('img, video') as HTMLElement | null;
    if (media) {
      media.style.transform = '';
      media.style.willChange = 'auto';
    }
  };

  return (
    <Link
      ref={cardRef}
      href={`/plantas/${plant.id}`}
      className="group block overflow-hidden"
      style={{
        aspectRatio: '3/4',
        display: 'block',
        position: 'relative',
        borderRadius: '3px',
        boxShadow: 'none',
        transition: 'box-shadow 0.7s var(--ease-luxury)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s var(--ease-luxury)',
            }}
          />
          <CardOverlay label={label} nombre={plant.nombre} />
        </div>
      ) : (
        /* ── Placeholder card ── */
        <div style={{
          background: plant.fotoPlaceholder,
          height: '100%', width: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '22px', position: 'relative', overflow: 'hidden',
        }}>
          <p aria-hidden style={{
            fontFamily: 'var(--font-display)',
            fontSize: '104px',
            opacity: 0.07,
            lineHeight: 1,
            color: 'var(--color-ink)',
            position: 'absolute',
            top: '10px', left: '16px',
            userSelect: 'none',
            letterSpacing: '-0.04em',
          }}>
            {plant.nombre[0]}
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '10px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.28em',
            color: 'var(--color-ink-soft)',
            marginBottom: '6px',
            opacity: 0.55,
          }}>
            {label}
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '19px', lineHeight: 1.2, fontWeight: 400, color: 'var(--color-ink)' }}>
            {capitalize(plant.nombre)}
          </p>
        </div>
      )}
    </Link>
  );
}
