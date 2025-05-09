-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 26, 2025 at 08:23 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
CREATE DATABASE artemisa;
USE artemisa;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `artemisdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `acceso`
--

CREATE TABLE `acceso` (
  `ID` int(11) NOT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `hora_acceso` time DEFAULT NULL,
  `id_registro` int(11) DEFAULT NULL,
  `codigo_area` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `acceso`
--

INSERT INTO `acceso` (`ID`, `estado`, `hora_acceso`, `id_registro`, `codigo_area`) VALUES
(501, 'Abierto', '08:15:00', 301, 201),
(502, 'Cerrado', '12:10:00', 302, 202);

--
-- Triggers `acceso`
--
DELIMITER $$
CREATE TRIGGER `after_insert_acceso` AFTER INSERT ON `acceso` FOR EACH ROW BEGIN
    INSERT INTO log_acceso (id_registro, tipo, fecha, hora, detalles)
    VALUES (NEW.id_registro, 'Acceso registrado', CURDATE(), NEW.hora_acceso, CONCAT('Estado: ', NEW.estado));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_insert_acceso_update_area` AFTER INSERT ON `acceso` FOR EACH ROW BEGIN
    UPDATE area
    SET num_accesos = num_accesos + 1
    WHERE codigo_area = NEW.codigo_area;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_insert_alerta` AFTER INSERT ON `acceso` FOR EACH ROW BEGIN
    IF NEW.estado = 'Denegado' THEN
        INSERT INTO alerta (descripcion, id_registro)
        VALUES ('Intento de acceso denegado', NEW.id_registro);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `alerta`
--

CREATE TABLE `alerta` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `id_registro` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alerta`
--

INSERT INTO `alerta` (`id`, `descripcion`, `id_registro`) VALUES
(1101, 'Acceso denegado', 301),
(1102, 'Puerta abierta fuera de horario', 302);

-- --------------------------------------------------------

--
-- Table structure for table `area`
--

CREATE TABLE `area` (
  `codigo_area` int(11) NOT NULL,
  `num_accesos` int(11) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `codigo_ruta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `area`
--

INSERT INTO `area` (`codigo_area`, `num_accesos`, `nombre`, `estado`, `codigo_ruta`) VALUES
(201, 5, 'Área A', 'Activa', 1),
(202, 3, 'Área B', 'Inactiva', 2);

-- --------------------------------------------------------

--
-- Table structure for table `dispositivo`
--

CREATE TABLE `dispositivo` (
  `codigo` int(11) NOT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1,
  `ubicacion` varchar(255) DEFAULT NULL,
  `codigo_area` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dispositivo`
--

INSERT INTO `dispositivo` (`codigo`, `tipo`, `estado`, `ubicacion`, `codigo_area`) VALUES
(401, 'Cámara', 1, 'Entrada principal', 201),
(402, 'Sensor', 0, 'Salida trasera', 202);

-- --------------------------------------------------------

--
-- Table structure for table `empleado`
--

CREATE TABLE `empleado` (
  `ID` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido_paterno` varchar(255) DEFAULT NULL,
  `apellido_materno` varchar(255) DEFAULT NULL,
  `codigo_puesto` int(11) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `genero` char(1) DEFAULT NULL,
  `rol` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `empleado`
--

INSERT INTO `empleado` (`ID`, `nombre`, `apellido_paterno`, `apellido_materno`, `codigo_puesto`, `telefono`, `genero`, `rol`) VALUES
(100, 'Laura', 'Gómez', 'Pérez', 701, '555-1111', 'F', 'admin'),
(101, 'JUAN MANUEL', 'MEZA', 'OSUNA', 702, '', 'M', 'supervisor'),
(102, 'Maria del carmen', 'Martinez', '', 702, '', 'F', 'supervisor'),
(103, 'Guardia', 'Prueba', '', 701, '6646894543', '', 'guard'),
(104, 'Empleado', 'General', 'Prueba', 703, '54854905843', 'M', 'employee'),
(105, 'paco', 'memo', '', 702, '', 'M', 'supervisor'),
(106, 'Manue', 'lsidao', 'dosmd', 702, '', '', 'supervisor'),
(107, 'prueba', 'prueba', 'prueba', 702, '', 'M', 'supervisor'),
(108, 'Flasheo', 'Flasheo', 'papu', 702, '', '', 'supervisor'),
(109, 'Flask', 'Flask', '', 702, '', 'M', 'supervisor'),
(110, 'Nuevo login', 'Nuevo login', '', 702, '', '', 'supervisor'),
(111, 'Prueba movil', 'Prueb', 'Pe', 702, '', 'M', 'supervisor'),
(112, 'mANUEL', 'osuna', 'sadosa', 702, '', 'M', 'supervisor'),
(113, 'Manuel', 'Notificacion', 'Prueba', 702, '', 'M', 'supervisor'),
(114, 'notiosd', 'modsmid', 'mdosa', 702, '', 'M', 'supervisor'),
(115, 'sdoisaMDSOD', 'MDOSDMIO', 'MDSOAD', 702, '', 'M', 'supervisor'),
(116, 'dsosad', 'mdsoadm', 'dmsoad', 702, '', 'M', 'supervisor'),
(117, 'ds', 'dsa', 'sda', 702, '', 'M', 'supervisor'),
(118, 'dsds', 'sadas', 'sdad', 702, '', 'M', 'supervisor'),
(119, 'dsa', 'msoadm', 'mdsoadm', 702, '', 'M', 'supervisor'),
(120, 'dss', 'dsa', 'dsad', 702, '', 'M', 'supervisor'),
(121, 'sdsa', 'dsada', 'dsada', 702, '', 'M', 'supervisor'),
(122, 'sadd', 'ofmofm', 'odsmdao', 702, '', 'M', 'supervisor'),
(123, 'PRUEBAM', 'OMDSOADMD', 'ODMSOD', 702, '', '', 'supervisor'),
(124, 'DSADSD', 'DSDS', 'SDA', 702, '', 'M', 'supervisor'),
(125, 'ds', 'dsa', 'dsa', 702, '', 'M', 'supervisor'),
(126, 'Elek', 'Flflfl', 'Flflflfl', 702, '', 'M', 'supervisor'),
(127, 'Dkfkfkfk', 'Flflflfk', 'Flflflfl', 702, '', 'M', 'supervisor'),
(128, 'dsadsa', 'sdsadasd', 'sadsad', 702, '', 'M', 'supervisor'),
(129, 'sadsd', 'sdsd', 'sdd', 702, '', 'M', 'supervisor'),
(130, 'Dkfkfk', 'Dlflfl', 'Fflflfll', 702, '', '', 'supervisor'),
(131, 'DSADS', 'SADSA', 'DSADS', 702, '', 'M', 'supervisor'),
(132, 'dsds', 'sdsa', 'dsad', 702, '', 'M', 'supervisor'),
(133, 'Fflkl', 'Flflfl', 'Fflflflflflflfll', 702, '', 'M', 'supervisor'),
(134, 'sdsdas', 'dsadas', 'dsdsa', 702, '', 'M', 'supervisor'),
(135, 'Ddifl', 'Dlflflfk', 'Fkfkfk', 702, '', 'M', 'supervisor'),
(136, 'Dkflfl', 'Flflfl', 'Lflflflflfl', 702, '', 'M', 'supervisor'),
(137, 'dsamo', 'dmsodma', 'mosamd', 702, '', 'M', 'supervisor'),
(138, 'dsds', 'dsasd', 'dsads', 702, '', 'M', 'supervisor'),
(139, 'Giiglo', 'Gloglg', 'Toltto', 702, '', 'M', 'supervisor'),
(140, 'Foflk', 'Lflflf', 'Lfflfl', 702, '', 'M', 'supervisor'),
(141, 'dsad', 'dsd', 'dsad', 702, '', 'M', 'supervisor'),
(142, 'Dkfkfk', 'Elflfk', 'Flflfll', 702, '', 'M', 'supervisor'),
(143, 'Dkddk', 'Flflfl', 'Flflfl', 702, '', 'M', 'supervisor'),
(144, 'SADIOS', 'DKSAIOD', 'MDSOADM', 702, '', '', 'supervisor'),
(145, 'Dldkdk', 'Flflfl', 'Dlflfl', 702, '', 'M', 'supervisor'),
(146, 'dsda', 'dsad', 'ddsa', 702, '', '', 'supervisor'),
(147, 'Qfbrw', 'Rbq', 'Rvqwbr', 702, '', '', 'supervisor'),
(148, 'dsad', 'sad', 'dsad', 702, '', 'M', 'supervisor'),
(149, 'Rflfl', 'Dllfkffk', 'Frlfl', 702, '', '', 'supervisor'),
(150, 'dsdsa', 'dsad', 'dasda', 702, '', 'M', 'supervisor'),
(151, 'Ffk', 'Flfkk', 'Fkfkk', 702, '', '', 'supervisor'),
(152, 'dsad', 'dsadsa', 'dsad', 702, '', 'M', 'supervisor'),
(153, 'dsad', 'dsad', 'dsad', 702, '', 'M', 'supervisor'),
(154, 'Dkfkfk', 'Rlflfk', 'Flfkfk', 702, '', 'M', 'supervisor'),
(155, 'Guard', 'Flfkfk', 'Flfkfkflfkfkf', 701, '56565', 'M', 'guard'),
(156, 'Fkfkfkfk', 'Riifkfo', 'Fifkfk', 703, '464644', 'M', 'employee'),
(157, 'dasd', 'sadsad', 'dsadsad', 702, '', 'M', 'supervisor'),
(158, 'dsads', 'dsad', 'dasd', 702, '', 'M', 'supervisor'),
(159, 'Didldl', 'Dlflfl', 'Flfllrflfl', 702, '', 'M', 'supervisor'),
(160, 'sads', 'dsadsa', 'dsad', 702, '', 'M', 'supervisor'),
(161, 'Flfkfk', 'Flfkfkk', 'Flflfl', 702, '', 'M', 'supervisor'),
(162, 'Lflflfl', 'Flflflfl', 'Flflfllf', 702, '', 'M', 'supervisor'),
(163, 'Prueba', 'New', 'Lls', 702, '', 'M', 'supervisor'),
(164, 'OK', 'prueba', 'modsm', 702, '', 'M', 'supervisor'),
(165, 'OK', 'kosao', 'dso', 701, 'W089239090', 'M', 'guard'),
(166, 'DSDMOI', 'OIDSKD', 'DSO', 703, 'DMSOADMSOA', 'M', 'employee'),
(167, 'D', 'ds', '', 702, '', 'M', 'supervisor'),
(168, 'dssdsdsadsasd', 'dsadsad', 'dsada', 702, '', 'M', 'supervisor'),
(169, 'DSA', 'DSA', 'DSA', 702, '', 'M', 'supervisor'),
(170, 'dsa', 'dsa', 'dsad', 702, '', 'M', 'supervisor'),
(171, 'Yesenia', 'Betancourt', 'P', 702, '', 'F', 'supervisor'),
(172, 'wow junior', 'Jaja', 'Pcoa', 702, '', 'M', 'supervisor'),
(173, 'diflf', 'Dkfkf', 'Dlfkf', 702, '', 'M', 'supervisor'),
(174, 'pruebas', 'Fkfkf', 'Ddkfk', 702, '', 'M', 'supervisor'),
(175, 'dkfkfk', 'Ekekfk', '', 702, '', 'M', 'supervisor'),
(176, 'dsadsa', 'dsada', '', 702, '', 'M', 'supervisor'),
(177, 'Difkf', 'Kdkdlf', 'Leldlf', 702, '', 'M', 'supervisor'),
(178, 'Paco memo', 'Memo', 'Dldlld', 702, '', 'M', 'supervisor'),
(179, 'Holymoly', 'Paco', 'Memo', 702, '4646664466', 'F', 'supervisor'),
(180, 'Di', 'Fkfk', 'Fkfkr', 701, '2839393993', 'M', 'guard'),
(181, 'fhghhg', 'fhghh', 'Cggggfcgc', 701, '3455533322', 'M', 'guard'),
(182, 'ghhhh', 'ggggg', 'Gggggg', 703, '3455554442', 'M', 'employee'),
(183, 'cgghg', 'gggg', 'Fgghg', 701, '3556666666', 'M', 'guard'),
(184, 'dffg', 'gggg', 'Ffff', 701, '3455555544', 'M', 'guard'),
(185, 'emokgf', 'fgggg', 'Ffggg', 703, '2456643344', 'M', 'employee'),
(186, 'dkfkfkfk', 'dlflflfl', 'Dlflf', 701, '4848585855', 'M', 'guard'),
(187, 'pablo morzs', 'nasjaajja', 'Dldldkd', 702, '', 'M', 'supervisor'),
(188, 'dlflfllf', 'lflffllf', 'Dlflflfl', 701, '', 'M', 'guard'),
(189, 'jskdkddmdmm', 'Dldlfl d', 'flfkfk', 702, '', 'M', 'supervisor'),
(190, 'flflfl', 'Flflfll', 'flflfl', 701, '8393949929', 'M', 'guard'),
(191, 'Prueba', 'Artemis', '', 702, '', 'M', 'supervisor'),
(192, 'dpsd', 'pdsapds', 'dspd', 701, '0923902139', 'M', 'guard'),
(193, 'Manuel', 'Osuna', '', 702, '', 'M', 'supervisor'),
(194, 'Manuel', 'Osuna', 'moas', 702, '', 'M', 'supervisor'),
(195, 'Paco memo', 'dsap', 'samdo', 701, '2098291038', 'M', 'guard'),
(196, 'fdsfdsfdsdsfds', 'dfsdfdsf', 'fdsfds', 701, '3443243432', 'F', 'guard'),
(197, 'fsadsad', 'safsads', 'sdsa', 703, '2313232321', 'M', 'employee'),
(198, 'Prompt', 'mdsoa', 'mdsaod', 702, '', 'M', 'supervisor'),
(199, 'idea', 'dmsao', 'mdosa', 702, '', 'M', 'supervisor'),
(201, 'SDDA', 'DSADA', 'DADS', 701, '1646894543', 'M', 'guard'),
(202, 'Manu ', 'Packiao', 'dsmao', 701, '9382309923', 'M', 'guard'),
(203, 'Wiki', 'maso', 'osam', 701, '3243242324', 'M', 'guard'),
(204, 'dsads', 'sadsa', 'das', 702, '', 'M', 'supervisor'),
(205, 'Jerusalen', 'Miami me lo confirmo', 'msaoddk', 702, '', 'M', 'supervisor'),
(206, 'dsads', 'dsada', 'dsad', 702, '', 'M', 'supervisor'),
(207, 'Testing', 'mdosam', 'dmsaodm', 701, '2093821309', 'M', 'guard'),
(208, 'dsadsaodjsi', 'dimsaoim', 'mdosadm', 703, '2903821903', 'M', 'employee'),
(209, 'Siu', 'mdsao', 'dmsodm', 703, '2903829103', 'M', 'employee'),
(210, 'Manuel', 'fdsfdsfdsf', 'fdsfdsf', 703, '2039890328', 'M', 'employee'),
(211, 'Papaleta', 'Loco', '', 703, '6646939840', 'M', 'employee'),
(212, 'Yuritzia', 'Loco', 'Homeless', 703, '6646939879', 'F', 'employee'),
(213, 'Papaleta', 'Loco', 'Loco', 702, '', 'M', 'supervisor'),
(214, 'Papaleta', 'Loco', 'Yuritzia', 702, '', 'M', 'supervisor'),
(215, 'Pablo', 'Prueba', '', 702, '', 'M', 'supervisor'),
(216, 'Admin', 'supervisor', '', 702, '', 'M', 'supervisor'),
(217, 'mANUEL', 'emperejildo', 'dmsoa', 702, '', 'M', 'supervisor'),
(218, 'dsadsa', 'dsadsa', 'dsad', 702, '', 'M', 'supervisor'),
(219, 'Mamalon', 'dmsao', 'mdsoa', 702, '', 'M', 'supervisor'),
(220, 'Nueva Version', 'Prueba', '', 702, '', 'M', 'supervisor'),
(221, 'Prueba smd', 'omsa', 'sodmad', 701, '2938190328', 'M', 'guard'),
(222, 'Manuel', 'Osuna', 'masni', 701, '9233829380', 'M', 'guard'),
(223, 'Pablo', 'Psaop', 'dsod', 702, '', 'M', 'supervisor');

-- --------------------------------------------------------

--
-- Table structure for table `empleado_acceso`
--

CREATE TABLE `empleado_acceso` (
  `numero` int(11) NOT NULL,
  `id_empleado` int(11) DEFAULT NULL,
  `id_acceso` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `empleado_acceso`
--

INSERT INTO `empleado_acceso` (`numero`, `id_empleado`, `id_acceso`) VALUES
(901, 100, 501),
(902, 107, 502);

-- --------------------------------------------------------

--
-- Table structure for table `guardia_seguridad`
--

CREATE TABLE `guardia_seguridad` (
  `ID` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido_paterno` varchar(255) DEFAULT NULL,
  `apellido_materno` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guardia_seguridad`
--

INSERT INTO `guardia_seguridad` (`ID`, `nombre`, `apellido_paterno`, `apellido_materno`) VALUES
(1, 'Carlos', 'Pérez', 'Hernández'),
(2, 'Ana', 'López', 'García');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `id_empleado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`id`, `correo`, `contrasena`, `id_empleado`) VALUES
(1, 'prueba', 'prueba', 107),
(100, '1', '1', 100),
(101, 'dsaoidsam@gmail.com', 'mdsomda', 109),
(102, 'prueba@gmail.com', 'prueba', 110),
(103, 'Mskdk@gmail.com', 'pruebamovil', 111),
(104, 'manuos@msdo.com', 'somdsa', 112),
(105, 'Dlflld', 'dldk', 113),
(106, 'msoad', 'mos', 114),
(107, 'MDOD', 'ODSMDO', 115),
(108, 'mos', 'mods', 116),
(109, 'dsa', 'dsa', 117),
(110, 'sdsa', 'sa', 118),
(111, 'dsadsad', 'sada', 119),
(112, 'dsd', 'dsa', 120),
(113, 'sdsad', 'sda', 121),
(114, 'momsodmsa', 'dmsaomsa', 122),
(115, 'MDOSADMO', 'MSAOD', 123),
(116, 'DSADS', 'DSA', 124),
(117, 'dsa', 'dsa', 125),
(118, 'Flflflfl', 'flflflt', 126),
(119, 'Clflflf', 'clxlkfl', 127),
(120, 'sdsadas', 'sadsadasd', 128),
(121, 'sadsads', 'dsadas', 129),
(122, 'Flflflfl', 'flflffl', 130),
(123, 'DSDA', 'DSAD', 131),
(124, 'dsadsad', 'dsadd', 132),
(125, 'Flflfl', 'flflf', 133),
(126, 'sdsada', 'dsad', 134),
(127, 'Fkfkfk', 'dlfl', 135),
(128, 'Fllf', 'kxdkdk', 136),
(129, 'DSKDMO', 'DMSOADM', 137),
(130, 'sda', 'sda', 138),
(131, 'Gglgl', 'flflfl', 139),
(132, 'Flfl', 'flfl', 140),
(133, 'dsad', 'ds', 141),
(134, 'Fflflfl', 'xlfkf', 142),
(135, 'Flflfl', 'flfl', 143),
(136, 'DMSAODM', 'DMSAO', 144),
(137, 'Flflflf', 'dlflfl', 145),
(138, 'sd', 'dsada', 146),
(139, 'Dqd', 'bfqq', 147),
(140, 'sadsa', 'dsadad', 148),
(141, 'Fkfkfk', 'flfl', 149),
(142, 'sadsad', 'dsadsa', 150),
(143, 'Flkfk', 'flfl', 151),
(144, 'sdadsa', 'dsad', 152),
(145, 'dsads', 'dsad', 153),
(146, 'Flfkfk', 'fkfkf', 154),
(147, 'dsadasd', 'dsdsada', 157),
(148, 'dsadsa', 'dsadas', 158),
(149, 'dflfl', 'flflfl', 159),
(150, 'dsad', 'dsa', 160),
(151, 'flfkfk', 'flfkfk', 161),
(152, 'Flflflfl', 'flflfllf', 162),
(153, 'Mdkdldlf@gmail.com', 'lfflf', 163),
(154, 'mdsmo', 'dmosdm', 164),
(155, 's', 'sd', 167),
(156, 'dsadsa', 'dsada', 168),
(157, 'SDA', 'DSA', 169),
(158, 'dsad@g.com', 'sdadsdads', 170),
(159, 'Manuos@outlook.com', 'pacomemo', 171),
(160, 'Sld@gnail.com', 'dldldkkf', 172),
(161, 'Dkfkfkflf@gmail.com', 'dldlflfk', 173),
(162, 'Kkfkf@gmail.comd', 'dkdkfkfkf', 174),
(163, 'Dkfkfkfklf@gmail.com', 'fkfkfkfkdkf', 175),
(164, 'dsad@g.com', 'sadsadasdsa', 176),
(165, 'manuos@dkkfk.com', 'dllddkdkl', 177),
(166, 'Dldll@gmail.com', 'sldldlldld', 178),
(167, 'dff@gnail.com', 'ccvc3333', 179),
(168, 'sldlzldldl@gmail.com', 'dkdkdk122ddd', 187),
(169, 'dldldl@gmail.com', 'dllflfldle', 189),
(170, 'MSAODMSOZ@gmail.com', 'odpsdoksopdksao', 191),
(171, 'manuos@outlook.com', 'Om$blood05', 193),
(172, '90238902@f.com', 'dmsodmds', 194),
(173, 'manuosa@outlook.com', 'sdmaodmaosd', 198),
(174, 'moidwm@dmos.com', '97237077fe30c01ac64101272c051a6006e093b427f8c240f58747b6fee2310f', 199),
(176, 'dsds@gmail.com', '81df941980d67acbdd05251f32593d0107e265956755b0c6a048e07ee518adcb', 204),
(177, 'dmsaodm@gmail.com', '0bf2377e4e52cf4d5e9420e52576c6633de326a681eb27f3142e63336de0c114', 205),
(178, 'dwq@dso.com', '0c65c53893707b3358ff2b95250e7273181f5265b711808435fe8b4dd468e58d', 206),
(179, 'manuos@gmail.com', '690b9f2b2b884115f1b58621857078bb5ec6c73faecc6c5fc66da41a35899037', 213),
(180, 'manuol@gmail.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 214),
(181, 'prueba1@gmail.com', 'ff960cb55673958c594d0daaab1e368651c75c02f9687192a1811e7b180336a7', 215),
(182, 'ewmwoqm@gmail.com', 'ff960cb55673958c594d0daaab1e368651c75c02f9687192a1811e7b180336a7', 216),
(183, 'mdsaodm@gmial.com', 'e1fe6073c5a193ff2e868d5ddec0d74b68d9521351696abb2dc0088379f45131', 217),
(184, 'dsaddsa@ds,.com', 'a15fae9748cd5acedc02ae283b8eb263e1287164dbda2cb3fa51c7a6928c779c', 218),
(185, 'msdaodm@gmail.com', '5a99f193b5bd0cc8b6fb09f07e2a59a075a014bc939ca48359d0748b7f094b18', 219),
(186, 'MDSOADM@gmail.com', '883ec3a09832e2380013a7a846bed19bc2155cd9b9a30aadb2087654192ff4b2', 220),
(187, '923289@gmail.com', '2b5a335c191f3910c0e065de92ef312d6e8001a66f1b05fda903d810bbf2c75d', 223);

-- --------------------------------------------------------

--
-- Table structure for table `log_acceso`
--

CREATE TABLE `log_acceso` (
  `id_registro` int(11) NOT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `detalles` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `log_acceso`
--

INSERT INTO `log_acceso` (`id_registro`, `tipo`, `fecha`, `hora`, `detalles`) VALUES
(301, 'Entrada', '2025-03-17', '08:15:00', 'Acceso autorizado'),
(302, 'Salida', '2025-03-17', '12:10:00', 'Acceso autorizado');

-- --------------------------------------------------------

--
-- Table structure for table `puesto`
--

CREATE TABLE `puesto` (
  `codigo` int(11) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `nombre_puesto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `puesto`
--

INSERT INTO `puesto` (`codigo`, `descripcion`, `nombre_puesto`) VALUES
(701, 'Seguridad en turno', 'Guardia'),
(702, 'Supervisor de seguridad', 'Supervisor'),
(703, 'Empleado general', 'Empleado');

-- --------------------------------------------------------

--
-- Table structure for table `puesto_acceso`
--

CREATE TABLE `puesto_acceso` (
  `codigo` int(11) NOT NULL,
  `nivel_acceso` int(11) DEFAULT NULL,
  `Puesto_codigo` int(11) DEFAULT NULL,
  `Acceso_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `puesto_acceso`
--

INSERT INTO `puesto_acceso` (`codigo`, `nivel_acceso`, `Puesto_codigo`, `Acceso_id`) VALUES
(801, 1, 701, 501),
(802, 2, 702, 502);

-- --------------------------------------------------------

--
-- Table structure for table `reporte`
--

CREATE TABLE `reporte` (
  `id` int(11) NOT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `codigo_ronda` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reporte`
--

INSERT INTO `reporte` (`id`, `tipo`, `fecha`, `codigo_ronda`) VALUES
(1201, 'Ronda Matutina', '2025-03-17', 101),
(1202, 'Ronda Vespertina', '2025-03-17', 102);

-- --------------------------------------------------------

--
-- Table structure for table `reporte_acceso`
--

CREATE TABLE `reporte_acceso` (
  `numero` int(11) NOT NULL,
  `id_reporte` int(11) DEFAULT NULL,
  `id_registro` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reporte_acceso`
--

INSERT INTO `reporte_acceso` (`numero`, `id_reporte`, `id_registro`) VALUES
(1401, 1201, 301),
(1402, 1202, 302);

-- --------------------------------------------------------

--
-- Table structure for table `rfid`
--

CREATE TABLE `rfid` (
  `id_RFID` int(11) NOT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `codigo_rfid` varchar(255) DEFAULT NULL,
  `fecha_registro` date DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `id_empleado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rfid`
--

INSERT INTO `rfid` (`id_RFID`, `estado`, `codigo_rfid`, `fecha_registro`, `tipo`, `id_empleado`) VALUES
(1001, 'Activo', '123ABC', '2025-03-01', 'Empleado', 601),
(1002, 'Activo', '456DEF', '2025-03-02', 'Empleado', 602);

-- --------------------------------------------------------

--
-- Table structure for table `ronda`
--

CREATE TABLE `ronda` (
  `codigo` int(11) NOT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `intervalos` int(11) DEFAULT NULL,
  `codigo_ruta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ronda`
--

INSERT INTO `ronda` (`codigo`, `hora_inicio`, `hora_fin`, `intervalos`, `codigo_ruta`) VALUES
(101, '08:00:00', '12:00:00', 30, 1),
(102, '13:00:00', '17:00:00', 60, 2);

-- --------------------------------------------------------

--
-- Table structure for table `ronda_guardia`
--

CREATE TABLE `ronda_guardia` (
  `numero` int(11) NOT NULL,
  `codigo_ronda` int(11) DEFAULT NULL,
  `id_guardia` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ronda_guardia`
--

INSERT INTO `ronda_guardia` (`numero`, `codigo_ronda`, `id_guardia`) VALUES
(1301, 101, 1),
(1302, 102, 2);

-- --------------------------------------------------------

--
-- Table structure for table `rondinero`
--

CREATE TABLE `rondinero` (
  `ID` int(11) NOT NULL,
  `posicion` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `numero` int(11) DEFAULT NULL,
  `codigo_ruta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ruta`
--

CREATE TABLE `ruta` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `secuencia` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ruta`
--

INSERT INTO `ruta` (`codigo`, `nombre`, `secuencia`) VALUES
(1, 'Ruta Norte', 1),
(2, 'Ruta Sur', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `acceso`
--
ALTER TABLE `acceso`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `id_registro` (`id_registro`),
  ADD KEY `codigo_area` (`codigo_area`);

--
-- Indexes for table `alerta`
--
ALTER TABLE `alerta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_registro` (`id_registro`);

--
-- Indexes for table `area`
--
ALTER TABLE `area`
  ADD PRIMARY KEY (`codigo_area`),
  ADD KEY `codigo_ruta` (`codigo_ruta`);

--
-- Indexes for table `dispositivo`
--
ALTER TABLE `dispositivo`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `codigo_area` (`codigo_area`);

--
-- Indexes for table `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `codigo_puesto` (`codigo_puesto`);

--
-- Indexes for table `empleado_acceso`
--
ALTER TABLE `empleado_acceso`
  ADD PRIMARY KEY (`numero`),
  ADD KEY `id_empleado` (`id_empleado`),
  ADD KEY `id_acceso` (`id_acceso`);

--
-- Indexes for table `guardia_seguridad`
--
ALTER TABLE `guardia_seguridad`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indexes for table `log_acceso`
--
ALTER TABLE `log_acceso`
  ADD PRIMARY KEY (`id_registro`);

--
-- Indexes for table `puesto`
--
ALTER TABLE `puesto`
  ADD PRIMARY KEY (`codigo`);

--
-- Indexes for table `puesto_acceso`
--
ALTER TABLE `puesto_acceso`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `Puesto_codigo` (`Puesto_codigo`),
  ADD KEY `Acceso_id` (`Acceso_id`);

--
-- Indexes for table `reporte`
--
ALTER TABLE `reporte`
  ADD PRIMARY KEY (`id`),
  ADD KEY `codigo_ronda` (`codigo_ronda`);

--
-- Indexes for table `reporte_acceso`
--
ALTER TABLE `reporte_acceso`
  ADD PRIMARY KEY (`numero`),
  ADD KEY `id_reporte` (`id_reporte`),
  ADD KEY `id_registro` (`id_registro`);

--
-- Indexes for table `rfid`
--
ALTER TABLE `rfid`
  ADD PRIMARY KEY (`id_RFID`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indexes for table `ronda`
--
ALTER TABLE `ronda`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `codigo_ruta` (`codigo_ruta`);

--
-- Indexes for table `ronda_guardia`
--
ALTER TABLE `ronda_guardia`
  ADD PRIMARY KEY (`numero`),
  ADD KEY `codigo_ronda` (`codigo_ronda`),
  ADD KEY `id_guardia` (`id_guardia`);

--
-- Indexes for table `rondinero`
--
ALTER TABLE `rondinero`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `codigo_ruta` (`codigo_ruta`);

--
-- Indexes for table `ruta`
--
ALTER TABLE `ruta`
  ADD PRIMARY KEY (`codigo`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `empleado`
--
ALTER TABLE `empleado`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=224;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=188;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `acceso`
--
ALTER TABLE `acceso`
  ADD CONSTRAINT `acceso_ibfk_1` FOREIGN KEY (`id_registro`) REFERENCES `log_acceso` (`id_registro`),
  ADD CONSTRAINT `acceso_ibfk_2` FOREIGN KEY (`codigo_area`) REFERENCES `area` (`codigo_area`);

--
-- Constraints for table `alerta`
--
ALTER TABLE `alerta`
  ADD CONSTRAINT `alerta_ibfk_1` FOREIGN KEY (`id_registro`) REFERENCES `log_acceso` (`id_registro`);

--
-- Constraints for table `area`
--
ALTER TABLE `area`
  ADD CONSTRAINT `area_ibfk_1` FOREIGN KEY (`codigo_ruta`) REFERENCES `ruta` (`codigo`);

--
-- Constraints for table `empleado`
--
ALTER TABLE `empleado`
  ADD CONSTRAINT `empleado_ibfk_1` FOREIGN KEY (`codigo_puesto`) REFERENCES `puesto` (`codigo`);

--
-- Constraints for table `login`
--
ALTER TABLE `login`
  ADD CONSTRAINT `login_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`ID`);

--
-- Constraints for table `puesto_acceso`
--
ALTER TABLE `puesto_acceso`
  ADD CONSTRAINT `puesto_acceso_ibfk_1` FOREIGN KEY (`Puesto_codigo`) REFERENCES `puesto` (`codigo`),
  ADD CONSTRAINT `puesto_acceso_ibfk_2` FOREIGN KEY (`Acceso_id`) REFERENCES `acceso` (`ID`);

--
-- Constraints for table `reporte`
--
ALTER TABLE `reporte`
  ADD CONSTRAINT `reporte_ibfk_1` FOREIGN KEY (`codigo_ronda`) REFERENCES `ronda` (`codigo`);

--
-- Constraints for table `reporte_acceso`
--
ALTER TABLE `reporte_acceso`
  ADD CONSTRAINT `reporte_acceso_ibfk_1` FOREIGN KEY (`id_reporte`) REFERENCES `reporte` (`id`),
  ADD CONSTRAINT `reporte_acceso_ibfk_2` FOREIGN KEY (`id_registro`) REFERENCES `log_acceso` (`id_registro`);

--
-- Constraints for table `ronda`
--
ALTER TABLE `ronda`
  ADD CONSTRAINT `ronda_ibfk_1` FOREIGN KEY (`codigo_ruta`) REFERENCES `ruta` (`codigo`);

--
-- Constraints for table `ronda_guardia`
--
ALTER TABLE `ronda_guardia`
  ADD CONSTRAINT `ronda_guardia_ibfk_1` FOREIGN KEY (`codigo_ronda`) REFERENCES `ronda` (`codigo`),
  ADD CONSTRAINT `ronda_guardia_ibfk_2` FOREIGN KEY (`id_guardia`) REFERENCES `guardia_seguridad` (`ID`);

--
-- Constraints for table `rondinero`
--
ALTER TABLE `rondinero`
  ADD CONSTRAINT `rondinero_ibfk_1` FOREIGN KEY (`codigo_ruta`) REFERENCES `ruta` (`codigo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
