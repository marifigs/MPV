import { Card, CardBody } from "@/components/ui/card";
import { MapPin, Thermometer } from "@/lib/icons";
import type { Store, ClimateZone } from "@/types";

interface StoreCardProps {
  store: Store;
  climate?: ClimateZone;
  onClick?: () => void;
}

export function StoreCard({ store, climate, onClick }: StoreCardProps) {
  return (
    <Card
      interactive={!!onClick}
      accentColor={climate?.color}
      onClick={onClick}
    >
      <CardBody className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3
              className="text-base font-semibold text-[var(--ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {store.nombre}
            </h3>
            <p className="flex items-center gap-1 text-sm text-[var(--ink-soft)]">
              <MapPin className="size-3.5" aria-hidden />
              {store.ciudad}
            </p>
          </div>
          {climate && (
            <span
              className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
              style={{ background: climate.color }}
            >
              {climate.nombre}
            </span>
          )}
        </div>

        {climate && (
          <p className="flex items-center gap-1 text-xs text-[var(--ink-soft)]">
            <Thermometer className="size-3.5" aria-hidden />
            {climate.temperatura_invierno}° – {climate.temperatura_verano}°C
          </p>
        )}

        {store.direccion && (
          <p className="text-xs text-[var(--ink-soft)]">{store.direccion}</p>
        )}
      </CardBody>
    </Card>
  );
}
