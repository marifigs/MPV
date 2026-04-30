import { stores, careGroups, climateZones } from "@/lib/data";
import { Eyebrow } from "@/components/ui/eyebrow";
import { StoreSelector } from "./StoreSelector";
import type { ClimateZone } from "@/types";

export const metadata = {
  title: "Mi Tienda — PlantasFácil",
};

export default function TiendasPage() {
  const climateMap = Object.fromEntries(
    climateZones.map((z) => [z.id, z])
  ) as Record<string, ClimateZone>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <header className="mb-6">
        <Eyebrow>Frecuencias de riego</Eyebrow>
        <h1
          className="mt-1 text-2xl font-semibold text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Mi Tienda
        </h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          {stores.length} tiendas Easy Chile
        </p>
      </header>

      <StoreSelector
        stores={stores}
        climateMap={climateMap}
        careGroups={careGroups}
      />
    </div>
  );
}
