<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getAlertas();
        break;
    case 'POST':
        createAlerta();
        break;
    case 'PUT':
        updateAlerta();
        break;
    case 'DELETE':
        deleteAlerta();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getAlertas() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM alerta");
    $alertas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($alertas);
}

function createAlerta() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $descripcion = $data->descripcion;
    $id_registro = $data->id_registro;

    $stmt = $pdo->prepare("INSERT INTO alerta (descripcion, id_registro) VALUES (?, ?)");
    $stmt->execute([$descripcion, $id_registro]);
    echo json_encode(["message" => "Alerta creada"]);
}

function updateAlerta() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $descripcion = $data->descripcion;
    $id_registro = $data->id_registro;

    $stmt = $pdo->prepare("UPDATE alerta SET descripcion = ?, id_registro = ? WHERE id = ?");
    $stmt->execute([$descripcion, $id_registro, $id]);
    echo json_encode(["message" => "Alerta actualizada"]);
}

function deleteAlerta() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    $stmt = $pdo->prepare("DELETE FROM alerta WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Alerta eliminada"]);
}
?>
