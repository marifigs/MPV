# 🚀 DEPLOY Y FLUJO DE TRABAJO — PlantasFácil Easy

## Setup inicial (hacer solo una vez)

### 1. Crear repo en GitHub
1. Ir a https://github.com/new
2. Nombre: `plantasfacil-easy`
3. Privado o público (da igual)
4. Click **Create repository**

### 2. Subir el proyecto
```bash
cd C:\Users\marifigs\MPV
git init
git add .
git commit -m "Initial deploy: PlantasFacil Easy v1.0"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/plantasfacil-easy.git
git push -u origin main
```

### 3. Conectar con Vercel
1. Ir a https://vercel.com/new
2. Click **"Import Git Repository"**
3. Seleccionar `plantasfacil-easy`
4. Framework Preset: **Other**
5. Click **Deploy**

Vercel detecta el `vercel.json` automáticamente y configura todo.

---

## Flujo de actualización (cada vez que Claude Code haga cambios)

```bash
cd C:\Users\marifigs\MPV
git add .
git commit -m "Update: descripción del cambio"
git push
```

**Vercel redespliega automáticamente en ~30 segundos.** ✅

---

## Comandos útiles

```bash
# Ver estado del repo
git status

# Ver historial de commits
git log --oneline

# Ver URL del sitio en Vercel
vercel ls

# Forzar redeploy sin cambios
git commit --allow-empty -m "Force redeploy"
git push
```

---

## Estructura de commits sugerida

```
feat: nueva funcionalidad
fix: corrección de bug
update: actualización de datos o contenido
style: cambios visuales/CSS
docs: actualización de documentación
```

Ejemplos:
```
feat: agregar filtro por proveedor en catálogo
fix: corregir sección liquidación vacía
update: nuevos datos de stock abril 2025
style: paleta de colores liquidación a verde
```

---

## Variables de entorno en Vercel

Este proyecto no requiere variables de entorno (es 100% estático).  
Si en el futuro se agrega un backend, configurar en:  
Vercel Dashboard → Project → Settings → Environment Variables
