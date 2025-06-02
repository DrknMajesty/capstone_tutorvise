// models/userModel.js
const db = require('../db'); // adjust to your DB connection

const getUserByUsername = async (username) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0]; // return user object or undefined
};

module.exports = {
  getUserByUsername,
};
