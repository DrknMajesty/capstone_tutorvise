const express = require('express');
const router = express.Router();
const db = require('../db'); // or wherever your DB connection is

// GET /api/student/summary/:studentId
router.get('/summary/:studentId', async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const [[approvedApplications]] = await db.query(
      `SELECT COUNT(*) AS count FROM applications WHERE student_id = ? AND application_status IN ('approved', 'done')`,
      [studentId]
    );

    const [[upcomingSessions]] = await db.query(
      `SELECT COUNT(*) AS count
        FROM sessions s
        JOIN schedules sch ON s.schedule_id = sch.id
        WHERE sch.student_id = ?
          AND s.status = 'upcoming';
      `,
      [studentId]
    );

    const [[completeSessions]] = await db.query(
      `
      SELECT COUNT(*) AS count 
      FROM sessions s 
      JOIN schedules sch ON s.schedule_id = sch.id
      WHERE sch.student_id = ? 
      AND status = 'confirmed'
      `,
      [studentId]
    );

    const [[pendingBookings]] = await db.query(
      `SELECT COUNT(*) AS count
      FROM bookings
      WHERE student_id = ?
        AND status = 'pending'`,
      [studentId]
    );

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
