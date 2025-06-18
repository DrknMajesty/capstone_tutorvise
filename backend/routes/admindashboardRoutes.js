const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/admin/summary
router.get('/summary', async (req, res) => {
  try {
    // User counts by account type
    const [[{ totalUsers }]] = await db.query(`SELECT COUNT(*) AS totalUsers FROM users WHERE status = 'active'`);
    const [[{ students }]] = await db.query(`SELECT COUNT(*) AS students FROM users WHERE account_type = 'Student' AND status = 'active'`);
    const [[{ tutors }]] = await db.query(`SELECT COUNT(*) AS tutors FROM users WHERE account_type = 'Tutor' AND status = 'active'`);
    const [[{ adminStaff }]] = await db.query(`SELECT COUNT(*) AS adminStaff FROM users WHERE account_type = 'admin staff' AND status = 'active'`);

    // Applications by status
    const [applicationCounts] = await db.query(`
      SELECT application_status AS status, COUNT(*) AS count
      FROM applications
      WHERE application_status != 'expired'
      GROUP BY application_status
    `);

    // Bookings by status
    const [bookingCounts] = await db.query(`
      SELECT status, COUNT(*) AS count
      FROM bookings
      GROUP BY status
    `);

    res.json({
      users: { totalUsers, students, tutors, adminStaff },
      applications: applicationCounts,
      bookings: bookingCounts,
    });
  } catch (error) {
    console.error('Admin summary error:', error);
    res.status(500).json({ message: 'Failed to retrieve admin summary' });
  }
});

module.exports = router;
