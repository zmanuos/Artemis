<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getPuestosAcceso();
        break;
    case 'POST':
        createPuestoAcceso();
        break;
    case 'PUT':
        updatePuestoAcceso();
        break;
    case 'DELETE':
        deletePuestoAcceso();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getPuestosAcceso() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM puesto_acceso");
    $puestos_acceso = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($puestos_acceso);
}

function createPuestoAcceso() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $nivel_acceso = $data->nivel_acceso;
    $puesto_codigo = $data->Puesto_codigo;
    $acceso_id = $data->Acceso_id;

    $stmt = $pdo->prepare("INSERT INTO puesto_acceso (nivel_acceso, Puesto_codigo, Acceso_id) VALUES (?, ?, ?)");
    $stmt->execute([$nivel_acceso, $puesto_codigo, $acceso_id]);
    echo json_encode(["message" => "Puesto de acceso creado"]);
}

function updatePuestoAcceso() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $codigo = $data->codigo;
    $nivel_acceso = $data->nivel_acceso;
    $puesto_codigo = $data->Puesto_codigo;
    $acceso_id = $data->Acceso_id;

    $stmt = $pdo->prepare("UPDATE puesto_acceso SET nivel_acceso = ?, Puesto_codigo = ?, Acceso_id = ? WHERE codigo = ?");
    $stmt->execute([$nivel_acceso, $puesto_codigo, $acceso_id, $codigo]);
    echo json_encode(["message" => "Puesto de acceso actualizado"]);
}

function deletePuestoAcceso() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $codigo = $data->codigo;

    $stmt = $pdo->prepare("DELETE FROM puesto_acceso WHERE codigo = ?");
    $stmt->execute([$codigo]);
    echo json_encode(["message" => "Puesto de acceso eliminado"]);
}
?>
