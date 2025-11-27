# Configuración de Dominio para Meta Pixel

## Problema

Los eventos del Meta Pixel aparecen en localhost pero no en el dominio de producción (selectcapital.cl). Esto es normal porque Meta requiere verificar el dominio en producción.

## Solución: Verificar Dominio en Meta Events Manager

### Paso 1: Acceder a Events Manager

1. Ve a [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Selecciona tu Pixel ID: `1726961441305783`
3. Ve a **Settings** (Configuración)

### Paso 2: Agregar y Verificar Dominio

1. En la sección **Aggregated Event Measurement** o **Domain Verification**, busca **Domains** (Dominios)
2. Haz clic en **Add Domain** (Agregar dominio)
3. Ingresa: `selectcapital.cl`
4. Selecciona el método de verificación:
   - **DNS Verification** (Recomendado): Agrega un registro TXT en tu DNS
   - **HTML Meta Tag**: Agrega un meta tag en el `<head>` de tu sitio

### Paso 3: Verificación por DNS (Recomendado)

1. Meta te dará un registro TXT como:
   ```
   facebook-domain-verification=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
2. Agrega este registro TXT en tu proveedor de DNS (donde gestionas selectcapital.cl)
3. Espera 24-48 horas para que se propague
4. Haz clic en **Verify** en Events Manager

### Paso 4: Verificación por Meta Tag (Alternativa)

Si eliges HTML Meta Tag:

1. Meta te dará un código como:
   ```html
   <meta name="facebook-domain-verification" content="xxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
   ```
2. Agrega este meta tag en el `<head>` de todas tus páginas HTML:
   - `home.html`
   - `landing/proyecto-inmobiliario/base.html`
   - `gracias.html`
3. Sube los cambios a producción
4. Haz clic en **Verify** en Events Manager

### Paso 5: Configurar Dominios Permitidos

1. En Events Manager, ve a **Settings** > **Advanced Settings**
2. En **Allowed Domains** (Dominios permitidos), agrega:
   - `selectcapital.cl`
   - `www.selectcapital.cl`
   - `dev.selectcapital.cl` (si usas subdominio de desarrollo)
3. Guarda los cambios

## Verificar que el Pixel se Carga Correctamente

### Opción 1: Meta Pixel Helper (Extensión de Chrome)

1. Instala la extensión [Meta Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Visita `https://selectcapital.cl`
3. La extensión debería mostrar:
   - ✅ Pixel cargado correctamente
   - ✅ Eventos detectados (PageView, etc.)

### Opción 2: Console del Navegador

1. Abre las DevTools (F12)
2. Ve a la pestaña **Console**
3. Escribe: `fbq('getState')`
4. Deberías ver el estado del pixel con el ID `1726961441305783`

### Opción 3: Network Tab

1. Abre las DevTools (F12)
2. Ve a la pestaña **Network**
3. Filtra por `fbevents` o `facebook`
4. Deberías ver requests a `connect.facebook.net`

## Problemas Comunes

### El pixel no carga en producción

**Causa**: Rutas relativas vs absolutas

**Solución**: Verifica que las rutas del script sean correctas:
- En `home.html`: `analytics/meta-pixel.js` (relativa, funciona si estás en la raíz)
- En `base.html`: `/analytics/meta-pixel.js` (absoluta, mejor para subdirectorios)

### Eventos no aparecen en Test Events

**Causa**: El dominio no está verificado o no está en la lista de dominios permitidos

**Solución**: 
1. Verifica el dominio siguiendo los pasos anteriores
2. Asegúrate de que el dominio esté en "Allowed Domains"
3. Espera 24-48 horas después de verificar

### Eventos aparecen en localhost pero no en producción

**Causa**: Meta permite localhost por defecto, pero requiere verificación para dominios de producción

**Solución**: Verifica el dominio en Events Manager (pasos anteriores)

## Configuración Actual

- **Pixel ID**: `1726961441305783`
- **Dominios configurados en código**: 
  - `selectcapital.cl`
  - `www.selectcapital.cl`
  - `dev.selectcapital.cl`

## Próximos Pasos

1. ✅ Verificar dominio en Meta Events Manager
2. ✅ Agregar dominio a "Allowed Domains"
3. ✅ Verificar con Meta Pixel Helper
4. ✅ Probar eventos en Test Events
5. ✅ Monitorear métricas en Events Manager

## Referencias

- [Meta Domain Verification Guide](https://www.facebook.com/business/help/233452332783024)
- [Meta Pixel Helper](https://www.facebook.com/business/help/952904676381204)
- [Events Manager Documentation](https://www.facebook.com/business/help/952192354843755)


