# Meta Conversions API - Guía de Implementación

## Descripción

Esta implementación envía eventos de conversión desde el servidor a la API de Conversiones de Meta, mejorando la precisión del tracking y permitiendo deduplicación con el Meta Pixel del cliente.

## Configuración

### 1. Obtener Access Token

1. Ve a [Meta for Developers](https://developers.facebook.com/)
2. Selecciona tu app o crea una nueva
3. Ve a **Tools** > **Events Manager**
4. Selecciona tu Pixel ID: `1726961441305783`
5. Ve a **Settings** > **Conversions API**
6. Genera un **Access Token** con permisos `ads_management`

### 2. Configurar Variables de Entorno

Agrega al archivo `.env` en la raíz del proyecto:

```env
# Meta Conversions API
META_CONVERSIONS_ENABLED=true
META_CONVERSIONS_PIXEL_ID=1726961441305783
META_CONVERSIONS_ACCESS_TOKEN=tu_access_token_aqui
META_CONVERSIONS_TEST_EVENT_CODE=TEST12345  # Opcional, solo para testing
```

### 3. Test Event Code (Opcional)

Para testing, puedes obtener un Test Event Code desde Events Manager:
- Ve a **Test Events** en Events Manager
- Copia el código y agrégalo a `META_CONVERSIONS_TEST_EVENT_CODE`
- Los eventos aparecerán en tiempo real en Test Events

## Funcionamiento

### Deduplicación

El sistema genera un `event_id` único en el frontend que se envía tanto al:
- **Meta Pixel** (cliente): `fbq('track', 'Lead', { eventID: eventId })`
- **Conversions API** (servidor): como parámetro `event_id`

Meta deduplica automáticamente los eventos que tienen el mismo `event_id`, mejorando la precisión de las métricas.

### Eventos Enviados

Actualmente se envía el evento **Lead** cuando:
- Un formulario se envía exitosamente
- Los datos se guardan correctamente en Google Sheets
- El email de notificación se envía (si está habilitado)

### Datos Enviados

#### User Data (hasheado SHA256)
- Email (`em`)
- Teléfono (`ph`)
- Nombre (`fn`)
- IP Address (sin hashear)
- User Agent (sin hashear)

#### Custom Data
- `content_name`: Nombre del proyecto o "Asesoría Integral"
- `content_category`: "Formulario Contacto"
- `value`: Valor estimado del lead basado en rango de renta (CLP)
- `currency`: "CLP"

## Verificación

### 1. Test Events (Modo Testing)

1. Agrega `META_CONVERSIONS_TEST_EVENT_CODE` a tu `.env`
2. Envía un formulario de prueba
3. Ve a **Test Events** en Events Manager
4. Deberías ver el evento aparecer en tiempo real

### 2. Eventos de Producción

1. Remueve o deja vacío `META_CONVERSIONS_TEST_EVENT_CODE`
2. Los eventos aparecerán en **Events Manager** > **Overview** después de unos minutos
3. Verifica las métricas:
   - **Calidad de coincidencias**: Debe ser > 80%
   - **Tasa de deduplicación**: Debe mostrar eventos deduplicados entre Pixel y API
   - **Actualización de datos**: Debe ser < 1 hora

## Métricas Importantes

### Calidad de Coincidencias
- Indica qué tan bien Meta puede hacer match entre eventos y cuentas de Facebook
- Objetivo: > 80%
- Mejora enviando más datos de usuario (email, teléfono, nombre)

### Tasa de Deduplicación
- Porcentaje de eventos que se deduplicaron entre Pixel y API
- Objetivo: > 50%
- Asegúrate de que `event_id` sea el mismo en ambos lugares

### Actualización de Datos
- Tiempo entre que ocurre el evento y cuando Meta lo recibe
- Objetivo: < 1 hora
- Los eventos se envían inmediatamente después del éxito del formulario

## Troubleshooting

### Eventos no aparecen

1. Verifica que `META_CONVERSIONS_ENABLED=true` en `.env`
2. Verifica que el `ACCESS_TOKEN` sea válido
3. Revisa los logs en `logs/app.log` buscando `META_CONVERSION`
4. Verifica que el Pixel ID sea correcto

### Baja calidad de coincidencias

1. Asegúrate de enviar email y teléfono (se hashean automáticamente)
2. Verifica que los datos estén en formato correcto antes de hashear
3. Revisa que no haya caracteres especiales o espacios extra

### Eventos duplicados

1. Verifica que `event_id` se genere correctamente en el frontend
2. Asegúrate de que el mismo `event_id` se envíe al Pixel y a la API
3. Revisa que no se esté llamando la función de envío múltiples veces

## Archivos Relacionados

- `api/meta-conversions.php`: Módulo principal de la API
- `submit.php`: Integración en el flujo de formularios
- `scripts/home.js`: Generación de `event_id` en frontend
- `config.php`: Configuración

## Referencias

- [Meta Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Event Matching Best Practices](https://developers.facebook.com/docs/marketing-api/conversions-api/best-practices)
- [Test Events Tool](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api#testEvents)


