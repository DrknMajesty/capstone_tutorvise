// notifications.js
const db = require('../db'); // your DB connection

const createNotification = async (userId, message) => {
  try {
    console.log(`Creating notification for user ${userId}: ${message}`);
    await db.query(
      "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
      [userId, message]
    );
    console.log('✅ Notification inserted');
  } catch (err) {
    console.error(`❌ Failed to insert notification for user ${userId}:`, err);
  }
};


module.exports = { createNotification };
