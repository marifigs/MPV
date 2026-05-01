# TODO — pendiente para v2.x

## Datos

- **Foto para las 471 plantas restantes** (471/572 sin imagen). Hoy se renderiza placeholder hsl determinístico. Cuando lleguen más fotos a `plant_images/`, basta con re-correr el script de extracción y commit.
- **Validar SKUs y stock con un export reciente de Easy.** Los datos vienen del `index.html` original; pueden estar desactualizados.
- **Precios reales en la tabla de liquidación.** Hoy son referenciales (`liquidacion.precios`).
- **Plantas especiales (6) con foto.** Solo Cyclamen, Cala, Cyclamen, etc. — algunas tienen carpeta en `plant_images/`, podríamos linkear desde la home.

## Producto / UX

- **Vista de detalle del paso de rutina** (qué hacer paso a paso ante cada checklist item) — hoy es solo el texto.
- **Filtro por proveedor** en el catálogo (Anasac, Tramontina, Hidrosol, Bayer). Requiere agregar el campo `proveedor` al dataset de plantas.
- **QR por tienda** que abra `/mi-tienda/{id}` directamente — con `qrcode-svg` o `next/image` con QR generado al build.
- **Vista de mesas por tienda** + sugerencia de distribución por grupo.
- **Modo oscuro** (toggle en `top-nav`, persiste en localStorage).
- **Indicar fecha de última actualización del dataset** en el footer o en `/mi-tienda`.

## PWA

- Implementar service worker manual en `public/sw.js` con cache offline básico (rutas estáticas + fotos).
- `app/manifest.ts` con `start_url: '/MPV/v2/'`, ícono y `display: 'standalone'`.
- **Importante:** verificar que el SW funcione bajo `basePath: '/MPV/v2'` (es la parte delicada que llevó a no incluirlo en el MVP).

## Performance / Accesibilidad

- Auditoría Lighthouse mobile en `/`, `/plantas`, `/plantas/[id]`. Objetivo: 95+ en las 4 categorías.
- Lazy-load de fotos: hoy solo `loading="lazy"`. Considerar `IntersectionObserver` para cards fuera de viewport.
- Revisar contraste AAA en `--color-ink-soft` sobre `--color-surface-2` (puede estar en AA, no AAA).
- Test con teclado completo: Tab, Shift+Tab, Esc en modales, Enter en cards-link.

## Operaciones

- **Documentar el flujo de actualización de datos**: cuando lleguen Excel nuevos de Easy, cómo regenerar `data/*.json`. Hoy hay un script en `/tmp` que se borra; convertir a `v2-src/scripts/build-data.mjs` versionado.
- **Versioning de datasets**: agregar fecha de generación al header de cada JSON.
- **Smoke test post-deploy**: gh action que verifique status 200 en URLs clave después del deploy.

## Limpieza

- Borrar `plant_images/` de la raíz del repo si no se quiere mantener como source of truth (ya están copiadas a `v2-src/public/plantas/`). Decidir cuál es la fuente canónica.
- Migrar `vercel.json` o eliminarlo si ya no se usa Vercel.
