# Configuración de Variables de Entorno en Hostinger

## Problema: Error 500 al enviar formulario

El error 500 se debe a que faltan las variables de entorno requeridas por `config.php`.

## Solución: Configurar Variables de Entorno

### Opción 1: Variables de Entorno en Hostinger (Recomendado)

1. **Accede al Panel de Control de Hostinger**
   - Ve a tu cuenta de Hostinger
   - Selecciona tu dominio/hosting

2. **Configura Variables de Entorno**
   - Busca la sección "Variables de Entorno" o ".env"
   - O ve a "Configuración PHP" → "Variables de Entorno"

3. **Agrega las siguientes variables:**

```bash
APP_ENV=production

# Cloudflare Turnstile
TURNSTILE_SITE_KEY=0x4AAAAAAB_bjq2YOWp-yEXx
TURNSTILE_SECRET_KEY=tu_secret_key_aqui

# Google Sheets (Apps Script)
SHEETS_WEB_APP_URL=https://script.google.com/macros/s/TU_WEB_APP_ID/exec
SHEETS_SHEET_ID=tu_sheet_id_aqui

# Web3Forms (opcional, si no usas Google Sheets)
WEB3FORMS_ACCESS_KEY=tu_access_key_aqui

# Privacidad (opcionales)
PRIVACY_LOG_USER_AGENT=0
PRIVACY_MASK_IP_OCTETS=1
```

### Opción 2: Crear archivo .env en la raíz del proyecto

Si Hostinger no tiene interfaz para variables de entorno, crea un archivo `.env` en la raíz:

```bash
APP_ENV=production
TURNSTILE_SITE_KEY=0x4AAAAAAB_bjq2YOWp-yEXx
TURNSTILE_SECRET_KEY=tu_secret_key
SHEETS_WEB_APP_URL=https://script.google.com/macros/s/...
SHEETS_SHEET_ID=tu_sheet_id
```

Y modifica `config.php` para leer el archivo `.env`:

```php
// Al inicio de config.php, agregar:
if (file_exists(__DIR__ . '/.env')) {
  $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  foreach ($lines as $line) {
    if (strpos(trim($line), '#') === 0) continue; // Skip comments
    list($key, $value) = explode('=', $line, 2);
    putenv(trim($key) . '=' . trim($value));
  }
}
```

### Opción 3: Modo Desarrollo (Solo para testing)

Si quieres probar sin configurar todo, modifica temporalmente `config.php`:

```php
// Cambiar esta línea:
$appEnv = $optionalEnv('APP_ENV');
// Por:
$appEnv = 'development'; // Temporal para testing
```

Y comenta las validaciones de variables requeridas en modo development.

## Verificación

Después de configurar, prueba el formulario. Si aún hay error 500:

1. **Revisa los logs de error de PHP**
   - En Hostinger: Panel → Logs → Error Log
   - O busca archivos `error_log` en el servidor

2. **Verifica permisos de carpetas**
   ```bash
   storage/logs/ → 775
   storage/runtime/ → 775
   ```

3. **Verifica que `config.php` sea accesible**
   - El archivo debe estar en la raíz del proyecto
   - Debe tener permisos de lectura (644)

## Notas Importantes

- **Nunca subas el archivo `.env` al repositorio** (debe estar en `.gitignore`)
- **Las secret keys son sensibles** - no las compartas públicamente
- **En producción**, siempre usa `APP_ENV=production`
- **El Turnstile secret key** debe coincidir con el site key configurado en Cloudflare

## Contacto

Si el error persiste después de configurar las variables, revisa:
- Los logs de error de PHP en Hostinger
- Que todas las variables estén correctamente escritas (sin espacios extra)
- Que los valores de las keys sean correctos

