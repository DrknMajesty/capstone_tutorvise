const db = require('../db');
const { createNotification } = require('../utils/notification');

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

    // ⏳ Calculate deadline: 
    const deadline = new Date(Date.now() + 10 * 60 * 1000); 

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
// 
exports.scheduleSessions = async (req, res) => {
  const { application_id, dates } = req.body;

  if (!application_id || !Array.isArray(dates) || dates.length === 0) {
    return res.status(400).json({ message: 'Missing or invalid application_id or dates' });
  }

  try {
    // Get student and tutor info with student's name from users table
    const [appRows] = await db.query(
      `SELECT a.student_id, a.tutor_id, u.fname, u.lname
       FROM applications a
       JOIN users u ON a.student_id = u.id
       WHERE a.id = ?`,
      [application_id]
    );

    if (appRows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const { student_id, tutor_id, fname, lname } = appRows[0];

    // Insert each date as a new booking
    const values = dates.map(date => [application_id, student_id, tutor_id, date]);

    await db.query(
      `INSERT INTO bookings (application_id, student_id, tutor_id, session_date)
       VALUES ?`,
      [values]
    );

    // Create notifications for tutor and student
    const sessionCount = dates.length;
    const formattedDates = dates.map(date => new Date(date)).sort((a, b) => a - b);
    const firstDate = formattedDates[0].toISOString().split('T')[0];
    const lastDate = formattedDates[formattedDates.length - 1].toISOString().split('T')[0];

    const tutorMsg = `You have ${sessionCount} new session${sessionCount > 1 ? 's' : ''} booked by ${fname} ${lname}, scheduled from ${firstDate} to ${lastDate}. Please check these in your booking page.`;
    await createNotification(tutor_id, tutorMsg);

    const studentMsg = `You have successfully booked ${sessionCount} session${sessionCount > 1 ? 's' : ''} with your tutor, scheduled from ${firstDate} to ${lastDate}. You may review them in your booking page.`;
    await createNotification(student_id, studentMsg);


    return res.status(201).json({ message: 'Sessions booked successfully' });
  } catch (err) {
    console.error('Error booking sessions:', err);
    return res.status(500).json({ message: 'Failed to book sessions' });
  }
};

// Get Application with Bookings
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

      WHERE a.application_status IN ('Approved', 'Done')

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

    WHERE a.tutor_id = ? AND a.application_status IN ('Approved', 'Done')
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
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Fetch booking details
    const [bookings] = await connection.query(`
      SELECT 
        bookings.*, 
        applications.snapshot_start_time, 
        applications.snapshot_end_time,
        applications.timeslot_id,
        applications.package_id,
        applications.id AS application_id,
        packages.total_sessions,
        packages.package_name,
        CONCAT(tutor.fname, ' ', tutor.lname) AS tutor_name,
        CONCAT(student.fname, ' ', student.lname) AS student_name
      FROM bookings
      JOIN applications ON bookings.application_id = applications.id
      JOIN packages ON applications.package_id = packages.id
      JOIN users AS tutor ON bookings.tutor_id = tutor.id
      JOIN users AS student ON bookings.student_id = student.id
      WHERE bookings.id = ?
    `, [bookingId]);

    if (bookings.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookings[0];

    // 1.5 Check for conflicting 'upcoming' sessions
    const [conflicts] = await connection.query(`
      SELECT sch.*
      FROM schedules sch
      JOIN sessions s ON s.schedule_id = sch.id
      WHERE sch.tutor_id = ?
        AND sch.student_id = ?
        AND sch.scheduled_date = ?
        AND s.status = 'upcoming'
        AND (
          (sch.start_time < ? AND sch.end_time > ?) OR
          (sch.start_time < ? AND sch.end_time > ?) OR
          (sch.start_time >= ? AND sch.end_time <= ?)
        )
    `, [
      booking.tutor_id,
      booking.session_date,
      booking.snapshot_end_time, booking.snapshot_end_time,
      booking.snapshot_start_time, booking.snapshot_start_time,
      booking.snapshot_start_time, booking.snapshot_end_time
    ]);

    if (conflicts.length > 0) {
      await connection.rollback();
      connection.release();
      return res.status(409).json({
        error: 'Schedule conflict detected.'
      });
    }

    // 2. Update booking status
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

    // 3. Insert into schedules
    const [scheduleResult] = await connection.query(`
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

    const scheduleId = scheduleResult.insertId;

    // 4. Insert into sessions
    await connection.query(`
      INSERT INTO sessions (schedule_id, status)
      VALUES (?, 'upcoming')
    `, [scheduleId]);

    // 5. Count accepted bookings for this application
    const [acceptedCountResult] = await connection.query(`
      SELECT COUNT(*) AS accepted_count
      FROM bookings
      WHERE application_id = ? AND status = 'accepted'
    `, [booking.application_id]);

    const acceptedCount = acceptedCountResult[0].accepted_count;
    let applicationMarkedDone = false;

    // 6. If all sessions accepted, mark timeslot and application as done
    if (acceptedCount === booking.total_sessions) {
      await connection.query(`
        UPDATE timeslots
        SET status = 'available'
        WHERE id = ?
      `, [booking.timeslot_id]);

      await connection.query(`
        UPDATE applications
        SET application_status = 'done'
        WHERE id = ?
      `, [booking.application_id]);

      applicationMarkedDone = true;
    }

    // 7. Commit transaction
    await connection.commit();
    connection.release();

    // 8. Send notifications
    const sessionDate = new Date(booking.session_date);
    const formattedDate = sessionDate.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const studentMessage = `Your booking for ${formattedDate} has been accepted by ${booking.tutor_name}. Please be ready on your scheduled date.`;
    const tutorMessage = `The booking of ${booking.student_name} on ${formattedDate} has been accepted.`;

    await createNotification(booking.student_id, studentMessage);
    await createNotification(booking.tutor_id, tutorMessage);

    if (applicationMarkedDone) {
      const succesMessage = `Congratulations! All your bookings for this package "${booking.package_name}" have been accepted. You can now apply another package.`;
      await createNotification(booking.student_id, succesMessage);
    }

    res.status(200).json({
      message: 'Booking accepted, schedule and session created'
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('Error accepting booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get bookings of a student
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

    WHERE a.student_id = ? AND application_status IN ('approved', 'done')
    ORDER BY a.created_at DESC, b.created_at DESC
    `, [studentId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching student bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// student cancel student booking
exports.cancelBooking = async (req, res) => {
    const { bookingId } = req.params;

  try {
    // Update the booking status to 'Cancelled'
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
// Tutor Cancel student booking
exports.tutorBookingCancel = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancel_reason } = req.body;
    const tutorId = req.user.id;

    if (!cancel_reason) {
      return res.status(400).json({
        success: false,
        message: 'Cancellation reason is required'
      });
    }

    // Fetch booking details
    const [bookingCheck] = await db.query(
      `SELECT b.id, b.status, b.tutor_id, b.student_id, b.session_date 
       FROM bookings b
       WHERE b.id = ?`,
      [bookingId]
    );

    if (bookingCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const booking = bookingCheck[0];

    if (booking.tutor_id !== tutorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own bookings'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending bookings can be cancelled by tutor'
      });
    }

    // Cancel the booking
    await db.query(
      `UPDATE bookings SET status = 'cancelled' WHERE id = ?`,
      [bookingId]
    );

    // Fetch tutor name
    const [tutorResult] = await db.query(
      `SELECT CONCAT(fname, ' ', lname) AS tutor_name FROM users WHERE id = ?`,
      [tutorId]
    );

    const tutorName = tutorResult.length > 0 ? tutorResult[0].tutor_name : 'The tutor';

    // Format scheduled_date using native Date methods
    const dateObj = new Date(booking.session_date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);

    // Send notification to student
    const message = `Your tutor ${tutorName} has cancelled your booking scheduled on ${formattedDate}. Reason: ${cancel_reason}`;
    await createNotification(booking.student_id, message);

    // Send notification to tutor
    const tutorMessage = `You cancelled a student booking on ${formattedDate}. Reason: ${cancel_reason}`;
    await createNotification(booking.tutor_id, tutorMessage);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      cancel_reason
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
};
