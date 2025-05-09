<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getRondinero();
        break;
    case 'POST':
        createRondinero();
        break;
    case 'PUT':
        updateRondinero();
        break;
    case 'DELETE':
        deleteRondinero();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getRondinero() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM rondinero");
    $rondineros = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rondineros);
}

function createRondinero() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $posicion = $data->posicion;
    $estado = $data->estado;
    $numero = $data->numero;
    $codigo_ruta = $data->codigo_ruta;

    $stmt = $pdo->prepare("INSERT INTO rondinero (posicion, estado, numero, codigo_ruta) VALUES (?, ?, ?, ?)");
    $stmt->execute([$posicion, $estado, $numero, $codigo_ruta]);
    echo json_encode(["message" => "Rondinero creado"]);
}

function updateRondinero() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $ID = $data->ID;
    $posicion = $data->posicion;
    $estado = $data->estado;
    $numero = $data->numero;
    $codigo_ruta = $data->codigo_ruta;

    $stmt = $pdo->prepare("UPDATE rondinero SET posicion = ?, estado = ?, numero = ?, codigo_ruta = ? WHERE ID = ?");
    $stmt->execute([$posicion, $estado, $numero, $codigo_ruta, $ID]);
    echo json_encode(["message" => "Rondinero actualizado"]);
}

function deleteRondinero() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $ID = $data->ID;

    $stmt = $pdo->prepare("DELETE FROM rondinero WHERE ID = ?");
    $stmt->execute([$ID]);
    echo json_encode(["message" => "Rondinero eliminado"]);
}
?>
