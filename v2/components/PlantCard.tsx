"use client";

import { Card, CardBody } from "@/components/ui/card";
import { DiscountBadge } from "@/components/ui/discount-badge";
import { Droplets, Sun, Leaf } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Plant, CareGroup } from "@/types";

interface PlantCardProps {
  plant: Plant;
  care?: CareGroup;
  onClick?: () => void;
  className?: string;
}

function PlantPlaceholder({ color, name }: { color: string; name: string }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ background: `${color}22` }}
      aria-hidden
    >
      <Leaf className="size-10 opacity-30" style={{ color }} />
      <span className="sr-only">{name}</span>
    </div>
  );
}

export function PlantCard({ plant, care, onClick, className }: PlantCardProps) {
  const accentColor = care?.color;
  const hasDiscount = plant.descuento && plant.descuento > 0;

  return (
    <Card
      interactive={!!onClick}
      accentColor={accentColor}
      className={cn("flex flex-col", className)}
      onClick={onClick}
    >
      {/* Image area */}
      <div className="relative h-40 w-full overflow-hidden bg-[var(--surface-raised)]">
        <PlantPlaceholder color={care?.color ?? "#6b8f71"} name={plant.nombre} />
        {hasDiscount && (
          <div className="absolute right-2 top-2">
            <DiscountBadge percent={plant.descuento!} />
          </div>
        )}
      </div>

      <CardBody className="flex flex-1 flex-col gap-2">
        <div>
          <p className="text-xs text-[var(--ink-soft)]">{plant.sku}</p>
          <h3
            className="mt-0.5 text-base font-semibold leading-snug text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {plant.nombre}
          </h3>
          {plant.nombre_cientifico && (
            <p className="mt-0.5 text-xs italic text-[var(--ink-soft)]">
              {plant.nombre_cientifico}
            </p>
          )}
        </div>

        {care && (
          <div className="flex items-center gap-3 text-xs text-[var(--ink-soft)]">
            <span className="flex items-center gap-1">
              <Droplets className="size-3.5" aria-hidden />
              {care.riego}
            </span>
            <span className="flex items-center gap-1">
              <Sun className="size-3.5" aria-hidden />
              {care.luz}
            </span>
          </div>
        )}

        {plant.precio != null && (
          <div className="mt-auto flex items-baseline gap-2 pt-1">
            <span className="text-base font-bold text-[var(--ink)]">
              ${plant.precio.toLocaleString("es-CL")}
            </span>
            {plant.precio_anterior != null && (
              <span className="text-xs line-through text-[var(--ink-soft)]">
                ${plant.precio_anterior.toLocaleString("es-CL")}
              </span>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
