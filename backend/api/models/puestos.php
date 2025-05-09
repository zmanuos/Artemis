<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getPuestos();
        break;
    case 'POST':
        createPuesto();
        break;
    case 'PUT':
        updatePuesto();
        break;
    case 'DELETE':
        deletePuesto();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getPuestos() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM puesto");
    $puestos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($puestos);
}

function createPuesto() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $descripcion = $data->descripcion;
    $nombre_puesto = $data->nombre_puesto;

    $stmt = $pdo->prepare("INSERT INTO puesto (descripcion, nombre_puesto) VALUES (?, ?)");
    $stmt->execute([$descripcion, $nombre_puesto]);
    echo json_encode(["message" => "Puesto creado"]);
}

function updatePuesto() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $codigo = $data->codigo;
    $descripcion = $data->descripcion;
    $nombre_puesto = $data->nombre_puesto;

    $stmt = $pdo->prepare("UPDATE puesto SET descripcion = ?, nombre_puesto = ? WHERE codigo = ?");
    $stmt->execute([$descripcion, $nombre_puesto, $codigo]);
    echo json_encode(["message" => "Puesto actualizado"]);
}

function deletePuesto() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $codigo = $data->codigo;

    $stmt = $pdo->prepare("DELETE FROM puesto WHERE codigo = ?");
    $stmt->execute([$codigo]);
    echo json_encode(["message" => "Puesto eliminado"]);
}
?>
