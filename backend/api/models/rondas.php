<?php
date_default_timezone_set('America/Tijuana'); // Zona horaria Baja California (UTC -08:00)

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getRonda();
        break;
    case 'POST':
        createRonda();
        break;
    case 'PUT':
        updateRonda();
        break;
    case 'DELETE':
        deleteRonda();
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getRonda() {
    global $pdo;

    // Verificar si se proporcionó un código en los parámetros GET
    if (isset($_GET['codigo'])) {
        $codigo = $_GET['codigo']; // Obtener el código de la URL

        // Buscar la ronda con ese código
        $stmt = $pdo->prepare("SELECT 
            rd.nombre AS nombre,
            CONCAT(gs.nombre, ' ', gs.apellido_paterno, ' ', gs.apellido_materno) AS guard,
            rd.hora_inicio AS start,
            rd.hora_fin AS end,
            rd.secuencia AS sectors,
            rd.intervalos AS frequency
        FROM ronda rd
        JOIN ronda_guardia rg ON rd.codigo = rg.codigo_ronda
        JOIN guardia_seguridad gs ON rg.id_guardia = gs.ID
        WHERE rd.codigo = ?");
        $stmt->execute([$codigo]);
        $ronda = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($ronda) {
            echo json_encode($ronda);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Ronda no encontrada"]);
        }
    } else {
        // Si no se proporciona un código, devolver todas las rondas
        $stmt = $pdo->query("SELECT * FROM ronda");
        $rondas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rondas);
    }
}


function createRonda() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->nombre) || !isset($data->hora_inicio) || !isset($data->hora_fin) || !isset($data->intervalos) || !isset($data->secuencia)) {
        http_response_code(400);
        echo json_encode(["error" => "Faltan datos necesarios"]);
        return;
    }

    $nombre = $data->nombre;
    $hora_inicio = $data->hora_inicio;
    $hora_fin = $data->hora_fin;
    $intervalos = $data->intervalos;
    $secuencia = $data->secuencia;

    // Convertir las fechas de UTC a la zona horaria 'America/Tijuana'
    $hora_inicio = new DateTime($hora_inicio, new DateTimeZone('UTC'));
    $hora_inicio->setTimezone(new DateTimeZone('America/Tijuana'));
    $hora_inicio = $hora_inicio->format('Y-m-d H:i:s');

    $hora_fin = new DateTime($hora_fin, new DateTimeZone('UTC'));
    $hora_fin->setTimezone(new DateTimeZone('America/Tijuana'));
    $hora_fin = $hora_fin->format('Y-m-d H:i:s');

    try {
        $stmt = $pdo->prepare("INSERT INTO ronda (nombre, hora_inicio, hora_fin, intervalos, secuencia) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$nombre, $hora_inicio, $hora_fin, $intervalos, $secuencia]);
        $codigo = $pdo->lastInsertId();
        echo json_encode(["message" => "Ronda creada", "codigo" => $codigo]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al crear la ronda: " . $e->getMessage()]);
    }
}

function updateRonda() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $codigo = $data->codigo;
    $nombre = $data->nombre; // Nombre ahora está primero
    $hora_inicio = $data->hora_inicio;
    $hora_fin = $data->hora_fin;
    $intervalos = $data->intervalos;

    $stmt = $pdo->prepare("UPDATE ronda SET nombre = ?, hora_inicio = ?, hora_fin = ?, intervalos = ? WHERE codigo = ?");
    $stmt->execute([$nombre, $hora_inicio, $hora_fin, $intervalos, $codigo]);
    echo json_encode(["message" => "Ronda actualizada"]);
}

function deleteRonda() {
    global $pdo;
    $data = json_decode(file_get_contents("php://input"));
    $codigo = $data->codigo;

    $stmt = $pdo->prepare("DELETE FROM ronda WHERE codigo = ?");
    $stmt->execute([$codigo]);
    echo json_encode(["message" => "Ronda eliminada"]);
}
?>