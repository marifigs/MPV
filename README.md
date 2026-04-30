# 🌿 PlantasFácil Easy — Manual de Plantas Vivas

Aplicación web estática para vendedores de Easy Chile (Cencosud S.A.).
Guía interactiva de cuidado de plantas vivas para las 42 tiendas a lo largo de Chile.

## Stack

- **Frontend:** HTML + CSS + JS vanilla (sin frameworks, sin build step)
- **Deploy:** Vercel (static site)
- **Datos:** Embebidos en el JS del `index.html` (extraídos de Excel con Python)

## Estructura del proyecto

```
MPV/
├── index.html          # App completa (HTML + CSS + JS todo-en-uno)
├── vercel.json         # Configuración de deploy en Vercel
├── README.md           # Este archivo
├── CONTEXTO.md         # Contexto de negocio y decisiones de diseño
├── DATOS.md            # Documentación de los datos embebidos
└── ROADMAP.md          # Funcionalidades pendientes y mejoras
```

## Cómo correr localmente

```bash
# Opción 1: abrir directamente en el browser
open index.html

# Opción 2: servidor local con Python
python -m http.server 3000
# luego abrir http://localhost:3000

# Opción 3: con Node
npx serve .
```

## Deploy en Vercel

El proyecto usa GitHub + Vercel con auto-deploy:
1. Cada `git push` a `main` dispara un nuevo deploy automáticamente
2. Vercel sirve `index.html` como archivo raíz

```bash
# Flujo de actualización
git add .
git commit -m "descripción del cambio"
git push
# Vercel redespliega en ~30 segundos
```

## Secciones de la app

| Pestaña | Descripción |
|---|---|
| 🏠 Inicio | Reglas de oro, tips de riego y luz, plantas especiales |
| 🏪 Mi Tienda | Selector de tienda → frecuencia de riego + plantas vigentes con stock |
| 🌱 Plantas | Catálogo de 572 plantas con fichas de cuidado |
| 🌍 Climas | Guía por zona climática (6 zonas) |
| ⚠️ Alertas | 10 señales de alerta y qué hacer |
| 📋 Rutina | Checklist diario apertura/mediodía/cierre |
| 🏷️ Liquidación | Proceso completo de liquidación con 3 etapas |

## Datos

- **42 tiendas** con clima, tipo (PEQ/MED/GRA) y número de mesas
- **572 plantas** con SKU, grupo, subrubro y stock por tienda
- **6 zonas climáticas:** Desértico, Semiárido, Costero, Templado, Montaña, Frío Húmedo
- **16 grupos de plantas** con fichas de cuidado completas
