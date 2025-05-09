<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getLogs();
        break;
    case 'POST':
        createLog();
        break;
    case 'PUT':
        updateLog();
        break;
    case 'DELETE':
        deleteLog();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getLogs() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM log_acceso");
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($logs);
}

function createLog() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $tipo = $data->tipo;
    $fecha = $data->fecha;
    $hora = $data->hora;
    $detalles = $data->detalles;

    $stmt = $pdo->prepare("INSERT INTO log_acceso (tipo, fecha, hora, detalles) VALUES (?, ?, ?, ?)");
    $stmt->execute([$tipo, $fecha, $hora, $detalles]);
    echo json_encode(["message" => "Log creado"]);
}

function updateLog() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $tipo = $data->tipo;
    $fecha = $data->fecha;
    $hora = $data->hora;
    $detalles = $data->detalles;

    $stmt = $pdo->prepare("UPDATE log_acceso SET tipo = ?, fecha = ?, hora = ?, detalles = ? WHERE id_registro = ?");
    $stmt->execute([$tipo, $fecha, $hora, $detalles, $id]);
    echo json_encode(["message" => "Log actualizado"]);
}

function deleteLog() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    $stmt = $pdo->prepare("DELETE FROM log_acceso WHERE id_registro = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Log eliminado"]);
}
?>
