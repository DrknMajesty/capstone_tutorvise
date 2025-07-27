const db = require('../db'); // adjust if your DB connection is elsewhere

exports.getTutorRatingsReport = async (req, res) => {
  const { start, end } = req.query;

  try {
    let query = `
      SELECT 
        u.id AS tutor_id,
        CONCAT(u.fname, ' ', u.lname) AS name,
        COUNT(f.rating) AS rating_count,
        IFNULL(AVG(f.rating), 0) AS average_rating
      FROM users u
      JOIN schedules sch ON sch.tutor_id = u.id
      JOIN sessions sess ON sess.schedule_id = sch.id
      LEFT JOIN feedback f ON f.session_id = sess.id
      WHERE u.account_type = 'tutor'
    `;

    const params = [];

    if (start && end) {
      query += ` AND sch.scheduled_date BETWEEN ? AND ?`;
      params.push(start, end);
    }

    query += ` GROUP BY u.id`;

    const [results] = await db.query(query, params);

    res.json(results);
  } catch (err) {
    console.error('Error generating ratings report:', err);
    res.status(500).json({ message: 'Failed to generate ratings report.' });
  }
};

exports.getTutorFeedbackDetails = async (req, res) => {
  const tutorId = req.params.tutorId;

  try {
    const [results] = await db.query(`
SELECT 
  sch.scheduled_date,
  sch.student_id,
  student.lname AS student_lname,
  student.fname as student_fname,
  sch.start_time,
  sch.end_time,
  f.rating,
  f.comment
FROM schedules sch
JOIN sessions sess ON sess.schedule_id = sch.id
JOIN feedback f ON f.session_id = sess.id
JOIN users student ON student.id = sch.student_id
WHERE sch.tutor_id = ?
  AND sess.status = 'confirmed'
  AND f.rating IS NOT NULL
ORDER BY sch.scheduled_date DESC, sch.start_time;
    `, [tutorId]);
      console.log("Data:", results);
    res.json(results);
  } catch (err) {
    console.error('Error fetching tutor feedback details:', err);
    res.status(500).json({ message: 'Failed to fetch tutor feedback.' });
  }
};

exports.getFinanceReport = async (req, res) => {
  const { start, end } = req.query;

  try {
    let baseSql = `
      SELECT 
        p.id AS payment_id,
        p.application_id,
        p.amount_paid,
        p.payment_date,
        p.is_partial,
        p.is_confirmed,

        a.student_id,
        a.paymentType,
        a.application_status,
        a.created_at,

        CONCAT(u.fname, ' ', u.lname) AS student_name,
        pkg.package_name,
        (CAST(pkg.price_package AS DECIMAL(10,2)) + (CAST(pkg.price_sessions AS DECIMAL(10,2)) * pkg.total_sessions)) AS total_price
      FROM payments p
      JOIN applications a ON p.application_id = a.id
      JOIN users u ON a.student_id = u.id
      JOIN packages pkg ON a.package_id = pkg.id
      WHERE p.is_confirmed = 1
    `;

    const params = [];

    if (start && end) {
      baseSql += ` AND DATE(p.payment_date) BETWEEN ? AND ?`;
      params.push(start, end);
    }

    baseSql += ` ORDER BY p.payment_date DESC`;

    const [payments] = await db.query(baseSql, params);

    const totalCollection = payments.reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);

    res.json({ totalCollection, payments });
  } catch (err) {
    console.error('Error generating financial report:', err);
    res.status(500).json({ message: 'Failed to generate financial report.' });
  }
};
