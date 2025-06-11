const express = require('express');
const router = express.Router();

const sessionController = require('../controllers/sessionsController');
const authenticateToken = require('../middleware/auth');

// Admin Routes
// Fetch all sessions
router.get('/', authenticateToken, sessionController.getAllSessions);

// // Fetch sessions by specific date
// router.get('/date/:date', authenticateToken, sessionController.getSessionsByDate);

// Update session status
router.put('/:id/status', authenticateToken, sessionController.updateSessionStatus);

// Get session status update logs (optional)
router.get('/logs', authenticateToken, sessionController.getSessionLogs);

module.exports = router;