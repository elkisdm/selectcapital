<?php
// submit.php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

$cfg = require __DIR__ . '/config.php';
date_default_timezone_set($cfg['timezone'] ?? 'America/Santiago');

// Simple logger (auto-creates logs directory)
function app_log(string $message): void {
  global $cfg;
  if (empty($cfg['log']['enabled'])) return;
  $path = $cfg['log']['path'] ?? (__DIR__ . '/logs/app.log');
  $dir  = dirname($path);
  if (!is_dir($dir)) { @mkdir($dir, 0775, true); }
  $line = '[' . date('c') . '] ' . $message . "\n";
  @file_put_contents($path, $line, FILE_APPEND);
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
if (!empty($cfg['security']['honeypot_field']) && !empty($_POST[$cfg['security']['honeypot_field']])) {
  fail(400, 'Bot detectado.');
}

$allowed = $cfg['security']['allowed_fields'] ?? [];
$data = [];
foreach ($allowed as $f) { $data[$f] = trim((string)($_POST[$f] ?? '')); }

$required = $cfg['security']['required_fields'] ?? ['nombre','rut','email','whatsapp','objetivo','tipo_ingreso','renta_liquida','monto_ahorro','comunas_interes','canal_preferido','franja_preferida','consentimiento_privacidad','consentimiento_contacto'];
foreach ($required as $f) if (empty($data[$f])) fail(400, "Falta el campo requerido: $f");

if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) fail(400, 'Email inválido.');
if (!preg_match('/^(?:\+?56\s?)?9\s?\d{4}\s?\d{4}$/', $data['whatsapp'])) fail(400, 'WhatsApp inválido. Usa +56 9 xxxx xxxx');

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
  if ($tsErr) fail(502, 'No se pudo verificar Turnstile.', ['detail'=>$tsErr]);

  $j = json_decode((string)$tsRes, true);
  if (!($j['success'] ?? false)) {
    $codes = implode(',', $j['error-codes'] ?? []);
    $hostname = $j['hostname'] ?? '';
    fail(400, 'Turnstile rechazado. Verifica hostnames en Cloudflare.', ['codes'=>$codes, 'hostname'=>$hostname]);
  }
} else {
  app_log('DEV MODE: Turnstile verification skipped');
}

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
  'ip'        => $_SERVER['REMOTE_ADDR'] ?? '',
  'ua'        => $_SERVER['HTTP_USER_AGENT'] ?? '',
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

  if ($err) fail(502, 'No se pudo escribir en Google Sheets (Apps Script).', ['detail'=>$err]);
  if ($code < 200 || $code >= 300) fail(502, 'Apps Script respondió con error.', ['status'=>$code, 'body'=>$resp]);
} else {
  app_log('DEV MODE: Skipping Apps Script call; logging payload');
  app_log('Payload: ' . json_encode($payload, JSON_UNESCAPED_UNICODE));
}

if (!empty($cfg['email']['enabled'])) {
  $to = $cfg['email']['notify_to'];
  $subj = ($cfg['email']['subject_prefix'] ?? '[Nueva solicitud]') . ' ' . $data['nombre'];
  $body = "Nombre: {$data['nombre']}\nRUT: {$data['rut']}\nEmail: {$data['email']}\nWhatsApp: {$data['whatsapp']}\n"
        . "Objetivo: {$data['objetivo']}\nTipo Ingreso: {$data['tipo_ingreso']}\n"
        . "Renta Líquida: {$data['renta_liquida']}\nMonto Ahorro: {$data['monto_ahorro']}\n"
        . "Comunas: {$data['comunas_interes']}\nComentarios: {$data['comentarios']}\n"
        . "Canal Preferido: {$data['canal_preferido']}\nFranja: {$data['franja_preferida']}\n"
        . "UTM: {$data['utm_source']} / {$data['utm_medium']} / {$data['utm_campaign']}\n"
        . "IP: {$payload['ip']}\nUA: {$payload['ua']}\nFecha: {$payload['timestamp']}\n";
  $headers = 'From: ' . ($cfg['email']['from_name'] ?? 'Select Capital') . ' <' . ($cfg['email']['from_address'] ?? 'no-reply@selectcapital.cl') . '>';
  @mail($to, $subj, $body, $headers);
}

echo json_encode(['ok'=>true,'message'=>'Registro almacenado.']);
