const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const reportsController = require('../controllers/reportsController');

// GET /reports/tutor-ratings
router.get('/tutor-ratings', authenticateToken, reportsController.getTutorRatingsReport);

// Get tutor feedbacks 
router.get('/tutor-feedback/:tutorId', reportsController.getTutorFeedbackDetails);


module.exports = router;
