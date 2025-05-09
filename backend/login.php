<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

error_log("login.php: Starting execution");

$dbFilePath = 'api/config/db.php';
if (!file_exists($dbFilePath)) {
    error_log("login.php: Error - db.php not found at " . $dbFilePath);
    echo json_encode(["message" => "Error: db.php not found"]);
    exit;
}

include_once $dbFilePath;

error_log("login.php: db.php included");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' || $method === 'PUT') {
    error_log("login.php: Method is POST");
    if (isset($_GET['action'])) {
        switch ($_GET['action']) {
            case 'checkEmail':
                checkEmail();
                break;
            case 'getEmail':
                getEmail();
                break;
            case 'updateEmail':
                updateEmail();
                break;
            case 'updatePassword':
                updatePassword();
                break;
            case 'resetPassword': // Nueva acción para restablecer la contraseña
                resetPassword();
                break;
            case 'getEmployeeDetailsByRole':
                getEmployeeDetailsByRole();
                break;
            default:
                login();
                break;
        }
    } else {
        login();
    }
} else {
    error_log("login.php: Method is not POST");
    echo json_encode(["message" => "Método no permitido"]);
}

function login() {
    global $pdo;

    error_log("login.php: login() function started");

    $data = json_decode(file_get_contents("php://input"));
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        error_log("login.php: JSON decode error: " . json_last_error_msg());
        echo json_encode(["message" => "Error: Invalid JSON data"]);
        return;
    }

    $correo = $data->correo;
    $contrasena = $data->contrasena;

    if (empty($correo) || empty($contrasena)) {
        error_log("login.php: Email or password missing");
        echo json_encode(["message" => "Correo y contraseña son requeridos"]);
        return;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT l.id_empleado, e.rol, l.contrasena
            FROM login l
            INNER JOIN empleado e ON l.id_empleado = e.ID
            WHERE l.correo = ?
        ");
        $stmt->execute([$correo]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $storedPassword = $user['contrasena'];
            error_log("login.php: Contraseña almacenada para " . $correo . ": " . $storedPassword);

            // Check if the stored password is a SHA256 hash
            if (strlen($storedPassword) === 64) {
                error_log("login.php: Intentando verificación SHA256");
                $hashedInputPassword = hash('sha256', $contrasena);
                if ($hashedInputPassword === $storedPassword) {
                    error_log("login.php: Login successful (SHA256 hashed password)");
                    echo json_encode([
                        "message" => "Inicio de sesión exitoso",
                        "id_empleado" => $user['id_empleado'],
                        "rol" => $user['rol']
                    ]);
                    return;
                } else {
                    error_log("login.php: Invalid credentials (SHA256 hash mismatch)");
                    echo json_encode(["message" => "Incorrect credentials"]);
                    return;
                }
            } else {
                // If not a hash, compare directly (INSECURE)
                error_log("login.php: Contraseña almacenada no es un hash SHA256, comparando directamente (INSEGURO)");
                if ($contrasena === $storedPassword) {
                    error_log("login.php: Login successful (plain text password)");
                    echo json_encode([
                        "message" => "Inicio de sesión exitoso",
                        "id_empleado" => $user['id_empleado'],
                        "rol" => $user['rol']
                    ]);
                    return;
                } else {
                    error_log("login.php: Invalid credentials (plain text mismatch)");
                    echo json_encode(["message" => "Incorrect credentials"]);
                    return;
                }
            }
        } else {
            error_log("login.php: User not found");
            echo json_encode(["message" => "Incorrect credentials"]);
            return;
        }
    } catch (PDOException $e) {
        error_log("login.php: PDO exception: " . $e->getMessage());
        echo json_encode(["message" => "Error: Database error"]);
    }
}

function resetPassword() {
    global $pdo;
    error_log("login.php: resetPassword() function started");

    $data = json_decode(file_get_contents("php://input"));
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        error_log("login.php: JSON decode error in resetPassword: " . json_last_error_msg());
        echo json_encode(["status" => "error", "message" => "Error: Invalid JSON data"]);
        return;
    }

    $email = $data->email;
    $newPassword = $data->newPassword;

    if (empty($email) || empty($newPassword)) {
        error_log("login.php: Email or new password missing in resetPassword");
        echo json_encode(["status" => "error", "message" => "Error: Email and new password are required"]);
        return;
    }

    try {
        // Verificar si el correo existe
        $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM login WHERE correo = ?");
        $stmtCheck->execute([$email]);
        $count = $stmtCheck->fetchColumn();

        if ($count > 0) {
            // Hashear la nueva contraseña
            $hashedNewPassword = hash('sha256', $newPassword);

            // Actualizar la contraseña y limpiar los campos de OTP
            $stmtUpdate = $pdo->prepare("UPDATE login SET contrasena = ?, otp_code = NULL, otp_expires = NULL WHERE correo = ?");
            $updateResult = $stmtUpdate->execute([$hashedNewPassword, $email]);

            if ($updateResult) {
                error_log("login.php: Password reset successfully for email: " . $email);
                echo json_encode(["status" => "success", "message" => "Contraseña restablecida exitosamente"]);
            } else {
                error_log("login.php: Could not reset password for email: " . $email);
                echo json_encode(["status" => "error", "message" => "Error: No se pudo restablecer la contraseña"]);
            }
        } else {
            error_log("login.php: Email not found for password reset: " . $email);
            echo json_encode(["status" => "error", "message" => "Error: Correo electrónico no encontrado"]);
        }

    } catch (PDOException $e) {
        error_log("login.php: PDO exception in resetPassword: " . $e->getMessage());
        echo json_encode(["status" => "error", "message" => "Error: Error de base de datos al restablecer la contraseña"]);
    }
}

// ... (rest of the functions: checkEmail, getEmail, updateEmail, updatePassword, getEmployeeDetailsByRole remain the same) ...

function checkEmail() {
    global $pdo;

    error_log("login.php: checkEmail() function started");

    $data = json_decode(file_get_contents("php://input"));
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        error_log("login.php: JSON decode error in checkEmail: " . json_last_error_msg());
        echo json_encode(["exists" => false, "message" => "Error: Invalid JSON data"]);
        return;
    }

    $correo = $data->correo;

    if (empty($correo)) {
        error_log("login.php: Email missing in checkEmail");
        echo json_encode(["exists" => false, "message" => "Error: Email is required"]);
        return;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT COUNT(*) FROM login WHERE correo = ?
        ");
        $stmt->execute([$correo]);
        $count = $stmt->fetchColumn();

        if ($count > 0) {
            error_log("login.php: Email exists: " . $correo);
            echo json_encode(["exists" => true]);
        } else {
            error_log("login.php: Email does not exist: " . $correo);
            echo json_encode(["exists" => false]);
        }
    } catch (PDOException $e) {
        error_log("login.php: PDO exception in checkEmail: " . $e->getMessage());
        echo json_encode(["exists" => false, "message" => "Error: Database error"]);
    }
}

function getEmail() {
    global $pdo;

    error_log("login.php: getEmail() function started");

    $data = json_decode(file_get_contents("php://input"));
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        error_log("login.php: JSON decode error in getEmail: " . json_last_error_msg());
        echo json_encode(["email" => null, "message" => "Error: Invalid JSON data"]);
        return;
    }

    $id_empleado = $data->id_empleado;

    if (empty($id_empleado)) {
        error_log("login.php: Employee ID missing in getEmail");
        echo json_encode(["email" => null, "message" => "Error: Employee ID is required"]);
        return;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT correo FROM login WHERE id_empleado = ?
        ");
        $stmt->execute([$id_empleado]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result && isset($result['correo'])) {
            error_log("login.php: Email found for employee ID " . $id_empleado . ": " . $result['correo']);
            echo json_encode(["email" => $result['correo']]);
        } else {
            error_log("login.php: Email not found for employee ID " . $id_empleado);
            echo json_encode(["email" => null, "message" => "Error: Email not found for this employee ID"]);
        }
    } catch (PDOException $e) {
        error_log("login.php: PDO exception in getEmail: " . $e->getMessage());
        echo json_encode(["email" => null, "message" => "Error: Database error"]);
    }
}

function updateEmail() {
    global $pdo;

    error_log("login.php: updateEmail() function started");

    $data = json_decode(file_get_contents("php://input"));
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        error_log("login.php: JSON decode error in updateEmail: " . json_last_error_msg());
        echo json_encode(["message" => "Error: Invalid JSON data"]);
        return;
    }

    $id_empleado = $data->id_empleado;
    $nuevo_correo = $data->nuevo_correo;

    if (empty($id_empleado) || empty($nuevo_correo)) {
        error_log("login.php: Employee ID or new email missing in updateEmail");
        echo json_encode(["message" => "Error: Employee ID and new email are required"]);
        return;
    }

    if (!filter_var($nuevo_correo, FILTER_VALIDATE_EMAIL)) {
        error_log("login.php: Invalid email format in updateEmail: " . $nuevo_correo);
        echo json_encode(["message" => "Error: Invalid email format"]);
        return;
    }

    try {
        $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM login WHERE correo = ? AND id_empleado != ?");
        $stmtCheck->execute([$nuevo_correo, $id_empleado]);
        $count = $stmtCheck->fetchColumn();

        if ($count > 0) {
            error_log("login.php: New email already exists for another user: " . $nuevo_correo);
            echo json_encode(["message" => "Error: This email address is already in use"]);
            return;
        }

        $stmtUpdate = $pdo->prepare("
            UPDATE login
            SET correo = ?
            WHERE id_empleado = ?
        ");
        $stmtUpdate->execute([$nuevo_correo, $id_empleado]);

        if ($stmtUpdate->rowCount() > 0) {
            error_log("login.php: Email updated successfully for employee ID " . $id_empleado . " to " . $nuevo_correo);
            echo json_encode(["message" => "Correo electrónico actualizado exitosamente"]);
        } else {
            error_log("login.php: Could not update email for employee ID " . $id_empleado . " (user not found or email already the same)");
            echo json_encode(["message" => "Error: Could not update email"]);
        }

    } catch (PDOException $e) {
        error_log("login.php: PDO exception in updateEmail: " . $e->getMessage());
        echo json_encode(["message" => "Error: Database error during email update"]);
    }
}

function updatePassword() {
    global $pdo;
    error_log("login.php: updatePassword() function started");

    $data = json_decode(file_get_contents("php://input"));
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        error_log("login.php: JSON decode error in updatePassword: " . json_last_error_msg());
        echo json_encode(["message" => "Error: Invalid JSON data"]);
        return;
    }

    $id_empleado = $data->id_empleado;
    $currentPassword = $data->currentPassword;
    $newPassword = $data->newPassword;
    $confirmPassword = $data->confirmPassword;

    if (empty($id_empleado) || empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
        error_log("login.php: Required fields missing in updatePassword");
        echo json_encode(["message" => "Error: All fields are required"]);
        return;
    }

    if ($newPassword !== $confirmPassword) {
        error_log("login.php: New password and confirm password do not match");
        echo json_encode(["message" => "Error: New password and confirmation do not match"]);
        return;
    }

    try {
        $stmt = $pdo->prepare("SELECT contrasena FROM login WHERE id_empleado = ?");
        $stmt->execute([$id_empleado]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $storedPassword = $user['contrasena'];

            if (hash('sha256', $currentPassword) === $storedPassword) {
                $hashedNewPassword = hash('sha256', $newPassword);

                $updateStmt = $pdo->prepare("UPDATE login SET contrasena = ? WHERE id_empleado = ?");
                $updateResult = $updateStmt->execute([$hashedNewPassword, $id_empleado]);

                if ($updateResult) {
                    error_log("login.php: Password updated successfully" . $id_empleado);
                    echo json_encode(["message" => "Password updated successfully"]);
                } else {
                    error_log("login.php: Could not update password for employee ID " . $id_empleado);
                    echo json_encode(["message" => "Error: Could not update password"]);
                }
            } else {
                error_log("login.php: Incorrect current password for employee ID " . $id_empleado);
                echo json_encode(["message" => "Error: Incorrect current password"]);
            }
        } else {
            error_log("login.php: User not found with ID " . $id_empleado);
            echo json_encode(["message" => "Error: User not found"]);
        }

    } catch (PDOException $e) {
        error_log("login.php: PDO exception in updatePassword: " . $e->getMessage());
        echo json_encode(["message" => "Error: Database error updating password"]);
    }
}

function getEmployeeDetailsByRole() {
    global $pdo;

    error_log("login.php: getEmployeeDetailsByRole() function started");

    $requestBody = file_get_contents("php://input");
    error_log("login.php: Request Body: " . $requestBody);
    $data = json_decode($requestBody);
    error_log("login.php: Decoded JSON Data: " . print_r($data, true));

    if (!is_object($data) || !property_exists($data, 'id_empleado') || empty($data->id_empleado)) {
        error_log("login.php: Employee ID missing or invalid in getEmployeeDetailsByRole");
        echo json_encode(["message" => "Error: Employee ID is required"]);
        return;
    }

    $id_empleado = $data->id_empleado;

    try {
        $stmt = $pdo->prepare("
            SELECT e.nombre, e.apellido_paterno, e.apellido_materno, e.genero, e.telefono, e.rol, l.correo, r.codigo_rfid
            FROM empleado e
            LEFT JOIN login l ON e.ID = l.id_empleado
            LEFT JOIN rfid r ON e.ID = r.id_empleado
            WHERE e.ID = ?
        ");
        $stmt->execute([$id_empleado]);
        $employeeData = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($employeeData) {
            $rol = $employeeData['rol'];
            $response = [
                'Employee ID' => $id_empleado,
                'Name' => $employeeData['nombre'],
                'Last Name' => $employeeData['apellido_paterno'],
                'apellido_materno' => $employeeData['apellido_materno'],
                'Gender' => $employeeData['genero'],
                'Role' => $rol,
                'RFID' => $employeeData['codigo_rfid'] ?? null
            ];

            if ($rol === 'supervisor') {
                $response['correo'] = $employeeData['correo'];
            } elseif ($rol === 'empleado' || $rol === 'guardia') {
                $response['Phone'] = $employeeData['telefono'] ?? null;
            }

            error_log("login.php: Employee details for ID " . $id_empleado . " (Role: " . $rol . ") with RFID: " . ($employeeData['codigo_rfid'] ?? 'N/A') . ": " . json_encode($response));
            echo json_encode($response);

        } else {
            error_log("login.php: Employee not found with ID: " . $id_empleado);
            echo json_encode(["message" => "Error: Employee not found"]);
        }

    } catch (PDOException $e) {
        error_log("login.php: PDO exception in getEmployeeDetailsByRole: " . $e->getMessage());
        echo json_encode(["message" => "Error: Database error fetching employee details"]);
    }
}
?>