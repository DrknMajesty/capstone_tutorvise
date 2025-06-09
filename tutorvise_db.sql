-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 10, 2025 at 01:15 AM
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
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `package_id` int(11) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `timeslot_id` int(11) NOT NULL,
  `snapshot_start_time` time NOT NULL,
  `snapshot_end_time` time NOT NULL,
  `application_status` enum('pending','approved','cancelled','expired','submitted') DEFAULT 'pending',
  `payment_proof` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `submitted_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `deadline` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `student_id`, `package_id`, `tutor_id`, `timeslot_id`, `snapshot_start_time`, `snapshot_end_time`, `application_status`, `payment_proof`, `created_at`, `submitted_at`, `expires_at`, `deadline`) VALUES
(64, 32, 4, 30, 26, '08:00:00', '09:00:00', 'approved', '1749477358681_images.png', '2025-06-09 13:55:47', '2025-06-09 21:55:58', '2025-07-09 22:00:57', '2025-06-09 21:56:47');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `session_date` date NOT NULL,
  `status` enum('pending','accepted','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `approved_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'Test Package 1', 1000.00, 5, 50.00, 'center-based', 'Test Description', 'active'),
(2, 'Test Package 2', 1000.00, 10, 100.00, 'center-based', 'Test Description', 'active'),
(3, 'Test Package 3', 1500.00, 5, 100.00, 'home-based', 'Test Description', 'active'),
(4, 'Test Package 4', 2000.00, 5, 100.00, 'home-based', 'Test Description AnotherTest Testing', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `application_id` int(11) NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `application_id`, `amount_paid`, `payment_date`) VALUES
(1, 64, 2000.01, '2025-06-09 14:00:57');

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `scheduled_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(18, 32, 'Lita', 'Dacoylo', NULL, NULL, NULL, 'Agot'),
(19, 33, 'Kenneth', NULL, NULL, NULL, NULL, 'Delantes'),
(20, 34, 'Test', 'Test', NULL, NULL, NULL, 'Test'),
(21, 35, 'Ryu', 'Test', NULL, NULL, NULL, 'Min-Seok'),
(22, 36, 'Test', 'Test', NULL, 'sample@email.com', NULL, 'Test');

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
(18, 3, '13:00:00', '14:00:00', 'Available', '2025-06-03 10:59:17'),
(20, 3, '12:00:00', '13:00:00', 'Available', '2025-06-03 11:01:34'),
(26, 30, '08:00:00', '09:00:00', 'Booked', '2025-06-03 11:28:03'),
(27, 30, '09:00:00', '10:00:00', 'Available', '2025-06-03 11:28:22'),
(28, 30, '10:00:00', '11:00:00', 'Available', '2025-06-03 11:28:35'),
(29, 31, '15:00:00', '16:00:00', 'Available', '2025-06-03 11:29:10'),
(30, 31, '16:00:00', '17:00:00', 'Available', '2025-06-03 11:29:17'),
(31, 31, '17:00:00', '18:00:00', 'Available', '2025-06-03 11:29:23'),
(32, 30, '11:00:00', '12:00:00', 'Available', '2025-06-08 12:46:19');

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
(3, 30, 'Certification of Awesomeness', 'Highschool & Elementary', 'Mathematics, English, & Science', '10 years tutoring experience', 'Holy Name University', 'Bachelor of Science - Information Technology'),
(4, 31, 'Certification Lang', 'Elementary', 'MAPEH', '10+ years tutoring experience', 'Holy Name University', 'Bachelor of Science -Computer Science');

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
(2, 'student_user', '$2b$10$7wrKAoUMBkQ0VWk2vaFnNOu7PhYUxasl9k5wJOUKI28EuJoJac.2C', 'student', '09171234568', 'student@example.com', 'Bobby', 'Cardascian', 'Drake', '2025-05-21 06:20:25', '2025-06-04 03:41:54', NULL, '1985-07-08', 'active', NULL),
(3, 'tutor_user', '$2b$10$1u9dqrOqTDfkXqzanIBAzO6ikkEIOikssH5GD2xjkJn4Byi7/YGKO', 'tutor', '09171234569', 'tutor@example.com', 'Charlie', 'Dormamo', 'Monkey', '2025-05-21 06:20:25', '2025-05-29 00:04:03', NULL, '2001-08-13', 'active', NULL),
(30, 'tutor01', '$2b$10$pm81ltgKNSUeBkLSVDj8qeylB.ehIEwbZDHUerbvBNd45aUA4oCRa', 'tutor', '09022165568', 'lonitoons@email.com', 'Lonie Jay', NULL, 'Dalaygon', '2025-06-03 11:18:36', '2025-06-06 12:38:49', NULL, '1998-05-15', 'active', '1748949516909-486514763_2746999672154243_625479284924812821_n.jpg'),
(31, 'tutor02', '$2b$10$w4RNHsboMA4AntykK4fAaOcmkHwwXrL86chLwZSzz2emx/JHCEsuG', 'tutor', '09994326789', 'hannah@email.com', 'Hannah Mae', NULL, 'Clerigo', '2025-06-03 11:20:22', '2025-06-03 11:20:22', NULL, '2001-03-14', 'active', '1748949622488-images.jpg'),
(32, 'student01', '$2b$10$1qSYWxFOPWi2Tw8mmPIMtOcjRc/KyK82k8tGT2LgN/C/W1kYEBpYu', 'student', NULL, 'pato@email.com', 'Patrick Dave', 'Dacoylo', 'Agot', '2025-06-03 11:25:15', '2025-06-04 13:02:29', NULL, '2001-05-09', 'active', '1749040918699-503360195_10089649337738304_2346311397319311664_n.jpg'),
(33, 'student02', '$2b$10$TgGT7kQaNOsPlggLBNPhiucjCkWhjSm3ZGDRqShZbqT8ZzBejxVAO', 'student', NULL, 'kai@email.com', 'Karylle', NULL, 'Delantes', '2025-06-03 11:25:55', '2025-06-08 12:10:15', NULL, '2001-06-22', 'active', '1748949955147-349096923_263125416256242_1892638932439863363_n.jpg'),
(34, 'sample', '$2b$10$y8PO2fFRkG8bziJjuL6Fw.bCF0Ezt3IoDhGFxhjzFmQDJEpgl4BCy', 'student', '09999999999', 'sample@email.com', 'Test', 'Test', 'Test', '2025-06-07 09:00:12', '2025-06-07 12:04:49', NULL, '2008-03-22', 'inactive', NULL),
(35, 'student03', '$2b$10$J6YUlz0Ppd4hB3YglSmO6uw14pKfJuz4XaLi2RTCZlF/ZmryxaTvS', 'student', '09999999999', 'student03@email.com', 'Ryu', 'Test', 'Min-Seok', '2025-06-08 12:13:31', '2025-06-08 12:13:31', NULL, '2008-03-22', 'active', NULL),
(36, 'student04', '$2b$10$mO7u9VATCZCjnPWxdqOp.OtEBOoSnF58jr23zSCuijlq3zhZ23Y1.', 'student', '09999999999', 'student04@email.com', 'Test', 'Test', 'Test', '2025-06-08 12:48:43', '2025-06-08 12:48:43', NULL, '2001-04-11', 'active', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `application_id` (`application_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `tutor_id` (`tutor_id`),
  ADD KEY `fk_approved_by` (`approved_by`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `application_id` (`application_id`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `tutor_id` (`tutor_id`),
  ADD KEY `student_id` (`student_id`);

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
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `student_profile`
--
ALTER TABLE `student_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `timeslots`
--
ALTER TABLE `timeslots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `tutor_profile`
--
ALTER TABLE `tutor_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`tutor_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`);

--
-- Constraints for table `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  ADD CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`tutor_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `schedules_ibfk_3` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`);

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
