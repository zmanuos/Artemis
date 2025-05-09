<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getDispositivos();
        break;
    case 'POST':
        createDispositivo();
        break;
    case 'PUT':
        updateDispositivo();
        break;
    case 'DELETE':
        deleteDispositivo();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getDispositivos() {
    global $pdo;
    $stmt = $pdo->query("SELECT 
        d.codigo AS codigo,
        d.tipo AS tipo,
        d.ubicacion AS ubicacion,
        a.nombre AS area,
        d.estado AS estado
    FROM dispositivo d
    JOIN area a ON d.codigo_area = a.codigo_area
    ORDER BY d.codigo ASC");
    $dispositivos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($dispositivos);
}

function createDispositivo() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $tipo = $data->tipo;
    $estado = $data->estado;
    $ubicacion = $data->ubicacion;
    $codigo_area = $data->codigo_area;

    $stmt = $pdo->prepare("INSERT INTO dispositivo (tipo, estado, ubicacion, codigo_area) VALUES (?, ?, ?, ?)");
    $stmt->execute([$tipo, $estado, $ubicacion, $codigo_area]);
    echo json_encode(["message" => "Dispositivo creado"]);
}

function updateDispositivo() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $codigo = $data->codigo;

    if (isset($data->estado) && !isset($data->tipo) && !isset($data->ubicacion) && !isset($data->codigo_area)) {
        // Actualizar solo el estado
        $stmt = $pdo->prepare("UPDATE dispositivo SET estado = ? WHERE codigo = ?");
        $stmt->execute([$data->estado, $codigo]);
        echo json_encode(["message" => "Estado del dispositivo actualizado"]);
    } else {
        // Actualizar otros campos
        $tipo = $data->tipo;
        $estado = $data->estado;
        $ubicacion = $data->ubicacion;
        $codigo_area = $data->codigo_area;

        $stmt = $pdo->prepare("UPDATE dispositivo SET tipo = ?, estado = ?, ubicacion = ?, codigo_area = ? WHERE codigo = ?");
        $stmt->execute([$tipo, $estado, $ubicacion, $codigo_area, $codigo]);
        echo json_encode(["message" => "Dispositivo actualizado"]);
    }
}

function deleteDispositivo() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $codigo = $data->codigo;

    $stmt = $pdo->prepare("DELETE FROM dispositivo WHERE codigo = ?");
    $stmt->execute([$codigo]);
    echo json_encode(["message" => "Dispositivo eliminado"]);
}
?>
