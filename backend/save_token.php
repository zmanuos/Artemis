<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include 'api/config/db.php'; // Asegúrate de que este incluya $pdo

// Archivo de log en el mismo directorio que este script
$log_file = __DIR__ . '/registro_token.log';

// Función para escribir en el log
function escribirLog($mensaje) {
    global $log_file;
    $fecha = date("Y-m-d H:i:s");
    error_log("[$fecha] $mensaje\n", 3, $log_file);
}

// Verificar si la conexión a la base de datos existe
if (!isset($pdo) || !$pdo) {
    escribirLog("ERROR: No se pudo establecer la conexión a la base de datos.");
    http_response_code(500);
    echo json_encode(array("message" => "Error de conexión a la base de datos."));
    exit;
}

escribirLog("Conexión a la base de datos establecida correctamente.");

$data = json_decode(file_get_contents("php://input"));

// Registrar los datos recibidos
escribirLog("Datos recibidos: " . json_encode($data));

if (
    !empty($data->id_empleado) &&
    !empty($data->token)
) {
    $id_empleado = $data->id_empleado;
    $push_token = $data->token;

    try {
        $query = "UPDATE login SET push_token = :push_token WHERE id_empleado = :id_empleado";
        escribirLog("Consulta SQL: $query");

        $stmt = $pdo->prepare($query);

        $id_empleado = htmlspecialchars(strip_tags($id_empleado));
        $push_token = htmlspecialchars(strip_tags($push_token));

        escribirLog("Valores vinculados => id_empleado: $id_empleado, push_token: $push_token");

        $stmt->bindParam(':push_token', $push_token);
        $stmt->bindParam(':id_empleado', $id_empleado, PDO::PARAM_INT);

        if ($stmt->execute()) {
            escribirLog("Consulta ejecutada correctamente.");
            if ($stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode(array("message" => "Token guardado exitosamente."));
                escribirLog("Token guardado para id_empleado: $id_empleado");
            } else {
                // Comprobar si el empleado existe (para diferenciar de "no encontrado" vs "no cambió")
                $checkQuery = "SELECT id_empleado, push_token FROM login WHERE id_empleado = :id_empleado";
                $checkStmt = $pdo->prepare($checkQuery);
                $checkStmt->bindParam(':id_empleado', $id_empleado, PDO::PARAM_INT);
                $checkStmt->execute();
                $user = $checkStmt->fetch(PDO::FETCH_ASSOC);

                if ($user) {
                    if ($user['push_token'] === $push_token) {
                        // El token ya era el mismo, consideramos como éxito
                        http_response_code(200);
                        echo json_encode(array("message" => "El token ya estaba registrado."));
                        escribirLog("El token ya estaba registrado para id_empleado: $id_empleado");
                    } else {
                        // El empleado existe, pero el token no cambió (esto es raro, pero posible)
                        http_response_code(200); // Considerar también un 204 No Content
                        echo json_encode(array("message" => "El token no cambió."));
                        escribirLog("El token no cambió para id_empleado: $id_empleado");
                    }
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "No se encontró el empleado."));
                    escribirLog("No se encontró el empleado para id_empleado: $id_empleado");
                }
            }
        } else {
            $errorInfo = $stmt->errorInfo();
            escribirLog("Error al ejecutar la consulta. ErrorInfo: " . json_encode($errorInfo));
            http_response_code(503);
            echo json_encode(array("message" => "Error al actualizar el token en la base de datos."));
        }
    } catch (PDOException $exception) {
        http_response_code(503);
        echo json_encode(array("message" => "Error de base de datos.", "error" => $exception->getMessage()));
        escribirLog("Excepción PDO: " . $exception->getMessage());
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Datos incompletos. Se requiere id_empleado y token."));
    escribirLog("Datos incompletos: id_empleado y/o token no proporcionados.");
}
?>