<?php
/* ============================================================
   sync.php — Ciao Italia Fortschritts-Sync (Server-Backup)
   ------------------------------------------------------------
   Ablage: sync-data/<sha256("ciaoit:"+CODE)>.json
   Zugriff: Header "X-Sync-Code" (mindestens 6 Zeichen).
   Der Code wird beim ERSTEN Verbinden festgelegt.
   Code ändern = per FTP den Inhalt von sync-data/ löschen
   (nur .htaccess und index.html bleiben liegen).
   Voraussetzung: HTTPS (bei lima-city erzwingen).
   ============================================================ */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

define('DATA_DIR', __DIR__ . '/sync-data');
define('MAX_BYTES', 6291456); // 6 MB

function fail($msg, $code = 400) {
  http_response_code($code);
  echo json_encode(array('ok' => false, 'error' => $msg));
  exit;
}

if (!is_dir(DATA_DIR)) { @mkdir(DATA_DIR, 0700, true); }

$code = isset($_SERVER['HTTP_X_SYNC_CODE']) ? (string)$_SERVER['HTTP_X_SYNC_CODE'] : '';
if (strlen($code) < 6) fail('Sync-Code fehlt oder zu kurz (mindestens 6 Zeichen).', 401);

$authFile = DATA_DIR . '/auth.json';
if (!file_exists($authFile)) {
  // Erster Kontakt: Code wird festgelegt (trust-on-first-use)
  @file_put_contents($authFile, json_encode(array('hash' => password_hash($code, PASSWORD_DEFAULT))));
} else {
  $auth = json_decode((string)@file_get_contents($authFile), true);
  if (!is_array($auth) || empty($auth['hash']) || !password_verify($code, $auth['hash'])) {
    fail('Sync-Code falsch.', 401);
  }
}

$action = isset($_GET['action']) ? (string)$_GET['action'] : '';
$file = DATA_DIR . '/' . hash('sha256', 'ciaoit:' . $code) . '.json';

if ($action === 'load') {
  if (!file_exists($file)) fail('Noch keine Daten auf dem Server.', 404);
  $blob = json_decode((string)file_get_contents($file), true);
  if (!is_array($blob)) fail('Server-Daten beschädigt.', 500);
  echo json_encode(array('ok' => true, 'blob' => $blob));
  exit;
}

if ($action === 'save' && ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  $raw = (string)@file_get_contents('php://input');
  if (strlen($raw) > MAX_BYTES) fail('Daten zu groß (Limit 6 MB).', 413);
  $data = json_decode($raw);
  if (!is_object($data) || !isset($data->savedAt)) fail('Ungültige Daten.');
  if (@file_put_contents($file, $raw, LOCK_EX) === false) fail('Schreiben fehlgeschlagen.', 500);
  echo json_encode(array('ok' => true, 'savedAt' => $data->savedAt));
  exit;
}

fail('Unbekannte Aktion.');
