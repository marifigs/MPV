/**
 * Schemas TS para los datasets del manual operativo.
 * Las claves siguen los identificadores originales del HTML cuando
 * son discriminantes para el negocio (ej. códigos de zona climática).
 */

export type ZonaClimatica =
  | 'desertico'
  | 'semiarido'
  | 'costero'
  | 'templado'
  | 'montana'
  | 'frio-humedo';

export const ZONAS_ORDEN: ZonaClimatica[] = [
  'desertico',
  'semiarido',
  'costero',
  'templado',
  'montana',
  'frio-humedo',
];

export type SubrubroPlanta = 'PLANTAS DE EXTERIOR' | 'PLANTAS DE INTERIOR';

export type GrupoCuidado =
  | 'HERBACEAS PERENES'
  | 'ARBUSTIVA DE FLOR'
  | 'PLANTA INTERIOR FOLL'
  | 'PLANTA INTERIOR FLOR'
  | 'PLANTA INTERIOR COLG'
  | 'PLANTIN PRIMAV/VERAN'
  | 'PLANTIN OTOÑ/INVIER'
  | 'ARBUSTIVA FOLLAJE'
  | 'ARBUSTIVA TREPADORAS'
  | 'ARBOLES FOLLAJE'
  | 'ARBOLES FRUTALES'
  | 'ARBOLES PALMERAS'
  | 'HERBACEAS CACTUS'
  | 'HERBACEAS AROMÁTICAS'
  | 'FLORALES'
  | 'PLANTA INTERIOR CORT';

export type TipoTienda = 'PEQ' | 'MED' | 'GRA';

export interface Tienda {
  id: string;
  nombre: string;
  zona: ZonaClimatica;
  tipo: TipoTienda;
  lat: number;
  lon: number;
  riegoAutomatico: boolean;
}

export interface Planta {
  id: string;
  sku: number;
  nombre: string;
  grupo: GrupoCuidado;
  subrubro: SubrubroPlanta;
  tiendas: string[];
  fotoUrl?: string;
  fotoPlaceholder: string;
}

export interface CuidadoGrupo {
  grupo: GrupoCuidado;
  luz: string;
  riego: string;
  frecuenciaPorZona: Record<ZonaClimatica, string>;
  tips: string[];
  estructura: string;
  alerta: string;
  acentoColor: string;
}

export interface InfoZonaClimatica {
  id: ZonaClimatica;
  titulo: string;
  descripcion: string;
  riegoGeneral: string;
  tipsZona: string[];
  alertaZona: string;
  color: string;
  tiendasIds: string[];
}

export interface PlantaEspecial {
  id: string;
  nombre: string;
  especial: string;
  temperatura: string;
  urgente: string;
}

export interface SenalAlerta {
  id: string;
  titulo: string;
  accion: string;
  severidad: 'leve' | 'media' | 'critica';
}

export interface PasoRutina {
  id: string;
  momento: 'apertura' | 'mediodia' | 'cierre';
  duracionMin: number;
  titulo: string;
  pasos: string[];
}

export interface TipExperto {
  id: string;
  titulo: string;
  texto: string;
}

export type TipoLiquidacion =
  | 'flor-temporada'
  | 'flor-perenne'
  | 'interior-arbusto';

export interface ReglaLiquidacion {
  id: TipoLiquidacion;
  titulo: string;
  plazo: string;
  descripcion: string;
  ejemplo: string;
  tip: string;
}

export interface DescuentoEtapa {
  porcentaje: 30 | 50 | 70;
  nombre: string;
  descripcion: string;
  estado: 'inicial' | 'medio' | 'final';
}

export interface PrecioEjemplo {
  producto: string;
  normal: number;
  con30: number;
  con50: number;
  con70: number;
}

export interface PasoFlujoLiquidacion {
  numero: number;
  titulo: string;
  detalle: string;
}

export interface KpiLiquidacion {
  nombre: string;
  descripcion: string;
  objetivo: string;
}

export interface Datasets {
  tiendas: Tienda[];
  plantas: Planta[];
  cuidados: CuidadoGrupo[];
  zonas: InfoZonaClimatica[];
  plantasEspeciales: PlantaEspecial[];
  alertas: SenalAlerta[];
  rutina: PasoRutina[];
  tips: TipExperto[];
  liquidacion: {
    reglas: ReglaLiquidacion[];
    descuentos: DescuentoEtapa[];
    precios: PrecioEjemplo[];
    flujo: PasoFlujoLiquidacion[];
    kpis: KpiLiquidacion[];
  };
}
