// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);

router.get('/test', (req, res) => {
  res.send('Auth routes are connected');
});


module.exports = router;
