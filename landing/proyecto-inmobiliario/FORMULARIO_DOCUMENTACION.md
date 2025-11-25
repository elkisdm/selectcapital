# Documentación del Formulario - VIVA MARÍN

## Campos del Formulario

### 1. **Nombre completo** (`nombre`)
- **Tipo**: `text`
- **Requerido**: Sí
- **Placeholder**: "Ej: Ana Pérez"
- **Normalización**: 
  - Capitaliza la primera letra de cada palabra
  - Respeta palabras especiales (de, del, la, las, los, el, y, e) en minúsculas
  - Ejemplo: "juan pérez de la torre" → "Juan Pérez de la Torre"

### 2. **RUT** (`rut`)
- **Tipo**: `text`
- **Requerido**: Sí
- **Placeholder**: "Ej: 12.345.678-9"
- **Normalización**:
  - Formato automático: `12.345.678-9`
  - Agrega puntos cada 3 dígitos
  - Valida dígito verificador usando algoritmo chileno
- **Validación**:
  - Longitud: 8-10 caracteres (sin puntos ni guión)
  - Verifica dígito verificador correcto
  - Muestra borde rojo si es inválido al perder foco

### 3. **Teléfono WhatsApp** (`telefono`)
- **Tipo**: `tel`
- **Requerido**: Sí
- **Placeholder**: "+56 9 ..."
- **Normalización**:
  - Formato automático: `+56 9 xxxx xxxx`
  - Acepta números chilenos con o sin código de país
  - Si empieza con 56, lo remueve y agrega +56
  - Si no empieza con 9, lo agrega automáticamente
- **Validación**:
  - Patrón: `/^\+56\s9\s\d{4}\s\d{4}$/`
  - Debe tener exactamente 8 dígitos después del 9

### 4. **Correo electrónico** (`correo`)
- **Tipo**: `email`
- **Requerido**: Sí
- **Placeholder**: "tu@correo.cl"
- **Normalización**:
  - Convierte a minúsculas
  - Elimina espacios al inicio y final
- **Validación**: Validación HTML5 nativa de email

### 5. **Objetivo** (`objetivo`)
- **Tipo**: `radio` (selección única)
- **Requerido**: Sí
- **Opciones**:
  - `invertir`: "Invertir para renta" 💼
  - `vivir`: "Comprar para vivir" 🏠
  - `no-se`: "Aún no lo tengo claro" ❔

### 6. **Renta líquida mensual (CLP)** (`renta`)
- **Tipo**: `text`
- **Requerido**: Sí
- **Placeholder**: "Promedio mensual"
- **Normalización**:
  - Formato automático con separador de miles: `1.500.000`
  - Solo acepta dígitos
  - Se envía sin formato al backend (solo números)

### 7. **Ahorros disponibles para pie** (`ahorro`)
- **Tipo**: `text`
- **Requerido**: Sí
- **Placeholder**: "Monto aprox. o 'No tengo'"
- **Normalización**:
  - Si contiene números, los formatea con separador de miles
  - Si contiene "no tengo" (case insensitive), se mantiene como texto
  - Se envía como número limpio si es numérico, o como texto si dice "no tengo"
- **Lógica backend**:
  - `tiene_ahorro`: "si" o "no" (basado en si contiene "no tengo")
  - `monto_ahorro`: número limpio o "0" si no tiene

### 8. **Tipo de propiedad de interés** (`tipo`)
- **Tipo**: `radio` (selección única)
- **Requerido**: Sí
- **Opciones**:
  - `studio`: "Studio" 🏢
  - `1d`: "1 Dormitorio" 🏡
  - `2d`: "2 Dormitorios" 🏘️
  - `todas`: "Todas las opciones" 🔍
- **Nota**: Este valor se envía también en `tipo_ingreso_independiente` y se agrega a `comentarios`

### 9. **¿Cómo prefieres que te contactemos?** (`contacto-preferencia`)
- **Tipo**: `radio` (selección única)
- **Requerido**: Sí
- **Opciones**:
  - `whatsapp`: "WhatsApp" 💬
  - `email`: "Correo" ✉️
  - `llamada`: "Llamada" 📞
- **Mapeo backend**: Se envía como `canal_preferido`

### 10. **Términos y condiciones** (`terminos`)
- **Tipo**: `checkbox`
- **Requerido**: Sí
- **Texto**: "Acepto el tratamiento de mis datos y autorizo el contacto por WhatsApp y correo para recibir información sobre este proyecto inmobiliario."
- **Mapeo backend**:
  - `consentimiento_privacidad`: "si" o "no"
  - `consentimiento_contacto`: "si" o "no"

### 11. **Cloudflare Turnstile** (`cf-turnstile-response`)
- **Tipo**: `hidden`
- **Requerido**: Sí (para habilitar el botón de envío)
- **Site Key**: `0x4AAAAAAB_bjq2YOWp-yEXx`
- **Tema**: `auto` (se adapta al tema del sistema)
- **Callback**: `onTurnstileSuccess` - Habilita el botón de envío cuando se completa

### 12. **Honeypot** (`honey`)
- **Tipo**: `hidden`
- **Valor**: Vacío (protección anti-spam)
- **Nota**: Campo invisible que debe permanecer vacío

---

## Mapeo de Campos al Backend

El formulario mapea los campos del frontend a los nombres esperados por el backend (`/submit.php`):

| Campo Frontend | Campo Backend | Notas |
|----------------|---------------|-------|
| `nombre` | `nombre` | Directo |
| `rut` | `rut` | Directo |
| `correo` | `email` | Renombrado |
| `telefono` | `whatsapp` | Renombrado |
| `objetivo` | `objetivo` | Directo |
| `renta` | `renta_liquida` | Normalizado (solo números) |
| `ahorro` | `tiene_ahorro` | "si" o "no" |
| `ahorro` | `monto_ahorro` | Número limpio o "0" |
| - | `tipo_ingreso` | Valor fijo: "dependiente" |
| - | `capacidad_ahorro_mensual` | Valor fijo: "0" |
| - | `comunas_interes` | Valor fijo: "Santiago Centro" |
| `contacto-preferencia` | `canal_preferido` | Renombrado |
| `tipo` | `tipo_ingreso_independiente` | Renombrado |
| `tipo` | `comentarios` | Agregado como comentario |
| - | `franja_preferida` | Valor fijo: "flexible" |
| `terminos` | `consentimiento_privacidad` | "si" o "no" |
| `terminos` | `consentimiento_contacto` | "si" o "no" |
| `cf-turnstile-response` | `cf-turnstile-response` | Directo |
| `honey` | `honey` | Directo (honeypot) |

---

## Funciones de Normalización

### `normalizeRUT(value)`
- Formatea RUT a `12.345.678-9`
- Extrae número y dígito verificador
- Agrega puntos cada 3 dígitos
- Convierte 'k' a mayúscula

### `validateRUT(rut)`
- Valida dígito verificador usando algoritmo chileno
- Multiplica dígitos por serie 2-7
- Calcula resto y dígito esperado
- Retorna `true` si es válido

### `normalizePhone(value)`
- Formatea a `+56 9 xxxx xxxx`
- Maneja números con/sin código de país
- Agrega automáticamente el 9 si falta
- Remueve ceros iniciales

### `normalizeEmail(value)`
- Convierte a minúsculas
- Elimina espacios al inicio y final

### `normalizeName(value)`
- Capitaliza primera letra de cada palabra
- Respeta palabras especiales (de, del, la, etc.)
- Maneja múltiples espacios

### `normalizeNumber(value)`
- Remueve todos los caracteres no numéricos
- Retorna solo dígitos

### `formatNumber(value)`
- Agrega separador de miles (puntos)
- Formato: `1.500.000`

---

## Validaciones

### Validación en Tiempo Real
- **RUT**: Se valida al perder foco (`blur`), muestra borde rojo si es inválido
- **Teléfono**: Se formatea mientras se escribe (`input`)
- **Email**: Se normaliza al perder foco
- **Nombre**: Se normaliza al perder foco
- **Renta**: Se formatea con separador de miles mientras se escribe
- **Ahorro**: Se formatea si es numérico, mantiene texto si dice "no tengo"

### Validación al Enviar
1. **Turnstile**: Debe estar completado
2. **RUT**: 
   - Debe estar normalizado
   - Debe tener dígito verificador válido
   - Longitud: 8-10 caracteres
3. **Teléfono**: 
   - Debe coincidir con patrón `/^\+56\s9\s\d{4}\s\d{4}$/`
4. **Todos los campos requeridos**: Validación HTML5 nativa
5. **Términos**: Checkbox debe estar marcado

---

## Flujo de Envío

1. **Usuario completa formulario**
2. **Usuario completa Turnstile** → Botón se habilita
3. **Usuario hace clic en "Recibir mi propuesta personalizada"**
4. **Validación previa**:
   - Verifica token de Turnstile
   - Normaliza todos los campos
   - Valida RUT y teléfono
5. **Preparación de datos**:
   - Crea `FormData`
   - Mapea campos al formato del backend
   - Normaliza números (remueve formato)
6. **Envío**:
   - POST a `/submit.php`
   - Muestra estado de carga ("Enviando...")
   - Deshabilita botón
7. **Respuesta**:
   - **Éxito**: Redirige a `/landing/proyecto-inmobiliario/gracias.html?nombre=...`
   - **Error**: Muestra mensaje de error, rehabilita botón

---

## Mensajes de Error

- **Turnstile no completado**: "Por favor, completa la verificación de seguridad antes de enviar."
- **RUT inválido**: "Por favor, ingresa un RUT válido. El dígito verificador no es correcto."
- **RUT formato incorrecto**: "Por favor, ingresa un RUT válido en formato: 12.345.678-9"
- **Teléfono inválido**: "Por favor, ingresa un número de WhatsApp válido en formato: +56 9 xxxx xxxx"
- **Error genérico**: "Hubo un problema al enviar tu solicitud. Por favor intenta nuevamente."

---

## Estados del Botón de Envío

- **Inicial**: Deshabilitado (`disabled`) hasta que Turnstile se complete
- **Cargando**: 
  - Texto: "Enviando..."
  - Icono: ⏳
  - Opacidad: 0.7
  - Cursor: not-allowed
- **Habilitado**: 
  - Texto: "Recibir mi propuesta personalizada"
  - Icono: 📄
  - Opacidad: 1
  - Cursor: pointer

---

## Seguridad

1. **Cloudflare Turnstile**: Protección anti-bot
2. **Honeypot**: Campo `honey` que debe permanecer vacío
3. **Validación del lado del cliente**: Previene envíos inválidos
4. **Validación del lado del servidor**: El backend (`submit.php`) debe validar también

---

## Notas Técnicas

- El formulario usa `FormData` para el envío
- Los números se envían sin formato (solo dígitos)
- Los valores formateados se mantienen en `dataset.originalValue` para referencia
- El formulario previene el envío por defecto (`e.preventDefault()`) y maneja todo con JavaScript
- Los mensajes de error se muestran dinámicamente en el `.form-footer`
- El código de error solo se muestra en desarrollo (localhost, 127.0.0.1, o dominios con "dev.")




