# 🚀 Guía de Despliegue en Vercel

## Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio Git (GitHub, GitLab o Bitbucket)
- Node.js 18+ instalado localmente

## Opción 1: Despliegue desde Vercel Dashboard (Recomendado)

### Paso 1: Conectar Repositorio

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Conecta tu repositorio de GitHub/GitLab/Bitbucket
3. Selecciona el proyecto `investment-engine-v1`

### Paso 2: Configurar el Proyecto

Vercel detectará automáticamente que es un proyecto Next.js. La configuración será:

- **Framework Preset:** Next.js
- **Root Directory:** `investment-engine-v1` (si el proyecto está en un subdirectorio)
- **Build Command:** `npm run build` (automático)
- **Output Directory:** `.next` (automático)
- **Install Command:** `npm install` (automático)

### Paso 3: Variables de Entorno (si las necesitas)

Si en el futuro necesitas variables de entorno:

1. Ve a **Settings** → **Environment Variables**
2. Agrega las variables necesarias
3. Vuelve a desplegar

### Paso 4: Desplegar

1. Haz clic en **Deploy**
2. Espera a que termine el build (2-3 minutos)
3. Tu aplicación estará disponible en `tu-proyecto.vercel.app`

## Opción 2: Despliegue desde CLI

### Instalación de Vercel CLI

```bash
npm i -g vercel
```

### Login

```bash
vercel login
```

### Desplegar

Desde el directorio del proyecto:

```bash
cd investment-engine-v1
vercel
```

Sigue las instrucciones interactivas:
- ¿Set up and deploy? → **Y**
- ¿Which scope? → Selecciona tu cuenta
- ¿Link to existing project? → **N** (primera vez) o **Y** (actualizaciones)
- ¿What's your project's name? → `investment-engine-v1` o el nombre que prefieras
- ¿In which directory is your code located? → `./` o `investment-engine-v1` si estás en el root

### Desplegar a Producción

```bash
vercel --prod
```

## Configuración del Proyecto

### Archivos Importantes

- `vercel.json` - Configuración de Vercel (región, timeouts, etc.)
- `next.config.js` - Configuración de Next.js optimizada para producción
- `package.json` - Scripts y dependencias

### Región

El proyecto está configurado para usar la región `scl1` (Santiago, Chile) para mejor latencia.

### Timeout de API

La ruta `/api/generate-pdf` tiene un timeout máximo de 30 segundos configurado en `vercel.json`.

## Verificación Post-Despliegue

1. **Verifica que la página principal carga:** `https://tu-proyecto.vercel.app`
2. **Verifica la API de UF:** `https://tu-proyecto.vercel.app/api/uf`
3. **Prueba generar un PDF:**
   - Agrega propiedades en la calculadora
   - Haz clic en "Descargar Reporte PDF"
   - Verifica que el PDF se genera correctamente

## Troubleshooting

### Error: "Module not found: Can't resolve 'canvas'"

Este error puede aparecer con `@react-pdf/renderer`. La configuración en `next.config.js` ya lo maneja, pero si persiste:

1. Verifica que `next.config.js` tiene la configuración de webpack
2. Vuelve a desplegar

### Error: "Function timeout"

Si el PDF tarda mucho en generarse:

1. Ve a **Settings** → **Functions**
2. Aumenta el timeout de `/api/generate-pdf` (máximo 60s en plan Hobby)

### Build Fails

1. Verifica los logs en Vercel Dashboard
2. Prueba el build localmente: `npm run build`
3. Revisa que todas las dependencias estén en `package.json`

## Actualizaciones Futuras

Para actualizar el despliegue:

1. Haz commit y push a tu repositorio
2. Vercel detectará los cambios automáticamente
3. Se creará un nuevo deployment
4. Si todo está bien, se desplegará automáticamente a producción

O manualmente:

```bash
vercel --prod
```

## Monitoreo

- **Logs:** Ve a tu proyecto en Vercel → **Deployments** → Click en un deployment → **View Function Logs**
- **Analytics:** Vercel Analytics está disponible en el dashboard
- **Performance:** Usa Vercel Speed Insights para monitorear rendimiento

## Soporte

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Issues del Proyecto](https://github.com/tu-repo/issues)

