-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 02, 2025 at 05:45 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tutorvise_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` int(11) NOT NULL,
  `package_name` varchar(100) NOT NULL,
  `price_package` decimal(10,2) NOT NULL,
  `total_sessions` int(11) NOT NULL,
  `price_sessions` decimal(10,2) NOT NULL,
  `tutorial_type` enum('center-based','home-based') NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive','archived') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `package_name`, `price_package`, `total_sessions`, `price_sessions`, `tutorial_type`, `description`, `status`) VALUES
(1, 'Test Package', 1000.00, 5, 50.00, 'center-based', 'Test Description', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `student_profile`
--

CREATE TABLE `student_profile` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `parent_fname` varchar(50) DEFAULT NULL,
  `parent_mname` varchar(50) DEFAULT NULL,
  `parent_suffix` varchar(10) DEFAULT NULL,
  `parent_email` varchar(100) DEFAULT NULL,
  `parent_contact_no` varchar(20) DEFAULT NULL,
  `parent_lname` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_profile`
--

INSERT INTO `student_profile` (`id`, `user_id`, `parent_fname`, `parent_mname`, `parent_suffix`, `parent_email`, `parent_contact_no`, `parent_lname`) VALUES
(1, 2, 'Maria', 'Lopez', NULL, 'maria.lopez@example.com', '09171234567', 'Drake'),
(8, 13, 'James', '', '', 'DalaygonParent@gmail.com', '', 'Dalaygon'),
(12, 14, 'Angelita', 'Dacoylo', '', 'lita@email.com', '99999999999', 'Agot'),
(15, 16, '', '', '', '', '', ''),
(16, 27, 'Judith', 'Mahinay', NULL, 'judith@email.com', '09206124356', 'Peligrino'),
(17, 25, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `timeslots`
--

CREATE TABLE `timeslots` (
  `id` int(11) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` enum('Available','Booked','Unavailable','Pending') DEFAULT 'Available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `timeslots`
--

INSERT INTO `timeslots` (`id`, `tutor_id`, `start_time`, `end_time`, `status`, `created_at`) VALUES
(1, 3, '08:00:00', '10:00:00', 'Available', '2025-06-01 02:17:09'),
(2, 3, '14:00:00', '16:00:00', 'Available', '2025-06-01 02:17:09'),
(3, 15, '09:00:00', '11:00:00', 'Available', '2025-06-01 02:17:09'),
(4, 15, '13:00:00', '15:00:00', 'Booked', '2025-06-01 02:17:09'),
(5, 18, '10:00:00', '12:00:00', 'Available', '2025-06-01 02:17:09'),
(6, 18, '15:00:00', '17:00:00', 'Unavailable', '2025-06-01 02:17:09'),
(9, 24, '13:30:00', '15:30:00', 'Booked', '2025-06-01 02:17:09'),
(10, 24, '14:00:00', '15:00:00', 'Available', '2025-06-01 06:57:11'),
(11, 24, '15:40:00', '16:40:00', 'Available', '2025-06-01 07:09:20'),
(14, 15, '16:00:00', '17:00:00', 'Available', '2025-06-01 12:41:26'),
(15, 24, '17:00:00', '18:00:00', 'Available', '2025-06-02 03:10:52'),
(16, 24, '06:00:00', '07:00:00', 'Available', '2025-06-02 03:26:27'),
(17, 24, '08:00:00', '09:00:00', 'Available', '2025-06-02 03:37:54');

-- --------------------------------------------------------

--
-- Table structure for table `tutor_profile`
--

CREATE TABLE `tutor_profile` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `certification` varchar(255) DEFAULT NULL,
  `teaching_lvl` text DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `credentials` text DEFAULT NULL,
  `graduate_at` varchar(100) DEFAULT NULL,
  `major` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tutor_profile`
--

INSERT INTO `tutor_profile` (`id`, `user_id`, `certification`, `teaching_lvl`, `subject`, `credentials`, `graduate_at`, `major`) VALUES
(1, 3, 'TESOL Certified', 'elementary', 'Math, Science', '5 years of tutoring experience, online certifications', 'University of Example', 'Education'),
(2, 15, 'Certified Teacher according to Ma\'am Ligason', 'Ultimatum', 'Computer Studies', '5 years under ni ma\'am', 'Holy Name University', 'Bachelor of Science - Information Technology');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `account_type` enum('admin','student','tutor','admin staff') NOT NULL,
  `contact_no` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fname` varchar(50) DEFAULT NULL,
  `mname` varchar(50) DEFAULT NULL,
  `lname` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `suffix` varchar(10) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `profile_image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `account_type`, `contact_no`, `email`, `fname`, `mname`, `lname`, `created_at`, `updated_at`, `suffix`, `birthdate`, `status`, `profile_image_url`) VALUES
(1, 'admin_user', '$2b$10$BH8JMePy/8dX04JcAc09VuFFxMuBAEG6sGFWwuk8ev8hvURBHuIQO', 'admin', '09171234567', 'admin@example.com', 'Alice', 'Janiola', 'Admin', '2025-05-21 06:20:25', '2025-05-31 08:15:38', NULL, '1999-04-29', 'active', NULL),
(2, 'student_user', '$2b$10$QrHFRrpd5qj8/k6jZ68mpOpu7OGa.ImeUYZh4cabUbYG2LszKvrPG', 'student', '09171234568', 'student@example.com', 'Bobby', 'Cardascian', 'Drake', '2025-05-21 06:20:25', '2025-05-30 02:21:47', NULL, '1985-07-08', 'active', '1748571631260-IMG20250325074129.jpg'),
(3, 'tutor_user', '$2b$10$1u9dqrOqTDfkXqzanIBAzO6ikkEIOikssH5GD2xjkJn4Byi7/YGKO', 'tutor', '09171234569', 'tutor@example.com', 'Charlie', 'Dormamo', 'Monkey', '2025-05-21 06:20:25', '2025-05-29 00:04:03', NULL, '2001-08-13', 'active', NULL),
(13, 'student01', '$2b$10$zDAvnI0edKfqYScJ1uZswuz/yFADQLTwQrGdvzezLusL7WTb4PWbG', 'student', NULL, NULL, 'Lonie Jay', NULL, 'Dalaygon', '2025-05-28 11:03:43', '2025-05-28 11:03:43', NULL, '2007-04-28', 'active', NULL),
(14, 'test_student', '$2b$10$qeAjEewNyKQBq5Q25Jr3b.Dyacc94NAuqm3QK8cLsjYDFInSFJhRC', 'student', NULL, NULL, 'Patrick Dave', 'Dacoylo', 'Agot', '2025-05-28 12:17:21', '2025-05-28 12:52:57', NULL, '2025-05-09', 'active', NULL),
(15, 'another_tester', '$2b$10$gPBflAmKYw/8PeDDI4CZ..GhJTRObXiEPEH9XMSqf4x5rzraKbcwW', 'tutor', NULL, NULL, 'Karylle', NULL, 'Delantes', '2025-05-28 12:55:29', '2025-05-28 13:49:55', NULL, '2002-06-22', 'active', NULL),
(16, 'another_tester_todady', '$2b$10$hReu1YI.37QYlUb9kv7wbuO8HPA6bEFi5fULCaTXi8JY.F9prkXK.', 'student', NULL, NULL, 'Hannah Mae', NULL, 'Clerigo', '2025-05-29 00:03:35', '2025-05-29 00:03:35', NULL, '2001-03-14', 'active', NULL),
(17, 'jdoe', '$2b$10$2vDJaWf8ts/3O4yfdauF2efb6KWNNQD9Fv14TvJ7pMoNbxWqJ./lq', 'student', '09171234567', 'jdoe@example.com', 'John', 'A.', 'Doe', '2025-05-29 00:27:06', '2025-05-30 02:21:47', NULL, NULL, 'active', NULL),
(18, 'asmith', '$2b$10$9WcVy.QcHB7NlKwZVudcZOPzSfrSQ8zj3OQJsJjlrjAfquhP0KpXC', 'tutor', '09181234567', 'asmith@example.com', 'Anna', NULL, 'Smith', '2025-05-29 00:27:06', '2025-05-30 02:21:47', NULL, NULL, 'active', NULL),
(20, 'lrodriguez', '$2b$10$.6stjLZc2jgTm/tHbqlYFeHcsc3BEUYQZ0hvrmZw6XkxUd/HKoNCC', 'student', '09201234567', 'lara@example.com', 'Lara', 'C.', 'Rodriguez', '2025-05-29 00:27:06', '2025-05-30 02:21:47', NULL, NULL, 'active', NULL),
(21, 'cbrown', '$2b$10$vCoW29G.A/0DfrdvcTNcYeMPr4VYnChbEOt5iCRFfdHLF9uYR1FZu', 'tutor', '09211234567', 'cbrown@example.com', 'Chris', NULL, 'Brown', '2025-05-29 00:27:06', '2025-05-30 02:21:47', NULL, NULL, 'active', NULL),
(22, 'ktan', '$2b$10$andwU9Go51e8Xj8rvmhSru3NLAYW.EX/QYRBl8hRDhAjKc6WTX3Cq', 'admin staff', '09221234567', 'ktan@example.com', 'Kevin', 'D.', 'Tan', '2025-05-29 00:27:06', '2025-05-30 02:21:47', NULL, NULL, 'active', NULL),
(23, 'slopez', '$2b$10$LJ20S4gId0bb2yuZT8meO.pTJeshs49x8z.zswfo8xGg7eyEYCOyq', 'student', '09231234567', 'slopez@example.com', 'Sarah', NULL, 'Lopez', '2025-05-29 00:27:06', '2025-06-01 12:34:05', NULL, NULL, 'inactive', NULL),
(24, 'rgarcia', '$2b$10$edYQ1rPPQmUTqTY6ZFa20OAlO3ly6j2QndB/M/FF1vQmSQJ55WEXy', 'tutor', '09241234567', 'rgarcia@example.com', 'Ramon', 'E.', 'Garcia', '2025-05-29 00:27:06', '2025-05-30 02:21:48', NULL, NULL, 'active', NULL),
(25, 'nmartin', '$2b$10$uiuo6X6egQEWBDTwuw1mI.oCmNHWEPmPnNkE9rRHK.1805NeSs55S', 'student', '09251234567', 'nmartin@example.com', 'Nina', NULL, 'Martin', '2025-05-29 00:27:06', '2025-05-30 01:43:13', NULL, '2014-01-31', 'active', '1748569393811-crop 1.jpeg'),
(27, 'testing_student', '$2b$10$WKhC92Nq5XsL75fxWn4VSesL9SCruSlp42RT/U2lIo9zRA5Unv0dm', 'student', NULL, 'nvmpeligrino@gmail.com', 'Noel Vincent', 'Mahinay', 'Peligrino', '2025-05-29 12:18:24', '2025-05-30 00:02:30', NULL, '2001-08-31', 'active', '1748563350761-IMG20250325074129.jpg'),
(28, 'testing_another_user', '$2b$10$njzg9NjwwYLJI81J0JKNjuUvI3CnlH2lwD9S.OemL1M3Sx.9/.LwK', 'admin staff', NULL, NULL, 'Jonalisa', NULL, 'Calacar', '2025-05-30 01:55:16', '2025-05-30 01:56:51', NULL, '2025-05-29', 'active', '1748570211911-Pirma.png'),
(29, 'another_user', '$2b$10$WmZ0hh89T0ZxXJAlieBt5uynXoU9bqkSwoFWKw5gPnfTRZwj7EFh2', 'admin staff', NULL, NULL, 'Mary Jane', 'Uy', 'Yap', '2025-06-01 23:48:01', '2025-06-01 23:55:27', NULL, '2001-06-04', 'active', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_profile`
--
ALTER TABLE `student_profile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `timeslots`
--
ALTER TABLE `timeslots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tutor_id` (`tutor_id`);

--
-- Indexes for table `tutor_profile`
--
ALTER TABLE `tutor_profile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student_profile`
--
ALTER TABLE `student_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `timeslots`
--
ALTER TABLE `timeslots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `tutor_profile`
--
ALTER TABLE `tutor_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `student_profile`
--
ALTER TABLE `student_profile`
  ADD CONSTRAINT `student_profile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `timeslots`
--
ALTER TABLE `timeslots`
  ADD CONSTRAINT `timeslots_ibfk_1` FOREIGN KEY (`tutor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tutor_profile`
--
ALTER TABLE `tutor_profile`
  ADD CONSTRAINT `tutor_profile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
