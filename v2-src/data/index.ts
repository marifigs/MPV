import type {
  Tienda,
  Planta,
  CuidadoGrupo,
  InfoZonaClimatica,
  PlantaEspecial,
  SenalAlerta,
  PasoRutina,
  TipExperto,
  ZonaClimatica,
  GrupoCuidado,
  ReglaLiquidacion,
  DescuentoEtapa,
  PrecioEjemplo,
  PasoFlujoLiquidacion,
  KpiLiquidacion,
} from '@/types/data';

import tiendasData from './tiendas.json';
import plantasData from './plantas.json';
import cuidadosData from './cuidados.json';
import zonasData from './zonas.json';
import plantasEspecialesData from './plantas-especiales.json';
import alertasData from './alertas.json';
import rutinaData from './rutina.json';
import tipsData from './tips.json';
import liquidacionData from './liquidacion.json';

export const tiendas = tiendasData as Tienda[];
export const plantas = plantasData as Planta[];
export const cuidados = cuidadosData as CuidadoGrupo[];
export const zonas = zonasData as InfoZonaClimatica[];
export const plantasEspeciales = plantasEspecialesData as PlantaEspecial[];
export const alertas = alertasData as SenalAlerta[];
export const rutina = rutinaData as PasoRutina[];
export const tips = tipsData as TipExperto[];
export const liquidacion = liquidacionData as {
  reglas: ReglaLiquidacion[];
  descuentos: DescuentoEtapa[];
  precios: PrecioEjemplo[];
  flujo: PasoFlujoLiquidacion[];
  kpis: KpiLiquidacion[];
};

export const tiendasById = Object.fromEntries(
  tiendas.map((t) => [t.id, t])
) as Record<string, Tienda>;

export const plantasById = Object.fromEntries(
  plantas.map((p) => [p.id, p])
) as Record<string, Planta>;

export const cuidadosByGrupo = Object.fromEntries(
  cuidados.map((c) => [c.grupo, c])
) as Record<GrupoCuidado, CuidadoGrupo>;

export const zonasById = Object.fromEntries(
  zonas.map((z) => [z.id, z])
) as Record<ZonaClimatica, InfoZonaClimatica>;

export function getPlantasDeTienda(tiendaId: string): Array<Planta & { stock: number }> {
  return plantas
    .filter((p) => (p.stockPorTienda[tiendaId] ?? 0) > 0)
    .map((p) => ({ ...p, stock: p.stockPorTienda[tiendaId] ?? 0 }))
    .sort((a, b) => b.stock - a.stock);
}

export function getTiendasDeZona(zonaId: ZonaClimatica): Tienda[] {
  return tiendas.filter((t) => t.zona === zonaId);
}

import catalogData from './catalog.json';

export interface CatalogPlant {
  id: string;
  nombre: string;
  folderSlug: string | null;
  fotoUrl: string | null;
  subrubro: string;
  grupo: string;
  fotoPlaceholder: string;
}

export const catalog = catalogData as CatalogPlant[];

export const ZONA_LABELS: Record<ZonaClimatica, string> = {
  desertico: 'Desértico',
  semiarido: 'Semiárido',
  costero: 'Costero',
  templado: 'Templado',
  montana: 'Montaña',
  'frio-humedo': 'Frío Húmedo',
};

export const TIPO_TIENDA_LABELS: Record<'PEQ' | 'MED' | 'GRA', string> = {
  PEQ: 'Pequeña',
  MED: 'Mediana',
  GRA: 'Grande',
};
