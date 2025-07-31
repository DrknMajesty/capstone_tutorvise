const express = require('express');
const router = express.Router();
const db = require('../db'); // or wherever your DB connection is

// GET /api/student/summary/:studentId
router.get('/summary/:studentId', async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // Count approved or done applications
    const [[approvedApplications]] = await db.query(
      `SELECT COUNT(*) AS count 
       FROM applications 
       WHERE student_id = ? 
       AND application_status IN ('approved', 'done')`,
      [studentId]
    );

    // Count upcoming sessions
    const [[upcomingSessions]] = await db.query(
      `SELECT COUNT(*) AS count
       FROM sessions s
       JOIN schedules sch ON s.schedule_id = sch.id
       JOIN bookings b ON sch.booking_id = b.id
       JOIN applications a ON b.application_id = a.id
       WHERE a.student_id = ?
       AND s.status = 'upcoming'`,
      [studentId]
    );

    // Count confirmed/completed sessions
    const [[completeSessions]] = await db.query(
      `SELECT COUNT(*) AS count 
       FROM sessions s
       JOIN schedules sch ON s.schedule_id = sch.id
       JOIN bookings b ON sch.booking_id = b.id
       JOIN applications a ON b.application_id = a.id
       WHERE a.student_id = ?
       AND s.status IN ('confirmed', 'completed')`,
      [studentId]
    );

    // Count pending bookings
    const [[pendingBookings]] = await db.query(
      `SELECT COUNT(*) AS count
       FROM bookings b
       JOIN applications a ON b.application_id = a.id
       WHERE a.student_id = ?
       AND b.status = 'pending'`,
      [studentId]
    );

    // Get full name
    const [[userInfo]] = await db.query(
      `SELECT CONCAT(fname, ' ', lname) AS full_name FROM users WHERE id = ?`,
      [studentId]
    );

    res.json({
      fullName: userInfo?.full_name || 'Student',
      approvedApplications: approvedApplications.count,
      upcomingSessions: upcomingSessions.count,
      completeSessions: completeSessions.count,
      pendingBookings: pendingBookings.count,
    });
  } catch (error) {
    console.error('Error fetching student summary:', error);
    res.status(500).json({ message: 'Failed to retrieve summary' });
  }
});

module.exports = router;
