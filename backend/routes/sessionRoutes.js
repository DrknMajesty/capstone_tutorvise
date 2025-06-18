const express = require('express');
const router = express.Router();

const sessionController = require('../controllers/sessionsController');
const authenticateToken = require('../middleware/auth');

// Admin Routes
// Fetch all sessions
router.get('/', authenticateToken, sessionController.getAllSessions);

// Update session status
router.put('/:id/status', authenticateToken, sessionController.updateSessionStatus);

router.put('/:id/status/request', authenticateToken, sessionController.requestStatusUpdate);

// Get session status update logs (optional)
router.get('/logs', authenticateToken, sessionController.getSessionLogs);

// Tutor Routes
// GET tutor sessions
router.get('/tutor/:id', authenticateToken, sessionController.getSessionsByTutor);
// Auto update session status
router.put('/:id/auto-status', authenticateToken, sessionController.autoUpdateSessionStatus);

// Student Routes
// Get sessions for a specific student
router.get('/student/:studentId', authenticateToken, sessionController.getStudentSessions);

// Submit feedback for a session
router.post('/:sessionId/feedback', authenticateToken, sessionController.submitFeedback);

// Get feedback for a session
router.get('/:sessionId/feedback', authenticateToken, sessionController.getFeedback);

module.exports = router;