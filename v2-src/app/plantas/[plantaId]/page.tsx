import Link from 'next/link';
import { notFound } from 'next/navigation';
import { plantas, plantasById, cuidadosByGrupo, tiendasById, ZONA_LABELS, catalog } from '@/data';

function capitalize(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
import { GRUPO_ICON, GRUPO_LABEL } from '@/lib/group-icons';
import { Icons } from '@/lib/icons';
import { Alert } from '@/components/ui/alert';
import { ZONAS_ORDEN } from '@/types/data';
import { ShareButton } from '@/components/share-button';
import { getPlantVideo } from '@/lib/plant-video-map';
import { PlantVideo } from '@/components/plant-video';

export function generateStaticParams() {
  const skuIds = plantas.map((p) => ({ plantaId: p.id }));
  const catalogIds = catalog.map((c) => ({ plantaId: c.id }));
  const seen = new Set(skuIds.map((x) => x.plantaId));
  const uniqueCatalogIds = catalogIds.filter((x) => !seen.has(x.plantaId));
  return [...skuIds, ...uniqueCatalogIds];
}

interface PageProps {
  params: Promise<{ plantaId: string }>;
}

export default async function PlantaDetailPage({ params }: PageProps) {
  const { plantaId } = await params;
  const planta = plantasById[plantaId];
  const catalogEntry = !planta ? catalog.find((c) => c.id === plantaId) : null;
  if (!planta && !catalogEntry) notFound();

  const displayNombre    = planta?.nombre ?? catalogEntry?.nombre ?? '';
  const displayGrupo     = planta?.grupo ?? catalogEntry?.grupo ?? 'ARBUSTIVA FOLLAJE';
  const displaySubrubro  = planta?.subrubro ?? catalogEntry?.subrubro ?? 'PLANTAS DE EXTERIOR';
  const displayFotoUrl   = planta?.fotoUrl ?? catalogEntry?.fotoUrl ?? null;
  const displayPlaceholder = planta?.fotoPlaceholder ?? catalogEntry?.fotoPlaceholder ?? 'hsl(80 22% 90%)';

  const cuidado = cuidadosByGrupo[displayGrupo as keyof typeof cuidadosByGrupo] ?? null;
  const Icon = Icons[GRUPO_ICON[displayGrupo as keyof typeof GRUPO_ICON] ?? 'sprout'];
  const videoFile = getPlantVideo(displayFotoUrl ?? undefined);

  const stockOrdenado = planta
    ? Object.entries(planta.stockPorTienda)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({ tienda: tiendasById[id], qty }))
        .filter((x) => !!x.tienda)
        .sort((a, b) => b.qty - a.qty)
    : [];

  const relacionadas = catalog
    .filter((c) => c.grupo === displayGrupo && c.id !== plantaId && c.fotoUrl)
    .slice(0, 4);

  return (
    <div>
      {/* ── Back ────────────────────────────────────────── */}
      <Link
        href="/plantas"
        className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--color-ink)]"
        style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-ink-soft)', marginBottom: '3rem', display: 'inline-flex' }}
      >
        <Icons.chevronLeft aria-hidden className="h-4 w-4" strokeWidth={2} />
        Catálogo
      </Link>

      {/* ══════════════════════════════════════════════════
          EDITORIAL HERO — magazine spread layout
      ══════════════════════════════════════════════════ */}
      <header
        className="flex flex-col gap-8 md:grid md:gap-16"
        style={{ gridTemplateColumns: 'min(44vw, 460px) 1fr' }}
      >
        {/* ── Visual ──────────────────────────────────── */}
        <div className="grain w-full">
          {videoFile ? (
            <PlantVideo videoFile={videoFile} name={displayNombre} />
          ) : displayFotoUrl ? (
            <div
              className="overflow-hidden w-full"
              style={{
                borderRadius: '18px',
                aspectRatio: '3 / 4',
                boxShadow: '0 32px 80px rgba(24,32,26,0.16), 0 8px 24px rgba(24,32,26,0.08)',
              }}
            >
              <img
                src={`/MPV/v2/${displayFotoUrl}`}
                alt={`Foto de ${displayNombre}`}
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
                style={{ transition: 'transform 1s var(--ease-luxury)' }}
              />
            </div>
          ) : (
            <div
              className="overflow-hidden w-full"
              style={{
                borderRadius: '18px',
                background: displayPlaceholder,
                aspectRatio: '3 / 4',
                boxShadow: '0 32px 80px rgba(24,32,26,0.10)',
              }}
            >
              <div className="grid h-full w-full place-items-center">
                <Icon
                  aria-hidden
                  className="h-28 w-28 opacity-12"
                  strokeWidth={0.5}
                  style={{ color: 'var(--color-ink)' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Identity ────────────────────────────────── */}
        <div className="flex flex-col justify-center py-4 md:py-4">
          {/* Grupo eyebrow */}
          <p className="eyebrow mb-6" style={{ color: 'var(--color-green-soft)' }}>
            {GRUPO_LABEL[displayGrupo as keyof typeof GRUPO_LABEL] ?? displayGrupo}
          </p>

          {/* Plant name — display scale */}
          <h1
            className="display text-[var(--color-ink)]"
            style={{
              fontSize: 'clamp(40px, 5.2vw, 88px)',
              overflowWrap: 'break-word',
              lineHeight: 0.88,
              fontStyle: 'italic',
            }}
          >
            {capitalize(displayNombre)}
          </h1>

          {/* Interior / Exterior — italic serif */}
          <p
            className="serif-italic mt-4"
            style={{ fontSize: 'clamp(16px, 1.6vw, 22px)', color: 'var(--color-ink-soft)' }}
          >
            {displaySubrubro === 'PLANTAS DE INTERIOR' ? 'Planta de interior' : 'Planta de exterior'}
          </p>

          {/* SKU metadata — plain text */}
          {planta ? (
            <p style={{ marginTop: '2rem', fontSize: '13px', color: 'var(--color-ink-soft)' }}>
              SKU {planta.sku}
              <span style={{ margin: '0 0.6em', opacity: 0.35 }}>·</span>
              <span style={{ color: 'var(--color-green-deep)', fontWeight: 500 }}>{planta.total} uds. en red</span>
            </p>
          ) : null}

          {/* Hairline rule */}
          <div className="mt-10" style={{ height: '0.5px', background: 'var(--color-rule)' }} />

          {/* Share */}
          <div className="mt-8">
            <ShareButton title={displayNombre} />
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          CONTENT — generous spacing
      ══════════════════════════════════════════════════ */}
      <div style={{ marginTop: '5rem' }} className="space-y-16">

        {/* ── Cuidados del grupo ── */}
        {cuidado ? (
          <>
            <section>
              <SectionEyebrow>Cuidados del grupo</SectionEyebrow>
              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard label="Luz" value={cuidado.luz} />
                <InfoCard label="Riego" value={cuidado.riego} />
                <div
                  className="p-6 md:col-span-2"
                  style={{ border: '0.5px solid var(--color-rule)', background: 'var(--color-surface)' }}
                >
                  <p className="eyebrow mb-3" style={{ color: 'var(--color-green-deep)' }}>Estructura recomendada</p>
                  <p className="leading-relaxed" style={{ fontSize: '15px' }}>{cuidado.estructura}</p>
                </div>
              </div>
            </section>

            {/* ── Frecuencia de riego ── */}
            <section>
              <SectionEyebrow>Frecuencia de riego por zona climática</SectionEyebrow>
              <div className="overflow-hidden" style={{ border: '0.5px solid var(--color-rule)' }}>
                <table className="w-full border-collapse" style={{ fontSize: '14px' }}>
                  <thead style={{ background: 'var(--color-surface-2)' }}>
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Zona</th>
                      <th className="px-6 py-4 text-left font-semibold">Frecuencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ZONAS_ORDEN.map((z) => (
                      <tr key={z} style={{ borderTop: '0.5px solid var(--color-rule)' }}>
                        <td className="px-6 py-4">{ZONA_LABELS[z]}</td>
                        <td className="px-6 py-4" style={{ color: 'var(--color-ink-soft)' }}>
                          {cuidado.frecuenciaPorZona[z]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── Tips ── */}
            <section>
              <SectionEyebrow>Tips para esta familia</SectionEyebrow>
              <ul style={{ borderTop: '0.5px solid var(--color-rule)' }}>
                {cuidado.tips.map((t, i) => (
                  <li
                    key={i}
                    className="flex gap-5 py-5"
                    style={{ borderBottom: '0.5px solid var(--color-rule)' }}
                  >
                    <span
                      aria-hidden
                      style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px', color: 'var(--color-warning)', opacity: 0.8 }}
                    >
                      —
                    </span>
                    <p className="leading-relaxed" style={{ fontSize: '15px' }}>{t}</p>
                  </li>
                ))}
              </ul>
            </section>

            <Alert variant="warning" title="Señal a vigilar">
              {cuidado.alerta}
            </Alert>
          </>
        ) : null}

        {/* ── Stock por tienda ── */}
        {stockOrdenado.length > 0 ? (
          <section>
            <SectionEyebrow>Stock por tienda</SectionEyebrow>
            <div className="grid gap-2.5 md:grid-cols-2">
              {stockOrdenado.map(({ tienda, qty }) =>
                tienda ? (
                  <Link
                    key={tienda.id}
                    href={`/mi-tienda/${tienda.id}`}
                    className="flex items-center justify-between px-0 py-4 transition-all"
                    style={{
                      borderBottom: '0.5px solid var(--color-rule)',
                      fontSize: '14px',
                    }}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icons.store
                        aria-hidden
                        className="h-4 w-4"
                        strokeWidth={1.75}
                        style={{ color: 'var(--color-green-deep)' }}
                      />
                      {tienda.nombre}
                    </span>
                    <span className="font-semibold">{qty}</span>
                  </Link>
                ) : null
              )}
            </div>
          </section>
        ) : null}

        {/* ── Otras plantas del mismo grupo ── */}
        {relacionadas.length > 0 && (
          <section>
            <SectionEyebrow>Del mismo grupo</SectionEyebrow>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {relacionadas.map((r) => (
                <Link
                  key={r.id}
                  href={`/plantas/${r.id}`}
                  className="grain group overflow-hidden rounded-xl"
                  style={{
                    aspectRatio: '3/4',
                    display: 'block',
                    position: 'relative',
                    boxShadow: '0 4px 16px rgba(24,32,26,0.08)',
                    transition: 'transform 0.7s var(--ease-luxury), box-shadow 0.7s var(--ease-luxury)',
                  }}
                >
                  <img
                    src={`/MPV/v2/${r.fotoUrl}`}
                    alt={r.nombre}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ transition: 'transform 0.85s var(--ease-luxury)' }}
                  />
                  <div
                    className="group-hover:scale-[1.06]"
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <p
                    className="absolute bottom-0 left-0 right-0 p-3.5 text-white"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontSize: '15px',
                      lineHeight: 1.2,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {r.nombre.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

/* ── Section header ── */
function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="eyebrow" style={{ color: 'var(--color-green-soft)' }}>{children}</span>
      <div style={{ flex: 1, height: '0.5px', background: 'var(--color-rule)' }} />
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="p-6"
      style={{ border: '0.5px solid var(--color-rule)' }}
    >
      <p className="eyebrow mb-3" style={{ color: 'var(--color-green-deep)' }}>{label}</p>
      <p className="leading-relaxed" style={{ fontSize: '15px' }}>{value}</p>
    </div>
  );
}
