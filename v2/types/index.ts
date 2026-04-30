// ─── Climate Zones ──────────────────────────────────────────────────────────

export type ClimateZoneId =
  | "desertico"
  | "semiarido"
  | "costero"
  | "templado"
  | "montana"
  | "frio_humedo";

export interface ClimateZone {
  id: ClimateZoneId;
  nombre: string;
  emoji: string;
  descripcion: string;
  temperatura_verano: number;
  temperatura_invierno: number;
  humedad: string;
  riesgo_helada: boolean;
  riesgo_sequia: boolean;
  color: string;
}

// ─── Care Groups ─────────────────────────────────────────────────────────────

export type CareGroupId =
  | "HERBACEAS PERENES"
  | "ARBUSTIVA DE FLOR"
  | "PLANTA INTERIOR FOLL"
  | "PLANTA INTERIOR FLOR"
  | "PLANTA INTERIOR COLG"
  | "PLANTIN PRIMAV/VERAN"
  | "PLANTIN OTOÑ/INVIER"
  | "ARBUSTIVA FOLLAJE"
  | "ARBUSTIVA TREPADORAS"
  | "ARBOLES FOLLAJE"
  | "ARBOLES FRUTALES"
  | "ARBOLES PALMERAS"
  | "HERBACEAS CACTUS"
  | "HERBACEAS AROMÁTICAS"
  | "FLORALES"
  | "PLANTA INTERIOR CORT";

export interface CareGroup {
  id: CareGroupId;
  nombre: string;
  color: string;
  emoji: string;
  luz: string;
  riego: string;
  frecuencia: Record<ClimateZoneId, string>;
  temperatura_min: number;
  temperatura_max: number;
  estructura: string;
  alertas: string[];
  tips: string[];
}

// ─── Stores ──────────────────────────────────────────────────────────────────

export type StoreSize = "GRA" | "MED" | "PEQ";

export interface Store {
  id: string;
  nombre: string;
  ciudad: string;
  zona_climatica: ClimateZoneId;
  tipo: StoreSize;
  direccion?: string;
  telefono?: string;
}

// ─── Plants ──────────────────────────────────────────────────────────────────

export interface Plant {
  sku: string;
  nombre: string;
  nombre_cientifico?: string;
  grupo: CareGroupId;
  subrubro: string;
  stock_total: number;
  stock?: Record<string, number>; // store nombre → units
  precio?: number;
  precio_anterior?: number;
  descuento?: number;
  tags?: string[];
}
