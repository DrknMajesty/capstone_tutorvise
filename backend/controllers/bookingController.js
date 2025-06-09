const db = require('../db');

// Get Active Packages
exports.getActivePackage = async (req, res) => {
      try {
        const [packages] = await db.query(
          `SELECT 
            p.id, 
            p.package_name, 
            p.price_package, 
            p.total_sessions, 
            p.price_sessions, 
            p.tutorial_type, 
            p.description, 
            p.status
          FROM packages AS p
          WHERE p.status = 'active'
          ORDER BY p.id DESC;`
        );
        res.json(packages);
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

// controllers/bookingController.js
exports.getAvailableTimeslots = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const [timeslots] = await db.query(
      `SELECT * FROM timeslots 
       WHERE tutor_id = ? 
       AND status = 'available'`,
      [tutorId]
    );
    res.json(timeslots);
  } catch (err) {
    console.error('Error fetching timeslots:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitApplication = async (req, res) => {
  const { student_id, package_id, tutor_id, timeslot_id } = req.body;

  if (!student_id || !package_id || !tutor_id || !timeslot_id) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    // Fetch timeslot snapshot
    const [timeslotRows] = await db.query(
      `SELECT start_time, end_time, status FROM timeslots WHERE id = ?`,
      [timeslot_id]
    );

    if (timeslotRows.length === 0) {
      return res.status(404).json({ message: 'Timeslot not found.' });
    }

    const timeslot = timeslotRows[0];

    // ⏳ Calculate deadline: 10 minutes from now
    const deadline = new Date(Date.now() + 1 * 60 * 1000); // 10 minutes in ms

    // Save application with deadline and snapshot info
    await db.query(
      `INSERT INTO applications 
        (student_id, package_id, tutor_id, timeslot_id, snapshot_start_time, snapshot_end_time, deadline)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id,
        package_id,
        tutor_id,
        timeslot_id,
        timeslot.start_time,
        timeslot.end_time,
        deadline,
      ]
    );

    await db.query(
      `UPDATE timeslots SET status = 'pending' WHERE id = ?`,
      [timeslot_id]
    );

    res.json({ message: 'Application submitted successfully.', deadline });
  } catch (err) {
    console.error('Error submitting application:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.scheduleSessions = async (req, res) => {
  const { application_id, dates } = req.body;

  if (!application_id || !Array.isArray(dates) || dates.length === 0) {
    return res.status(400).json({ message: 'Missing or invalid application_id or dates' });
  }

  try {
    // Get student and tutor info from application
    const [appRows] = await db.query(
      'SELECT student_id, tutor_id FROM applications WHERE id = ?',
      [application_id]
    );

    if (appRows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const { student_id, tutor_id } = appRows[0];

    // Insert each date as a new booking
    const values = dates.map(date => [application_id, student_id, tutor_id, date]);

    await db.query(
      `INSERT INTO bookings (application_id, student_id, tutor_id, session_date)
       VALUES ?`,
      [values]
    );

    return res.status(201).json({ message: 'Sessions booked successfully' });
  } catch (err) {
    console.error('Error booking sessions:', err);
    return res.status(500).json({ message: 'Failed to book sessions' });
  }
};

exports.getAllApplicationsWithBookings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.id AS application_id,
        a.student_id,
        CONCAT(s.fname, ' ', s.lname) AS student_name,
        a.tutor_id,
        CONCAT(t.fname, ' ', t.lname) AS tutor_name,
        a.package_id,
        p.package_name,
        a.snapshot_start_time,
        a.snapshot_end_time,
        p.total_sessions,
        a.application_status,
        a.created_at,

        -- Booking Info (may be null if no bookings yet)
        b.id AS booking_id,
        b.session_date,
        b.status AS booking_status

      FROM applications a
      JOIN users s ON a.student_id = s.id
      JOIN users t ON a.tutor_id = t.id
      JOIN packages p ON a.package_id = p.id
      LEFT JOIN bookings b ON a.id = b.application_id

      WHERE a.application_status = 'Approved'

      ORDER BY a.created_at DESC, b.created_at DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching applications and bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get bookings for specific tutor
exports.getBookingsForTutor = async (req, res) => {
  const { tutorId } = req.params;

  try {
    const [rows] = await db.query(`
    SELECT 
      a.id AS application_id,
      a.student_id,
      CONCAT(s.fname, ' ', s.lname) AS student_name,
      a.tutor_id,
      CONCAT(t.fname, ' ', t.lname) AS tutor_name,
      a.package_id,
      p.package_name,
      a.snapshot_start_time,
      a.snapshot_end_time,
      p.total_sessions,
      a.application_status,
      a.created_at,

      b.id AS booking_id,
      b.session_date,
      b.status AS booking_status

    FROM applications a

    JOIN users s ON a.student_id = s.id
    JOIN users t ON a.tutor_id = t.id
    JOIN packages p ON a.package_id = p.id
    LEFT JOIN bookings b ON a.id = b.application_id

    WHERE a.tutor_id = ? AND a.application_status = 'Approved'
    ORDER BY a.created_at DESC, b.session_date ASC
    `, [tutorId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching tutor bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
//  Accept bookings
exports.acceptBooking = async (req, res) => {
  const { bookingId } = req.params;

  const connection = await db.getConnection(); // Get a connection from the pool

  try {
    await connection.beginTransaction();

    // Fetch booking details
    const [bookings] = await connection.query(`
        SELECT 
        bookings.*, 
        applications.snapshot_start_time, 
        applications.snapshot_end_time
      FROM bookings
      JOIN applications ON bookings.application_id = applications.id
      WHERE bookings.id = ?
    `, [bookingId]);

    if (bookings.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookings[0];

    // Update the booking status to 'accepted'
    const [updateResult] = await connection.query(`
      UPDATE bookings
      SET status = 'accepted'
      WHERE id = ?
    `, [bookingId]);

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ error: 'Failed to update booking' });
    }

    // Insert into schedule table
    await connection.query(`
      INSERT INTO schedules (booking_id, tutor_id, student_id, scheduled_date, start_time, end_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      booking.id,
      booking.tutor_id,
      booking.student_id,
      booking.session_date,
      booking.snapshot_start_time,
      booking.snapshot_end_time
    ]);

    await connection.commit();
    connection.release();

    res.status(200).json({ message: 'Booking accepted and schedule created' });

  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('Error accepting booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getBookingsByStudent = async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const [rows] = await db.query(`
    SELECT 
      a.id AS application_id,
      a.student_id,
      CONCAT(s.fname, ' ', s.lname) AS student_name,
      a.tutor_id,
      CONCAT(t.fname, ' ', t.lname) AS tutor_name,
      a.package_id,
      p.package_name,
      a.snapshot_start_time,
      a.snapshot_end_time,
      p.total_sessions,
      a.application_status,
      a.created_at,

      b.id AS booking_id,
      b.session_date,
      b.status AS booking_status

    FROM applications a
    JOIN users s ON a.student_id = s.id
    JOIN users t ON a.tutor_id = t.id
    JOIN packages p ON a.package_id = p.id
    LEFT JOIN bookings b ON a.id = b.application_id

    WHERE a.student_id = ?
    ORDER BY a.created_at DESC, b.created_at DESC
    `, [studentId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching student bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.cancelBooking = async (req, res) => {
    const { bookingId } = req.params;

  try {
    // Update the booking status to 'accepted'
    const [result] = await db.query(`
      UPDATE bookings
      SET status = 'cancelled'
      WHERE id = ?
    `, [bookingId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking accepted' });
  } catch (error) {
    console.error('Error accepting booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};