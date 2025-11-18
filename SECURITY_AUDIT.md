# Auditoría de Seguridad — Select Capital

## Resumen Ejecutivo

- **Ámbito**: Evaluación del frontend estático, scripts de compilación Node.js y backend PHP (`submit.php`).
- **Fecha**: 2025-11-15
- **Metodología**: Revisión estática de código, búsqueda de secretos expuestos, análisis de flujo de datos sensibles, validaciones de entrada y controles de seguridad declarados.

Se identificaron múltiples riesgos altos asociados a gestión de secretos y configuración de entornos, junto con debilidades de validación y endurecimiento que elevan la superficie de ataque del formulario principal.

## Estado de Mitigaciones (2025-11-15)

- `APP_ENV` ahora exige valores válidos y cae por defecto en `production`, evitando despliegues sin controles.
- Los logs se redirigen fuera del docroot (`storage/logs/app.log`) y ya no almacenan payloads completos; se registran hashes y campos enmascarados.
- `submit.php` incluye rate limiting básico por IP (ventana 60s, configurable) y rechaza cabeceras de correo con caracteres de control.
- Se añadieron límites de tamaño de request (64 KB por defecto) y bloqueo para campos no declarados en la whitelist.

## Hallazgos Prioritarios

### 1. Secretos sensibles expuestos en `config.php` (**Alta**)

- Se publican claves privadas de Cloudflare Turnstile, URL completa de la App Script de Google Sheets y credenciales de Web3Forms dentro del repositorio (`config.php`, líneas 24-56). Estos valores permiten automatizar envíos masivos, eludir protecciones anti-bot y escribir directamente en las hojas de cálculo productivas.【F:config.php†L24-L56】
- El archivo se sirve desde la raíz pública del proyecto; una mala configuración del servidor (p.ej. permitir descargar `.php` como texto) filtraría inmediatamente los secretos.
- **Riesgo**: Abuso de infraestructura externa, envío de spam, borrado o corrupción de datos en la hoja, comprometimiento de reputación/entrega.
- **Recomendaciones**: Externalizar secretos a variables de entorno/almacenes seguros, rotar inmediatamente las claves expuestas, bloquear acceso HTTP directo a archivos de configuración y habilitar alertas ante uso anómalo.

### 2. Entorno por defecto en modo `development` (**Alta**)

- `app_env` viene preconfigurado en `development`, lo que deshabilita validaciones críticas en producción: se omite la comprobación de host permitido, no se valida el token Turnstile y se evita la persistencia real en Sheets (registrando payloads completos en logs).【F:config.php†L11-L90】【F:submit.php†L45-L191】
- Despliegues que olviden ajustar la variable exponen el endpoint a spam automatizado y a registros fabricados.
- **Recomendaciones**: Forzar `production` por defecto, derivar el modo desde variables de entorno, añadir aserciones que detengan la ejecución cuando falten controles obligatorios.

### 3. Registro de datos personales y tokens anti-bot en texto plano (**Alta**)

- En modo desarrollo, cada payload completo (nombre, RUT, email, teléfonos, comunas, token Turnstile, IP, user-agent) se escribe en `logs/app.log` dentro de la raíz pública.【F:submit.php†L141-L191】
- No existe `.htaccess` ni control de permisos que impida servir el directorio `logs/`. Un atacante que encuentre un listado de directorios puede extraer PII y reutilizar tokens.
- **Recomendaciones**: Ubicar logs fuera del docroot, aplicar máscaras a campos sensibles, rotar/expurgar registros, definir políticas de retención y controles de acceso estrictos.

### 4. Falta de rate limiting efectivo (**Media**)

- Aunque el `config.php` declara `rate_limit`, `submit.php` no implementa ninguna lógica para aplicarlo.【F:config.php†L61-L64】【F:submit.php†L44-L208】
- El endpoint queda expuesto a fuerza bruta, DoS por spam y agotamiento de cuotas de terceros (Sheets, email, Turnstile).
- **Recomendaciones**: Implementar rate limiting server-side (Redis, SQLite, APCu) por IP/Turnstile, añadir backoff exponencial y monitoreo de métricas.

### 5. Posible inyección de encabezados en correo (**Media**)

- El asunto concatena directamente `nombre` sin sanear. Caracteres de nueva línea permitirían agregar encabezados adicionales en `mail()` (header injection).【F:submit.php†L194-L205】
- **Recomendaciones**: Normalizar campos antes de usarlos en encabezados (whitelist de caracteres, reemplazo de saltos de línea), considerar bibliotecas robustas (PHPMailer/SMTP autenticado).

## Observaciones Adicionales

- Los scripts de construcción (`scripts/*.js`) no reciben entrada externa; bajo uso actual el riesgo es bajo. Mantener dependencias actualizadas (Playwright, Terser, csso) para evitar vulnerabilidades de la cadena de suministro.
- Formularios HTML utilizan Turnstile y honeypot, pero carecen de controles básicos de tamaño de carga y límite de archivos adjuntos. Configurar `client_max_body_size`/`LimitRequestBody` en el servidor.
- Revisar políticas de seguridad HTTP (CSP, HSTS, X-Frame-Options) en la configuración del servidor principal; no se establecen en los HTML entregados.

## Recomendaciones Estratégicas

1. **Gobernanza de secretos**: Adoptar `.env` gestionado por `dotenv` o variables del servidor, integrando rotación automática y acceso restringido.
2. **Pipeline de despliegue seguro**: Incluir chequeos que aborten si `APP_ENV` falta o difiere de `production` en despliegues públicos, y automatizar pruebas de humo que validen Turnstile/Sheets antes de exponer cambios.
3. **Monitoreo y alertas**: Configurar logging estructurado fuera del docroot con agregación centralizada; emitir alertas cuando aumente el volumen de errores 4xx/5xx o se detecten firmas de abuso/rate limit.
4. **Protecciones perimetrales**: Activar WAF/Rate limiting a nivel CDN (Cloudflare) complementando el control aplicativo. Revisar reglas para bloquear user-agents maliciosos, patrones anómalos y fijar `client_max_body_size`/`LimitRequestBody`.
5. **Cumplimiento de privacidad**: Clasificar datos recolectados, documentar flujos, cifrar en reposo (Sheets) y firmar acuerdos con terceros según normativa chilena y GDPR/CCPA cuando aplique.

## Checklist de Hardening Recomendado

- [x] Validar `APP_ENV` y forzar `production` como fallback seguro.
- [x] Mover logs fuera del docroot y enmascarar PII en registros.
- [x] Implementar rate limiting aplicativo y sanitizar cabeceras de correo.
- [x] Rechazar requests fuera de la whitelist y mayores al límite configurado.
- [ ] Configurar límites en el servidor web (Nginx/Apache) y deshabilitar listado de directorios/logs.
- [ ] Desplegar reglas WAF/CDN para bloquear patrones de abuso conocidos.
- [ ] Automatizar rotación de secretos y verificación previa al despliegue.
- [ ] Documentar plan de retención y anonimización de datos en Sheets y sistemas secundarios.

## Próximos Pasos Sugeridos

- Revocar/rotar todas las claves expuestas y validar impacto en integraciones.
- Implementar pruebas automatizadas que cubran los nuevos controles (rate limiting, límites de tamaño, sanitización) y agregarlas al pipeline CI/CD.
- Añadir hardening al servidor (permisos de directorios, reglas `.htaccess` o configuración Nginx/Apache) para impedir listado de directorios/logs y propagar cabeceras CSP/HSTS.
- Programar pruebas de intrusión enfocadas en el endpoint `/submit.php` tras aplicar mitigaciones.

---

Informe elaborado por el equipo de auditoría. Para consultas, contacte a seguridad@selectcapital.cl.

