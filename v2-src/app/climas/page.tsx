import { Section } from '@/components/ui/section';
import { ClimateCard } from '@/components/ui/climate-card';
import { zonas } from '@/data';
import { zonaIcon, type ZonaClimaticaKey } from '@/lib/icons';
import { ZONAS_ORDEN } from '@/types/data';

export const metadata = {
  title: 'Climas — Manual Plantas Vivas',
};

export default function ClimasPage() {
  const ordenadas = ZONAS_ORDEN.map((id) => zonas.find((z) => z.id === id)).filter(
    (z): z is NonNullable<typeof z> => !!z
  );

  return (
    <div>
      <Section
        eyebrow="Geografía operativa"
        title="Zonas climáticas"
        description="Chile tiene 6 zonas. El cuidado y el riego cambian completamente entre ellas."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ordenadas.map((z) => (
          <ClimateCard
            key={z.id}
            zonaId={z.id}
            titulo={z.titulo}
            descripcion={z.descripcion}
            riegoGeneral={z.riegoGeneral}
            icon={zonaIcon[z.id as ZonaClimaticaKey]}
          />
        ))}
      </div>
    </div>
  );
}
