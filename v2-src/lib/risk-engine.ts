/**
 * Motor de riesgo de inventario — PlantasFácil Easy
 *
 * Reemplaza la tabla estática ALERTAS_ZONA con un score calculado desde los datos.
 *
 * Score (0–100) = vulnerabilidad (85%) + peso negocio stock (15%)
 *
 * Componentes de vulnerabilidad:
 *   heatStress  — frecuencia de riego × amplificador de zona × estación
 *   coldStress  — sensibilidad al frío × amplificador de zona × estación
 *   rotStress   — riesgo de pudrición por exceso de agua (solo frio-humedo)
 *
 * Pesos: heat 40% · cold 20% · rot 40%
 * Niveles: ≥ 45 → critica · ≥ 20 → media · < 20 → leve (< 18 filtrado)
 */

import type { ZonaClimatica, GrupoCuidado } from '@/types/data';
import { cuidados } from '@/data';

// ── Frequency parser ──────────────────────────────────────────────────────────
// Returns mean interval in days. Lower days = more frequent watering = higher drought risk.
export function parseDiasFrecuencia(freq: string): number {
  // Strip emojis, asterisks and non-essential chars
  const f = freq.replace(/[^\w\s/\-.]/g, '').trim().toLowerCase();
  if (f.startsWith('2x') || f.includes('veces'))  return 0.5; // "2x/día" = 0.5d
  if (f === 'diario')                               return 1;
  const m = f.match(/cada\s*(\d+\.?\d*)\s*-?\s*(\d+\.?\d*)?\s*d/);
  if (m) {
    const lo = parseFloat(m[1]);
    const hi = m[2] ? parseFloat(m[2]) : lo;
    return (lo + hi) / 2;
  }
  return 7; // conservative fallback
}

// ── Zone profiles ─────────────────────────────────────────────────────────────
// calor: amplifies heat/drought stress  |  frio: amplifies cold damage stress
const ZONA_PERFIL: Record<ZonaClimatica, { calor: number; frio: number }> = {
  desertico:      { calor: 2.0, frio: 0.1 },
  semiarido:      { calor: 1.5, frio: 0.3 },
  costero:        { calor: 1.1, frio: 0.6 },
  templado:       { calor: 1.0, frio: 0.7 },
  montana:        { calor: 0.7, frio: 1.8 },
  'frio-humedo':  { calor: 0.5, frio: 1.5 },
};

// ── Cold sensitivity per group (0 = none, 2 = critical) ──────────────────────
const FRIO_SENS: Partial<Record<GrupoCuidado, number>> = {
  'PLANTA INTERIOR FOLL': 2.0,
  'PLANTA INTERIOR FLOR': 2.0,
  'PLANTA INTERIOR COLG': 1.6,
  'PLANTIN PRIMAV/VERAN': 1.4,
  'FLORALES':             1.2,
  'HERBACEAS PERENES':    0.8,
  'PLANTA INTERIOR CORT': 0.6,
  'HERBACEAS AROMÁTICAS': 0.6,
  'ARBUSTIVA DE FLOR':    0.5,
};

// ── Seasonal factors — hemisphere sur ─────────────────────────────────────────
// Dic–Feb = verano (calor ↑, frío ↓)  |  Jun–Ago = invierno (calor ↓, frío ↑)
export function factorEstacional(mes: number): { calor: number; frio: number } {
  if ([12, 1, 2].includes(mes))  return { calor: 1.5, frio: 0.3 };
  if ([11, 3].includes(mes))     return { calor: 1.2, frio: 0.6 };
  if ([10, 4].includes(mes))     return { calor: 0.9, frio: 0.9 };
  if ([9,  5].includes(mes))     return { calor: 0.6, frio: 1.2 };
  return                                  { calor: 0.4, frio: 1.5 }; // Jun–Ago
}

// ── Output types ──────────────────────────────────────────────────────────────
export type NivelRiesgo     = 'critica' | 'media' | 'leve';
export type FactorPrincipal = 'calor' | 'frio' | 'exceso-agua';

export interface RiesgoGrupo {
  grupo:           GrupoCuidado;
  nivel:           NivelRiesgo;
  puntuacion:      number;        // 0–100
  frecuenciaZona:  string;        // e.g. "Cada 2d"
  factorPrincipal: FactorPrincipal;
  accion:          string;        // action/alert text from cuidados data
  plantasGrupo:    Array<{ id: string; nombre: string; stock: number }>;
  unidades:        number;
}

// ── Main export ────────────────────────────────────────────────────────────────
export function calcularRiesgosTienda(
  zona: ZonaClimatica,
  plantasDeTienda: Array<{ id: string; nombre: string; grupo: string; stock: number }>,
  mes: number = new Date().getMonth() + 1,
): RiesgoGrupo[] {
  const estacional = factorEstacional(mes);
  const zonaPerfil = ZONA_PERFIL[zona];
  const esHumedo   = zona === 'frio-humedo';

  // ── Group plants by grupo ─────────────────────────────────────────────────
  const porGrupo = new Map<GrupoCuidado, typeof plantasDeTienda>();
  for (const p of plantasDeTienda) {
    const g = p.grupo as GrupoCuidado;
    if (!porGrupo.has(g)) porGrupo.set(g, []);
    porGrupo.get(g)!.push(p);
  }

  const resultados: RiesgoGrupo[] = [];

  for (const [grupo, plantas] of porGrupo.entries()) {
    const cuidado = cuidados.find((c) => c.grupo === grupo);
    if (!cuidado) continue;

    const unidades = plantas.reduce((acc, p) => acc + p.stock, 0);
    if (unidades === 0) continue;

    const frecuenciaZona = cuidado.frecuenciaPorZona[zona] ?? 'Cada 3d';
    const dias           = parseDiasFrecuencia(frecuenciaZona);

    // ── Component 1: heat/drought stress (0–1) ───────────────────────────────
    // baseVuln = 1/dias → daily watering = 1.0, weekly = 0.14
    const baseVuln   = Math.min(1, 1 / dias);
    const heatStress = Math.min(1, baseVuln * zonaPerfil.calor * estacional.calor);

    // ── Component 2: cold damage stress (0–1) ───────────────────────────────
    const frioSens   = (FRIO_SENS[grupo] ?? 0.2) / 2; // normalize to 0–1
    const coldStress = Math.min(1, frioSens * zonaPerfil.frio * estacional.frio);

    // ── Component 3: waterlogging / rot stress (frio-humedo only) (0–1) ─────
    // Plants needing INFREQUENT watering are most at risk from rain/overwatering.
    // Formula: (dias - 2) / 12 so that dias=2 → 0, dias=14 → 1.0
    const rotStress = esHumedo
      ? Math.min(1, Math.max(0, (dias - 2) / 12) * estacional.frio)
      : 0;

    // ── Combined vulnerability (0–1) ─────────────────────────────────────────
    const vulnerabilidad = heatStress * 0.40 + coldStress * 0.20 + rotStress * 0.40;

    // ── Business weight: log scale so 1u→0.0, 10u→0.5, 100u→1.0 ─────────────
    const stockPeso = Math.min(1, Math.log10(unidades + 1) / 2);

    // ── Final score 0–100 ─────────────────────────────────────────────────────
    const puntuacion = Math.round(vulnerabilidad * 85 + stockPeso * 15);

    // ── Risk level thresholds ─────────────────────────────────────────────────
    const nivel: NivelRiesgo =
      puntuacion >= 45 ? 'critica' :
      puntuacion >= 20 ? 'media'   : 'leve';

    // ── Dominant factor ───────────────────────────────────────────────────────
    const factorPrincipal: FactorPrincipal =
      rotStress  >= heatStress && rotStress  >= coldStress ? 'exceso-agua' :
      coldStress >  heatStress                             ? 'frio'        : 'calor';

    // ── Action from cuidados data (strip leading emoji) ───────────────────────
    const accion = cuidado.alerta.replace(/^[^\p{L}\d(]*/u, '').trim();

    resultados.push({
      grupo, nivel, puntuacion,
      frecuenciaZona, factorPrincipal,
      accion,
      plantasGrupo: plantas,
      unidades,
    });
  }

  // ── Sort: critica → media → leve, then by score desc; filter noise ─────────
  return resultados
    .filter((r) => r.puntuacion >= 18)
    .sort((a, b) => {
      const ord: Record<NivelRiesgo, number> = { critica: 0, media: 1, leve: 2 };
      return ord[a.nivel] - ord[b.nivel] || b.puntuacion - a.puntuacion;
    });
}
