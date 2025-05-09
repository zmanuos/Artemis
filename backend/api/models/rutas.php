<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getRutas();
        break;
    case 'POST':
        createRuta();
        break;
    case 'PUT':
        updateRuta();
        break;
    case 'DELETE':
        deleteRuta();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getRutas() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM ruta");
    $rutas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rutas);
}

function createRuta() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $nombre = $data->nombre;

    $stmt = $pdo->prepare("INSERT INTO ruta (nombre) VALUES (?)");
    $stmt->execute([$nombre]);
    echo json_encode(["message" => "Ruta creada"]);
}

function updateRuta() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $nombre = $data->nombre;

    $stmt = $pdo->prepare("UPDATE ruta SET nombre = ? WHERE codigo = ?");
    $stmt->execute([$nombre, $id]);
    echo json_encode(["message" => "Ruta actualizada"]);
}

function deleteRuta() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    $stmt = $pdo->prepare("DELETE FROM ruta WHERE codigo = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Ruta eliminada"]);
}
?>
