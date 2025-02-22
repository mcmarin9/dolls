-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-02-2025 a las 22:36:08
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dolls_db`
--
CREATE DATABASE IF NOT EXISTS `dolls_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `dolls_db`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dolls`
--

CREATE TABLE `dolls` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `marca_id` int(11) NOT NULL,
  `fabricante_id` int(11) DEFAULT NULL,
  `modelo` varchar(255) NOT NULL,
  `personaje` varchar(255) NOT NULL,
  `anyo` int(11) NOT NULL,
  `estado` enum('guardada','a la venta','vendida','fuera') NOT NULL DEFAULT 'guardada',
  `precio_compra` decimal(10,2) DEFAULT NULL,
  `precio_venta` decimal(10,2) DEFAULT NULL,
  `comentarios` text DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `dolls`
--

INSERT INTO `dolls` (`id`, `nombre`, `marca_id`, `fabricante_id`, `modelo`, `personaje`, `anyo`, `estado`, `precio_compra`, `precio_venta`, `comentarios`, `imagen`, `created_at`) VALUES
(1, 'Evie Neon Lights', 10, 3, 'Neon Lights Ball', 'Evie', 2015, 'vendida', 2.00, 20.00, 'Exclusiva de Toys R Us.', '/uploads/IMG_20240708_114639.jpg', '2025-02-16 18:03:54'),
(2, 'Evie Royal Yacht Ball', 10, 3, 'Royal Yacht Ball', 'Evie', 2016, 'vendida', 2.00, 12.00, NULL, '/uploads/IMG_20240708_114110.jpg', '2025-02-16 18:05:53'),
(3, 'Mal Básica', 10, 3, 'Signature', 'Mal', 2015, 'vendida', 2.00, 7.00, '', '/uploads/IMG_20240708_114904.jpg', '2025-02-16 18:07:48'),
(4, 'Super Girl', 11, 1, 'Básica', 'Super Girl', 2025, 'a la venta', 2.00, NULL, NULL, '/uploads/IMG_20240709_123221_2.jpg', '2025-02-16 18:08:56'),
(5, 'Westley Patines', 7, 1, 'Roller Girls Remote Control', 'Westley / Madison ', 2025, 'a la venta', 4.00, NULL, NULL, '/uploads/IMG_20241102_095731.jpg', '2025-02-16 18:13:11'),
(6, 'Jade', 2, 2, 'Primera Edición', 'Jade', 2025, 'a la venta', 4.00, NULL, 'vendida con cloe basica', '/uploads/IMG_20250111_133822.jpg', '2025-02-16 18:14:55'),
(7, 'Elena de Avalor', 8, 4, 'Básica', 'Elena de Avalor', 2025, 'a la venta', 2.00, NULL, NULL, '/uploads/IMG_20250125_134514.jpg', '2025-02-16 18:17:49'),
(8, 'Barbie Super Negra', 1, 1, 'Fashionista', '#90', 2018, 'guardada', 2.00, NULL, NULL, NULL, '2025-02-16 18:18:23'),
(9, 'Spirit Queen', 3, 2, 'Movie Magic', 'Spirit Queen', 2025, 'vendida', 1.67, 6.00, NULL, '/uploads/IMG_20241102_113241.jpg', '2025-02-16 18:36:50'),
(11, 'Fiat 500', 1, NULL, 'Fiat 500', 'Barbie', 2009, 'a la venta', 1.67, NULL, NULL, '/uploads/IMG_20241102_113509.jpg', '2025-02-16 18:47:07'),
(12, 'Rayla Leona', 1, NULL, 'La magia de Pegaso', 'Rayla Reina de las Nubes', 2025, 'vendida', 1.50, 3.50, 'vendida con cara sapo', '/uploads/IMG_20241116_102839.jpg', '2025-02-16 19:19:00'),
(13, 'Fake', 14, NULL, 'Fake', 'Fake', 2025, 'fuera', 1.50, NULL, 'Comprada por la ropa', NULL, '2025-02-16 19:26:48'),
(14, 'Cloe Disaster', 2, NULL, 'Básica', 'Cloe', 2025, 'vendida', 3.00, 2.50, NULL, '/uploads/IMG_20241012_124726.jpg', '2025-02-16 19:29:24'),
(15, 'Yasmin Articulada', 2, NULL, 'The Movie', 'Yasmin', 2007, 'guardada', 1.33, NULL, NULL, NULL, '2025-02-16 19:30:44'),
(16, 'Sasha Manca', 2, NULL, 'The Movie', 'Sasha', 2007, 'a la venta', 1.33, NULL, 'vendida con jade articulada', '/uploads/IMG_20241221_114222.jpg', '2025-02-16 19:31:56'),
(17, 'Teresa Sapo', 1, NULL, 'My House', 'Teresa', 2008, 'vendida', 1.33, 3.50, NULL, '/uploads/IMG_20241116_102753.jpg', '2025-02-16 19:33:13'),
(18, 'Coche', 2, NULL, 'Rock Angels', 'Coche', 2025, 'guardada', 6.00, NULL, NULL, NULL, '2025-02-16 19:38:24'),
(19, 'Maletín Blancanieves', 8, NULL, 'Mini Animators', 'Blancanieves', 2025, 'guardada', NULL, NULL, NULL, NULL, '2025-02-16 19:39:03'),
(20, 'Yasmin la guapa', 2, NULL, 'Magic Hair', 'Yasmin', 2007, 'guardada', 1.67, NULL, NULL, NULL, '2025-02-16 19:40:48'),
(21, 'Midge anillo', 1, NULL, 'Happy Family', 'Midge', 2003, 'vendida', 1.67, 8.00, NULL, '/uploads/IMG_20241103_152330.jpg', '2025-02-16 19:42:11'),
(22, 'Teresa la guapa', 1, NULL, 'Fashion Fever', 'Teresa', 2004, 'vendida', 1.67, 13.00, NULL, '/uploads/IMG_20241109_102426.jpg', '2025-02-16 19:43:24'),
(23, 'Sasha Básica', 2, NULL, 'Primera Edición', 'Sasha', 2001, 'guardada', 1.25, NULL, NULL, NULL, '2025-02-17 18:39:25'),
(24, 'Jade Básica', 2, NULL, 'Primera Edición', 'Jade', 2001, 'guardada', 1.25, NULL, 'Pelo más marrón que negro', NULL, '2025-02-17 18:40:33'),
(25, 'Yasmin Ojos azules', 2, NULL, 'Strut It', 'Yasmin', 2003, 'guardada', 1.25, NULL, NULL, NULL, '2025-02-17 18:42:52'),
(26, 'Cloe Mechas rosas', 2, NULL, 'Snow Kissed', 'Cloe', 2015, 'a la venta', 1.25, NULL, NULL, '/uploads/IMG_20241020_125347.jpg', '2025-02-17 18:44:51'),
(27, 'Barbie fea', 1, NULL, 'Rollerblade', 'Barbie', 1995, 'vendida', 1.00, 7.00, NULL, '/uploads/IMG_20240709_124103.jpg', '2025-02-17 19:00:25'),
(28, 'Barbie con venecia', 1, NULL, 'Special Expressions (USA) / Style Barbie (Europe)', 'Barbie', 1993, 'vendida', 1.00, 8.00, 'Con vestido de Venecia', '/uploads/IMG_20240709_124225.jpg', '2025-02-17 19:02:55'),
(29, 'Barbie vintage monísima', 1, NULL, 'Veterinaria', 'Barbie', 199, 'guardada', 1.00, NULL, 'la primera vintage pa mi, con el vestido ruso', NULL, '2025-02-17 19:04:08'),
(30, 'Barbie pelo corto', 1, NULL, 'Fashion Style & Friendship', 'Barbie', 2008, 'a la venta', 1.50, NULL, 'El pantalón es oficial de Barbie School Cool de 1999 y la camiseta de Barbie Baywatch / Salvavidas de 1994.', '/uploads/IMG_20241201_112448.jpg', '2025-02-17 19:06:42'),
(31, 'Teresa pelo corto', 1, NULL, 'Chic', 'Teresa', 2008, 'a la venta', 1.50, NULL, 'La ropa chaqueta y falda son oficiales de Barbie Chair Flair de 2002.\r\n', '/uploads/IMG_20241116_103300.jpg', '2025-02-17 19:07:23'),
(32, 'Christie', 1, NULL, 'Really Rosy', 'Christie', 2004, 'a la venta', 2.00, NULL, NULL, '/uploads/IMG_20241123_152422.jpg', '2025-02-17 19:09:21'),
(33, 'Yasmin Hippie', 2, NULL, 'Hippie Chic', 'Yasmin', 2003, 'a la venta', 2.00, NULL, NULL, '/uploads/IMG_20241123_152548.jpg', '2025-02-17 19:11:24'),
(34, 'Blossom que no es Blossom', 1, 1, 'Foam \'n Color', 'Barbie', 1996, 'a la venta', 2.50, NULL, 'El vestido es de Barbie Blossom Beauty de 1996. La de la cara picada.\r\n', '/uploads/IMG_20241201_112853.jpg', '2025-02-17 19:14:47'),
(35, 'Elina', 1, NULL, 'Fairytopia Mermaidia', 'Elina', 2006, 'a la venta', 2.50, NULL, 'Ala rota', '/uploads/IMG_20241116_103908.jpg', '2025-02-17 19:19:06'),
(36, 'Sunburst', 1, NULL, 'Fairytopia Magia del Arco Iris', 'Sunburst', 2007, 'a la venta', 2.50, NULL, NULL, '/uploads/IMG_20241116_104123.jpg', '2025-02-17 19:20:37'),
(37, 'Glitter Swirl', 1, NULL, 'Fairytopia Mermaidia', 'Glitter Swirl', 2006, 'a la venta', 2.50, NULL, 'Descabezada. Alas con el líquido podrido. (añadir comentarios a lote: incluia vestido princesa azul gigante)', '/uploads/IMG_20241116_104338.jpg', '2025-02-17 19:23:59'),
(38, 'Cutie Panda', 1, NULL, 'Cutie Reveal Panda', 'Panda', 2022, 'vendida', 1.50, 6.00, NULL, '/uploads/IMG_20241124_130915.jpg', '2025-02-17 19:26:36'),
(39, 'Millie Básica Articulada', 1, NULL, 'Millie general', 'Barbie', 2025, 'a la venta', 1.50, NULL, 'El vestido es de Barbie Flower Fun de 1996.', '/uploads/1733594541.jpeg', '2025-02-17 19:28:16'),
(40, 'LOL Negra Afro', 3, NULL, 'Movie Magic Studios', 'Agent Soul', 2021, 'guardada', 2.00, NULL, NULL, NULL, '2025-02-20 19:00:19'),
(41, 'Mini Lol Rubia', 4, NULL, 'Serie 2', 'Goldie Twist', 2022, 'guardada', 3.00, NULL, NULL, NULL, '2025-02-20 19:01:55'),
(42, 'Troglodita Rosa', 12, NULL, 'Signature', 'Emberly', 2020, 'guardada', 1.50, NULL, NULL, NULL, '2025-02-20 19:03:55'),
(43, 'Troglodita Azul', 12, NULL, 'Signature', 'Tella', 2020, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 19:04:36'),
(44, 'Troglodita Chico', 12, NULL, 'Signature', 'Slate', 2020, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 19:05:14'),
(46, 'Spectra', 6, NULL, 'School\'s Out / Signature', 'Spectra Vondergeist', 2025, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 19:12:35'),
(47, 'California', 1, NULL, 'California Girl', 'Barbie', 2005, 'guardada', 2.00, NULL, 'No sabemos el modelo exacto', NULL, '2025-02-20 19:15:52'),
(48, 'Bratz Tuerto', 2, NULL, 'On the Mic', 'Eitan', 2011, 'vendida', 1.00, NULL, NULL, '/uploads/IMG_20241223_133758.jpg', '2025-02-20 19:18:43'),
(49, 'Yasmin Rock Angelz', 2, NULL, 'Rock Angelz', 'Yasmin', 2005, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 19:20:05'),
(50, 'Barbie Guapa de rosa', 1, NULL, 'Fashion Fever Hair Hightlights', 'Barbie', 2006, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 19:23:09'),
(51, 'Poppy', 5, NULL, 'Serie 1', 'Poppy Rowan', 2020, 'guardada', 3.00, NULL, 'La manca', NULL, '2025-02-20 19:24:26'),
(52, 'Teresa Burbujas', 1, NULL, 'Burbujas / Bubble Fairy', 'Teresa', 1998, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 19:26:09'),
(53, 'Barbie \"Patinadora\"', 1, NULL, 'Tahiti', 'Barbie', 1992, 'guardada', 1.00, NULL, 'Traje del Aliexpress.', NULL, '2025-02-20 19:30:08'),
(54, 'Super Negra con Vestido', 1, NULL, 'Fashionista', '#90', 2018, 'a la venta', 1.00, NULL, NULL, '/uploads/IMG_20250126_120722.jpg', '2025-02-20 19:56:55'),
(55, 'Jade', 2, NULL, 'Primera Edición', 'Jade', 2001, 'a la venta', 5.00, NULL, NULL, NULL, '2025-02-22 10:28:35'),
(56, 'Chelsea Articulada', 7, 1, 'Vespa', 'Chelsea', 2003, 'vendida', 5.00, 9.00, NULL, '/uploads/1731752320.jpeg', '2025-02-22 10:31:00'),
(57, 'Barbie Ojos Lilas', 1, 1, 'Sweet Treats', 'Barbie', 1999, 'a la venta', 1.00, NULL, NULL, '/uploads/1730833378.jpeg', '2025-02-22 10:32:18'),
(58, 'Barbie Ojos Verdes', 1, 1, 'Krissy Bedtime Baby', 'Barbie', 2000, 'a la venta', 1.00, NULL, NULL, '/uploads/1732994592.jpeg', '2025-02-22 10:33:29'),
(59, 'Blancanieves Baño + Vestido', 8, 5, 'Bath Time + Disney Store', 'Blancanieves', 2025, 'a la venta', 3.00, NULL, 'Muñeca de Simba y vestido sin identificar de la Disney Store.', NULL, '2025-02-22 10:35:15'),
(60, 'Hannah Montana Primera', 14, 1, 'Ropa azul', 'Hannah Montana', 2008, 'a la venta', 1.00, NULL, 'Pelo suave y cinturon', '/uploads/1731144979.jpeg', '2025-02-22 10:38:57'),
(61, 'Hada Mia', 14, 1, 'Mia y Yo', 'Mia', 2012, 'vendida', 1.00, 5.00, NULL, '/uploads/i5228697931.jpg', '2025-02-22 11:02:59'),
(62, 'Cloe pirata', 2, 2, 'Treasures', 'Cloe', 2005, 'vendida', 1.00, 2.50, NULL, '/uploads/i5311603151.jpg', '2025-02-22 11:13:28'),
(64, 'Bratz Babyz Krysta', 2, 2, 'Babyz Twiins Krysta y Lela', 'Krysta', 2006, 'a la venta', 1.00, NULL, NULL, '/uploads/1728845979.jpeg', '2025-02-22 16:00:34'),
(65, 'Barbie negra con mechas', 1, 1, 'Totally Hair', 'Negra', 2022, 'vendida', 2.00, 5.23, NULL, '/uploads/1731847646.jpeg', '2025-02-22 21:10:06'),
(66, 'Barbie pelo azul y rosa con calva', 1, 1, 'Barbie Unicorn Mermaid Hair', 'Barbie', 2023, 'vendida', 2.00, 5.23, 'Comprada con vestido de Frozen, vendido después por 5 euros', '/uploads/1728158287.jpeg', '2025-02-22 21:15:26'),
(67, 'Barbie Yoga moño', 1, 1, 'Yoga', 'Latina', 2018, 'vendida', 1.00, 17.00, 'Cuerpo Made to Move', '/uploads/1731148755.jpeg', '2025-02-22 21:20:11'),
(68, 'Sirena super pelona', 1, 1, 'Jewel Hair Mermaid', 'Barbie', 1995, 'a la venta', 3.00, NULL, NULL, '/uploads/1732992322.jpeg', '2025-02-22 21:25:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fabricantes`
--

CREATE TABLE `fabricantes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `fabricantes`
--

INSERT INTO `fabricantes` (`id`, `nombre`, `created_at`) VALUES
(1, 'Mattel', '2025-02-22 13:14:57'),
(2, 'MGA Entertainment', '2025-02-22 13:14:57'),
(3, 'Hasbro', '2025-02-22 13:14:57'),
(4, 'Disney Store', '2025-02-22 13:14:57'),
(5, 'Simba', '2025-02-22 13:14:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lotes`
--

CREATE TABLE `lotes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `tipo` enum('compra','venta') NOT NULL,
  `precio_total` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lotes`
--

INSERT INTO `lotes` (`id`, `nombre`, `tipo`, `precio_total`, `created_at`) VALUES
(1, 'Jade y Patines', 'compra', 8.00, '2025-02-16 18:15:36'),
(2, 'Elena y Super Negra', 'compra', 4.00, '2025-02-16 18:19:20'),
(3, 'LOL y 2 Barbies', 'compra', 5.00, '2025-02-16 18:47:46'),
(4, 'Descendientes y Super', 'compra', 8.00, '2025-02-16 18:58:29'),
(5, 'Rayla y Fake', 'compra', 3.00, '2025-02-16 19:27:14'),
(6, 'Feas', 'venta', 7.00, '2025-02-16 19:33:41'),
(7, 'Bratz Movie y Cara Sapo', 'compra', 4.00, '2025-02-16 19:34:16'),
(8, 'Las niñas', 'compra', 5.00, '2025-02-16 19:44:05'),
(9, 'Bratz una de cada', 'compra', 5.00, '2025-02-17 18:45:22'),
(10, 'Barbie vintages', 'compra', 3.00, '2025-02-17 19:04:43'),
(11, 'Pelos cortos', 'compra', 3.00, '2025-02-17 19:07:42'),
(12, 'Christie y Yasmin', 'compra', 4.00, '2025-02-17 19:11:50'),
(13, 'Maldito', 'compra', 10.00, '2025-02-17 19:24:28'),
(14, 'Barbie Modernas', 'compra', 3.00, '2025-02-17 19:28:39'),
(15, 'Cloes cochambre', 'venta', 5.00, '2025-02-22 19:53:55'),
(16, 'Barbie mechas', 'venta', 10.45, '2025-02-22 21:16:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lote_doll`
--

CREATE TABLE `lote_doll` (
  `id` int(11) NOT NULL,
  `lote_id` int(11) NOT NULL,
  `doll_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lote_doll`
--

INSERT INTO `lote_doll` (`id`, `lote_id`, `doll_id`) VALUES
(10, 4, 1),
(11, 4, 2),
(12, 4, 3),
(13, 4, 4),
(1, 1, 5),
(2, 1, 6),
(3, 2, 7),
(4, 2, 8),
(9, 3, 9),
(8, 3, 11),
(14, 5, 12),
(16, 6, 12),
(15, 5, 13),
(42, 15, 14),
(18, 7, 15),
(19, 7, 16),
(17, 6, 17),
(20, 7, 17),
(21, 8, 20),
(22, 8, 21),
(23, 8, 22),
(24, 9, 23),
(25, 9, 24),
(26, 9, 25),
(27, 9, 26),
(28, 10, 27),
(29, 10, 28),
(30, 10, 29),
(31, 11, 30),
(32, 11, 31),
(33, 12, 32),
(34, 12, 33),
(35, 13, 34),
(36, 13, 35),
(37, 13, 36),
(38, 13, 37),
(39, 14, 38),
(40, 14, 39),
(41, 15, 62),
(44, 16, 65),
(43, 16, 66);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `marca`
--

INSERT INTO `marca` (`id`, `nombre`, `created_at`) VALUES
(1, 'Barbie', '2025-02-22 13:14:57'),
(2, 'Bratz', '2025-02-22 13:14:57'),
(3, 'LOL OMG', '2025-02-22 13:14:57'),
(4, 'LOL Tweens', '2025-02-22 13:14:57'),
(5, 'Rainbow High', '2025-02-22 13:14:57'),
(6, 'Monster High', '2025-02-22 13:14:57'),
(7, 'MyScene', '2025-02-22 13:14:57'),
(8, 'Disney', '2025-02-22 13:14:57'),
(9, 'Ever After High', '2025-02-22 13:14:57'),
(10, 'Descendientes', '2025-02-22 13:14:57'),
(11, 'DC Super Hero Girls', '2025-02-22 13:14:57'),
(12, 'Cave Club', '2025-02-22 13:14:57'),
(13, 'Simba', '2025-02-22 13:14:57'),
(14, 'Otros', '2025-02-22 14:59:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca_fabricante`
--

CREATE TABLE `marca_fabricante` (
  `marca_id` int(11) NOT NULL,
  `fabricante_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `marca_fabricante`
--

INSERT INTO `marca_fabricante` (`marca_id`, `fabricante_id`) VALUES
(1, 1),
(2, 2),
(3, 2),
(4, 2),
(5, 2),
(6, 1),
(7, 1),
(8, 1),
(8, 4),
(8, 5),
(9, 1),
(10, 1),
(10, 3),
(11, 1),
(12, 1),
(14, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `dolls`
--
ALTER TABLE `dolls`
  ADD PRIMARY KEY (`id`),
  ADD KEY `marca_id` (`marca_id`),
  ADD KEY `fabricante_id` (`fabricante_id`);

--
-- Indices de la tabla `fabricantes`
--
ALTER TABLE `fabricantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `lotes`
--
ALTER TABLE `lotes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `lote_doll`
--
ALTER TABLE `lote_doll`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_doll_lote` (`doll_id`,`lote_id`),
  ADD KEY `lote_id` (`lote_id`);

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `marca_fabricante`
--
ALTER TABLE `marca_fabricante`
  ADD PRIMARY KEY (`marca_id`,`fabricante_id`),
  ADD KEY `fabricante_id` (`fabricante_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `dolls`
--
ALTER TABLE `dolls`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT de la tabla `fabricantes`
--
ALTER TABLE `fabricantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `lotes`
--
ALTER TABLE `lotes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `lote_doll`
--
ALTER TABLE `lote_doll`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `dolls`
--
ALTER TABLE `dolls`
  ADD CONSTRAINT `dolls_ibfk_1` FOREIGN KEY (`marca_id`) REFERENCES `marca` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `dolls_ibfk_2` FOREIGN KEY (`fabricante_id`) REFERENCES `fabricantes` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `lote_doll`
--
ALTER TABLE `lote_doll`
  ADD CONSTRAINT `lote_doll_ibfk_1` FOREIGN KEY (`lote_id`) REFERENCES `lotes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `lote_doll_ibfk_2` FOREIGN KEY (`doll_id`) REFERENCES `dolls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `marca_fabricante`
--
ALTER TABLE `marca_fabricante`
  ADD CONSTRAINT `marca_fabricante_ibfk_1` FOREIGN KEY (`marca_id`) REFERENCES `marca` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `marca_fabricante_ibfk_2` FOREIGN KEY (`fabricante_id`) REFERENCES `fabricantes` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
