// Minimal type stubs — expanded in FASE 3 with full data migration

export interface Plant {
  sku: string;
  nombre: string;
  nombre_cientifico?: string;
  grupo: string; // FK → CareGroup.id
  precio?: number;
  precio_anterior?: number;
  descuento?: number; // percentage 0–100
  tags?: string[];
}

export interface CareGroup {
  id: string;
  nombre: string;
  color: string; // hex, used for placeholder images
  emoji?: string;
  riego: string;
  luz: string;
  temperatura_min: number;
  temperatura_max: number;
  humedad?: string;
  sustrato?: string;
  fertilizacion?: string;
  alertas?: string[];
  tips?: string[];
}

export interface Store {
  id: string;
  nombre: string;
  ciudad: string;
  zona_climatica: ClimateZoneId;
  direccion?: string;
  telefono?: string;
}

export type ClimateZoneId =
  | "norte_grande"
  | "norte_chico"
  | "zona_central"
  | "sur"
  | "patagonia"
  | "isla";

export interface ClimateZone {
  id: ClimateZoneId;
  nombre: string;
  descripcion: string;
  temperatura_verano: number;
  temperatura_invierno: number;
  humedad: string;
  riesgo_helada: boolean;
  riesgo_sequia: boolean;
  color: string;
}
