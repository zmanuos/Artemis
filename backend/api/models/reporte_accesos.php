<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getReportesAcceso();
        break;
    case 'POST':
        createReporteAcceso();
        break;
    case 'PUT':
        updateReporteAcceso();
        break;
    case 'DELETE':
        deleteReporteAcceso();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getReportesAcceso() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM reporte_acceso");
    $reportesAcceso = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($reportesAcceso);
}

function createReporteAcceso() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id_reporte = $data->id_reporte;
    $id_registro = $data->id_registro;

    $stmt = $pdo->prepare("INSERT INTO reporte_acceso (id_reporte, id_registro) VALUES (?, ?)");
    $stmt->execute([$id_reporte, $id_registro]);
    echo json_encode(["message" => "Reporte de acceso creado"]);
}

function updateReporteAcceso() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $numero = $data->numero;
    $id_reporte = $data->id_reporte;
    $id_registro = $data->id_registro;

    $stmt = $pdo->prepare("UPDATE reporte_acceso SET id_reporte = ?, id_registro = ? WHERE numero = ?");
    $stmt->execute([$id_reporte, $id_registro, $numero]);
    echo json_encode(["message" => "Reporte de acceso actualizado"]);
}

function deleteReporteAcceso() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $numero = $data->numero;

    $stmt = $pdo->prepare("DELETE FROM reporte_acceso WHERE numero = ?");
    $stmt->execute([$numero]);
    echo json_encode(["message" => "Reporte de acceso eliminado"]);
}
?>
