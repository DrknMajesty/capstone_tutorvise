// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/auth');
const userController = require('../controllers/userController');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Get all users
router.get('/all', authenticateToken, userController.getAllUsers);

// Get user by ID (login user profile)
router.get('/profile/:id', authenticateToken, userController.getUserById);

// Get student user profile by ID
router.get('/profile/student/:id', authenticateToken, userController.getStudentProfileById);  

// Get tutor user profile by ID
router.get('/profile/tutor/:id', authenticateToken, userController.getTutorProfileById);

// Put user password update
router.put('/update-password/:id', authenticateToken, userController.changePassword);

// Put user new email update
router.put('/update-email/:id', authenticateToken, userController.updateEmail);

// Put user contact number update
router.put('/update-contact/:id', authenticateToken, userController.updateContactNumber);

// Create a new user
router.post('/create', authenticateToken, upload.single('profile_image'), userController.createUser);


// Delete kunohay change ag account status
router.put('/delete/:id', authenticateToken, userController.deleteUser);

// Update user details and profile
router.put('/update/:id', authenticateToken, upload.single('profile_image'), userController.updateUser);

// Get Tutor Users
router.get('/active-tutors', authenticateToken, userController.getActiveTutors);

module.exports = router;
 