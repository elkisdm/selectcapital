# 🔐 Instrucciones para Configurar Google Maps API Key

## ⚠️ PROBLEMA DE SEGURIDAD CORREGIDO

La clave API de Google Maps estaba expuesta directamente en el código HTML. Esto ha sido corregido.

## 📋 Pasos para Configurar

### 1. Obtener la Clave API de Google Maps

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto o crea uno nuevo
3. Ve a **APIs & Services** > **Credentials**
4. Crea una nueva **API Key** o usa una existente
5. **IMPORTANTE**: Restringe la clave:
   - En **Application restrictions**, selecciona **HTTP referrers (web sites)**
   - Agrega tus dominios:
     - `https://selectcapital.cl/*`
     - `https://www.selectcapital.cl/*`
     - `http://localhost/*` (solo para desarrollo)
   - En **API restrictions**, selecciona **Restrict key**
   - Solo habilita **Maps JavaScript API**

### 2. Configurar la Clave en el Proyecto

**Opción A: Usar Variable de Entorno (Recomendado)**

1. Crea un archivo `.env` en la raíz del proyecto (si no existe)
2. Agrega la línea:
   ```
   GOOGLE_MAPS_API_KEY=TU_CLAVE_API_AQUI
   ```
3. Asegúrate de que el archivo `.env` esté en `.gitignore`

**Opción B: Configurar en config.php (Temporal)**

Si no puedes usar variables de entorno, edita `config.php` y reemplaza la clave temporal:

```php
'google_maps' => [
  'api_key' => 'TU_CLAVE_API_AQUI', // Reemplazar con tu clave real
],
```

### 3. Verificar que Funciona

1. Abre la landing page en tu navegador
2. Ve a la sección de ubicación
3. Deberías ver el mapa de Google Maps cargado correctamente
4. Si hay errores, revisa la consola del navegador (F12)

## 🔒 Seguridad

- ✅ La clave ya NO está expuesta en el código HTML
- ✅ Se carga dinámicamente desde el servidor
- ✅ Debes restringir la clave en Google Cloud Console
- ✅ Solo habilita "Maps JavaScript API"
- ✅ Restringe por dominio HTTP referrer

## 🐛 Solución de Problemas

### El mapa no carga
- Verifica que la clave API esté configurada en `config.php` o `.env`
- Verifica que la clave tenga habilitada "Maps JavaScript API"
- Revisa la consola del navegador para errores

### Error de autenticación
- Verifica que la clave esté correctamente restringida en Google Cloud Console
- Asegúrate de que el dominio esté en la lista de referrers permitidos

### La clave sigue expuesta
- Verifica que hayas guardado los cambios en `base.html`
- Limpia la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)

## 📝 Notas

- La clave API actual en `config.php` es **TEMPORAL** y debe ser reemplazada
- En producción, usa siempre variables de entorno
- Nunca subas el archivo `.env` al repositorio

