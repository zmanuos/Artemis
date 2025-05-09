<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getReportes();
        break;
    case 'POST':
        createReporte();
        break;
    case 'PUT':
        updateReporte();
        break;
    case 'DELETE':
        deleteReporte();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getReportes() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM reporte");
    $reportes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($reportes);
}

function createReporte() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $tipo = $data->tipo;
    $fecha = $data->fecha;
    $codigo_ronda = $data->codigo_ronda;

    $stmt = $pdo->prepare("INSERT INTO reporte (tipo, fecha, codigo_ronda) VALUES (?, ?, ?)");
    $stmt->execute([$tipo, $fecha, $codigo_ronda]);
    echo json_encode(["message" => "Reporte creado"]);
}

function updateReporte() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $tipo = $data->tipo;
    $fecha = $data->fecha;
    $codigo_ronda = $data->codigo_ronda;

    $stmt = $pdo->prepare("UPDATE reporte SET tipo = ?, fecha = ?, codigo_ronda = ? WHERE id = ?");
    $stmt->execute([$tipo, $fecha, $codigo_ronda, $id]);
    echo json_encode(["message" => "Reporte actualizado"]);
}

function deleteReporte() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    $stmt = $pdo->prepare("DELETE FROM reporte WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Reporte eliminado"]);
}
?>
