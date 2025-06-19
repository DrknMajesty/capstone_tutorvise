-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 19, 2025 at 08:17 AM
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
  `application_status` enum('pending','approved','cancelled','expired','submitted','done') DEFAULT 'pending',
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
(65, 32, 4, 30, 26, '08:00:00', '09:00:00', 'expired', '1749511004585_images.png', '2025-06-09 23:16:35', '2025-06-10 07:16:44', '2025-07-10 07:20:38', '2025-06-10 07:17:35'),
(66, 32, 4, 30, 27, '09:00:00', '10:00:00', 'approved', '1749511627188_images.png', '2025-06-09 23:26:59', '2025-06-10 07:27:07', '2025-07-10 07:27:27', '2025-06-10 07:27:59'),
(67, 2, 3, 31, 29, '15:00:00', '16:00:00', 'approved', '1749732976972_images.png', '2025-06-12 12:56:06', '2025-06-12 20:56:16', '2025-07-12 20:56:47', '2025-06-12 20:57:06'),
(68, 33, 2, 30, 28, '10:00:00', '11:00:00', 'done', '1749733494657_istockphoto-480585465-612x612.jpg', '2025-06-12 13:04:45', '2025-06-12 21:04:54', '2025-07-13 16:46:59', '2025-06-12 21:05:45'),
(69, 35, 4, 30, 32, '11:00:00', '12:00:00', 'done', '1749868792009_images.png', '2025-06-14 02:39:39', '2025-06-14 10:39:52', '2025-07-14 10:40:49', '2025-06-14 10:40:39'),
(74, 36, 1, 3, 1, '08:00:00', '10:00:00', 'cancelled', NULL, '2025-06-16 01:09:35', NULL, NULL, '2025-06-16 09:10:35'),
(75, 36, 1, 3, 1, '08:00:00', '10:00:00', 'cancelled', NULL, '2025-06-16 01:22:14', NULL, NULL, '2025-06-16 09:23:14'),
(76, 36, 2, 3, 1, '08:00:00', '10:00:00', 'cancelled', NULL, '2025-06-16 01:31:54', NULL, NULL, '2025-06-16 09:32:54'),
(77, 36, 3, 3, 1, '08:00:00', '10:00:00', 'cancelled', NULL, '2025-06-16 01:32:26', NULL, NULL, '2025-06-16 09:33:26'),
(80, 36, 1, 3, 20, '12:00:00', '13:00:00', 'cancelled', '1750039132515_images.png', '2025-06-16 01:58:47', '2025-06-16 09:58:52', NULL, '2025-06-16 09:59:47'),
(81, 36, 1, 3, 1, '08:00:00', '10:00:00', 'cancelled', '1750039359874_images.png', '2025-06-16 02:02:32', '2025-06-16 10:02:39', NULL, '2025-06-16 10:03:32'),
(82, 36, 3, 3, 18, '13:00:00', '14:00:00', 'cancelled', '1750039651720_images.png', '2025-06-16 02:07:24', '2025-06-16 10:07:31', NULL, '2025-06-16 10:08:24'),
(83, 35, 1, 30, 28, '10:00:00', '11:00:00', 'done', '1750153449052_302139891_469791188490758_2480264855219058451_n.jpg', '2025-06-17 09:44:01', '2025-06-17 17:44:09', '2025-07-17 17:44:41', '2025-06-17 17:45:01'),
(84, 33, 1, 31, 30, '16:00:00', '17:00:00', 'done', '1750155418040_302139891_469791188490758_2480264855219058451_n.jpg', '2025-06-17 10:16:52', '2025-06-17 18:16:58', '2025-07-17 18:17:15', '2025-06-17 18:17:52'),
(85, 33, 1, 30, 28, '10:00:00', '11:00:00', 'approved', '1750216599011_302139891_469791188490758_2480264855219058451_n.jpg', '2025-06-18 03:16:33', '2025-06-18 11:16:39', '2025-07-18 11:16:51', '2025-06-18 11:17:33');

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

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `application_id`, `student_id`, `tutor_id`, `session_date`, `status`, `created_at`, `updated_at`, `approved_by`) VALUES
(45, 66, 32, 30, '2025-06-16', 'accepted', '2025-06-10 05:17:47', '2025-06-14 08:55:02', NULL),
(46, 66, 32, 30, '2025-06-17', 'accepted', '2025-06-10 05:17:47', '2025-06-13 01:09:46', NULL),
(47, 66, 32, 30, '2025-06-18', 'accepted', '2025-06-10 05:17:47', '2025-06-10 12:02:59', NULL),
(48, 66, 32, 30, '2025-06-19', 'accepted', '2025-06-10 05:17:47', '2025-06-10 10:50:19', NULL),
(49, 66, 32, 30, '2025-06-20', 'accepted', '2025-06-10 05:17:47', '2025-06-10 10:50:15', NULL),
(50, 67, 2, 31, '2025-06-23', 'accepted', '2025-06-12 12:57:57', '2025-06-12 12:58:13', NULL),
(51, 67, 2, 31, '2025-06-24', 'accepted', '2025-06-12 12:57:57', '2025-06-12 12:58:20', NULL),
(52, 67, 2, 31, '2025-06-25', 'accepted', '2025-06-12 12:57:57', '2025-06-12 12:58:23', NULL),
(53, 67, 2, 31, '2025-06-26', 'accepted', '2025-06-12 12:57:57', '2025-06-12 12:58:17', NULL),
(54, 67, 2, 31, '2025-06-27', 'accepted', '2025-06-12 12:57:57', '2025-06-12 12:58:04', NULL),
(55, 68, 33, 30, '2025-06-16', 'cancelled', '2025-06-13 08:48:23', '2025-06-16 05:04:46', NULL),
(56, 68, 33, 30, '2025-06-17', 'cancelled', '2025-06-13 08:48:23', '2025-06-16 05:06:30', NULL),
(57, 68, 33, 30, '2025-06-18', 'cancelled', '2025-06-13 08:48:23', '2025-06-16 05:10:59', NULL),
(58, 68, 33, 30, '2025-06-19', 'cancelled', '2025-06-13 08:48:23', '2025-06-16 05:19:02', NULL),
(59, 68, 33, 30, '2025-06-20', 'cancelled', '2025-06-13 08:48:23', '2025-06-16 05:24:30', NULL),
(60, 68, 33, 30, '2025-06-23', 'cancelled', '2025-06-13 08:48:23', '2025-06-16 05:25:30', NULL),
(61, 68, 33, 30, '2025-06-24', 'cancelled', '2025-06-13 08:48:23', '2025-06-16 04:39:40', NULL),
(62, 68, 33, 30, '2025-06-25', 'cancelled', '2025-06-13 08:48:23', '2025-06-16 05:26:12', NULL),
(63, 68, 33, 30, '2025-06-26', 'accepted', '2025-06-13 08:48:23', '2025-06-16 05:27:10', NULL),
(64, 68, 33, 30, '2025-06-27', 'accepted', '2025-06-13 08:48:23', '2025-06-16 05:43:24', NULL),
(65, 68, 33, 30, '2025-07-07', 'accepted', '2025-06-16 05:39:53', '2025-06-16 06:29:55', NULL),
(66, 68, 33, 30, '2025-07-08', 'accepted', '2025-06-16 05:39:53', '2025-06-16 07:00:24', NULL),
(67, 68, 33, 30, '2025-07-09', 'accepted', '2025-06-16 05:39:53', '2025-06-16 08:05:16', NULL),
(68, 68, 33, 30, '2025-07-10', 'accepted', '2025-06-16 05:39:53', '2025-06-16 07:32:58', NULL),
(69, 68, 33, 30, '2025-07-11', 'accepted', '2025-06-16 05:39:53', '2025-06-16 07:32:54', NULL),
(70, 68, 33, 30, '2025-07-14', 'accepted', '2025-06-16 05:39:53', '2025-06-16 07:32:31', NULL),
(71, 68, 33, 30, '2025-07-15', 'accepted', '2025-06-16 05:39:53', '2025-06-16 07:29:11', NULL),
(72, 68, 33, 30, '2025-07-16', 'accepted', '2025-06-16 05:39:53', '2025-06-16 05:47:11', NULL),
(76, 69, 35, 30, '2025-08-07', 'cancelled', '2025-06-17 08:10:42', '2025-06-17 08:48:34', NULL),
(78, 69, 35, 30, '2025-08-11', 'accepted', '2025-06-17 08:52:05', '2025-06-17 08:54:08', NULL),
(79, 69, 35, 30, '2025-08-12', 'accepted', '2025-06-17 08:52:05', '2025-06-17 08:53:56', NULL),
(80, 69, 35, 30, '2025-08-13', 'accepted', '2025-06-17 08:52:05', '2025-06-17 08:52:41', NULL),
(81, 69, 35, 30, '2025-08-14', 'cancelled', '2025-06-17 08:52:05', '2025-06-17 09:07:43', NULL),
(82, 69, 35, 30, '2025-08-15', 'accepted', '2025-06-17 08:52:05', '2025-06-17 08:58:48', NULL),
(83, 69, 35, 30, '2025-08-14', 'cancelled', '2025-06-17 09:09:13', '2025-06-17 09:09:24', NULL),
(84, 69, 35, 30, '2025-08-16', 'cancelled', '2025-06-17 09:14:29', '2025-06-17 09:14:41', NULL),
(85, 69, 35, 30, '2025-06-30', 'accepted', '2025-06-17 09:19:00', '2025-06-17 09:19:50', NULL),
(86, 83, 35, 30, '2025-08-18', 'accepted', '2025-06-17 09:45:37', '2025-06-17 09:46:56', NULL),
(87, 83, 35, 30, '2025-08-19', 'accepted', '2025-06-17 09:45:37', '2025-06-17 09:46:19', NULL),
(88, 83, 35, 30, '2025-08-20', 'cancelled', '2025-06-17 09:45:37', '2025-06-17 09:47:33', NULL),
(89, 83, 35, 30, '2025-08-21', 'accepted', '2025-06-17 09:45:37', '2025-06-17 09:50:42', NULL),
(90, 83, 35, 30, '2025-08-22', 'cancelled', '2025-06-17 09:45:37', '2025-06-17 09:58:55', NULL),
(91, 83, 35, 30, '2025-08-20', 'cancelled', '2025-06-17 10:09:42', '2025-06-17 10:09:58', NULL),
(92, 83, 35, 30, '2025-08-22', 'accepted', '2025-06-17 10:09:42', '2025-06-17 10:11:44', NULL),
(93, 83, 35, 30, '2025-08-23', 'accepted', '2025-06-17 10:13:06', '2025-06-17 10:15:19', NULL),
(94, 84, 33, 31, '2025-09-08', 'accepted', '2025-06-17 10:21:16', '2025-06-18 01:34:26', NULL),
(95, 84, 33, 31, '2025-09-09', 'accepted', '2025-06-17 10:21:16', '2025-06-18 01:23:03', NULL),
(96, 84, 33, 31, '2025-09-10', 'accepted', '2025-06-17 10:21:16', '2025-06-17 10:22:39', NULL),
(97, 84, 33, 31, '2025-09-11', 'cancelled', '2025-06-17 10:21:16', '2025-06-17 10:22:31', NULL),
(98, 84, 33, 31, '2025-09-12', 'accepted', '2025-06-17 10:21:16', '2025-06-17 10:21:29', NULL),
(99, 84, 33, 31, '2025-09-11', 'cancelled', '2025-06-18 01:39:57', '2025-06-18 01:40:27', NULL),
(100, 84, 33, 31, '2025-09-13', 'accepted', '2025-06-18 01:40:49', '2025-06-18 01:40:55', NULL),
(101, 85, 33, 30, '2025-06-20', 'cancelled', '2025-06-18 03:19:45', '2025-06-18 03:24:55', NULL),
(102, 85, 33, 30, '2025-06-21', 'cancelled', '2025-06-18 03:19:45', '2025-06-18 03:24:58', NULL),
(103, 85, 33, 30, '2025-06-20', 'cancelled', '2025-06-18 03:45:02', '2025-06-18 03:45:13', NULL),
(104, 85, 33, 30, '2025-06-21', 'cancelled', '2025-06-18 03:45:02', '2025-06-18 03:45:16', NULL),
(105, 85, 33, 30, '2025-10-06', 'accepted', '2025-06-18 13:41:41', '2025-06-18 13:42:52', NULL),
(106, 85, 33, 30, '2025-10-07', 'accepted', '2025-06-18 13:41:41', '2025-06-18 13:44:09', NULL),
(107, 85, 33, 30, '2025-10-08', 'pending', '2025-06-18 13:41:41', '2025-06-18 13:41:41', NULL),
(108, 85, 33, 30, '2025-10-09', 'accepted', '2025-06-18 13:41:41', '2025-06-18 13:58:56', NULL),
(109, 85, 33, 30, '2025-10-10', 'pending', '2025-06-18 13:41:41', '2025-06-18 13:41:41', NULL);

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
(5, 5, 5, 'ANother test', '2025-06-12 13:27:03'),
(6, 4, 3, 'Here\'s my feedback', '2025-06-14 17:31:34'),
(7, 13, 4, 'This is great ', '2025-06-14 17:36:48'),
(9, 10, 2, 'Low rating', '2025-06-14 17:48:08'),
(10, 9, 2, 'Please Help', '2025-06-14 17:48:16'),
(11, 7, 3, 'Satisfactory', '2025-06-14 17:48:24');

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
(1, 1, 'New application submitted by Test Test', 1, '2025-06-16 00:43:58'),
(2, 36, 'Your application #75 has been cancelled.', 1, '2025-06-16 01:22:23'),
(3, 36, 'Your application #76 has been cancelled.', 1, '2025-06-16 01:32:01'),
(4, 36, 'Your application #77 has been cancelled.', 1, '2025-06-16 01:32:32'),
(5, 1, 'New application submitted by Test Test', 1, '2025-06-16 01:42:36'),
(6, 1, 'New application submitted by Test Test', 1, '2025-06-16 01:46:43'),
(7, 36, 'Your application #79 has been approved. You have 30 days to complete your sessions.', 1, '2025-06-16 01:50:56'),
(8, 1, 'New application submitted by Test Test', 1, '2025-06-16 01:58:52'),
(9, 1, 'New application submitted by Test Test', 1, '2025-06-16 02:02:39'),
(10, 36, 'Your application #81 has been cancelled. Contact Admin for futher instructions.', 1, '2025-06-16 02:02:51'),
(11, 1, 'New application submitted by Test Test', 1, '2025-06-16 02:07:31'),
(12, 36, 'Your application #82 has been cancelled. Contact Admin for futher instructions.', 1, '2025-06-16 02:07:47'),
(13, 33, 'Your tutor has cancelled the booking. Reason: sick leave', 1, '2025-06-16 05:10:59'),
(14, 33, 'Your tutor, Lonie Jay Dalaygon has cancelled the booking. Reason: unavailable', 1, '2025-06-16 05:19:03'),
(15, 33, 'Your tutor Lonie Jay Dalaygon has cancelled your booking scheduled on Invalid Date. Reason: conflict', 1, '2025-06-16 05:24:30'),
(16, 33, 'Your tutor Lonie Jay Dalaygon has cancelled your booking scheduled on June 23, 2025. Reason: unavailable', 1, '2025-06-16 05:25:31'),
(17, 33, 'Your tutor Lonie Jay Dalaygon has cancelled your booking scheduled on June 25, 2025. Reason: sick leave', 1, '2025-06-16 05:26:12'),
(18, 33, 'Your booking for Friday, June 27, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 1, '2025-06-16 05:43:25'),
(19, 33, 'Your booking for Wednesday, July 16, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 1, '2025-06-16 05:47:11'),
(20, 33, 'Your booking for Monday, July 7, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 1, '2025-06-16 06:29:55'),
(21, 33, 'Your booking for Tuesday, July 8, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 1, '2025-06-16 07:00:24'),
(22, 30, 'The booking of Karylle Delantes, Tuesday, July 8, 2025 has been accepted. Please be ready on your scheduled date.', 1, '2025-06-16 07:00:24'),
(23, 33, 'Your booking for Tuesday, July 15, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 1, '2025-06-16 07:29:11'),
(24, 30, 'The booking of Karylle Delantes on Tuesday, July 15, 2025 has been accepted. Please be ready on your scheduled date.', 1, '2025-06-16 07:29:11'),
(25, 33, 'Your booking for Monday, July 14, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 1, '2025-06-16 07:32:31'),
(26, 30, 'The booking of Karylle Delantes on Monday, July 14, 2025 has been accepted. Please be ready on your scheduled date.', 1, '2025-06-16 07:32:32'),
(27, 33, 'Your booking for Friday, July 11, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 1, '2025-06-16 07:32:54'),
(28, 30, 'The booking of Karylle Delantes on Friday, July 11, 2025 has been accepted. Please be ready on your scheduled date.', 1, '2025-06-16 07:32:54'),
(29, 33, 'Your booking for Thursday, July 10, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 1, '2025-06-16 07:32:58'),
(30, 30, 'The booking of Karylle Delantes on Thursday, July 10, 2025 has been accepted. Please be ready on your scheduled date.', 1, '2025-06-16 07:32:58'),
(31, 33, 'Your booking for Wednesday, July 9, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 1, '2025-06-16 07:33:48'),
(32, 30, 'The booking of Karylle Delantes on Wednesday, July 9, 2025 has been accepted. Please be ready on your scheduled date.', 1, '2025-06-16 07:33:48'),
(33, 33, 'Your booking for Wednesday, July 9, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 1, '2025-06-16 07:56:53'),
(34, 30, 'The booking of Karylle Delantes on Wednesday, July 9, 2025 has been accepted.', 1, '2025-06-16 07:56:53'),
(35, 33, 'Congratulations! All your sessions for this package have been accepted. Your application is now marked as completed.', 1, '2025-06-16 07:56:53'),
(36, 33, 'Your booking for Wednesday, July 9, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 1, '2025-06-16 07:59:51'),
(37, 30, 'The booking of Karylle Delantes on Wednesday, July 9, 2025 has been accepted.', 1, '2025-06-16 07:59:51'),
(38, 33, 'Congratulations! All your sessions for this package have been accepted. Your application is now marked as completed.', 0, '2025-06-16 07:59:52'),
(39, 33, 'Your booking for Wednesday, July 9, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-16 08:01:58'),
(40, 30, 'The booking of Karylle Delantes on Wednesday, July 9, 2025 has been accepted.', 1, '2025-06-16 08:01:58'),
(41, 33, 'Congratulations! All your sessions for this package undefined have been accepted. Your application is now marked as completed.', 0, '2025-06-16 08:01:59'),
(42, 33, 'Your booking for Wednesday, July 9, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-16 08:05:16'),
(43, 30, 'The booking of Karylle Delantes on Wednesday, July 9, 2025 has been accepted.', 1, '2025-06-16 08:05:16'),
(44, 33, 'Congratulations! All your bookings for this package \"Test Package 2\" have been accepted. You can now apply another package.', 0, '2025-06-16 08:05:16'),
(45, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Tuesday, July 22, 2025, from 10:00 to 11:00.', 0, '2025-06-16 11:56:25'),
(46, 30, 'The session with Karylle Delantes has been rescheduled to Tuesday, July 22, 2025, from 10:00 to 11:00.', 1, '2025-06-16 11:56:25'),
(47, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Monday, July 21, 2025, from 10:00 to 11:00.', 0, '2025-06-16 11:57:35'),
(48, 30, 'The session with Karylle Delantes has been rescheduled to Monday, July 21, 2025, from 10:00 to 11:00.', 1, '2025-06-16 11:57:35'),
(49, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Thursday, July 24, 2025, from 10:00 to 11:00.', 0, '2025-06-16 11:58:03'),
(50, 30, 'The session with Karylle Delantes has been rescheduled to Thursday, July 24, 2025, from 10:00 to 11:00.', 1, '2025-06-16 11:58:03'),
(51, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Wednesday, July 23, 2025, from 10:00 to 11:00.', 0, '2025-06-16 11:58:13'),
(52, 30, 'The session with Karylle Delantes has been rescheduled to Wednesday, July 23, 2025, from 10:00 to 11:00.', 1, '2025-06-16 11:58:13'),
(53, 32, 'Your session with Lonie Jay Dalaygon has been rescheduled to Tuesday, June 17, 2025, from 14:00 to 15:00.', 0, '2025-06-17 03:53:43'),
(54, 30, 'The session with Patrick Dave Agot has been rescheduled to Tuesday, June 17, 2025, from 14:00 to 15:00.', 1, '2025-06-17 03:53:43'),
(55, 32, 'Reminder: You have a session scheduled on Tuesday, June 17, 2025 at 14:00. Please be on time.', 0, '2025-06-17 04:05:00'),
(56, 30, 'Reminder: You have a session scheduled on Tuesday, June 17, 2025 at 14:00. Please be on time.', 1, '2025-06-17 04:05:00'),
(57, 32, 'Your session with Lonie Jay Dalaygon has been rescheduled to Tuesday, June 17, 2025, from 14:30 to 15:30.', 0, '2025-06-17 04:28:07'),
(58, 30, 'The session with Patrick Dave Agot has been rescheduled to Tuesday, June 17, 2025, from 14:30 to 15:30.', 1, '2025-06-17 04:28:07'),
(59, 32, 'Reminder: You have a session scheduled on Tuesday, June 17, 2025 at Invalid Date. Please be on time.', 0, '2025-06-17 04:30:00'),
(60, 30, 'Reminder: You have a session scheduled on Tuesday, June 17, 2025 at Invalid Date. Please be on time.', 1, '2025-06-17 04:30:00'),
(61, 32, 'Your session with Lonie Jay Dalaygon has been rescheduled to Tuesday, June 17, 2025, from 14:40 to 15:40.', 0, '2025-06-17 04:35:44'),
(62, 30, 'The session with Patrick Dave Agot has been rescheduled to Tuesday, June 17, 2025, from 14:40 to 15:40.', 1, '2025-06-17 04:35:44'),
(63, 32, 'Your session with Lonie Jay Dalaygon has been rescheduled to Tuesday, June 17, 2025, from 14:45 to 15:45.', 0, '2025-06-17 04:42:23'),
(64, 30, 'The session with Patrick Dave Agot has been rescheduled to Tuesday, June 17, 2025, from 14:45 to 15:45.', 1, '2025-06-17 04:42:24'),
(65, 32, 'Reminder: You have a session scheduled on Tuesday, June 17, 2025 at 2:45 PM. Please be on time.', 0, '2025-06-17 04:45:00'),
(66, 30, 'Reminder: You have a session scheduled on Tuesday, June 17, 2025 at 2:45 PM. Please be on time.', 1, '2025-06-17 04:45:00'),
(67, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Thursday, July 17, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-17 07:26:25'),
(68, 30, 'The session with Karylle Delantes has been rescheduled to Thursday, July 17, 2025, from 10:00 AM to 11:00 AM.', 1, '2025-06-17 07:26:25'),
(69, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Thursday, July 17, 2025, from 10:00 AM to 11:00 AM.', 1, '2025-06-17 07:26:25'),
(70, 35, 'Your booking for Monday, August 4, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-17 08:09:43'),
(71, 30, 'The booking of Ryu Min-Seok on Monday, August 4, 2025 has been accepted.', 1, '2025-06-17 08:09:43'),
(72, 35, 'Your booking for Tuesday, August 5, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-17 08:36:41'),
(73, 30, 'The booking of Ryu Min-Seok on Tuesday, August 5, 2025 has been accepted.', 1, '2025-06-17 08:36:41'),
(74, 35, 'Your booking for Wednesday, August 6, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-17 08:37:19'),
(75, 30, 'The booking of Ryu Min-Seok on Wednesday, August 6, 2025 has been accepted.', 1, '2025-06-17 08:37:19'),
(76, 35, 'Your tutor Lonie Jay Dalaygon has cancelled your booking scheduled on August 7, 2025. Reason: sick leave', 0, '2025-06-17 08:48:34'),
(77, 30, 'You cancelled a student booking on August 7, 2025. Reason: sick leave', 1, '2025-06-17 08:48:34'),
(78, 35, 'Your booking for Friday, August 8, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-17 08:48:41'),
(79, 30, 'The booking of Ryu Min-Seok on Friday, August 8, 2025 has been accepted.', 1, '2025-06-17 08:48:41'),
(80, 35, 'Your booking for Wednesday, August 13, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-17 08:52:41'),
(81, 30, 'The booking of Ryu Min-Seok on Wednesday, August 13, 2025 has been accepted.', 1, '2025-06-17 08:52:41'),
(82, 35, 'Your booking for Tuesday, August 12, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-17 08:53:56'),
(83, 30, 'The booking of Ryu Min-Seok on Tuesday, August 12, 2025 has been accepted.', 1, '2025-06-17 08:53:56'),
(84, 35, 'Your booking for Monday, August 11, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-17 08:54:08'),
(85, 30, 'The booking of Ryu Min-Seok on Monday, August 11, 2025 has been accepted.', 1, '2025-06-17 08:54:08'),
(86, 35, 'Your booking for Friday, August 15, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-17 08:58:48'),
(87, 30, 'The booking of Ryu Min-Seok on Friday, August 15, 2025 has been accepted.', 1, '2025-06-17 08:58:48'),
(88, 35, 'Your booking for Monday, June 30, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-17 09:19:50'),
(89, 30, 'The booking of Ryu Min-Seok on Monday, June 30, 2025 has been accepted.', 1, '2025-06-17 09:19:50'),
(90, 35, 'Congratulations! All your bookings for this package \"Test Package 4\" have been accepted. You can now apply another package.', 0, '2025-06-17 09:19:50'),
(91, 1, 'New application submitted by Ryu Min-Seok', 1, '2025-06-17 09:44:09'),
(92, 35, 'Your application #83 has been approved. You have 30 days to booked dates for tutorial.', 0, '2025-06-17 09:44:41'),
(93, 35, 'Your booking for Tuesday, August 19, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-17 09:46:20'),
(94, 30, 'The booking of Ryu Min-Seok on Tuesday, August 19, 2025 has been accepted.', 1, '2025-06-17 09:46:20'),
(95, 35, 'Your booking for Monday, August 18, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-17 09:46:57'),
(96, 30, 'The booking of Ryu Min-Seok on Monday, August 18, 2025 has been accepted.', 1, '2025-06-17 09:46:57'),
(97, 35, 'Your tutor Lonie Jay Dalaygon has cancelled your booking scheduled on August 20, 2025. Reason: unavailable', 0, '2025-06-17 09:47:33'),
(98, 30, 'You cancelled a student booking on August 20, 2025. Reason: unavailable', 1, '2025-06-17 09:47:33'),
(99, 35, 'Your booking for Thursday, August 21, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-17 09:50:42'),
(100, 30, 'The booking of Ryu Min-Seok on Thursday, August 21, 2025 has been accepted.', 1, '2025-06-17 09:50:43'),
(101, 35, 'Your tutor Lonie Jay Dalaygon has cancelled your booking scheduled on August 22, 2025. Reason: unavailable', 0, '2025-06-17 09:58:55'),
(102, 30, 'You cancelled a student booking on August 22, 2025. Reason: unavailable', 1, '2025-06-17 09:58:55'),
(103, 35, 'Your booking for Friday, August 22, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-17 10:11:44'),
(104, 30, 'The booking of Ryu Min-Seok on Friday, August 22, 2025 has been accepted.', 1, '2025-06-17 10:11:45'),
(105, 35, 'Your booking for Saturday, August 23, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-17 10:15:19'),
(106, 30, 'The booking of Ryu Min-Seok on Saturday, August 23, 2025 has been accepted.', 1, '2025-06-17 10:15:19'),
(107, 35, 'Congratulations! All your bookings for this package \"Test Package 1\" have been accepted. You can now apply another package.', 0, '2025-06-17 10:15:19'),
(108, 1, 'New application submitted by Karylle Delantes', 1, '2025-06-17 10:16:58'),
(109, 33, 'Your application #84 has been approved. You have 30 days to booked dates for tutorial.', 0, '2025-06-17 10:17:15'),
(110, 33, 'Your booking for Friday, September 12, 2025 has been accepted by Hannah Mae Clerigo. Please be ready on your scheduled date.', 0, '2025-06-17 10:21:29'),
(111, 31, 'The booking of Karylle Delantes on Friday, September 12, 2025 has been accepted.', 0, '2025-06-17 10:21:30'),
(112, 33, 'Your tutor Hannah Mae Clerigo has cancelled your booking scheduled on September 11, 2025. Reason: sick leave', 0, '2025-06-17 10:22:31'),
(113, 31, 'You cancelled a student booking on September 11, 2025. Reason: sick leave', 0, '2025-06-17 10:22:31'),
(114, 33, 'Your booking for Wednesday, September 10, 2025 has been accepted by Hannah Mae Clerigo. Please be ready on your scheduled date.', 0, '2025-06-17 10:22:40'),
(115, 31, 'The booking of Karylle Delantes on Wednesday, September 10, 2025 has been accepted.', 0, '2025-06-17 10:22:40'),
(117, 35, 'Your session with Lonie Jay Dalaygon has been rescheduled to Monday, July 14, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-06-17 14:39:14'),
(118, 30, 'Your session with Ryu Min-Seok has been rescheduled to Monday, July 14, 2025, from 11:00 AM to 12:00 PM.', 1, '2025-06-17 14:39:14'),
(119, 35, 'Your session with Lonie Jay Dalaygon has been rescheduled to Monday, July 14, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-06-17 14:39:14'),
(120, 1, 'Schedule between Ryu Min-Seok and Lonie Jay Dalaygon has been rescheduled to Monday, July 14, 2025, from 11:00 AM to 12:00 PM.', 1, '2025-06-17 14:39:14'),
(121, 30, 'Your session with Ryu Min-Seok has been rescheduled to Monday, July 14, 2025, from 11:00 AM to 12:00 PM.', 1, '2025-06-17 14:39:14'),
(122, 1, 'Schedule between Ryu Min-Seok and Lonie Jay Dalaygon has been rescheduled to Monday, July 14, 2025, from 11:00 AM to 12:00 PM.', 1, '2025-06-17 14:39:15'),
(123, 1, 'Tutor (ID: 30) requested to update session ID 12 to \"confirmed\".', 1, '2025-06-17 14:53:28'),
(124, 30, 'Your request to update session ID 12 to \"confirmed\" has been sent to all admins.', 1, '2025-06-17 14:53:28'),
(125, 1, 'Tutor (ID: 30) requested to update session ID 12 to \"confirmed\".', 1, '2025-06-17 14:54:52'),
(126, 30, 'Your request to update session ID 12 to \"confirmed\" has been sent to all admins.', 1, '2025-06-17 14:54:52'),
(127, 35, 'Your session with Lonie Jay Dalaygon has been rescheduled to Saturday, August 16, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-06-17 23:27:27'),
(128, 30, 'Your session with Ryu Min-Seok has been rescheduled to Saturday, August 16, 2025, from 11:00 AM to 12:00 PM.', 1, '2025-06-17 23:27:27'),
(129, 1, 'Schedule between Ryu Min-Seok and Lonie Jay Dalaygon has been rescheduled to Saturday, August 16, 2025, from 11:00 AM to 12:00 PM.', 1, '2025-06-17 23:27:27'),
(136, 33, 'Your booking for Tuesday, September 9, 2025 has been accepted by Hannah Mae Clerigo. Please be ready on your scheduled date.', 0, '2025-06-18 01:23:03'),
(137, 31, 'The booking of Karylle Delantes on Tuesday, September 9, 2025 has been accepted.', 0, '2025-06-18 01:23:03'),
(138, 33, 'Your booking for Monday, September 8, 2025 has been accepted by Hannah Mae Clerigo. Please be ready on your scheduled date.', 0, '2025-06-18 01:34:26'),
(139, 31, 'The booking of Karylle Delantes on Monday, September 8, 2025 has been accepted.', 0, '2025-06-18 01:34:27'),
(140, 33, 'Your tutor Hannah Mae Clerigo has cancelled your booking scheduled on September 11, 2025. Reason: sick leave', 0, '2025-06-18 01:40:27'),
(141, 31, 'You cancelled a student booking on September 11, 2025. Reason: sick leave', 0, '2025-06-18 01:40:27'),
(142, 33, 'Your booking for Saturday, September 13, 2025 has been accepted by Hannah Mae Clerigo. Please be ready on your scheduled date.', 0, '2025-06-18 01:40:55'),
(143, 31, 'The booking of Karylle Delantes on Saturday, September 13, 2025 has been accepted.', 0, '2025-06-18 01:40:55'),
(144, 33, 'Congratulations! All your bookings for this package \"Test Package 1\" have been accepted. You can now apply another package.', 0, '2025-06-18 01:40:55'),
(145, 1, 'New application submitted by Karylle Delantes', 0, '2025-06-18 03:16:39'),
(146, 33, 'Your application #85 has been approved. You have 30 days to booked dates for tutorial.', 0, '2025-06-18 03:16:51'),
(147, 32, 'Your session with Lonie Jay Dalaygon has been rescheduled to Friday, June 20, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 03:17:45'),
(148, 30, 'Your session with Patrick Dave Agot has been rescheduled to Friday, June 20, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 03:17:45'),
(149, 1, 'Schedule between Patrick Dave Agot and Lonie Jay Dalaygon has been rescheduled to Friday, June 20, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 03:17:45'),
(150, 32, 'Your session with Lonie Jay Dalaygon has been rescheduled to Saturday, June 21, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 03:17:52'),
(151, 30, 'Your session with Patrick Dave Agot has been rescheduled to Saturday, June 21, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 03:17:52'),
(152, 1, 'Schedule between Patrick Dave Agot and Lonie Jay Dalaygon has been rescheduled to Saturday, June 21, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 03:17:53'),
(153, 33, 'Your tutor Lonie Jay Dalaygon has cancelled your booking scheduled on June 20, 2025. Reason: unavailable', 0, '2025-06-18 03:24:55'),
(154, 30, 'You cancelled a student booking on June 20, 2025. Reason: unavailable', 0, '2025-06-18 03:24:55'),
(155, 33, 'Your tutor Lonie Jay Dalaygon has cancelled your booking scheduled on June 21, 2025. Reason: unavailable', 0, '2025-06-18 03:24:59'),
(156, 30, 'You cancelled a student booking on June 21, 2025. Reason: unavailable', 0, '2025-06-18 03:24:59'),
(157, 33, 'Your tutor Lonie Jay Dalaygon has cancelled your booking scheduled on June 20, 2025. Reason: unavailable', 0, '2025-06-18 03:45:13'),
(158, 30, 'You cancelled a student booking on June 20, 2025. Reason: unavailable', 0, '2025-06-18 03:45:13'),
(159, 33, 'Your tutor Lonie Jay Dalaygon has cancelled your booking scheduled on June 21, 2025. Reason: unavailable', 0, '2025-06-18 03:45:17'),
(160, 30, 'You cancelled a student booking on June 21, 2025. Reason: unavailable', 0, '2025-06-18 03:45:17'),
(161, 33, 'Your session with Hannah Amor Clerigo has been rescheduled to Thursday, September 11, 2025, from 4:00 PM to 5:00 PM.', 0, '2025-06-18 08:59:13'),
(162, 31, 'Your session with Karylle Delantes has been rescheduled to Thursday, September 11, 2025, from 4:00 PM to 5:00 PM.', 0, '2025-06-18 08:59:13'),
(163, 1, 'Schedule between Karylle Delantes and Hannah Amor Clerigo has been rescheduled to Thursday, September 11, 2025, from 4:00 PM to 5:00 PM.', 0, '2025-06-18 08:59:13'),
(164, 33, 'Your booking for Monday, October 6, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-18 13:42:52'),
(165, 30, 'The booking of Karylle Delantes on Monday, October 6, 2025 has been accepted.', 0, '2025-06-18 13:42:52'),
(166, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Tuesday, October 7, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 13:43:34'),
(167, 30, 'Your session with Karylle Delantes has been rescheduled to Tuesday, October 7, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 13:43:34'),
(168, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Tuesday, October 7, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 13:43:34'),
(169, 33, 'Your booking for Tuesday, October 7, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-18 13:44:09'),
(170, 30, 'The booking of Karylle Delantes on Tuesday, October 7, 2025 has been accepted.', 0, '2025-06-18 13:44:09'),
(171, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Monday, October 6, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 13:44:56'),
(172, 30, 'Your session with Karylle Delantes has been rescheduled to Monday, October 6, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 13:44:56'),
(173, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Monday, October 6, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 13:44:56'),
(174, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Wednesday, October 8, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 13:58:15'),
(175, 30, 'Your session with Karylle Delantes has been rescheduled to Wednesday, October 8, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 13:58:15'),
(176, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Wednesday, October 8, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 13:58:15'),
(177, 33, 'Your booking for Thursday, October 9, 2025 has been accepted by Lonie Jay Dalaygon. Please be ready on your scheduled date.', 0, '2025-06-18 13:58:56'),
(178, 30, 'The booking of Karylle Delantes on Thursday, October 9, 2025 has been accepted.', 0, '2025-06-18 13:58:56'),
(179, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Saturday, October 11, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:12:33'),
(180, 30, 'Your session with Karylle Delantes has been rescheduled to Saturday, October 11, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:12:33'),
(181, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Saturday, October 11, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:12:33'),
(182, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Thursday, October 9, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:14:44'),
(183, 30, 'Your session with Karylle Delantes has been rescheduled to Thursday, October 9, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:14:44'),
(184, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Thursday, October 9, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:14:44'),
(185, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Tuesday, October 7, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:17:00'),
(186, 30, 'Your session with Karylle Delantes has been rescheduled to Tuesday, October 7, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:17:00'),
(187, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Tuesday, October 7, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:17:00'),
(188, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Friday, October 10, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:25:05'),
(189, 30, 'Your session with Karylle Delantes has been rescheduled to Friday, October 10, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:25:05'),
(190, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Friday, October 10, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:25:05'),
(191, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Saturday, October 11, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:25:52'),
(192, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Saturday, October 11, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:25:52'),
(193, 30, 'Your session with Karylle Delantes has been rescheduled to Saturday, October 11, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:25:53'),
(194, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Saturday, October 11, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:25:53'),
(195, 37, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Sunday, October 12, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:28:46'),
(196, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Sunday, October 12, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:28:46'),
(197, 30, 'Your session with Karylle Delantes has been rescheduled to Sunday, October 12, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:28:47'),
(198, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Sunday, October 12, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:28:47'),
(199, 37, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Monday, October 13, 2025, from 12:00 AM to 1:00 AM.', 0, '2025-06-18 14:29:24'),
(200, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Monday, October 13, 2025, from 12:00 AM to 1:00 AM.', 0, '2025-06-18 14:29:24'),
(201, 30, 'Your session with Karylle Delantes has been rescheduled to Monday, October 13, 2025, from 12:00 AM to 1:00 AM.', 0, '2025-06-18 14:29:25'),
(202, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Monday, October 13, 2025, from 12:00 AM to 1:00 AM.', 0, '2025-06-18 14:29:25'),
(203, 37, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Monday, October 13, 2025, from 12:00 PM to 1:00 PM.', 0, '2025-06-18 14:29:57'),
(204, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Monday, October 13, 2025, from 12:00 PM to 1:00 PM.', 0, '2025-06-18 14:29:57'),
(205, 30, 'Your session with Karylle Delantes has been rescheduled to Monday, October 13, 2025, from 12:00 PM to 1:00 PM.', 0, '2025-06-18 14:29:57'),
(206, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Monday, October 13, 2025, from 12:00 PM to 1:00 PM.', 0, '2025-06-18 14:29:57'),
(207, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Tuesday, October 14, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:32:42'),
(208, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Tuesday, October 14, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:32:42'),
(209, 30, 'Your session with Karylle Delantes has been rescheduled to Tuesday, October 14, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:32:42'),
(210, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Tuesday, October 14, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-18 14:32:42'),
(211, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Wednesday, October 15, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 00:38:13'),
(212, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Wednesday, October 15, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 00:38:13'),
(213, 30, 'Your session with Karylle Delantes has been rescheduled to Wednesday, October 15, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 00:38:13'),
(214, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Wednesday, October 15, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 00:38:13'),
(215, 1, 'You updated session ID 14 to \"confirmed\".', 0, '2025-06-19 01:03:46'),
(216, 30, 'Session ID 14 status has been updated to \"confirmed\".', 0, '2025-06-19 01:03:46'),
(217, 33, 'Session ID 14 status has been updated to \"confirmed\".', 0, '2025-06-19 01:03:46'),
(218, 1, 'You updated session of Hannah Amor Clerigo and Bobby Drake at Wed Jun 25 2025 00:00:00 GMT+0800 (Singapore Standard Time) to \"confirmed\".', 0, '2025-06-19 01:07:01'),
(219, 31, 'Session ID 11 status has been updated to \"confirmed\".', 0, '2025-06-19 01:07:01'),
(220, 2, 'Session ID 11 status has been updated to \"confirmed\".', 0, '2025-06-19 01:07:01'),
(221, 1, 'You updated the session between Hannah Amor Clerigo and Bobby Drake scheduled on Jun 24, 2025, 12:00 AM to \"confirmed\".', 0, '2025-06-19 01:10:36'),
(222, 31, 'The session between Hannah Amor Clerigo and Bobby Drake scheduled on Jun 24, 2025, 12:00 AM has been updated to status: \"confirmed\" by Alice Admin.', 0, '2025-06-19 01:10:36'),
(223, 2, 'The session between Hannah Amor Clerigo and Bobby Drake scheduled on Jun 24, 2025, 12:00 AM has been updated to status: \"confirmed\" by Alice Admin.', 0, '2025-06-19 01:10:36'),
(224, 1, 'You updated the session between Hannah Amor Clerigo and Bobby Drake scheduled on Jun 23, 2025 at 3:00 PM to \"confirmed\".', 0, '2025-06-19 01:18:35'),
(225, 31, 'The session between Hannah Amor Clerigo and Bobby Drake scheduled on Jun 23, 2025 at 3:00 PM has been updated to \"confirmed\" by Alice Admin.', 0, '2025-06-19 01:18:35'),
(226, 2, 'The session between Hannah Amor Clerigo and Bobby Drake scheduled on Jun 23, 2025 at 3:00 PM has been updated to \"confirmed\" by Alice Admin.', 0, '2025-06-19 01:18:35'),
(227, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Ryu Min-Seok to Thursday, June 19, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-06-19 01:22:00'),
(228, 35, 'Your session with Lonie Jay Dalaygon has been rescheduled to Thursday, June 19, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-06-19 01:22:00'),
(229, 30, 'Your session with Ryu Min-Seok has been rescheduled to Thursday, June 19, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-06-19 01:22:00'),
(230, 1, 'Schedule between Ryu Min-Seok and Lonie Jay Dalaygon has been rescheduled to Thursday, June 19, 2025, from 11:00 AM to 12:00 PM.', 0, '2025-06-19 01:22:00'),
(231, 35, 'Reminder: You have a session scheduled on Thursday, June 19, 2025 at 11:00 AM. Please be on time.', 0, '2025-06-19 01:25:00'),
(232, 30, 'Reminder: You have a session scheduled on Thursday, June 19, 2025 at 11:00 AM. Please be on time.', 0, '2025-06-19 01:25:00'),
(233, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Wednesday, October 8, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 01:47:01'),
(234, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Wednesday, October 8, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 01:47:01'),
(235, 30, 'Your session with Karylle Delantes has been rescheduled to Wednesday, October 8, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 01:47:01'),
(236, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Wednesday, October 8, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 01:47:01'),
(237, 37, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Saturday, June 28, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:08:00'),
(238, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Saturday, June 28, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:08:01'),
(239, 30, 'Your session with Karylle Delantes has been rescheduled to Saturday, June 28, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:08:01'),
(240, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Saturday, June 28, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:08:01'),
(241, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Friday, June 27, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:34:44'),
(242, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Friday, June 27, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:34:44'),
(243, 30, 'Your session with Karylle Delantes has been rescheduled to Friday, June 27, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:34:44'),
(244, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Friday, June 27, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:34:44'),
(245, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Sunday, July 6, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:35:04'),
(246, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Sunday, July 6, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:35:04'),
(247, 30, 'Your session with Karylle Delantes has been rescheduled to Sunday, July 6, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:35:04'),
(248, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Sunday, July 6, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:35:04'),
(249, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Saturday, July 5, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:40:26'),
(250, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Saturday, July 5, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:40:26'),
(251, 30, 'Your session with Karylle Delantes has been rescheduled to Saturday, July 5, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:40:26'),
(252, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Saturday, July 5, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:40:26'),
(253, 37, 'You rescheduled a session of Lonie Jay Dalaygon & Karylle Delantes to Sunday, July 6, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:46:04'),
(254, 33, 'Your session with Lonie Jay Dalaygon has been rescheduled to Sunday, July 6, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:46:04'),
(255, 30, 'Your session with Karylle Delantes has been rescheduled to Sunday, July 6, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:46:04'),
(256, 1, 'Schedule between Karylle Delantes and Lonie Jay Dalaygon has been rescheduled to Sunday, July 6, 2025, from 10:00 AM to 11:00 AM.', 0, '2025-06-19 03:46:04'),
(257, 1, 'You updated the session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jun 19, 2025 at 11:00 AM to \"confirmed\".', 0, '2025-06-19 04:07:40'),
(258, 30, 'The session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jun 19, 2025 at 11:00 AM has been updated to \"confirmed\" by Alice Admin.', 0, '2025-06-19 04:07:40'),
(259, 35, 'The session between Lonie Jay Dalaygon and Ryu Min-Seok scheduled on Jun 19, 2025 at 11:00 AM has been updated to \"confirmed\" by Alice Admin.', 0, '2025-06-19 04:07:40'),
(260, 1, 'Tutor Lonie Jay Dalaygon requested to update session ID 36 to \"confirmed\".', 0, '2025-06-19 04:49:23'),
(261, 30, 'Your request to update session on Thu Jun 19 2025 00:00:00 GMT+0800 (Singapore Standard Time) to \"confirmed\" has been sent.', 0, '2025-06-19 04:49:23'),
(262, 1, 'Tutor Lonie Jay Dalaygon requested to update session ID 36 to \"missed\".', 0, '2025-06-19 04:49:43'),
(263, 30, 'Your request to update session on Thu Jun 19 2025 00:00:00 GMT+0800 (Singapore Standard Time) to \"missed\" has been sent.', 0, '2025-06-19 04:49:43'),
(264, 1, 'Tutor Lonie Jay Dalaygon requested to update session ID 36 to \"confirmed\".', 0, '2025-06-19 04:53:56'),
(265, 30, 'Your request to update session on Thu Jun 19 2025 00:00:00 GMT+0800 (Singapore Standard Time) to \"confirmed\" has been sent.', 0, '2025-06-19 04:53:56'),
(266, 1, 'Tutor Lonie Jay Dalaygon requested to update the session on June 19, 2025 from 11:00 AM to 12:00 PM to \"confirmed\".', 0, '2025-06-19 05:01:28'),
(267, 30, 'Your request to update the session on June 19, 2025 from 11:00 AM to 12:00 PM to \"confirmed\" has been sent.', 0, '2025-06-19 05:01:28'),
(268, 1, 'Tutor Lonie Jay Dalaygon requested to update the session on June 19, 2025 from 11:00 AM to 12:00 PM to \"confirmed\".', 0, '2025-06-19 05:12:16'),
(269, 30, 'Your request to update the session on June 19, 2025 from 11:00 AM to 12:00 PM to \"confirmed\" has been sent.', 0, '2025-06-19 05:12:16'),
(270, 1, 'Tutor Lonie Jay Dalaygon requested to update the session on June 19, 2025 from 11:00 AM to 12:00 PM to \"missed\".', 0, '2025-06-19 05:12:28'),
(271, 30, 'Your request to update the session on June 19, 2025 from 11:00 AM to 12:00 PM to \"missed\" has been sent.', 0, '2025-06-19 05:12:28'),
(272, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Ryu Min-Seok to Thursday, June 19, 2025, from 4:00 PM to 5:00 PM.', 0, '2025-06-19 06:06:00'),
(273, 35, 'Your session with Lonie Jay Dalaygon has been rescheduled to Thursday, June 19, 2025, from 4:00 PM to 5:00 PM.', 0, '2025-06-19 06:06:00'),
(274, 30, 'Your session with Ryu Min-Seok has been rescheduled to Thursday, June 19, 2025, from 4:00 PM to 5:00 PM.', 0, '2025-06-19 06:06:00'),
(275, 1, 'Schedule between Ryu Min-Seok and Lonie Jay Dalaygon has been rescheduled to Thursday, June 19, 2025, from 4:00 PM to 5:00 PM.', 0, '2025-06-19 06:06:01'),
(276, 1, 'You rescheduled a session of Lonie Jay Dalaygon & Ryu Min-Seok to Thursday, June 19, 2025, from 3:00 PM to 4:00 PM.', 0, '2025-06-19 06:06:52'),
(277, 35, 'Your session with Lonie Jay Dalaygon has been rescheduled to Thursday, June 19, 2025, from 3:00 PM to 4:00 PM.', 0, '2025-06-19 06:06:52'),
(278, 30, 'Your session with Ryu Min-Seok has been rescheduled to Thursday, June 19, 2025, from 3:00 PM to 4:00 PM.', 0, '2025-06-19 06:06:53'),
(279, 1, 'Schedule between Ryu Min-Seok and Lonie Jay Dalaygon has been rescheduled to Thursday, June 19, 2025, from 3:00 PM to 4:00 PM.', 0, '2025-06-19 06:06:53');

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
(4, 67, 2000.00, '2025-06-12 12:56:47'),
(5, 68, 2000.00, '2025-06-13 08:46:59'),
(6, 69, 2500.00, '2025-06-14 02:40:49'),
(11, 83, 1250.00, '2025-06-17 09:44:41'),
(12, 84, 1250.00, '2025-06-17 10:17:15'),
(13, 85, 1250.00, '2025-06-18 03:16:51');

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
(37, 49, 30, 32, '2025-06-20', '10:00:00', '11:00:00', '2025-06-10 10:50:15'),
(38, 48, 30, 32, '2025-06-12', '10:05:00', '11:05:00', '2025-06-10 10:50:19'),
(39, 47, 30, 32, '2025-06-21', '10:00:00', '11:00:00', '2025-06-10 12:02:59'),
(40, 54, 31, 2, '2025-06-27', '15:00:00', '16:00:00', '2025-06-12 12:58:04'),
(41, 50, 31, 2, '2025-06-23', '15:00:00', '16:00:00', '2025-06-12 12:58:13'),
(42, 53, 31, 2, '2025-06-26', '15:00:00', '16:00:00', '2025-06-12 12:58:17'),
(43, 51, 31, 2, '2025-06-24', '15:00:00', '16:00:00', '2025-06-12 12:58:20'),
(44, 52, 31, 2, '2025-06-25', '15:00:00', '16:00:00', '2025-06-12 12:58:23'),
(45, 46, 30, 32, '2025-06-17', '14:45:00', '15:45:00', '2025-06-13 01:09:46'),
(46, 45, 30, 32, '2025-06-16', '09:00:00', '10:00:00', '2025-06-14 08:55:02'),
(47, 63, 30, 33, '2025-06-26', '10:00:00', '11:00:00', '2025-06-16 05:27:10'),
(48, 64, 30, 33, '2025-07-06', '10:00:00', '11:00:00', '2025-06-16 05:43:24'),
(49, 72, 30, 33, '2025-07-16', '10:00:00', '11:00:00', '2025-06-16 05:47:11'),
(50, 65, 30, 33, '2025-07-07', '10:00:00', '11:00:00', '2025-06-16 06:29:55'),
(51, 66, 30, 33, '2025-07-08', '10:00:00', '11:00:00', '2025-06-16 07:00:24'),
(52, 71, 30, 33, '2025-07-15', '10:00:00', '11:00:00', '2025-06-16 07:29:11'),
(53, 70, 30, 33, '2025-07-14', '10:00:00', '11:00:00', '2025-06-16 07:32:31'),
(54, 69, 30, 33, '2025-07-17', '10:00:00', '11:00:00', '2025-06-16 07:32:54'),
(55, 68, 30, 33, '2025-07-10', '10:00:00', '11:00:00', '2025-06-16 07:32:58'),
(57, 67, 30, 33, '2025-07-23', '10:00:00', '11:00:00', '2025-06-16 07:33:48'),
(58, 67, 30, 33, '2025-07-24', '10:00:00', '11:00:00', '2025-06-16 07:56:52'),
(59, 67, 30, 33, '2025-07-21', '10:00:00', '11:00:00', '2025-06-16 07:59:51'),
(60, 67, 30, 33, '2025-07-22', '10:00:00', '11:00:00', '2025-06-16 08:01:58'),
(61, 67, 30, 33, '2025-07-09', '10:00:00', '11:00:00', '2025-06-16 08:05:16'),
(66, 80, 30, 35, '2025-08-13', '11:00:00', '12:00:00', '2025-06-17 08:52:41'),
(67, 79, 30, 35, '2025-08-12', '11:00:00', '12:00:00', '2025-06-17 08:53:56'),
(68, 78, 30, 35, '2025-08-11', '11:00:00', '12:00:00', '2025-06-17 08:54:08'),
(69, 82, 30, 35, '2025-06-19', '15:00:00', '16:00:00', '2025-06-17 08:58:48'),
(70, 85, 30, 35, '2025-07-14', '11:00:00', '12:00:00', '2025-06-17 09:19:50'),
(71, 87, 30, 35, '2025-08-19', '10:00:00', '11:00:00', '2025-06-17 09:46:19'),
(72, 86, 30, 35, '2025-08-18', '10:00:00', '11:00:00', '2025-06-17 09:46:56'),
(73, 89, 30, 35, '2025-08-21', '10:00:00', '11:00:00', '2025-06-17 09:50:42'),
(74, 92, 30, 35, '2025-08-22', '10:00:00', '11:00:00', '2025-06-17 10:11:44'),
(75, 93, 30, 35, '2025-08-23', '10:00:00', '11:00:00', '2025-06-17 10:15:19'),
(76, 98, 31, 33, '2025-09-12', '16:00:00', '17:00:00', '2025-06-17 10:21:29'),
(77, 96, 31, 33, '2025-09-10', '16:00:00', '17:00:00', '2025-06-17 10:22:39'),
(78, 95, 31, 33, '2025-09-09', '16:00:00', '17:00:00', '2025-06-18 01:23:03'),
(79, 94, 31, 33, '2025-09-08', '16:00:00', '17:00:00', '2025-06-18 01:34:26'),
(80, 100, 31, 33, '2025-09-11', '16:00:00', '17:00:00', '2025-06-18 01:40:55'),
(81, 105, 30, 33, '2025-10-08', '10:00:00', '11:00:00', '2025-06-18 13:42:52'),
(82, 106, 30, 33, '2025-10-13', '12:00:00', '13:00:00', '2025-06-18 13:44:09'),
(83, 108, 30, 33, '2025-10-12', '10:00:00', '11:00:00', '2025-06-18 13:58:56');

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
(4, 37, 'confirmed', '2025-06-10 10:50:15', '2025-06-14 09:30:58', 0),
(5, 38, 'confirmed', '2025-06-10 10:50:19', '2025-06-12 07:09:45', 0),
(6, 39, 'missed', '2025-06-10 12:02:59', '2025-06-14 09:31:00', 0),
(7, 40, 'confirmed', '2025-06-12 12:58:04', '2025-06-14 09:43:03', 0),
(8, 41, 'confirmed', '2025-06-12 12:58:13', '2025-06-19 01:18:35', 0),
(9, 42, 'confirmed', '2025-06-12 12:58:17', '2025-06-14 09:42:58', 0),
(10, 43, 'confirmed', '2025-06-12 12:58:20', '2025-06-19 01:10:36', 0),
(11, 44, 'confirmed', '2025-06-12 12:58:23', '2025-06-19 01:07:01', 0),
(12, 45, 'confirmed', '2025-06-13 01:09:46', '2025-06-19 00:55:55', 1),
(13, 46, 'confirmed', '2025-06-14 08:55:02', '2025-06-14 09:31:57', 0),
(14, 47, 'confirmed', '2025-06-16 05:27:10', '2025-06-19 01:03:46', 0),
(15, 48, 'completed', '2025-06-16 05:43:24', '2025-06-19 04:38:34', 0),
(16, 49, 'completed', '2025-06-16 05:47:11', '2025-06-19 04:38:37', 0),
(17, 50, 'completed', '2025-06-16 06:29:55', '2025-06-19 04:38:41', 0),
(18, 51, 'upcoming', '2025-06-16 07:00:24', '2025-06-16 07:00:24', 0),
(19, 52, 'upcoming', '2025-06-16 07:29:11', '2025-06-16 07:29:11', 0),
(20, 53, 'upcoming', '2025-06-16 07:32:31', '2025-06-16 07:32:31', 0),
(21, 54, 'upcoming', '2025-06-16 07:32:54', '2025-06-16 07:32:54', 0),
(22, 55, 'upcoming', '2025-06-16 07:32:58', '2025-06-16 07:32:58', 0),
(24, 57, 'upcoming', '2025-06-16 07:33:48', '2025-06-16 07:33:48', 0),
(25, 58, 'upcoming', '2025-06-16 07:56:52', '2025-06-16 07:56:52', 0),
(26, 59, 'upcoming', '2025-06-16 07:59:51', '2025-06-16 07:59:51', 0),
(27, 60, 'upcoming', '2025-06-16 08:01:58', '2025-06-16 08:01:58', 0),
(28, 61, 'upcoming', '2025-06-16 08:05:16', '2025-06-16 08:05:16', 0),
(33, 66, 'upcoming', '2025-06-17 08:52:41', '2025-06-17 08:52:41', 0),
(34, 67, 'upcoming', '2025-06-17 08:53:56', '2025-06-17 08:53:56', 0),
(35, 68, 'upcoming', '2025-06-17 08:54:08', '2025-06-17 08:54:08', 0),
(36, 69, 'upcoming', '2025-06-17 08:58:48', '2025-06-19 06:06:52', 1),
(37, 70, 'upcoming', '2025-06-17 09:19:50', '2025-06-17 09:19:50', 0),
(38, 71, 'upcoming', '2025-06-17 09:46:19', '2025-06-17 09:46:19', 0),
(39, 72, 'upcoming', '2025-06-17 09:46:56', '2025-06-17 09:46:56', 0),
(40, 73, 'upcoming', '2025-06-17 09:50:42', '2025-06-17 09:50:42', 0),
(41, 74, 'upcoming', '2025-06-17 10:11:44', '2025-06-17 10:11:44', 0),
(42, 75, 'upcoming', '2025-06-17 10:15:19', '2025-06-17 10:15:19', 0),
(43, 76, 'upcoming', '2025-06-17 10:21:29', '2025-06-17 10:21:29', 0),
(44, 77, 'upcoming', '2025-06-17 10:22:39', '2025-06-17 10:22:39', 0),
(45, 78, 'upcoming', '2025-06-18 01:23:03', '2025-06-18 01:23:03', 0),
(46, 79, 'upcoming', '2025-06-18 01:34:26', '2025-06-18 01:34:26', 0),
(47, 80, 'upcoming', '2025-06-18 01:40:55', '2025-06-18 01:40:55', 0),
(48, 81, 'upcoming', '2025-06-18 13:42:52', '2025-06-18 13:42:52', 0),
(49, 82, 'upcoming', '2025-06-18 13:44:09', '2025-06-18 13:44:09', 0),
(50, 83, 'upcoming', '2025-06-18 13:58:56', '2025-06-18 13:58:56', 0);

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
(22, 36, 'Test', 'Test', NULL, 'sample@email.com', NULL, 'Test'),
(23, 38, 'Testing_sec', NULL, NULL, NULL, NULL, 'Tesinglname');

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
(1, 3, '08:00:00', '10:00:00', 'Pending', '2025-06-01 02:17:09'),
(18, 3, '13:00:00', '14:00:00', 'Available', '2025-06-03 10:59:17'),
(20, 3, '12:00:00', '13:00:00', 'Available', '2025-06-03 11:01:34'),
(26, 30, '08:00:00', '09:00:00', 'Booked', '2025-06-03 11:28:03'),
(27, 30, '09:00:00', '10:00:00', 'Booked', '2025-06-03 11:28:22'),
(28, 30, '10:00:00', '11:00:00', 'Booked', '2025-06-03 11:28:35'),
(29, 31, '15:00:00', '16:00:00', 'Booked', '2025-06-03 11:29:10'),
(30, 31, '16:00:00', '17:00:00', 'Available', '2025-06-03 11:29:17'),
(31, 31, '17:00:00', '18:00:00', 'Pending', '2025-06-03 11:29:23'),
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
(31, 'tutor02', '$2b$10$eh0fWwJ/vFV.ZDotJGV0Cu27UAwLm6HTj8DeEEobSe/WKkG8y7efW', 'tutor', '09994326789', 'hannah@email.com', 'Hannah Amor', NULL, 'Clerigo', '2025-06-03 11:20:22', '2025-06-18 07:10:23', NULL, '2001-03-14', 'active', '1748949622488-images.jpg'),
(32, 'student01', '$2b$10$1qSYWxFOPWi2Tw8mmPIMtOcjRc/KyK82k8tGT2LgN/C/W1kYEBpYu', 'student', NULL, 'pato@email.com', 'Patrick Dave', 'Dacoylo', 'Agot', '2025-06-03 11:25:15', '2025-06-04 13:02:29', NULL, '2001-05-09', 'active', '1749040918699-503360195_10089649337738304_2346311397319311664_n.jpg'),
(33, 'student02', '$2b$10$TgGT7kQaNOsPlggLBNPhiucjCkWhjSm3ZGDRqShZbqT8ZzBejxVAO', 'student', NULL, 'kai@email.com', 'Karylle', NULL, 'Delantes', '2025-06-03 11:25:55', '2025-06-08 12:10:15', NULL, '2001-06-22', 'active', '1748949955147-349096923_263125416256242_1892638932439863363_n.jpg'),
(34, 'sample', '$2b$10$y8PO2fFRkG8bziJjuL6Fw.bCF0Ezt3IoDhGFxhjzFmQDJEpgl4BCy', 'student', '09999999999', 'sample@email.com', 'Test', 'Test', 'Test', '2025-06-07 09:00:12', '2025-06-07 12:04:49', NULL, '2008-03-22', 'inactive', NULL),
(35, 'student03', '$2b$10$J6YUlz0Ppd4hB3YglSmO6uw14pKfJuz4XaLi2RTCZlF/ZmryxaTvS', 'student', '09999999999', 'student03@email.com', 'Ryu', 'Test', 'Min-Seok', '2025-06-08 12:13:31', '2025-06-08 12:13:31', NULL, '2008-03-22', 'active', NULL),
(36, 'student04', '$2b$10$7n7O9zo.2anu/Rk9hAIYAeMMCYDobbejt/DIcroU.H0ug9KqpjloG', 'student', '09999999999', 'student04@email.com', 'Testing', 'Test', 'Test', '2025-06-08 12:48:43', '2025-06-18 07:49:16', NULL, '2001-04-11', 'active', NULL),
(37, 'admin_staff', '$2b$10$24EBR2uFytjxEil85f/BReQ/fIe58VGISM2lfsT8/JI0drJumk41i', 'admin staff', '09206265432', 'staff@email.com', 'Jonalisa', NULL, 'Calacar', '2025-06-18 07:00:38', '2025-06-18 07:00:38', NULL, '2025-06-05', 'active', NULL),
(38, 'student_test', '$2b$10$ST6CgvDobkmr8kA/NRXMZeUmvUMys82d0BOxaeUSAFExyGGsI5YPq', 'student', '09999999999', 'testing@email.com', 'Testing_sec', NULL, 'Tesinglname', '2025-06-18 07:54:08', '2025-06-18 07:54:20', NULL, '2004-05-22', 'active', NULL);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=280;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `student_profile`
--
ALTER TABLE `student_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

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
