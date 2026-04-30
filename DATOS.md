# 📊 DATOS DEL PROYECTO

## Origen de los datos

Los datos provienen de 2 archivos Excel procesados con Python (pandas + openpyxl):

| Archivo | Contenido | Registros |
|---|---|---|
| `TIENDAS_EASY_PLANTAS.xlsx` | Lista de tiendas con clima y tipo | 42 tiendas |
| `STOCK_PLANTAS_VIGENTES_X_TIENDA.xlsx` | Stock actual de plantas por tienda | 572 plantas × 42 tiendas |

## Tiendas (42 en total)

### Por tipo de tienda
- **GRA (Grande):** Cerrillos, Costanera, Curicó, Florida, La Dehesa, La Reina, Maipú, Rancagua, Talca
- **MED (Mediana):** Antofagasta, Bío Bío, Calama, Chiguayante, Chillán, El Belloto II, Kennedy, Los Andes, Los Ángeles, Osorno, Puerto Montt, Quilicura, Quilín, Quillota, San Bernardo, Temuco, Valparaíso, Villarrica, Viña del Mar, La Serena
- **PEQ (Pequeña):** Colina, Copiapó, Coronel, El Llano, Linares, Ochagavía, Portal Ñuñoa, Portal Osorno, Portal Temuco, Puente Alto, Santa Amalia, La Unión, Arica

### Por clima
- **☀️ Desértico (4):** Antofagasta, Calama, Copiapó, Arica
- **🌵 Semiárido (1):** La Serena
- **🌊 Costero (4):** El Belloto II, Quillota, Valparaíso, Viña del Mar
- **🌤️ Templado (20):** Mayoría de Santiago y zona central
- **⛰️ Montaña (1):** Los Andes El Laberinto
- **🌧️ Frío Húmedo (12):** Sur de Chile

## Plantas (572 SKUs vigentes)

### Por subrubro
- **PLANTAS DE EXTERIOR:** Árboles, arbustos, plantines, florales, aromáticas, cactus
- **PLANTAS DE INTERIOR:** Ficus, monsteras, orquídeas, anturios, plantas colgantes, etc.

### Por grupo (16 grupos)
Ver `CONTEXTO.md` para listado completo.

## Cómo actualizar los datos

Si Easy entrega un nuevo archivo Excel de stock, el proceso es:

```python
# Script de extracción (requiere: pip install openpyxl)
from openpyxl import load_workbook
import json

# 1. Leer tiendas
wb1 = load_workbook("TIENDAS_EASY_PLANTAS.xlsx", read_only=True)
ws1 = wb1.active
tiendas = []
for row in list(ws1.iter_rows(values_only=True))[1:]:
    tiendas.append({"nombre": str(row[0]).strip(), "clima": str(row[1]).strip(), "tipo": str(row[2]).strip()})

# 2. Leer stock
wb2 = load_workbook("STOCK_PLANTAS_VIGENTES_X_TIENDA.xlsx", read_only=True)
ws2 = wb2.active
all_rows = list(ws2.iter_rows(values_only=True))
header = all_rows[0]
store_cols = list(header[6:])  # columnas de tiendas empiezan en col 6

plantas = []
for row in all_rows[1:]:
    if not row[1]: continue
    stock_by_store = {}
    for i, tienda_name in enumerate(store_cols):
        if tienda_name:
            val = row[6+i]
            if val is not None:
                try:
                    stock_by_store[str(tienda_name).strip()] = int(val)
                except: pass
    plantas.append({
        "sku": row[0],
        "nombre": str(row[1]).strip(),
        "grupo": str(row[5]).strip() if row[5] else "",
        "subrubro": str(row[4]).strip() if row[4] else "",
        "total": sum(v for v in stock_by_store.values() if v > 0),
        "stock": stock_by_store
    })

# 3. Guardar JSON
with open('tiendas.json', 'w', encoding='utf-8') as f:
    json.dump(tiendas, f, ensure_ascii=False)
with open('plantas.json', 'w', encoding='utf-8') as f:
    json.dump(plantas, f, ensure_ascii=False)
```

Luego reemplazar los datos en `index.html`:
```
const TIENDAS = [... nuevo JSON ...];
const PLANTAS = [... nuevo JSON ...];
```

## Estructura de columnas del Excel de stock

| Col | Contenido |
|---|---|
| 0 | SKU |
| 1 | Descripción / nombre de la planta |
| 2 | Proveedor |
| 3 | Rubro |
| 4 | Subrubro (PLANTAS DE INTERIOR / PLANTAS DE EXTERIOR) |
| 5 | Grupo (HERBACEAS PERENES, FLORALES, etc.) |
| 6+ | Stock por tienda (una columna por tienda) |
