"use client";

import { useState, useCallback } from "react";
import { StoreCard } from "@/components/StoreCard";
import { SearchBar } from "@/components/SearchBar";
import { ClimateCard } from "@/components/ClimateCard";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Droplets } from "@/lib/icons";
import type { Store, ClimateZone, CareGroup } from "@/types";

interface StoreSelectorProps {
  stores: Store[];
  climateMap: Record<string, ClimateZone>;
  careGroups: CareGroup[];
}

export function StoreSelector({ stores, climateMap, careGroups }: StoreSelectorProps) {
  const [selected, setSelected] = useState<Store | null>(null);
  const [results, setResults] = useState<Store[]>(stores);

  const handleResults = useCallback((r: Store[]) => setResults(r), []);

  const selectedZone = selected ? climateMap[selected.zona_climatica] : null;

  return (
    <div className="flex flex-col gap-6">
      <SearchBar
        items={stores}
        searchKeys={["nombre", "ciudad"]}
        placeholder="Buscar tienda o ciudad..."
        onResults={handleResults}
      />

      {selected && selectedZone && (
        <div className="flex flex-col gap-4">
          <ClimateCard zone={selectedZone} />

          {/* Watering schedule for this zone */}
          <Card>
            <CardHeader>
              <Eyebrow>Riego para {selectedZone.nombre}</Eyebrow>
              <h2
                className="mt-1 text-lg font-semibold text-[var(--ink)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Frecuencias por grupo
              </h2>
            </CardHeader>
            <CardBody className="pt-3">
              <ul className="divide-y divide-[var(--rule)]">
                {careGroups.map((g) => {
                  const freq = g.frecuencia[selected.zona_climatica];
                  return (
                    <li key={g.id} className="flex items-center justify-between gap-3 py-2.5">
                      <span className="flex items-center gap-2 text-sm text-[var(--ink)]">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ background: g.color }}
                          aria-hidden
                        />
                        {g.nombre}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-[var(--ink)]">
                        <Droplets className="size-3.5 text-[var(--ink-soft)]" aria-hidden />
                        {freq ?? "—"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardBody>
          </Card>

          <button
            type="button"
            onClick={() => setSelected(null)}
            className="self-end text-sm text-[var(--ink-soft)] underline-offset-2 hover:underline"
          >
            Cambiar tienda
          </button>
        </div>
      )}

      {!selected && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-[var(--ink-soft)]">
            {results.length} tiendas · Selecciona para ver frecuencias de riego
          </p>
          {results.map((store) => (
            <button
              key={store.id}
              type="button"
              onClick={() => setSelected(store)}
              className="block w-full text-left"
            >
              <StoreCard
                store={store}
                climate={climateMap[store.zona_climatica]}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
