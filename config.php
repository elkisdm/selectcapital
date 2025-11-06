<?php
/**
 * Select Capital — Configuración backend (submit.php)
 * -----------------------------------------------
 * Cómo usar:
 *   $cfg = require __DIR__ . '/config.php';
 */

return [
  // Entorno y zona horaria
  'app_env'   => 'development',                          // 'development' | 'production'
  'timezone'  => 'America/Santiago',

  // Dominios permitidos (para seguridad y CORS)
  'hostnames' => ['selectcapital.cl', 'www.selectcapital.cl'],
  'cors' => [
    'enabled'        => true,
    'allow_origins'  => ['https://selectcapital.cl', 'https://www.selectcapital.cl'],
    'allow_methods'  => ['POST', 'OPTIONS'],
    'allow_headers'  => ['Content-Type'],
  ],

  // Cloudflare Turnstile (anti-bot)
  'turnstile' => [
    'site_key'   => '0x4AAAAAAB_bjq2YOWp-yEXx',        // pública (para el front)
    'secret_key' => '0x4AAAAAAB_bjollQuBnkgXK0WKzmmgdE6o', // privada (solo backend)
    'verify_url' => 'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    'field_name' => 'cf-turnstile-response',            // nombre por defecto del token
  ],

  // Google Sheets (Apps Script Web App)
  'sheets' => [
    // URL de la App Web (Deployment) que escribe en la hoja
    'web_app_url' => 'https://script.google.com/macros/s/AKfycbyJ6faB2lKIDRUGJ0A_cymYTlqS8zZxMFmz2gYEdijSKEBYyMKwUdXSkE26qYbq1bBWDw/exec',
    // Solo informativo / logging:
    'sheet_id'    => '1OJpSM5URoAA9pRB_JcD4JNMpK4h-tRbwkWYo5Gh0qbI',
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
    'access_key'=> 'ce1f62be-1002-4ae1-9fe9-71795884b79b',
  ],

  // Seguridad
  'security' => [
    'honeypot_field' => 'honey',       // debe existir en el <form>
    'rate_limit' => [                  // rate-limit simple a nivel de IP (si lo implementas)
      'enabled'        => true,
      'max_per_minute' => 5,
    ],
    'allowed_fields' => [              // whitelisting de campos aceptados
      'nombre', 'whatsapp', 'email', 'ingresos_mensuales_clp',
      'utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid', 'ttclid'
    ],
    'required_fields' => ['nombre','whatsapp','email','ingresos_mensuales_clp'],
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
];
