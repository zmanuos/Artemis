<?php
header("Access-Control-Allow-Origin: http://localhost:8081"); // Asegúrate que esta sea la URL de tu frontend
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

error_log("verify_otp.php: Starting execution");

require 'api/config/db.php'; // Incluye la conexión a la base de datos PDO

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $otp = $_POST["otp"];

    // Validar que los campos no estén vacíos
    if (empty($email) || empty($otp)) {
        echo json_encode(["status" => "error", "message" => "Por favor, introduce tu correo electrónico y código."]);
        exit();
    }

    try {
        // Usar PDO para preparar la consulta en la tabla 'login'
        $stmt = $pdo->prepare("SELECT otp_code, otp_expires FROM login WHERE correo = :email");
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();

        // Obtener el resultado
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            $storedOTP = $result['otp_code'];
            $expires = $result['otp_expires'];

            // Verificar si el OTP es correcto y no ha expirado
            if ($storedOTP == $otp && strtotime($expires) > time()) {
                // OTP es válido, puedes marcarlo como usado o eliminarlo
                $updateStmt = $pdo->prepare("UPDATE login SET otp_code = NULL, otp_expires = NULL WHERE correo = :email");
                $updateStmt->bindParam(':email', $email, PDO::PARAM_STR);
                $updateStmt->execute();

                echo json_encode(["status" => "success", "message" => "Código válido"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Código incorrecto o expirado"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Correo no encontrado"]);
        }
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Error al verificar OTP: " . $e->getMessage()]);
    }
}
?>