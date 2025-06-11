const db = require('../db');

// GET /api/sessions
exports.getAllSessions = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        s.id AS session_id,
        s.status,
        s.confirmed_at,
        sc.scheduled_date,
        sc.start_time,
        sc.end_time,
        student.lname AS student_name,
        tutor.lname AS tutor_name
      FROM sessions s
      JOIN schedules sc ON s.schedule_id = sc.id
      JOIN users AS student ON sc.student_id = student.id
      JOIN users AS tutor ON sc.tutor_id = tutor.id
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

// Get sessions by a specific date (YYYY-MM-DD)
exports.getSessionsByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM sessions WHERE DATE(scheduled_date) = ?',
      [date]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching sessions by date:', err);
    res.status(500).json({ error: 'Failed to fetch sessions by date' });
  }
};

// Update session status
exports.updateSessionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query(
      'UPDATE sessions SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    res.json({ message: 'Session status updated' });
  } catch (err) {
    console.error('Error updating session status:', err);
    res.status(500).json({ error: 'Failed to update session status' });
  }
};

// Get recent session status update logs (optional)
exports.getSessionLogs = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.id AS session_id,
        s.status,
        s.confirmed_at,
        s.updated_at,
        sc.scheduled_date,
        sc.start_time,
        sc.end_time,
        student.lname AS student_name,
        tutor.lname AS tutor_name
      FROM sessions s
      JOIN schedules sc ON s.schedule_id = sc.id
      JOIN users AS student ON sc.student_id = student.id
      JOIN users AS tutor ON sc.tutor_id = tutor.id
      WHERE s.status IN ('confirmed', 'missed') 
      ORDER BY s.updated_at DESC 
      LIMIT 20;
      `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching session logs:', err);
    res.status(500).json({ error: 'Failed to fetch session logs' });
  }
};

exports.getSessionsByTutor = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        s.id AS session_id,
        s.status,
        s.confirmed_at,
        sc.scheduled_date,
        sc.start_time,
        sc.end_time,
        student.lname AS student_name,
        tutor.lname AS tutor_name
      FROM sessions s
      JOIN schedules sc ON s.schedule_id = sc.id
      JOIN users AS student ON sc.student_id = student.id
      JOIN users AS tutor ON sc.tutor_id = tutor.id
      WHERE tutor.id = ?
      ORDER BY sc.scheduled_date, sc.start_time
      `,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching tutor sessions:', err);
    res.status(500).json({ error: 'Failed to fetch tutor sessions' });
  }
};

exports.updateSessionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query(
      'UPDATE sessions SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );
    res.json({ message: 'Session status updated' });
  } catch (err) {
    console.error('Error updating session status:', err);
    res.status(500).json({ error: 'Failed to update session status' });
  }
};
