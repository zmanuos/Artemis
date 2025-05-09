<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['codigo_rfid']) && isset($_POST['lector'])) {
        $uid_hex = $_POST['codigo_rfid'];
        $lector = $_POST['lector'];
        $puerta = (strpos($lector, '1') !== false) ? '1' : '2';

        $tarjetas_asignadas = [
            "210D1E1D" => "RFID005",
            "217C141D" => "RFID006",
            "53F22EAD" => "RFID001",
            "93079CAC" => "RFID002",
        ];

        $response = array("acceso" => false, "puerta" => "");
        $estado_acceso = 'Denegado';
        $id_registro_acceso = null; // Para almacenar el ID del registro en 'acceso'

        if (isset($tarjetas_asignadas[$uid_hex])) {
            $codigo_rfid_db = $tarjetas_asignadas[$uid_hex];

            try {
                $stmt_rfid = $pdo->prepare("SELECT estado, tipo, id_empleado FROM rfid WHERE codigo_rfid = ?");
                $stmt_rfid->execute([$codigo_rfid_db]);
                $rfid_info = $stmt_rfid->fetch(PDO::FETCH_ASSOC);

                if ($rfid_info) {
                    if ($rfid_info['estado'] == 'Activo') {
                        if ($rfid_info['tipo'] == 'supervisor') {
                            $response["acceso"] = true;
                            $response["puerta"] = $puerta;
                            $estado_acceso = 'Abierto';
                        } elseif ($rfid_info['tipo'] == 'empleado') {
                            if ($puerta == '2') {
                                $response["acceso"] = true;
                                $response["puerta"] = '2';
                                $estado_acceso = 'Abierto';
                            }
                        }
                    }
                }

                // Registrar el acceso (o intento de acceso)
                $stmt_registro_acceso = $pdo->prepare("INSERT INTO acceso (estado, hora_acceso, codigo_area) VALUES (?, NOW(), ?)");
                $codigo_area = ($puerta == '1') ? 201 : 202;
                $stmt_registro_acceso->execute([$estado_acceso, $codigo_area]);
                $id_registro_acceso = $pdo->lastInsertId();

                // Si el acceso fue permitido, registrar en reporte_acceso
                if ($estado_acceso == 'Abierto') {
                    // **Debes determinar el `id_reporte` al que quieres vincular este acceso.**
                    // Por ahora, lo dejaré como un valor fijo (ej: 1201),
                    // PERO NECESITARÁS IMPLEMENTAR LA LÓGICA PARA SELECCIONAR
                    // EL `id_reporte` CORRECTO BASÁNDOTE EN TUS REQUISITOS.
                    $id_reporte = 1201; // Ejemplo: Vincular al reporte con ID 1201

                    $stmt_reporte_acceso = $pdo->prepare("INSERT INTO reporte_acceso (id_reporte, id_registro) VALUES (?, ?)");
                    $stmt_reporte_acceso->execute([$id_reporte, $id_registro_acceso]);
                } elseif ($estado_acceso == 'Denegado') {
                    $stmt_alerta = $pdo->prepare("INSERT INTO alerta (descripcion, id_registro) VALUES (?, ?)");
                    $stmt_alerta->execute(['Acceso denegado con RFID: ' . $uid_hex, $id_registro_acceso]);
                }

                $response["registro_id"] = $id_registro_acceso;

            } catch (PDOException $e) {
                $response["error"] = "Error de base de datos: " . $e->getMessage();
            }
        } else {
            // Registrar intento de acceso con RFID no reconocido
            try {
                $stmt_registro_acceso = $pdo->prepare("INSERT INTO acceso (estado, hora_acceso, codigo_area) VALUES (?, NOW(), ?)");
                $codigo_area = ($puerta == '1') ? 201 : 202;
                $stmt_registro_acceso->execute(['Denegado', $codigo_area]);
                $id_registro_acceso = $pdo->lastInsertId();
                $stmt_alerta = $pdo->prepare("INSERT INTO alerta (descripcion, id_registro) VALUES (?, ?)");
                $stmt_alerta->execute(['Acceso denegado - RFID no reconocido: ' . $uid_hex, $id_registro_acceso]);
                $response["registro_id"] = $id_registro_acceso;
            } catch (PDOException $e) {
                $response["error"] = "Error de base de datos al registrar RFID no reconocido: " . $e->getMessage();
            }
        }

        echo json_encode($response);

    } else {
        echo json_encode(["error" => "Faltan parámetros: codigo_rfid y lector"]);
    }
} else {
    echo json_encode(["message" => "Método no permitido. Solo se acepta POST"]);
}
?>