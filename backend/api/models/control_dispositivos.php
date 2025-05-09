<?php
// Establecer la zona horaria de Tijuana
date_default_timezone_set('America/Tijuana');

include_once("../config/db.php");

// Endpoint para obtener el estado de un dispositivo
if (isset($_GET["accion"]) && $_GET["accion"] == "obtener_estado" && isset($_GET["codigo"])) {
    $codigoDispositivo = intval($_GET["codigo"]);

    $sql = "SELECT estado FROM dispositivo WHERE codigo = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(1, $codigoDispositivo);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode(["estado" => (bool)$result["estado"]]); // Devolver el estado como booleano
    } else {
        echo json_encode(["error" => "Dispositivo no encontrado"]);
    }
    exit();
}

// Endpoint para actualizar el estado de un dispositivo
if (isset($_POST["accion"]) && $_POST["accion"] == "actualizar_estado" && isset($_POST["codigo"]) && isset($_POST["estado"])) {
    $codigoDispositivo = intval($_POST["codigo"]);
    $nuevoEstado = intval($_POST["estado"]); // Esperamos 0 o 1

    $sql = "UPDATE dispositivo SET estado = ? WHERE codigo = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(1, $nuevoEstado);
    $stmt->bindParam(2, $codigoDispositivo);

    if ($stmt->execute()) {
        echo json_encode(["mensaje" => "Estado del dispositivo actualizado"]);
    } else {
        echo json_encode(["error" => "Error al actualizar el estado del dispositivo"]);
    }
    exit();
}

// Si no se recibe una acción válida
echo json_encode(["error" => "Acción no válida"]);

?>