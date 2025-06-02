const express = require('express');
const router = express.Router();
const timeslotController = require('../controllers/timeslotController');
const authenticateToken = require('../middleware/auth');

// Get Available Timeslots
router.get('/available-slots/:tutorId', authenticateToken, timeslotController.getAvailableTimeslots);

// Create new Timeslots
router.post('/create', authenticateToken, timeslotController.createTimeslot);

// Delete Existing timeslot
router.delete('/delete/:id', authenticateToken, timeslotController.deleteTimeslot);

// Update Timeslot status
router.put('/update-status/:id', authenticateToken, timeslotController.updateTimeslotStatus);

module.exports = router;