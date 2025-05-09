<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getLastAlerts();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getLastAlerts() {
    global $pdo;
    
    // Consulta SQL para obtener las últimas alertas
    $stmt = $pdo->query("
        SELECT 
    ar.nombre AS area, 
    DATE_FORMAT(a.fecha, '%d/%m/%Y') AS fecha,
    a.hora_acceso AS hora,
    al.descripcion
FROM 
    acceso a
JOIN 
    alerta al ON a.ID = al.id_acceso
JOIN 
    area ar ON a.codigo_area = ar.codigo_area
ORDER BY 
    al.id DESC
LIMIT 10;");
    
    $last_alerts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($last_alerts);
}
?>