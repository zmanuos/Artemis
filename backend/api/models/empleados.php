<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? trim($_SERVER['PATH_INFO'], '/') : '';
$segments = explode('/', $path);

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'checkPhone':
            checkPhone();
            break;
        default:
            switch ($method) {
                case 'GET':
                    getEmpleados();
                    break;
                case 'POST':
                    createEmpleado();
                    break;
                case 'PUT':
                    updateEmpleado();
                    break;
                case 'DELETE':
                    deleteEmpleado();
                    break;
                default:
                    echo json_encode(["message" => "Método no permitido"]);
                    break;
            }
            break;
    }
} else {
    switch ($method) {
        case 'GET':
            getEmpleados();
            break;
        case 'POST':
            createEmpleado();
            break;
        case 'PUT':
            updateEmpleado();
            break;
        case 'DELETE':
            deleteEmpleado();
            break;
        default:
            echo json_encode(["message" => "Método no permitido"]);
            break;
    }
}

function getEmpleados() {
    global $pdo;
    $stmt = $pdo->query("SELECT e.ID, e.nombre, e.apellido_paterno, e.apellido_materno, e.codigo_puesto, p.nombre_puesto AS puesto, e.telefono, e.genero, e.rol FROM empleado e LEFT JOIN puesto p ON e.codigo_puesto = p.codigo");
    $empleados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($empleados);
}

function createEmpleado() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $nombre = $data->nombre;
    $apellido_paterno = $data->apellido_paterno;
    $apellido_materno = $data->apellido_materno;
    $codigo_puesto = $data->codigo_puesto;
    $telefono = isset($data->telefono) ? trim($data->telefono) : null;
    $genero = $data->genero;
    $rol = $data->rol;
    $email = $data->email ?? null;
    $password = $data->password ?? null;

    try {
        if ($telefono !== null && $telefono !== '') {
            $stmt_check = $pdo->prepare("SELECT COUNT(*) FROM empleado WHERE telefono = ?");
            $stmt_check->execute([$telefono]);
            if ($stmt_check->fetchColumn() > 0) {
                http_response_code(409);
                echo json_encode(["message" => "Ya existe un empleado con este número de teléfono."]);
                return;
            }
        }

        $stmt = $pdo->prepare("INSERT INTO empleado (nombre, apellido_paterno, apellido_materno, codigo_puesto, telefono, genero, rol) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$nombre, $apellido_paterno, $apellido_materno, $codigo_puesto, $telefono, $genero, $rol]);

        $empleado_id = $pdo->lastInsertId();

        if ($rol === 'supervisor' && $email !== null && $password !== null) {
            $stmt_login = $pdo->prepare("INSERT INTO login (id_empleado, correo, contrasena) VALUES (?, ?, ?)");
            $stmt_login->execute([$empleado_id, $email, $password]);
        }

        echo json_encode(["message" => "Empleado creado"]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error al crear empleado: " . $e->getMessage()]);
    }
}

function updateEmpleado() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $nombre = $data->nombre;
    $apellido_paterno = $data->apellido_paterno;
    $apellido_materno = $data->apellido_materno;
    $codigo_puesto = $data->codigo_puesto;
    $telefono = isset($data->telefono) ? trim($data->telefono) : null;
    $genero = $data->genero;
    $rol = $data->rol;

    try {
        if ($telefono !== null && $telefono !== '') {
            $stmt_check = $pdo->prepare("SELECT COUNT(*) FROM empleado WHERE telefono = ? AND ID != ?");
            $stmt_check->execute([$telefono, $id]);
            if ($stmt_check->fetchColumn() > 0) {
                http_response_code(409);
                echo json_encode(["message" => "Ya existe otro empleado con este número de teléfono."]);
                return;
            }
        }

        $stmt = $pdo->prepare("UPDATE empleado SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, codigo_puesto = ?, telefono = ?, genero = ?, rol = ? WHERE ID = ?");
        $stmt->execute([$nombre, $apellido_paterno, $apellido_materno, $codigo_puesto, $telefono, $genero, $rol, $id]);
        echo json_encode(["message" => "Empleado actualizado"]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error al actualizar empleado: " . $e->getMessage()]);
    }
}

function deleteEmpleado() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    $stmt = $pdo->prepare("DELETE FROM empleado WHERE ID = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Empleado eliminado"]);
}

function checkPhone() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $telefono = isset($data->telefono) ? trim($data->telefono) : '';

    if (empty($telefono)) {
        echo json_encode(["exists" => false]);
        return;
    }

    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM empleado WHERE telefono = ?");
        $stmt->execute([$telefono]);
        $count = $stmt->fetchColumn();
        echo json_encode(["exists" => ($count > 0)]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["exists" => null, "message" => "Error al verificar el teléfono: " . $e->getMessage()]);
    }
}
?>