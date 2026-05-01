import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  tiendas,
  tiendasById,
  zonasById,
  cuidados,
  ZONA_LABELS,
  TIPO_TIENDA_LABELS,
  getPlantasDeTienda,
} from '@/data';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { ShareButton } from '@/components/share-button';
import { SaveMiTienda } from '@/components/save-mi-tienda';
import { Icons, zonaIcon, type ZonaClimaticaKey } from '@/lib/icons';
import { GRUPO_ICON, GRUPO_LABEL } from '@/lib/group-icons';
import { ZONAS_ORDEN } from '@/types/data';

export function generateStaticParams() {
  return tiendas.map((t) => ({ tiendaId: t.id }));
}

interface PageProps {
  params: Promise<{ tiendaId: string }>;
}

export default async function TiendaDetailPage({ params }: PageProps) {
  const { tiendaId } = await params;
  const tienda = tiendasById[tiendaId];
  if (!tienda) notFound();
  const zona = zonasById[tienda.zona];
  const ZonaIcon = Icons[zonaIcon[tienda.zona as ZonaClimaticaKey]];

  const plantasDeTienda = getPlantasDeTienda(tiendaId);
  const totalUnidades = plantasDeTienda.reduce((acc, p) => acc + p.stock, 0);

  // Plantas agrupadas por familia
  const porGrupo = new Map<string, typeof plantasDeTienda>();
  for (const p of plantasDeTienda) {
    if (!porGrupo.has(p.grupo)) porGrupo.set(p.grupo, []);
    porGrupo.get(p.grupo)!.push(p);
  }
  const gruposOrdenados = Array.from(porGrupo.entries()).sort(
    (a, b) => b[1].length - a[1].length
  );

  return (
    <div className="space-y-10">
      <Link
        href="/mi-tienda"
        className="inline-flex items-center gap-1 text-[14px] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
      >
        <Icons.chevronLeft aria-hidden className="h-4 w-4" strokeWidth={1.75} />
        Todas las tiendas
      </Link>

      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--color-green-deep)] text-[var(--color-cream)]">
            <Icons.store aria-hidden className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <div>
            <Eyebrow>Tienda Easy</Eyebrow>
            <h1 className="serif text-[36px] sm:text-[44px] leading-tight tracking-tight">
              {tienda.nombre}
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[14px] text-[var(--color-ink-soft)]">
          <span className="flex items-center gap-1.5 rounded-full bg-[var(--color-surface-2)] px-3 py-1">
            <ZonaIcon aria-hidden className="h-4 w-4" strokeWidth={1.75} />
            {ZONA_LABELS[tienda.zona]}
          </span>
          <span className="rounded-full bg-[var(--color-surface-2)] px-3 py-1">
            Tienda {TIPO_TIENDA_LABELS[tienda.tipo]}
          </span>
          <span className="rounded-full bg-[var(--color-surface-2)] px-3 py-1">
            {totalUnidades} unidades en stock
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <SaveMiTienda tiendaId={tienda.id} />
          <ShareButton title={`${tienda.nombre} — Manual Plantas Vivas`} />
        </div>
      </header>

      {/* Riego de la zona */}
      <section className="space-y-4">
        <h2 className="serif text-[24px]">Riego de tu zona</h2>
        <Card className="p-5 sm:p-6">
          <Eyebrow className="text-[var(--color-green-deep)]">Régimen general</Eyebrow>
          <p className="mt-2 text-[16px] leading-relaxed">{zona.riegoGeneral}</p>
          <p className="mt-3 text-[14px] text-[var(--color-ink-soft)] leading-relaxed">
            {zona.descripcion}
          </p>
        </Card>
        <Alert
          variant={zona.id === 'desertico' || zona.id === 'frio-humedo' ? 'danger' : 'warning'}
          title="Atento a esto"
        >
          {zona.alertaZona}
        </Alert>
        <Card className="p-5">
          <Eyebrow className="text-[var(--color-green-deep)]">Tips de tu zona</Eyebrow>
          <ul className="mt-3 space-y-2 text-[14px]">
            {zona.tipsZona.map((t, i) => (
              <li key={i} className="flex gap-2">
                <Icons.check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success)]" strokeWidth={2} />
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Frecuencia de riego por grupo */}
      <section className="space-y-3">
        <h2 className="serif text-[24px]">Frecuencia por grupo de planta</h2>
        <p className="text-[14px] text-[var(--color-ink-soft)]">
          Para tu zona ({ZONA_LABELS[tienda.zona]}). El número entre paréntesis es referencia general en otras zonas.
        </p>
        <div className="overflow-hidden rounded-xl border border-[var(--color-rule)]">
          <table className="w-full border-collapse text-[14px]">
            <thead className="bg-[var(--color-surface-2)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Grupo</th>
                <th className="px-4 py-3 font-medium">Frecuencia para esta zona</th>
              </tr>
            </thead>
            <tbody>
              {cuidados.map((c) => (
                <tr key={c.grupo} className="border-t border-[var(--color-rule)]">
                  <td className="px-4 py-3 text-[var(--color-ink)]">
                    {GRUPO_LABEL[c.grupo] ?? c.grupo}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-ink-soft)]">
                    <span className="text-[var(--color-ink)] font-medium">
                      {c.frecuenciaPorZona[tienda.zona]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Stock por grupo */}
      <section className="space-y-3">
        <h2 className="serif text-[24px]">
          Plantas vigentes ({plantasDeTienda.length})
        </h2>
        {plantasDeTienda.length === 0 ? (
          <Alert variant="info">
            No hay datos de stock cargados para esta tienda en el dataset actual.
          </Alert>
        ) : (
          <div className="space-y-3">
            {gruposOrdenados.map(([grupo, lista]) => {
              const Icon = Icons[GRUPO_ICON[grupo as keyof typeof GRUPO_ICON]];
              const sumGrupo = lista.reduce((a, b) => a + b.stock, 0);
              return (
                <details
                  key={grupo}
                  className="group rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] open:bg-[var(--color-surface-2)]"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
                    <Icon
                      aria-hidden
                      className="h-5 w-5 text-[var(--color-green-deep)]"
                      strokeWidth={1.75}
                    />
                    <span className="font-medium">
                      {GRUPO_LABEL[grupo as keyof typeof GRUPO_LABEL] ?? grupo}
                    </span>
                    <span className="ml-auto text-[13px] text-[var(--color-ink-soft)]">
                      {lista.length} variedades · {sumGrupo} unidades
                    </span>
                    <Icons.chevronDown
                      aria-hidden
                      className="h-4 w-4 transition-transform group-open:rotate-180"
                      strokeWidth={1.75}
                    />
                  </summary>
                  <ul className="grid gap-1.5 border-t border-[var(--color-rule)] p-3 sm:grid-cols-2">
                    {lista.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/plantas/${p.id}`}
                          className="flex items-center justify-between rounded-md px-3 py-2 text-[14px] hover:bg-[var(--color-surface)]"
                        >
                          <span className="line-clamp-1">{p.nombre}</span>
                          <span className="ml-2 shrink-0 font-medium">{p.stock}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              );
            })}
          </div>
        )}
      </section>

      {/* Comparativa con otras zonas */}
      <section className="space-y-3">
        <h2 className="serif text-[24px]">Otras zonas climáticas</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {ZONAS_ORDEN.filter((z) => z !== tienda.zona).map((z) => (
            <Link
              key={z}
              href={`/climas/${z}`}
              className="flex items-center justify-between rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] px-4 py-3 hover:border-[var(--color-green-soft)]"
            >
              <span className="text-[14px]">{ZONA_LABELS[z]}</span>
              <Icons.chevronRight aria-hidden className="h-4 w-4 text-[var(--color-ink-soft)]" strokeWidth={1.75} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
