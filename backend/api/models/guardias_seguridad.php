<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getGuardias();
        break;
    case 'POST':
        createGuardia();
        break;
    case 'PUT':
        updateGuardia();
        break;
    case 'DELETE':
        deleteGuardia();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getGuardias() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM guardia_seguridad");
    $guardias = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($guardias);
}

function createGuardia() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $nombre = $data->nombre;
    $apellido_paterno = $data->apellido_paterno;
    $apellido_materno = $data->apellido_materno;

    $stmt = $pdo->prepare("INSERT INTO guardia_seguridad (nombre, apellido_paterno, apellido_materno) VALUES (?, ?, ?)");
    $stmt->execute([$nombre, $apellido_paterno, $apellido_materno]);
    echo json_encode(["message" => "Guardia creado"]);
}

function updateGuardia() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $nombre = $data->nombre;
    $apellido_paterno = $data->apellido_paterno;
    $apellido_materno = $data->apellido_materno;

    $stmt = $pdo->prepare("UPDATE guardia_seguridad SET nombre = ?, apellido_paterno = ?, apellido_materno = ? WHERE ID = ?");
    $stmt->execute([$nombre, $apellido_paterno, $apellido_materno, $id]);
    echo json_encode(["message" => "Guardia actualizado"]);
}

function deleteGuardia() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    $stmt = $pdo->prepare("DELETE FROM guardia_seguridad WHERE ID = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Guardia eliminado"]);
}
?>
