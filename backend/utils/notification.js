// notifications.js
const db = require('../db'); // your DB connection

const createNotification = async (userId, message) => {
  await db.query(
    "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
    [userId, message]
  );
};

module.exports = { createNotification };
