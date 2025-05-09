<?php
// notification_daemon.php
// ADVERTENCIA: Este script está diseñado para ejecutarse continuamente.
// DEBES usar un gestor de procesos (como supervisor o systemd en Linux, o NSSM en Windows) para ejecutarlo y gestionarlo.

// Eliminar límite de tiempo de ejecución
set_time_limit(0);

// --- Configuración ---
include 'api/config/db.php'; // Contiene la conexión $pdo (PDO)
include 'send_expo_notification.php'; // Contiene sendExpoNotifications()

define('SLEEP_INTERVAL_SECONDS', 3); // Segundos de pausa cuando no hay notificaciones
define('LOG_FILE', __DIR__ . '/notification_daemon.log.json'); // Define la ubicación del archivo JSON

// Función para escribir en el log en formato JSON
function escribirLog($mensaje, $tipo = 'info') {
    $fecha = date("Y-m-d H:i:s");
    $log_entry = [
        'timestamp' => $fecha,
        'level' => $tipo,
        'message' => $mensaje,
    ];

    $logs = [];
    if (file_exists(LOG_FILE)) {
        $log_content = file_get_contents(LOG_FILE);
        $logs = json_decode($log_content, true) ?? [];
    }

    $logs[] = $log_entry;
    file_put_contents(LOG_FILE, json_encode($logs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

echo "INFO: [" . date('Y-m-d H:i:s') . "] Iniciando Daemon de Notificaciones (Envío a todos)...\n";
escribirLog("Iniciando notification_daemon.php (Envío a todos)");

// --- Bucle Principal ---
while (true) { // Bucle infinito - NECESITA GESTOR DE PROCESOS
    try {
        // **Paso 1: Buscar UNA notificación pendiente (la más antigua)**
        $queryPendiente = "SELECT id, mensaje FROM notificacion
                            WHERE enviada = 0
                            ORDER BY fecha ASC
                            LIMIT 1";

        $stmtPendiente = $pdo->prepare($queryPendiente);
        $stmtPendiente->execute();
        $notificacion = $stmtPendiente->fetch(PDO::FETCH_ASSOC);

        // **Paso 2: Si se encuentra una notificación pendiente**
        if ($notificacion) {
            $notificationId = $notificacion['id'];
            $mensaje = $notificacion['mensaje'];
            echo "INFO: [" . date('Y-m-d H:i:s') . "] Procesando notificación ID: $notificationId (Envío a todos)\n";
            escribirLog("Procesando notificación ID: $notificationId (Envío a todos)");

            // **Paso 3: Obtener tokens de TODOS los usuarios**
            $queryTokens = "SELECT push_token FROM login
                            WHERE push_token IS NOT NULL AND push_token != ''";
            $stmtTokens = $pdo->prepare($queryTokens);
            $stmtTokens->execute();
            $allTokens = [];
            while ($row = $stmtTokens->fetch(PDO::FETCH_ASSOC)) {
                if (strpos($row['push_token'], 'ExponentPushToken[') === 0) {
                    $allTokens[] = $row['push_token'];
                }
            }

            // **Paso 4: Si hay tokens, preparar y enviar**
            if (!empty($allTokens)) {
                $mensajesParaExpo = [];
                foreach ($allTokens as $token) {
                    $mensajesParaExpo[] = [
                        'to' => $token,
                        'sound' => 'default',
                        'title' => 'Alerta de Sistema', // O título más específico
                        'body' => $mensaje,           // El mensaje del registro específico
                        'data' => ['notificationId' => $notificationId], // Datos extra opcionales
                    ];
                }

                try {
                    echo "INFO: [" . date('Y-m-d H:i:s') . "] Enviando notificación ID $notificationId a " . count($allTokens) . " usuarios...\n";
                    escribirLog("Enviando notificación ID $notificationId a " . count($allTokens) . " usuarios.");
                    $apiResponse = sendExpoNotifications($mensajesParaExpo); // Llamar función de envío
                    escribirLog("Notificación ID $notificationId enviada a todos. Respuesta parcial: " . json_encode($apiResponse['response']['data'] ?? 'N/A'));
                    // Marcar como enviada DESPUÉS de intentar enviar
                    markAsSent($pdo, $notificationId);

                } catch (Exception $e) {
                    echo "ERROR: [" . date('Y-m-d H:i:s') . "] Fallo al enviar notificación ID $notificationId a Expo: " . $e->getMessage() . "\n";
                    escribirLog("Fallo al enviar notificación ID $notificationId a Expo (envío a todos): " . $e->getMessage(), 'error');
                    markAsSent($pdo, $notificationId); // Marcar incluso si falla el envío
                }

            } else {
                // No se encontraron tokens de usuarios
                echo "WARN: [" . date('Y-m-d H:i:s') . "] No hay tokens de usuario para la notificación ID $notificationId.\n";
                escribirLog("No hay tokens de usuario para ID $notificationId.", 'warn');
                markAsSent($pdo, $notificationId); // Marcar para evitar bucles
            }

            // **Importante:** Después de procesar una, no esperamos (sleep).
            // Volvemos inmediatamente al inicio del bucle para ver si hay OTRA pendiente.
            continue;

        } else {
            // **Paso 5: No se encontraron notificaciones pendientes**
            sleep(SLEEP_INTERVAL_SECONDS);
        }

    } catch (PDOException $dbException) {
        echo "ERROR CRÍTICO: [" . date('Y-m-d H:i:s') . "] Error de base de datos: " . $dbException->getMessage() . "\n";
        escribirLog("Error de base de datos: " . $dbException->getMessage(), 'critical');
        sleep(30);
    } catch (Throwable $generalError) {
        echo "ERROR CRÍTICO: [" . date('Y-m-d H:i:s') . "] Error inesperado: " . $generalError->getMessage() . "\n";
        escribirLog("Error inesperado: " . $generalError->getMessage() . "\n" . $generalError->getTraceAsString(), 'critical');
        sleep(30);
    }
} // Fin del while (true)

// --- Función Auxiliar para Marcar como Enviada ---
function markAsSent($pdo, $id) {
    try {
        $updateQuery = "UPDATE notificacion SET enviada = 1 WHERE id = :id AND enviada = 0";
        $updateStmt = $pdo->prepare($updateQuery);
        $updateStmt->bindParam(':id', $id, PDO::PARAM_INT);
        $success = $updateStmt->execute();
        if ($success && $updateStmt->rowCount() > 0) {
            echo "INFO: [" . date('Y-m-d H:i:s') . "] Notificación ID $id marcada como enviada en BD.\n";
            escribirLog("Notificación ID $id marcada como enviada en BD.");
        } elseif (!$success) {
            escribirLog("Falla al ejecutar UPDATE para marcar notificación ID $id como enviada.", 'error');
        }
    } catch (PDOException $e) {
        escribirLog("Error DB al marcar ID $id como enviada: " . $e->getMessage(), 'error');
    }
}

echo "WARN: [" . date('Y-m-d H:i:s') . "] El Daemon de Notificaciones (Envío a todos) está terminando inesperadamente.\n";
escribirLog("El Daemon de Notificaciones (Envío a todos) está terminando.", 'warn');
?>