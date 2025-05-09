<?php
// Establecer la zona horaria de Tijuana
date_default_timezone_set('America/Tijuana');

include_once("../config/db.php");

// Función para verificar si un dispositivo está activo por su ubicación y tipo
function verificarDispositivoActivo($pdo, $ubicacion, $tipo = 'Pulsador') {
    $sql = "SELECT codigo FROM dispositivo WHERE ubicacion = ? AND tipo = ? AND estado = 1";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(1, $ubicacion);
    $stmt->bindParam(2, $tipo);
    $stmt->execute();
    return $stmt->rowCount() > 0;
}

// Verificar si hay una ronda ACTIVA POR FECHA Y HORA
if (isset($_POST["accion"]) && $_POST["accion"] == "verificar_ronda") {
    $ahora = date("Y-m-d H:i:s");
    $sql = "SELECT codigo, hora_inicio, hora_fin FROM ronda
    WHERE hora_inicio <= ?
      AND hora_fin >= ?
    ORDER BY codigo DESC
    LIMIT 1";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(1, $ahora);
    $stmt->bindParam(2, $ahora);
    $stmt->execute();

    error_log("Verificando ronda (solo por fecha/hora) - Hora actual (Tijuana): " . $ahora);

    if ($stmt && $stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        error_log("Ronda encontrada (por fecha/hora) - Inicio (BD): " . $row["hora_inicio"] . ", Fin (BD): " . $row["hora_fin"] . ", Código: " . $row["codigo"]);
        echo json_encode(["ronda_activa" => true, "codigo_ronda" => $row["codigo"]]);
    } else {
        error_log("No se encontró ninguna ronda activa DENTRO del periodo (solo por fecha/hora).");
        echo json_encode(["ronda_activa" => false]);
    }
    exit(); // Importante: detener la ejecución después de verificar la ronda
}

// Registrar la pulsación si hay una ronda activa
if (isset($_POST["accion"]) && $_POST["accion"] == "registrar_pulsacion" && isset($_POST["codigo_ronda"]) && isset($_POST["ubicacion"])) {
    $codigoRonda = intval($_POST["codigo_ronda"]);
    $ubicacion = $_POST["ubicacion"];
    $timestamp = date("Y-m-d H:i:s");
    $descripcion = "Pulsación correcta"; // Puedes ajustar esto según tu lógica

    // Verificar si el dispositivo (pulsador) para esta ubicación está activo
    if (verificarDispositivoActivo($pdo, $ubicacion)) {
        $sqlInsertPulsacion = "INSERT INTO historial_pulsaciones (codigo_ronda, ubicacion, timestamp, descripcion) VALUES (?, ?, ?, ?)";
        $stmtInsertPulsacion = $pdo->prepare($sqlInsertPulsacion);
        $stmtInsertPulsacion->bindParam(1, $codigoRonda);
        $stmtInsertPulsacion->bindParam(2, $ubicacion);
        $stmtInsertPulsacion->bindParam(3, $timestamp);
        $stmtInsertPulsacion->bindParam(4, $descripcion);

        if ($stmtInsertPulsacion->execute()) {
            echo "Pulsación registrada correctamente.";
        } else {
            echo "Error al registrar la pulsación.";
        }
        $stmtInsertPulsacion->closeCursor();
    } else {
        // El dispositivo no está activo, enviar mensaje de error
        echo "Error: Dispositivo inactivo.";
    }
    exit(); // Importante: detener la ejecución después de registrar la pulsación
}

// Si no se recibe una acción válida
echo "Acción no válida.";

?>