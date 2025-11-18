<?php
/**
 * Select Capital — Configuración backend (submit.php)
 * -----------------------------------------------
 * Cómo usar:
 *   $cfg = require __DIR__ . '/config.php';
 *
 * Variables de entorno requeridas:
 *   - APP_ENV (development|production)
 *   - TURNSTILE_SITE_KEY
 *   - TURNSTILE_SECRET_KEY
 *   - SHEETS_WEB_APP_URL
 *   - SHEETS_SHEET_ID
 *   - WEB3FORMS_ACCESS_KEY
 *   - PRIVACY_LOG_USER_AGENT (0|1, opcional)
 *   - PRIVACY_MASK_IP_OCTETS (1-4, opcional)
 */

// Load .env file if it exists
if (file_exists(__DIR__ . '/.env')) {
  $envLines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  foreach ($envLines as $line) {
    $line = trim($line);
    // Skip comments and empty lines
    if (empty($line) || strpos($line, '#') === 0) {
      continue;
    }
    // Parse KEY=VALUE format
    if (strpos($line, '=') !== false) {
      list($key, $value) = explode('=', $line, 2);
      $key = trim($key);
      $value = trim($value);
      // Remove quotes if present
      if ((substr($value, 0, 1) === '"' && substr($value, -1) === '"') ||
          (substr($value, 0, 1) === "'" && substr($value, -1) === "'")) {
        $value = substr($value, 1, -1);
      }
      // Set environment variable if not already set
      if (!getenv($key)) {
        putenv("$key=$value");
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
      }
    }
  }
}

$optionalEnv = static function (string $key, $default = null) {
  $value = getenv($key);
  if ($value === false || $value === '') {
    return $default;
  }
  return $value;
};

$requiredEnv = static function (string $key, string $description) use ($optionalEnv) {
  $value = $optionalEnv($key);
  if ($value === null || $value === '') {
    throw new RuntimeException(sprintf('Environment variable %s (%s) is required', $key, $description));
  }
  return $value;
};

$boolEnv = static function (string $key, bool $default = false) use ($optionalEnv): bool {
  $value = $optionalEnv($key);
  if ($value === null) return $default;
  return filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? $default;
};

$intEnv = static function (string $key, int $default) use ($optionalEnv): int {
  $value = $optionalEnv($key);
  if ($value === null) return $default;
  $int = filter_var($value, FILTER_VALIDATE_INT);
  return $int === false ? $default : $int;
};

// Deriva APP_ENV con fallback seguro y validación
$appEnv = $optionalEnv('APP_ENV');
if ($appEnv === null || $appEnv === '') {
  $appEnv = 'production';
}
$appEnv = strtolower($appEnv);
if (!in_array($appEnv, ['development', 'production'], true)) {
  throw new RuntimeException('APP_ENV must be either development or production');
}

return [
  // Entorno y zona horaria
  'app_env'   => $appEnv,
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
    'site_key'   => $requiredEnv('TURNSTILE_SITE_KEY', 'Cloudflare Turnstile site key'),
    'secret_key' => $requiredEnv('TURNSTILE_SECRET_KEY', 'Cloudflare Turnstile secret key'),
    'verify_url' => 'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    'field_name' => 'cf-turnstile-response',            // nombre por defecto del token
  ],

  // Google Sheets (Apps Script Web App)
  'sheets' => [
    // URL de la App Web (Deployment) que escribe en la hoja
    'web_app_url' => $requiredEnv('SHEETS_WEB_APP_URL', 'Google Apps Script deployment URL'),
    // Solo informativo / logging:
    'sheet_id'    => $requiredEnv('SHEETS_SHEET_ID', 'Google Sheet identifier'),
    // Reintentos si la app web está lenta
    'retries'     => 1,
    'timeout_sec' => 8,
  ],

  // Notificaciones por correo (si implementas mail() o SMTP en submit.php)
  'email' => [
    'enabled'        => true,                           // pon en false si no enviarás correo
    'notify_to'      => 'edaza@capitalinteligente.cl',
    'from_address'   => 'no-reply@selectcapital.cl',    // idealmente un remitente del dominio
    'from_name'      => 'Select Capital',
    'subject_prefix' => '[Select Capital] Nuevo registro evento',
  ],

  // (Opcional) Fallback a Web3Forms (desactivado en Opción B)
  'web3forms' => [
    'enabled'   => false,
    'endpoint'  => 'https://api.web3forms.com/submit',
    'access_key'=> $requiredEnv('WEB3FORMS_ACCESS_KEY', 'Web3Forms access key'),
  ],

  // Seguridad
  'security' => [
    'honeypot_field' => 'honey',       // debe existir en el <form>
    'rate_limit' => [                  // rate-limit simple a nivel de IP (si lo implementas)
      'enabled'        => true,
      'max_per_minute' => 5,
      'window_seconds' => 60,
      'store'          => $optionalEnv('RATE_LIMIT_STORE', dirname(__DIR__) . '/storage/runtime/rate-limit.json'),
    ],
    'max_request_bytes' => $intEnv('MAX_REQUEST_BYTES', 65536),
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
    'path'    => $optionalEnv('APP_LOG_PATH', dirname(__DIR__) . '/storage/logs/app.log'),
  ],

  // Privacidad
  'privacy' => [
    'mask_ip_octets' => max(0, min(4, $intEnv('PRIVACY_MASK_IP_OCTETS', 1))),
    'log_user_agent' => $boolEnv('PRIVACY_LOG_USER_AGENT', false),
  ],
];
