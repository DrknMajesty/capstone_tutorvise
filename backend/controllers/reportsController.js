const db = require('../db'); // adjust if your DB connection is elsewhere

exports.getTutorRatingsReport = async (req, res) => {
  try {
    const [results] = await db.query(`
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
      GROUP BY u.id
    `);

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
