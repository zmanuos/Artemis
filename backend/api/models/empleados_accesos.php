<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getEmpleadoAccesos();
        break;
    case 'POST':
        createEmpleadoAcceso();
        break;
    case 'PUT':
        updateEmpleadoAcceso();
        break;
    case 'DELETE':
        deleteEmpleadoAcceso();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getEmpleadoAccesos() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM empleado_acceso");
    $empleadoAccesos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($empleadoAccesos);
}

function createEmpleadoAcceso() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id_empleado = $data->id_empleado;
    $id_acceso = $data->id_acceso;

    $stmt = $pdo->prepare("INSERT INTO empleado_acceso (id_empleado, id_acceso) VALUES (?, ?)");
    $stmt->execute([$id_empleado, $id_acceso]);
    echo json_encode(["message" => "Empleado acceso creado"]);
}

function updateEmpleadoAcceso() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $numero = $data->numero;
    $id_empleado = $data->id_empleado;
    $id_acceso = $data->id_acceso;

    $stmt = $pdo->prepare("UPDATE empleado_acceso SET id_empleado = ?, id_acceso = ? WHERE numero = ?");
    $stmt->execute([$id_empleado, $id_acceso, $numero]);
    echo json_encode(["message" => "Empleado acceso actualizado"]);
}

function deleteEmpleadoAcceso() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $numero = $data->numero;

    $stmt = $pdo->prepare("DELETE FROM empleado_acceso WHERE numero = ?");
    $stmt->execute([$numero]);
    echo json_encode(["message" => "Empleado acceso eliminado"]);
}
?>
