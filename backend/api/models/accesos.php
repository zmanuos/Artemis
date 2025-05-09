<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getAccesos();
        break;
    case 'POST':
        createAcceso();
        break;
    case 'PUT':
        updateAcceso();
        break;
    case 'DELETE':
        deleteAcceso();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getAccesos() {
    global $pdo;
    $stmt = $pdo->query("SELECT a.ID, a.estado, a.hora_acceso, a.id_registro, a.codigo_area, 
                                la.tipo AS nombre_registro, ar.nombre
                         FROM acceso a
                         JOIN log_acceso la ON a.id_registro = la.id_registro
                         JOIN area ar ON a.codigo_area = ar.codigo_area");
    $accesos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($accesos);
}

function createAcceso() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $estado = $data->estado;
    $hora_acceso = $data->hora_acceso;
    $id_registro = $data->id_registro;
    $codigo_area = $data->codigo_area;

    $stmt = $pdo->prepare("INSERT INTO acceso (estado, hora_acceso, id_registro, codigo_area) 
                           VALUES (?, ?, ?, ?)");
    $stmt->execute([$estado, $hora_acceso, $id_registro, $codigo_area]);
    echo json_encode(["message" => "Acceso creado"]);
}

function updateAcceso() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $estado = $data->estado;
    $hora_acceso = $data->hora_acceso;
    $id_registro = $data->id_registro;
    $codigo_area = $data->codigo_area;

    $stmt = $pdo->prepare("UPDATE acceso 
                           SET estado = ?, hora_acceso = ?, id_registro = ?, codigo_area = ? 
                           WHERE ID = ?");
    $stmt->execute([$estado, $hora_acceso, $id_registro, $codigo_area, $id]);
    echo json_encode(["message" => "Acceso actualizado"]);
}

function deleteAcceso() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    $stmt = $pdo->prepare("DELETE FROM acceso WHERE ID = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Acceso eliminado"]);
}
?>
