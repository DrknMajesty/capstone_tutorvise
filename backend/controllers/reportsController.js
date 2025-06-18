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
        sch.start_time,
        sch.end_time,
        f.rating,
        f.comment
      FROM schedules sch
      JOIN sessions sess ON sess.schedule_id = sch.id
      JOIN feedback f ON f.session_id = sess.id
      WHERE sch.tutor_id = ?
        AND sess.status = 'confirmed'
        AND f.rating IS NOT NULL
      ORDER BY sch.scheduled_date DESC, sch.start_time
    `, [tutorId]);

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
      a.id AS application_id,
      a.application_status,
      CONCAT(s.fname, ' ', s.lname) AS student_name,
      p.package_name,
      a.submitted_at,
      (CAST(p.price_package AS DECIMAL(10,2)) + (CAST(p.price_sessions AS DECIMAL(10,2)) * p.total_sessions)) AS total_price
    FROM applications a
    JOIN packages p ON a.package_id = p.id
    JOIN users s ON a.student_id = s.id
    WHERE a.application_status IN ('Approved', 'Submitted', 'Done')
    `;

    const params = [];
    if (start && end) {
      baseSql += ` AND DATE(a.submitted_at) BETWEEN ? AND ?`;
      params.push(start, end);
    }

    const [apps] = await db.query(baseSql, params);
    console.log('Fetched applications:', apps);

  const income = apps
    .filter(a => ['approved', 'done'].includes(a.application_status.toLowerCase()))
    .reduce((sum, a) => sum + parseFloat(a.total_price || 0), 0);

  const receivables = apps
    .filter(a => a.application_status.toLowerCase() === 'submitted')
    .reduce((sum, a) => sum + parseFloat(a.total_price || 0), 0);

    res.json({ income, receivables, applications: apps });
  } catch (err) {
    console.error('Error generating financial report:', err);
    res.status(500).json({ message: 'Failed to generate financial report.' });
  }
};
