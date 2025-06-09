const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

// Get Package with 'Active' status for booking
router.get('/avail-packages', authenticateToken, bookingController.getActivePackage);

// Get Selected Tutor Timeslots with "Available" status for booking
router.get('/book-timeslots/:tutorId', authenticateToken, bookingController.getAvailableTimeslots)

// Package Application
router.post('/apply', authenticateToken, bookingController.submitApplication);

// Book dates for sessions
router.post('/schedule-sessions', authenticateToken, bookingController.scheduleSessions);

// Get all All aplications with bookings
router.get('/all-bookings', authenticateToken, bookingController.getAllApplicationsWithBookings);

// Tutor Routes
// get bookings of the tutor
router.get('/tutors/:tutorId/bookings', authenticateToken, bookingController.getBookingsForTutor);

// // POST accept a booking
// router.post('/bookings/:bookingId/accept', authenticateToken, bookingController.acceptBooking);

// Student Route
// get bookings of the student
router.get('/students/:studentId/bookings', authenticateToken, bookingController.getBookingsByStudent);

// Confirm Booking
router.put('/:bookingId/confirm', authenticateToken, bookingController.acceptBooking);

// Cancel Booking
router.put('/:bookingId/cancel', authenticateToken, bookingController.cancelBooking);


module.exports = router;