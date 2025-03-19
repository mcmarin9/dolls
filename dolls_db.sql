-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-03-2025 a las 00:51:58
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
(1, 'Evie Neon Lights', 10, 3, 'Neon Lights Ball', 'Evie', 2015, 'vendida', 2.00, 20.00, 'Exclusiva de Toys R Us.', '/uploads/694c43e2ec0c46aa9fd154ddf25412ea.jpg', '2025-02-16 18:03:54'),
(2, 'Evie Royal Yacht Ball', 10, 3, 'Royal Yacht Ball', 'Evie', 2016, 'vendida', 2.00, 12.00, NULL, '/uploads/4064aa8b5a1e4046bae4232725417dfd.jpg', '2025-02-16 18:05:53'),
(3, 'Mal Básica', 10, 3, 'Signature', 'Mal', 2015, 'vendida', 2.00, 7.00, '', '/uploads/3cd337050af045879af9e9a37ce70b26.jpg', '2025-02-16 18:07:48'),
(4, 'Super Girl', 11, 1, 'Básica', 'Super Girl', 2015, 'a la venta', 2.00, NULL, NULL, '/uploads/56d0576172a646a2b21febe7c140a106.jpg', '2025-02-16 18:08:56'),
(5, 'Westley Patines', 7, 1, 'Roller Girls Remote Control', 'Westley / Madison', 2007, 'a la venta', 4.00, NULL, NULL, '/uploads/8eacd60c7b264a3bb1584b410dc8b16c.jpg', '2025-02-16 18:13:11'),
(6, 'Jade', 2, 2, 'Primera Edición', 'Jade', 2001, 'vendida', 4.00, NULL, 'vendida con cloe basica', '/uploads/5f4d6868117643759dcd872623dbbeed.jpg', '2025-02-16 18:14:55'),
(7, 'Elena de Avalor', 8, 4, 'Básica', 'Elena de Avalor', 2016, 'a la venta', 2.00, NULL, NULL, '/uploads/bf277e0701164ffd9e95ef2e499e8757.jpg', '2025-02-16 18:17:49'),
(8, 'Barbie Super Negra', 1, 1, 'Fashionista', '#90', 2018, 'guardada', 2.00, NULL, NULL, NULL, '2025-02-16 18:18:23'),
(9, 'Spirit Queen', 3, 2, 'Movie Magic', 'Spirit Queen', 2021, 'vendida', 1.67, 6.00, NULL, '/uploads/8245630e736a4185957c621fd94b02b8.jpg', '2025-02-16 18:36:50'),
(11, 'Fiat 500', 1, 1, 'Fiat 500', 'Barbie', 2009, 'a la venta', 1.67, NULL, NULL, '/uploads/f5ec0a85ab274c328de87b316f5da426.jpg', '2025-02-16 18:47:07'),
(12, 'Rayla Leona', 1, 1, 'La magia de Pegaso', 'Rayla Reina de las Nubes', 2005, 'vendida', 1.50, 3.50, 'vendida con cara sapo', '/uploads/b9baa5838f394945b68b05b834106c86.jpg', '2025-02-16 19:19:00'),
(13, 'Fake', 14, NULL, 'Fake', 'Fake', 2025, 'fuera', 1.50, NULL, 'Comprada por la ropa', NULL, '2025-02-16 19:26:48'),
(14, 'Cloe Disaster', 2, 2, 'Básica', 'Cloe', 2025, 'vendida', 3.00, 2.50, NULL, '/uploads/75a383ed0f9842a78ee81048094b4d83.jpg', '2025-02-16 19:29:24'),
(15, 'Yasmin Articulada', 2, 2, 'The Movie', 'Yasmin', 2007, 'guardada', 1.33, NULL, NULL, NULL, '2025-02-16 19:30:44'),
(16, 'Sasha Manca', 2, 2, 'The Movie', 'Sasha', 2007, 'a la venta', 1.33, 6.00, NULL, '/uploads/a258d6bd28eb4c718888c3cb4ff5ccba.jpg', '2025-02-16 19:31:56'),
(17, 'Teresa Sapo', 1, 1, 'My House', 'Teresa', 2008, 'vendida', 1.33, 3.50, NULL, '/uploads/7fecd2edcb83458fafc06db63d728f52.jpg', '2025-02-16 19:33:13'),
(18, 'Coche', 2, 2, 'Rock Angels', 'Coche', 2025, 'guardada', 6.00, NULL, NULL, NULL, '2025-02-16 19:38:24'),
(19, 'Maletín Blancanieves', 8, 4, 'Mini Animators', 'Blancanieves', 2025, 'guardada', NULL, NULL, 'Mini Animators', NULL, '2025-02-16 19:39:03'),
(20, 'Yasmin la guapa', 2, 2, 'Magic Hair', 'Yasmin', 2007, 'guardada', 1.67, NULL, NULL, NULL, '2025-02-16 19:40:48'),
(21, 'Midge anillo', 1, 1, 'Happy Family', 'Midge', 2003, 'vendida', 1.67, 8.00, NULL, '/uploads/51d028104a8744a5b124d04a96365139.jpg', '2025-02-16 19:42:11'),
(22, 'Teresa la guapa', 1, 1, 'Fashion Fever', 'Teresa', 2004, 'vendida', 1.67, 13.00, NULL, '/uploads/0a7df5c0a76f48ebb96dee3865f5e384.jpg', '2025-02-16 19:43:24'),
(23, 'Sasha Básica', 2, 2, 'Primera Edición', 'Sasha', 2001, 'guardada', 1.25, NULL, NULL, NULL, '2025-02-17 18:39:25'),
(24, 'Jade Básica', 2, 2, 'Primera Edición', 'Jade', 2001, 'guardada', 1.25, 4.50, 'Pelo más marrón que negro', NULL, '2025-02-17 18:40:33'),
(25, 'Yasmin Ojos azules', 2, 2, 'Strut It', 'Yasmin', 2003, 'guardada', 1.25, NULL, NULL, NULL, '2025-02-17 18:42:52'),
(26, 'Cloe Mechas rosas', 2, 2, 'Snow Kissed', 'Cloe', 2015, 'a la venta', 1.25, NULL, NULL, '/uploads/36797f6118e045dc916739e19466c22e.jpg', '2025-02-17 18:44:51'),
(27, 'Barbie fea', 1, 1, 'Rollerblade', 'Barbie', 1995, 'vendida', 1.00, 7.00, NULL, '/uploads/c42ba53083214296ae6fd62eb675e2a4.jpg', '2025-02-17 19:00:25'),
(28, 'Barbie con venecia', 1, 1, 'Special Expressions (USA) / Style Barbie (Europe)', 'Barbie', 1993, 'vendida', 1.00, 8.00, 'Con vestido de Venecia', '/uploads/7a566f2063e141988a37a90042197edf.jpg', '2025-02-17 19:02:55'),
(29, 'Barbie vintage monísima', 1, 1, 'Veterinaria', 'Barbie', 1996, 'guardada', 1.00, NULL, 'la primera vintage pa mi, con el vestido ruso. comprobar año', NULL, '2025-02-17 19:04:08'),
(30, 'Barbie pelo corto', 1, 1, 'Fashion Style & Friendship', 'Barbie', 2008, 'a la venta', 1.50, NULL, 'El pantalón es oficial de Barbie School Cool de 1999 y la camiseta de Barbie Baywatch / Salvavidas de 1994.', '/uploads/3e3f943ce04943e0a592e459b5dae43e.jpg', '2025-02-17 19:06:42'),
(31, 'Teresa pelo corto', 1, 1, 'Chic', 'Teresa', 2008, 'a la venta', 1.50, NULL, 'La ropa chaqueta y falda son oficiales de Barbie Chair Flair de 2002.', '/uploads/e0bb31174fe741a4aead6428783bd960.jpg', '2025-02-17 19:07:23'),
(32, 'Christie', 1, 1, 'Really Rosy', 'Christie', 2004, 'a la venta', 2.00, NULL, NULL, '/uploads/079a9ac18c3a436fa6924af758276ea9.jpg', '2025-02-17 19:09:21'),
(33, 'Yasmin Hippie', 2, 2, 'Hippie Chic', 'Yasmin', 2003, 'a la venta', 2.00, NULL, NULL, '/uploads/7291b51e7c7d44679b6c138a95a994f3.jpg', '2025-02-17 19:11:24'),
(34, 'Blossom que no es Blossom', 1, 1, 'Foam \'n Color', 'Barbie', 1996, 'a la venta', 2.50, NULL, 'El vestido es de Barbie Blossom Beauty de 1996. La de la cara picada.', '/uploads/9510b21057df440f8b14b1efd0ba40f0.jpg', '2025-02-17 19:14:47'),
(35, 'Elina', 1, 1, 'Fairytopia Mermaidia', 'Elina', 2006, 'a la venta', 2.50, NULL, 'Ala rota', '/uploads/4757dc0027e544c6861a9b7ff47ceece.jpg', '2025-02-17 19:19:06'),
(36, 'Sunburst', 1, 1, 'Fairytopia Magia del Arco Iris', 'Sunburst', 2007, 'a la venta', 2.50, NULL, NULL, '/uploads/a141ea2430df401c8b9e411853b9afc3.jpg', '2025-02-17 19:20:37'),
(37, 'Glitter Swirl', 1, 1, 'Fairytopia Mermaidia', 'Glitter Swirl', 2006, 'a la venta', 2.50, NULL, 'Descabezada. Alas con el líquido podrido. (añadir comentarios a lote: incluia vestido princesa azul gigante)', '/uploads/41831f0eb7d34f21aeafdcb5f8c96836.jpg', '2025-02-17 19:23:59'),
(38, 'Cutie Panda', 1, 1, 'Cutie Reveal Panda', 'Panda', 2022, 'vendida', 1.50, 6.00, NULL, '/uploads/a012cc0b01594863a1e6c9332e8554e1.jpg', '2025-02-17 19:26:36'),
(39, 'Millie Básica Articulada', 1, 1, 'Millie general', 'Barbie', 2025, 'a la venta', 1.50, NULL, 'El vestido es de Barbie Flower Fun de 1996.', '/uploads/189b570be46347c5893b36b850addaf6.jpg', '2025-02-17 19:28:16'),
(40, 'LOL Negra Afro', 3, 2, 'Movie Magic Studios', 'Agent Soul', 2021, 'guardada', 2.00, NULL, NULL, NULL, '2025-02-20 19:00:19'),
(41, 'Mini Lol Rubia', 4, 2, 'Serie 2', 'Goldie Twist', 2022, 'guardada', 3.00, NULL, NULL, NULL, '2025-02-20 19:01:55'),
(42, 'Troglodita Rosa', 12, 1, 'Signature', 'Emberly', 2020, 'guardada', 1.50, NULL, NULL, NULL, '2025-02-20 19:03:55'),
(43, 'Troglodita Azul', 12, 1, 'Signature', 'Tella', 2020, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 19:04:36'),
(44, 'Troglodita Chico', 12, 1, 'Signature', 'Slate', 2020, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 19:05:14'),
(46, 'Spectra', 6, 1, 'School\'s Out / Signature', 'Spectra Vondergeist', 2025, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 19:12:35'),
(47, 'California', 1, 1, 'California Girl', 'Barbie', 2005, 'guardada', 2.00, NULL, 'No sabemos el modelo exacto', NULL, '2025-02-20 19:15:52'),
(48, 'Bratz Tuerto', 2, 2, 'On the Mic', 'Eitan', 2011, 'vendida', 1.00, 5.00, NULL, '/uploads/7d6551fe284341e2bfba8d1e06ee4e4a.jpg', '2025-02-20 19:18:43'),
(49, 'Yasmin Rock Angelz', 2, 2, 'Rock Angelz', 'Yasmin', 2005, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 19:20:05'),
(50, 'Barbie Guapa de rosa', 1, 1, 'Fashion Fever Hair Hightlights', 'Barbie', 2006, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 19:23:09'),
(51, 'Poppy', 5, 2, 'Serie 1', 'Poppy Rowan', 2020, 'guardada', 3.00, NULL, 'La manca', NULL, '2025-02-20 19:24:26'),
(52, 'Teresa Burbujas', 1, 1, 'Burbujas / Bubble Fairy', 'Teresa', 1998, 'guardada', 1.00, NULL, NULL, NULL, '2025-02-20 19:26:09'),
(53, 'Barbie \"Patinadora\"', 1, 1, 'Tahiti', 'Barbie', 1992, 'guardada', 1.00, NULL, 'Traje del Aliexpress.', NULL, '2025-02-20 19:30:08'),
(54, 'Super Negra con Vestido', 1, 1, 'Fashionista', '#90', 2018, 'a la venta', 1.00, NULL, NULL, '/uploads/a1ef1f5b69fe4f658e94af5117389b3a.jpg', '2025-02-20 19:56:55'),
(55, 'Jade', 2, 2, 'Primera Edición', 'Jade', 2001, 'a la venta', 5.00, NULL, NULL, NULL, '2025-02-22 10:28:35'),
(56, 'Chelsea Articulada', 7, 1, 'Vespa', 'Chelsea', 2003, 'vendida', 5.00, 9.00, NULL, '/uploads/c11097d3e57349cdb25c764c2e0e7e04.jpg', '2025-02-22 10:31:00'),
(57, 'Barbie Ojos Lilas', 1, 1, 'Sweet Treats', 'Barbie', 1999, 'a la venta', 1.00, NULL, NULL, '/uploads/12546cf6985649c2a250bb5647ced418.jpg', '2025-02-22 10:32:18'),
(58, 'Barbie Ojos Verdes', 1, 1, 'Krissy Bedtime Baby', 'Barbie', 2000, 'a la venta', 1.00, NULL, NULL, '/uploads/67d31451d17b48e08238049f2eebfffb.jpg', '2025-02-22 10:33:29'),
(59, 'Blancanieves Baño + Vestido', 8, 5, 'Bath Time + Disney Store', 'Blancanieves', 2025, 'a la venta', 3.00, NULL, 'Muñeca de Simba y vestido sin identificar de la Disney Store.', '/uploads/3b5fe81d7488483b981e1b2cb76fa382.jpg', '2025-02-22 10:35:15'),
(60, 'Hannah Montana Primera', 14, 1, 'Ropa azul', 'Hannah Montana', 2008, 'a la venta', 1.00, NULL, 'Pelo suave y cinturon', '/uploads/676deaf94cdb47b4aaa7f6c02b985113.jpg', '2025-02-22 10:38:57'),
(61, 'Hada Mia', 14, 1, 'Mia y Yo', 'Mia', 2012, 'vendida', 1.00, 5.00, NULL, '/uploads/e794cffad0cc421aa1568965767f376a.jpg', '2025-02-22 11:02:59'),
(62, 'Cloe pirata', 2, 2, 'Treasures', 'Cloe', 2005, 'vendida', 1.00, 2.50, NULL, '/uploads/7d226a9dfd234571b973ef8b61bbc00c.jpg', '2025-02-22 11:13:28'),
(64, 'Bratz Babyz Krysta', 2, 2, 'Babyz Twiins Krysta y Lela', 'Krysta', 2006, 'a la venta', 1.00, NULL, NULL, '/uploads/85c16fea7f5f400987cac761c8f60c92.jpg', '2025-02-22 16:00:34'),
(65, 'Barbie negra con mechas', 1, 1, 'Totally Hair', 'Negra', 2022, 'vendida', 2.00, 5.23, NULL, '/uploads/5a1390f055fd41e8bd9eec16ca38a553.jpg', '2025-02-22 21:10:06'),
(66, 'Barbie pelo azul y rosa con calva', 1, 1, 'Barbie Unicorn Mermaid Hair', 'Barbie', 2023, 'vendida', 2.00, 5.23, 'Comprada con vestido de Frozen', '/uploads/8c58071f46f94f6290afc3ee10c8b7cf.jpg', '2025-02-22 21:15:26'),
(67, 'Barbie Yoga moño', 1, 1, 'Yoga', 'Latina', 2018, 'vendida', 1.00, 17.00, 'Cuerpo Made to Move', '/uploads/2d68c613f6024ff980d00ee78b82a1d0.jpg', '2025-02-22 21:20:11'),
(68, 'Sirena super pelona', 1, 1, 'Jewel Hair Mermaid', 'Barbie', 1995, 'vendida', 3.00, 15.00, NULL, '/uploads/9b4f4121a5ee4d7a89aa3e20dc818cb0.jpg', '2025-02-22 21:25:04'),
(69, 'Vestido Elsa Frozen', 8, 1, 'Animator', 'Elsa', 2025, 'vendida', 0.01, 3.00, 'Venía con la Barbie de pelo rosa y azul', '/uploads/706b8a749f3b4e14842cf57b84d10c1b.jpg', '2025-03-01 12:40:59'),
(70, 'Hali Capri', 5, 2, 'Pacific Coast', 'Hali Capri', 2022, 'guardada', 3.00, NULL, NULL, NULL, '2025-03-01 12:43:27'),
(71, 'Figurita My Melody', 14, 1, '?', 'MyMelody', 2025, 'guardada', 3.00, NULL, NULL, NULL, '2025-03-01 12:43:57'),
(72, 'Barbie Articulada Pendientes', 1, 1, 'Fashionista', '#165', 2021, 'vendida', 1.50, 15.00, 'La de la silla de ruedas', '/uploads/dbfaeea695654807a03fe2ed60f0fc80.jpg', '2025-03-01 12:47:58'),
(73, 'Blancanieves pelo tieso', 8, 1, '?', 'Blancanieves', 2006, 'a la venta', 1.00, NULL, NULL, '/uploads/212b857d4f0b4048965896714c7e790b.jpg', '2025-03-01 12:49:12'),
(74, 'LOL Rubia', 3, 2, 'Serie 1', 'Lady Diva', 2019, 'guardada', 1.00, NULL, NULL, NULL, '2025-03-01 12:51:32'),
(75, 'Barbie Negra Afro Rubia', 1, 1, 'Fashionista', '#180', 2022, 'a la venta', 1.00, NULL, NULL, '/uploads/91d14242b48e4e5e97261d6888aeec9d.jpg', '2025-03-01 12:53:15'),
(76, 'Abbie', 6, 1, 'G1', 'Abbey Bominable', 2011, 'a la venta', 1.00, NULL, NULL, '/uploads/262d5e21c45040bebe6f6c66f96a0440.jpg', '2025-03-01 12:54:56'),
(77, 'Meygan', 2, 2, 'Xpress It!', 'Meygan', 2002, 'guardada', 1.00, NULL, NULL, NULL, '2025-03-01 12:56:09'),
(78, 'Honeymaren', 8, 1, 'Frozen 2', 'Honeymaren', 2019, 'guardada', 2.00, NULL, NULL, '/uploads/ebe0c99a518b4f22b728a584409b2546.jpg', '2025-03-01 13:01:34'),
(79, 'Troglodita Dinosaurio', 12, 1, 'Multi-Pack', 'Honeymaren ', 2022, 'guardada', 2.00, NULL, 'La que viene con el Dinosaurio', NULL, '2025-03-01 13:04:34'),
(80, 'Barbie Articulada Calva', 1, 1, '?', 'Barbie', 2025, 'a la venta', 1.00, NULL, 'Made to Move', '/uploads/78fd00d3f3f64136b1eaea5c8eb94ba6.jpg', '2025-03-01 13:06:37'),
(81, 'Barbie Derrengá', 1, 1, 'Top Model Hair Wear', 'Barbie', 2008, 'guardada', 1.00, NULL, 'Cuerpo Model Muse', NULL, '2025-03-01 13:09:24'),
(82, 'Barbie Pies Planos', 1, 1, 'Beach Party', 'Barbie', 2025, 'guardada', 1.00, NULL, 'Pies planos grandes y de goma. Buscar año y modelo concretos.', '/uploads/c458258fa066439d87febfa0ec4b00dd.jpg', '2025-03-01 13:13:00'),
(83, 'Skyler', 5, 2, 'Serie 1', 'Skyler Bradshaw', 2020, 'a la venta', 2.00, NULL, 'Manchitas de pintura', '/uploads/e03b235960054cc09e19a3974ce16f2c.jpg', '2025-03-01 13:14:55'),
(84, 'Ben descendiente', 10, 1, 'Royal Couple Engagement / The Royal Wedding', 'Ben', 2020, 'a la venta', 2.00, NULL, NULL, '/uploads/b33b939ab0e741c8bebafb60d69c9a6c.jpg', '2025-03-01 19:52:04'),
(85, 'Flynn ', 8, 1, 'Clásico', 'Flynn Rider - Eugene Fitzherbert', 2010, 'a la venta', 2.00, NULL, 'Pareja de Rapunzel', '/uploads/f9f5689ac57045e29b024276bb2ab8c6.jpg', '2025-03-01 20:00:25'),
(86, 'Eric', 8, 1, 'Clásico', 'Eric', 2025, 'vendida', 2.00, 7.50, 'Pareja de Ariel', '/uploads/5c38c242c1eb4abca86969f5d7a17bd3.jpg', '2025-03-01 20:04:22'),
(87, 'Florian', 8, 1, 'Clásico', 'Florian', 2025, 'guardada', 2.00, 7.50, 'Pareja de Blancanieves', '/uploads/bb66d66e23fc4773b0823c461c32c97a.jpg', '2025-03-01 20:05:05'),
(88, 'Ken Dream House', 1, 1, 'Dream House Adventures Traveller', 'Ken', 2019, 'vendida', 1.00, 7.00, NULL, '/uploads/197314b095f647f89285d55c47303df8.jpg', '2025-03-01 20:07:20'),
(89, 'Kristoff', 8, 1, 'Básico', 'Kristoff', 2013, 'a la venta', 2.00, NULL, 'Pareja de Anna. Comprobar año.', '/uploads/fd61829dcfc64c0b8c9c79809b1c0396.jpg', '2025-03-01 20:11:07'),
(90, 'Jade Articulada', 2, 2, 'The Movie', 'Jade', 2007, 'vendida', 2.00, 6.00, NULL, '/uploads/57f4ed0e3c8f43cdbefd139bbb9a2a0e.jpg', '2025-03-01 20:12:56'),
(91, 'Jay', 10, 1, 'Wicked World: Neon Light\'s Ball', 'Jay', 2020, 'a la venta', 2.00, NULL, NULL, '/uploads/e0b6e14e4b9a4bb38da2449ea89cc270.jpg', '2025-03-01 21:20:45'),
(92, 'Descendientes Coletas', 10, 1, 'Wicked World: Neon Light\'s Ball', 'Freddie', 2015, 'a la venta', 2.00, NULL, NULL, '/uploads/006dd8d511c3426cb56ee9ae6135b978.jpg', '2025-03-01 21:23:16'),
(93, 'Descendientes Rosa', 10, 1, 'Wicked World: Neon Light\'s Ball', 'Audrey', 2025, 'a la venta', 2.00, NULL, NULL, '/uploads/ed347e3f2dee4202a044b077377b134c.jpg', '2025-03-01 21:24:19'),
(94, 'Ken Barba Mágica', 1, 1, 'Barba Mágica', 'Ken', 2012, 'a la venta', 2.00, NULL, NULL, '/uploads/cce00a518be14108bfd485abc0cea1f1.jpg', '2025-03-01 21:25:47'),
(95, 'Cambia Pelo Mal', 10, 1, 'Isle Style Switch', 'Mal', 2016, 'vendida', 2.00, 25.00, NULL, '/uploads/74e97435fd4545de98b65c81458e72d7.jpg', '2025-03-01 21:27:14'),
(96, 'Skipper Morena', 1, 1, 'Let\'s Go Camping', 'Skipper', 2021, 'a la venta', 2.00, NULL, NULL, '/uploads/89405a9acfa546c0aeadfd2e9423de26.jpg', '2025-03-01 22:28:15'),
(97, 'Stacey', 1, 1, 'Horse Playset', 'Stacey', 202, 'a la venta', 2.00, NULL, NULL, '/uploads/3d3b912c343f441c8cfce7b106f52db7.jpg', '2025-03-01 22:29:44'),
(98, 'Cameron Bratz', 2, 2, 'Segunda Edición?', 'Cameron', 2003, 'vendida', 2.00, 5.00, NULL, '/uploads/b465c7cac4d64c6085720381d62e9359.jpg', '2025-03-02 14:22:04'),
(99, 'Cloe básica', 2, 2, 'Primera Edición?', 'Cloe', 2001, 'guardada', 2.00, 4.50, NULL, '/uploads/3bfeff41ae214b419cd3932b1f86669b.jpg', '2025-03-02 14:24:43'),
(100, 'Barbie Bailarina', 1, 1, 'Classic Ballet - Ballerina Marzipan - Marzipan in the Nutcracker / Cascanueces', 'Barbie', 1999, 'a la venta', 2.00, NULL, 'Edición coleccionista de la serie ballet clásico.\r\nBarbie Collector Edition Classic Ballet Series.\r\n', '/uploads/8adee2c466fc4d9aa966c509894a939b.jpg', '2025-03-02 14:26:46'),
(101, 'Cleo Monster Fest', 6, 1, 'Monster Fest', 'Cleo de Nile', 2024, 'vendida', 2.00, 12.00, NULL, '/uploads/86002e00223d467cb02415341b523893.jpg', '2025-03-02 14:28:12'),
(102, 'Barbie Dentista', 1, 1, 'Dentista ', 'Barbie', 1998, 'a la venta', 1.25, NULL, 'Puesta con el traje de Rusia', '/uploads/998fab39bb844bf4ac8c1c55b2b2be80.jpg', '2025-03-02 14:29:26'),
(103, 'Neonlicius', 3, 2, 'Serie 1', 'Neonlicius', 2019, 'a la venta', 1.25, NULL, 'Comprobar pelo.', '/uploads/f8057c3d65c64b668d0d7db98e1193bc.jpg', '2025-03-02 14:31:15'),
(104, 'Barbie Chef', 1, 1, ' I can be... Chef', 'Barbie', 2011, 'a la venta', 1.25, NULL, NULL, '/uploads/c40f804d68c44bc8a23db3cfec46aa34.jpg', '2025-03-02 14:32:16'),
(105, 'Ken fotógrafo', 1, 1, 'Photographer', 'Ken Moreno?', 2001, 'vendida', 1.25, 5.00, NULL, '/uploads/eb8add645ea540c78a01a36a12bf4920.jpg', '2025-03-02 14:37:21'),
(106, 'Sylvanian Erizos', 14, 1, 'Erizos', 'Sylvanian Families', 2025, 'a la venta', 1.00, NULL, NULL, '/uploads/18ca89026b5a497abd8736bdedbc0dad.jpg', '2025-03-02 14:38:31'),
(107, 'Hannah Montana Segunda', 14, 1, 'Ropa azul', 'Hannah Montana', 2008, 'a la venta', 1.00, NULL, 'Peor pelo y sin cinturon	', NULL, '2025-03-09 09:50:46'),
(108, 'Bratz papel', 2, 2, 'Funk Out! Boyz', 'Dylan', 2003, 'a la venta', 2.00, NULL, NULL, '/uploads/de74db7cfa7d4eef89ed9961361a1094.jpg', '2025-03-09 09:56:47'),
(109, 'Rapunzel Mattel', 8, 1, 'Braiding Friends Hair Braider', '
', 2010, 'a la venta', 2.00, NULL, NULL, '/uploads/70b24b8a851d4c19a4fcd773599e4793.jpg', '2025-03-09 10:02:15'),
(110, 'Heath', 6, 1, 'Básico', 'Heath Burns', 2012, 'a la venta', 1.00, NULL, 'Puede ser: Classroom: 2-pack (2012) o Ghoul Fair (2015)', '/uploads/0b2189b686484e82a9de13bf138974d7.jpg', '2025-03-09 10:05:03'),
(111, 'Jade Verde', 5, 2, 'Serie 1', 'Jade Hunter', 2020, 'guardada', 3.00, NULL, NULL, NULL, '2025-03-09 10:06:21'),
(112, 'Cloe super pelo', 2, 2, 'Featherageous', 'Cloe ', 2012, 'guardada', 2.00, NULL, NULL, '/uploads/0220e076a7af48a6832256b9c819cf1c.jpg', '2025-03-09 10:08:32'),
(113, 'Cazador', 9, 1, 'Core Royals & Rebels', 'Hunter Huntsman', 2013, 'a la venta', 2.00, NULL, NULL, '/uploads/ba91a3df88d14789ade120a6e88fc996.jpg', '2025-03-09 10:09:39'),
(114, 'Skipper niñera', 1, 1, 'Babysitters INC', 'Skipper', 2021, 'vendida', 1.50, 4.00, 'Vestido del armario', '/uploads/5ef48af5cab945ecaf3dcb5c2be75f8c.jpg', '2025-03-09 10:12:51'),
(115, 'Teresa ojos verdes', 1, 1, 'Fashion Gift Set', 'Teresa ', 2013, 'guardada', 1.50, NULL, 'Vestido del armario', NULL, '2025-03-09 10:22:58'),
(116, 'Ken novio', 1, 1, ' Princess Groom', 'Ken', 2010, 'vendida', 1.00, 5.00, 'Medio cuerpo amarillo', '/uploads/ebf2cb439cf84ab99909c9608f38ab74.jpg', '2025-03-09 10:24:13'),
(117, 'Barbie Trencitas', 1, 1, 'Fashionista', '#123', 2019, 'guardada', 1.00, NULL, NULL, NULL, '2025-03-09 10:27:17'),
(118, 'Lote de ropa', 14, 1, 'Mix', 'Mix', 2025, 'guardada', 3.00, NULL, 'LOL OMG y Rainbow (buscar)', NULL, '2025-03-09 10:31:10'),
(119, 'Bratz Kylie', 2, 2, 'Vestido de noche', 'Kylie Jenner', 2025, 'a la venta', 3.00, NULL, NULL, '/uploads/42cf2c7596634253a0ba6c5232b64785.jpg', '2025-03-09 10:31:21'),
(120, 'Babie Shoes', 1, 1, 'Shoes Galore', 'Barbie', 2001, 'vendida', 1.00, NULL, 'Ropa original pero no suya.', '/uploads/fdc4fc14a7564e80b76a399c99d9d70d.jpg', '2025-03-09 10:42:45'),
(121, 'Neonlicius 2', 3, 2, 'Serie 1	', 'Neonlicius', 2019, 'guardada', 3.00, NULL, 'No tengo claro cual es cual, con ropa.', NULL, '2025-03-09 10:44:15'),
(122, 'LOL Pelo Naranja', 3, 2, 'Dance Dance Dance', 'Major Lady', 2021, 'guardada', 1.00, NULL, NULL, NULL, '2025-03-09 10:46:06'),
(123, 'Poppy Manca', 5, 2, 'Serie 1', 'Poppy Rowan', 2020, 'guardada', 2.00, NULL, 'Ya no está manca porque hubo transplante.', NULL, '2025-03-09 10:47:26'),
(124, 'Armario Barbie', 1, 1, 'Fashionistas Ultimate Closet', 'Sin personaje', 2019, 'vendida', 4.00, 10.00, 'Venía con el vestido gris de puntos y el rosa de flores y rallas negras. Vendido sin la ropa.', '/uploads/fc287c6bc9e8407e8c1dc91aaf7b7c52.jpg', '2025-03-09 10:55:08'),
(125, 'Teresa Rio', 1, 1, 'Rio de Janeiro', 'Teresa', 2003, 'vendida', 1.00, NULL, 'Vestido de Fashionista #22.', '/uploads/fa8b5459a0e84ed59ddd0336bbc12247.jpg', '2025-03-09 10:56:31'),
(126, 'Elsa', 8, 1, 'Básica', 'Elsa', 2017, 'guardada', 1.00, NULL, '2017-2019', '/uploads/1d49a22001a14bc7b7b5038a2f1a3fcf.jpg', '2025-03-09 11:06:58'),
(127, 'Blancanieves figurita', 8, 1, 'Pijama', 'Blancanieves', 2025, 'guardada', 1.00, NULL, 'Estilo Q Posket fake.', NULL, '2025-03-09 11:24:09'),
(128, 'Rapunzel Fea Pelo Super', 8, 1, 'Disney Parks / Euro Disney', 'Rapunzel', 2011, 'vendida', 2.00, 28.00, NULL, '/uploads/75357f5a153f4ef6b63c9dde3572bd15.jpg', '2025-03-09 11:38:04'),
(129, 'Cenicienta', 8, 1, 'Clásico', 'Cenicienta', 2012, 'guardada', 2.00, NULL, NULL, NULL, '2025-03-09 11:42:22'),
(130, 'Yasmin Primera Edición', 2, 2, 'Primera Edición', 'Yasmin', 2001, 'a la venta', 2.00, NULL, 'Comprada por el abrigo.', '/uploads/b0430c54d71b4765b784c7fb63c1c98f.jpg', '2025-03-09 11:43:52'),
(131, 'Barbie Presentadora Americana', 1, 1, 'Fashionistas', 'Nikki', 2014, 'a la venta', 1.00, NULL, 'A veces sale sin número o la #6.', '/uploads/e0079da28cb34b6fbaf296c5f6e812e0.jpg', '2025-03-09 12:11:06'),
(132, 'Anna vestido coronación', 8, 1, 'Coronación', 'Anna', 2015, 'a la venta', 1.00, NULL, NULL, '/uploads/1ed16dc4de9742d6a4740853a174168b.jpg', '2025-03-09 12:30:44'),
(133, 'Blancanieves \"Coco\"', 8, 1, 'Ralth Rompe Internet Mini Doll Set', 'Blancanieves', 2020, 'guardada', 0.50, NULL, NULL, NULL, '2025-03-09 12:34:48'),
(134, 'Figura Maléfica', 8, 1, 'Bullyland', 'Maléfica', 2025, 'a la venta', 0.50, NULL, 'Marca Bullyland', '/uploads/f88802dd68c042cba0c773071a22e840.jpg', '2025-03-09 12:36:09'),
(135, 'Ratón Cenicienta', 8, 1, 'Básico', 'Gus', 2025, 'guardada', 0.50, NULL, 'Suponemos', NULL, '2025-03-09 12:36:51'),
(136, 'Aladdin y Abu', 8, 1, 'Figuritas', 'Aladdin y Abu', 2025, 'a la venta', 0.50, NULL, NULL, '/uploads/6e1621961a434259addc02df2fd6bfb4.jpg', '2025-03-09 12:39:33'),
(137, 'Troglodita Rosa Coleta', 12, 1, 'Adventure Packs', 'Emberly', 2020, 'guardada', 1.00, NULL, NULL, NULL, '2025-03-09 12:41:13'),
(138, 'Zada Lili', 15, 2, 'Dance Floor Funk', 'Zada', 2004, 'guardada', 1.00, NULL, 'No es la ropa de ese modelo.', NULL, '2025-03-15 15:24:37'),
(139, 'Cloe Andadora Guapa', 2, 2, 'The Fashion Show Evening Wear Collection', 'Cloe', 2008, 'guardada', 2.00, NULL, 'Se supone que andaba.', NULL, '2025-03-15 15:26:40'),
(140, 'Barbie Sirena Pelo Rosa', 1, 1, 'Magical Hair Mermaid', 'Barbie', 1993, 'a la venta', 1.00, NULL, 'Vestido Hip 2 Be Square', '/uploads/c41a0a8cf16e4fdabd2be6deff6b1bd9.jpg', '2025-03-15 15:31:54'),
(141, 'Mini Lol Rubia', 4, 2, 'Serie 2', 'Goldie Twist', 2022, 'a la venta', 2.00, NULL, 'Comprada por la chaqueta', NULL, '2025-03-15 15:41:09'),
(142, 'Cloe Genia', 2, 2, 'Genie Magic', 'Cloe', 2006, 'a la venta', 1.00, NULL, NULL, NULL, '2025-03-15 15:42:32'),
(143, 'Poison Ivy', 11, 1, 'Signature', 'Poison Ivy', 2016, 'a la venta', 2.00, NULL, 'Con las alas de Bumblebee ', '/uploads/3b0983a19bd54b21bbb7f146ce812003.jpg', '2025-03-15 15:48:38'),
(144, 'LOL Gigante Trenzas', 16, 2, 'Serie 1', 'Swag ', 2022, 'vendida', 1.50, 8.00, NULL, '/uploads/e35454efbd7d4369a38b9828c029a44a.jpg', '2025-03-15 15:58:47'),
(145, 'Blossom de verdad', 1, 1, 'Blossom Beauty', 'Barbie', 1996, 'guardada', 2.00, NULL, NULL, NULL, '2025-03-15 15:59:21'),
(146, 'LOL Pequeña Bicolor', 4, 2, 'Masquerade Party', 'Kat Mischief', 2022, 'guardada', 2.00, NULL, NULL, NULL, '2025-03-15 16:01:04'),
(147, 'Barbie Leoparda', 1, 1, 'Leopard Rainbow Hair', 'Barbie', 2021, 'a la venta', 1.00, NULL, NULL, '/uploads/3fa0fc593a3e4c448617dcd11ed9f66b.jpg', '2025-03-15 16:02:18'),
(148, 'Mini Mulan', 8, 4, 'Mini Doll Pop-up Play Set', 'Mulan', 2019, 'guardada', 1.00, NULL, 'Mini Animators', NULL, '2025-03-15 16:04:00'),
(149, 'Unicornio Tenebroso', 14, 1, 'Poopsie Sparkly Critters Drop', 'Rainbow Brightstar', 2018, 'guardada', 1.00, NULL, 'En la Wiki pone que es de rareza: Ultra-rare', NULL, '2025-03-15 16:13:11'),
(150, 'Monster Gata', 6, 1, 'Go Monster High Team!!!', 'Purrsephone', 2013, 'a la venta', 1.00, NULL, 'Exclusiva de Toys R Us', '/uploads/0dd3df2ba8634aaeaefd36f409c46c19.jpg', '2025-03-15 16:15:18'),
(151, 'Anna', 8, 1, '??', 'Anna', 2025, 'guardada', 2.00, NULL, NULL, NULL, '2025-03-15 21:53:57'),
(152, 'Bratz Chico Rubio', 2, 2, 'Funk Out! Boyz', 'Cameron', 2004, 'a la venta', 1.00, NULL, NULL, NULL, '2025-03-15 22:55:03'),
(153, 'Figura Aurora', 8, 1, '??', 'Aurora', 2025, 'guardada', 1.00, NULL, NULL, NULL, '2025-03-15 22:56:04'),
(154, 'Ken Negro', 1, 1, 'Fashionista', '#130', 2019, 'a la venta', 1.00, NULL, NULL, '/uploads/2d7abcc13e6d4b9eb06b8ceb51ddc25b.jpg', '2025-03-15 23:30:44'),
(155, 'Ken Grande', 1, 1, 'Fashionista', '#131', 2019, 'a la venta', 1.00, NULL, NULL, '/uploads/b1577f71f0e3493c94a6e39e9d3a0ae4.jpg', '2025-03-15 23:31:38'),
(156, 'Barbie Trencitas 2', 1, 1, 'Fashionista', '#123', 2025, 'a la venta', 1.00, NULL, NULL, '/uploads/dc8fdce012fa4b53af6bc536728ee460.jpg', '2025-03-15 23:32:48'),
(157, 'Junior Azul', 17, 2, 'Serie 1', 'Skyler Bradshaw', 2022, 'a la venta', 2.50, NULL, NULL, NULL, '2025-03-15 23:37:44'),
(158, 'Barbie Respiración', 1, 1, 'Breathe with Me ', 'Barbie', 2020, 'a la venta', 2.50, NULL, NULL, NULL, '2025-03-15 23:38:46');

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
(5, 'Simba', '2025-02-22 13:14:57'),
(6, 'JAKKS Pacific', '2025-03-01 12:36:57'),
(7, 'Otros', '2025-03-09 11:23:46');

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
(16, 'Barbie mechas', 'venta', 10.45, '2025-02-22 21:16:14'),
(17, 'Hali y Melody', 'compra', 6.00, '2025-03-01 12:44:14'),
(18, 'Principes', 'venta', 15.00, '2025-03-01 20:05:19'),
(19, 'Bratz Movie', 'venta', 12.00, '2025-03-01 20:14:07'),
(20, 'Bratz Chicos', 'venta', 10.00, '2025-03-02 14:23:05'),
(21, 'Jade y Cloe Básicas', 'venta', 9.00, '2025-03-02 14:25:11'),
(22, 'Barbie, Ken, LOL', 'compra', 5.00, '2025-03-02 14:37:39'),
(23, 'Kens', 'venta', 10.00, '2025-03-09 10:24:57'),
(24, 'Kylei y ropa', 'compra', 6.00, '2025-03-09 10:31:36'),
(25, 'Figuritas y Coco', 'compra', 2.00, '2025-03-09 12:39:51'),
(26, 'Junior y Respiración', 'compra', 5.00, '2025-03-15 23:39:01');

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
(50, 19, 16),
(17, 6, 17),
(20, 7, 17),
(21, 8, 20),
(22, 8, 21),
(23, 8, 22),
(24, 9, 23),
(25, 9, 24),
(54, 21, 24),
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
(52, 20, 48),
(41, 15, 62),
(44, 16, 65),
(43, 16, 66),
(46, 17, 70),
(45, 17, 71),
(48, 18, 86),
(47, 18, 87),
(49, 19, 90),
(51, 20, 98),
(53, 21, 99),
(58, 22, 102),
(57, 22, 103),
(56, 22, 104),
(55, 22, 105),
(60, 23, 105),
(59, 23, 116),
(62, 24, 118),
(61, 24, 119),
(66, 25, 133),
(65, 25, 134),
(64, 25, 135),
(63, 25, 136),
(68, 26, 157),
(67, 26, 158);

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
(14, 'Otros', '2025-02-22 14:59:18'),
(15, 'Lil\' Bratz', '2025-03-14 21:28:05'),
(16, 'LOL Fierce', '2025-03-15 15:56:27'),
(17, 'Junior High', '2025-03-15 23:36:28');

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
(8, 3),
(8, 4),
(8, 5),
(8, 6),
(8, 7),
(9, 1),
(10, 1),
(10, 3),
(11, 1),
(12, 1),
(14, 1),
(14, 2),
(15, 2),
(16, 2),
(17, 2);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=159;

--
-- AUTO_INCREMENT de la tabla `fabricantes`
--
ALTER TABLE `fabricantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `lotes`
--
ALTER TABLE `lotes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `lote_doll`
--
ALTER TABLE `lote_doll`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

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
