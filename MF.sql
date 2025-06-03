-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Хост: MySQL-8.4
-- Время создания: Июн 04 2025 г., 00:07
-- Версия сервера: 8.4.4
-- Версия PHP: 8.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `MF`
--

-- --------------------------------------------------------

--
-- Структура таблицы `Cart`
--

CREATE TABLE `Cart` (
  `id` int NOT NULL,
  `Product_id` int NOT NULL,
  `User_id` int NOT NULL,
  `Amount` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `Cart`
--

INSERT INTO `Cart` (`id`, `Product_id`, `User_id`, `Amount`) VALUES
(9, 1, 6, 3);

-- --------------------------------------------------------

--
-- Структура таблицы `Descriptions`
--

CREATE TABLE `Descriptions` (
  `id` int NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `List` text NOT NULL,
  `Overview` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Benefits` text NOT NULL,
  `Suggest` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `Descriptions`
--

INSERT INTO `Descriptions` (`id`, `Name`, `List`, `Overview`, `Benefits`, `Suggest`) VALUES
(1, 'GOLDEN WHEYyy', 'NEW LIST###very very cool benefits###even cooler benefits', 'COOL STUFF###cooler stuff###dfgdfgd', 'VERY GOOD', 'SOME SUGGESTION');

-- --------------------------------------------------------

--
-- Структура таблицы `Favs`
--

CREATE TABLE `Favs` (
  `id` int NOT NULL,
  `Product_id` int NOT NULL,
  `User_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `Images`
--

CREATE TABLE `Images` (
  `id` int NOT NULL,
  `Product_id` int NOT NULL,
  `URL` text NOT NULL,
  `Selection` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `Images`
--

INSERT INTO `Images` (`id`, `Product_id`, `URL`, `Selection`) VALUES
(1, 1, '0.webp', 0),
(2, 2, '0.webp', 0),
(3, 3, '0.webp', 0),
(4, 4, '0.webp', 0),
(5, 5, '0.webp', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `Orders`
--

CREATE TABLE `Orders` (
  `id` int NOT NULL,
  `User_id` int NOT NULL,
  `Product_id` int NOT NULL,
  `Amount` int NOT NULL,
  `Date` date NOT NULL,
  `Status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `Orders`
--

INSERT INTO `Orders` (`id`, `User_id`, `Product_id`, `Amount`, `Date`, `Status`) VALUES
(1, 6, 3, 4, '2025-06-03', 'Ожидает'),
(2, 6, 1, 28, '2025-06-03', 'Ожидает'),
(3, 6, 5, 10, '2025-06-03', 'Ожидает'),
(4, 6, 2, 2, '2025-06-03', 'Ожидает');

-- --------------------------------------------------------

--
-- Структура таблицы `Products`
--

CREATE TABLE `Products` (
  `id` int NOT NULL,
  `Flavour` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Size` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `Second_price` decimal(10,2) DEFAULT NULL,
  `Category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Amount_avbl` int DEFAULT NULL,
  `Amount_sold` int DEFAULT NULL,
  `Group_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `Products`
--

INSERT INTO `Products` (`id`, `Flavour`, `Size`, `Price`, `Second_price`, `Category`, `Type`, `Amount_avbl`, `Amount_sold`, `Group_id`) VALUES
(1, 'Шоколад', 'Большой', 2333.00, NULL, 'protein', 'powder', 305, 28, 1),
(2, 'Шоколад', 'Маленикий', 2789.00, 2500.00, 'gainer', 'powder', 331, 10, 1),
(3, 'Клубника', 'Маленикий', 1700.00, 130.00, 'gainer', 'powder', 329, 12, 1),
(4, 'Клубника', 'Большой', 1500.00, 1180.00, 'gainer', 'powder', 0, 8, 1),
(5, 'Клубника', 'Большой', 1555.00, 1220.00, 'protein', 'порошок', 0, 10, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `Review`
--

CREATE TABLE `Review` (
  `id` int NOT NULL,
  `Product_id` int NOT NULL,
  `User_id` int NOT NULL,
  `Rating` tinyint NOT NULL,
  `Title` varchar(100) NOT NULL,
  `Text` text NOT NULL,
  `Date` date NOT NULL
) ;

--
-- Дамп данных таблицы `Review`
--

INSERT INTO `Review` (`id`, `Product_id`, `User_id`, `Rating`, `Title`, `Text`, `Date`) VALUES
(1, 1, 1, 2, 'Bad', 'loremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlorem', '2025-06-01'),
(2, 1, 6, 1, 'Хуй с говном', 'dfgdfg', '2025-06-03');

-- --------------------------------------------------------

--
-- Структура таблицы `Users`
--

CREATE TABLE `Users` (
  `id` int NOT NULL,
  `Role` int NOT NULL DEFAULT '0',
  `Name` varchar(40) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Birth` date NOT NULL,
  `Gender` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Pass` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `Users`
--

INSERT INTO `Users` (`id`, `Role`, `Name`, `Email`, `Phone`, `Birth`, `Gender`, `Pass`) VALUES
(1, 0, 'Niger', 'epik@mail.ru', '+79247011548', '2025-04-09', '', 'gg'),
(6, 1, 'Egor', 'gg@gg.gg', '+7878787', '2008-12-17', 'Мужчина', '$2y$12$FM92wJuG8nMjNEwsUVTFuueG2i/JBuPkpxvWLCdqgswcWP334Ccwa');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `Cart`
--
ALTER TABLE `Cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_ibfk_1` (`Product_id`),
  ADD KEY `cart_ibfk_2` (`User_id`);

--
-- Индексы таблицы `Descriptions`
--
ALTER TABLE `Descriptions`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `Favs`
--
ALTER TABLE `Favs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Product_id` (`Product_id`),
  ADD KEY `User_id` (`User_id`);

--
-- Индексы таблицы `Images`
--
ALTER TABLE `Images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Product_id` (`Product_id`);

--
-- Индексы таблицы `Orders`
--
ALTER TABLE `Orders`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `Products`
--
ALTER TABLE `Products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Group_id` (`Group_id`);

--
-- Индексы таблицы `Review`
--
ALTER TABLE `Review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Product_id` (`Product_id`),
  ADD KEY `User_id` (`User_id`);

--
-- Индексы таблицы `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `Cart`
--
ALTER TABLE `Cart`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT для таблицы `Descriptions`
--
ALTER TABLE `Descriptions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `Favs`
--
ALTER TABLE `Favs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `Images`
--
ALTER TABLE `Images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `Orders`
--
ALTER TABLE `Orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `Products`
--
ALTER TABLE `Products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `Review`
--
ALTER TABLE `Review`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `Cart`
--
ALTER TABLE `Cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`Product_id`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`User_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `Favs`
--
ALTER TABLE `Favs`
  ADD CONSTRAINT `favs_ibfk_1` FOREIGN KEY (`Product_id`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favs_ibfk_2` FOREIGN KEY (`User_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `Images`
--
ALTER TABLE `Images`
  ADD CONSTRAINT `images_ibfk_1` FOREIGN KEY (`Product_id`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `Products`
--
ALTER TABLE `Products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`Group_id`) REFERENCES `Descriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `Review`
--
ALTER TABLE `Review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`Product_id`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`User_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
