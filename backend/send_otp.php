<?php
header("Access-Control-Allow-Origin: http://localhost:8081"); // Asegúrate que esta sea la URL de tu frontend
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

error_log("send_otp.php: Starting execution");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


require 'vendor/autoload.php';
require 'api/config/db.php';   // Incluye la conexión a la base de datos PDO

function generateOTP() {
    return rand(100000, 999999);   // Código de 6 dígitos
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];

    // Verificar si el correo electrónico existe en la tabla login
    try {
        $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM login WHERE correo = ?");
        $stmtCheck->execute([$email]);
        $count = $stmtCheck->fetchColumn();

        if ($count == 0) {
            echo json_encode(["status" => "error", "message" => "Email address not found in the system."]);
            exit();
        }
    } catch (PDOException $e) {
        error_log("send_otp.php: Error al verificar el correo: " . $e->getMessage());
        echo json_encode(["status" => "error", "message" => "Error verifying email address."]);
        exit();
    }

    // Generar código OTP
    $otp = generateOTP();
    $expires = date("Y-m-d H:i:s", strtotime("+10 minutes"));

    // Guardar en la base de datos
    try {
        $stmt = $pdo->prepare("UPDATE login SET otp_code=?, otp_expires=? WHERE correo=?");
        $stmt->execute([$otp, $expires, $email]);

        // Enviar código por correo con estilos
        $mail = new PHPMailer(true);
        $mail->CharSet = 'UTF-8';
        try {
            $mail->isSMTP();
            $mail->Host = "smtp.gmail.com";
            $mail->SMTPAuth = true;
            $mail->Username = "artemis.quanta@gmail.com";   // Cambia esto
            $mail->Password = "udacedpzdsvqofla"; // Usa la contraseña de aplicación de Gmail
            $mail->SMTPSecure = "tls";
            $mail->Port = 587;

            $mail->setFrom("artemis.quanta@gmail.com", "Artemis Security");
            $mail->addAddress($email);
            $mail->isHTML(true);
            $mail->Subject = "Verification Code - Artemis Security";
            $mail->Body = "
                <div style='font-family: Arial, sans-serif; background-color: #f8f5ec; padding: 20px; text-align: center;'>
                    <div style='background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0,0,0,0.1); max-width: 400px; margin: auto;'>
                        <h2 style='color: #4a4a4a;'>Artemis Security</h2>
                        <p style='font-size: 16px; color: #333;'>Your verification code is:</p>
                        <p style='font-size: 24px; font-weight: bold; color: #4a4a4a;'>$otp</p>
                        <p style='color: #666;'>This code will expire in 10 minutes.</p>
                        <hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
                        <p style='font-size: 12px; color: #999;'>If you did not request this code, please ignore this message.</p>
                    </div>
                </div>";

            $mail->send();
            echo json_encode(["status" => "success", "message" => "Code sent"]);
        } catch (Exception $e) {
            echo json_encode(["status" => "error", "message" => "Error sending email"]);
        }
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Error saving OTP: " . $e->getMessage()]);
    }
}
?>