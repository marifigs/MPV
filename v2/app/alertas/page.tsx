import { plants, careGroupById } from "@/lib/data";
import { PlantCard } from "@/components/PlantCard";
import { Alert } from "@/components/ui/alert";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section, SectionGrid } from "@/components/ui/section";
import Link from "next/link";
import type { CareGroup } from "@/types";

export const metadata = {
  title: "Alertas — PlantasFácil",
};

// Plants available in very few stores (1–5)
const lowStockPlants = plants
  .filter((p) => p.tiendas.length > 0 && p.tiendas.length <= 5)
  .sort((a, b) => a.tiendas.length - b.tiendas.length)
  .slice(0, 24);

// Plants not available in any store
const zeroStockPlants = plants.filter((p) => p.tiendas.length === 0).slice(0, 24);

// Plants on discount
const onSalePlants = plants.filter((p) => p.descuento != null && p.descuento > 0);

export default function AlertasPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <header className="mb-6">
        <Eyebrow>Seguimiento operativo</Eyebrow>
        <h1
          className="mt-1 text-2xl font-semibold text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Alertas
        </h1>
      </header>

      <div className="flex flex-col gap-8">
        {/* On sale */}
        {onSalePlants.length > 0 && (
          <Section title="En liquidación" description={`${onSalePlants.length} SKUs con descuento activo`}>
            <SectionGrid>
              {onSalePlants.map((plant) => {
                const care = careGroupById.get(plant.grupo) as CareGroup | undefined;
                return (
                  <Link key={plant.sku} href={`/plantas/${plant.sku}`}>
                    <PlantCard plant={plant} care={care} />
                  </Link>
                );
              })}
            </SectionGrid>
          </Section>
        )}

        {onSalePlants.length === 0 && (
          <Alert variant="success" title="Sin liquidaciones activas">
            No hay SKUs con descuento en este momento.
          </Alert>
        )}

        {/* Low stock */}
        <Section
          title="Baja presencia"
          description={`${lowStockPlants.length} SKUs en ≤5 tiendas`}
        >
          {lowStockPlants.length === 0 ? (
            <Alert variant="success">Todos los SKUs tienen stock suficiente.</Alert>
          ) : (
            <SectionGrid>
              {lowStockPlants.map((plant) => {
                const care = careGroupById.get(plant.grupo) as CareGroup | undefined;
                return (
                  <Link key={plant.sku} href={`/plantas/${plant.sku}`}>
                    <PlantCard plant={plant} care={care} />
                  </Link>
                );
              })}
            </SectionGrid>
          )}
        </Section>

        {/* Zero stock */}
        <Section
          title="Sin stock"
          description={`${plants.filter((p) => p.tiendas.length === 0).length} SKUs sin presencia`}
        >
          <Alert variant="info" title="SKUs sin tienda">
            Hay {plants.filter((p) => p.tiendas.length === 0).length} productos sin presencia en tienda.
            Coordiná con el equipo de compras para reponer.
          </Alert>
          <SectionGrid className="mt-4">
            {zeroStockPlants.map((plant) => {
              const care = careGroupById.get(plant.grupo) as CareGroup | undefined;
              return (
                <Link key={plant.sku} href={`/plantas/${plant.sku}`}>
                  <PlantCard plant={plant} care={care} />
                </Link>
              );
            })}
          </SectionGrid>
        </Section>
      </div>
    </div>
  );
}
