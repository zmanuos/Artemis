<?php
// Establecer la zona horaria de Tijuana
date_default_timezone_set('America/Tijuana');

include_once("../config/db.php");

// Función para verificar el acceso RFID y obtener el id_empleado
function verificarAccesoRFID($pdo, $uid, $puerta) {
    $uid = trim($uid);
    $sql = "SELECT r.estado, r.id_empleado
            FROM rfid r
            WHERE r.codigo_rfid = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(1, $uid);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        if ($result["estado"] == "Activo") {
            // Lógica específica para cada puerta y RFID (MANTENIENDO LA LÓGICA ANTERIOR)
            if ($puerta == 1) {
                $allowed_uids_puerta1 = ["21 0D 1E 1D", "21 7C 14 1D", "93 07 9C AC", "53 F2 2E AD"];
                if (in_array($uid, $allowed_uids_puerta1)) {
                    return $result["id_empleado"]; // Retornar el id_empleado si el acceso es concedido
                }
            } elseif ($puerta == 2) {
                $allowed_uids_puerta2 = ["93 07 9C AC", "53 F2 2E AD"];
                if (in_array($uid, $allowed_uids_puerta2)) {
                    return $result["id_empleado"]; // Retornar el id_empleado si el acceso es concedido
                }
            }
        }
    }
    return null; // Acceso denegado o RFID inactivo
}

// Procesar la solicitud POST desde ESP32
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["uid"]) && isset($_POST["puerta"])) {
        $uid = $_POST["uid"];
        $puerta = intval($_POST["puerta"]); // Asegurarse de que sea un entero

        $idEmpleadoAcceso = verificarAccesoRFID($pdo, $uid, $puerta);

        if ($idEmpleadoAcceso !== null) {
            echo "ACCESO_CONCEDIDO";
            // Registrar el acceso en la tabla 'acceso'
            $estadoAcceso = "Abierto";
            $horaAcceso = date("H:i:s"); 
            $fechaAcceso = date("Y-m-d"); 
            $codigoArea = ($puerta == 1) ? 502 : 201;

            $sqlInsertAcceso = "INSERT INTO acceso (estado, hora_acceso, codigo_area, fecha) VALUES (?, ?, ?, ?)";
            $stmtInsertAcceso = $pdo->prepare($sqlInsertAcceso);
            $stmtInsertAcceso->bindParam(1, $estadoAcceso);
            $stmtInsertAcceso->bindParam(2, $horaAcceso);
            $stmtInsertAcceso->bindParam(3, $codigoArea);
            $stmtInsertAcceso->bindParam(4, $fechaAcceso);
            $stmtInsertAcceso->execute();
            $idAcceso = $pdo->lastInsertId();
            $stmtInsertAcceso->closeCursor();

            // Insertar registro en la tabla empleado_acceso
            $sqlInsertEmpleadoAcceso = "INSERT INTO empleado_acceso (id_empleado, id_acceso) VALUES (?, ?)";
            $stmtInsertEmpleadoAcceso = $pdo->prepare($sqlInsertEmpleadoAcceso);
            $stmtInsertEmpleadoAcceso->bindParam(1, $idEmpleadoAcceso);
            $stmtInsertEmpleadoAcceso->bindParam(2, $idAcceso);
            $stmtInsertEmpleadoAcceso->execute();
            $stmtInsertEmpleadoAcceso->closeCursor();

        } else {
            echo "ACCESO_DENEGADO";
            // Registrar el intento de acceso (denegado) en la tabla 'acceso'
            $estadoAccesoDenegado = "Denegado";
            $horaAccesoDenegado = date("H:i:s"); // También usará la hora de Tijuana
            $fechaAccesoDenegado = date("Y-m-d"); // La fecha también se basará en la zona horaria
            $codigoAreaDenegado = ($puerta == 1) ? 502 : 201; // Código de área INVERTIDO
            // $codigoAreaDenegado = ($puerta == 1) ? 201 : 202; // Código de área ORIGINAL

            $sqlInsertAccesoDenegado = "INSERT INTO acceso (estado, hora_acceso, codigo_area, fecha) VALUES (?, ?, ?, ?)";
            $stmtInsertAccesoDenegado = $pdo->prepare($sqlInsertAccesoDenegado);
            $stmtInsertAccesoDenegado->bindParam(1, $estadoAccesoDenegado);
            $stmtInsertAccesoDenegado->bindParam(2, $horaAccesoDenegado);
            $stmtInsertAccesoDenegado->bindParam(3, $codigoAreaDenegado);
            $stmtInsertAccesoDenegado->bindParam(4, $fechaAccesoDenegado);
            $stmtInsertAccesoDenegado->execute();
            $idAccesoDenegado = $pdo->lastInsertId();
            $stmtInsertAccesoDenegado->closeCursor();

            // Registrar la alerta de acceso denegado (en inglés)
            if ($idAccesoDenegado !== null) {
                $descripcionAlerta = "Access denied"; // Descripción en inglés
                $sqlInsertAlerta = "INSERT INTO alerta (descripcion, id_acceso) VALUES (?, ?)";
                $stmtInsertAlerta = $pdo->prepare($sqlInsertAlerta);
                $stmtInsertAlerta->bindParam(1, $descripcionAlerta);
                $stmtInsertAlerta->bindParam(2, $idAccesoDenegado);
                $stmtInsertAlerta->execute();
                $stmtInsertAlerta->closeCursor();
            }
        }
    } else {
        echo "Error: Falta el UID o el número de puerta.";
    }
} else {
    echo "Error: Se esperaba una solicitud POST.";
}

// No es necesario cerrar la conexión PDO explícitamente aquí.
// PDO cierra la conexión cuando la variable $pdo se destruye al final del script.
?>