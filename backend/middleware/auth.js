// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification error:', err.message);
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    req.user = user;
    next();
  });
  // console.log('Token:', token);
  // console.log('JWT_SECRET:', process.env.JWT_SECRET);
  // console.log('Type of secret:', typeof process.env.JWT_SECRET);
};

module.exports = authenticateToken; // ✅ default export is a function
