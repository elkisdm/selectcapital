# Instrucciones de Configuración - VIVA MARÍN Landing

## 📍 1. Google Maps API

### Opción A: Usar Google Maps Embed (Sin API Key - Actual)
El código actual usa un iframe embed que **NO requiere API key** y funciona directamente. Esta es la opción más simple y ya está implementada.

**Ubicación en el código:** Líneas 353-362 de `base.html`

```html
<iframe 
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.5!2d-70.648!3d-33.437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a8b8b8b8b9%3A0x8b8b8b8b8b8b8b8b!2sCalle%20Mar%C3%ADn%20%26%20Calle%20Lira%2C%20Santiago%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl" 
  ...
/>
```

**Ventajas:**
- ✅ No requiere API key
- ✅ Funciona inmediatamente
- ✅ Sin costos
- ✅ Carga rápida

**Desventajas:**
- ⚠️ Limitado en personalización
- ⚠️ No permite interacción avanzada

### Opción B: Google Maps JavaScript API (Con API Key - Avanzado)

Si necesitas más control y personalización, puedes usar la API de JavaScript:

#### Pasos para implementar:

1. **Obtener API Key:**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un proyecto o selecciona uno existente
   - Habilita "Maps JavaScript API"
   - Crea una credencial (API Key)
   - Restringe la API Key a tu dominio (recomendado)

2. **Agregar el script en `base.html` (antes de `</body>`):**
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&callback=initMap" async defer></script>
   ```

3. **Reemplazar el iframe con un div:**
   ```html
   <div id="map" style="width: 100%; height: 400px; border-radius: var(--lp-radius-lg);"></div>
   ```

4. **Agregar JavaScript para inicializar el mapa:**
   ```javascript
   function initMap() {
     const location = { lat: -33.437, lng: -70.648 };
     const map = new google.maps.Map(document.getElementById('map'), {
       zoom: 15,
       center: location,
       mapTypeId: 'roadmap',
       styles: [
         // Estilos personalizados opcionales
       ]
     });
     const marker = new google.maps.Marker({
       position: location,
       map: map,
       title: 'VIVA MARÍN - Esquina Marín con Lira'
     });
   }
   ```

**Costos:** Google Maps tiene un plan gratuito generoso (primeros $200 USD/mes gratis). Para una landing page simple, probablemente no incurrirás en costos.

---

## 🔐 2. Credenciales Necesarias para el Formulario

### Credenciales ya configuradas en `config.php`:

#### ✅ Cloudflare Turnstile (Anti-bot)
- **Site Key (Pública):** `0x4AAAAAAB_bjq2YOWp-yEXx` ✅ Ya configurada en HTML
- **Secret Key (Privada):** `0x4AAAAAAB_bjollQuBnkgXK0WKzmmgdE6o` ✅ Ya configurada en `config.php`

**Estado:** ✅ Funcionando - No requiere cambios

#### ✅ Google Sheets (Apps Script)
- **Web App URL:** `https://script.google.com/macros/s/AKfycbyJ6faB2lKIDRUGJ0A_cymYTlqS8zZxMFmz2gYEdijSKEBYyMKwUdXSkE26qYbq1bBWDw/exec`
- **Sheet ID:** `1OJpSM5URoAA9pRB_JcD4JNMpK4h-tRbwkWYo5Gh0qbI`

**Estado:** ✅ Configurado - Verifica que la Apps Script tenga permisos de ejecución

#### ⚠️ Email (Opcional - Requiere configuración SMTP)
- **Notificar a:** `edaza@capitalinteligente.cl`
- **Desde:** `no-reply@selectcapital.cl`

**Estado:** ⚠️ Requiere configuración SMTP en el servidor si quieres enviar emails

### Verificación de credenciales:

1. **Cloudflare Turnstile:**
   - Verifica que el widget aparezca en el formulario
   - Si no aparece, revisa la consola del navegador

2. **Google Sheets:**
   - Verifica que la Apps Script tenga permisos de ejecución
   - Prueba enviando un formulario de prueba
   - Revisa los logs en `logs/app.log`

3. **Email:**
   - Solo funciona si el servidor tiene SMTP configurado
   - Puedes desactivarlo en `config.php` si no lo necesitas:
     ```php
     'email' => [
       'enabled' => false,  // Cambiar a false
       ...
     ],
     ```

---

## 🔧 3. Corrección de Normalización del Formulario

### Problema identificado:
La variable `form` no estaba definida antes de usarse, por lo que la normalización no funcionaba.

### Solución aplicada:
Se agregó la línea `const form = document.querySelector('.form');` antes de usar la variable.

**Ubicación:** Línea 903 de `base.html`

### Funciones de normalización activas:

1. **RUT:** Formatea automáticamente a `12.345.678-9` y valida el dígito verificador
2. **Teléfono/WhatsApp:** Formatea a `+56 9 xxxx xxxx`
3. **Email:** Convierte a minúsculas y elimina espacios
4. **Nombre:** Capitaliza correctamente (ej: "Juan Pérez")
5. **Números (Renta/Ahorro):** Formatea con separadores de miles (ej: `1.500.000`)

### Cómo probar la normalización:

1. Abre la página en el navegador
2. Abre la consola del navegador (F12)
3. Completa el formulario y observa:
   - RUT se formatea automáticamente mientras escribes
   - Teléfono se formatea al perder el foco
   - Email se convierte a minúsculas al perder el foco
   - Números se formatean con puntos como separadores

### Campos normalizados:

| Campo | Normalización | Cuándo se aplica |
|-------|---------------|------------------|
| RUT | `12.345.678-9` | Mientras escribes + al perder foco |
| Teléfono | `+56 9 xxxx xxxx` | Mientras escribes + al perder foco |
| Email | Minúsculas, sin espacios | Al perder foco |
| Nombre | Capitalización correcta | Al perder foco |
| Renta | Formato con puntos (1.500.000) | Mientras escribes |
| Ahorro | Formato con puntos o texto libre | Mientras escribes |

---

## 📋 4. Checklist de Configuración

### Antes de publicar:

- [ ] Verificar que Cloudflare Turnstile funcione (widget visible)
- [ ] Probar envío de formulario de prueba
- [ ] Verificar que los datos lleguen a Google Sheets
- [ ] Revisar logs en `logs/app.log` si hay errores
- [ ] Verificar que el mapa de Google Maps se muestre correctamente
- [ ] Probar normalización de campos (RUT, teléfono, etc.)
- [ ] Verificar que el botón de envío se habilite solo después de Turnstile
- [ ] Probar en diferentes navegadores (Chrome, Firefox, Safari)
- [ ] Probar en dispositivos móviles

### Configuración del servidor:

- [ ] PHP 7.4+ instalado
- [ ] Permisos de escritura en `logs/` (chmod 775)
- [ ] Permisos de escritura en `storage/runtime/` (chmod 775)
- [ ] Extensión `curl` habilitada en PHP (para Turnstile y Sheets)
- [ ] `allow_url_fopen` habilitado en PHP (para Turnstile y Sheets)

---

## 🐛 5. Solución de Problemas

### El formulario no envía:
1. Revisa la consola del navegador (F12) para errores JavaScript
2. Verifica que Turnstile esté completado
3. Revisa `logs/app.log` para errores del servidor
4. Verifica que `submit.php` esté en la raíz del proyecto

### La normalización no funciona:
1. Verifica que la consola no muestre errores JavaScript
2. Asegúrate de que el formulario tenga la clase `.form`
3. Verifica que el script esté dentro de `DOMContentLoaded`

### El mapa no se muestra:
1. Verifica la conexión a internet
2. Revisa la consola del navegador para errores
3. Si usas API Key, verifica que esté correcta y habilitada

### Los datos no llegan a Google Sheets:
1. Verifica que la Apps Script tenga permisos de ejecución
2. Revisa `logs/app.log` para errores
3. Verifica que la URL de la Web App sea correcta
4. Prueba la URL de la Web App directamente en el navegador

---

## 📞 6. Contacto y Soporte

Si necesitas ayuda adicional:
- Revisa los logs en `logs/app.log`
- Verifica la configuración en `config.php`
- Consulta la documentación de:
  - [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
  - [Google Maps API](https://developers.google.com/maps/documentation)
  - [Google Apps Script](https://developers.google.com/apps-script)

---

**Última actualización:** Corrección de normalización aplicada - Variable `form` definida correctamente.






