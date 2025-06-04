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

// Get current student's application (latest one)
router.get('/my-applications/:studentId', authenticateToken, applicationController.getMyApplication);

// Submit proof of payment
router.post('/submit-proof/:applicationId', authenticateToken, upload.single('payment_proof'), applicationController.submitPaymentProof);

module.exports = router;
