# 📋 CONTEXTO DEL PROYECTO — PlantasFácil Easy

## Cliente y contexto de negocio

- **Empresa:** Easy Chile — retail de mejoramiento del hogar del grupo Cencosud S.A.
- **Usuario final:** Vendedores en piso de las 42 tiendas a lo largo de Chile
- **Responsable del proyecto:** Fer — National Lead de la categoría Terrazas y Jardín
- **Objetivo:** Reducir merma de plantas vivas y mejorar la presentación del área

## El problema que resuelve

Las plantas vivas son productos sensibles que se deterioran si no se cuidan correctamente.
Los vendedores no siempre tienen la formación ni las instrucciones claras para:
1. Saber con qué frecuencia regar (varía mucho por clima: Arica vs Puerto Montt)
2. Ubicar las plantas correctamente (sol directo vs sombra)
3. Detectar señales de deterioro a tiempo
4. Gestionar la liquidación de plantas próximas a perderse

## Principios de diseño UX

- **Lenguaje simple y directo** — es para vendedores, no especialistas
- **No muy largo** — deben poder encontrar la info en segundos
- **Visual y claro** — colores, emojis e íconos para identificar rápido
- **Mobile-first** — los vendedores usan principalmente el celular

## Paleta de colores del sistema de diseño

```css
--bg: #f7f9f5          /* Fondo general */
--surface: #ffffff      /* Cards y paneles */
--green: #2d7a3a       /* Color primario — verde Easy */
--green2: #3a9649      /* Verde secundario */
--green-light: #e8f5e2 /* Verde muy claro para fondos */
--green-pale: #f0faf0  /* Verde pálido para highlights */
--border: #dde8d5      /* Bordes suaves */
--border2: #c8ddbf     /* Bordes con más contraste */
--text: #1a2e1a        /* Texto principal */
--text2: #3d5c3d       /* Texto secundario */
--text3: #7a9a7a       /* Texto terciario / subtítulos */
--text4: #a8bfa8       /* Texto muy suave / labels */
```

## Tipografía

- **Títulos y headings:** `Fraunces` (serif, display) — elegante y botánico
- **Texto y UI:** `Plus Jakarta Sans` — moderno y muy legible
- Ambas cargadas desde Google Fonts

## Estructura de datos (embebida en index.html)

### TIENDAS (array de 42 objetos)
```js
{ nombre: "EASY ANTOFAGASTA", clima: "☀️ Desértico", tipo: "MED" }
```

### PLANTAS (array de 572 objetos)
```js
{
  sku: 123456,
  nombre: "ORQUIDEA PHALAENOPSIS MACETERO 5 PULGADA",
  grupo: "HERBACEAS PERENES",       // 16 grupos posibles
  subrubro: "PLANTAS DE INTERIOR",  // o "PLANTAS DE EXTERIOR"
  total: 45,                        // stock total todas las tiendas
  stock: { "EASY KENNEDY": 3, "EASY MAIPU": 7, ... }
}
```

### CUIDADOS (objeto keyed por grupo)
```js
{
  "HERBACEAS PERENES": {
    luz: "...",
    riego: "...",
    frecuencia: { "☀️ Desértico": "Diario", "🌤️ Templado": "Cada 2-3d", ... },
    tips: ["...", "..."],
    estructura: "...",
    alerta: "...",
    color: "#4CAF50"
  }
}
```

### CLIMA_INFO (objeto keyed por clima)
```js
{
  "☀️ Desértico": {
    titulo, descripcion, riego_general, tips_zona, alerta_zona, color, tiendas: [...]
  }
}
```

### PLANTAS_ESPECIALES (plantas con cuidados críticos)
Fuchsia, Poinsettia, Orquídea, Anturio, Cala — tienen instrucciones urgentes específicas.

## Decisiones técnicas

| Decisión | Razón |
|---|---|
| Todo en un solo `index.html` | Máxima simplicidad para deploy y mantenimiento |
| Sin frameworks (React/Vue) | No hay build step, funciona con `open index.html` |
| Datos embebidos en JS | No requiere backend ni API. Los datos vienen de Excel procesado con Python |
| Vanilla JS | Simplicidad total, sin dependencias |
| Vercel static | Deploy gratuito, auto-deploy con git push |

## Zonas climáticas de Chile (las 6 del sistema)

| Emoji | Zona | Tiendas ejemplo | Riesgo principal |
|---|---|---|---|
| ☀️ | Desértico | Antofagasta, Calama, Arica | Deshidratación rápida |
| 🌵 | Semiárido | La Serena | Calor en verano |
| 🌊 | Costero | Valparaíso, Viña, Quillota | Viento salino |
| 🌤️ | Templado | Santiago (mayoría) | Olas de calor |
| ⛰️ | Montaña | Los Andes | Heladas en invierno |
| 🌧️ | Frío Húmedo | Temuco, Puerto Montt, Osorno | Hongos y pudrición |

## 16 Grupos de plantas del sistema

1. ARBOLES FOLLAJE
2. ARBOLES FRUTALES
3. ARBOLES PALMERAS
4. ARBUSTIVA DE FLOR
5. ARBUSTIVA FOLLAJE
6. ARBUSTIVA TREPADORAS
7. FLORALES
8. HERBACEAS AROMÁTICAS
9. HERBACEAS CACTUS
10. HERBACEAS PERENES
11. PLANTA INTERIOR COLG (colgantes)
12. PLANTA INTERIOR CORT (porte grande/cortina)
13. PLANTA INTERIOR FLOR
14. PLANTA INTERIOR FOLL (follaje)
15. PLANTIN OTOÑ/INVIER
16. PLANTIN PRIMAV/VERAN
