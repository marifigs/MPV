import Link from 'next/link';
import { notFound } from 'next/navigation';
import { plantas, plantasById, cuidadosByGrupo, tiendasById, ZONA_LABELS } from '@/data';
import { GRUPO_ICON, GRUPO_LABEL } from '@/lib/group-icons';
import { Icons } from '@/lib/icons';
import { Alert } from '@/components/ui/alert';
import { ZONAS_ORDEN } from '@/types/data';
import { ShareButton } from '@/components/share-button';
import { getPlantVideo } from '@/lib/plant-video-map';
import { PlantVideo } from '@/components/plant-video';

export function generateStaticParams() {
  return plantas.map((p) => ({ plantaId: p.id }));
}

interface PageProps {
  params: Promise<{ plantaId: string }>;
}

export default async function PlantaDetailPage({ params }: PageProps) {
  const { plantaId } = await params;
  const planta = plantasById[plantaId];
  if (!planta) notFound();
  const cuidado = cuidadosByGrupo[planta.grupo];
  const Icon = Icons[GRUPO_ICON[planta.grupo]];

  const videoFile = getPlantVideo(planta.fotoUrl);

  const stockOrdenado = Object.entries(planta.stockPorTienda)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ tienda: tiendasById[id], qty }))
    .filter((x) => !!x.tienda)
    .sort((a, b) => b.qty - a.qty);

  return (
    <div className="space-y-10">
      {/* Back */}
      <Link
        href="/plantas"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
      >
        <Icons.chevronLeft aria-hidden className="h-4 w-4" strokeWidth={2} />
        Catálogo
      </Link>

      {/* Hero header */}
      <header className="grid gap-8 md:grid-cols-[300px_1fr] md:gap-14">

        {/* Visual: video (if available) or photo */}
        {videoFile ? (
          <PlantVideo videoFile={videoFile} name={planta.nombre} />
        ) : planta.fotoUrl ? (
          <div className="overflow-hidden" style={{ borderRadius: '20px', boxShadow: '0 24px 64px rgba(26,31,27,0.14), 0 6px 20px rgba(26,31,27,0.07)', aspectRatio: '3 / 4' }}>
            <img
              src={`/MPV/v2/${planta.fotoUrl}`}
              alt={`Foto de ${planta.nombre}`}
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        ) : (
          <div
            className="overflow-hidden"
            style={{ borderRadius: '20px', background: planta.fotoPlaceholder, aspectRatio: '3 / 4' }}
          >
            <div className="grid h-full w-full place-items-center">
              <Icon
                aria-hidden
                className="h-24 w-24 opacity-20"
                strokeWidth={0.75}
                style={{ color: 'var(--color-cream)' }}
              />
            </div>
          </div>
        )}

        {/* Identity */}
        <div className="flex flex-col justify-center">
          <p className="eyebrow text-[var(--color-green-deep)] mb-4">
            {GRUPO_LABEL[planta.grupo] ?? planta.grupo}
          </p>
          <h1
            className="display text-[var(--color-ink)]"
            style={{ fontSize: 'clamp(42px, 5.5vw, 72px)' }}
          >
            {planta.nombre}
          </h1>
          <div className="mt-2">
            <span className="serif-italic text-[var(--color-ink-soft)]"
              style={{ fontSize: 'clamp(17px, 1.8vw, 22px)' }}>
              {planta.subrubro === 'PLANTAS DE INTERIOR' ? 'Planta de interior' : 'Planta de exterior'}
            </span>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-2.5 text-[12px]">
            <span className="rounded-full border border-[var(--color-rule)] bg-[var(--color-surface-2)] px-3.5 py-1.5 font-medium tracking-wide">
              SKU {planta.sku}
            </span>
            <span
              className="rounded-full px-3.5 py-1.5 font-semibold text-white"
              style={{ background: 'var(--color-green-deep)', fontSize: '12px' }}
            >
              {planta.total} uds. en red
            </span>
          </div>
          <div className="mt-7 h-px" style={{ background: 'var(--color-rule)' }} />
          <div className="mt-7">
            <ShareButton title={planta.nombre} />
          </div>
        </div>
      </header>

      {/* ── Cuidado del grupo ── */}
      <section>
        <p className="eyebrow mb-5">Cuidados del grupo</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6">
            <p className="eyebrow mb-2 text-[var(--color-green-deep)]">Luz</p>
            <p className="text-[15px] leading-relaxed">{cuidado.luz}</p>
          </div>
          <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6">
            <p className="eyebrow mb-2 text-[var(--color-green-deep)]">Riego</p>
            <p className="text-[15px] leading-relaxed">{cuidado.riego}</p>
          </div>
          <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 md:col-span-2">
            <p className="eyebrow mb-2 text-[var(--color-green-deep)]">Estructura recomendada</p>
            <p className="text-[15px] leading-relaxed">{cuidado.estructura}</p>
          </div>
        </div>
      </section>

      {/* ── Frecuencia de riego ── */}
      <section>
        <p className="eyebrow mb-5">Frecuencia de riego por zona climática</p>
        <div className="overflow-hidden rounded-2xl border border-[var(--color-rule)]">
          <table className="w-full border-collapse text-[14px]">
            <thead className="bg-[var(--color-surface-2)]">
              <tr>
                <th className="px-5 py-3.5 text-left font-semibold text-[var(--color-ink)]">Zona</th>
                <th className="px-5 py-3.5 text-left font-semibold text-[var(--color-ink)]">Frecuencia</th>
              </tr>
            </thead>
            <tbody>
              {ZONAS_ORDEN.map((z) => (
                <tr key={z} className="border-t border-[var(--color-rule)]">
                  <td className="px-5 py-3.5 text-[var(--color-ink)]">{ZONA_LABELS[z]}</td>
                  <td className="px-5 py-3.5 text-[var(--color-ink-soft)]">
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
        <p className="eyebrow mb-5">Tips para esta familia</p>
        <ul className="grid gap-3">
          {cuidado.tips.map((t, i) => (
            <li
              key={i}
              className="flex gap-4 rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-5"
            >
              <Icons.bulb
                aria-hidden
                className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-warning)]"
                strokeWidth={1.5}
              />
              <p className="text-[14px] leading-relaxed">{t}</p>
            </li>
          ))}
        </ul>
      </section>

      <Alert variant="warning" title="Señal a vigilar">
        {cuidado.alerta}
      </Alert>

      {/* ── Stock por tienda ── */}
      {stockOrdenado.length > 0 ? (
        <section>
          <p className="eyebrow mb-5">Stock por tienda</p>
          <div className="grid gap-2.5 md:grid-cols-2">
            {stockOrdenado.map(({ tienda, qty }) =>
              tienda ? (
                <Link
                  key={tienda.id}
                  href={`/mi-tienda/${tienda.id}`}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] px-5 py-3.5 hover:border-[var(--color-green-deep)] hover:shadow-[var(--shadow-soft)] transition-all"
                >
                  <span className="flex items-center gap-2.5 text-[14px]">
                    <Icons.store
                      aria-hidden
                      className="h-4 w-4 text-[var(--color-green-deep)]"
                      strokeWidth={1.75}
                    />
                    {tienda.nombre}
                  </span>
                  <span className="text-[14px] font-semibold text-[var(--color-ink)]">{qty}</span>
                </Link>
              ) : null
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
