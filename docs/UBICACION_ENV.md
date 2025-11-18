# 📍 Ubicación del archivo .env

## ✅ Ubicación Correcta

El archivo `.env` debe estar en la **raíz del proyecto**, en el mismo directorio que `config.php`:

```
/Users/macbookpro/Documents/Selec capital/
├── .env                    ← AQUÍ (raíz del proyecto)
├── config.php              ← Lee el .env desde aquí
├── submit.php
├── index.html
└── ...
```

## 🔍 Verificar Ubicación

El archivo `.env` ya está creado en la ubicación correcta:
- **Ruta completa**: `/Users/macbookpro/Documents/Selec capital/.env`
- **Relativa a config.php**: `__DIR__ . '/.env'` (mismo directorio)

## 🚀 En Producción (Hostinger/Server)

Cuando subas el proyecto al servidor, debes:

### 1. Crear el archivo .env en el servidor

Conéctate por **FTP/SFTP** o usa el **File Manager** de Hostinger y crea el archivo `.env` en la raíz del proyecto (donde está `config.php`).

### 2. Contenido del .env en producción

Copia el mismo contenido que tienes localmente, pero asegúrate de:
- ✅ Usar las mismas credenciales
- ✅ Verificar que las rutas de logs sean correctas para el servidor
- ✅ Ajustar `APP_ENV=production`

### 3. Permisos del archivo

El archivo `.env` debe tener permisos de lectura para el servidor web:
```bash
chmod 644 .env
```

### 4. Verificar que funciona

Después de subir, verifica que `config.php` puede leer el `.env`:
- Revisa los logs si hay errores
- Prueba el formulario para verificar que las credenciales se cargan

## ⚠️ IMPORTANTE

- ❌ **NO subas el .env al repositorio** (ya está en .gitignore)
- ✅ **Sí sube config.php** (no tiene credenciales hardcodeadas)
- ✅ **Crea el .env manualmente en cada servidor** (desarrollo, staging, producción)

## 📝 Estructura del .env

El archivo `.env` debe contener todas las variables que `config.php` necesita:

```env
# Google Maps
GOOGLE_MAPS_API_KEY=tu_clave_aqui

# Cloudflare Turnstile
TURNSTILE_SITE_KEY=tu_site_key
TURNSTILE_SECRET_KEY=tu_secret_key

# Google Sheets
SHEETS_WEB_APP_URL=tu_url_aqui
SHEETS_SHEET_ID=tu_sheet_id

# Email
EMAIL_NOTIFY_TO=tu_email@ejemplo.com
EMAIL_FROM_ADDRESS=no-reply@selectcapital.cl
EMAIL_FROM_NAME=Select Capital
EMAIL_SUBJECT_PREFIX=[Select Capital] Nuevo registro evento

# Web3Forms (opcional)
WEB3FORMS_ENABLED=false
WEB3FORMS_ACCESS_KEY=tu_access_key
```

## 🔒 Seguridad

- El `.env` está en `.gitignore` ✅
- No se sube al repositorio ✅
- Cada servidor tiene su propio `.env` ✅
- Las credenciales no están en el código ✅

