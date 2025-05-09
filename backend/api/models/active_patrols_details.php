<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if (isset($_GET['all'])) {
            getAllRouteSchedules();
        } else {
            getRouteSchedule();
        }
        break;
    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}

function getRouteSchedule() {
    global $pdo;

    try {
        // Consulta SQL para obtener el horario de rutas activas (no terminadas)
        $stmt = $pdo->prepare("SELECT
            rd.nombre AS nombre,
            CONCAT(gs.nombre, ' ', gs.apellido_paterno, ' ', gs.apellido_materno) AS guard,
            rd.hora_inicio AS start,
            rd.hora_fin AS end,
            rd.secuencia AS sectors,
            rd.codigo AS codigo,
            rd.intervalos AS frequency
        FROM ronda rd
        JOIN ronda_guardia rg ON rd.codigo = rg.codigo_ronda
        JOIN guardia_seguridad gs ON rg.id_guardia = gs.ID
        WHERE rd.estado = 1
        ORDER BY rd.codigo DESC");

        $stmt->execute();
        $route_schedule = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $active_schedule = [];
        $now = new DateTime();
        $tijuanaTimezone = new DateTimeZone('America/Tijuana');
        $now->setTimezone($tijuanaTimezone);

        foreach ($route_schedule as $schedule) {
            $start_time = null;
            if ($schedule['start']) {
                $start_time = new DateTime($schedule['start']);
                $start_time->setTimezone($tijuanaTimezone);
            }

            $end_time = null;
            if ($schedule['end']) {
                $end_time = new DateTime($schedule['end']);
                $end_time->setTimezone($tijuanaTimezone);
            }

            // Caso 1: No tiene hora de inicio, se considera que aún no empieza
            if (!$start_time) {
                $active_schedule[] = $schedule;
                continue;
            }

            // Caso 2: Ya empezó pero no ha terminado
            if ($start_time <= $now && (!$end_time || $end_time > $now)) {
                $active_schedule[] = $schedule;
                continue;
            }

            // Caso 3: Aún no ha empezado
            if ($start_time > $now) {
                $active_schedule[] = $schedule;
                continue;
            }
        }

        echo json_encode($active_schedule);

    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function getAllRouteSchedules() {
    global $pdo;

    try {
        // Consulta SQL para obtener todos los horarios de ronda activos (estado = 1)
        $stmt = $pdo->prepare("SELECT
            rd.nombre AS nombre,
            CONCAT(gs.nombre, ' ', gs.apellido_paterno, ' ', gs.apellido_materno) AS guard,
            rd.hora_inicio AS start,
            rd.hora_fin AS end,
            rd.secuencia AS sectors,
            rd.codigo AS codigo,
            rd.intervalos AS frequency
        FROM ronda rd
        JOIN ronda_guardia rg ON rd.codigo = rg.codigo_ronda
        JOIN guardia_seguridad gs ON rg.id_guardia = gs.ID
        WHERE rd.estado = 1
        ORDER BY rd.codigo DESC");

        $stmt->execute();
        $route_schedule = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($route_schedule);

    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>