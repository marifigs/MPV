"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { PlantCard } from "@/components/PlantCard";
import { SearchBar } from "@/components/SearchBar";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { Plant, CareGroup } from "@/types";

interface PlantsCatalogProps {
  plants: Plant[];
  careGroupMap: Record<string, CareGroup>;
}

export function PlantsCatalog({ plants, careGroupMap }: PlantsCatalogProps) {
  const [results, setResults] = useState<Plant[]>(plants);

  const handleResults = useCallback((r: Plant[]) => setResults(r), []);

  // Group results by grupo
  const grouped = results.reduce<Record<string, Plant[]>>((acc, p) => {
    (acc[p.grupo] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <SearchBar
        items={plants}
        searchKeys={["nombre", "sku", "grupo"]}
        placeholder="Buscar por nombre, SKU o grupo..."
        onResults={handleResults}
      />

      {results.length === 0 && (
        <p className="py-12 text-center text-sm text-[var(--ink-soft)]">
          Sin resultados. Intenta otra búsqueda.
        </p>
      )}

      {Object.entries(grouped).map(([groupId, groupPlants]) => {
        const care = careGroupMap[groupId];
        return (
          <section key={groupId}>
            <div className="mb-3 flex items-center gap-2">
              {care?.emoji && <span aria-hidden>{care.emoji}</span>}
              <Eyebrow>{care?.nombre ?? groupId}</Eyebrow>
              <span className="ml-auto text-xs text-[var(--ink-soft)]">
                {groupPlants.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {groupPlants.map((plant) => (
                <Link key={plant.sku} href={`/plantas/${plant.sku}`}>
                  <PlantCard plant={plant} care={care} />
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
