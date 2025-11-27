<?php
/**
 * Meta Conversions API - Módulo para enviar eventos desde el servidor
 * 
 * Documentación: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

/**
 * Envía un evento a la API de Conversiones de Meta
 * 
 * @param array $config Configuración con 'pixel_id', 'access_token', 'test_event_code' (opcional)
 * @param string $eventName Nombre del evento (Lead, PageView, etc.)
 * @param array $eventData Datos del evento (user_data, custom_data, etc.)
 * @param string|null $eventId ID único del evento para deduplicación (debe coincidir con el del pixel)
 * @return array Respuesta de la API o null si falla
 */
function send_meta_conversion_event(array $config, string $eventName, array $eventData, ?string $eventId = null): ?array {
  $pixelId = $config['pixel_id'] ?? '';
  $accessToken = $config['access_token'] ?? '';
  $testEventCode = $config['test_event_code'] ?? null;
  
  if (empty($pixelId) || empty($accessToken)) {
    error_log('[Meta Conversions API] Missing pixel_id or access_token');
    return null;
  }
  
  // Construir el payload del evento
  $event = [
    'event_name' => $eventName,
    'event_time' => time(),
    'action_source' => 'website',
  ];
  
  // Agregar event_id si se proporciona (para deduplicación)
  if ($eventId !== null) {
    $event['event_id'] = $eventId;
  }
  
  // Agregar user_data
  if (isset($eventData['user_data'])) {
    $event['user_data'] = $eventData['user_data'];
  }
  
  // Agregar custom_data
  if (isset($eventData['custom_data'])) {
    $event['custom_data'] = $eventData['custom_data'];
  }
  
  // Agregar test_event_code si está en modo test
  if ($testEventCode !== null && $testEventCode !== '') {
    $event['test_event_code'] = $testEventCode;
  }
  
  $payload = [
    'data' => [$event],
  ];
  
  // URL de la API
  $url = "https://graph.facebook.com/v18.0/{$pixelId}/events";
  
  // Parámetros de la query string
  $params = [
    'access_token' => $accessToken,
  ];
  
  $urlWithParams = $url . '?' . http_build_query($params);
  
  // Enviar request
  $ch = curl_init($urlWithParams);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
      'Content-Type: application/json',
    ],
    CURLOPT_TIMEOUT => 10,
  ]);
  
  $response = curl_exec($ch);
  $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $curlError = curl_error($ch);
  curl_close($ch);
  
  if ($curlError) {
    error_log('[Meta Conversions API] cURL error: ' . $curlError);
    return null;
  }
  
  if ($httpCode < 200 || $httpCode >= 300) {
    error_log('[Meta Conversions API] HTTP error ' . $httpCode . ': ' . substr($response, 0, 500));
    return null;
  }
  
  $decoded = json_decode($response, true);
  if ($decoded === null) {
    error_log('[Meta Conversions API] Invalid JSON response: ' . substr($response, 0, 500));
    return null;
  }
  
  return $decoded;
}

/**
 * Prepara user_data para la API de Conversiones
 * 
 * @param array $data Datos del formulario
 * @param string|null $clientIp IP del cliente
 * @param string|null $userAgent User Agent del cliente
 * @return array user_data formateado
 */
function prepare_meta_user_data(array $data, ?string $clientIp = null, ?string $userAgent = null): array {
  $userData = [];
  
  // Email (hasheado SHA256)
  if (!empty($data['email'])) {
    $userData['em'] = [hash('sha256', strtolower(trim($data['email'])))];
  }
  
  // Teléfono (hasheado SHA256, solo dígitos)
  if (!empty($data['whatsapp'])) {
    $phone = preg_replace('/[^0-9]/', '', $data['whatsapp']);
    if (!empty($phone)) {
      $userData['ph'] = [hash('sha256', $phone)];
    }
  }
  
  // IP address (hasheada)
  if ($clientIp !== null && $clientIp !== '') {
    $userData['client_ip_address'] = $clientIp;
  }
  
  // User Agent
  if ($userAgent !== null && $userAgent !== '') {
    $userData['client_user_agent'] = $userAgent;
  }
  
  // First name (hasheado, opcional)
  if (!empty($data['nombre'])) {
    $nameParts = explode(' ', trim($data['nombre']), 2);
    if (!empty($nameParts[0])) {
      $userData['fn'] = [hash('sha256', strtolower($nameParts[0]))];
    }
  }
  
  return $userData;
}

/**
 * Prepara custom_data para el evento Lead
 * 
 * @param array $data Datos del formulario
 * @return array custom_data formateado
 */
function prepare_meta_custom_data(array $data): array {
  $customData = [
    'content_name' => $data['proyecto'] ?? 'Asesoría Integral',
    'content_category' => 'Formulario Contacto',
  ];
  
  // Agregar información adicional si está disponible
  if (!empty($data['objetivo'])) {
    $customData['content_ids'] = [$data['objetivo']];
  }
  
  // Valor del lead (opcional, puedes calcularlo basado en calificación financiera)
  $value = 0;
  if (!empty($data['renta_rango'])) {
    // Mapear rangos de renta a valores estimados
    $rentaMap = [
      'menos-1200' => 50,
      '1200-1600' => 75,
      '1600-2000' => 100,
      '2000-2500' => 150,
      '2500-3000' => 200,
      'mas-3000' => 300,
    ];
    $value = $rentaMap[$data['renta_rango']] ?? 50;
  }
  $customData['value'] = $value;
  $customData['currency'] = 'CLP';
  
  return $customData;
}

/**
 * Genera un event_id único basado en timestamp y datos del usuario
 * 
 * @param array $data Datos del formulario
 * @return string event_id
 */
function generate_meta_event_id(array $data): string {
  $seed = [
    time(),
    $data['email'] ?? '',
    $data['whatsapp'] ?? '',
    $data['nombre'] ?? '',
    microtime(true),
  ];
  return hash('sha256', implode('|', $seed));
}


