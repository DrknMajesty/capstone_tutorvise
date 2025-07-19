// controllers/authController.js
require('dotenv').config(); // <-- Make sure this is at the top
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.getUserByUsername(username);
    // console.log("User fetched for login:", user);
    console.log("User fetched for login:", username);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid experiences' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match status:", passwordMatch);

    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid experiences' });
    }

    const token = jwt.sign(
      { id: user.id, username, account_type: user.account_type },
      process.env.JWT_SECRET, // <-- FIXED: now uses the same secret
      { expiresIn: '3h' }
    );

    return res.json({ token, account_type: user.account_type });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error });
  }
};

module.exports = {
  login,
};