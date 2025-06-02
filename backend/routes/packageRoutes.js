const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/auth');
const packageController = require('../controllers/packageController');

// Get all packages
router.get('/all-packages', authenticateToken, packageController.getAllPackages);

// Post a new package
router.post('/create-package', authenticateToken, packageController.createPackage);

// Put an existing package
router.put('/update-package/:id', authenticateToken, packageController.updatePackage);

// Archive Package
router.put('/archive/:id', authenticateToken, packageController.archivePackage);

module.exports = router;