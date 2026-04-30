# 🤖 INSTRUCCIONES PARA CLAUDE CODE

## Contexto rápido

Eres el asistente de desarrollo de **PlantasFácil Easy** — una app web para vendedores de Easy Chile (Cencosud S.A.) que les enseña a cuidar plantas vivas en tienda.

**Lee estos archivos en este orden:**
1. `README.md` — visión general del proyecto
2. `CONTEXTO.md` — negocio, datos, decisiones técnicas
3. `DATOS.md` — estructura de datos y cómo actualizarlos
4. `ROADMAP.md` — qué hay hecho y qué falta
5. `DEPLOY.md` — cómo hacer deploy en Vercel

## El archivo principal

**Todo el proyecto vive en `index.html`** — un único archivo con HTML + CSS + JS.

No hay:
- Build process (no webpack, vite, etc.)
- Frameworks (no React, Vue, etc.)
- Backend (no API, no base de datos)
- Archivos separados de CSS o JS

## Cómo trabajar con este proyecto

### Para modificar contenido visual
- Editar el HTML/CSS dentro de `index.html`
- Las secciones estáticas están en el `<body>` (buscá `<!-- INICIO -->`, `<!-- LIQUIDACIÓN -->`, etc.)
- El CSS está en el `<style>` al inicio del `<head>`

### Para modificar datos
- Las variables globales JS están al inicio del `<script>` al final del body
- `TIENDAS`, `PLANTAS`, `CUIDADOS`, `CLIMA_INFO`, `PLANTAS_ESPECIALES`

### Para agregar una nueva sección/pestaña
1. Agregar botón en el `<nav>` del header:
   ```html
   <button class="nav-btn" onclick="showSection('nueva')">🆕 Nueva</button>
   ```
2. Agregar sección en el `<main>`:
   ```html
   <section id="sec-nueva" class="section">
     <!-- contenido -->
   </section>
   ```
3. Si necesita lógica JS, agregar función `renderNueva()` y llamarla al final del script.

### Para hacer deploy
```bash
git add .
git commit -m "descripción del cambio"
git push
# Vercel auto-redeploy en ~30s
```

## Paleta de colores (NO cambiar sin autorización)

```css
--green: #2d7a3a        /* Verde primario Easy */
--green-pale: #f0faf0   /* Fondos suaves */
--green-light: #e8f5e2  /* Backgrounds de cards */
--border2: #c8ddbf      /* Bordes con acento verde */
```

El fondo general es **blanco** (#f7f9f5). El tema es **claro** (light mode).

## Tipografía (NO cambiar)

- Títulos: **Fraunces** (serif)
- Texto: **Plus Jakarta Sans** (sans-serif)
- Cargadas desde Google Fonts en el `<head>`

## Reglas de estilo del proyecto

1. **Lenguaje simple** — es para vendedores, no técnicos ni especialistas
2. **No muy largo** — cada sección debe ser escaneable en segundos
3. **Verde Easy** — paleta verde oscuro consistente con la marca
4. **Mobile-first** — las tarjetas deben funcionar bien en celular

## Contacto del proyecto

- **Responsable:** Fer (National Lead Terrazas y Jardín, Easy Chile)
- **Empresa:** Cencosud S.A.
