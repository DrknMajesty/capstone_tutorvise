const express = require('express');
const router = express.Router();
const timeslotController = require('../controllers/timeslotController');
const authenticateToken = require('../middleware/auth');

router.get('/available-slots/:tutorId', authenticateToken, timeslotController.getAvailableTimeslots);
router.post('/create', authenticateToken, timeslotController.createTimeslot);
router.delete('/delete/:id', authenticateToken, timeslotController.deleteTimeslot);

module.exports = router;