import { Section } from '@/components/ui/section';
import { TiendaExplorer } from '@/components/tienda-explorer';

export const metadata = {
  title: 'Mi tienda — Manual Plantas Vivas',
};

export default function MiTiendaPage() {
  return (
    <div>
      <Section
        eyebrow="Operativa por tienda"
        title="Mi tienda"
        description="Selecciona tu tienda para ver el riego específico de tu zona y las plantas vigentes."
      />
      <TiendaExplorer />
    </div>
  );
}
