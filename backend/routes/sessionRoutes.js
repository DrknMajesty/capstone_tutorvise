const express = require('express');
const router = express.Router();

const sessionController = require('../controllers/sessionsController');
const authenticateToken = require('../middleware/auth');

// Admin Routes
// Fetch all sessions
router.get('/', authenticateToken, sessionController.getAllSessions);

// Update session status
router.put('/:id/status', authenticateToken, sessionController.updateSessionStatus);

// Get session status update logs (optional)
router.get('/logs', authenticateToken, sessionController.getSessionLogs);

// Tutor Routes
router.get('/tutor/:id', authenticateToken, sessionController.getSessionsByTutor);
router.put('/:id/status', authenticateToken, sessionController.updateSessionStatus);

module.exports = router;