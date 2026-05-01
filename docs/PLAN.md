# PLAN — Refactor v2 a Next.js 15 static export

## Objetivo

Migrar el manual operativo `index.html` (HTML+CSS+JS único, 1756 líneas, 761 KB) a una app Next.js 15 con static export desplegada en `marifigs.github.io/MPV/v2/`. El sitio actual en `marifigs.github.io/MPV/` debe quedar **intacto**.

## Estructura final del repo

```
/                        ← HTML estático actual (intocable)
  index.html
  vercel.json
  README.md, CLAUDE.md, CONTEXTO.md, DATOS.md, DEPLOY.md, ROADMAP.md
/v2-src/                 ← código fuente Next.js (no servido)
  package.json
  next.config.mjs
  tsconfig.json
  app/
  components/
  data/
  types/
  lib/
  public/
/v2/                     ← output del build estático (servido por GH Pages)
/.github/workflows/deploy-v2.yml
/docs/
  PLAN.md
  DECISIONS.md
  TODO.md
```

## Stack

- Next.js 15 (App Router) + TypeScript estricto
- Static export (`output: 'export'`, `basePath: '/MPV/v2'`)
- Tailwind v4 (PostCSS plugin)
- next/font con Inter (body) + Source Serif 4 (display)
- lucide-react (sin emojis en UI)
- Fuse.js para búsqueda
- localStorage vía hooks SSR-safe
- pnpm como gestor de paquetes

## Datos a migrar

Extraídos de `index.html` y verificados:

| Dataset | Cantidad | Origen |
|---|---|---|
| Tiendas | 42 | `const TIENDAS` |
| Plantas | 572 | `const PLANTAS` (con stock por tienda) |
| Grupos de cuidado | 16 | `const CUIDADOS` (riego/luz/frecuencia por clima) |
| Climas | 6 | `const CLIMA_INFO` |
| Plantas especiales | 6 | `const PLANTAS_ESPECIALES` |
| Alertas | 10 | array `signals` |
| Rutina diaria | 3 pasos | array `steps` |
| Tips del experto | 6 | array `tips` |
| Liquidación | 3 tipos × 3 etapas + tabla precios + 6 pasos + 4 KPIs | sección HTML |

## Rutas

```
/                              hero + 3 reglas de oro + plantas especiales
/mi-tienda                     selector con persistencia localStorage
/mi-tienda/[tiendaId]          vista de tienda
/plantas                       catálogo + búsqueda + filtros
/plantas/[plantaId]            ficha de planta
/climas                        grid de zonas climáticas
/climas/[zonaId]               detalle de zona
/alertas                       señales de alerta
/rutina                        checklist con racha
/liquidacion                   proceso completo
```

## Fases (commits)

1. `chore: add v2 refactor plan` — este documento
2. `feat(v2): bootstrap Next.js 15 with static export config`
3. `feat(v2): design system tokens and base UI components`
4. `feat(v2): data schemas and seed datasets`
5. `feat(v2): pages and routing with migrated content`
6. `feat(v2): search, persistence, checklist, share`
7. `ci: github actions workflow for v2 deploy`
8. `chore(v2): polish, accessibility, docs`
9. PR a `main`

## Reglas

- No tocar `index.html` ni el resto de archivos de la raíz.
- Sin invenciones de datos botánicos ni fotos.
- Sin emojis en componentes (solo en datos cuando vienen del original).
- Mobile-first absoluto, botones táctiles ≥48×48px, body ≥17px.
- Server Components por defecto.
