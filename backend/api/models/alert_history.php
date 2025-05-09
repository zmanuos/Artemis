<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getAlertHistory();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getAlertHistory() {
    global $pdo;
    
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
    al.id DESC;
    ");
    
    $alert_history = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($alert_history);
}
?>
