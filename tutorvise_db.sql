-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 28, 2025 at 03:59 PM
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
  `paymentType` enum('full','partial') DEFAULT NULL,
  `tutor_id` int(11) NOT NULL,
  `timeslot_id` int(11) NOT NULL,
  `snapshot_start_time` time NOT NULL,
  `snapshot_end_time` time NOT NULL,
  `application_status` enum('pending','approved','cancelled','expired','submitted','done','partially_paid') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` datetime DEFAULT NULL,
  `deadline` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `student_id`, `package_id`, `paymentType`, `tutor_id`, `timeslot_id`, `snapshot_start_time`, `snapshot_end_time`, `application_status`, `created_at`, `expires_at`, `deadline`) VALUES
(154, 35, 1, 'partial', 30, 27, '09:00:00', '10:00:00', 'done', '2025-07-24 02:18:01', NULL, '2025-07-24 22:18:01'),
(155, 32, 6, 'full', 45, 38, '10:30:00', '11:30:00', 'done', '2025-07-24 02:52:43', NULL, '2025-07-24 22:52:43'),
(156, 33, 2, 'partial', 30, 32, '11:00:00', '12:00:00', 'done', '2025-07-24 06:26:41', NULL, '2025-07-25 02:26:41'),
(157, 36, 4, 'partial', 30, 33, '13:00:00', '14:00:00', 'done', '2025-07-25 01:35:43', NULL, '2025-07-25 21:35:43'),
(159, 40, 3, 'partial', 43, 42, '15:00:00', '16:00:00', 'expired', '2025-07-27 04:40:18', NULL, '2025-07-28 00:40:18'),
(161, 33, 6, 'partial', 3, 1, '08:00:00', '10:00:00', 'done', '2025-07-28 01:45:46', '2025-08-28 19:09:15', '2025-07-28 21:45:46'),
(162, 47, 3, 'partial', 46, 39, '13:00:00', '14:00:00', 'done', '2025-07-28 05:47:09', '2025-08-28 13:47:56', '2025-07-29 01:47:09'),
(163, 36, 4, 'full', 48, 46, '08:00:00', '09:00:00', 'done', '2025-07-28 11:38:05', '2025-08-28 19:38:32', '2025-07-29 07:38:05'),
(164, 40, 3, 'partial', 31, 29, '15:00:00', '16:00:00', 'done', '2025-07-28 11:41:24', '2025-08-28 19:41:57', '2025-07-29 07:41:24'),
(165, 41, 3, 'partial', 43, 42, '15:00:00', '16:00:00', 'done', '2025-07-28 11:52:38', '2025-08-28 19:52:49', '2025-07-29 07:52:38'),
(166, 32, 6, 'full', 30, 26, '08:00:00', '09:00:00', 'done', '2025-07-28 12:14:52', '2025-08-28 20:15:13', '2025-07-29 08:14:52'),
(167, 33, 4, 'partial', 31, 29, '15:00:00', '16:00:00', 'done', '2025-07-28 12:16:52', '2025-08-28 20:17:15', '2025-07-29 08:16:52'),
(168, 35, 6, 'full', 30, 26, '08:00:00', '09:00:00', 'done', '2025-07-28 12:20:41', '2025-08-28 20:20:53', '2025-07-29 08:20:41'),
(169, 40, 4, 'full', 31, 30, '16:00:00', '17:00:00', 'approved', '2025-07-28 13:50:33', '2025-08-28 21:50:59', '2025-07-29 09:50:33');

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `application_id`, `student_id`, `tutor_id`, `session_date`, `status`, `created_at`, `updated_at`) VALUES
(201, 157, 36, 30, '2025-08-04', 'accepted', '2025-07-27 04:36:08', '2025-07-27 05:10:08'),
(202, 157, 36, 30, '2025-08-05', 'accepted', '2025-07-27 05:24:12', '2025-07-27 05:26:14'),
(203, 157, 36, 30, '2025-08-06', 'accepted', '2025-07-27 05:24:12', '2025-07-27 05:26:16'),
(204, 157, 36, 30, '2025-08-07', 'accepted', '2025-07-27 05:24:12', '2025-07-27 05:26:17'),
(205, 157, 36, 30, '2025-08-08', 'accepted', '2025-07-27 05:24:12', '2025-07-27 05:30:02'),
(206, 155, 32, 45, '2025-08-11', 'accepted', '2025-07-27 05:52:34', '2025-07-27 05:54:02'),
(207, 155, 32, 45, '2025-08-12', 'accepted', '2025-07-27 05:52:34', '2025-07-27 05:54:49'),
(208, 155, 32, 45, '2025-08-13', 'accepted', '2025-07-27 05:52:34', '2025-07-27 05:55:42'),
(209, 155, 32, 45, '2025-08-14', 'accepted', '2025-07-27 05:52:34', '2025-07-27 05:55:46'),
(210, 155, 32, 45, '2025-08-15', 'accepted', '2025-07-27 05:52:34', '2025-07-27 05:55:48'),
(211, 156, 33, 30, '2025-07-28', 'accepted', '2025-07-27 06:00:49', '2025-07-27 06:01:10'),
(212, 156, 33, 30, '2025-07-29', 'accepted', '2025-07-27 06:00:49', '2025-07-27 06:01:11'),
(213, 156, 33, 30, '2025-07-30', 'accepted', '2025-07-27 06:00:49', '2025-07-27 06:01:14'),
(214, 156, 33, 30, '2025-08-18', 'accepted', '2025-07-27 06:02:07', '2025-07-27 06:02:20'),
(215, 156, 33, 30, '2025-08-19', 'accepted', '2025-07-27 06:02:07', '2025-07-27 06:02:22'),
(216, 156, 33, 30, '2025-08-20', 'accepted', '2025-07-27 06:02:07', '2025-07-27 06:02:24'),
(217, 156, 33, 30, '2025-08-21', 'accepted', '2025-07-27 06:02:07', '2025-07-27 06:02:26'),
(218, 156, 33, 30, '2025-08-22', 'accepted', '2025-07-27 06:02:07', '2025-07-27 06:02:28'),
(219, 156, 33, 30, '2025-08-23', 'accepted', '2025-07-27 06:02:07', '2025-07-27 06:02:29'),
(220, 156, 33, 30, '2025-08-30', 'accepted', '2025-07-27 06:02:07', '2025-07-27 06:02:31'),
(221, 154, 35, 30, '2025-08-04', 'accepted', '2025-07-28 05:25:48', '2025-07-28 05:35:01'),
(222, 154, 35, 30, '2025-08-05', 'accepted', '2025-07-28 05:25:48', '2025-07-28 05:35:06'),
(223, 154, 35, 30, '2025-08-06', 'accepted', '2025-07-28 05:25:48', '2025-07-28 05:35:07'),
(224, 154, 35, 30, '2025-08-07', 'accepted', '2025-07-28 05:25:48', '2025-07-28 05:35:09'),
(225, 154, 35, 30, '2025-08-08', 'accepted', '2025-07-28 05:25:48', '2025-07-28 05:35:10'),
(231, 162, 47, 46, '2025-08-25', 'accepted', '2025-07-28 05:48:13', '2025-07-28 05:48:39'),
(232, 162, 47, 46, '2025-08-26', 'accepted', '2025-07-28 05:48:13', '2025-07-28 05:48:40'),
(233, 162, 47, 46, '2025-08-27', 'accepted', '2025-07-28 05:48:13', '2025-07-28 05:48:41'),
(234, 162, 47, 46, '2025-08-28', 'accepted', '2025-07-28 05:48:13', '2025-07-28 05:48:42'),
(235, 162, 47, 46, '2025-08-29', 'accepted', '2025-07-28 05:48:13', '2025-07-28 05:48:44'),
(236, 161, 33, 3, '2025-08-04', 'accepted', '2025-07-28 11:32:18', '2025-07-28 11:33:44'),
(237, 161, 33, 3, '2025-08-05', 'accepted', '2025-07-28 11:32:18', '2025-07-28 11:33:46'),
(238, 161, 33, 3, '2025-08-06', 'accepted', '2025-07-28 11:32:18', '2025-07-28 11:33:47'),
(239, 161, 33, 3, '2025-08-07', 'accepted', '2025-07-28 11:32:18', '2025-07-28 11:33:48'),
(240, 161, 33, 3, '2025-08-08', 'accepted', '2025-07-28 11:32:18', '2025-07-28 11:33:50'),
(241, 163, 36, 48, '2025-08-11', 'accepted', '2025-07-28 11:40:22', '2025-07-28 11:40:34'),
(242, 163, 36, 48, '2025-08-12', 'accepted', '2025-07-28 11:40:22', '2025-07-28 11:40:36'),
(243, 163, 36, 48, '2025-08-13', 'accepted', '2025-07-28 11:40:22', '2025-07-28 11:40:39'),
(244, 163, 36, 48, '2025-08-14', 'accepted', '2025-07-28 11:40:22', '2025-07-28 11:40:40'),
(245, 163, 36, 48, '2025-08-15', 'accepted', '2025-07-28 11:40:22', '2025-07-28 11:40:43'),
(246, 164, 40, 31, '2025-08-18', 'accepted', '2025-07-28 11:42:34', '2025-07-28 11:43:20'),
(247, 164, 40, 31, '2025-08-19', 'accepted', '2025-07-28 11:42:34', '2025-07-28 11:43:22'),
(248, 164, 40, 31, '2025-08-20', 'accepted', '2025-07-28 11:42:34', '2025-07-28 11:43:26'),
(249, 164, 40, 31, '2025-08-21', 'accepted', '2025-07-28 11:42:34', '2025-07-28 11:43:28'),
(250, 164, 40, 31, '2025-08-22', 'accepted', '2025-07-28 11:42:34', '2025-07-28 11:43:29'),
(251, 165, 41, 43, '2025-09-01', 'accepted', '2025-07-28 11:52:59', '2025-07-28 11:53:56'),
(252, 165, 41, 43, '2025-09-02', 'accepted', '2025-07-28 11:52:59', '2025-07-28 11:53:57'),
(253, 165, 41, 43, '2025-09-03', 'accepted', '2025-07-28 11:52:59', '2025-07-28 11:54:11'),
(254, 165, 41, 43, '2025-09-04', 'accepted', '2025-07-28 11:52:59', '2025-07-28 11:54:14'),
(255, 165, 41, 43, '2025-09-05', 'accepted', '2025-07-28 11:52:59', '2025-07-28 11:54:15'),
(256, 166, 32, 30, '2025-09-22', 'accepted', '2025-07-28 12:15:33', '2025-07-28 12:15:59'),
(257, 166, 32, 30, '2025-09-23', 'accepted', '2025-07-28 12:15:33', '2025-07-28 12:16:00'),
(258, 166, 32, 30, '2025-09-24', 'accepted', '2025-07-28 12:15:33', '2025-07-28 12:16:01'),
(259, 166, 32, 30, '2025-09-25', 'accepted', '2025-07-28 12:15:33', '2025-07-28 12:16:02'),
(260, 166, 32, 30, '2025-09-26', 'accepted', '2025-07-28 12:15:33', '2025-07-28 12:16:20'),
(261, 167, 33, 31, '2025-10-20', 'accepted', '2025-07-28 12:17:50', '2025-07-28 12:18:11'),
(262, 167, 33, 31, '2025-10-21', 'accepted', '2025-07-28 12:17:50', '2025-07-28 12:18:12'),
(263, 167, 33, 31, '2025-10-22', 'accepted', '2025-07-28 12:17:50', '2025-07-28 12:18:24'),
(264, 167, 33, 31, '2025-10-23', 'accepted', '2025-07-28 12:17:50', '2025-07-28 12:18:25'),
(265, 167, 33, 31, '2025-10-24', 'accepted', '2025-07-28 12:17:50', '2025-07-28 12:18:26'),
(266, 168, 35, 30, '2025-11-03', 'accepted', '2025-07-28 12:21:07', '2025-07-28 12:21:25'),
(267, 168, 35, 30, '2025-11-04', 'accepted', '2025-07-28 12:21:07', '2025-07-28 12:21:26'),
(268, 168, 35, 30, '2025-11-05', 'accepted', '2025-07-28 12:21:07', '2025-07-28 12:21:27'),
(269, 168, 35, 30, '2025-11-06', 'accepted', '2025-07-28 12:21:07', '2025-07-28 12:21:28'),
(270, 168, 35, 30, '2025-11-07', 'accepted', '2025-07-28 12:21:07', '2025-07-28 12:21:38'),
(271, 169, 40, 31, '2025-08-25', 'cancelled', '2025-07-28 13:51:15', '2025-07-28 13:55:15'),
(272, 169, 40, 31, '2025-08-26', 'pending', '2025-07-28 13:51:15', '2025-07-28 13:51:15'),
(273, 169, 40, 31, '2025-08-27', 'pending', '2025-07-28 13:51:15', '2025-07-28 13:51:15'),
(274, 169, 40, 31, '2025-08-28', 'pending', '2025-07-28 13:51:15', '2025-07-28 13:51:15'),
(275, 169, 40, 31, '2025-08-29', 'pending', '2025-07-28 13:51:15', '2025-07-28 13:51:15');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `submitted_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `session_id`, `rating`, `comment`, `submitted_at`) VALUES
(48, 111, 5, 'Comment 1\n', '2025-07-28 13:08:47'),
(49, 112, 4, 'Amazing', '2025-07-28 13:08:54'),
(50, 113, 4, 'Cool', '2025-07-28 13:09:03'),
(51, 114, 5, 'Comment 2', '2025-07-28 13:10:09'),
(52, 115, 5, 'Great', '2025-07-28 13:10:16'),
(53, 116, 5, 'Amazing', '2025-07-28 13:10:25'),
(54, 117, 3, 'Good', '2025-07-28 13:10:29'),
(55, 118, 3, 'Satisfactory!', '2025-07-28 13:10:43'),
(56, 119, 5, 'Fantastic!', '2025-07-28 13:10:54'),
(57, 120, 5, 'Amazing!', '2025-07-28 13:11:38'),
(58, 106, 5, 'Yes', '2025-07-28 13:17:44'),
(59, 107, 5, 'I am proud', '2025-07-28 13:17:52'),
(60, 108, 5, 'you are a great teacher', '2025-07-28 13:18:01'),
(61, 110, 5, 'You are good', '2025-07-28 13:18:07'),
(62, 109, 5, 'You are great teacher', '2025-07-28 13:18:19'),
(63, 100, 5, 'good', '2025-07-28 13:32:01'),
(64, 101, 5, 'amazing', '2025-07-28 13:32:08'),
(65, 102, 4, 'great', '2025-07-28 13:32:17'),
(66, 103, 4, 'fasdfascxzbasfsdfasd', '2025-07-28 13:32:22'),
(67, 105, 3, 'somewhat good', '2025-07-28 13:32:30'),
(68, 121, 2, 'none', '2025-07-28 13:42:38'),
(69, 122, 3, 'fcadta vbunydsg', '2025-07-28 13:42:43'),
(70, 123, 1, 'bad', '2025-07-28 13:42:49'),
(71, 124, 3, 'vfa sdvnfbn,jhgdffd', '2025-07-28 13:42:54'),
(72, 125, 2, 'gggggg', '2025-07-28 13:43:01'),
(73, 126, 5, 'Good one', '2025-07-28 13:56:17'),
(74, 127, 4, 'Great', '2025-07-28 13:56:23'),
(75, 128, 4, 'Same as before', '2025-07-28 13:56:31'),
(76, 129, 5, 'legendary', '2025-07-28 13:56:43');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `is_read`, `created_at`) VALUES
(798, 32, 'Your application #139 has been cancelled.', 0, '2025-07-18 02:24:26'),
(799, 30, 'You have 5 new sessions booked by Karylle Delantes, scheduled from 2025-07-20 to 2025-07-24. Please check these in your booking page.', 0, '2025-07-18 07:18:24'),
(800, 33, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-07-20 to 2025-07-24. You may review them in your booking page.', 0, '2025-07-18 07:18:24'),
(801, 33, 'Your application #144 has been cancelled.', 0, '2025-07-21 07:02:43'),
(802, 33, 'Your application #145 has been cancelled.', 0, '2025-07-21 07:40:38'),
(803, 1, 'New partial payment proof submitted by Karylle Delantes', 1, '2025-07-21 07:40:58'),
(804, 33, 'Your application #146 has been approved. You have 30 days to booked dates for tutorial.', 0, '2025-07-21 07:42:38'),
(805, 1, 'New full payment proof submitted by Karylle Delantes', 1, '2025-07-21 07:48:06'),
(806, 33, 'Your application #147 has been approved. You have 30 days to booked dates for tutorial.', 0, '2025-07-21 07:48:29'),
(807, 1, 'New partial payment proof submitted by Karylle Delantes', 1, '2025-07-21 07:51:10'),
(808, 33, 'Your application #148 has been cancelled. Contact Admin for futher instructions.', 0, '2025-07-21 08:13:33'),
(809, 1, 'New partial payment proof submitted by Karylle Delantes', 1, '2025-07-21 08:16:56'),
(810, 33, 'Your application #148 has been approved. You have 30 days to booked dates for tutorial.', 0, '2025-07-21 08:17:42'),
(811, 1, 'New partial payment proof submitted by Karylle Delantes', 1, '2025-07-21 12:51:42'),
(812, 33, 'Your application #148 has been approved. You have 30 days to booked dates for tutorial.', 0, '2025-07-21 12:51:58'),
(813, 1, 'New partial payment proof submitted by Karylle Delantes', 1, '2025-07-21 12:53:15'),
(814, 1, 'New full payment proof submitted by Karylle Delantes', 1, '2025-07-21 13:10:40'),
(815, 1, 'New partial payment proof submitted by Patrick Dave Agot', 1, '2025-07-21 13:11:36'),
(816, 1, 'New partial payment proof submitted by Patrick Dave Agot', 1, '2025-07-23 09:12:14'),
(817, 1, 'New full payment proof submitted by Karylle Delantes', 1, '2025-07-23 09:53:11'),
(818, 1, 'New partial payment proof submitted by Patrick Dave Agot', 1, '2025-07-23 09:55:20'),
(819, 1, 'New partial payment proof submitted by Ryu Min-Seok', 1, '2025-07-24 02:05:20'),
(820, 1, 'New partial payment proof submitted by Ryu Min-Seok', 1, '2025-07-24 02:22:11'),
(821, 1, 'New partial payment proof submitted by Ryu Min-Seok', 1, '2025-07-24 02:50:17'),
(822, 1, 'New full payment proof submitted by Patrick Dave Agot', 1, '2025-07-24 02:53:03'),
(823, 1, 'New full payment proof submitted by Patrick Dave Agot', 1, '2025-07-24 02:58:52'),
(824, 1, 'New partial payment proof submitted by Karylle Delantes', 1, '2025-07-24 06:26:47'),
(825, 1, 'New partial payment proof submitted by Karylle Delantes', 1, '2025-07-24 06:43:34'),
(826, 1, 'New partial payment proof submitted by Karylle Delantes', 1, '2025-07-24 06:47:21'),
(827, 1, 'New partial payment proof submitted by Karylle Delantes', 1, '2025-07-24 07:02:54'),
(828, 1, 'New partial payment proof submitted by Andre Luis  Manalo', 1, '2025-07-25 01:35:58'),
(829, 1, 'New partial payment proof submitted by Andre Luis  Manalo', 1, '2025-07-25 01:37:42'),
(830, 1, 'New partial payment proof submitted by Tristan Jake Peligrino', 1, '2025-07-25 08:09:33'),
(831, 30, 'You have 5 new sessions booked by Andre Luis  Manalo, scheduled from 2025-09-01 to 2025-09-05. Please check these in your booking page.', 0, '2025-07-27 04:27:14'),
(832, 36, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-09-01 to 2025-09-05. You may review them in your booking page.', 0, '2025-07-27 04:27:14'),
(833, 30, 'You have 5 new sessions booked by Andre Luis  Manalo, scheduled from 2025-09-01 to 2025-09-05. Please check these in your booking page.', 0, '2025-07-27 04:27:23'),
(834, 36, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-09-01 to 2025-09-05. You may review them in your booking page.', 0, '2025-07-27 04:27:23'),
(835, 30, 'You have 5 new sessions booked by Andre Luis  Manalo, scheduled from 2025-08-04 to 2025-08-08. Please check these in your booking page.', 0, '2025-07-27 04:31:36'),
(836, 36, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-08-04 to 2025-08-08. You may review them in your booking page.', 0, '2025-07-27 04:31:36'),
(837, 30, 'You have 5 new sessions booked by Andre Luis  Manalo, scheduled from 2025-08-04 to 2025-08-08. Please check these in your booking page.', 0, '2025-07-27 04:33:08'),
(838, 36, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-08-04 to 2025-08-08. You may review them in your booking page.', 0, '2025-07-27 04:33:08'),
(839, 30, 'You have 1 new session booked by Andre Luis  Manalo, scheduled from 2025-08-04 to 2025-08-04. Please check these in your booking page.', 0, '2025-07-27 04:36:08'),
(840, 36, 'You have successfully booked 1 session with your tutor, scheduled from 2025-08-04 to 2025-08-04. You may review them in your booking page.', 0, '2025-07-27 04:36:08'),
(841, 36, 'Your booking for Monday, August 4, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-27 05:10:08'),
(842, 30, 'The booking of Andre Luis  Manalo on Monday, August 4, 2025 has been accepted.', 0, '2025-07-27 05:10:09'),
(843, 30, 'You have 4 new sessions booked by Andre Luis  Manalo, scheduled from 2025-08-05 to 2025-08-08. Please check these in your booking page.', 0, '2025-07-27 05:24:12'),
(844, 36, 'You have successfully booked 4 sessions with your tutor, scheduled from 2025-08-05 to 2025-08-08. You may review them in your booking page.', 0, '2025-07-27 05:24:12'),
(845, 36, 'Your booking for Tuesday, August 5, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-27 05:26:15'),
(846, 30, 'The booking of Andre Luis  Manalo on Tuesday, August 5, 2025 has been accepted.', 0, '2025-07-27 05:26:15'),
(847, 36, 'Your booking for Wednesday, August 6, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-27 05:26:16'),
(848, 30, 'The booking of Andre Luis  Manalo on Wednesday, August 6, 2025 has been accepted.', 0, '2025-07-27 05:26:17'),
(849, 36, 'Your booking for Thursday, August 7, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-27 05:26:19'),
(850, 30, 'The booking of Andre Luis  Manalo on Thursday, August 7, 2025 has been accepted.', 0, '2025-07-27 05:26:20'),
(851, 36, 'Your booking for Friday, August 8, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-27 05:30:03'),
(852, 30, 'The booking of Andre Luis  Manalo on Friday, August 8, 2025 has been accepted.', 0, '2025-07-27 05:30:03'),
(853, 45, 'You have 5 new sessions booked by Patrick Dave Agot, scheduled from 2025-08-11 to 2025-08-15. Please check these in your booking page.', 0, '2025-07-27 05:52:35'),
(854, 32, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-08-11 to 2025-08-15. You may review them in your booking page.', 0, '2025-07-27 05:52:36'),
(855, 32, 'Your booking for Monday, August 11, 2025 has been accepted by Eunice Faye Paja. Please be ready on your scheduled date.', 0, '2025-07-27 05:54:03'),
(856, 45, 'The booking of Patrick Dave Agot on Monday, August 11, 2025 has been accepted.', 0, '2025-07-27 05:54:03'),
(857, 32, 'Your booking for Tuesday, August 12, 2025 has been accepted by Eunice Faye Paja. Please be ready on your scheduled date.', 0, '2025-07-27 05:54:49'),
(858, 45, 'The booking of Patrick Dave Agot on Tuesday, August 12, 2025 has been accepted.', 0, '2025-07-27 05:54:49'),
(859, 32, 'Your booking for Wednesday, August 13, 2025 has been accepted by Eunice Faye Paja. Please be ready on your scheduled date.', 0, '2025-07-27 05:55:43'),
(860, 45, 'The booking of Patrick Dave Agot on Wednesday, August 13, 2025 has been accepted.', 0, '2025-07-27 05:55:44'),
(861, 32, 'Your booking for Thursday, August 14, 2025 has been accepted by Eunice Faye Paja. Please be ready on your scheduled date.', 0, '2025-07-27 05:55:46'),
(862, 45, 'The booking of Patrick Dave Agot on Thursday, August 14, 2025 has been accepted.', 0, '2025-07-27 05:55:47'),
(863, 32, 'Your booking for Friday, August 15, 2025 has been accepted by Eunice Faye Paja. Please be ready on your scheduled date.', 0, '2025-07-27 05:55:48'),
(864, 45, 'The booking of Patrick Dave Agot on Friday, August 15, 2025 has been accepted.', 0, '2025-07-27 05:55:49'),
(865, 32, 'Congratulations! All your bookings for this package \"New Package\" have been accepted. You can now apply another package.', 0, '2025-07-27 05:55:49'),
(866, 30, 'You have 3 new sessions booked by Karylle Delantes, scheduled from 2025-07-28 to 2025-07-30. Please check these in your booking page.', 0, '2025-07-27 06:00:49'),
(867, 33, 'You have successfully booked 3 sessions with your tutor, scheduled from 2025-07-28 to 2025-07-30. You may review them in your booking page.', 0, '2025-07-27 06:00:50'),
(868, 33, 'Your booking for Monday, July 28, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-27 06:01:10'),
(869, 30, 'The booking of Karylle Delantes on Monday, July 28, 2025 has been accepted.', 0, '2025-07-27 06:01:10'),
(870, 33, 'Your booking for Tuesday, July 29, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-27 06:01:13'),
(871, 30, 'The booking of Karylle Delantes on Tuesday, July 29, 2025 has been accepted.', 0, '2025-07-27 06:01:13'),
(872, 33, 'Your booking for Wednesday, July 30, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-27 06:01:15'),
(873, 30, 'The booking of Karylle Delantes on Wednesday, July 30, 2025 has been accepted.', 0, '2025-07-27 06:01:15'),
(874, 30, 'You have 7 new sessions booked by Karylle Delantes, scheduled from 2025-08-18 to 2025-08-30. Please check these in your booking page.', 0, '2025-07-27 06:02:08'),
(875, 33, 'You have successfully booked 7 sessions with your tutor, scheduled from 2025-08-18 to 2025-08-30. You may review them in your booking page.', 0, '2025-07-27 06:02:08'),
(876, 33, 'Your booking for Monday, August 18, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-27 06:02:21'),
(877, 30, 'The booking of Karylle Delantes on Monday, August 18, 2025 has been accepted.', 0, '2025-07-27 06:02:21'),
(878, 33, 'Your booking for Tuesday, August 19, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-27 06:02:22'),
(879, 30, 'The booking of Karylle Delantes on Tuesday, August 19, 2025 has been accepted.', 0, '2025-07-27 06:02:23'),
(880, 33, 'Your booking for Wednesday, August 20, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-27 06:02:25'),
(881, 30, 'The booking of Karylle Delantes on Wednesday, August 20, 2025 has been accepted.', 0, '2025-07-27 06:02:26'),
(882, 33, 'Your booking for Thursday, August 21, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-27 06:02:27'),
(883, 30, 'The booking of Karylle Delantes on Thursday, August 21, 2025 has been accepted.', 0, '2025-07-27 06:02:27'),
(884, 33, 'Your booking for Friday, August 22, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-27 06:02:28'),
(885, 30, 'The booking of Karylle Delantes on Friday, August 22, 2025 has been accepted.', 0, '2025-07-27 06:02:28'),
(886, 33, 'Your booking for Saturday, August 23, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-27 06:02:30'),
(887, 30, 'The booking of Karylle Delantes on Saturday, August 23, 2025 has been accepted.', 0, '2025-07-27 06:02:30'),
(888, 33, 'Your booking for Saturday, August 30, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-27 06:02:32'),
(889, 30, 'The booking of Karylle Delantes on Saturday, August 30, 2025 has been accepted.', 0, '2025-07-27 06:02:33'),
(890, 33, 'Congratulations! All your bookings for this package \"Test Package 2\" have been accepted. You can now apply another package.', 0, '2025-07-27 06:02:33'),
(891, 1, 'New partial payment proof submitted by Andre Luis  Manalo', 0, '2025-07-27 11:56:00'),
(892, 1, 'New partial payment proof submitted by Andre Luis  Manalo', 0, '2025-07-27 12:09:09'),
(893, 33, 'Reminder: You have a session scheduled on Monday, July 28, 2025 at 11:00 AM. Please be on time.', 0, '2025-07-28 01:45:00'),
(894, 30, 'Reminder: You have a session scheduled on Monday, July 28, 2025 at 11:00 AM. Please be on time.', 0, '2025-07-28 01:45:00'),
(895, 1, 'New partial payment proof submitted by Karylle Delantes', 0, '2025-07-28 01:46:00'),
(896, 1, 'New partial payment proof submitted by Karylle Delantes', 0, '2025-07-28 01:51:58'),
(897, 1, 'New partial payment proof submitted by Karylle Delantes', 0, '2025-07-28 01:58:15'),
(898, 1, 'New partial payment proof submitted by Karylle Delantes', 0, '2025-07-28 01:59:15'),
(899, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Thursday, July 31, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:51:18'),
(900, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Thursday, July 31, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:51:18'),
(901, 30, 'Your session with Karylle Delantes has been rescheduled to Thursday, July 31, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:51:20'),
(902, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Thursday, July 31, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:51:20'),
(903, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Tuesday, July 1, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:58:07'),
(904, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Tuesday, July 1, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:58:07'),
(905, 30, 'Your session with Karylle Delantes has been rescheduled to Tuesday, July 1, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:58:08'),
(906, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Tuesday, July 1, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:58:08'),
(907, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Wednesday, July 2, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:58:16'),
(908, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Wednesday, July 2, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:58:16'),
(909, 30, 'Your session with Karylle Delantes has been rescheduled to Wednesday, July 2, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:58:16'),
(910, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Wednesday, July 2, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:58:16'),
(911, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Thursday, July 3, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:58:23'),
(912, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Thursday, July 3, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:58:24'),
(913, 30, 'Your session with Karylle Delantes has been rescheduled to Thursday, July 3, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:58:25'),
(914, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Thursday, July 3, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:58:25'),
(915, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Thursday, July 3, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:58:25'),
(916, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Thursday, July 3, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:58:25'),
(917, 30, 'Your session with Karylle Delantes has been rescheduled to Thursday, July 3, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:58:25'),
(918, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Thursday, July 3, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:58:25'),
(919, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Friday, July 4, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:59:23'),
(920, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Friday, July 4, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:59:24'),
(921, 30, 'Your session with Karylle Delantes has been rescheduled to Friday, July 4, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:59:24'),
(922, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Friday, July 4, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:59:24'),
(923, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Saturday, July 5, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:59:36'),
(924, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Saturday, July 5, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:59:36'),
(925, 30, 'Your session with Karylle Delantes has been rescheduled to Saturday, July 5, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:59:36'),
(926, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Saturday, July 5, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:59:37'),
(927, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Sunday, July 6, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:59:52'),
(928, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Sunday, July 6, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:59:52'),
(929, 30, 'Your session with Karylle Delantes has been rescheduled to Sunday, July 6, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:59:52'),
(930, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Sunday, July 6, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 04:59:53'),
(931, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Monday, July 7, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 05:00:07'),
(932, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Monday, July 7, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 05:00:07'),
(933, 30, 'Your session with Karylle Delantes has been rescheduled to Monday, July 7, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 05:00:08'),
(934, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Monday, July 7, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 05:00:09'),
(935, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Tuesday, July 8, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 05:00:24'),
(936, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Tuesday, July 8, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 05:00:24'),
(937, 30, 'Your session with Karylle Delantes has been rescheduled to Tuesday, July 8, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 05:00:24'),
(938, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Tuesday, July 8, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 05:00:25'),
(939, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Wednesday, July 9, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 05:00:39'),
(940, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Wednesday, July 9, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 05:00:39'),
(941, 30, 'Your session with Karylle Delantes has been rescheduled to Wednesday, July 9, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 05:00:39'),
(942, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Wednesday, July 9, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 05:00:40'),
(943, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Thursday, July 10, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 05:01:14'),
(944, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Thursday, July 10, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 05:01:14'),
(945, 30, 'Your session with Karylle Delantes has been rescheduled to Thursday, July 10, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 05:01:15'),
(946, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Thursday, July 10, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-07-28 05:01:15'),
(947, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Andre Luis  Manalo to Sunday, June 1, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:01:35'),
(948, 36, 'Your session with Lonie Jay Dalaygon has been rescheduled to Sunday, June 1, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:01:35'),
(949, 30, 'Your session with Andre Luis  Manalo has been rescheduled to Sunday, June 1, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:01:36'),
(950, 1, 'Schedule between Andre Luis  Manalo and Lonie Jay Dalaygon has been rescheduled to Sunday, June 1, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:01:36'),
(951, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Andre Luis  Manalo to Monday, June 2, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:01:45'),
(952, 36, 'Your session with Lonie Jay Dalaygon has been rescheduled to Monday, June 2, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:01:45'),
(953, 30, 'Your session with Andre Luis  Manalo has been rescheduled to Monday, June 2, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:01:45'),
(954, 1, 'Schedule between Andre Luis  Manalo and Lonie Jay Dalaygon has been rescheduled to Monday, June 2, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:01:45'),
(955, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Andre Luis  Manalo to Tuesday, June 3, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:02:01'),
(956, 36, 'Your session with Lonie Jay Dalaygon has been rescheduled to Tuesday, June 3, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:02:01'),
(957, 30, 'Your session with Andre Luis  Manalo has been rescheduled to Tuesday, June 3, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:02:01'),
(958, 1, 'Schedule between Andre Luis  Manalo and Lonie Jay Dalaygon has been rescheduled to Tuesday, June 3, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:02:01'),
(959, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Andre Luis  Manalo to Wednesday, June 4, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:02:11'),
(960, 36, 'Your session with Lonie Jay Dalaygon has been rescheduled to Wednesday, June 4, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:02:11'),
(961, 30, 'Your session with Andre Luis  Manalo has been rescheduled to Wednesday, June 4, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:02:11'),
(962, 1, 'Schedule between Andre Luis  Manalo and Lonie Jay Dalaygon has been rescheduled to Wednesday, June 4, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:02:12'),
(963, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Andre Luis  Manalo to Thursday, June 5, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:02:21'),
(964, 36, 'Your session with Lonie Jay Dalaygon has been rescheduled to Thursday, June 5, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:02:22'),
(965, 30, 'Your session with Andre Luis  Manalo has been rescheduled to Thursday, June 5, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:02:23'),
(966, 1, 'Schedule between Andre Luis  Manalo and Lonie Jay Dalaygon has been rescheduled to Thursday, June 5, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:02:24'),
(967, 1, 'You rescheduled a session of Eunice Faye Paja & Patrick Dave Agot to Tuesday, June 10, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:02:54'),
(968, 32, 'Your session with Eunice Faye Paja has been rescheduled to Tuesday, June 10, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:02:54'),
(969, 45, 'Your session with Patrick Dave Agot has been rescheduled to Tuesday, June 10, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:02:54'),
(970, 1, 'Schedule between Patrick Dave Agot and Eunice Faye Paja has been rescheduled to Tuesday, June 10, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:02:54'),
(971, 1, 'You rescheduled a session of Eunice Faye Paja & Patrick Dave Agot to Wednesday, June 11, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:03'),
(972, 32, 'Your session with Eunice Faye Paja has been rescheduled to Wednesday, June 11, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:04'),
(973, 45, 'Your session with Patrick Dave Agot has been rescheduled to Wednesday, June 11, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:04'),
(974, 1, 'Schedule between Patrick Dave Agot and Eunice Faye Paja has been rescheduled to Wednesday, June 11, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:04'),
(975, 1, 'You rescheduled a session of Eunice Faye Paja & Patrick Dave Agot to Thursday, June 12, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:13'),
(976, 32, 'Your session with Eunice Faye Paja has been rescheduled to Thursday, June 12, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:13'),
(977, 45, 'Your session with Patrick Dave Agot has been rescheduled to Thursday, June 12, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:13'),
(978, 1, 'Schedule between Patrick Dave Agot and Eunice Faye Paja has been rescheduled to Thursday, June 12, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:13'),
(979, 1, 'You rescheduled a session of Eunice Faye Paja & Patrick Dave Agot to Saturday, June 14, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:22'),
(980, 32, 'Your session with Eunice Faye Paja has been rescheduled to Saturday, June 14, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:23'),
(981, 45, 'Your session with Patrick Dave Agot has been rescheduled to Saturday, June 14, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:23'),
(982, 1, 'Schedule between Patrick Dave Agot and Eunice Faye Paja has been rescheduled to Saturday, June 14, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:23'),
(983, 1, 'You rescheduled a session of Eunice Faye Paja & Patrick Dave Agot to Sunday, June 15, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:32'),
(984, 32, 'Your session with Eunice Faye Paja has been rescheduled to Sunday, June 15, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:32'),
(985, 45, 'Your session with Patrick Dave Agot has been rescheduled to Sunday, June 15, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:32'),
(986, 1, 'Schedule between Patrick Dave Agot and Eunice Faye Paja has been rescheduled to Sunday, June 15, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:33'),
(987, 1, 'You rescheduled a session of Eunice Faye Paja & Patrick Dave Agot to Friday, June 13, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:54'),
(988, 32, 'Your session with Eunice Faye Paja has been rescheduled to Friday, June 13, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:54'),
(989, 45, 'Your session with Patrick Dave Agot has been rescheduled to Friday, June 13, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:54'),
(990, 1, 'Schedule between Patrick Dave Agot and Eunice Faye Paja has been rescheduled to Friday, June 13, 2025, from 10:30 AM to 11:30 AM.', 0, '2025-07-28 05:03:54'),
(991, 1, 'You updated the session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 1, 2025 at 11:00 AM to \"Confirmed\".', 0, '2025-07-28 05:05:56'),
(992, 30, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 1, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:05:56'),
(993, 33, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 1, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:05:56'),
(994, 1, 'You updated the session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 2, 2025 at 11:00 AM to \"Confirmed\".', 0, '2025-07-28 05:06:01'),
(995, 30, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 2, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:01'),
(996, 33, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 2, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:01'),
(997, 1, 'You updated the session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 3, 2025 at 11:00 AM to \"Confirmed\".', 0, '2025-07-28 05:06:03'),
(998, 30, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 3, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:03'),
(999, 33, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 3, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:03'),
(1000, 1, 'You updated the session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 4, 2025 at 11:00 AM to \"Confirmed\".', 0, '2025-07-28 05:06:04'),
(1001, 30, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 4, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:04'),
(1002, 33, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 4, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:04'),
(1003, 1, 'You updated the session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 5, 2025 at 11:00 AM to \"Confirmed\".', 0, '2025-07-28 05:06:07'),
(1004, 30, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 5, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:07'),
(1005, 33, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 5, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:07'),
(1006, 1, 'You updated the session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 6, 2025 at 11:00 AM to \"Confirmed\".', 0, '2025-07-28 05:06:09'),
(1007, 30, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 6, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:09'),
(1008, 33, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 6, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:09'),
(1009, 1, 'You updated the session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 7, 2025 at 11:00 AM to \"Confirmed\".', 0, '2025-07-28 05:06:26'),
(1010, 30, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 7, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:26'),
(1011, 33, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 7, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:26'),
(1012, 1, 'You updated the session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 8, 2025 at 11:00 AM to \"Confirmed\".', 0, '2025-07-28 05:06:29'),
(1013, 30, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 8, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:29'),
(1014, 33, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 8, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:29'),
(1015, 1, 'You updated the session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 9, 2025 at 11:00 AM to \"Confirmed\".', 0, '2025-07-28 05:06:31'),
(1016, 30, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 9, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:31'),
(1017, 33, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 9, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:31'),
(1018, 30, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 10, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:33'),
(1019, 1, 'You updated the session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 10, 2025 at 11:00 AM to \"Confirmed\".', 0, '2025-07-28 05:06:33'),
(1020, 33, 'The session between Lonie Jay Dalaygon and Karylle Delantes scheduled on Jul 10, 2025 at 11:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:33'),
(1021, 1, 'You updated the session between Lonie Jay Dalaygon and Andre Luis  Manalo scheduled on Jun 1, 2025 at 1:00 PM to \"Confirmed\".', 0, '2025-07-28 05:06:40'),
(1022, 30, 'The session between Lonie Jay Dalaygon and Andre Luis  Manalo scheduled on Jun 1, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:40'),
(1023, 36, 'The session between Lonie Jay Dalaygon and Andre Luis  Manalo scheduled on Jun 1, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:40'),
(1024, 1, 'You updated the session between Lonie Jay Dalaygon and Andre Luis  Manalo scheduled on Jun 2, 2025 at 1:00 PM to \"Confirmed\".', 0, '2025-07-28 05:06:42'),
(1025, 30, 'The session between Lonie Jay Dalaygon and Andre Luis  Manalo scheduled on Jun 2, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:42'),
(1026, 36, 'The session between Lonie Jay Dalaygon and Andre Luis  Manalo scheduled on Jun 2, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:42'),
(1027, 1, 'You updated the session between Lonie Jay Dalaygon and Andre Luis  Manalo scheduled on Jun 3, 2025 at 1:00 PM to \"Confirmed\".', 0, '2025-07-28 05:06:44'),
(1028, 30, 'The session between Lonie Jay Dalaygon and Andre Luis  Manalo scheduled on Jun 3, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:44'),
(1029, 36, 'The session between Lonie Jay Dalaygon and Andre Luis  Manalo scheduled on Jun 3, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:44'),
(1030, 1, 'You updated the session between Lonie Jay Dalaygon and Andre Luis  Manalo scheduled on Jun 4, 2025 at 1:00 PM to \"Confirmed\".', 0, '2025-07-28 05:06:46'),
(1031, 30, 'The session between Lonie Jay Dalaygon and Andre Luis  Manalo scheduled on Jun 4, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:46'),
(1032, 36, 'The session between Lonie Jay Dalaygon and Andre Luis  Manalo scheduled on Jun 4, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:46'),
(1033, 1, 'You updated the session between Lonie Jay Dalaygon and Andre Luis  Manalo scheduled on Jun 5, 2025 at 1:00 PM to \"Confirmed\".', 0, '2025-07-28 05:06:48'),
(1034, 30, 'The session between Lonie Jay Dalaygon and Andre Luis  Manalo scheduled on Jun 5, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:48'),
(1035, 36, 'The session between Lonie Jay Dalaygon and Andre Luis  Manalo scheduled on Jun 5, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:06:48'),
(1036, 1, 'You updated the session between Eunice Faye Paja and Patrick Dave Agot scheduled on Jun 10, 2025 at 10:30 AM to \"Confirmed\".', 0, '2025-07-28 05:17:11'),
(1037, 32, 'The session between Eunice Faye Paja and Patrick Dave Agot scheduled on Jun 10, 2025 at 10:30 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:17:11'),
(1038, 45, 'The session between Eunice Faye Paja and Patrick Dave Agot scheduled on Jun 10, 2025 at 10:30 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:17:11'),
(1039, 1, 'You updated the session between Eunice Faye Paja and Patrick Dave Agot scheduled on Jun 11, 2025 at 10:30 AM to \"Confirmed\".', 0, '2025-07-28 05:17:13'),
(1040, 45, 'The session between Eunice Faye Paja and Patrick Dave Agot scheduled on Jun 11, 2025 at 10:30 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:17:13'),
(1041, 32, 'The session between Eunice Faye Paja and Patrick Dave Agot scheduled on Jun 11, 2025 at 10:30 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:17:13'),
(1042, 45, 'The session between Eunice Faye Paja and Patrick Dave Agot scheduled on Jun 12, 2025 at 10:30 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:17:14'),
(1043, 1, 'You updated the session between Eunice Faye Paja and Patrick Dave Agot scheduled on Jun 12, 2025 at 10:30 AM to \"Confirmed\".', 0, '2025-07-28 05:17:14'),
(1044, 32, 'The session between Eunice Faye Paja and Patrick Dave Agot scheduled on Jun 12, 2025 at 10:30 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:17:14'),
(1045, 1, 'You updated the session between Eunice Faye Paja and Patrick Dave Agot scheduled on Jun 14, 2025 at 10:30 AM to \"Confirmed\".', 0, '2025-07-28 05:17:16'),
(1046, 45, 'The session between Eunice Faye Paja and Patrick Dave Agot scheduled on Jun 14, 2025 at 10:30 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:17:16'),
(1047, 32, 'The session between Eunice Faye Paja and Patrick Dave Agot scheduled on Jun 14, 2025 at 10:30 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:17:16'),
(1048, 1, 'You updated the session between Eunice Faye Paja and Patrick Dave Agot scheduled on Jun 13, 2025 at 10:30 AM to \"Confirmed\".', 0, '2025-07-28 05:17:18'),
(1049, 45, 'The session between Eunice Faye Paja and Patrick Dave Agot scheduled on Jun 13, 2025 at 10:30 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:17:18'),
(1050, 32, 'The session between Eunice Faye Paja and Patrick Dave Agot scheduled on Jun 13, 2025 at 10:30 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:17:18'),
(1051, 30, 'You have 5 new sessions booked by Ryu Min-Seok, scheduled from 2025-08-04 to 2025-08-08. Please check these in your booking page.', 0, '2025-07-28 05:25:49'),
(1052, 35, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-08-04 to 2025-08-08. You may review them in your booking page.', 0, '2025-07-28 05:25:49'),
(1053, 35, 'Your booking for Monday, August 4, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-28 05:35:02'),
(1054, 30, 'The booking of Ryu Min-Seok on Monday, August 4, 2025 has been accepted.', 0, '2025-07-28 05:35:02'),
(1055, 35, 'Your booking for Tuesday, August 5, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-28 05:35:06'),
(1056, 30, 'The booking of Ryu Min-Seok on Tuesday, August 5, 2025 has been accepted.', 0, '2025-07-28 05:35:06'),
(1057, 35, 'Your booking for Wednesday, August 6, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-28 05:35:08'),
(1058, 30, 'The booking of Ryu Min-Seok on Wednesday, August 6, 2025 has been accepted.', 0, '2025-07-28 05:35:08'),
(1059, 35, 'Your booking for Thursday, August 7, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-28 05:35:09'),
(1060, 30, 'The booking of Ryu Min-Seok on Thursday, August 7, 2025 has been accepted.', 0, '2025-07-28 05:35:10'),
(1061, 35, 'Your booking for Friday, August 8, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-28 05:35:12'),
(1062, 30, 'The booking of Ryu Min-Seok on Friday, August 8, 2025 has been accepted.', 0, '2025-07-28 05:35:12'),
(1063, 35, 'Congratulations! All your bookings for this package \"Test Package 1\" have been accepted. You can now apply another package.', 0, '2025-07-28 05:35:12'),
(1064, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Ryu Min-Seok to Friday, July 4, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:35:37'),
(1065, 35, 'Your session with Lonie Jay Dalaygon has been rescheduled to Friday, July 4, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:35:37'),
(1066, 30, 'Your session with Ryu Min-Seok has been rescheduled to Friday, July 4, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:35:37'),
(1067, 1, 'Schedule between Ryu Min-Seok and Lonie Jay Dalaygon has been rescheduled to Friday, July 4, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:35:37'),
(1068, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Ryu Min-Seok to Saturday, July 5, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:35:46'),
(1069, 35, 'Your session with Lonie Jay Dalaygon has been rescheduled to Saturday, July 5, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:35:46'),
(1070, 30, 'Your session with Ryu Min-Seok has been rescheduled to Saturday, July 5, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:35:46'),
(1071, 1, 'Schedule between Ryu Min-Seok and Lonie Jay Dalaygon has been rescheduled to Saturday, July 5, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:35:47'),
(1072, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Ryu Min-Seok to Sunday, July 6, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:35:52'),
(1073, 35, 'Your session with Lonie Jay Dalaygon has been rescheduled to Sunday, July 6, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:35:52'),
(1074, 30, 'Your session with Ryu Min-Seok has been rescheduled to Sunday, July 6, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:35:52'),
(1075, 1, 'Schedule between Ryu Min-Seok and Lonie Jay Dalaygon has been rescheduled to Sunday, July 6, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:35:52'),
(1076, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Ryu Min-Seok to Monday, July 7, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:35:57'),
(1077, 35, 'Your session with Lonie Jay Dalaygon has been rescheduled to Monday, July 7, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:35:57'),
(1078, 30, 'Your session with Ryu Min-Seok has been rescheduled to Monday, July 7, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:35:57'),
(1079, 1, 'Schedule between Ryu Min-Seok and Lonie Jay Dalaygon has been rescheduled to Monday, July 7, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:35:58'),
(1080, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Ryu Min-Seok to Tuesday, July 8, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:36:04'),
(1081, 35, 'Your session with Lonie Jay Dalaygon has been rescheduled to Tuesday, July 8, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:36:05'),
(1082, 30, 'Your session with Ryu Min-Seok has been rescheduled to Tuesday, July 8, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:36:05'),
(1083, 1, 'Schedule between Ryu Min-Seok and Lonie Jay Dalaygon has been rescheduled to Tuesday, July 8, 2025, from 9:00 AM to 10:00 AM.', 0, '2025-07-28 05:36:05'),
(1084, 1, 'You updated the session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jul 4, 2025 at 9:00 AM to \"Confirmed\".', 0, '2025-07-28 05:41:55'),
(1085, 30, 'The session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jul 4, 2025 at 9:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:41:55'),
(1086, 35, 'The session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jul 4, 2025 at 9:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:41:55'),
(1087, 1, 'You updated the session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jul 5, 2025 at 9:00 AM to \"Confirmed\".', 0, '2025-07-28 05:41:57'),
(1088, 30, 'The session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jul 5, 2025 at 9:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:41:57'),
(1089, 35, 'The session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jul 5, 2025 at 9:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:41:57'),
(1090, 1, 'You updated the session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jul 6, 2025 at 9:00 AM to \"Confirmed\".', 0, '2025-07-28 05:41:59'),
(1091, 30, 'The session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jul 6, 2025 at 9:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:41:59'),
(1092, 35, 'The session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jul 6, 2025 at 9:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:41:59'),
(1093, 1, 'You updated the session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jul 7, 2025 at 9:00 AM to \"Confirmed\".', 0, '2025-07-28 05:42:01'),
(1094, 30, 'The session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jul 7, 2025 at 9:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:42:01'),
(1095, 35, 'The session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jul 7, 2025 at 9:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:42:01'),
(1096, 1, 'You updated the session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jul 8, 2025 at 9:00 AM to \"Confirmed\".', 0, '2025-07-28 05:42:02'),
(1097, 30, 'The session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jul 8, 2025 at 9:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:42:02'),
(1098, 35, 'The session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jul 8, 2025 at 9:00 AM has been updated to \"Confirmed\"', 0, '2025-07-28 05:42:02'),
(1099, 30, 'You have 5 new sessions booked by Tristan Jake Peligrino, scheduled from 2025-08-25 to 2025-08-29. Please check these in your booking page.', 0, '2025-07-28 05:44:37'),
(1100, 47, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-08-25 to 2025-08-29. You may review them in your booking page.', 0, '2025-07-28 05:44:38'),
(1101, 1, 'New partial payment proof submitted by Tristan Jake Peligrino', 0, '2025-07-28 05:47:29'),
(1102, 46, 'You have 5 new sessions booked by Tristan Jake Peligrino, scheduled from 2025-08-25 to 2025-08-29. Please check these in your booking page.', 0, '2025-07-28 05:48:13'),
(1103, 47, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-08-25 to 2025-08-29. You may review them in your booking page.', 0, '2025-07-28 05:48:14'),
(1104, 47, 'Your booking for Monday, August 25, 2025 has been accepted by Accelery  Narisma. Please be ready on your scheduled date.', 0, '2025-07-28 05:48:39'),
(1105, 46, 'The booking of Tristan Jake Peligrino on Monday, August 25, 2025 has been accepted.', 0, '2025-07-28 05:48:39'),
(1106, 47, 'Your booking for Tuesday, August 26, 2025 has been accepted by Accelery  Narisma. Please be ready on your scheduled date.', 0, '2025-07-28 05:48:40'),
(1107, 46, 'The booking of Tristan Jake Peligrino on Tuesday, August 26, 2025 has been accepted.', 0, '2025-07-28 05:48:40'),
(1108, 47, 'Your booking for Wednesday, August 27, 2025 has been accepted by Accelery  Narisma. Please be ready on your scheduled date.', 0, '2025-07-28 05:48:42'),
(1109, 46, 'The booking of Tristan Jake Peligrino on Wednesday, August 27, 2025 has been accepted.', 0, '2025-07-28 05:48:42'),
(1110, 47, 'Your booking for Thursday, August 28, 2025 has been accepted by Accelery  Narisma. Please be ready on your scheduled date.', 0, '2025-07-28 05:48:42'),
(1111, 46, 'The booking of Tristan Jake Peligrino on Thursday, August 28, 2025 has been accepted.', 0, '2025-07-28 05:48:43'),
(1112, 47, 'Your booking for Friday, August 29, 2025 has been accepted by Accelery  Narisma. Please be ready on your scheduled date.', 0, '2025-07-28 05:48:44'),
(1113, 46, 'The booking of Tristan Jake Peligrino on Friday, August 29, 2025 has been accepted.', 0, '2025-07-28 05:48:44'),
(1114, 1, 'You rescheduled a session of Accelery  Narisma & Tristan Jake Peligrino to Sunday, May 25, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:11'),
(1115, 47, 'Your session with Accelery  Narisma has been rescheduled to Sunday, May 25, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:11'),
(1116, 46, 'Your session with Tristan Jake Peligrino has been rescheduled to Sunday, May 25, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:11'),
(1117, 1, 'Schedule between Tristan Jake Peligrino and Accelery  Narisma has been rescheduled to Sunday, May 25, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:11'),
(1118, 1, 'You rescheduled a session of Accelery  Narisma & Tristan Jake Peligrino to Monday, May 26, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:19'),
(1119, 47, 'Your session with Accelery  Narisma has been rescheduled to Monday, May 26, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:20'),
(1120, 46, 'Your session with Tristan Jake Peligrino has been rescheduled to Monday, May 26, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:20'),
(1121, 1, 'Schedule between Tristan Jake Peligrino and Accelery  Narisma has been rescheduled to Monday, May 26, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:21'),
(1122, 1, 'You rescheduled a session of Accelery  Narisma & Tristan Jake Peligrino to Tuesday, May 27, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:27'),
(1123, 47, 'Your session with Accelery  Narisma has been rescheduled to Tuesday, May 27, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:28'),
(1124, 46, 'Your session with Tristan Jake Peligrino has been rescheduled to Tuesday, May 27, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:28'),
(1125, 1, 'Schedule between Tristan Jake Peligrino and Accelery  Narisma has been rescheduled to Tuesday, May 27, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:28'),
(1126, 1, 'You rescheduled a session of Accelery  Narisma & Tristan Jake Peligrino to Wednesday, May 28, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:34'),
(1127, 47, 'Your session with Accelery  Narisma has been rescheduled to Wednesday, May 28, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:34'),
(1128, 46, 'Your session with Tristan Jake Peligrino has been rescheduled to Wednesday, May 28, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:34'),
(1129, 1, 'Schedule between Tristan Jake Peligrino and Accelery  Narisma has been rescheduled to Wednesday, May 28, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:34');
INSERT INTO `notifications` (`id`, `user_id`, `message`, `is_read`, `created_at`) VALUES
(1130, 1, 'You rescheduled a session of Accelery  Narisma & Tristan Jake Peligrino to Thursday, May 29, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:40'),
(1131, 47, 'Your session with Accelery  Narisma has been rescheduled to Thursday, May 29, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:40'),
(1132, 46, 'Your session with Tristan Jake Peligrino has been rescheduled to Thursday, May 29, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:41'),
(1133, 1, 'Schedule between Tristan Jake Peligrino and Accelery  Narisma has been rescheduled to Thursday, May 29, 2025, from 1:00 PM to 2:00 PM.', 0, '2025-07-28 05:50:41'),
(1134, 1, 'You updated the session between Accelery  Narisma and Tristan Jake Peligrino scheduled on May 25, 2025 at 1:00 PM to \"Confirmed\".', 0, '2025-07-28 05:54:50'),
(1135, 47, 'The session between Accelery  Narisma and Tristan Jake Peligrino scheduled on May 25, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:54:50'),
(1136, 46, 'The session between Accelery  Narisma and Tristan Jake Peligrino scheduled on May 25, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:54:50'),
(1137, 46, 'The session between Accelery  Narisma and Tristan Jake Peligrino scheduled on May 26, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:54:53'),
(1138, 1, 'You updated the session between Accelery  Narisma and Tristan Jake Peligrino scheduled on May 26, 2025 at 1:00 PM to \"Confirmed\".', 0, '2025-07-28 05:54:53'),
(1139, 47, 'The session between Accelery  Narisma and Tristan Jake Peligrino scheduled on May 26, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:54:53'),
(1140, 1, 'You updated the session between Accelery  Narisma and Tristan Jake Peligrino scheduled on May 27, 2025 at 1:00 PM to \"Confirmed\".', 0, '2025-07-28 05:54:55'),
(1141, 46, 'The session between Accelery  Narisma and Tristan Jake Peligrino scheduled on May 27, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:54:55'),
(1142, 47, 'The session between Accelery  Narisma and Tristan Jake Peligrino scheduled on May 27, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:54:55'),
(1143, 1, 'You updated the session between Accelery  Narisma and Tristan Jake Peligrino scheduled on May 28, 2025 at 1:00 PM to \"Confirmed\".', 0, '2025-07-28 05:54:57'),
(1144, 46, 'The session between Accelery  Narisma and Tristan Jake Peligrino scheduled on May 28, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:54:57'),
(1145, 47, 'The session between Accelery  Narisma and Tristan Jake Peligrino scheduled on May 28, 2025 at 1:00 PM has been updated to \"Confirmed\"', 0, '2025-07-28 05:54:57'),
(1146, 46, 'The session between Accelery  Narisma and Tristan Jake Peligrino scheduled on May 29, 2025 at 1:00 PM has been updated to \"Missed\"', 0, '2025-07-28 05:54:59'),
(1147, 1, 'You updated the session between Accelery  Narisma and Tristan Jake Peligrino scheduled on May 29, 2025 at 1:00 PM to \"Missed\".', 0, '2025-07-28 05:54:59'),
(1148, 47, 'The session between Accelery  Narisma and Tristan Jake Peligrino scheduled on May 29, 2025 at 1:00 PM has been updated to \"Missed\"', 0, '2025-07-28 05:54:59'),
(1149, 3, 'You have 5 new sessions booked by Karylle Delantes, scheduled from 2025-08-04 to 2025-08-08. Please check these in your booking page.', 0, '2025-07-28 11:32:18'),
(1150, 33, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-08-04 to 2025-08-08. You may review them in your booking page.', 0, '2025-07-28 11:32:18'),
(1151, 33, 'Your booking for Monday, August 4, 2025 has been accepted by Charles Ivan Berou. Please be ready on your scheduled date.', 0, '2025-07-28 11:33:44'),
(1152, 3, 'The booking of Karylle Delantes on Monday, August 4, 2025 has been accepted.', 0, '2025-07-28 11:33:45'),
(1153, 33, 'Your booking for Tuesday, August 5, 2025 has been accepted by Charles Ivan Berou. Please be ready on your scheduled date.', 0, '2025-07-28 11:33:46'),
(1154, 3, 'The booking of Karylle Delantes on Tuesday, August 5, 2025 has been accepted.', 0, '2025-07-28 11:33:46'),
(1155, 33, 'Your booking for Wednesday, August 6, 2025 has been accepted by Charles Ivan Berou. Please be ready on your scheduled date.', 0, '2025-07-28 11:33:48'),
(1156, 3, 'The booking of Karylle Delantes on Wednesday, August 6, 2025 has been accepted.', 0, '2025-07-28 11:33:48'),
(1157, 33, 'Your booking for Thursday, August 7, 2025 has been accepted by Charles Ivan Berou. Please be ready on your scheduled date.', 0, '2025-07-28 11:33:48'),
(1158, 3, 'The booking of Karylle Delantes on Thursday, August 7, 2025 has been accepted.', 0, '2025-07-28 11:33:48'),
(1159, 33, 'Your booking for Friday, August 8, 2025 has been accepted by Charles Ivan Berou. Please be ready on your scheduled date.', 0, '2025-07-28 11:33:50'),
(1160, 3, 'The booking of Karylle Delantes on Friday, August 8, 2025 has been accepted.', 0, '2025-07-28 11:33:50'),
(1161, 1, 'New partial payment proof submitted by Karylle Delantes', 0, '2025-07-28 11:34:44'),
(1162, 1, 'New full payment proof submitted by Andre Luis  Manalo', 0, '2025-07-28 11:38:26'),
(1163, 48, 'You have 5 new sessions booked by Andre Luis  Manalo, scheduled from 2025-08-11 to 2025-08-15. Please check these in your booking page.', 0, '2025-07-28 11:40:22'),
(1164, 36, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-08-11 to 2025-08-15. You may review them in your booking page.', 0, '2025-07-28 11:40:22'),
(1165, 36, 'Your booking for Monday, August 11, 2025 has been accepted by Lurienz Lloren. Please be ready on your scheduled date.', 0, '2025-07-28 11:40:35'),
(1166, 48, 'The booking of Andre Luis  Manalo on Monday, August 11, 2025 has been accepted.', 0, '2025-07-28 11:40:35'),
(1167, 36, 'Your booking for Tuesday, August 12, 2025 has been accepted by Lurienz Lloren. Please be ready on your scheduled date.', 0, '2025-07-28 11:40:37'),
(1168, 48, 'The booking of Andre Luis  Manalo on Tuesday, August 12, 2025 has been accepted.', 0, '2025-07-28 11:40:38'),
(1169, 36, 'Your booking for Wednesday, August 13, 2025 has been accepted by Lurienz Lloren. Please be ready on your scheduled date.', 0, '2025-07-28 11:40:39'),
(1170, 48, 'The booking of Andre Luis  Manalo on Wednesday, August 13, 2025 has been accepted.', 0, '2025-07-28 11:40:39'),
(1171, 36, 'Your booking for Thursday, August 14, 2025 has been accepted by Lurienz Lloren. Please be ready on your scheduled date.', 0, '2025-07-28 11:40:41'),
(1172, 48, 'The booking of Andre Luis  Manalo on Thursday, August 14, 2025 has been accepted.', 0, '2025-07-28 11:40:42'),
(1173, 36, 'Your booking for Friday, August 15, 2025 has been accepted by Lurienz Lloren. Please be ready on your scheduled date.', 0, '2025-07-28 11:40:43'),
(1174, 48, 'The booking of Andre Luis  Manalo on Friday, August 15, 2025 has been accepted.', 0, '2025-07-28 11:40:43'),
(1175, 36, 'Congratulations! All your bookings for this package \"Test Package 4\" have been accepted. You can now apply another package.', 0, '2025-07-28 11:40:44'),
(1176, 1, 'New partial payment proof submitted by Alyssa Marie Santos', 0, '2025-07-28 11:41:33'),
(1177, 31, 'You have 5 new sessions booked by Alyssa Marie Santos, scheduled from 2025-08-18 to 2025-08-22. Please check these in your booking page.', 0, '2025-07-28 11:42:34'),
(1178, 40, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-08-18 to 2025-08-22. You may review them in your booking page.', 0, '2025-07-28 11:42:34'),
(1179, 40, 'Your booking for Monday, August 18, 2025 has been accepted by Hannah Amor Clerigo. Please be ready on your scheduled date.', 0, '2025-07-28 11:43:20'),
(1180, 31, 'The booking of Alyssa Marie Santos on Monday, August 18, 2025 has been accepted.', 0, '2025-07-28 11:43:21'),
(1181, 40, 'Your booking for Tuesday, August 19, 2025 has been accepted by Hannah Amor Clerigo. Please be ready on your scheduled date.', 0, '2025-07-28 11:43:24'),
(1182, 31, 'The booking of Alyssa Marie Santos on Tuesday, August 19, 2025 has been accepted.', 0, '2025-07-28 11:43:24'),
(1183, 40, 'Your booking for Wednesday, August 20, 2025 has been accepted by Hannah Amor Clerigo. Please be ready on your scheduled date.', 0, '2025-07-28 11:43:27'),
(1184, 31, 'The booking of Alyssa Marie Santos on Wednesday, August 20, 2025 has been accepted.', 0, '2025-07-28 11:43:27'),
(1185, 40, 'Your booking for Thursday, August 21, 2025 has been accepted by Hannah Amor Clerigo. Please be ready on your scheduled date.', 0, '2025-07-28 11:43:28'),
(1186, 31, 'The booking of Alyssa Marie Santos on Thursday, August 21, 2025 has been accepted.', 0, '2025-07-28 11:43:28'),
(1187, 40, 'Your booking for Friday, August 22, 2025 has been accepted by Hannah Amor Clerigo. Please be ready on your scheduled date.', 0, '2025-07-28 11:43:30'),
(1188, 31, 'The booking of Alyssa Marie Santos on Friday, August 22, 2025 has been accepted.', 0, '2025-07-28 11:43:30'),
(1189, 1, 'New partial payment proof submitted by Jace Emmanuel', 0, '2025-07-28 11:52:44'),
(1190, 43, 'You have 5 new sessions booked by Jace Emmanuel, scheduled from 2025-09-01 to 2025-09-05. Please check these in your booking page.', 0, '2025-07-28 11:53:00'),
(1191, 41, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-09-01 to 2025-09-05. You may review them in your booking page.', 0, '2025-07-28 11:53:00'),
(1192, 41, 'Your booking for Monday, September 1, 2025 has been accepted by Joy Kapirig. Please be ready on your scheduled date.', 0, '2025-07-28 11:53:56'),
(1193, 43, 'The booking of Jace Emmanuel on Monday, September 1, 2025 has been accepted.', 0, '2025-07-28 11:53:56'),
(1194, 41, 'Your booking for Tuesday, September 2, 2025 has been accepted by Joy Kapirig. Please be ready on your scheduled date.', 0, '2025-07-28 11:53:58'),
(1195, 43, 'The booking of Jace Emmanuel on Tuesday, September 2, 2025 has been accepted.', 0, '2025-07-28 11:53:59'),
(1196, 41, 'Your booking for Wednesday, September 3, 2025 has been accepted by Joy Kapirig. Please be ready on your scheduled date.', 0, '2025-07-28 11:54:12'),
(1197, 43, 'The booking of Jace Emmanuel on Wednesday, September 3, 2025 has been accepted.', 0, '2025-07-28 11:54:12'),
(1198, 41, 'Your booking for Thursday, September 4, 2025 has been accepted by Joy Kapirig. Please be ready on your scheduled date.', 0, '2025-07-28 11:54:14'),
(1199, 43, 'The booking of Jace Emmanuel on Thursday, September 4, 2025 has been accepted.', 0, '2025-07-28 11:54:14'),
(1200, 41, 'Your booking for Friday, September 5, 2025 has been accepted by Joy Kapirig. Please be ready on your scheduled date.', 0, '2025-07-28 11:54:15'),
(1201, 43, 'The booking of Jace Emmanuel on Friday, September 5, 2025 has been accepted.', 0, '2025-07-28 11:54:16'),
(1202, 1, 'New partial payment proof submitted by Jace Emmanuel', 0, '2025-07-28 11:59:38'),
(1203, 1, 'New partial payment proof submitted by Tristan Jake Peligrino', 0, '2025-07-28 12:08:54'),
(1204, 1, 'New partial payment proof submitted by Alyssa Marie Santos', 0, '2025-07-28 12:11:31'),
(1205, 1, 'New full payment proof submitted by Patrick Dave Agot', 0, '2025-07-28 12:15:00'),
(1206, 30, 'You have 5 new sessions booked by Patrick Dave Agot, scheduled from 2025-09-22 to 2025-09-26. Please check these in your booking page.', 0, '2025-07-28 12:15:33'),
(1207, 32, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-09-22 to 2025-09-26. You may review them in your booking page.', 0, '2025-07-28 12:15:33'),
(1208, 32, 'Your booking for Monday, September 22, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-28 12:15:59'),
(1209, 30, 'The booking of Patrick Dave Agot on Monday, September 22, 2025 has been accepted.', 0, '2025-07-28 12:15:59'),
(1210, 32, 'Your booking for Tuesday, September 23, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-28 12:16:00'),
(1211, 30, 'The booking of Patrick Dave Agot on Tuesday, September 23, 2025 has been accepted.', 0, '2025-07-28 12:16:00'),
(1212, 32, 'Your booking for Wednesday, September 24, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-28 12:16:01'),
(1213, 30, 'The booking of Patrick Dave Agot on Wednesday, September 24, 2025 has been accepted.', 0, '2025-07-28 12:16:01'),
(1214, 32, 'Your booking for Thursday, September 25, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-28 12:16:05'),
(1215, 30, 'The booking of Patrick Dave Agot on Thursday, September 25, 2025 has been accepted.', 0, '2025-07-28 12:16:06'),
(1216, 32, 'Your booking for Friday, September 26, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-28 12:16:20'),
(1217, 30, 'The booking of Patrick Dave Agot on Friday, September 26, 2025 has been accepted.', 0, '2025-07-28 12:16:21'),
(1218, 32, 'Congratulations! All your bookings for this package \"New Package\" have been accepted. You can now apply another package.', 0, '2025-07-28 12:16:21'),
(1219, 1, 'New partial payment proof submitted by Karylle Delantes', 0, '2025-07-28 12:16:59'),
(1220, 31, 'You have 5 new sessions booked by Karylle Delantes, scheduled from 2025-10-20 to 2025-10-24. Please check these in your booking page.', 0, '2025-07-28 12:17:50'),
(1221, 33, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-10-20 to 2025-10-24. You may review them in your booking page.', 0, '2025-07-28 12:17:51'),
(1222, 33, 'Your booking for Monday, October 20, 2025 has been accepted by Hannah Amor Clerigo. Please be ready on your scheduled date.', 0, '2025-07-28 12:18:11'),
(1223, 31, 'The booking of Karylle Delantes on Monday, October 20, 2025 has been accepted.', 0, '2025-07-28 12:18:11'),
(1224, 33, 'Your booking for Tuesday, October 21, 2025 has been accepted by Hannah Amor Clerigo. Please be ready on your scheduled date.', 0, '2025-07-28 12:18:13'),
(1225, 31, 'The booking of Karylle Delantes on Tuesday, October 21, 2025 has been accepted.', 0, '2025-07-28 12:18:13'),
(1226, 33, 'Your booking for Wednesday, October 22, 2025 has been accepted by Hannah Amor Clerigo. Please be ready on your scheduled date.', 0, '2025-07-28 12:18:24'),
(1227, 31, 'The booking of Karylle Delantes on Wednesday, October 22, 2025 has been accepted.', 0, '2025-07-28 12:18:24'),
(1228, 33, 'Your booking for Thursday, October 23, 2025 has been accepted by Hannah Amor Clerigo. Please be ready on your scheduled date.', 0, '2025-07-28 12:18:25'),
(1229, 31, 'The booking of Karylle Delantes on Thursday, October 23, 2025 has been accepted.', 0, '2025-07-28 12:18:25'),
(1230, 33, 'Your booking for Friday, October 24, 2025 has been accepted by Hannah Amor Clerigo. Please be ready on your scheduled date.', 0, '2025-07-28 12:18:26'),
(1231, 31, 'The booking of Karylle Delantes on Friday, October 24, 2025 has been accepted.', 0, '2025-07-28 12:18:26'),
(1232, 1, 'New partial payment proof submitted by Karylle Delantes', 0, '2025-07-28 12:19:57'),
(1233, 1, 'New full payment proof submitted by Ryu Min-Seok', 0, '2025-07-28 12:20:48'),
(1234, 30, 'You have 5 new sessions booked by Ryu Min-Seok, scheduled from 2025-11-03 to 2025-11-07. Please check these in your booking page.', 0, '2025-07-28 12:21:07'),
(1235, 35, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-11-03 to 2025-11-07. You may review them in your booking page.', 0, '2025-07-28 12:21:07'),
(1236, 35, 'Your booking for Monday, November 3, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-28 12:21:25'),
(1237, 30, 'The booking of Ryu Min-Seok on Monday, November 3, 2025 has been accepted.', 0, '2025-07-28 12:21:26'),
(1238, 35, 'Your booking for Tuesday, November 4, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-28 12:21:26'),
(1239, 30, 'The booking of Ryu Min-Seok on Tuesday, November 4, 2025 has been accepted.', 0, '2025-07-28 12:21:27'),
(1240, 35, 'Your booking for Wednesday, November 5, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-28 12:21:28'),
(1241, 35, 'Your booking for Thursday, November 6, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-28 12:21:29'),
(1242, 30, 'The booking of Ryu Min-Seok on Wednesday, November 5, 2025 has been accepted.', 0, '2025-07-28 12:21:29'),
(1243, 30, 'The booking of Ryu Min-Seok on Thursday, November 6, 2025 has been accepted.', 0, '2025-07-28 12:21:29'),
(1244, 35, 'Your booking for Friday, November 7, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-07-28 12:21:38'),
(1245, 30, 'The booking of Ryu Min-Seok on Friday, November 7, 2025 has been accepted.', 0, '2025-07-28 12:21:38'),
(1246, 35, 'Congratulations! All your bookings for this package \"New Package\" have been accepted. You can now apply another package.', 0, '2025-07-28 12:21:39'),
(1247, 1, 'New full payment proof submitted by Alyssa Marie Santos', 0, '2025-07-28 13:50:43'),
(1248, 31, 'You have 5 new sessions booked by Alyssa Marie Santos, scheduled from 2025-08-25 to 2025-08-29. Please check these in your booking page.', 0, '2025-07-28 13:51:15'),
(1249, 40, 'You have successfully booked 5 sessions with your tutor, scheduled from 2025-08-25 to 2025-08-29. You may review them in your booking page.', 0, '2025-07-28 13:51:16');

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
(4, 'Test Package 4', 2000.00, 5, 100.00, 'home-based', 'Test Description AnotherTest Testing 123123123', 'active'),
(5, 'Another Test package', 1000.00, 5, 250.00, 'center-based', '', 'inactive'),
(6, 'New Package', 1000.00, 5, 1000.00, 'home-based', 'Sample Description', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `application_id` int(11) NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_proof` varchar(255) DEFAULT NULL,
  `is_partial` tinyint(1) NOT NULL DEFAULT 0,
  `is_confirmed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `application_id`, `amount_paid`, `payment_date`, `payment_proof`, `is_partial`, `is_confirmed`) VALUES
(42, 154, 625.00, '2025-07-24 02:22:10', '1753323730858_IMG_4969.jpg', 1, 1),
(43, 154, 625.00, '2025-07-24 02:50:17', '1753325417562_IMG_4970.jpg', 1, 1),
(45, 155, 6000.00, '2025-07-24 02:58:52', '1753325932188_ChatGPT Image Jul 13, 2025, 02_10_59 PM.png', 0, 1),
(46, 156, 1000.00, '2025-07-24 06:26:47', '1753338407238_ChatGPT Image Jul 13, 2025, 02_10_59 PM.png', 1, 1),
(49, 156, 1000.00, '2025-07-24 07:02:54', '1753340574208_IMG_4969.jpg', 1, 1),
(50, 157, 1250.00, '2025-07-25 01:35:58', '1753407358067_IMG_4969.jpg', 1, 1),
(51, 157, 1250.00, '2025-07-25 01:37:42', '1753407462521_IMG_4968.jpg', 1, 1),
(58, 161, 3000.00, '2025-07-28 01:59:15', '1753667955199_Sample Image.png', 1, 1),
(59, 162, 1000.00, '2025-07-28 05:47:29', '1753681649051_istockphoto-480585465-612x612.jpg', 1, 1),
(60, 161, 3000.00, '2025-07-28 11:34:43', '1753702483753_ChatGPT Image Jul 13, 2025, 12_52_29 PM.png', 1, 1),
(61, 163, 2500.00, '2025-07-28 11:38:26', '1753702706360_IMG_4968.jpg', 0, 1),
(62, 164, 1000.00, '2025-07-28 11:41:32', '1753702892451_IMG_4970.jpg', 1, 1),
(63, 165, 1000.00, '2025-07-28 11:52:43', '1753703563406_IMG_4970.jpg', 1, 1),
(64, 165, 1000.00, '2025-07-28 11:59:37', '1753703977461_IMG_4970.jpg', 1, 1),
(65, 162, 1000.00, '2025-07-28 12:08:54', '1753704534364_IMG_4968.jpg', 1, 1),
(66, 164, 1000.00, '2025-07-28 12:11:31', '1753704691263_IMG_4970.jpg', 1, 1),
(67, 166, 6000.00, '2025-07-28 12:15:00', '1753704900401_IMG_4970.jpg', 0, 1),
(68, 167, 1250.00, '2025-07-28 12:16:58', '1753705018674_IMG_4967.jpg', 1, 1),
(69, 167, 1250.00, '2025-07-28 12:19:57', '1753705197027_IMG_4968.jpg', 1, 1),
(70, 168, 6000.00, '2025-07-28 12:20:47', '1753705247463_IMG_4970.jpg', 0, 1),
(71, 169, 2500.00, '2025-07-28 13:50:42', '1753710642927_IMG_4968.jpg', 0, 1);

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

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` (`id`, `booking_id`, `tutor_id`, `student_id`, `scheduled_date`, `start_time`, `end_time`, `created_at`) VALUES
(133, 201, 30, 36, '2025-06-01', '13:00:00', '14:00:00', '2025-07-27 05:10:08'),
(134, 202, 30, 36, '2025-06-02', '13:00:00', '14:00:00', '2025-07-27 05:26:14'),
(135, 203, 30, 36, '2025-06-03', '13:00:00', '14:00:00', '2025-07-27 05:26:16'),
(136, 204, 30, 36, '2025-06-04', '13:00:00', '14:00:00', '2025-07-27 05:26:18'),
(138, 205, 30, 36, '2025-06-05', '13:00:00', '14:00:00', '2025-07-27 05:30:02'),
(139, 206, 45, 32, '2025-06-10', '10:30:00', '11:30:00', '2025-07-27 05:54:02'),
(140, 207, 45, 32, '2025-06-11', '10:30:00', '11:30:00', '2025-07-27 05:54:49'),
(141, 208, 45, 32, '2025-06-12', '10:30:00', '11:30:00', '2025-07-27 05:55:42'),
(142, 209, 45, 32, '2025-06-14', '10:30:00', '11:30:00', '2025-07-27 05:55:46'),
(143, 210, 45, 32, '2025-06-13', '10:30:00', '11:30:00', '2025-07-27 05:55:48'),
(144, 211, 30, 33, '2025-07-01', '11:00:00', '12:00:00', '2025-07-27 06:01:10'),
(145, 212, 30, 33, '2025-07-02', '11:00:00', '12:00:00', '2025-07-27 06:01:12'),
(146, 213, 30, 33, '2025-07-03', '11:00:00', '12:00:00', '2025-07-27 06:01:14'),
(147, 214, 30, 33, '2025-07-04', '11:00:00', '12:00:00', '2025-07-27 06:02:20'),
(148, 215, 30, 33, '2025-07-05', '11:00:00', '12:00:00', '2025-07-27 06:02:22'),
(149, 216, 30, 33, '2025-07-06', '11:00:00', '12:00:00', '2025-07-27 06:02:25'),
(150, 217, 30, 33, '2025-07-07', '11:00:00', '12:00:00', '2025-07-27 06:02:27'),
(151, 218, 30, 33, '2025-07-08', '11:00:00', '12:00:00', '2025-07-27 06:02:28'),
(152, 219, 30, 33, '2025-07-09', '11:00:00', '12:00:00', '2025-07-27 06:02:29'),
(153, 220, 30, 33, '2025-07-10', '11:00:00', '12:00:00', '2025-07-27 06:02:31'),
(154, 221, 30, 35, '2025-07-04', '09:00:00', '10:00:00', '2025-07-28 05:35:01'),
(155, 222, 30, 35, '2025-07-05', '09:00:00', '10:00:00', '2025-07-28 05:35:06'),
(156, 223, 30, 35, '2025-07-06', '09:00:00', '10:00:00', '2025-07-28 05:35:08'),
(157, 224, 30, 35, '2025-07-07', '09:00:00', '10:00:00', '2025-07-28 05:35:09'),
(158, 225, 30, 35, '2025-07-08', '09:00:00', '10:00:00', '2025-07-28 05:35:11'),
(159, 231, 46, 47, '2025-05-25', '13:00:00', '14:00:00', '2025-07-28 05:48:39'),
(160, 232, 46, 47, '2025-05-26', '13:00:00', '14:00:00', '2025-07-28 05:48:40'),
(161, 233, 46, 47, '2025-05-27', '13:00:00', '14:00:00', '2025-07-28 05:48:41'),
(162, 234, 46, 47, '2025-05-28', '13:00:00', '14:00:00', '2025-07-28 05:48:42'),
(163, 235, 46, 47, '2025-05-29', '13:00:00', '14:00:00', '2025-07-28 05:48:44'),
(164, 236, 3, 33, '2025-08-04', '08:00:00', '10:00:00', '2025-07-28 11:33:44'),
(165, 237, 3, 33, '2025-08-05', '08:00:00', '10:00:00', '2025-07-28 11:33:46'),
(166, 238, 3, 33, '2025-08-06', '08:00:00', '10:00:00', '2025-07-28 11:33:47'),
(167, 239, 3, 33, '2025-08-07', '08:00:00', '10:00:00', '2025-07-28 11:33:48'),
(168, 240, 3, 33, '2025-08-08', '08:00:00', '10:00:00', '2025-07-28 11:33:50'),
(169, 241, 48, 36, '2025-08-11', '08:00:00', '09:00:00', '2025-07-28 11:40:34'),
(170, 242, 48, 36, '2025-08-12', '08:00:00', '09:00:00', '2025-07-28 11:40:37'),
(171, 243, 48, 36, '2025-08-13', '08:00:00', '09:00:00', '2025-07-28 11:40:39'),
(172, 244, 48, 36, '2025-08-14', '08:00:00', '09:00:00', '2025-07-28 11:40:41'),
(173, 245, 48, 36, '2025-08-15', '08:00:00', '09:00:00', '2025-07-28 11:40:43'),
(174, 246, 31, 40, '2025-08-18', '15:00:00', '16:00:00', '2025-07-28 11:43:20'),
(175, 247, 31, 40, '2025-08-19', '15:00:00', '16:00:00', '2025-07-28 11:43:24'),
(176, 248, 31, 40, '2025-08-20', '15:00:00', '16:00:00', '2025-07-28 11:43:26'),
(177, 249, 31, 40, '2025-08-21', '15:00:00', '16:00:00', '2025-07-28 11:43:28'),
(178, 250, 31, 40, '2025-08-22', '15:00:00', '16:00:00', '2025-07-28 11:43:30'),
(179, 251, 43, 41, '2025-09-01', '15:00:00', '16:00:00', '2025-07-28 11:53:56'),
(180, 252, 43, 41, '2025-09-02', '15:00:00', '16:00:00', '2025-07-28 11:53:58'),
(181, 253, 43, 41, '2025-09-03', '15:00:00', '16:00:00', '2025-07-28 11:54:11'),
(182, 254, 43, 41, '2025-09-04', '15:00:00', '16:00:00', '2025-07-28 11:54:14'),
(183, 255, 43, 41, '2025-09-05', '15:00:00', '16:00:00', '2025-07-28 11:54:15'),
(184, 256, 30, 32, '2025-09-22', '08:00:00', '09:00:00', '2025-07-28 12:15:59'),
(185, 257, 30, 32, '2025-09-23', '08:00:00', '09:00:00', '2025-07-28 12:16:00'),
(186, 258, 30, 32, '2025-09-24', '08:00:00', '09:00:00', '2025-07-28 12:16:01'),
(187, 259, 30, 32, '2025-09-25', '08:00:00', '09:00:00', '2025-07-28 12:16:03'),
(188, 260, 30, 32, '2025-09-26', '08:00:00', '09:00:00', '2025-07-28 12:16:20'),
(189, 261, 31, 33, '2025-10-20', '15:00:00', '16:00:00', '2025-07-28 12:18:11'),
(190, 262, 31, 33, '2025-10-21', '15:00:00', '16:00:00', '2025-07-28 12:18:12'),
(191, 263, 31, 33, '2025-10-22', '15:00:00', '16:00:00', '2025-07-28 12:18:24'),
(192, 264, 31, 33, '2025-10-23', '15:00:00', '16:00:00', '2025-07-28 12:18:25'),
(193, 265, 31, 33, '2025-10-24', '15:00:00', '16:00:00', '2025-07-28 12:18:26'),
(194, 266, 30, 35, '2025-11-03', '08:00:00', '09:00:00', '2025-07-28 12:21:25'),
(195, 267, 30, 35, '2025-11-04', '08:00:00', '09:00:00', '2025-07-28 12:21:26'),
(196, 268, 30, 35, '2025-11-05', '08:00:00', '09:00:00', '2025-07-28 12:21:27'),
(197, 269, 30, 35, '2025-11-06', '08:00:00', '09:00:00', '2025-07-28 12:21:28'),
(198, 270, 30, 35, '2025-11-07', '08:00:00', '09:00:00', '2025-07-28 12:21:38');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  `status` enum('upcoming','confirmed','missed','completed','ongoing') NOT NULL DEFAULT 'upcoming',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reminder_sent` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `schedule_id`, `status`, `created_at`, `updated_at`, `reminder_sent`) VALUES
(100, 133, 'confirmed', '2025-07-27 05:10:08', '2025-07-28 05:06:40', 0),
(101, 134, 'confirmed', '2025-07-27 05:26:14', '2025-07-28 05:06:42', 0),
(102, 135, 'confirmed', '2025-07-27 05:26:16', '2025-07-28 05:06:44', 0),
(103, 136, 'confirmed', '2025-07-27 05:26:18', '2025-07-28 05:06:46', 0),
(105, 138, 'confirmed', '2025-07-27 05:30:02', '2025-07-28 05:06:47', 0),
(106, 139, 'confirmed', '2025-07-27 05:54:02', '2025-07-28 05:17:11', 0),
(107, 140, 'confirmed', '2025-07-27 05:54:49', '2025-07-28 05:17:13', 0),
(108, 141, 'confirmed', '2025-07-27 05:55:42', '2025-07-28 05:17:14', 0),
(109, 142, 'confirmed', '2025-07-27 05:55:46', '2025-07-28 05:17:16', 0),
(110, 143, 'confirmed', '2025-07-27 05:55:48', '2025-07-28 05:17:18', 0),
(111, 144, 'confirmed', '2025-07-27 06:01:10', '2025-07-28 05:05:56', 1),
(112, 145, 'confirmed', '2025-07-27 06:01:12', '2025-07-28 05:06:00', 0),
(113, 146, 'confirmed', '2025-07-27 06:01:14', '2025-07-28 05:06:02', 0),
(114, 147, 'confirmed', '2025-07-27 06:02:20', '2025-07-28 05:06:04', 0),
(115, 148, 'confirmed', '2025-07-27 06:02:22', '2025-07-28 05:06:07', 0),
(116, 149, 'confirmed', '2025-07-27 06:02:25', '2025-07-28 05:06:09', 0),
(117, 150, 'confirmed', '2025-07-27 06:02:27', '2025-07-28 05:06:26', 0),
(118, 151, 'confirmed', '2025-07-27 06:02:28', '2025-07-28 05:06:28', 0),
(119, 152, 'confirmed', '2025-07-27 06:02:29', '2025-07-28 05:06:31', 0),
(120, 153, 'confirmed', '2025-07-27 06:02:31', '2025-07-28 05:06:33', 0),
(121, 154, 'confirmed', '2025-07-28 05:35:01', '2025-07-28 05:41:55', 0),
(122, 155, 'confirmed', '2025-07-28 05:35:06', '2025-07-28 05:41:57', 0),
(123, 156, 'confirmed', '2025-07-28 05:35:08', '2025-07-28 05:41:59', 0),
(124, 157, 'confirmed', '2025-07-28 05:35:09', '2025-07-28 05:42:00', 0),
(125, 158, 'confirmed', '2025-07-28 05:35:11', '2025-07-28 05:42:02', 0),
(126, 159, 'confirmed', '2025-07-28 05:48:39', '2025-07-28 05:54:50', 0),
(127, 160, 'confirmed', '2025-07-28 05:48:40', '2025-07-28 05:54:52', 0),
(128, 161, 'confirmed', '2025-07-28 05:48:41', '2025-07-28 05:54:54', 0),
(129, 162, 'confirmed', '2025-07-28 05:48:42', '2025-07-28 05:54:56', 0),
(130, 163, 'missed', '2025-07-28 05:48:44', '2025-07-28 05:54:58', 0),
(131, 164, 'upcoming', '2025-07-28 11:33:44', '2025-07-28 11:33:44', 0),
(132, 165, 'upcoming', '2025-07-28 11:33:46', '2025-07-28 11:33:46', 0),
(133, 166, 'upcoming', '2025-07-28 11:33:47', '2025-07-28 11:33:47', 0),
(134, 167, 'upcoming', '2025-07-28 11:33:48', '2025-07-28 11:33:48', 0),
(135, 168, 'upcoming', '2025-07-28 11:33:50', '2025-07-28 11:33:50', 0),
(136, 169, 'upcoming', '2025-07-28 11:40:34', '2025-07-28 11:40:34', 0),
(137, 170, 'upcoming', '2025-07-28 11:40:37', '2025-07-28 11:40:37', 0),
(138, 171, 'upcoming', '2025-07-28 11:40:39', '2025-07-28 11:40:39', 0),
(139, 172, 'upcoming', '2025-07-28 11:40:41', '2025-07-28 11:40:41', 0),
(140, 173, 'upcoming', '2025-07-28 11:40:43', '2025-07-28 11:40:43', 0),
(141, 174, 'upcoming', '2025-07-28 11:43:20', '2025-07-28 11:43:20', 0),
(142, 175, 'upcoming', '2025-07-28 11:43:24', '2025-07-28 11:43:24', 0),
(143, 176, 'upcoming', '2025-07-28 11:43:26', '2025-07-28 11:43:26', 0),
(144, 177, 'upcoming', '2025-07-28 11:43:28', '2025-07-28 11:43:28', 0),
(145, 178, 'upcoming', '2025-07-28 11:43:30', '2025-07-28 11:43:30', 0),
(146, 179, 'upcoming', '2025-07-28 11:53:56', '2025-07-28 11:53:56', 0),
(147, 180, 'upcoming', '2025-07-28 11:53:58', '2025-07-28 11:53:58', 0),
(148, 181, 'upcoming', '2025-07-28 11:54:11', '2025-07-28 11:54:11', 0),
(149, 182, 'upcoming', '2025-07-28 11:54:14', '2025-07-28 11:54:14', 0),
(150, 183, 'upcoming', '2025-07-28 11:54:15', '2025-07-28 11:54:15', 0),
(151, 184, 'upcoming', '2025-07-28 12:15:59', '2025-07-28 12:15:59', 0),
(152, 185, 'upcoming', '2025-07-28 12:16:00', '2025-07-28 12:16:00', 0),
(153, 186, 'upcoming', '2025-07-28 12:16:01', '2025-07-28 12:16:01', 0),
(154, 187, 'upcoming', '2025-07-28 12:16:03', '2025-07-28 12:16:03', 0),
(155, 188, 'upcoming', '2025-07-28 12:16:20', '2025-07-28 12:16:20', 0),
(156, 189, 'upcoming', '2025-07-28 12:18:11', '2025-07-28 12:18:11', 0),
(157, 190, 'upcoming', '2025-07-28 12:18:12', '2025-07-28 12:18:12', 0),
(158, 191, 'upcoming', '2025-07-28 12:18:24', '2025-07-28 12:18:24', 0),
(159, 192, 'upcoming', '2025-07-28 12:18:25', '2025-07-28 12:18:25', 0),
(160, 193, 'upcoming', '2025-07-28 12:18:26', '2025-07-28 12:18:26', 0),
(161, 194, 'upcoming', '2025-07-28 12:21:25', '2025-07-28 12:21:25', 0),
(162, 195, 'upcoming', '2025-07-28 12:21:26', '2025-07-28 12:21:26', 0),
(163, 196, 'upcoming', '2025-07-28 12:21:27', '2025-07-28 12:21:27', 0),
(164, 197, 'upcoming', '2025-07-28 12:21:29', '2025-07-28 12:21:29', 0),
(165, 198, 'upcoming', '2025-07-28 12:21:38', '2025-07-28 12:21:38', 0);

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
(22, 36, 'Andrea', 'Montenegro', NULL, 'manalo_andrea@email.com', '88888888888', 'Manalo'),
(23, 38, 'Testing_sec', 'Testing Middle Name', NULL, 'testing@email.com', '00000000000', 'Tesinglname'),
(24, 40, 'Marilyn', 'Dela Cruz', NULL, 'santos@email.com', '00000000000', 'Santos'),
(25, 41, 'Mel', 'Sombrio', NULL, 'parent01@email.com', '44444444444', 'Emmanuel'),
(26, 47, 'Noel Vincent', 'Mahinay', NULL, 'nvmpeligrino@gmail.com', '09206124365', 'Peligrino');

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
(26, 30, '08:00:00', '09:00:00', 'Available', '2025-06-03 11:28:03'),
(27, 30, '09:00:00', '10:00:00', 'Available', '2025-06-03 11:28:22'),
(29, 31, '15:00:00', '16:00:00', 'Available', '2025-06-03 11:29:10'),
(30, 31, '16:00:00', '17:00:00', 'Booked', '2025-06-03 11:29:17'),
(31, 31, '17:00:00', '18:00:00', 'Available', '2025-06-03 11:29:23'),
(32, 30, '11:00:00', '12:00:00', 'Available', '2025-06-08 12:46:19'),
(33, 30, '13:00:00', '14:00:00', 'Available', '2025-06-25 02:23:36'),
(34, 30, '14:00:00', '15:00:00', 'Available', '2025-06-25 02:23:45'),
(35, 30, '16:00:00', '17:00:00', 'Available', '2025-06-25 02:24:11'),
(36, 45, '08:00:00', '09:00:00', 'Available', '2025-07-13 05:05:04'),
(37, 45, '09:15:00', '10:15:00', 'Available', '2025-07-13 05:05:18'),
(38, 45, '10:30:00', '11:30:00', 'Available', '2025-07-13 05:07:09'),
(39, 46, '13:00:00', '14:00:00', 'Available', '2025-07-13 05:07:25'),
(40, 46, '14:10:00', '15:10:00', 'Available', '2025-07-13 05:07:36'),
(41, 46, '15:20:00', '16:20:00', 'Available', '2025-07-13 05:07:44'),
(42, 43, '15:00:00', '16:00:00', 'Available', '2025-07-13 05:08:11'),
(43, 43, '16:00:00', '17:00:00', 'Available', '2025-07-13 05:08:17'),
(44, 43, '17:00:00', '18:00:00', 'Available', '2025-07-13 05:08:22'),
(45, 45, '12:00:00', '13:00:00', 'Available', '2025-07-14 03:56:18'),
(46, 48, '08:00:00', '09:00:00', 'Available', '2025-07-28 11:22:01');

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
  `experiences` varchar(255) DEFAULT NULL,
  `graduate_at` varchar(100) DEFAULT NULL,
  `major` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tutor_profile`
--

INSERT INTO `tutor_profile` (`id`, `user_id`, `certification`, `teaching_lvl`, `subject`, `experiences`, `graduate_at`, `major`) VALUES
(1, 3, 'TESOL Certified', 'elementary', 'Math, Science', '5 years of tutoring experience, online certifications', 'University of Example', 'Education'),
(3, 30, 'Certification of Awesomeness', 'Highschool & Elementary', 'Mathematics, English, & Science', '10 years tutoring experience', 'Holy Name University', 'Bachelor of Science - Information Technology'),
(4, 31, 'Certification Lang', 'Elementary', 'MAPEH', '10+ years tutoring experience', 'Holy Name University', 'Bachelor of Science -Computer Science'),
(5, 43, 'Certification of Excellence', 'Highschool & Elementary', 'Mathematics', '2 years at tutorial center ', 'University of Bohol', 'Computer Engineering'),
(6, 45, 'Tutorial Training Program Certification of Completion', 'Grade School', 'Reading and Writing', '2 years at the tutorial center as a part timer', 'Holy Name University', 'Bachelor of Technology and Livelihood Education major in Home Economics '),
(7, 46, 'Accredited Private Educator', 'Highschool', 'Mathematics, English, & Science', 'Work for 2 years as a part time tutor', 'Bohol Island State University', 'Engineering'),
(8, 48, 'sample cert', 'College', 'Mathematics', '2 years of experience', 'University of Bohol', 'Computer Engineering');

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
  `profile_image_url` varchar(255) DEFAULT NULL,
  `gender` enum('male','female') NOT NULL DEFAULT 'male'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `account_type`, `contact_no`, `email`, `fname`, `mname`, `lname`, `created_at`, `updated_at`, `suffix`, `birthdate`, `status`, `profile_image_url`, `gender`) VALUES
(1, 'admin_user', '$2b$10$yVDLQqDNYSwy8SjcQfcc2OQRr/ba26emFrE0tBGySlpMBKT2AycOy', 'admin', '09171234567', 'admin@example.com', 'Ramon Einstein', NULL, 'Acuña', '2025-05-21 06:20:25', '2025-07-14 03:49:11', NULL, '1984-08-27', 'active', '1752388550142-516885559_713790758105074_7398513285810909774_n.jpg', 'male'),
(2, 'student_user', '$2b$10$7wrKAoUMBkQ0VWk2vaFnNOu7PhYUxasl9k5wJOUKI28EuJoJac.2C', 'student', '09171234568', 'student@example.com', 'Bobby', 'Cardascian', 'Drake', '2025-05-21 06:20:25', '2025-06-04 03:41:54', NULL, '1985-07-08', 'active', NULL, 'male'),
(3, 'tutor_user', '$2b$10$/Dt26YEkUbD6/7DmT1kD/.9HxrIXK5geHq2juiMaHxSYRgL1bIhqO', 'tutor', '09171234569', 'tutor@example.com', 'Charles Ivan', NULL, 'Berou', '2025-05-21 06:20:25', '2025-07-28 11:33:02', NULL, '2001-08-13', 'active', '1752384291063-57c5ed6c-f253-419b-bbb0-fa1e468173db.png', 'male'),
(30, 'tutor01', '$2b$10$FYpGiof5NPhnlAxOuAxYzuWLJueHo4txs5MiuRXqSU29GvOJbFTQu', 'tutor', '09022165569', 'lonitoon@email.com', 'Lonie Jay', NULL, 'Dalaygon', '2025-06-03 11:18:36', '2025-07-17 01:38:00', NULL, '1998-05-15', 'active', '1748949516909-486514763_2746999672154243_625479284924812821_n.jpg', 'male'),
(31, 'tutor02', '$2b$10$eh0fWwJ/vFV.ZDotJGV0Cu27UAwLm6HTj8DeEEobSe/WKkG8y7efW', 'tutor', '09994326789', 'hannah@email.com', 'Hannah Amor', NULL, 'Clerigo', '2025-06-03 11:20:22', '2025-06-20 01:52:23', NULL, '2001-03-14', 'active', '1748949622488-images.jpg', 'female'),
(32, 'student01', '$2b$10$T4/RA.3EqpdcJMIdk6x2DO0cGPcyyddDypaVYW1Q4pkieVdU1CExC', 'student', '11111111111', 'pato@juniorhighschool.com', 'Patrick Dave', 'Dacoylo', 'Agot', '2025-06-03 11:25:15', '2025-07-16 14:22:53', NULL, '2001-05-09', 'active', '1749040918699-503360195_10089649337738304_2346311397319311664_n.jpg', 'male'),
(33, 'student02', '$2b$10$ZsKi0Kf/u5IQdBn9HTHiquGlVj2WK9iyAQrzMPG5UGRR1NtloWG9G', 'student', NULL, 'kai@email.com', 'Karylle', NULL, 'Delantes', '2025-06-03 11:25:55', '2025-07-16 08:11:31', NULL, '2001-06-22', 'active', '1748949955147-349096923_263125416256242_1892638932439863363_n.jpg', 'female'),
(34, 'sample', '$2b$10$y8PO2fFRkG8bziJjuL6Fw.bCF0Ezt3IoDhGFxhjzFmQDJEpgl4BCy', 'student', '09999999999', 'sample@email.com', 'Test', 'Test', 'Test', '2025-06-07 09:00:12', '2025-06-07 12:04:49', NULL, '2008-03-22', 'inactive', NULL, 'male'),
(35, 'student03', '$2b$10$J6YUlz0Ppd4hB3YglSmO6uw14pKfJuz4XaLi2RTCZlF/ZmryxaTvS', 'student', '09999999999', 'student03@email.com', 'Ryu', 'Test', 'Min-Seok', '2025-06-08 12:13:31', '2025-06-08 12:13:31', NULL, '2008-03-22', 'active', NULL, 'male'),
(36, 'student04', '$2b$10$Nslb5amb5X2PkZkr6a910erFIb1fVsLLauhd7jbfAKKSMTODT6GbC', 'student', '09999999999', 'student04@email.com', 'Andre Luis', 'Ferrer', ' Manalo', '2025-06-08 12:48:43', '2025-07-12 13:51:20', NULL, '2001-04-11', 'active', NULL, 'male'),
(37, 'admin_staff', '$2b$10$24EBR2uFytjxEil85f/BReQ/fIe58VGISM2lfsT8/JI0drJumk41i', 'admin staff', '09206265432', 'staff@email.com', 'Jonalisa', NULL, 'Calacar', '2025-06-18 07:00:38', '2025-06-20 01:52:41', NULL, '2025-06-05', 'active', NULL, 'female'),
(38, 'student_test', '$2b$10$bZz7mXAV8aPkl.trjinC2ulN1GS0fY.HVHHn3R/l4lfShH/BIy9c6', 'student', '09999999998', 'testing@email.com', 'Testing_sec', NULL, 'Tesinglname', '2025-06-18 07:54:08', '2025-06-22 15:17:12', NULL, '2004-05-22', 'active', NULL, 'male'),
(39, 'Testing_user', '$2b$10$HHIFm2Oqg2XpizrdUb0XQ.0skb4MYAMvcmRlc1CpM2NI6UvF/cwRi', 'admin staff', NULL, 'sample@email.com', 'Test', 'Test', 'Test', '2025-06-20 01:56:42', '2025-06-20 01:56:42', NULL, '2025-06-03', 'active', NULL, 'female'),
(40, 'student05', '$2b$10$hLZtmtYYGRbAeimqt6ttz.bM64nGZS.hqlZfmuwzFIajCzDqnEf32', 'student', '00000000000', 'student05@email.com', 'Alyssa Marie', 'Dela Cruz', 'Santos', '2025-06-20 02:38:08', '2025-07-12 13:51:06', NULL, '2004-03-11', 'active', NULL, 'female'),
(41, 'student06', '$2b$10$IavphvhwtwORDP1j.oCzjumA54KkPrihMfZlbMY252vyVvLEi0.jG', 'student', '00000000000', 'student06@email.com', 'Jace', 'Sombrio', 'Emmanuel', '2025-06-25 11:27:14', '2025-07-12 13:51:46', NULL, '2002-05-22', 'active', NULL, 'male'),
(42, 'test_staff', '$2b$10$Swo6WjtIQjouzKI8qr9QLu4FRAPMOcBuWbfyOyI4RXI2M8OzApwN.', 'admin staff', NULL, 'SAmple@email.com', 'John Ralph', NULL, 'Lanaja', '2025-06-28 11:25:56', '2025-06-29 12:53:31', NULL, '2004-04-03', 'active', NULL, 'male'),
(43, 'tutor03', '$2b$10$Fe5E71IGtgW1i.u16E0B5uOeGrnWrL8SNVyh2cunObz5a6k6jjdX2', 'tutor', '09562234555', 'tutor10123@email.com', 'Joy', 'Sy', 'Kapirig', '2025-07-09 03:20:01', '2025-07-28 05:21:15', NULL, '2004-05-20', 'active', '1753680075502-unnamed.jpg', 'female'),
(44, 'monjoy', '$2b$10$TqT94JRnI4PKpew4KEYjJeqeCdXbr3.28TgT5JyMU1Y0Xn6F/Ai6e', 'admin staff', '09994326789', 'joyyam_acuna@email.com', 'Jacklyn Joy', 'Yam', 'Acuña', '2025-07-09 12:52:58', '2025-07-17 01:59:56', NULL, '1985-08-01', 'active', '1752388128245-480309420_23879700538285835_985750566307005620_n.jpg', 'female'),
(45, 'tutor04', '$2b$10$RrMcMVR0i7ff7HA1HqCElOHwHGeQTe2jX4/9vd7CiCcr5Ty8GfGES', 'tutor', '09234777839', 'tutor04@email.com', 'Eunice Faye', 'Pilayre', 'Paja', '2025-07-09 13:25:42', '2025-07-27 05:53:30', NULL, '1999-01-20', 'active', '1752388038609-1_202205311333.png', 'female'),
(46, 'tutor05', '$2b$10$CYdQlNMSkxHjIER2Dn28NuO1naiCdgsGmVuzTfO/sf49F2c4xqA.u', 'tutor', '88888888888', 'tutor05@email.com', 'Accelery ', 'Haste', 'Narisma', '2025-07-09 13:38:23', '2025-07-13 06:43:24', NULL, '2000-03-08', 'active', '1752387213786-ChatGPT Image Jul 13, 2025, 02_10_59 PM.png', 'female'),
(47, 'student08', '$2b$10$LNaSTaPVcqWNvgX6EovX0u39is1fuaFHRLWyYtFvdGk7nm2/ZaqrK', 'student', '09206124366', 'student08@email.com', 'Tristan Jake', 'Mahinay', 'Peligrino', '2025-07-14 03:42:30', '2025-07-25 08:08:52', NULL, '2002-08-31', 'active', '1752466105619-486514763_2746999672154243_625479284924812821_n.jpg', 'male'),
(48, 'tutor_sample', '$2b$10$Nkq1GTaJLJKbazxhkPI5ke8d/uNBFwDdC0BXYQQ9O/AZQgesjH5C6', 'tutor', '09657821312', 'sampleEmail@gmail.com', 'Lurienz', 'Larsinity and beyond', 'Lloren', '2025-07-14 04:27:33', '2025-07-28 11:39:44', NULL, '2001-04-22', 'active', '1752890643682-57c5ed6c-f253-419b-bbb0-fa1e468173db.png', 'male'),
(49, 'sample_account', '$2b$10$L.HmK.d.ZOlFHSVyOPkEN.ZiumX3WiDLTFORLqL0jW5UWO7REAcYy', 'admin staff', '00000000001', 'sample@gmail', 'Sample Name', 'Sample Middle Name', 'Sample Last', '2025-07-18 11:41:12', '2025-07-18 13:44:31', NULL, '2001-04-11', 'active', '1752839090569-302139891_469791188490758_2480264855219058451_n.jpg', 'male');

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
  ADD KEY `tutor_id` (`tutor_id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_id` (`session_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `schedule_id` (`schedule_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=276;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1250;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=199;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=166;

--
-- AUTO_INCREMENT for table `student_profile`
--
ALTER TABLE `student_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `timeslots`
--
ALTER TABLE `timeslots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `tutor_profile`
--
ALTER TABLE `tutor_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`tutor_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`) ON DELETE CASCADE;

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
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE CASCADE;

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
