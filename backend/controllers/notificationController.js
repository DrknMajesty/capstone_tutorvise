const db = require('../db');

// GET all notifications for a user
exports.getNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC`, 
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST create a new notification
exports.createNotification = async (req, res) => {
  const { user_id, message } = req.body;

  try {
    await db.query(
      `INSERT INTO notifications (user_id, message) 
       VALUES (?, ?)`, 
      [user_id, message]
    );
    res.status(201).json({ message: 'Notification created' });
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH mark a notification as read
exports.markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      `UPDATE notifications 
       SET is_read = TRUE 
       WHERE id = ?`, 
      [id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
