<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getAreas();
        break;
    case 'POST':
        createArea();
        break;
    case 'PUT':
        updateArea();
        break;
    case 'DELETE':
        deleteArea();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getAreas() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM area");
    $areas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($areas);
}

function createArea() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $num_accesos = $data->num_accesos;
    $nombre = $data->nombre;
    $estado = $data->estado;
    $codigo_ruta = $data->codigo_ruta;

    $stmt = $pdo->prepare("INSERT INTO area (num_accesos, nombre, estado, codigo_ruta) VALUES (?, ?, ?, ?)");
    $stmt->execute([$num_accesos, $nombre, $estado, $codigo_ruta]);
    echo json_encode(["message" => "Área creada"]);
}

function updateArea() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $codigo_area = $data->codigo_area;
    $num_accesos = $data->num_accesos;
    $nombre = $data->nombre;
    $estado = $data->estado;
    $codigo_ruta = $data->codigo_ruta;

    $stmt = $pdo->prepare("UPDATE area SET num_accesos = ?, nombre = ?, estado = ?, codigo_ruta = ? WHERE codigo_area = ?");
    $stmt->execute([$num_accesos, $nombre, $estado, $codigo_ruta, $codigo_area]);
    echo json_encode(["message" => "Área actualizada"]);
}

function deleteArea() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $codigo_area = $data->codigo_area;

    $stmt = $pdo->prepare("DELETE FROM area WHERE codigo_area = ?");
    $stmt->execute([$codigo_area]);
    echo json_encode(["message" => "Área eliminada"]);
}
?>
