# PLAN.md — Refactor MPV → Plataforma Operativa Premium
**Versión:** 0.1 — FASE 0  
**Fecha:** 2026-04-30  
**Estado:** Pendiente aprobación del cliente

---

## 1. Hallazgos FASE 0

### 1.1 Estructura del repositorio actual

```
MPV/
├── index.html          # App completa (1756 líneas: HTML + CSS + JS + datos)
├── vercel.json         # Config Vercel static deploy
├── .github/
│   └── workflows/
│       └── static.yml  # Deploy a GitHub Pages en push a main
├── docs/               # (nuevo — creado en FASE 0)
├── CLAUDE.md           # Instrucciones para Claude Code
├── CONTEXTO.md         # Contexto negocio
├── DATOS.md            # Documentación datos
├── DEPLOY.md           # Instrucciones deploy
├── README.md           # Visión general
└── ROADMAP.md          # Roadmap v1.x
```

**Sin:** package.json, node_modules, tsconfig, build pipeline, imágenes, SVGs, manifest.json, CNAME, favicon.

### 1.2 Stack actual

| Capa | Actual |
|------|--------|
| Framework | Ninguno. HTML plano. |
| CSS | Vanilla CSS con custom properties en `:root` |
| JS | Vanilla JS. Sin módulos. Sin bundler. |
| Tipografía | Google Fonts CDN (Plus Jakarta Sans + Fraunces) |
| Build | Sin build step — `open index.html` funciona |
| Deploy | GitHub Pages via Actions / Vercel static |
| Package manager | Ninguno |
| TypeScript | No |
| Tests | No |
| PWA | No (sin manifest, sin service worker) |

### 1.3 Inventario de datos

#### PLANTAS — 572 objetos
```ts
// Schema actual (extraído del JS)
{
  sku: number,          // ej: 1266293 — único, rango 1062419–1514115
  nombre: string,       // ej: "ORQUIDEA PHALAENOPSIS MACETERO 5 PULGADA"
  grupo: string,        // 16 valores posibles (ver abajo)
  subrubro: string,     // "PLANTAS DE EXTERIOR" | "PLANTAS DE INTERIOR"
  total: number,        // stock total todas las tiendas
  stock: Record<string, number>  // { "EASY KENNEDY": 3, ... }
}
```

**Distribución por grupo:**
| Grupo | Cantidad |
|-------|---------|
| PLANTIN OTOÑ/INVIER | 177 |
| PLANTIN PRIMAV/VERAN | 144 |
| PLANTA INTERIOR FOLL | 89 |
| ARBUSTIVA DE FLOR | 52 |
| PLANTA INTERIOR FLOR | 33 |
| FLORALES | 26 |
| ARBOLES FOLLAJE | 9 |
| ARBOLES FRUTALES | 9 |
| HERBACEAS PERENES | 10 |
| ARBUSTIVA FOLLAJE | 12 |
| ARBUSTIVA TREPADORAS | 1 |
| PLANTA INTERIOR COLG | 1 |
| PLANTA INTERIOR CORT | 1 |
| HERBACEAS CACTUS | 4 |
| HERBACEAS AROMÁTICAS | 2 |
| ARBOLES PALMERAS | 2 |

**Distribución por subrubro:** 422 exterior / 150 interior  
**Stock:** 571/572 plantas tienen stock > 0

⚠️ **GAP CRÍTICO:** Las plantas NO tienen datos individuales de cuidado (riego, luz, alertas). Toda esa información vive en `CUIDADOS` por grupo. La ficha de planta hereda del grupo. El schema TypeScript del brief requiere campos que hoy NO existen por planta.

#### TIENDAS — 42 objetos
```ts
{
  nombre: string,   // ej: "EASY KENNEDY"
  clima: string,    // con emoji: "🌤️ Templado"
  tipo: "PEQ" | "MED" | "GRA"
}
```

⚠️ **GAP:** Sin id slug, ciudad, región, dirección.

#### CUIDADOS — 16 grupos
Por grupo: `luz`, `riego`, `frecuencia` (por zona climática), `tips[]`, `estructura`, `alerta`, `color`.  
**Esto ES el contenido botánico real.** No hay datos por planta individual.

#### CLIMA_INFO — 6 zonas
Por zona: `titulo`, `descripcion`, `riego_general`, `tips_zona`, `alerta_zona`, `color`, `tiendas[]`.

#### PLANTAS_ESPECIALES — 6 plantas críticas
Cyclamen, Poinsettia, Orquídea, Anturio, Fuchsia, Cala — con cuidados y advertencias propias.

#### Contenido editorial (inline en HTML)
- 3 Reglas de Oro — texto completo, rico
- 10 señales de alerta
- 3 turnos rutina diaria + 6 tips de experto
- Proceso liquidación: 3 tipos × 3 etapas, tabla precios, flujo 5 pasos, zona liquidación
- Copy de todos los heroes y secciones

### 1.4 Activos visuales

| Asset | Estado |
|-------|--------|
| Fotos de plantas | ❌ No existen |
| Logo | Emoji 🌿 + CSS (no hay SVG) |
| Favicon | ❌ No declarado |
| Manifest PWA | ❌ No existe |
| Íconos UI | Emojis inline en HTML |
| Fuentes | Google Fonts CDN |

---

## 2. Plan de migración por fases

### Estimación de tiempo

| Fase | Descripción | Estimación | Riesgo |
|------|-------------|-----------|--------|
| 0 | Análisis (actual) | ✅ Completo | — |
| 1 | Bootstrap Next.js 15 + TS + Tailwind v4 | 1–2h | Bajo |
| 2 | Sistema de diseño + componentes base | 3–5h | Medio |
| 3 | Modelo de datos + migración dataset | 2–4h | **Alto** |
| 4 | Páginas y rutas App Router | 5–8h | Medio |
| 5 | Funcionalidad clave (search, persistencia) | 3–5h | Medio |
| 6 | PWA + offline | 2–3h | Medio |
| 7 | Polish, a11y, Lighthouse, deploy | 3–4h | Bajo |
| **Total** | | **19–31h** | |

### Arquitectura objetivo

```
v2/                          # Next.js 15 app (en subdirectorio)
├── app/
│   ├── layout.tsx
│   ├── page.tsx             # Inicio: 3 reglas + hero + especiales
│   ├── mi-tienda/
│   │   ├── page.tsx         # Selector + persistencia localStorage
│   │   └── [tiendaId]/
│   │       └── page.tsx     # Vista tienda: riego por clima + plantas
│   ├── plantas/
│   │   ├── page.tsx         # Catálogo: search + filtros
│   │   └── [plantaId]/
│   │       └── page.tsx     # Ficha planta
│   ├── climas/
│   │   ├── page.tsx
│   │   └── [zonaId]/
│   │       └── page.tsx
│   ├── alertas/
│   │   └── page.tsx
│   ├── rutina/
│   │   └── page.tsx         # Checklist con persistencia + racha
│   ├── liquidacion/
│   │   └── page.tsx
│   ├── offline/
│   │   └── page.tsx
│   ├── manifest.ts
│   └── robots.ts
├── components/
│   ├── ui/                  # shadcn/ui (solo los usados)
│   ├── PlantCard.tsx
│   ├── StoreCard.tsx
│   ├── ClimateCard.tsx
│   ├── SearchBar.tsx
│   ├── Checklist.tsx
│   └── DiscountBadge.tsx
├── data/
│   ├── plantas.json         # 572 plantas migradas
│   ├── tiendas.json         # 42 tiendas
│   ├── cuidados.json        # 16 grupos
│   ├── climas.json          # 6 zonas
│   ├── alertas.json         # 10 señales
│   ├── rutina.json          # 3 turnos + tips
│   └── especiales.json      # 6 plantas críticas
├── types/
│   ├── planta.ts
│   ├── tienda.ts
│   └── clima.ts
├── lib/
│   ├── icons.ts             # Mapeo emoji → lucide
│   └── search.ts            # Fuse.js config
├── hooks/
│   ├── useMiTienda.ts
│   └── useRutinaDiaria.ts
└── scripts/
    └── validate-data.ts
```

### Decisiones de diseño del modelo de datos

**Problema:** Las plantas no tienen datos individuales de cuidado. El brief pide `riego`, `luz`, `alertasComunes` por planta. Pero esa información solo existe a nivel de **grupo** (CUIDADOS).

**Decisión propuesta:** El schema TypeScript para `Planta` usará una referencia al grupo:
```ts
interface Planta {
  // ... campos actuales migrados
  grupoKey: string;  // FK a CUIDADOS
  // Los campos riego, luz, alertas se RESUELVEN en runtime via CUIDADOS[grupoKey]
  // NO duplicar — DRY
}
```

Esto preserva consistencia: si los cuidados de un grupo cambian, todas las plantas del grupo se actualizan.

**Alternativa:** Desnormalizar (copiar cuidados a cada planta) — más rápido en runtime pero inconsistente en mantenimiento. **No recomendado.**

---

## 3. Riesgos identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| Dataset de plantas sin datos individuales (riego/luz) | **Confirmado** | Alto | Modelo por grupo + resolución en runtime |
| Sin fotos de plantas → UX degradada en catálogo | **Confirmado** | Medio | Placeholders determinísticos por SKU con color del grupo |
| Tiendas sin slug/ciudad/región | **Confirmado** | Medio | Generar slug desde nombre, ciudad a confirmar |
| Tailwind v4 + shadcn/ui: compatibilidad | Posible | Medio | shadcn soporta v4 desde su actualización 2025 |
| next-pwa con Next.js 15 App Router | Posible | Medio | Alternativa: @ducanh2912/next-pwa o serwist |
| Stock data es snapshot estático → se desactualiza | **Confirmado** | Alto | Diseñar data layer para fácil reemplazo |
| Señal intermitente en piso → requiere offline real | **Confirmado** | Alto | PWA desde Fase 6, offline-first en cache |

---

## 4. Criterios de cutover (GitHub Pages → Vercel v2)

El sitio antiguo en `https://marifigs.github.io/MPV/` NO se toca hasta que:
1. Todas las fases 1–7 completadas y aprobadas
2. Lighthouse mobile ≥ 95 en todas las páginas
3. Prueba offline funcional en Chrome DevTools + dispositivo real
4. Revisión del cliente de contenido completo (sin pérdida editorial)
5. Deploy en Vercel preview aprobado

---

## 5. Preguntas críticas (ver sección de reporte)

Ver chat — 5 preguntas enviadas al cliente para respuesta antes de Fase 1.
