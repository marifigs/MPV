import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Thermometer, Wind, CloudRain } from "@/lib/icons";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Stat } from "@/components/ui/stat";
import type { ClimateZone } from "@/types";

interface ClimateCardProps {
  zone: ClimateZone;
  className?: string;
}

export function ClimateCard({ zone, className }: ClimateCardProps) {
  return (
    <Card accentColor={zone.color} className={className}>
      <CardHeader>
        <Eyebrow>Zona climática</Eyebrow>
        <h3
          className="mt-1 text-xl font-semibold text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {zone.nombre}
        </h3>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">{zone.descripcion}</p>
      </CardHeader>

      <CardBody className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
        <Stat
          label="Verano"
          value={zone.temperatura_verano}
          unit="°C"
        />
        <Stat
          label="Invierno"
          value={zone.temperatura_invierno}
          unit="°C"
        />
        <Stat label="Humedad" value={zone.humedad} />
        <div className="flex flex-col gap-1.5 text-xs text-[var(--ink-soft)]">
          {zone.riesgo_helada && (
            <span className="flex items-center gap-1 text-[#1d6fce]">
              <CloudRain className="size-3.5" aria-hidden />
              Riesgo helada
            </span>
          )}
          {zone.riesgo_sequia && (
            <span className="flex items-center gap-1 text-[var(--warning)]">
              <Wind className="size-3.5" aria-hidden />
              Riesgo sequía
            </span>
          )}
          {!zone.riesgo_helada && !zone.riesgo_sequia && (
            <span className="flex items-center gap-1 text-[var(--success)]">
              <Thermometer className="size-3.5" aria-hidden />
              Clima estable
            </span>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
