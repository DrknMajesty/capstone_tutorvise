const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const authenticateToken = require('../middleware/auth');

// GET /api/schedules
router.get('/all', authenticateToken, scheduleController.getAllSchedules);

module.exports = router;
