# DECISIONES — Refactor v2

Decisiones técnicas tomadas durante la migración a Next.js 15 que se apartan de la spec original o que merecen explicación.

## Deploy: actions/deploy-pages en vez de "Deploy from branch"

**Decisión.** El workflow `deploy-v2.yml` usa `actions/upload-pages-artifact` + `actions/deploy-pages` (modo "GitHub Actions") en lugar del flujo "Deploy from a branch: main / (root)" descrito en la spec, que implicaría commitear el output `v2/` al repo desde el bot.

**Por qué.**
1. El repo ya estaba configurado en `build_type: workflow` (verificado vía `gh api repos/marifigs/MPV/pages`). Cambiarlo a "branch deploy" requiere permisos admin que la cuenta operadora no tiene.
2. El flujo moderno evita commits ruido de `chore(v2): deploy build [skip ci]` por cada push y mantiene el historial limpio.
3. El mismo artefacto sirve los dos sitios: `/` (HTML estático legacy) + `/v2/` (Next.js build).

**Implicancia.** No hay un directorio `/v2/` físico en `main`. El output existe únicamente como artefacto que GH Pages descarga y sirve. Si se prefiere el flujo de spec (commit del build), basta con reemplazar el workflow más adelante.

## Reemplazo del workflow `static.yml` existente

**Decisión.** Borré `.github/workflows/static.yml` y creé `deploy-v2.yml`.

**Por qué.** `static.yml` referenciaba `v2/` como directorio fuente, pero no existía como código Next.js — habría fallado en cualquier push a `main`. El nuevo workflow apunta a `v2-src/` que sí es la fuente real.

## Imágenes reales: anula la regla "no inventar fotos"

**Decisión.** El cliente entregó una carpeta `plant_images/` con 83 fotos JPEG (1024×1024) durante el refactor. Las copio a `v2-src/public/plantas/{NOMBRE}/image.jpg` y las uso como `fotoUrl` cuando el nombre de la planta hace match.

**Por qué.** La spec decía "NO inventar fotos. Usar placeholder por ID." pero entregar fotos reales sí es legítimo y mejora dramáticamente la utilidad del catálogo en piso de venta.

**Cómo se hace el match.** Función `findImageFolder(nombre)` normaliza el nombre comercial ("ROSA M21" → "ROSA"), prueba prefijos progresivamente y compara contra el set de carpetas disponibles. Resultado actual: **101 / 572 plantas con foto real** (matchean varios SKUs por carpeta — la misma "ROSA" cubre M15, M21, etc.). Las 471 sin foto siguen el patrón placeholder determinístico (`hsl(hash 30% 60%)`).

## Datos: migración total del HTML, sin invenciones

**Decisión.** Migré todos los datos del `index.html` original al directorio `v2-src/data/`:
- 42 tiendas con `id`/`zona`/`tipo`
- 572 plantas con stock real por tienda (mapeado a `tienda.id`)
- 16 grupos de cuidado con frecuencia de riego por las 6 zonas climáticas
- 6 zonas climáticas con tiendas asignadas
- 6 plantas especiales (Cyclamen, Poinsettia, Orquídea, Anturio, Fuchsia, Cala)
- 10 señales de alerta + 3 pasos de rutina + 6 tips
- 3 tipos × 3 etapas + 4 precios + 6 pasos + 4 KPIs de liquidación

**No se inventó nada botánico.** Todo el texto operativo viene del HTML original; los identificadores/labels son refactorizados pero el contenido se preserva.

## Iconos: lucide-react + mapeo emoji→icon

**Decisión.** Cero emojis en componentes UI. Toda referencia visual usa lucide-react vía `lib/icons.ts`. El mapeo `emojiToIcon` está documentado para que cuando el HTML de origen menciona un emoji ("☀️ Desértico"), sepamos a qué `IconName` corresponde.

**Casos especiales:** lucide-react no tiene `Cactus`. Para "🌵 Semiárido" uso `Wheat` (sugiere clima seco). El emoji sigue apareciendo en datos legacy como `clima` en algunas etiquetas pero **nunca renderizado al UI**.

## Server Components por defecto

Todas las páginas son Server Components. Solo se marcan `'use client'` los componentes que necesitan estado o eventos del DOM:
- `top-nav` (usa `usePathname`)
- `global-search`, `plantas-explorer`, `tienda-explorer`, `rutina-checklist`
- `share-button`, `save-mi-tienda`
- Hooks `use-local-storage`, `use-mi-tienda`, `use-rutina-diaria`, `use-share`

## SSR-safe localStorage

`useLocalStorage<T>` devuelve también un flag `hydrated`. Hasta que el efecto de hidratación corre, los componentes muestran un fallback ("Cargando…" o el valor inicial). Esto evita mismatches de hidratación y flicker de "guardado/no guardado" en mobile.

## Reset de rutina en hora Chile

`useRutinaDiaria` usa `Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago' })` para detectar el cambio de día en hora local. Si el último día completado fue ayer, la racha sube; si pasó más de un día, vuelve a 1.

## Tailwind v4 con tokens en `@theme`

Usé `@import 'tailwindcss';` + `@theme { --color-* }` (config-as-CSS). No hay `tailwind.config.js`. Los tokens también se exponen como CSS custom properties `var(--color-*)` para usar en estilos arbitrarios donde sea más legible que la utility de Tailwind.

## Selector de tienda persistente

`useMiTienda` guarda solo el `tiendaId` en localStorage (key `mpv:mi-tienda`). El componente `SaveMiTienda` permite alternarlo desde la ficha de cualquier tienda. La home no muestra el atajo "tu tienda" por simplicidad (espacio limitado mobile-first); aparece dentro de `/mi-tienda`.

## Búsqueda global Cmd+K

`global-search.tsx` indexa `plantas + tiendas + zonas` con Fuse.js (peso 0.7 nombre / 0.3 meta). Resultados agrupados por tipo. Atajos: `Cmd/Ctrl+K` abre, `↑↓` navegan, `Enter` selecciona, `Esc` cierra.

## Sin PWA

La spec marca PWA como ideal pero opcional. No se implementó porque:
1. `next-pwa` es incompatible con `output: 'export'` en este momento.
2. Implementar service worker manual con `basePath: '/MPV/v2'` es delicado y suma riesgo bajo.
3. Queda como TODO documentado.
