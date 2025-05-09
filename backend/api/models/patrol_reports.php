<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getPatrolReports();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

// Función para obtener los reportes de patrullas con las columnas renombradas
function getPatrolReports() {
    global $pdo;
    
    // Consulta SQL para obtener los reportes de patrullas con los campos renombrados
    $stmt = $pdo->query("
        SELECT 
            codigo AS codigo,
            nombre AS NAME,
            hora_inicio AS DATE
        FROM ronda
    ");
    
    $patrol_reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($patrol_reports);
}
?>
