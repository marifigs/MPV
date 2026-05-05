import type { Plant, CareGroup, Store, ClimateZone, CareGroupId, ClimateZoneId } from "@/types";

// JSON imports — bundled at build time (no runtime fetch)
import plantsRaw from "@/data/plants.json";
import careGroupsRaw from "@/data/care-groups.json";
import storesRaw from "@/data/stores.json";
import climateZonesRaw from "@/data/climate-zones.json";

// ─── Typed exports ───────────────────────────────────────────────────────────

export const plants = plantsRaw as Plant[];
export const careGroups = careGroupsRaw as CareGroup[];
export const stores = storesRaw as Store[];
export const climateZones = climateZonesRaw as ClimateZone[];

// ─── Index maps (built once, O(1) lookups) ────────────────────────────────────

export const careGroupById = new Map<CareGroupId, CareGroup>(
  careGroups.map((g) => [g.id, g])
);

export const storeById = new Map<string, Store>(
  stores.map((s) => [s.id, s])
);

export const climateZoneById = new Map<ClimateZoneId, ClimateZone>(
  climateZones.map((z) => [z.id, z])
);

export const plantBySku = new Map<string, Plant>(
  plants.map((p) => [p.sku, p])
);

// ─── Query helpers ────────────────────────────────────────────────────────────

/** All plants that belong to a care group */
export function plantsByGroup(groupId: CareGroupId): Plant[] {
  return plants.filter((p) => p.grupo === groupId);
}

/** All stores in a given climate zone */
export function storesByZone(zoneId: ClimateZoneId): Store[] {
  return stores.filter((s) => s.zona_climatica === zoneId);
}

/** Resolve care group for a plant */
export function careFor(plant: Plant): CareGroup | undefined {
  return careGroupById.get(plant.grupo);
}

/** Watering frequency for a plant at a given store */
export function wateringFrequency(plant: Plant, store: Store): string | undefined {
  const care = careFor(plant);
  return care?.frecuencia[store.zona_climatica];
}

/** Plants available in at least one store */
export function plantsInStock(): Plant[] {
  return plants.filter((p) => p.tiendas.length > 0);
}

/** Plants with active discount */
export function plantsOnSale(): Plant[] {
  return plants.filter((p) => p.descuento != null && p.descuento > 0);
}
