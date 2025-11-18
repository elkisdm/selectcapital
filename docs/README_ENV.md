# Configuración de Variables de Entorno

## Archivos

- **`.env`**: Archivo con las credenciales reales (NO se sube al repositorio)
- **`.env.example`**: Plantilla con valores de ejemplo (SÍ se sube al repositorio)

## Configuración Inicial

1. **Copia la plantilla** (si no existe `.env`):
   ```bash
   cp .env.example .env
   ```

2. **Completa las credenciales** en `.env`:
   - `TURNSTILE_SECRET_KEY`: Obtener de [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - `SHEETS_WEB_APP_URL`: URL de tu Google Apps Script desplegado
   - `SHEETS_SHEET_ID`: ID de tu hoja de cálculo de Google Sheets

## Credenciales Encontradas

✅ **TURNSTILE_SITE_KEY**: `0x4AAAAAAB_bjq2YOWp-yEXx` (ya configurada)

## Cómo Obtener las Credenciales Faltantes

### Cloudflare Turnstile Secret Key

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navega a **Turnstile**
3. Selecciona tu sitio
4. Copia el **Secret Key** (diferente al Site Key)

### Google Sheets Web App URL

1. Abre tu Google Apps Script
2. Ve a **Deploy** → **New deployment**
3. Selecciona tipo **Web app**
4. Copia la **Web app URL** (formato: `https://script.google.com/macros/s/.../exec`)

### Google Sheets Sheet ID

1. Abre tu Google Sheet
2. El ID está en la URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
3. Copia el `[SHEET_ID]`

## Uso en Hostinger

En Hostinger, puedes configurar las variables de entorno de dos formas:

### Opción 1: Archivo .env (Recomendado)

1. Sube el archivo `.env` al servidor (vía FTP o File Manager)
2. Asegúrate de que tenga permisos 644
3. El archivo debe estar en la raíz del proyecto

### Opción 2: Variables de Entorno del Panel

1. Ve a **Panel de Control** → **Variables de Entorno**
2. Agrega cada variable manualmente
3. Reinicia el servidor si es necesario

## Verificación

Para verificar que las variables están cargadas correctamente:

```php
<?php
require __DIR__ . '/config.php';
// Si no hay error, las variables están cargadas correctamente
```

## Seguridad

⚠️ **IMPORTANTE**:
- Nunca subas `.env` al repositorio
- No compartas las credenciales públicamente
- El archivo `.env` está en `.gitignore` por defecto
- En producción, usa `APP_ENV=production`

