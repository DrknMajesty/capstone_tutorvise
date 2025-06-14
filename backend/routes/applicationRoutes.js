const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authenticateToken = require('../middleware/auth');
const applicationController = require('../controllers/applicationController');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/payment_proofs/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

// Admin routes
router.get('/all-submitted', authenticateToken, applicationController.getSubmittedApplications);

// Approve Application
router.put('/approve/:id', authenticateToken, applicationController.approveApplication);

// Reject Application
router.put('/reject/:id', authenticateToken, applicationController.rejectApplication);

// Get current student's application (latest one)
router.get('/my-applications/:studentId', authenticateToken, applicationController.getMyApplication);

// Submit proof of payment
router.post('/submit-proof/:applicationId', authenticateToken, upload.single('payment_proof'), applicationController.submitPaymentProof);

// Cancel Student Application
router.post('/cancel/:id', authenticateToken, applicationController.cancelApplication);

// Bulk expiration route
router.post('/expire-applications', applicationController.expireApplicationsBulk);

// Manual/specific expiration
router.post('/expire/:id', applicationController.expireSingleApplication);

//Student Fetch Application
router.get('/:studentId/my-applications', authenticateToken, applicationController.getMyApplications);

module.exports = router;

