import Link from 'next/link';
import { notFound } from 'next/navigation';
import { zonas, zonasById, tiendasById, cuidados, ZONA_LABELS, TIPO_TIENDA_LABELS } from '@/data';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Icons, zonaIcon, type ZonaClimaticaKey } from '@/lib/icons';
import { GRUPO_LABEL } from '@/lib/group-icons';
import type { ZonaClimatica } from '@/types/data';

export function generateStaticParams() {
  return zonas.map((z) => ({ zonaId: z.id }));
}

interface PageProps {
  params: Promise<{ zonaId: string }>;
}

export default async function ClimaDetailPage({ params }: PageProps) {
  const { zonaId } = await params;
  const zona = zonasById[zonaId as ZonaClimatica];
  if (!zona) notFound();
  const Icon = Icons[zonaIcon[zona.id as ZonaClimaticaKey]];

  return (
    <div className="space-y-10">
      <Link
        href="/climas"
        className="inline-flex items-center gap-1 text-[14px] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
      >
        <Icons.chevronLeft aria-hidden className="h-4 w-4" strokeWidth={1.75} />
        Todos los climas
      </Link>

      <header className="flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[var(--color-green-deep)] text-[var(--color-cream)]">
          <Icon aria-hidden className="h-7 w-7" strokeWidth={1.5} />
        </span>
        <div>
          <Eyebrow>Zona climática</Eyebrow>
          <h1 className="serif mt-1 text-[36px] sm:text-[44px] leading-tight">{zona.titulo}</h1>
          <p className="mt-2 max-w-prose text-[var(--color-ink-soft)] leading-relaxed">
            {zona.descripcion}
          </p>
        </div>
      </header>

      <Card className="p-5">
        <Eyebrow className="text-[var(--color-green-deep)]">Riego general</Eyebrow>
        <p className="mt-1.5 text-[16px] leading-relaxed">{zona.riegoGeneral}</p>
      </Card>

      <Alert
        variant={zona.id === 'desertico' || zona.id === 'frio-humedo' ? 'danger' : 'warning'}
        title="Atento a esto"
      >
        {zona.alertaZona}
      </Alert>

      <section className="space-y-3">
        <h2 className="serif text-[24px]">Tips específicos</h2>
        <ul className="grid gap-2">
          {zona.tipsZona.map((t, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] p-4"
            >
              <Icons.bulb aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-warning)]" strokeWidth={1.5} />
              <p className="text-[14px] leading-relaxed">{t}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="serif text-[24px]">
          Frecuencia por grupo en {ZONA_LABELS[zona.id]}
        </h2>
        <div className="overflow-hidden rounded-xl border border-[var(--color-rule)]">
          <table className="w-full border-collapse text-[14px]">
            <thead className="bg-[var(--color-surface-2)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Grupo</th>
                <th className="px-4 py-3 font-medium">Frecuencia</th>
              </tr>
            </thead>
            <tbody>
              {cuidados.map((c) => (
                <tr key={c.grupo} className="border-t border-[var(--color-rule)]">
                  <td className="px-4 py-3">{GRUPO_LABEL[c.grupo] ?? c.grupo}</td>
                  <td className="px-4 py-3 text-[var(--color-ink-soft)]">
                    {c.frecuenciaPorZona[zona.id]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="serif text-[24px]">
          Tiendas en esta zona ({zona.tiendasIds.length})
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {zona.tiendasIds
            .map((id) => tiendasById[id])
            .filter((t): t is NonNullable<typeof t> => !!t)
            .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
            .map((t) => (
              <Link
                key={t.id}
                href={`/mi-tienda/${t.id}`}
                className="flex items-center justify-between rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] px-4 py-3 hover:border-[var(--color-green-soft)] hover:bg-[var(--color-surface-2)]"
              >
                <span className="flex items-center gap-2 text-[14px]">
                  <Icons.store aria-hidden className="h-4 w-4 text-[var(--color-green-deep)]" strokeWidth={1.75} />
                  {t.nombre}
                </span>
                <span className="text-[12px] text-[var(--color-ink-soft)]">
                  {TIPO_TIENDA_LABELS[t.tipo]}
                </span>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
