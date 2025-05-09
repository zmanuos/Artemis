<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

error_log("actualizar_rfid.php: Starting execution");

$dbFilePath = '../config/db.php';
if (!file_exists($dbFilePath)) {
    error_log("actualizar_rfid.php: Error - db.php not found at " . $dbFilePath);
    echo json_encode(["message" => "Error: db.php not found"]);
    exit;
}

include_once $dbFilePath;

error_log("actualizar_rfid.php: db.php included");

$method = $_SERVER['REQUEST_METHOD'];

error_log("actualizar_rfid.php: Request Method: " . $method);

if ($method === 'POST') {
    updateRFIDEmployeeId();
} elseif ($method === 'OPTIONS') {
    http_response_code(200);
} else {
    echo json_encode(["message" => "Method not allowed"]);
    error_log("actualizar_rfid.php: Method not allowed: " . $method);
}

function updateRFIDEmployeeId() {
    global $pdo;
    error_log("actualizar_rfid.php: updateRFIDEmployeeId() function started");

    // Leer el JSON del cuerpo de la solicitud
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true); 
    error_log("actualizar_rfid.php: JSON data received: " . $json_data);
    error_log("actualizar_rfid.php: Decoded data: " . json_encode($data));

    // Validar la presencia del id_empleado
    if (!isset($data['id_empleado'])) {
        $error_message = "Error: Employee ID is required.";
        error_log("actualizar_rfid.php: " . $error_message);
        echo json_encode(["message" => $error_message]);
        return;
    }
    $employee_id = $data['id_empleado'];

    $rfid_code_to_update = $data['codigo_rfid'] ?? null;
    $rfid_to_remove = $data['rfid_a_remover'] ?? null; 

    try {
        $pdo->beginTransaction();

        if ($rfid_code_to_update !== null) {

            $stmtCheckRFIDExists = $pdo->prepare("SELECT id_RFID, id_empleado FROM rfid WHERE codigo_rfid = ?");
            $stmtCheckRFIDExists->execute([$rfid_code_to_update]);
            $rfidToUpdate = $stmtCheckRFIDExists->fetch(PDO::FETCH_ASSOC);

            if ($rfidToUpdate) {
                $existing_rfid_employee_id = $rfidToUpdate['id_empleado'];

                if ($existing_rfid_employee_id !== null && $existing_rfid_employee_id != $employee_id) {
                    $pdo->rollBack();
                    echo json_encode(["message" => "Error: RFID code is already assigned to another employee."]);
                    error_log("actualizar_rfid.php: RFID code " . $rfid_code_to_update . " is already assigned to another employee (ID: " . $existing_rfid_employee_id . ")");
                    return;
                }

                $new_status = ($employee_id !== null && $employee_id > 0) ? 'Activo' : 'Inactivo';
                $stmtUpdateRFID = $pdo->prepare("UPDATE rfid SET id_empleado = ?, estado = ? WHERE codigo_rfid = ?");
                if ($stmtUpdateRFID->execute([$employee_id, $new_status, $rfid_code_to_update])) {
                    error_log("actualizar_rfid.php: RFID with code " . $rfid_code_to_update . " updated with Employee ID: " . json_encode($employee_id) . " and status: " . $new_status);
                    $pdo->commit(); 
                    echo json_encode(["message" => "RFID updated successfully"]);
                } else {
                    $pdo->rollBack(); 
                    $error_message = "Error updating RFID with code " . $rfid_code_to_update . ".";
                    error_log("actualizar_rfid.php: " . $error_message . " - " . print_r($stmtUpdateRFID->errorInfo(), true));
                    echo json_encode(["message" => $error_message]);
                }
            } else {
                $pdo->rollBack();
                echo json_encode(["message" => "Error: RFID code not found"]);
                error_log("actualizar_rfid.php: RFID code not found: " . $rfid_code_to_update);
            }
        } elseif ($rfid_to_remove !== null) {

            $stmtCheckAssignment = $pdo->prepare("SELECT id_RFID FROM rfid WHERE codigo_rfid = ? AND id_empleado = ?");
            $stmtCheckAssignment->execute([$rfid_to_remove, $employee_id]);
            $rfidToRemoveResult = $stmtCheckAssignment->fetch(PDO::FETCH_ASSOC);

            if ($rfidToRemoveResult) {
                $stmtUnassignRFID = $pdo->prepare("UPDATE rfid SET id_empleado = NULL, estado = 'Inactivo' WHERE codigo_rfid = ? AND id_empleado = ?");
                if ($stmtUnassignRFID->execute([$rfid_to_remove, $employee_id])) {
                    error_log("actualizar_rfid.php: RFID with code " . $rfid_to_remove . " unassigned from Employee ID: " . $employee_id);
                    $pdo->commit();
                    echo json_encode(["message" => "RFID desasignado exitosamente."]);
                } else {
                    $pdo->rollBack();
                    $error_message = "Error desassigning RFID with code " . $rfid_to_remove . " from Employee ID: " . $employee_id . ".";
                    error_log("actualizar_rfid.php: " . $error_message . " - " . print_r($stmtUnassignRFID->errorInfo(), true));
                    echo json_encode(["message" => $error_message]);
                }
            } else {
                $pdo->rollBack();
                echo json_encode(["message" => "Error: RFID code " . $rfid_to_remove . " is not assigned to Employee ID " . $employee_id . "."]);
                error_log("actualizar_rfid.php: RFID code " . $rfid_to_remove . " is not assigned to Employee ID " . $employee_id . " or does not exist.");
            }
        } else {
            $pdo->rollBack();
            echo json_encode(["message" => "Error: No RFID code to update or remove provided."]);
            error_log("actualizar_rfid.php: No RFID code to update or remove provided in the request.");
        }

    } catch (PDOException $e) {
        $pdo->rollBack(); 
        $error_message = "Error: Database error during update.";
        error_log("actualizar_rfid.php: " . $error_message . " - " . $e->getMessage());
        echo json_encode(["message" => $error_message]);
    }
}
?>