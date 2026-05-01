import Link from 'next/link';
import { notFound } from 'next/navigation';
import { plantas, plantasById, cuidadosByGrupo, tiendasById, ZONA_LABELS } from '@/data';
import { GRUPO_ICON, GRUPO_LABEL } from '@/lib/group-icons';
import { Icons } from '@/lib/icons';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { ZONAS_ORDEN } from '@/types/data';
import { ShareButton } from '@/components/share-button';

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

  const stockOrdenado = Object.entries(planta.stockPorTienda)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ tienda: tiendasById[id], qty }))
    .filter((x) => !!x.tienda)
    .sort((a, b) => b.qty - a.qty);

  return (
    <div className="space-y-8">
      <Link
        href="/plantas"
        className="inline-flex items-center gap-1 text-[14px] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
      >
        <Icons.chevronLeft aria-hidden className="h-4 w-4" strokeWidth={1.75} />
        Volver al catálogo
      </Link>

      <header className="grid gap-6 md:grid-cols-[280px_1fr]">
        <div
          className="aspect-square overflow-hidden rounded-2xl"
          style={{ background: planta.fotoUrl ? undefined : planta.fotoPlaceholder }}
        >
          {planta.fotoUrl ? (
            <img
              src={`/MPV/v2/${planta.fotoUrl}`}
              alt={`Foto de ${planta.nombre}`}
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-[var(--color-cream)]">
              <Icon aria-hidden className="h-20 w-20" strokeWidth={1} />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <Eyebrow>{GRUPO_LABEL[planta.grupo] ?? planta.grupo}</Eyebrow>
          <h1 className="serif mt-2 text-[36px] sm:text-[44px] leading-tight tracking-tight">
            {planta.nombre}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-[var(--color-ink-soft)]">
            <span className="rounded-full bg-[var(--color-surface-2)] px-3 py-1">
              {planta.subrubro === 'PLANTAS DE INTERIOR' ? 'Interior' : 'Exterior'}
            </span>
            <span>SKU {planta.sku}</span>
            <span className="font-medium text-[var(--color-ink)]">
              {planta.total} unidades en red
            </span>
          </div>
          <div className="mt-5">
            <ShareButton title={planta.nombre} />
          </div>
        </div>
      </header>

      {/* Cuidado del grupo */}
      <section className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <Eyebrow className="text-[var(--color-green-deep)]">Luz</Eyebrow>
          <p className="mt-1.5 text-[15px] leading-relaxed">{cuidado.luz}</p>
        </Card>
        <Card className="p-5">
          <Eyebrow className="text-[var(--color-green-deep)]">Riego</Eyebrow>
          <p className="mt-1.5 text-[15px] leading-relaxed">{cuidado.riego}</p>
        </Card>
        <Card className="p-5 md:col-span-2">
          <Eyebrow className="text-[var(--color-green-deep)]">Estructura recomendada</Eyebrow>
          <p className="mt-1.5 text-[15px] leading-relaxed">{cuidado.estructura}</p>
        </Card>
      </section>

      {/* Frecuencia por zona */}
      <section>
        <h2 className="serif text-[24px] mb-3">Frecuencia de riego por zona</h2>
        <div className="overflow-hidden rounded-xl border border-[var(--color-rule)]">
          <table className="w-full border-collapse text-[14px]">
            <thead className="bg-[var(--color-surface-2)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Zona</th>
                <th className="px-4 py-3 font-medium">Frecuencia</th>
              </tr>
            </thead>
            <tbody>
              {ZONAS_ORDEN.map((z) => (
                <tr key={z} className="border-t border-[var(--color-rule)]">
                  <td className="px-4 py-3 text-[var(--color-ink)]">{ZONA_LABELS[z]}</td>
                  <td className="px-4 py-3 text-[var(--color-ink-soft)]">
                    {cuidado.frecuenciaPorZona[z]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tips */}
      <section>
        <h2 className="serif text-[24px] mb-3">Tips para esta familia</h2>
        <ul className="grid gap-2">
          {cuidado.tips.map((t, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] p-4"
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

      {/* Stock por tienda */}
      {stockOrdenado.length > 0 ? (
        <section>
          <h2 className="serif text-[24px] mb-3">Stock por tienda</h2>
          <div className="grid gap-2 md:grid-cols-2">
            {stockOrdenado.map(({ tienda, qty }) =>
              tienda ? (
                <Link
                  key={tienda.id}
                  href={`/mi-tienda/${tienda.id}`}
                  className="flex items-center justify-between rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] px-4 py-3 hover:border-[var(--color-green-soft)] hover:bg-[var(--color-surface-2)]"
                >
                  <span className="flex items-center gap-2 text-[14px]">
                    <Icons.store aria-hidden className="h-4 w-4 text-[var(--color-green-deep)]" strokeWidth={1.75} />
                    {tienda.nombre}
                  </span>
                  <span className="text-[14px] font-medium">{qty}</span>
                </Link>
              ) : null
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
