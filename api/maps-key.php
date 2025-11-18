<?php
/**
 * API endpoint para obtener la clave de Google Maps de forma segura
 * Solo devuelve la clave si está configurada, nunca expone errores
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); // Ajustar según necesidad

$cfg = require __DIR__ . '/../config.php';
$apiKey = $cfg['google_maps']['api_key'] ?? '';

// Solo devolver la clave si existe
if (!empty($apiKey)) {
  echo json_encode(['key' => $apiKey]);
} else {
  // No exponer que falta la clave, solo devolver vacío
  echo json_encode(['key' => '']);
}
