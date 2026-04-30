# 🗺️ ROADMAP — PlantasFácil Easy

## Estado actual (v1.0)

✅ App HTML estática completa con 7 secciones  
✅ 572 plantas con stock real por tienda  
✅ 42 tiendas con clima y tipo  
✅ Fichas de cuidado por grupo de planta  
✅ Frecuencia de riego por zona climática  
✅ Sección de liquidación con flujo completo  
✅ Deploy en Vercel con auto-deploy via GitHub  

---

## Mejoras pendientes / ideas

### 🔴 Alta prioridad

- [x] **Deploy en GitHub Pages** — GitHub Actions despliega automáticamente en cada push a `main`
- [ ] **Actualización de stock desde Excel** — flujo para subir nuevo Excel y regenerar datos sin tocar código
- [ ] **Precios reales en tabla de liquidación** — conectar con precios reales del sistema Easy

### 🟡 Media prioridad

- [ ] **PWA / installable** — agregar `manifest.json` y service worker para que funcione offline y se instale como app en el celular del vendedor
- [ ] **Filtro por proveedor** — en el catálogo de plantas, filtrar por Anasac, Tramontina, Hidrosol, Bayer, etc.
- [ ] **Vista de mesas por tienda** — mostrar cuántas mesas tiene cada tienda y sugerir distribución por grupo
- [ ] **QR por tienda** — generar QR code que lleve directo a la vista de esa tienda específica
- [ ] **Calculadora de riego** — dado el clima y la planta, calcular próxima fecha de riego

### 🟢 Baja prioridad / ideas futuras

- [ ] **Modo oscuro** — toggle de tema oscuro/claro
- [ ] **Notificaciones push** — recordatorio de riego (requiere backend)
- [ ] **Registro de merma** — formulario simple para que el vendedor registre merma desde la app
- [ ] **Dashboard de merma** — vista agregada de merma por tienda y grupo (requiere backend/DB)
- [ ] **Fotos de plantas** — agregar imagen referencial a cada ficha de planta
- [ ] **Chatbot de diagnóstico** — "mi planta tiene X síntoma" → diagnóstico y solución
- [ ] **Integración con Revionics** — precios de liquidación sugeridos por algoritmo

---

## Historial de versiones

### v1.0 — Abril 2025
- Launch inicial con 6 secciones
- Datos de 572 plantas y 42 tiendas
- Deploy en Vercel

### v1.1 — Abril 2025
- Agregada sección de Liquidación (7a pestaña)
- Rediseño a tema blanco/claro
- Nuevas reglas de riego y luz en sección Inicio
- Unificación de paleta de colores (verde Easy)

---

## Estructura para Claude Code

Este proyecto es un **archivo HTML único** (`index.html`).  
Todo el CSS, JS y datos están embebidos en ese archivo.

### Variables JS globales principales
```js
const TIENDAS = [...]          // 42 tiendas
const PLANTAS = [...]          // 572 plantas con stock
const CUIDADOS = {...}         // fichas por grupo
const CLIMA_INFO = {...}       // info por zona climática
const PLANTAS_ESPECIALES = {...} // plantas con cuidados críticos
```

### Funciones JS principales
```js
showSection(id)        // navegar entre pestañas
showTienda(nombre)     // abrir detalle de tienda
hideTienda()           // volver al listado
showPlanta(sku)        // abrir ficha de planta
hidePlanta()           // volver al catálogo
filterTiendas()        // filtrar tiendas por búsqueda/clima
filterPlantas()        // filtrar plantas por búsqueda/grupo/subrubro
renderClimas()         // renderizar cards de climas
showClima(climaKey)    // abrir detalle de clima
renderAlertas()        // renderizar señales de alerta
renderRutina()         // renderizar checklist de rutina
renderEspeciales()     // renderizar plantas especiales en Inicio
toggleGrupo(header)    // expandir/colapsar grupo en vista tienda
```

### CSS Custom Properties (variables)
Definidas en `:root` al inicio del `<style>`.  
Ver `CONTEXTO.md` → sección "Paleta de colores".
