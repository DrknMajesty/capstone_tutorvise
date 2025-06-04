const db = require('../db');

// Get current user's latest application
exports.getMyApplication = async (req, res) => {
  const studentId = req.user.id;
  try {
    const [rows] = await db.query(`
      SELECT a.*, p.package_name, p.price_package, 
            t.fname AS tutor_fname, t.lname AS tutor_lname
      FROM applications a
      JOIN packages p ON a.package_id = p.id
      JOIN users t ON a.tutor_id = t.id
      WHERE a.student_id = ? AND a.application_status = 'Pending'
      ORDER BY a.created_at DESC
      LIMIT 1;
    `, [studentId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No application found.' });
    }

    res.json(rows[0]);
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
      SET payment_proof = ?, status = 'pending_payment_review'
      WHERE id = ?
    `, [paymentProof, applicationId]);

    res.json({ message: 'Payment proof submitted successfully.' });
  } catch (err) {
    console.error('Error uploading proof:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};
