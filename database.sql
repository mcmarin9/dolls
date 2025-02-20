-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-02-2025 a las 22:20:37
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dolls`
--

CREATE TABLE `dolls` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `marca_id` int(11) NOT NULL,
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

INSERT INTO `dolls` (`id`, `nombre`, `marca_id`, `modelo`, `personaje`, `anyo`, `estado`, `precio_compra`, `precio_venta`, `comentarios`, `imagen`, `created_at`) VALUES
(1, 'Evie Neon Lights', 7, 'Neon Lights Ball', 'Evie', 2015, 'vendida', 2.00, 20.00, 'Exclusiva de Toys R Us.', '/uploads/IMG_20240708_114639.jpg', '2025-02-16 19:03:54'),
(2, 'Evie Royal Yacht Ball', 7, 'Royal Yacht Ball', 'Evie', 2016, 'vendida', 2.00, 12.00, NULL, '/uploads/IMG_20240708_114110.jpg', '2025-02-16 19:05:53'),
(3, 'Mal Básica', 7, 'Signature', 'Mal', 2015, 'vendida', 2.00, 7.00, NULL, '/uploads/IMG_20240708_114904.jpg', '2025-02-16 19:07:48'),
(4, 'Super Girl', 8, 'Básica', 'Super Girl', 2025, 'a la venta', 2.00, NULL, NULL, '/uploads/IMG_20240709_123221_2.jpg', '2025-02-16 19:08:56'),
(5, 'Westley Patines', 9, 'Roller Girls Remote Control', 'Westley / Madison ', 2025, 'a la venta', 4.00, NULL, NULL, '/uploads/IMG_20241102_095731.jpg', '2025-02-16 19:13:11'),
(6, 'Jade', 1, 'Primera Edición', 'Jade', 2025, 'a la venta', 4.00, NULL, 'vendida con cloe basica', '/uploads/IMG_20250111_133822.jpg', '2025-02-16 19:14:55'),
(7, 'Elena de Avalor', 10, 'Básica', 'Elena de Avalor', 2025, 'a la venta', 2.00, NULL, NULL, '/uploads/IMG_20250125_134514.jpg', '2025-02-16 19:17:49'),
(8, 'Barbie Super Negra', 1, 'Fashionista', '#90', 2018, 'guardada', 2.00, NULL, NULL, NULL, '2025-02-16 19:18:23'),
(9, 'Spirit Queen', 5, 'Movie Magic', 'Spirit Queen', 2025, 'vendida', 1.67, 6.00, NULL, '/uploads/IMG_20241102_113241.jpg', '2025-02-16 19:36:50'),
(10, 'Super Pelo Burdeos', 1, 'EXTRA', '#17', 2025, 'guardada', 1.67, NULL, NULL, NULL, '2025-02-16 19:45:39'),
(11, 'Fiat 500', 1, 'Fiat 500', 'Barbie', 2009, 'a la venta', 1.67, NULL, NULL, '/uploads/IMG_20241102_113509.jpg', '2025-02-16 19:47:07'),
(12, 'Rayla Leona', 1, 'La magia de Pegaso', 'Rayla Reina de las Nubes', 2025, 'vendida', 1.50, 3.50, 'vendida con cara sapo', '/uploads/IMG_20241116_102839.jpg', '2025-02-16 20:19:00'),
(13, 'Fake', 11, 'Fake', 'Fake', 2025, 'fuera', 1.50, NULL, 'Comprada por la ropa', NULL, '2025-02-16 20:26:48'),
(14, 'Cloe Disaster', 4, 'Básica', 'Cloe', 2025, 'vendida', 3.00, NULL, 'vendida con cloe pirata', '/uploads/IMG_20241012_124726.jpg', '2025-02-16 20:29:24'),
(15, 'Yasmin Articulada', 4, 'The Movie', 'Yasmin', 2007, 'guardada', 1.33, NULL, NULL, NULL, '2025-02-16 20:30:44'),
(16, 'Sasha Manca', 4, 'The Movie', 'Sasha', 2007, 'a la venta', 1.33, NULL, 'vendida con jade articulada', '/uploads/IMG_20241221_114222.jpg', '2025-02-16 20:31:56'),
(17, 'Teresa Sapo', 1, 'My House', 'Teresa', 2008, 'vendida', 1.33, 3.50, NULL, '/uploads/IMG_20241116_102753.jpg', '2025-02-16 20:33:13'),
(18, 'Coche', 4, 'Rock Angels', 'Coche', 2025, 'guardada', 6.00, NULL, NULL, NULL, '2025-02-16 20:38:24'),
(19, 'Maletín Blancanieves', 10, 'Mini Animators', 'Blancanieves', 2025, 'guardada', NULL, NULL, NULL, NULL, '2025-02-16 20:39:03'),
(20, 'Yasmin la guapa', 4, 'Magic Hair', 'Yasmin', 2007, 'guardada', 1.67, NULL, NULL, NULL, '2025-02-16 20:40:48'),
(21, 'Midge anillo', 1, 'Happy Family', 'Midge', 2003, 'vendida', 1.67, 8.00, NULL, '/uploads/IMG_20241103_152330.jpg', '2025-02-16 20:42:11'),
(22, 'Teresa la guapa', 1, 'Fashion Fever', 'Teresa', 2004, 'vendida', 1.67, 13.00, NULL, '/uploads/IMG_20241109_102426.jpg', '2025-02-16 20:43:24'),
(23, 'Sasha Básica', 4, 'Primera Edición', 'Sasha', 2001, 'guardada', 1.25, NULL, NULL, NULL, '2025-02-17 19:39:25'),
(24, 'Jade Básica', 4, 'Primera Edición', 'Jade', 2001, 'guardada', 1.25, NULL, 'Pelo más marrón que negro', NULL, '2025-02-17 19:40:33'),
(25, 'Yasmin Ojos azules', 4, 'Strut It', 'Yasmin', 2003, 'guardada', 1.25, NULL, NULL, NULL, '2025-02-17 19:42:52'),
(26, 'Cloe Mechas rosas', 4, 'Snow Kissed', 'Cloe', 2015, 'a la venta', 1.25, NULL, NULL, '/uploads/IMG_20241020_125347.jpg', '2025-02-17 19:44:51'),
(27, 'Barbie fea', 1, 'Rollerblade', 'Barbie', 1995, 'vendida', 1.00, 7.00, NULL, '/uploads/IMG_20240709_124103.jpg', '2025-02-17 20:00:25'),
(28, 'Barbie con venecia', 1, 'Special Expressions (USA) / Style Barbie (Europe)', 'Barbie', 1993, 'vendida', 1.00, NULL, 'Con vestido de Venecia', '/uploads/IMG_20240709_124225.jpg', '2025-02-17 20:02:55'),
(29, 'Barbie vintage monísima', 1, 'Veterinaria', 'Barbie', 199, 'guardada', 1.00, NULL, 'la primera vintage pa mi, con el vestido ruso', NULL, '2025-02-17 20:04:08'),
(30, 'Barbie pelo corto', 1, 'Fashion Style & Friendship', 'Barbie', 2008, 'a la venta', 1.50, NULL, 'El pantalón es oficial de Barbie School Cool de 1999 y la camiseta de Barbie Baywatch / Salvavidas de 1994.', '/uploads/IMG_20241201_112448.jpg', '2025-02-17 20:06:42'),
(31, 'Teresa pelo corto', 1, 'Chic', 'Teresa', 2008, 'a la venta', 1.50, NULL, 'La ropa chaqueta y falda son oficiales de Barbie Chair Flair de 2002.\r\n', '/uploads/IMG_20241116_103300.jpg', '2025-02-17 20:07:23'),
(32, 'Christie', 1, 'Really Rosy', 'Christie', 2004, 'a la venta', 2.00, NULL, NULL, '/uploads/IMG_20241123_152422.jpg', '2025-02-17 20:09:21'),
(33, 'Yasmin Hippie', 4, 'Hippie Chic', 'Yasmin', 2003, 'a la venta', 2.00, NULL, NULL, '/uploads/IMG_20241123_152548.jpg', '2025-02-17 20:11:24'),
(34, 'Blossom que no es Blossom', 1, 'Foam \'n Color', 'Barbie', 1996, 'a la venta', 2.50, NULL, 'El vestido es de Barbie Blossom Beauty de 1996. La de la cara picada.\r\n', '/uploads/IMG_20241201_112853.jpg', '2025-02-17 20:14:47'),
(35, 'Elina', 1, 'Fairytopia Mermaidia', 'Elina', 2006, 'a la venta', 2.50, NULL, 'Ala rota', '/uploads/IMG_20241116_103908.jpg', '2025-02-17 20:19:06'),
(36, 'Sunburst', 1, 'Fairytopia Magia del Arco Iris', 'Sunburst', 2007, 'a la venta', 2.50, NULL, NULL, '/uploads/IMG_20241116_104123.jpg', '2025-02-17 20:20:37'),
(37, 'Glitter Swirl', 1, 'Fairytopia Mermaidia', 'Glitter Swirl', 2006, 'a la venta', 2.50, NULL, 'Descabezada. Alas con el líquido podrido. (añadir comentarios a lote: incluia vestido princesa azul gigante)', '/uploads/IMG_20241116_104338.jpg', '2025-02-17 20:23:59'),
(38, 'Cutie Panda', 1, 'Cutie Reveal Panda', 'Panda', 2022, 'vendida', 1.50, 6.00, NULL, '/uploads/IMG_20241124_130915.jpg', '2025-02-17 20:26:36'),
(39, 'Millie Básica Articulada', 1, 'Millie general', 'Barbie', 2025, 'a la venta', 1.50, NULL, 'El vestido es de Barbie Flower Fun de 1996.', '/uploads/1733594541.jpeg', '2025-02-17 20:28:16'),
(40, 'LOL Negra Afro', 5, 'Movie Magic Studios', 'Agent Soul', 2021, 'guardada', 2.00, NULL, NULL, NULL, '2025-02-20 20:00:19'),
(41, 'Mini Lol Rubia', 12, 'Serie 2', 'Goldie Twist', 2022, 'guardada', 3.00, NULL, NULL, NULL, '2025-02-20 20:01:55'),
(42, 'Troglodita Rosa', 13, 'Signature', 'Emberly', 2020, 'guardada', 1.50, NULL, NULL, NULL, '2025-02-20 20:03:55'),
(43, 'Troglodita Azul', 13, 'Signature', 'Tella', 2020, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 20:04:36'),
(44, 'Troglodita Chico', 13, 'Signature', 'Slate', 2020, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 20:05:14'),
(45, 'Anna', 10, 'Anna Básica', 'Anna', 2025, 'guardada', 2.00, NULL, NULL, NULL, '2025-02-20 20:06:08'),
(46, 'Spectra', 2, 'Ghouls Alive ?', 'Spectra Vondergeist', 2025, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 20:12:35'),
(47, 'California', 1, 'Pendiente', 'Barbie', 2025, 'guardada', 2.00, NULL, NULL, NULL, '2025-02-20 20:15:52'),
(48, 'Bratz Tuerto', 4, 'On the Mic', 'Eitan', 2011, 'vendida', 1.00, NULL, NULL, '/uploads/IMG_20241223_133758.jpg', '2025-02-20 20:18:43'),
(49, 'Yasmin Rock Angelz', 4, 'Rock Angelz', 'Yasmin', 2005, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 20:20:05'),
(50, 'Barbie Guapa de rosa', 1, 'Fashion Fever Hair Hightlights', 'Barbie', 2006, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 20:23:09'),
(51, 'Poppy', 6, 'Serie 1', 'Poppy Rowan', 2020, 'guardada', 3.00, NULL, 'La manca', NULL, '2025-02-20 20:24:26'),
(52, 'Teresa Burbujas', 1, 'Burbujas / Bubble Fairy', 'Teresa', 1998, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 20:26:09'),
(53, 'Barbie \"Patinadora\"', 1, '??', 'Barbie', 2025, 'guardada', 1.00, NULL, 'Traje del Aliexpress.', NULL, '2025-02-20 20:30:08'),
(54, 'Super Negra con Vestido', 1, 'Fashionista', '#90', 2018, 'a la venta', 1.00, NULL, NULL, '/uploads/IMG_20250126_120722.jpg', '2025-02-20 20:56:55');

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
(1, 'Jade y Patines', 'compra', 8.00, '2025-02-16 19:15:36'),
(2, 'Elena y Super Negra', 'compra', 4.00, '2025-02-16 19:19:20'),
(3, 'LOL y 2 Barbies', 'compra', 5.00, '2025-02-16 19:47:46'),
(4, 'Descendientes y Super', 'compra', 8.00, '2025-02-16 19:58:29'),
(5, 'Rayla y Fake', 'compra', 3.00, '2025-02-16 20:27:14'),
(6, 'Feas', 'venta', 7.00, '2025-02-16 20:33:41'),
(7, 'Bratz Movie y Cara Sapo', 'compra', 4.00, '2025-02-16 20:34:16'),
(8, 'Las niñas', 'compra', 5.00, '2025-02-16 20:44:05'),
(9, 'Bratz una de cada', 'compra', 5.00, '2025-02-17 19:45:22'),
(10, 'Barbie vintages', 'compra', 3.00, '2025-02-17 20:04:43'),
(11, 'Pelos cortos', 'compra', 3.00, '2025-02-17 20:07:42'),
(12, 'Christie y Yasmin', 'compra', 4.00, '2025-02-17 20:11:50'),
(13, 'Maldito', 'compra', 10.00, '2025-02-17 20:24:28'),
(14, 'Barbie Modernas', 'compra', 3.00, '2025-02-17 20:28:39');

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
(7, 3, 10),
(8, 3, 11),
(14, 5, 12),
(16, 6, 12),
(15, 5, 13),
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
(40, 14, 39);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `fabricante` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `marca`
--

INSERT INTO `marca` (`id`, `nombre`, `fabricante`, `created_at`) VALUES
(1, 'Barbie', 'Mattel', '2025-02-16 19:00:59'),
(2, 'Monster High', 'Mattel', '2025-02-16 19:00:59'),
(3, 'Ever After High', 'Mattel', '2025-02-16 19:00:59'),
(4, 'Bratz', 'MGA Entertainment', '2025-02-16 19:00:59'),
(5, 'LOL OMG', 'MGA Entertainment', '2025-02-16 19:00:59'),
(6, 'Rainbow High', 'MGA Entertainment', '2025-02-16 19:00:59'),
(7, 'Descendientes', 'Hasbro', '2025-02-16 19:02:25'),
(8, 'DC Super Hero Girls', 'Mattel', '2025-02-16 19:08:20'),
(9, 'MyScene', 'Mattel', '2025-02-16 19:12:01'),
(10, 'Disney Store', 'Disney', '2025-02-16 19:17:07'),
(11, 'NiSu', 'Ni su madre las conoce', '2025-02-16 20:21:57'),
(12, 'LOL Tweens', 'MGA Entertainment', '2025-02-20 19:52:08'),
(13, 'Cave Club', 'Mattel', '2025-02-20 20:02:51');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `dolls`
--
ALTER TABLE `dolls`
  ADD PRIMARY KEY (`id`),
  ADD KEY `marca_id` (`marca_id`);

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
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `dolls`
--
ALTER TABLE `dolls`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT de la tabla `lotes`
--
ALTER TABLE `lotes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `lote_doll`
--
ALTER TABLE `lote_doll`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `dolls`
--
ALTER TABLE `dolls`
  ADD CONSTRAINT `dolls_ibfk_1` FOREIGN KEY (`marca_id`) REFERENCES `marca` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `lote_doll`
--
ALTER TABLE `lote_doll`
  ADD CONSTRAINT `lote_doll_ibfk_1` FOREIGN KEY (`lote_id`) REFERENCES `lotes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `lote_doll_ibfk_2` FOREIGN KEY (`doll_id`) REFERENCES `dolls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
