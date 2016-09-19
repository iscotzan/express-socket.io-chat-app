-- phpMyAdmin SQL Dump
-- version 4.6.1
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Sep 19, 2016 at 06:13 PM
-- Server version: 5.6.30
-- PHP Version: 5.6.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chat_node`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `m_id` int(11) NOT NULL,
  `m_u_id` int(11) NOT NULL,
  `m_content` varchar(255) NOT NULL,
  `u_current_color_4_others` varchar(20) NOT NULL,
  `m_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `m_u_nickname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`m_id`, `m_u_id`, `m_content`, `u_current_color_4_others`, `m_datetime`, `m_u_nickname`) VALUES
(314, 67, 'hello', '#1CA347', '2016-09-13 15:06:02', 'regularUserName NothingSuspici'),
(315, 63, 'hi', '#5bc0de', '2016-09-13 15:06:13', 'iscotzan'),
(316, 63, 'what\'s up?', '#0e90d2', '2016-09-13 15:06:27', 'iscotzan'),
(317, 67, 'i\'m good', '#1CA347', '2016-09-13 15:06:34', 'regularUserName NothingSuspici'),
(318, 63, 'so what\'s new?', 'dodgerblue', '2016-09-13 15:09:03', 'iscotzan'),
(319, 67, 'not much', 'mediumvioletred', '2016-09-13 15:09:13', 'regularUserName NothingSuspici'),
(320, 67, 'hey, did you know we can send images?', 'mediumvioletred', '2016-09-13 15:09:27', 'regularUserName NothingSuspici'),
(321, 63, 'how is that?', 'dodgerblue', '2016-09-13 15:09:38', 'iscotzan'),
(322, 67, 'so simple, just like this, and gifs are acceptable as well ;)', 'mediumvioletred', '2016-09-13 15:10:41', 'regularUserName NothingSuspici'),
(323, 63, 'oh that is so cool', 'dodgerblue', '2016-09-13 15:10:54', 'iscotzan'),
(324, 67, 'ok let me send one', 'mediumvioletred', '2016-09-13 15:11:33', 'regularUserName NothingSuspici'),
(325, 67, 'I mean, now you send one : O', 'mediumvioletred', '2016-09-13 15:11:51', 'regularUserName NothingSuspici'),
(326, 63, 'te gusta?', 'dodgerblue', '2016-09-13 15:12:47', 'iscotzan'),
(327, 67, 'que buena nota', 'mediumvioletred', '2016-09-13 15:12:55', 'regularUserName NothingSuspici'),
(328, 67, 'and you can click them to enlarge as well!', 'mediumvioletred', '2016-09-13 15:13:19', 'regularUserName NothingSuspici'),
(329, 63, 'yep, and again to thumbify, I\'ve noticed', 'dodgerblue', '2016-09-13 15:13:57', 'iscotzan'),
(330, 67, 'file-size is limited to 1mb, try to upload something bigger dude', 'tomato', '2016-09-13 15:22:00', 'regularUserName NothingSuspici'),
(331, 63, 'ok..just a sec', '#0e90d2', '2016-09-13 15:22:10', 'iscotzan'),
(332, 67, 'ok now check', 'yellow', '2016-09-13 15:31:18', 'regularUserName NothingSuspici'),
(333, 63, 'ok now?', 'blue', '2016-09-13 15:34:26', 'iscotzan'),
(334, 67, 'yep', 'blue', '2016-09-13 15:34:33', 'regularUserName NothingSuspici'),
(335, 63, 'ok now it should work', 'red', '2016-09-13 15:42:12', 'iscotzan'),
(336, 67, 'it works', 'tomato', '2016-09-13 15:47:27', 'regularUserName NothingSuspici'),
(337, 67, '1mb max', 'tomato', '2016-09-13 15:47:33', 'regularUserName NothingSuspici'),
(338, 63, 'skadjg', '#1CA347', '2016-09-13 16:07:19', 'iscotzan'),
(339, 67, 'ok!', '#1f6377', '2016-09-13 16:16:33', 'regularUserName NothingSuspici'),
(340, 67, 'now it seems pretty functional!', '#1f6377', '2016-09-13 16:16:42', 'regularUserName NothingSuspici'),
(341, 67, 'alright, is anyone here?', 'purple', '2016-09-14 12:26:59', 'regularUserName NothingSuspici');

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `img_id` int(11) NOT NULL,
  `f_u_id` int(11) NOT NULL,
  `f_u_color` varchar(60) NOT NULL,
  `f_u_nickname` varchar(255) NOT NULL,
  `img_filename` varchar(255) NOT NULL,
  `img_originalname` varchar(255) NOT NULL,
  `img_path` varchar(255) NOT NULL,
  `filesize` int(11) NOT NULL,
  `img_create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `img_banned` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`img_id`, `f_u_id`, `f_u_color`, `f_u_nickname`, `img_filename`, `img_originalname`, `img_path`, `filesize`, `img_create_date`, `img_banned`) VALUES
(61, 67, 'mediumvioletred', 'regularUserName NothingSuspici', 'userPhoto-1473779399276', 'meditation.gif', '.tmp\\uploads\\userPhoto-1473779399276', 145069, '2016-09-13 15:09:59', '0'),
(62, 63, 'dodgerblue', 'iscotzan', 'userPhoto-1473779549411', 'loadingcreative.gif', '.tmp\\uploads\\userPhoto-1473779549411', 1766933, '2016-09-13 15:12:29', '0'),
(63, 63, '#0e90d2', 'iscotzan', 'userPhoto-1473780150996', 'high-resolution-image-2.jpg', '.tmp\\uploads\\userPhoto-1473780150996', 2071491, '2016-09-13 15:22:31', '0'),
(64, 63, 'pink', 'iscotzan', 'userPhoto-1473780261051', 'Amazing-High-Resolution-Images-1.jpg', '.tmp\\uploads\\userPhoto-1473780261051', 1052882, '2016-09-13 15:24:21', '0'),
(65, 63, '#0e90d2', 'iscotzan', 'userPhoto-1473781437234', 'cNVNu5b.jpg', '.tmp\\uploads\\userPhoto-1473781437234', 129381, '2016-09-13 15:43:57', '0');

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `history_id` int(11) NOT NULL,
  `m_fk` int(11) DEFAULT NULL,
  `img_fk` int(11) DEFAULT NULL,
  `type` enum('text','image') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`history_id`, `m_fk`, `img_fk`, `type`) VALUES
(10, 314, NULL, 'text'),
(11, 315, NULL, 'text'),
(12, 316, NULL, 'text'),
(13, 317, NULL, 'text'),
(14, 318, NULL, 'text'),
(15, 319, NULL, 'text'),
(16, 320, NULL, 'text'),
(17, 321, NULL, 'text'),
(18, NULL, 61, 'image'),
(19, 322, NULL, 'text'),
(20, 323, NULL, 'text'),
(21, 324, NULL, 'text'),
(22, 325, NULL, 'text'),
(23, NULL, 62, 'image'),
(24, 326, NULL, 'text'),
(25, 327, NULL, 'text'),
(26, 328, NULL, 'text'),
(27, 329, NULL, 'text'),
(28, 330, NULL, 'text'),
(29, 331, NULL, 'text'),
(30, NULL, 63, 'image'),
(31, NULL, 64, 'image'),
(32, 332, NULL, 'text'),
(33, 333, NULL, 'text'),
(34, 334, NULL, 'text'),
(35, 335, NULL, 'text'),
(36, NULL, 65, 'image'),
(37, 336, NULL, 'text'),
(38, 337, NULL, 'text'),
(39, 338, NULL, 'text'),
(40, 339, NULL, 'text'),
(41, 340, NULL, 'text'),
(42, 341, NULL, 'text');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `u_id` int(11) NOT NULL,
  `u_email` varchar(100) NOT NULL,
  `u_password` varchar(255) NOT NULL,
  `u_username` varchar(30) NOT NULL,
  `u_registration_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isAdmin` enum('0','1') NOT NULL DEFAULT '0',
  `u_reg_hash` varchar(255) NOT NULL,
  `u_verified` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`u_id`, `u_email`, `u_password`, `u_username`, `u_registration_date`, `isAdmin`, `u_reg_hash`, `u_verified`) VALUES
(63, 'iscotzan@gmail.com', 'sha1$2f4fe092$1$31d3a23d0b0b359bee89d02092cdfe5807a07db5', 'iscotzan', '2016-09-04 12:47:21', '0', '0ac74b05866c2d7d13c2c17fdfd0e2f48c97ba7e', '1'),
(67, 'junkyard.tzan@gmail.com', 'sha1$119e7eaa$1$fcfd84ef8c6fb5b08a9b82e110e8d9ce0ab06512', 'regularUserName NothingSuspici', '2016-09-09 15:17:49', '0', 'd1d82856cfd3ed35fa86a123fa2da512de80fdb4', '1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`m_id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`img_id`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `m_fk` (`m_fk`),
  ADD KEY `img_fk` (`img_fk`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`u_id`),
  ADD UNIQUE KEY `u_email` (`u_email`),
  ADD UNIQUE KEY `u_username` (`u_username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `m_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=342;
--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `img_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;
--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `u_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `history`
--
ALTER TABLE `history`
  ADD CONSTRAINT `history_ibfk_1` FOREIGN KEY (`m_fk`) REFERENCES `chat_messages` (`m_id`),
  ADD CONSTRAINT `history_ibfk_2` FOREIGN KEY (`img_fk`) REFERENCES `files` (`img_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
