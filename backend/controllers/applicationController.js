const db = require('../db');
const expireOldApplications = require('../utils/expireApplications');
const { createNotification } = require('../utils/notification');
const { sendEmail } = require('../utils/emailService');

exports.getMyApplication = async (req, res) => {
  const studentId = req.user.id;
  try {
    // 1. Fetch the latest application for the student
    const [apps] = await db.query(`
      SELECT 
        a.*, 
        a.paymentType,
        p.package_name,
        p.total_sessions,
        t.gender,
        t.fname AS tutor_fname, 
        t.lname AS tutor_lname,
        -- calculate package cost here
        (CAST(p.price_package AS DECIMAL(10,2)) + (CAST(p.price_sessions AS DECIMAL(10,2)) * p.total_sessions)) AS package_cost
      FROM applications a
      JOIN users t ON a.tutor_id = t.id
      JOIN packages p ON a.package_id = p.id
      WHERE a.student_id = ? 
        AND a.application_status IN ('pending', 'expired', 'submitted', 'approved', 'cancelled', 'done', 'partially_paid')
      ORDER BY a.created_at DESC
      LIMIT 1;
    `, [studentId]);

    if (apps.length === 0) {
      return res.status(404).json({ message: 'No application found.' });
    }

    const application = apps[0];

    // 2. Get all payments for that application
    const [payments] = await db.query(
      `SELECT * FROM payments WHERE application_id = ?`,
      [application.id]
    );
    application.payments = payments;

    // Calculate remaining balance
    const totalPaid = payments.reduce((sum, p) => sum + p.amount_paid, 0);
    const remaining_amount = application.package_cost - totalPaid;
    application.remaining_amount = remaining_amount > 0 ? remaining_amount : 0;

    // 3. Fetch bookings for this application
    const [bookings] = await db.query(`
      SELECT session_date, status
      FROM bookings
      WHERE application_id = ?
        AND status IN ('pending', 'scheduled', 'accepted');
    `, [application.id]);
    application.bookings = bookings;

    // 4. Calculate remaining sessions
    const bookedSessionsCount = bookings.filter(b => b.status !== 'cancelled').length;
    application.remaining_sessions = application.total_sessions - bookedSessionsCount;

    // 5. Expire pending app if deadline passed and no proof
    if (
      application.application_status.toLowerCase() === 'pending' &&
      new Date(application.deadline) < new Date() &&
      !payments.length
    ) {
      await db.query(`
        UPDATE applications 
        SET application_status = 'Expired'
        WHERE id = ?;
      `, [application.id]);
      application.application_status = 'Expired';
    }

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
    // ✅ Get the payment type, student info, and pricing details
    const [[app]] = await db.query(
      `
      SELECT 
        a.paymentType, 
        a.student_id, 
        (CAST(p.price_package AS DECIMAL(10,2)) + (CAST(p.price_sessions AS DECIMAL(10,2)) * p.total_sessions)) AS package_cost,
        CONCAT(u.fname, ' ', u.lname) AS student_name,
        p.package_name
      FROM applications a
      JOIN users u ON a.student_id = u.id
      JOIN packages p ON a.package_id = p.id
      WHERE a.id = ?
      `,
      [applicationId]
    );

    if (!app) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    const isPartial = app.paymentType === 'partial';
    const totalFee = Number(app.package_cost) || 0;
    const amountPaid = isPartial ? totalFee / 2 : totalFee;

    // ✅ Save the payment proof
    await db.query(
      `INSERT INTO payments (application_id, payment_proof, is_partial, amount_paid, payment_date)
       VALUES (?, ?, ?, ?, NOW())`,
      [applicationId, paymentProof, isPartial, amountPaid]
    );

    // ✅ Update application status if not already approved
    await db.query(
      `UPDATE applications 
       SET application_status = CASE 
         WHEN application_status != 'approved' THEN 'submitted' 
         ELSE application_status 
       END
       WHERE id = ?`,
      [applicationId]
    );

    // ✅ Notify admins
    const [admins] = await db.query(`SELECT id, email FROM users WHERE account_type = 'admin'`);

    for (const admin of admins) {
      await createNotification(
        admin.id,
        `New ${isPartial ? 'partial' : 'full'} payment proof submitted by ${app.student_name}`
      );
    }

    // ✅ ✅ EMAIL NOTIFICATION TO ALL ADMINS
    const emailSubject = 'TutorVise: Payment Proof Submission';

    const paymentTypeText = isPartial ? 'a *partial* payment' : 'a *full* payment';

    const emailBody = `
      <p>Dear Admin,</p>
      <p><strong>${app.student_name}</strong> has submitted ${paymentTypeText} proof for the package: <strong>${app.package_name}</strong>.</p>
      <p>Please review and confirm the payment accordingly.</p>
      <p>Regards,<br/>TutorVise System</p>
    `;

    for (const admin of admins) {
      if (admin.email) {
        await sendEmail(admin.email, emailSubject, emailBody);
      }
    }

    res.json({ message: 'Payment proof submitted and awaiting admin approval.' });
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

    // ✅ Create a notification for the student
    await createNotification(application.student_id, `Your application #${applicationId} has been cancelled.`);

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
    // Step 1: Run SQL to get applications + user + package + payments (flat structure)
    const [rows] = await db.query(`
      SELECT 
        a.*,
        p.package_name, 
        p.price_package, 
        p.total_sessions, 
        p.price_sessions,
        s.fname AS student_fname, 
        s.lname AS student_lname,
        t.fname AS tutor_fname, 
        t.lname AS tutor_lname,

        pay.id AS payment_id,
        pay.amount_paid,
        pay.payment_date,
        pay.payment_proof,
        pay.is_partial,
        pay.is_confirmed

      FROM applications a
      JOIN packages p ON a.package_id = p.id
      JOIN users s ON a.student_id = s.id
      JOIN users t ON a.tutor_id = t.id
      LEFT JOIN payments pay ON pay.application_id = a.id

      WHERE a.application_status IN ('Submitted', 'Approved', 'Done', 'Partially_paid')

      ORDER BY 
        CASE a.application_status
          WHEN 'Submitted' THEN 1
          WHEN 'Approved' THEN 2
          WHEN 'Done' THEN 3
        END,
        CASE 
          WHEN a.application_status = 'Submitted' THEN a.created_at
          ELSE NULL
        END ASC,
        CASE 
          WHEN a.application_status IN ('Approved', 'Done') THEN a.created_at
          ELSE NULL
        END DESC
    `);

    // Step 2: Group by application ID and attach payments
    const applicationsMap = new Map();

    for (const row of rows) {
      const appId = row.id;

      if (!applicationsMap.has(appId)) {
        applicationsMap.set(appId, {
          id: row.id,
          student_id: row.student_id,
          tutor_id: row.tutor_id,
          package_id: row.package_id,
          application_status: row.application_status,
          created_at: row.created_at,
          updated_at: row.updated_at,
          paymentType: row.paymentType, // ✅ included here
          snapshot_start_time: row.snapshot_start_time,
          snapshot_end_time: row.snapshot_end_time,

          // Student & tutor
          student_fname: row.student_fname,
          student_lname: row.student_lname,
          tutor_fname: row.tutor_fname,
          tutor_lname: row.tutor_lname,

          // Package info
          package_name: row.package_name,
          price_package: row.price_package,
          total_sessions: row.total_sessions,
          price_sessions: row.price_sessions,

          // Initialize payment list
          payments: [],
        });
      }

      // If there's payment data on this row, push it to the payments array
      if (row.payment_id) {
        applicationsMap.get(appId).payments.push({
          id: row.payment_id,
          amount_paid: row.amount_paid,
          payment_date: row.payment_date,
          payment_proof: row.payment_proof,
          is_partial: row.is_partial,
          is_confirmed: row.is_confirmed,
        });
      }
    }

    // Step 3: Return the grouped applications
    const groupedApplications = Array.from(applicationsMap.values());
    res.status(200).json(groupedApplications);
  } catch (err) {
    console.error('Error fetching submitted applications:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve application
exports.approveApplication = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { id } = req.params; // id = payment.id

    console.log('Approving payment with ID:', id);
    await connection.beginTransaction();

    // ✅ Step 1: Confirm the payment
    await connection.query(
      `UPDATE payments SET is_confirmed = TRUE WHERE id = ?`,
      [id]
    );

    // ✅ Step 2: Get the application_id linked to the payment
    const [[payment]] = await connection.query(
      `SELECT application_id FROM payments WHERE id = ?`,
      [id]
    );
    if (!payment) throw new Error('Payment not found');
    const applicationId = payment.application_id;

    // ✅ Step 3: Get application info
    const [[application]] = await connection.query(
      `SELECT paymentType, application_status, timeslot_id, student_id FROM applications WHERE id = ?`,
      [applicationId]
    );
    if (!application) throw new Error('Application not found');

    const { paymentType, application_status, timeslot_id, student_id } = application;

    // ✅ Step 4: Get number of confirmed payments
    const [[{ confirmedCount }]] = await connection.query(
      `SELECT COUNT(*) AS confirmedCount
       FROM payments
       WHERE application_id = ? AND is_confirmed = TRUE`,
      [applicationId]
    );

    if (paymentType === 'full') {
      // ✅ Full payment — directly approve
      await connection.query(
        `UPDATE applications 
         SET application_status = 'approved',
             expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY)
         WHERE id = ?`,
        [applicationId]
      );

      await connection.query(`UPDATE timeslots SET status = 'booked' WHERE id = ?`, [timeslot_id]);

      await createNotification(student_id, `Your application #${applicationId} has been approved. You have 30 days to book dates for your tutorial sessions.`);

    } else if (paymentType === 'partial') {
      if (confirmedCount === 1 && application_status === 'submitted') {
        // ✅ Initial payment confirmed — mark partially_paid, book slot, notify
        await connection.query(
          `UPDATE applications 
           SET application_status = 'partially_paid'
           WHERE id = ?`,
          [applicationId]
        );

        await connection.query(`UPDATE timeslots SET status = 'booked' WHERE id = ?`, [timeslot_id]);

        await createNotification(student_id, `Initial payment for application #${applicationId} confirmed. You may now book your tutorial session dates.`);

      } else if (confirmedCount >= 2 && application_status === 'partially_paid') {
        // ✅ Final payment confirmed — mark fully approved
        await connection.query(
          `UPDATE applications 
           SET application_status = 'approved',
               expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY)
           WHERE id = ?`,
          [applicationId]
        );

        await createNotification(student_id, `Final payment for application #${applicationId} confirmed. You now have 30 days to complete your tutorial sessions.`);
      }
    }

    await connection.commit();
    res.status(200).json({ message: 'Payment confirmed and application updated accordingly.' });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Error approving payment:', err);
    res.status(500).json({ message: 'Failed to approve payment.' });
  } finally {
    if (connection) connection.release();
  }
};

// Reject application
exports.rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM applications WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const application = rows[0];

    if (application.application_status !== 'submitted') {
      return res.status(400).json({ message: 'Only pending applications can be cancelled' });
    }

    const query = `
      UPDATE applications
      SET application_status = 'Cancelled'
      WHERE id = ?
    `;

      await db.query(
        'UPDATE timeslots SET status = ? WHERE id = ?',
        ['available', application.timeslot_id]
      );

     // ✅ Step 6: Create notification
    await createNotification(application.student_id,`Your application #${id} has been cancelled. Contact Admin for futher instructions.`);

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
    // Step 1: Fetch applications
    const [applications] = await db.query(`
      SELECT 
        a.id AS application_id,
        a.tutor_id,
        a.package_id,
        a.application_status AS status,
        a.created_at,
        p.package_name, 
        p.price_package, 
        p.total_sessions, 
        p.price_sessions,
        t.fname AS tutor_fname, 
        t.lname AS tutor_lname
      FROM applications a
      JOIN packages p ON a.package_id = p.id
      JOIN users t ON a.tutor_id = t.id
      WHERE a.student_id = ?
        AND a.application_status IN ('Approved', 'Done')
      ORDER BY a.created_at DESC;
    `, [studentId]);

    // Step 2: Fetch payments separately
    const [payments] = await db.query(`
      SELECT 
        id AS payment_id,
        application_id,
        amount_paid,
        payment_date,
        payment_proof,
        is_partial,
        is_confirmed
      FROM payments
      WHERE application_id IN (
        SELECT id FROM applications WHERE student_id = ?
      )
      AND is_confirmed = true  
      ORDER BY payment_date ASC;
    `, [studentId]);

    // Step 3: Group payments per application
    const appMap = {};
    applications.forEach(app => {
      appMap[app.application_id] = {
        ...app,
        payments: []
      };
    });

    payments.forEach(pay => {
      if (appMap[pay.application_id]) {
        appMap[pay.application_id].payments.push(pay);
      }
    });

    // Step 4: Convert object back to array
    const result = Object.values(appMap);

    res.json(result);

  } catch (err) {
    console.error('Error fetching applications with payments:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Student Payment Proof Cancellation
exports.cancelPaymentProof = async (req, res) => {
  const paymentId = req.params.paymentId;
  const studentId = req.user.id;

  try {
    // First check if the payment belongs to the student and is not confirmed
    const [paymentRows] = await db.query(
      `SELECT p.id, p.payment_proof 
       FROM payments p
       JOIN applications a ON p.application_id = a.id
       WHERE p.id = ? AND a.student_id = ? AND p.is_confirmed = 0`,
      [paymentId, studentId]
    );

    if (paymentRows.length === 0) {
      return res.status(403).json({ message: 'Cannot cancel this payment. It may already be confirmed or does not belong to you.' });
    }

    const payment = paymentRows[0];

    // Optionally delete the proof image from storage
    const fs = require('fs');
    const filePath = `./uploads/payment_proofs/${payment.payment_proof}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Now delete the payment record entirely
    await db.query(
      `DELETE FROM payments WHERE id = ?`,
      [paymentId]
    );

    res.json({ message: 'Payment record deleted successfully.' });
  } catch (error) {
    console.error('Cancel payment error:', error);
    res.status(500).json({ message: 'Server error while deleting payment.' });
  }
};

exports.confirmOrRejectPayment = async (req, res) => {
  const { paymentId } = req.params;
  const { action } = req.body;

  if (!['confirm', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action. Must be confirm or reject.' });
  }

  try {
    const [rows] = await db.query(
      `SELECT p.id, p.application_id, p.is_confirmed, a.student_id FROM payments p 
       JOIN applications a ON p.application_id = a.id
       WHERE p.id = ?`,
      [paymentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    const payment = rows[0];

    // Get student email and name
    const [studentInfo] = await db.query(`
      SELECT 
        s.email AS student_email, 
        CONCAT(s.fname, ' ', s.lname) AS student_name
      FROM applications a
      JOIN users s ON a.student_id = s.id
      WHERE a.id = ?
    `, [payment.application_id]);

    const studentEmail = studentInfo[0]?.student_email;
    const studentName = studentInfo[0]?.student_name;

    if (!studentEmail) {
      console.warn('Student email not found.');
    }

    if (action === 'confirm') {
      await db.query(`UPDATE payments SET is_confirmed = 1 WHERE id = ?`, [paymentId]);

      const [appStatusRows] = await db.query(
        `SELECT application_status, timeslot_id FROM applications WHERE id = ?`,
        [payment.application_id]
      );

      const currentStatus = appStatusRows[0]?.application_status;
      const timeslotId = appStatusRows[0]?.timeslot_id;

      if (currentStatus === 'submitted') {
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);

        await db.query(
          `UPDATE applications SET application_status = 'approved', expires_at = ? WHERE id = ?`,
          [expiresAt, payment.application_id]
        );

        if (timeslotId) {
          await db.query(
            `UPDATE timeslots SET status = 'booked' WHERE id = ?`,
            [timeslotId]
          );
        }
      }

      // Check confirmed payments
      const [partialConfirmed] = await db.query(`
        SELECT COUNT(*) AS count FROM payments
        WHERE application_id = ? AND is_partial = 1 AND is_confirmed = 1
      `, [payment.application_id]);

      const [fullConfirmed] = await db.query(`
        SELECT COUNT(*) AS count FROM payments
        WHERE application_id = ? AND is_partial = 0 AND is_confirmed = 1
      `, [payment.application_id]);

      // Check accepted bookings
      const [bookingStats] = await db.query(`
        SELECT COUNT(*) AS accepted_count, MAX(p.total_sessions) AS total_sessions
        FROM bookings b
        JOIN applications a ON b.application_id = a.id
        JOIN packages p ON a.package_id = p.id
        WHERE b.application_id = ? AND b.status = 'accepted'
      `, [payment.application_id]);

      const acceptedCount = bookingStats[0].accepted_count;
      const totalSessions = bookingStats[0].total_sessions;

      const paymentConditionMet = (partialConfirmed[0].count >= 2) || (fullConfirmed[0].count >= 1);
      const bookingConditionMet = acceptedCount === totalSessions;

      if (paymentConditionMet && bookingConditionMet) {
        await db.query(
          `UPDATE applications SET application_status = 'done' WHERE id = ?`,
          [payment.application_id]
        );

        const [[packageInfo]] = await db.query(`
          SELECT p.package_name
          FROM applications a
          JOIN packages p ON a.package_id = p.id
          WHERE a.id = ?
        `, [payment.application_id]);

        const doneMessage = `Congratulations! All your bookings for the package "${packageInfo?.package_name}" have been accepted. You may now apply for another package.`;

        // Send in-app notification
        await createNotification(payment.student_id, doneMessage);

        // Send email notification
        if (studentEmail) {
          await sendEmail(
            studentEmail,
            'All Bookings Accepted - TutorVise',
            `<p>Dear ${studentName},</p>
            <p>${doneMessage}</p>
            <p>Thank you for using <strong>TutorVise</strong>.</p>`
          );
        }
      }

      // Send confirmation email
      if (studentEmail) {
        await sendEmail(
          studentEmail,
          'TutorVise Payment Confirmation',
          `<p>Dear ${studentName},</p>
          <p>Your payment has been <strong>confirmed</strong>.</p>
          <p>Thank you for choosing TutorVise!</p>`
        );
      }

      return res.json({ message: 'Payment confirmed successfully.' });

    } else if (action === 'reject') {
      const [proofRow] = await db.query(
        `SELECT payment_proof, application_id FROM payments WHERE id = ?`,
        [paymentId]
      );

      if (proofRow.length > 0) {
        const { payment_proof, application_id } = proofRow[0];

        if (payment_proof) {
          const fs = require('fs');
          const filePath = `./uploads/payment_proofs/${payment_proof}`;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }

        await db.query(`DELETE FROM payments WHERE id = ?`, [paymentId]);

        await db.query(
          `UPDATE applications SET application_status = 'pending' WHERE id = ? AND application_status = 'submitted'`,
          [application_id]
        );

        // Send rejection email
        if (studentEmail) {
          await sendEmail(
            studentEmail,
            'TutorVise Payment Rejected',
            `<p>Dear ${studentName},</p>
            <p>We regret to inform you that your submitted payment proof has been <strong>rejected</strong>. Please upload a valid proof to proceed with your application.</p>
            <p>If you have questions, feel free to contact support.</p>`
          );
        }
      }

      return res.json({ message: 'Payment proof rejected, deleted, and application status set to pending.' });
    }

  } catch (err) {
    console.error('Admin payment confirmation error:', err);
    res.status(500).json({ message: 'Server error during payment action.' });
  }
};
