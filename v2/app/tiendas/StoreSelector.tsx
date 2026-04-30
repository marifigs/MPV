"use client";

import { useState, useCallback } from "react";
import { StoreCard } from "@/components/StoreCard";
import { SearchBar } from "@/components/SearchBar";
import { ClimateCard } from "@/components/ClimateCard";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Droplets, Check } from "@/lib/icons";
import { useMiTienda } from "@/hooks/useMiTienda";
import type { Store, ClimateZone, CareGroup } from "@/types";

interface StoreSelectorProps {
  stores: Store[];
  climateMap: Record<string, ClimateZone>;
  careGroups: CareGroup[];
}

export function StoreSelector({ stores, climateMap, careGroups }: StoreSelectorProps) {
  const { store: savedStore, select, clear } = useMiTienda();
  const [browsing, setBrowsing] = useState(false);
  const [results, setResults] = useState<Store[]>(stores);

  const handleResults = useCallback((r: Store[]) => setResults(r), []);

  const activeStore = savedStore;
  const activeZone = activeStore ? climateMap[activeStore.zona_climatica] : null;
  const showList = !activeStore || browsing;

  return (
    <div className="flex flex-col gap-6">
      {/* Saved store banner */}
      {activeStore && !browsing && activeZone && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--green-soft)]/40 bg-[var(--green-deep)]/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <Check className="size-4 text-[var(--green-deep)]" aria-hidden />
              <div>
                <p className="text-xs text-[var(--ink-soft)]">Tu tienda</p>
                <p className="text-sm font-semibold text-[var(--ink)]">{activeStore.nombre}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { clear(); setBrowsing(false); }}
              className="text-xs text-[var(--ink-soft)] underline-offset-2 hover:underline"
            >
              Cambiar
            </button>
          </div>

          <ClimateCard zone={activeZone} />

          <Card>
            <CardHeader>
              <Eyebrow>Riego para zona {activeZone.nombre}</Eyebrow>
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
                  const freq = g.frecuencia[activeStore.zona_climatica];
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
        </div>
      )}

      {/* Store list */}
      {showList && (
        <>
          <SearchBar
            items={stores}
            searchKeys={["nombre", "ciudad"]}
            placeholder="Buscar tienda o ciudad..."
            onResults={handleResults}
          />
          <div className="flex flex-col gap-3">
            <p className="text-xs text-[var(--ink-soft)]">
              {results.length} tiendas · Toca para guardar como tu tienda
            </p>
            {results.map((store) => (
              <button
                key={store.id}
                type="button"
                onClick={() => { select(store); setBrowsing(false); }}
                className="block w-full text-left"
              >
                <StoreCard
                  store={store}
                  climate={climateMap[store.zona_climatica]}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
