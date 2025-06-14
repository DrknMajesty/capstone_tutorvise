const db = require('../db');
const expireOldApplications = require('../utils/expireApplications');

// Get current user's latest application
exports.getMyApplication = async (req, res) => {
  const studentId = req.user.id;
  try {
    // 1. Fetch the latest application for the student
    const [apps] = await db.query(`
      SELECT 
        a.*, 
        p.package_name, 
        p.price_package, 
        p.total_sessions,
        t.fname AS tutor_fname, 
        t.lname AS tutor_lname
      FROM applications a
      JOIN packages p ON a.package_id = p.id
      JOIN users t ON a.tutor_id = t.id
      WHERE a.student_id = ? 
        AND a.application_status IN ('Pending', 'Expired', 'Submitted', 'Approved', 'Cancelled')
      ORDER BY a.created_at DESC
      LIMIT 1;
    `, [studentId]);

    if (apps.length === 0) {
      return res.status(404).json({ message: 'No application found.' });
    }

    const application = apps[0];

    // 2. Fetch bookings for this application separately
    const [bookings] = await db.query(`
      SELECT session_date, status
      FROM bookings
      WHERE application_id = ?
      AND status IN ('pending', 'scheduled', 'accepted');
    `, [application.id]);

    // 3. Calculate remaining sessions (total_sessions - booked sessions count)
    const bookedSessionsCount = bookings.filter(b => b.status !== 'cancelled').length;
    application.remaining_sessions = application.total_sessions - bookedSessionsCount;

    // 4. Check if pending application should be expired
    if (application.application_status === 'Pending' && 
        new Date(application.deadline) < new Date() && 
        !application.payment_proof) {
      await db.query(`
        UPDATE applications 
        SET application_status = 'Expired'
        WHERE id = ?;
      `, [application.id]);
      application.application_status = 'Expired';
    }

    // 5. Attach bookings array to the response
    application.bookings = bookings;

    res.json(application);
  } catch (err) {
    console.error('Error fetching application:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Submit payment proof
exports.submitPaymentProof = async (req, res) => {
  const applicationId = req.params.applicationId;
  const paymentProof = req.file?.filename;

  if (!paymentProof) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    await db.query(`
      UPDATE applications 
      SET payment_proof = ?, 
          submitted_at = NOW(),
          application_status = 'Submitted'
      WHERE id = ?;
    `, [paymentProof, applicationId]);

    res.json({ message: 'Payment proof submitted successfully.' });
  } catch (err) {
    console.error('Error uploading proof:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};
// Cancel Application
exports.cancelApplication = async (req, res) => {
  const applicationId = req.params.id;

  try {
    // Fetch the application
    const [rows] = await db.query(
      'SELECT * FROM applications WHERE id = ?',
      [applicationId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const application = rows[0];

    if (application.application_status !== 'pending') {
      return res.status(400).json({ message: 'Only pending applications can be cancelled' });
    }

    // Update application status to 'cancelled'
    await db.query(
      'UPDATE applications SET application_status = ? WHERE id = ?',
      ['cancelled', applicationId]
    );

    // Free up the timeslot
    await db.query(
      'UPDATE timeslots SET status = ? WHERE id = ?',
      ['available', application.timeslot_id]
    );

    return res.status(200).json({ message: 'Application cancelled and timeslot made available' });
  } catch (error) {
    console.error('Cancel application error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ADMIN 
// Get all submitted applications
exports.getSubmittedApplications = async (req, res) => {
  try {
    const query = `
      SELECT a.*, 
             p.package_name, p.price_package, p.total_sessions, p.price_sessions,
             s.fname AS student_fname, s.lname AS student_lname,
             t.fname AS tutor_fname, t.lname AS tutor_lname
      FROM applications a
      JOIN packages p ON a.package_id = p.id
      JOIN users s ON a.student_id = s.id
      JOIN users t ON a.tutor_id = t.id
      WHERE a.application_status IN ('Pending', 'Approved', 'Cancelled', 'Submitted')
      ORDER BY a.created_at DESC
    `;
    const [rows] = await db.query(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching submitted applications:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveApplication = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { id } = req.params;

    await connection.beginTransaction();

    // Step 1: Update the application status and expiry
    const updateAppQuery = `
      UPDATE applications
      SET application_status = 'Approved',
          expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY)
      WHERE id = ?
    `;
    await connection.query(updateAppQuery, [id]);

    // Step 2: Get timeslot_id and package_id from the application
    const [appRows] = await connection.query(
      `SELECT timeslot_id, package_id FROM applications WHERE id = ?`,
      [id]
    );

    if (appRows.length === 0 || !appRows[0].timeslot_id) {
      throw new Error('Timeslot not found for the application.');
    }

    const timeslotId = appRows[0].timeslot_id;
    const packageId = appRows[0].package_id;

    // Step 3: Get package details to calculate total price
    const [packageRows] = await connection.query(
      `SELECT price_package, total_sessions, price_sessions FROM packages WHERE id = ?`,
      [packageId]
    );

    if (packageRows.length === 0) {
      throw new Error('Package not found.');
    }

    const pricePackage = parseFloat(packageRows[0].price_package);
    const totalSessions = parseInt(packageRows[0].total_sessions);
    const pricePerSession = parseFloat(packageRows[0].price_sessions);

    const amountPaid = Number((pricePackage + totalSessions * pricePerSession).toFixed(2));

    // Step 4: Update the timeslot status to 'booked'
    const updateTimeslotQuery = `
      UPDATE timeslots
      SET status = 'booked'
      WHERE id = ?
    `;
    await connection.query(updateTimeslotQuery, [timeslotId]);

    // Step 5: Insert payment record with calculated total price
    const insertPaymentQuery = `
      INSERT INTO payments (application_id, amount_paid, payment_date)
      VALUES (?, ?, NOW())
    `;
    await connection.query(insertPaymentQuery, [id, amountPaid]);

    await connection.commit();
    res.status(200).json({ message: 'Application approved, timeslot booked, and payment recorded.' });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Error approving application:', err);
    res.status(500).json({ message: 'Failed to approve application.' });
  } finally {
    if (connection) connection.release();
  }
};


// Reject application
exports.rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE applications
      SET application_status = 'Cancelled'
      WHERE id = ?
    `;
    await db.query(query, [id]);
    res.status(200).json({ message: 'Application rejected.' });
  } catch (err) {
    console.error('Error rejecting application:', err);
    res.status(500).json({ message: 'Failed to reject application.' });
  }
};

exports.expireApplicationsBulk = async (req, res) => {
  try {
    const result = await expireOldApplications();
    res.json({ 
      message: `Expired ${result.expiredCount} applications`,
      expiredCount: result.expiredCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.expireSingleApplication = async (req, res) => {
  const applicationId = req.params.id;

  try {
    const [rows] = await db.query(
      'SELECT * FROM applications WHERE id = ?',
      [applicationId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const application = rows[0];
    const now = new Date();

    if (application.application_status === 'pending' && new Date(application.deadline) < now) {
      await db.query(
        'UPDATE applications SET application_status = ? WHERE id = ?',
        ['expired', applicationId]
      );

      await db.query(
        'UPDATE timeslots SET status = ? WHERE id = ?',
        ['available', application.timeslot_id]
      );

      return res.json({ message: 'Application expired and timeslot freed' });
    }

    return res.status(400).json({ error: 'Application not eligible for expiration' });
  } catch (err) {
    console.error('Error expiring application:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMyApplications = async (req, res) => {
  const studentId = req.user.id;
  try {
    const [apps] = await db.query(`
  SELECT 
    a.id,
    a.tutor_id,
    a.package_id,
    a.application_status AS status,
    a.submitted_at,
    a.created_at,
    p.package_name, 
    p.price_package, 
    p.total_sessions, 
    p.price_sessions,
    t.fname AS tutor_fname, 
    t.lname AS tutor_lname,
    pay.id AS payment_id,
    pay.amount_paid AS paid_amount,
    pay.payment_date

  FROM applications a
  JOIN packages p ON a.package_id = p.id
  JOIN users t ON a.tutor_id = t.id
  LEFT JOIN payments pay ON pay.application_id = a.id

  WHERE a.student_id = 2
    AND a.application_status IN ('Approved')

  ORDER BY a.submitted_at DESC;
    `, [studentId]);

    res.json(apps);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

