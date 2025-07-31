const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/tutor/summary/:tutorId
router.get('/summary/:tutorId', async (req, res) => {
  const tutorId = req.params.tutorId;

  try {
    // Assigned schedules: join schedules → bookings → applications
    const [[assignedSchedules]] = await db.query(
      `SELECT COUNT(*) AS count
       FROM schedules sch
       JOIN bookings b ON sch.booking_id = b.id
       JOIN applications a ON b.application_id = a.id
       WHERE a.tutor_id = ?`,
      [tutorId]
    );

    // Upcoming sessions
    const [[upcomingSessions]] = await db.query(
      `SELECT COUNT(*) AS count 
       FROM sessions s
       JOIN schedules sch ON s.schedule_id = sch.id
       JOIN bookings b ON sch.booking_id = b.id
       JOIN applications a ON b.application_id = a.id
       WHERE a.tutor_id = ? AND s.status = 'upcoming'`,
      [tutorId]
    );

    // Completed (confirmed) sessions
    const [[completedSessions]] = await db.query(
      `SELECT COUNT(*) AS count 
       FROM sessions s
       JOIN schedules sch ON s.schedule_id = sch.id
       JOIN bookings b ON sch.booking_id = b.id
       JOIN applications a ON b.application_id = a.id
       WHERE a.tutor_id = ? AND s.status = 'confirmed'`,
      [tutorId]
    );

    // Pending bookings
    const [[pendingBookings]] = await db.query(
      `SELECT COUNT(*) AS count 
       FROM bookings b
       JOIN applications a ON b.application_id = a.id
       WHERE a.tutor_id = ? AND b.status = 'pending'`,
      [tutorId]
    );

    // Tutor info
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
