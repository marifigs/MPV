import { Section } from '@/components/ui/section';
import { PlantasExplorer } from '@/components/plantas-explorer';

export const metadata = {
  title: 'Catálogo de plantas — Manual Plantas Vivas',
};

export default function PlantasPage() {
  return (
    <div>
      <Section
        eyebrow="Catálogo"
        title="Plantas"
        description="Busca cualquier planta por nombre o filtra por grupo. Cada ficha tiene la guía de cuidados de su grupo."
      />
      <PlantasExplorer />
    </div>
  );
}
