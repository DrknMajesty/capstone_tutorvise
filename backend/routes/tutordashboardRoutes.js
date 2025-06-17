const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/tutor/summary/:tutorId
router.get('/summary/:tutorId', async (req, res) => {
  const tutorId = req.params.tutorId;

  try {
    const [[assignedSchedules]] = await db.query(
      `SELECT COUNT(*) AS count FROM schedules WHERE tutor_id = ?`,
      [tutorId]
    );

    const [[upcomingSessions]] = await db.query(
      `SELECT COUNT(*) AS count 
       FROM sessions s 
       JOIN schedules sch ON s.schedule_id = sch.id 
       WHERE sch.tutor_id = ? AND s.status = 'upcoming'`,
      [tutorId]
    );

    const [[completedSessions]] = await db.query(
      `SELECT COUNT(*) AS count 
       FROM sessions s 
       JOIN schedules sch ON s.schedule_id = sch.id 
       WHERE sch.tutor_id = ? AND s.status = 'confirmed'`,
      [tutorId]
    );

    const [[pendingBookings]] = await db.query(
      `SELECT COUNT(*) AS count 
       FROM bookings 
       WHERE tutor_id = ? AND status = 'pending'`,
      [tutorId]
    );

    const [[userInfo]] = await db.query(
      `SELECT CONCAT(fname, ' ', lname) AS full_name FROM users WHERE id = ?`,
      [tutorId]
    );

    res.json({
      fullName: userInfo?.full_name || 'Tutor',
      assignedSchedules: assignedSchedules.count,
      upcomingSessions: upcomingSessions.count,
      completedSessions: completedSessions.count,
      pendingBookings: pendingBookings.count,
    });
  } catch (error) {
    console.error('Error fetching tutor summary:', error);
    res.status(500).json({ message: 'Failed to retrieve summary' });
  }
});

module.exports = router;
