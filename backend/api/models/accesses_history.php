<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getAccessesHistory();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getAccessesHistory()
{
    global $pdo;

    // Consulta SQL para obtener los últimos accesos
    $stmt = $pdo->query("
        SELECT 
    ar.nombre AS area,
    DATE_FORMAT(ac.fecha, '%d/%m/%Y') AS fecha,
    TIME(ac.hora_acceso) AS time,
    CONCAT(emp.nombre, ' ', emp.apellido_paterno, ' ', emp.apellido_materno) AS name,
    pu.nombre_puesto AS role
FROM acceso ac
JOIN area ar ON ac.codigo_area = ar.codigo_area
JOIN empleado_acceso ea ON ac.ID = ea.id_acceso
JOIN empleado emp ON ea.id_empleado = emp.ID
JOIN puesto pu ON emp.codigo_puesto = pu.codigo
ORDER BY ac.ID DESC;
    ");

    $accesses_history = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($accesses_history);
}
