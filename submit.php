<?php
// submit.php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

$cfg = require __DIR__ . '/config.php';
date_default_timezone_set($cfg['timezone'] ?? 'America/Santiago');

// Simple logger (auto-creates logs directory)
function app_log(string $message, string $level = 'INFO'): void {
  global $cfg;
  if (empty($cfg['log']['enabled'])) return;
  $path = $cfg['log']['path'] ?? (__DIR__ . '/logs/app.log');
  $dir  = dirname($path);
  if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
    error_log('[submit.php] Cannot create log directory: ' . $dir);
    return;
  }
  $line = sprintf('[%s] [%s] %s%s', date('c'), strtoupper($level), $message, PHP_EOL);
  if (file_put_contents($path, $line, FILE_APPEND | LOCK_EX) === false) {
    error_log('[submit.php] Cannot write log file: ' . $path . ' message=' . $message);
  }
}

function anonymize_ip(?string $ip, int $maskOctets = 1): string {
  if (!$ip) return '';
  if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
    $parts = explode('.', $ip);
    $mask = max(0, min(4, $maskOctets));
    for ($i = 1; $i <= $mask; $i++) {
      $idx = count($parts) - $i;
      if ($idx >= 0) {
        $parts[$idx] = '0';
      }
    }
    return implode('.', $parts);
  }

  if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
    $segments = explode(':', $ip);
    $segments = array_values(array_filter($segments, static fn($seg) => $seg !== ''));
    $visible = max(0, min(count($segments), 4));
    $anonymized = implode(':', array_slice($segments, 0, $visible));
    return $anonymized . '::';
  }

  return '';
}

function mask_rut(string $rut): string {
  $clean = preg_replace('/[^0-9kK]/', '', $rut);
  $len = strlen($clean);
  if ($len <= 4) {
    return str_repeat('*', $len);
  }
  return str_repeat('*', $len - 4) . substr($clean, -4);
}

function mask_email(string $email): string {
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    return '***';
  }
  [$user, $domain] = explode('@', $email, 2);
  $userLen = strlen($user);
  if ($userLen <= 2) {
    return str_repeat('*', $userLen) . '@' . $domain;
  }
  $start = substr($user, 0, 1);
  $end = substr($user, -1);
  return $start . str_repeat('*', $userLen - 2) . $end . '@' . $domain;
}

function summarize_payload_for_log(array $payload): array {
  return [
    'timestamp' => $payload['timestamp'] ?? date('c'),
    'nombre'    => $payload['nombre'] ?? '',
    'rut_masked'=> isset($payload['rut']) ? mask_rut((string)$payload['rut']) : '',
    'email_masked' => isset($payload['email']) ? mask_email((string)$payload['email']) : '',
    'hash'      => hash('sha256', json_encode([
      $payload['rut'] ?? '',
      $payload['email'] ?? '',
      $payload['whatsapp'] ?? '',
    ])),
  ];
}

function should_log_user_agent(): bool {
  global $cfg;
  return !empty($cfg['privacy']['log_user_agent']);
}

function sanitize_header_value(string $value): string {
  $value = preg_replace("/[\r\n]+/", ' ', $value);
  $value = trim($value);
  return substr($value, 0, 120);
}

function sanitize_input(string $value, int $maxLength = 500): string {
  // Remover caracteres de control excepto espacios
  $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value);
  // Normalizar espacios en blanco
  $value = preg_replace('/\s+/', ' ', $value);
  $value = trim($value);
  // Limitar longitud
  if (strlen($value) > $maxLength) {
    $value = substr($value, 0, $maxLength);
  }
  return $value;
}

function enforce_rate_limit(string $identifier): void {
  global $cfg;
  $rlCfg = $cfg['security']['rate_limit'] ?? [];
  if (empty($rlCfg['enabled'])) return;

  $maxPerMinute  = (int)($rlCfg['max_per_minute'] ?? 0);
  $windowSeconds = max(1, (int)($rlCfg['window_seconds'] ?? 60));
  $storePath     = $rlCfg['store'] ?? (dirname(__DIR__) . '/storage/runtime/rate-limit.json');

  if ($maxPerMinute <= 0) return;

  $dir = dirname($storePath);
  if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
    app_log('RATE_LIMIT_CANNOT_CREATE_DIR dir=' . $dir, 'ERROR');
    fail(500, 'No se pudo aplicar control de tasa.');
  }

  $now = time();
  $key = hash('sha256', $identifier);
  $data = [];

  $fp = fopen($storePath, 'c+');
  if ($fp === false) {
    app_log('RATE_LIMIT_CANNOT_OPEN_STORE path=' . $storePath, 'ERROR');
    fail(500, 'No se pudo aplicar control de tasa.');
  }

  try {
    if (!flock($fp, LOCK_EX)) {
      throw new RuntimeException('No lock');
    }

    $contents = stream_get_contents($fp);
    if ($contents !== false && $contents !== '') {
      $decoded = json_decode($contents, true);
      if (is_array($decoded)) {
        $data = $decoded;
      }
    }

    $entry = $data[$key] ?? ['count' => 0, 'reset' => $now + $windowSeconds];
    if ($entry['reset'] <= $now) {
      $entry = ['count' => 0, 'reset' => $now + $windowSeconds];
    }

    $entry['count']++;
    if ($entry['count'] > $maxPerMinute) {
      $retryAfter = max(1, $entry['reset'] - $now);
      $data[$key] = $entry;
      ftruncate($fp, 0);
      rewind($fp);
      fwrite($fp, json_encode($data));
      fflush($fp);
      fail(429, 'Demasiadas solicitudes. Intenta nuevamente en unos segundos.', ['retry_after' => $retryAfter]);
    }

    $data[$key] = $entry;

    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($data));
    fflush($fp);
  } finally {
    flock($fp, LOCK_UN);
    fclose($fp);
  }
}

// CORS (if enabled)
if (!headers_sent() && !empty($cfg['cors']['enabled'])) {
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  $allowOrigins = $cfg['cors']['allow_origins'] ?? [];
  if ($origin && (in_array($origin, $allowOrigins, true) || ($cfg['app_env'] ?? 'production') !== 'production')) {
    header('Access-Control-Allow-Origin: ' . $origin);
  }
  header('Vary: Origin');
  header('Access-Control-Allow-Methods: ' . implode(',', $cfg['cors']['allow_methods'] ?? ['POST','OPTIONS']));
  header('Access-Control-Allow-Headers: ' . implode(',', $cfg['cors']['allow_headers'] ?? ['Content-Type']));
}

// Preflight
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
  http_response_code(204);
  exit;
}

function fail(int $code, string $msg, array $extra = []){
  http_response_code($code);
  echo json_encode(['ok'=>false,'message'=>$msg] + $extra, JSON_UNESCAPED_UNICODE);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405, 'Método no permitido.');

// Validar Content-Type
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos($contentType, 'multipart/form-data') === false && strpos($contentType, 'application/x-www-form-urlencoded') === false) {
  fail(415, 'Content-Type no permitido.');
}

// Validar tamaño máximo del request
$maxBytes = (int)($cfg['security']['max_request_bytes'] ?? 10 * 1024 * 1024); // Default 10MB
$contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($maxBytes > 0 && $contentLength > $maxBytes) {
  fail(413, 'El tamaño del formulario excede el límite permitido.');
}

$env  = $cfg['app_env'] ?? 'production';
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($env === 'production') {
  // Normaliza y valida host considerando proxies/CDN
  $rawHosts = [];
  if (!empty($host)) $rawHosts[] = $host;
  if (!empty($_SERVER['HTTP_X_FORWARDED_HOST'])) $rawHosts[] = $_SERVER['HTTP_X_FORWARDED_HOST'];
  if (!empty($_SERVER['HTTP_X_ORIGINAL_HOST'])) $rawHosts[] = $_SERVER['HTTP_X_ORIGINAL_HOST'];

  // X-Forwarded-Host puede traer lista separada por comas; explotar y normalizar
  $requestHosts = [];
  foreach ($rawHosts as $h) {
    foreach (explode(',', $h) as $part) {
      $trimmed = strtolower(trim($part));
      // elimina puerto si viene (e.g. example.com:443)
      $withoutPort = explode(':', $trimmed)[0];
      if ($withoutPort !== '') $requestHosts[] = $withoutPort;
    }
  }
  $requestHosts = array_values(array_unique($requestHosts));

  $allowedHosts = array_map(function($h){ return strtolower($h); }, $cfg['hostnames'] ?? []);

  $hostOk = false;
  foreach ($requestHosts as $rh) {
    if (in_array($rh, $allowedHosts, true)) { $hostOk = true; break; }
  }

  if (!$hostOk) {
    app_log('HOSTNAME_MISMATCH request_hosts=' . json_encode($requestHosts) . ' allowed_hosts=' . json_encode($allowedHosts));
    fail(403, 'Hostname no permitido. En config.php agrega el dominio recibido.', [
      'received_hosts' => $requestHosts,
    ]);
  }
} else {
  // In development, log and allow any host to ease local testing
  app_log("DEV MODE: request from host={$host}");
}
enforce_rate_limit($_SERVER['REMOTE_ADDR'] ?? 'unknown');
if (!empty($cfg['security']['honeypot_field']) && !empty($_POST[$cfg['security']['honeypot_field']])) {
  fail(400, 'Bot detectado.');
}

$allowed = $cfg['security']['allowed_fields'] ?? [];
$data = [];
$receivedFields = array_keys($_POST);
$unknown = array_values(array_diff($receivedFields, $allowed));
if (!empty($unknown)) {
  app_log('UNKNOWN_FIELDS_DETECTED fields=' . json_encode($unknown));
  fail(400, 'Campos no permitidos en la solicitud.');
}
foreach ($allowed as $f) { 
  $rawValue = $_POST[$f] ?? '';
  // Sanitizar según el tipo de campo
  if (in_array($f, ['nombre', 'comentarios'], true)) {
    $data[$f] = sanitize_input((string)$rawValue, 200);
  } elseif (in_array($f, ['email'], true)) {
    $data[$f] = sanitize_input((string)$rawValue, 100);
  } elseif (in_array($f, ['whatsapp', 'rut'], true)) {
    $data[$f] = sanitize_input((string)$rawValue, 20);
  } else {
    $data[$f] = sanitize_input((string)$rawValue, 100);
  }
}

$required = $cfg['security']['required_fields'] ?? ['nombre','rut','email','whatsapp','objetivo','tipo_ingreso','renta_liquida','capacidad_ahorro_mensual','tiene_ahorro','comunas_interes','canal_preferido','franja_preferida','consentimiento_privacidad','consentimiento_contacto'];
foreach ($required as $f) if (empty($data[$f])) fail(400, "Falta el campo requerido: $f");

if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) fail(400, 'Email inválido.');
if (!preg_match('/^(?:\+?56\s?)?9\s?\d{4}\s?\d{4}$/', $data['whatsapp'])) fail(400, 'WhatsApp inválido. Usa +56 9 xxxx xxxx');

$tieneAhorro = strtolower($data['tiene_ahorro'] ?? '') === 'si';
if ($tieneAhorro && empty($data['monto_ahorro'])) {
  fail(400, 'Ingresa el monto de ahorro disponible.');
}
if (!$tieneAhorro) {
  $data['monto_ahorro'] = '0';
}

// capacidad_ahorro_mensual is optional, default to '0' if empty
if (empty($data['capacidad_ahorro_mensual'])) {
  $data['capacidad_ahorro_mensual'] = '0';
}

// Turnstile verification (skip in development)
if ($env === 'production') {
  $tsToken = $_POST[$cfg['turnstile']['field_name'] ?? 'cf-turnstile-response'] ?? '';
  if (!$tsToken) fail(400, 'Falta token de Turnstile.');

  $tsBody = http_build_query([
    'secret'   => $cfg['turnstile']['secret_key'],
    'response' => $tsToken,
    'remoteip' => $_SERVER['REMOTE_ADDR'] ?? null,
  ]);
  $ch = curl_init($cfg['turnstile']['verify_url']);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $tsBody,
    CURLOPT_TIMEOUT => 10,
  ]);
  $tsRes = curl_exec($ch);
  $tsErr = curl_error($ch);
  curl_close($ch);
  if ($tsErr) {
    app_log('TURNSTILE_CURL_ERROR detail=' . $tsErr, 'ERROR');
    fail(502, 'No se pudo verificar Turnstile.', ['detail'=>$tsErr]);
  }

  $j = json_decode((string)$tsRes, true);
  if (!($j['success'] ?? false)) {
    $codes = implode(',', $j['error-codes'] ?? []);
    $hostname = $j['hostname'] ?? '';
    app_log('TURNSTILE_REJECTED codes=' . $codes . ' hostname=' . $hostname, 'WARNING');
    fail(400, 'Turnstile rechazado. Verifica hostnames en Cloudflare.', ['codes'=>$codes, 'hostname'=>$hostname]);
  }
} else {
  app_log('DEV MODE: Turnstile verification skipped');
}

$maskOctets = (int)($cfg['privacy']['mask_ip_octets'] ?? 1);
$clientIp   = anonymize_ip($_SERVER['REMOTE_ADDR'] ?? '', $maskOctets);
$clientUa   = should_log_user_agent() ? (string)($_SERVER['HTTP_USER_AGENT'] ?? '') : '';

$payload = [
  'timestamp' => date('c'),
  'nombre'    => $data['nombre'],
  'rut'       => $data['rut'],
  'email'     => $data['email'],
  'whatsapp'  => $data['whatsapp'],
  'objetivo'  => $data['objetivo'],
  'tipo_ingreso' => $data['tipo_ingreso'],
  'tipo_contrato' => $data['tipo_contrato'] ?? '',
  'tipo_ingreso_independiente' => $data['tipo_ingreso_independiente'] ?? '',
  'renta_liquida' => $data['renta_liquida'],
  'capacidad_ahorro_mensual' => $data['capacidad_ahorro_mensual'],
  'tiene_ahorro' => $data['tiene_ahorro'],
  'monto_ahorro' => $data['monto_ahorro'],
  'comunas_interes' => $data['comunas_interes'],
  'comentarios' => $data['comentarios'] ?? '',
  'canal_preferido' => $data['canal_preferido'],
  'franja_preferida' => $data['franja_preferida'],
  'consentimiento_privacidad' => $data['consentimiento_privacidad'],
  'consentimiento_contacto' => $data['consentimiento_contacto'],
  'utm_source'=> $data['utm_source'] ?? '',
  'utm_medium'=> $data['utm_medium'] ?? '',
  'utm_campaign'=> $data['utm_campaign'] ?? '',
  'gclid'     => $data['gclid'] ?? '',
  'fbclid'    => $data['fbclid'] ?? '',
  'ttclid'    => $data['ttclid'] ?? '',
  'ip'        => $clientIp,
  'ua'        => $clientUa,
];

// Persist to Google Sheets via Apps Script (skip network in development)
if ($env === 'production') {
  $execUrl = $cfg['sheets']['web_app_url'];
  $ch = curl_init($execUrl);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query($payload),
    CURLOPT_TIMEOUT => (int)($cfg['sheets']['timeout_sec'] ?? 8),
    CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
  ]);
  $resp = curl_exec($ch);
  $err  = curl_error($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  if ($err) {
    app_log('APPS_SCRIPT_CURL_ERROR detail=' . $err, 'ERROR');
    fail(502, 'No se pudo escribir en Google Sheets (Apps Script).', ['detail'=>$err]);
  }
  if ($code < 200 || $code >= 300) {
    app_log('APPS_SCRIPT_HTTP_ERROR status=' . $code . ' body=' . substr((string)$resp, 0, 512), 'ERROR');
    fail(502, 'Apps Script respondió con error.', ['status'=>$code, 'body'=>$resp]);
  }
} else {
  app_log('DEV MODE: Skipping Apps Script call; logging payload');
  $summary = summarize_payload_for_log($payload);
  app_log('PayloadSummary: ' . json_encode($summary, JSON_UNESCAPED_UNICODE));
}

$mailSent = null;
if (!empty($cfg['email']['enabled'])) {
  $to = $cfg['email']['notify_to'];
  $cleanNombre = sanitize_header_value($data['nombre']);
  $subj = ($cfg['email']['subject_prefix'] ?? '[Nueva solicitud]') . ' ' . $cleanNombre;
  $body = "Nombre: {$data['nombre']}\nRUT: {$data['rut']}\nEmail: {$data['email']}\nWhatsApp: {$data['whatsapp']}\n"
        . "Objetivo: {$data['objetivo']}\nTipo Ingreso: {$data['tipo_ingreso']}\n"
        . "Renta Líquida: {$data['renta_liquida']}\nCapacidad Ahorro Mensual: {$data['capacidad_ahorro_mensual']}\nTiene Ahorro: {$data['tiene_ahorro']}\nMonto Ahorro: {$data['monto_ahorro']}\n"
        . "Comunas: {$data['comunas_interes']}\nComentarios: {$data['comentarios']}\n"
        . "Canal Preferido: {$data['canal_preferido']}\nFranja: {$data['franja_preferida']}\n"
        . "UTM: {$data['utm_source']} / {$data['utm_medium']} / {$data['utm_campaign']}\n"
        . "IP (truncada): {$payload['ip']}\n";

  if ($clientUa !== '') {
    $body .= "UA: {$payload['ua']}\n";
  } else {
    $body .= "UA: (no almacenado por políticas de privacidad)\n";
  }

  $body .= "Fecha: {$payload['timestamp']}\n";
  $headers = 'From: ' . ($cfg['email']['from_name'] ?? 'Select Capital') . ' <' . ($cfg['email']['from_address'] ?? 'no-reply@selectcapital.cl') . '>';
  $mailSent = mail($to, $subj, $body, $headers);
  if (!$mailSent) {
    app_log('MAIL_SEND_FAILED to=' . $to, 'ERROR');
  }
}

$response = ['ok'=>true,'message'=>'Registro almacenado.'];
if ($mailSent !== null) {
  $response['mail_sent'] = (bool)$mailSent;
}
if (should_log_user_agent()) {
  $response['ua_logged'] = true;
}

echo json_encode($response);
