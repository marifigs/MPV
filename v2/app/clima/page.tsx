import { climateZones, storesByZone } from "@/lib/data";
import { ClimateCard } from "@/components/ClimateCard";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card, CardBody } from "@/components/ui/card";
import { MapPin } from "@/lib/icons";

export const metadata = {
  title: "Clima y Zonas — PlantasFácil",
};

export default function ClimaPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <header className="mb-6">
        <Eyebrow>6 zonas climáticas</Eyebrow>
        <h1
          className="mt-1 text-2xl font-semibold text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Clima y Zonas
        </h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          Cada zona tiene un régimen de riego diferente para el mismo grupo de plantas.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {climateZones.map((zone) => {
          const tiendas = storesByZone(zone.id);
          return (
            <div key={zone.id} className="flex flex-col gap-3">
              <ClimateCard zone={zone} />

              {tiendas.length > 0 && (
                <Card>
                  <CardBody>
                    <Eyebrow className="mb-2">
                      {tiendas.length} tienda{tiendas.length > 1 ? "s" : ""} en esta zona
                    </Eyebrow>
                    <ul className="flex flex-wrap gap-2">
                      {tiendas.map((store) => (
                        <li key={store.id}>
                          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--rule)] bg-[var(--surface-raised)] px-2.5 py-1 text-xs text-[var(--ink-soft)]">
                            <MapPin className="size-3" aria-hidden />
                            {store.ciudad}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
