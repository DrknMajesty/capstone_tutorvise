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


module.exports = router;