<?php
/**
 * Select Capital — Configuración backend (submit.php)
 * -----------------------------------------------
 * Cómo usar:
 *   $cfg = require __DIR__ . '/config.php';
 */

// Cargar variables de entorno desde .env si existe
if (file_exists(__DIR__ . '/.env')) {
  $envLines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  foreach ($envLines as $line) {
    // Ignorar comentarios
    if (strpos(trim($line), '#') === 0) continue;
    // Parsear KEY=VALUE
    if (strpos($line, '=') !== false) {
      [$key, $value] = explode('=', $line, 2);
      $key = trim($key);
      $value = trim($value);
      if (!empty($key) && !getenv($key)) {
        putenv("$key=$value");
        $_ENV[$key] = $value;
      }
    }
  }
}

return [
  // Entorno y zona horaria
  'app_env'   => 'production',                          // 'development' | 'production'
  'timezone'  => 'America/Santiago',

  // Dominios permitidos (para seguridad y CORS)
  'hostnames' => ['selectcapital.cl', 'www.selectcapital.cl', 'dev.selectcapital.cl'],
  'cors' => [
    'enabled'        => true,
    'allow_origins'  => ['https://selectcapital.cl', 'https://www.selectcapital.cl', 'https://dev.selectcapital.cl'],
    'allow_methods'  => ['POST', 'OPTIONS'],
    'allow_headers'  => ['Content-Type'],
  ],

  // Cloudflare Turnstile (anti-bot)
  'turnstile' => [
    'site_key'   => getenv('TURNSTILE_SITE_KEY') ?: '0x4AAAAAAB_bjq2YOWp-yEXx',
    'secret_key' => getenv('TURNSTILE_SECRET_KEY') ?: '',
    'verify_url' => 'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    'field_name' => 'cf-turnstile-response',
  ],

  // Google Sheets (Apps Script Web App)
  'sheets' => [
    'web_app_url' => getenv('SHEETS_WEB_APP_URL') ?: '',
    'sheet_id'    => getenv('SHEETS_SHEET_ID') ?: '',
    'retries'     => 1,
    'timeout_sec' => 8,
  ],

  // Notificaciones por correo
  'email' => [
    'enabled'        => true,
    'notify_to'      => getenv('EMAIL_NOTIFY_TO') ?: '',
    'from_address'   => getenv('EMAIL_FROM_ADDRESS') ?: 'no-reply@selectcapital.cl',
    'from_name'      => getenv('EMAIL_FROM_NAME') ?: 'Select Capital',
    'subject_prefix' => getenv('EMAIL_SUBJECT_PREFIX') ?: '[Select Capital] Nuevo registro evento',
  ],

  // Web3Forms (Opcional - desactivado por defecto)
  'web3forms' => [
    'enabled'   => filter_var(getenv('WEB3FORMS_ENABLED') ?: 'false', FILTER_VALIDATE_BOOLEAN),
    'endpoint'  => getenv('WEB3FORMS_ENDPOINT') ?: 'https://api.web3forms.com/submit',
    'access_key'=> getenv('WEB3FORMS_ACCESS_KEY') ?: '',
  ],

  // Seguridad
  'security' => [
    'honeypot_field' => 'honey',       // debe existir en el <form>
    'rate_limit' => [                  // rate-limit simple a nivel de IP (si lo implementas)
      'enabled'        => true,
      'max_per_minute' => 5,
    ],
    'allowed_fields' => [              // whitelisting de campos aceptados
      'nombre', 'rut', 'whatsapp', 'email', 'objetivo', 'tipo_ingreso', 'tipo_contrato', 'tipo_ingreso_independiente',
      'renta_liquida', 'capacidad_ahorro_mensual', 'tiene_ahorro', 'monto_ahorro', 'comunas_interes', 'comentarios', 'canal_preferido', 'franja_preferida',
      'consentimiento_privacidad', 'consentimiento_contacto', 'honey',
      'utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid', 'ttclid',
      'cf-turnstile-response'
    ],
    'required_fields' => ['nombre','rut','whatsapp','email','objetivo','tipo_ingreso','renta_liquida','capacidad_ahorro_mensual','tiene_ahorro','comunas_interes','canal_preferido','franja_preferida','consentimiento_privacidad','consentimiento_contacto'],
  ],

  // Redirecciones post-submit
  'redirects' => [
    'success' => 'gracias.html',       // el front igual redirige con ?nombre=
    'error'   => 'error.html',         // opcional (crea un error.html simple)
  ],

  // Tracking (server-side opcional, la landing ya hace client-side)
  'analytics' => [
    'ga4_measurement_id' => 'G-XXXXXXXXXX', // reemplaza si implementas hits server-side
    'meta_pixel_id'      => 'YOUR_PIXEL_ID',
  ],

  // Logging
  'log' => [
    'enabled' => true,
    'path'    => __DIR__ . '/logs/app.log', // asegúrate que /logs tenga permisos de escritura
  ],

  // Google Maps API (para uso en frontend)
  // Carga desde variable de entorno (.env) o fallback a valor por defecto
  'google_maps' => [
    'api_key' => getenv('GOOGLE_MAPS_API_KEY') ?: '',
  ],
];
