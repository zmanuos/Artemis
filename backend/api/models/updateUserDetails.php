<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS, GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

error_log("updateUserDetails.php: Starting execution");

$dbFilePath = '../config/db.php';
if (!file_exists($dbFilePath)) {
    error_log("updateUserDetails.php: Error - db.php not found at " . $dbFilePath);
    echo json_encode(["message" => "Error: db.php not found"]);
    exit;
}

include_once $dbFilePath;

error_log("updateUserDetails.php: db.php included");

$method = $_SERVER['REQUEST_METHOD'];

error_log("updateUserDetails.php: Request Method: " . $method);
error_log("updateUserDetails.php: GET parameters: " . json_encode($_GET));
error_log("updateUserDetails.php: POST parameters: " . json_encode($_POST));

function updateRFIDEmployeeId() {
    global $pdo;
    error_log("updateUserDetails.php: updateRFIDEmployeeId() function started");

    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true); 

    error_log("updateUserDetails.php: JSON data received: " . $json_data);
    error_log("updateUserDetails.php: Decoded data: " . json_encode($data));

    if (!isset($data['codigo_rfid']) || empty(trim($data['codigo_rfid']))) {
        echo json_encode(["message" => "Error: RFID code is required"]);
        error_log("updateUserDetails.php: Error - RFID code is missing or empty in JSON body");
        return;
    }
    $rfid_code = trim($data['codigo_rfid']);

    if (!isset($data['id_empleado'])) {
        echo json_encode(["message" => "Error: Employee ID is required"]);
        error_log("updateUserDetails.php: Error - Employee ID is missing in JSON body");
        return;
    }
    $new_employee_id = $data['id_empleado'];

    try {
        $stmtCheckRFID = $pdo->prepare("SELECT id_RFID FROM rfid WHERE codigo_rfid = ?");
        $stmtCheckRFID->execute([$rfid_code]);
        $rfidRecord = $stmtCheckRFID->fetch(PDO::FETCH_ASSOC);

        if ($rfidRecord) {
            $rfid_id = $rfidRecord['id_RFID'];

            $stmtUpdateRFID = $pdo->prepare("UPDATE rfid SET id_empleado = ? WHERE codigo_rfid = ?");
            if ($stmtUpdateRFID->execute([$new_employee_id, $rfid_code])) {
                error_log("updateUserDetails.php: RFID with code " . $rfid_code . " updated with Employee ID: " . json_encode($new_employee_id));
                echo json_encode(["message" => "RFID updated successfully"]);
            } else {
                error_log("updateUserDetails.php: Error updating RFID with code " . $rfid_code . " - " . print_r($stmtUpdateRFID->errorInfo(), true));
                echo json_encode(["message" => "Error updating RFID"]);
            }
        } else {
            echo json_encode(["message" => "Error: RFID code not found"]);
            error_log("updateUserDetails.php: RFID code not found: " . $rfid_code);
        }

    } catch (PDOException $e) {
        error_log("updateUserDetails.php: PDO exception in updateRFIDEmployeeId: " . $e->getMessage());
        echo json_encode(["message" => "Error: Database error during update"]);
    }
}

if ($method === 'GET') {
    if (isset($_GET['action']) && $_GET['action'] === 'getEmployeeDetailsByRole' && isset($_GET['id_empleado'])) {
        getEmployeeDetailsByRole($_GET['id_empleado']);
    } elseif (isset($_GET['action']) && $_GET['action'] === 'getInactiveRfidCodes') {
        getInactiveRfidCodes();
    } else {
        echo json_encode(["message" => "Error: Invalid GET action or missing parameters"]);
        error_log("updateUserDetails.php: Invalid GET action or missing parameters: " . ($_GET['action'] ?? 'no action'));
    }
} elseif ($method === 'POST') {
    if (isset($_GET['action']) && $_GET['action'] === 'getEmployeeDetailsByRole') {
        if (isset($_POST['id_empleado'])) {
            getEmployeeDetailsByRole($_POST['id_empleado']);
        } else {
            echo json_encode(["message" => "Error: Missing 'id_empleado' parameter in POST request"]);
            error_log("updateUserDetails.php: Missing 'id_empleado' parameter in POST request");
        }
    } elseif (isset($_GET['action']) && $_GET['action'] === 'updateUserDetailsByRole') {
        updateUserDetailsByRole();
    } elseif (isset($_GET['action']) && $_GET['action'] === 'updateRfidEmployeeId') {
        updateRFIDEmployeeId(); 
    } else {
        echo json_encode(["message" => "Error: Invalid POST action"]);
        error_log("updateUserDetails.php: Invalid POST action: " . ($_GET['action'] ?? 'no action'));
    }
} elseif ($method === 'OPTIONS') {
    http_response_code(200);
} else {
    echo json_encode(["message" => "Method not allowed"]);
    error_log("updateUserDetails.php: Method not allowed: " . $method);
}

function getInactiveRfidCodes() {
    global $pdo;
    error_log("updateUserDetails.php: getInactiveRfidCodes() function started");

    try {
        $stmt = $pdo->prepare("SELECT codigo_rfid, tipo, estado FROM rfid WHERE estado = 'Inactivo'");
        $stmt->execute();
        $inactiveRfidCodes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($inactiveRfidCodes);
        error_log("updateUserDetails.php: Inactive RFID codes fetched successfully: " . json_encode($inactiveRfidCodes));

    } catch (PDOException $e) {
        error_log("updateUserDetails.php: PDO exception in getInactiveRfidCodes: " . $e->getMessage());
        echo json_encode(["message" => "Error: Database error fetching inactive RFID codes"]);
    }
}

function getEmployeeDetailsByRole($employeeId) {
    global $pdo;
    error_log("updateUserDetails.php: getEmployeeDetailsByRole() function started for ID: " . $employeeId);

    if (empty($employeeId)) {
        echo json_encode(["message" => "Error: Employee ID cannot be empty"]);
        error_log("updateUserDetails.php: Employee ID cannot be empty for getEmployeeDetailsByRole");
        return;
    }

    try {
   
        $stmtRole = $pdo->prepare("SELECT rol FROM empleado WHERE ID = ?");
        $stmtRole->execute([$employeeId]);
        $employeeRole = $stmtRole->fetchColumn();

        if ($employeeRole) {
            $selectColumns = "";
            $joinClauses = "";

            switch ($employeeRole) {
                case 'supervisor':
                    $selectColumns = "e.rol, e.ID, e.nombre, e.apellido_paterno, e.apellido_materno, e.genero, r.codigo_rfid AS rfid, l.correo, l.contrasena";
                    $joinClauses = "LEFT JOIN login l ON e.ID = l.id_empleado LEFT JOIN rfid r ON e.ID = r.id_empleado";
                    break;
                case 'empleado':
                    $selectColumns = "e.rol, e.ID, e.nombre, e.apellido_paterno, e.apellido_materno, e.genero, r.codigo_rfid AS rfid, e.telefono";
                    $joinClauses = "LEFT JOIN rfid r ON e.ID = r.id_empleado";
                    break;
                case 'guardia':
                    $selectColumns = "e.rol, e.ID, e.nombre, e.apellido_paterno, e.apellido_materno, e.genero, e.telefono";
                    $joinClauses = ""; 
                    break;
                default:
                    $selectColumns = "e.rol, e.ID, e.nombre, e.apellido_paterno, e.apellido_materno, e.genero, e.telefono";
                    $joinClauses = "";
                    break;
            }

            $sql = "SELECT " . $selectColumns . " FROM empleado e " . $joinClauses . " WHERE e.ID = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$employeeId]);
            $employeeDetails = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($employeeDetails) {
                echo json_encode($employeeDetails);
                error_log("updateUserDetails.php: Employee details fetched successfully for ID: " . $employeeId . " (Role: " . $employeeRole . ")");
            } else {
                echo json_encode(["message" => "Error: Employee details not found for ID: " . $employeeId]);
                error_log("updateUserDetails.php: Employee details not found for ID: " . $employeeId);
            }

        } else {
            echo json_encode(["message" => "Error: Employee role not found for ID: " . $employeeId]);
            error_log("updateUserDetails.php: Employee role not found for ID: " . $employeeId);
        }

    } catch (PDOException $e) {
        error_log("updateUserDetails.php: PDO exception in getEmployeeDetailsByRole: " . $e->getMessage());
        echo json_encode(["message" => "Error: Database error fetching employee details"]);
    }
}



function updateUserDetailsByRole() {
    global $pdo;
    error_log("updateUserDetails.php: updateUserDetailsByRole() function started");

    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    error_log("updateUserDetails.php: JSON data received: " . $json_data);
    error_log("updateUserDetails.php: Decoded data: " . json_encode($data));

    if (!isset($data['id_empleado']) || empty($data['id_empleado'])) {
        echo json_encode(["message" => "Error: Employee ID is required for updating details"]);
        error_log("updateUserDetails.php: Error - id_empleado is missing or empty in JSON body");
        return;
    }

    $id_empleado = $data['id_empleado'];

    try {
        $stmtRole = $pdo->prepare("SELECT rol FROM empleado WHERE ID = ?");
        $stmtRole->execute([$id_empleado]);
        $employeeRole = $stmtRole->fetchColumn();

        if ($employeeRole) {
            switch ($employeeRole) {
                case 'supervisor':
                    if (isset($data['correo'])) {
                        $correo = trim($data['correo']);
                        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
                            echo json_encode(["message" => "Error: Invalid email format"]);
                            error_log("updateUserDetails.php: Error - Invalid email format for supervisor ID: " . $id_empleado);
                            return;
                        }
                        // **Validación de correo electrónico existente**
                        $stmtCheckCorreo = $pdo->prepare("SELECT COUNT(*) FROM login WHERE correo = ? AND id_empleado != ?");
                        $stmtCheckCorreo->execute([$correo, $id_empleado]);
                        if ($stmtCheckCorreo->fetchColumn() > 0) {
                            echo json_encode(["message" => "Error: This email address is already in use"]);
                            error_log("updateUserDetails.php: Error - Email already in use: " . $correo);
                            return;
                        }
                        $stmtCorreo = $pdo->prepare("UPDATE login SET correo = ? WHERE id_empleado = ?");
                        if ($stmtCorreo->execute([$correo, $id_empleado])) {
                            error_log("updateUserDetails.php: Supervisor email updated for ID: " . $id_empleado . " to: " . $correo);
                        } else {
                            error_log("updateUserDetails.php: Error updating supervisor email for ID: " . $id_empleado . " - " . print_r($stmtCorreo->errorInfo(), true));
                            echo json_encode(["message" => "Error updating email"]);
                            return;
                        }
                    }
                    if (isset($data['newPassword'])) {
                        $newPassword = trim($data['newPassword']);
                        if (strlen($newPassword) < 8) { // Se aumentó la longitud mínima a 8 caracteres (como se sugirió en el frontend)
                            echo json_encode(["message" => "Error: Password must be at least 8 characters long"]);
                            error_log("updateUserDetails.php: Error - Password too short for supervisor ID: " . $id_empleado);
                            return;
                        }
                        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
                        $stmtPassword = $pdo->prepare("UPDATE login SET contrasena = ? WHERE id_empleado = ?");
                        if ($stmtPassword->execute([$hashedPassword, $id_empleado])) {
                            error_log("updateUserDetails.php: Supervisor password updated for ID: " . $id_empleado);
                        } else {
                            error_log("updateUserDetails.php: Error updating supervisor password for ID: " . $id_empleado . " - " . print_r($stmtPassword->errorInfo(), true));
                            echo json_encode(["message" => "Error updating password"]);
                            return;
                        }
                    }
                    if (isset($data['RFID'])) {
                        $rfid = trim($data['RFID']);
                        if (empty($rfid)) {
                            echo json_encode(["message" => "Error: RFID cannot be empty"]);
                            return;
                        }

                        $stmtCheckRFID = $pdo->prepare("SELECT id_RFID FROM rfid WHERE codigo_rfid = ?");
                        $stmtCheckRFID->execute([$rfid]);
                        $rfidRecord = $stmtCheckRFID->fetch(PDO::FETCH_ASSOC);

                        if ($rfidRecord) {
                            $rfid_id = $rfidRecord['id_RFID'];
                            $stmtUpdateRFID = $pdo->prepare("UPDATE rfid SET id_empleado = ? WHERE id_RFID = ?");
                            if ($stmtUpdateRFID->execute([$id_empleado, $rfid_id])) {
                                error_log("updateUserDetails.php: Supervisor RFID re-assigned to ID: " . $id_empleado . ", RFID Code: " . $rfid);
                            } else {
                                error_log("updateUserDetails.php: Error re-assigning supervisor RFID for ID: " . $id_empleado . ", RFID Code: " . $rfid . " - " . print_r($stmtUpdateRFID->errorInfo(), true));
                                echo json_encode(["message" => "Error re-assigning RFID"]);
                                return;
                            }
                        } else {
                            echo json_encode(["message" => "Error: RFID code not found"]);
                            return;
                        }
                    }
                    break;
                case 'empleado':
                case 'guardia':
                    if (isset($data['telefono'])) {
                        $telefono = trim($data['telefono']);
                        if (!preg_match('/^\d{10}$/', $telefono)) { // Valida que sean 10 dígitos numéricos
                            echo json_encode(["message" => "Error: Phone number must be 10 digits"]);
                            error_log("updateUserDetails.php: Error - Invalid phone number format for ID: " . $id_empleado);
                            return;
                        }
                        // **Validación de teléfono existente**
                        $stmtCheckTelefono = $pdo->prepare("SELECT COUNT(*) FROM empleado WHERE telefono = ? AND ID != ?");
                        $stmtCheckTelefono->execute([$telefono, $id_empleado]);
                        if ($stmtCheckTelefono->fetchColumn() > 0) {
                            echo json_encode(["message" => "Error: This phone number is already in use"]);
                            error_log("updateUserDetails.php: Error - Phone number already in use: " . $telefono);
                            return;
                        }
                        $stmtTelefono = $pdo->prepare("UPDATE empleado SET telefono = ? WHERE ID = ?");
                        if ($stmtTelefono->execute([$telefono, $id_empleado])) {
                            error_log("updateUserDetails.php: " . ucfirst($employeeRole) . " phone updated for ID: " . $id_empleado . " to: " . $telefono);
                        } else {
                            error_log("updateUserDetails.php: Error updating " . strtolower($employeeRole) . " phone for ID: " . $id_empleado . " - " . print_r($stmtTelefono->errorInfo(), true));
                            echo json_encode(["message" => "Error updating phone number"]);
                            return;
                        }
                    }
                    if (isset($data['RFID'])) {
                        $rfid = trim($data['RFID']);
                        if (empty($rfid)) {
                            echo json_encode(["message" => "Error: RFID cannot be empty"]);
                            return;
                        }

                        $stmtCheckRFID = $pdo->prepare("SELECT id_RFID FROM rfid WHERE codigo_rfid = ?");
                        $stmtCheckRFID->execute([$rfid]);
                        $rfidRecord = $stmtCheckRFID->fetch(PDO::FETCH_ASSOC);

                        if ($rfidRecord) {
                            $rfid_id = $rfidRecord['id_RFID'];
                            $stmtUpdateRFID = $pdo->prepare("UPDATE rfid SET id_empleado = ? WHERE id_RFID = ?");
                            if ($stmtUpdateRFID->execute([$id_empleado, $rfid_id])) {
                                error_log("updateUserDetails.php: " . ucfirst($employeeRole) . " RFID re-assigned to ID: " . $id_empleado . ", RFID Code: " . $rfid);
                            } else {
                                error_log("updateUserDetails.php: Error re-assigning " . strtolower($employeeRole) . " RFID for ID: " . $id_empleado . ", RFID Code: " . $rfid . " - " . print_r($stmtUpdateRFID->errorInfo(), true));
                                echo json_encode(["message" => "Error re-assigning RFID"]);
                                return;
                            }
                        } else {
                            echo json_encode(["message" => "Error: RFID code not found"]);
                            return;
                        }
                    }
                    break;
                default:
                    echo json_encode(["message" => "Error: Invalid employee role for update"]);
                    error_log("updateUserDetails.php: Invalid employee role for update: " . $employeeRole);
                    return;
            }
            echo json_encode(["message" => "User details updated successfully"]);
        } else {
            echo json_encode(["message" => "Error: Employee role not found"]);
            error_log("updateUserDetails.php: Employee role not found for ID: " . $id_empleado);
        }

    } catch (PDOException $e) {
        error_log("updateUserDetails.php: PDO exception in updateUserDetailsByRole: " . $e->getMessage());
        echo json_encode(["message" => "Error: Database error during update"]);
    }
};
?>
