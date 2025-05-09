<?php
// send_expo_notification.php

function sendExpoNotifications(array $messages) {
    if (empty($messages)) {
        return ['status' => 'error', 'message' => 'No messages to send.'];
    }

    $expoApiUrl = 'https://exp.host/--/api/v2/push/send';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $expoApiUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($messages)); // Enviar el array de mensajes
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Accept-Encoding: gzip, deflate',
        'Content-Type: application/json',
        'Host: exp.host' // A veces necesario
    ]);
    // Opcional: Deshabilitar verificación SSL (NO RECOMENDADO EN PRODUCCIÓN)
    // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
         error_log("cURL Error sending Expo notification: " . $curlError);
        throw new Exception("cURL Error: " . $curlError); // Lanza excepción para capturar arriba
    }

    $responseData = json_decode($response, true);

    if ($httpCode >= 200 && $httpCode < 300) {
        // Éxito (parcial o total)
         error_log("Respuesta de Expo API: " . $response); // Loguear la respuesta para depurar tickets individuales si es necesario
        // Aquí puedes revisar $responseData['data'] para ver el estado de cada ticket individual
         return ['status' => 'success', 'response' => $responseData];
    } else {
        // Error
         error_log("Error sending Expo notification. HTTP Code: {$httpCode}. Response: " . $response);
        throw new Exception("Expo API Error (HTTP {$httpCode}): " . $response); // Lanza excepción
    }
}
?>