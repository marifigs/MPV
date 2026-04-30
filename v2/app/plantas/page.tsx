import { plants, careGroups } from "@/lib/data";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PlantsCatalog } from "./PlantsCatalog";
import type { CareGroup } from "@/types";

export const metadata = {
  title: "Catálogo de Plantas — PlantasFácil",
};

export default function PlantasPage() {
  const careGroupMap = Object.fromEntries(
    careGroups.map((g) => [g.id, g])
  ) as Record<string, CareGroup>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <header className="mb-6">
        <Eyebrow>Fichas de cuidado</Eyebrow>
        <h1
          className="mt-1 text-2xl font-semibold text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Catálogo de Plantas
        </h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          {plants.length} SKUs · {careGroups.length} grupos
        </p>
      </header>

      <PlantsCatalog plants={plants} careGroupMap={careGroupMap} />
    </div>
  );
}
