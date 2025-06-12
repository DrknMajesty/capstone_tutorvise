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
        tutor.lname AS tutor_name,
        f.rating,
        f.comment
      FROM sessions s
      JOIN schedules sc ON s.schedule_id = sc.id
      JOIN users AS student ON sc.student_id = student.id
      JOIN users AS tutor ON sc.tutor_id = tutor.id
      LEFT JOIN feedback f ON f.session_id = s.id
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

exports.autoUpdateSessionStatus = async (req, res) => {
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

// GET /sessions/student/:studentId
exports.getStudentSessions = async (req, res) => {
  const { studentId } = req.params;

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
      tutor.lname AS tutor_name,
      f.rating,
      f.comment
    FROM sessions s
    JOIN schedules sc ON s.schedule_id = sc.id
    JOIN users AS student ON sc.student_id = student.id
    JOIN users AS tutor ON sc.tutor_id = tutor.id
    LEFT JOIN feedback f ON f.session_id = s.id
    WHERE student.id = ?
    ORDER BY sc.scheduled_date, sc.start_time;
    `,  
      [studentId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching student sessions:', err);
    res.status(500).json({ error: 'Failed to retrieve sessions' });
  }
};

// POST /sessions/:sessionId/feedback
exports.submitFeedback = async (req, res) => {
  const { sessionId } = req.params;
  const { rating, comment } = req.body;

  try {
    // Ensure the session exists and is confirmed
    const [existing] = await db.execute(
      `SELECT status FROM sessions WHERE id = ?`,
      [sessionId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (existing[0].status !== 'confirmed') {
      return res.status(400).json({ error: 'Session is not confirmed for feedback' });
    }

    // Insert or update feedback
    await db.execute(
      `INSERT INTO feedback (session_id, rating, comment)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)`,
      [sessionId, rating, comment]
    );

    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

// GET /sessions/:sessionId/feedback
exports.getFeedback = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT rating, comment
       FROM feedback
       WHERE session_id = ?`,
      [sessionId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No feedback submitted for this session' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ error: 'Failed to retrieve feedback' });
  }
};