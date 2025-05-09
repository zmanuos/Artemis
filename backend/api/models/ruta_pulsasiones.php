<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getPulsacionesByCodigoRonda();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getPulsacionesByCodigoRonda() {
    global $pdo;

    // Verificar si se recibió el parámetro codigo_ronda
    if (!isset($_GET['codigo_ronda'])) {
        echo json_encode(["error" => "Se requiere el parámetro codigo_ronda"]);
        return;
    }

    $codigo_ronda = $_GET['codigo_ronda'];

    try {
        // Consulta SQL para obtener las pulsaciones por codigo_ronda
        $stmt_pulsaciones = $pdo->prepare("SELECT ubicacion, timestamp, descripcion FROM historial_pulsaciones WHERE codigo_ronda = :codigo_ronda ORDER BY timestamp ASC");
        $stmt_pulsaciones->bindParam(':codigo_ronda', $codigo_ronda);
        $stmt_pulsaciones->execute();
        $pulsaciones = $stmt_pulsaciones->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($pulsaciones);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>