const db = require('../db');
const { createNotification } = require('../utils/notification'); // adjust path if needed

// GET /api/sessions
exports.getAllSessions = async (req, res) => {
  try {
    const [rows] = await db.execute(`
    SELECT 
      s.id AS session_id,
      s.status,
      sc.scheduled_date,
      sc.start_time,
      sc.end_time,
      student.lname AS student_name,
      tutor.lname AS tutor_name,
      packages.tutorial_type AS tutorial_type

    FROM sessions s
    JOIN schedules sc ON s.schedule_id = sc.id
    JOIN users AS student ON sc.student_id = student.id
    JOIN users AS tutor ON sc.tutor_id = tutor.id

    -- ✅ Add the necessary joins to reach packages
    JOIN bookings ON sc.booking_id = bookings.id
    JOIN applications ON bookings.application_id = applications.id
    JOIN packages ON applications.package_id = packages.id;
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
  const { status, user_id } = req.body;

  try {
    // ✅ 1. Update the session status
    await db.query(
      'UPDATE sessions SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    // ✅ 2. Get session details including names and schedule info
    const [[sessionInfo]] = await db.query(`
      SELECT sch.tutor_id, sch.student_id, sch.scheduled_date, sch.start_time,
             CONCAT(tu.fname, ' ', tu.lname) AS tutor_name,
             CONCAT(su.fname, ' ', su.lname) AS student_name
      FROM sessions s
      JOIN schedules sch ON s.schedule_id = sch.id
      JOIN users tu ON sch.tutor_id = tu.id
      JOIN users su ON sch.student_id = su.id
      WHERE s.id = ?
    `, [id]);

    if (!sessionInfo) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const { tutor_id, student_id, scheduled_date, start_time, tutor_name, student_name } = sessionInfo;

    // ✅ 3. Get the name of the user who updated the status
    const [[updater]] = await db.query(
      `SELECT CONCAT(fname, ' ', lname) AS full_name FROM users WHERE id = ?`,
      [user_id]
    );
    const updaterName = updater?.full_name || 'A staff member';

    // ✅ 4. Format readable date and time
    const readableDate = new Date(scheduled_date).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'Asia/Manila'
    });

    let readableTime = 'N/A';
    if (scheduled_date && start_time) {
      const datePart = new Date(scheduled_date).toISOString().split('T')[0]; // "YYYY-MM-DD"
      const combinedDateTime = new Date(`${datePart}T${start_time}`); // full ISO datetime

      if (!isNaN(combinedDateTime)) {
        readableTime = combinedDateTime.toLocaleTimeString('en-PH', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Manila'
        });
      } else {
        console.warn(`⚠️ Invalid dateTime: ${datePart}T${start_time}`);
      }
    }

    const fullSchedule = `${readableDate} at ${readableTime}`;
    const statusFormatted = status.charAt(0).toUpperCase() + status.slice(1);

    // ✅ 5. Create notification messages
    const commonMessage = `The session between ${tutor_name} and ${student_name} scheduled on ${fullSchedule} has been updated to "${statusFormatted}"`;
    const updaterMessage = `You updated the session between ${tutor_name} and ${student_name} scheduled on ${fullSchedule} to "${statusFormatted}".`;

    // ✅ 6. Send notifications
    await Promise.all([
      createNotification(user_id, updaterMessage),
      tutor_id !== user_id && createNotification(tutor_id, commonMessage),
      student_id !== user_id && createNotification(student_id, commonMessage)
    ]);

    // ✅ 7. Return success response
    res.json({ message: 'Session status updated and notifications sent' });

  } catch (err) {
    console.error('Error updating session status:', err);
    res.status(500).json({ error: 'Failed to update session status' });
  }
};

// Tutor request for status update
exports.requestStatusUpdate = async (req, res) => {
  console.log('🚨 [Manual Status Request] Controller triggered');

  const { id } = req.params;
  const sessionId = parseInt(id, 10);
  const { status } = req.body;

  console.log('Request Params:', { id: sessionId, status });

  if (isNaN(sessionId) || !status) {
    return res.status(400).json({ error: 'Invalid session ID or missing status' });
  }

  try {
    const [[session]] = await db.query(`
      SELECT 
        s.id, s.schedule_id, sch.student_id, sch.tutor_id, 
        sch.scheduled_date, sch.start_time, sch.end_time,
        CONCAT(u.fname, ' ', u.lname) AS tutor_name
      FROM sessions s
      JOIN schedules sch ON s.schedule_id = sch.id
      JOIN users u ON sch.tutor_id = u.id
      WHERE s.id = ?
    `, [sessionId]);

    if (!session) {
      console.log('❌ Session not found');
      return res.status(404).json({ error: 'Session not found' });
    }

    const { tutor_id, tutor_name, scheduled_date, start_time, end_time } = session;

    const [admins] = await db.query(`
      SELECT id FROM users WHERE account_type = 'admin' AND status = 'active'
    `);

    // Format the schedule as "June 19, 2025 at 3:00 PM - 4:00 PM"
    const formattedSchedule = formatScheduleMessage(scheduled_date, start_time, end_time);

    // Respond immediately
    res.json({ message: 'Request to update session status has been sent to admins.' });

    // Notify in background
    setImmediate(async () => {
      const messageToAdmins = `Tutor ${tutor_name} requested to update the session on ${formattedSchedule} to "${status}".`;
      const messageToTutor = `Your request to update the session on ${formattedSchedule} to "${status}" has been sent.`;

      try {
        for (const admin of admins) {
          await createNotification(admin.id, messageToAdmins);
        }

        await createNotification(tutor_id, messageToTutor);
        console.log(`✅ Notifications sent to ${admins.length} admin(s) and tutor ID ${tutor_id}`);
      } catch (notifyErr) {
        console.error('❌ Notification error:', notifyErr);
      }
    });

  } catch (err) {
    console.error('❌ Error sending session status request:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to send request for status update' });
    }
  }
};

// Utility function to format date + time
function formatScheduleMessage(dateStr, startTime, endTime) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const dateObj = new Date(dateStr);
  const formattedDate = dateObj.toLocaleDateString('en-US', options);

  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(':');
    const t = new Date();
    t.setHours(h, m);
    return t.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formattedStart = formatTime(startTime);
  const formattedEnd = formatTime(endTime);

  return `${formattedDate} from ${formattedStart} to ${formattedEnd}`;
}

// Get recent session status update logs (optional)
exports.getSessionLogs = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.id AS session_id,
        s.status,
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
  sc.scheduled_date,
  sc.start_time,
  sc.end_time,
  student.lname AS student_name,
  tutor.lname AS tutor_name,
  f.rating,
  f.comment,
  packages.tutorial_type AS tutorial_type

FROM sessions s
JOIN schedules sc ON s.schedule_id = sc.id
JOIN users AS student ON sc.student_id = student.id
JOIN users AS tutor ON sc.tutor_id = tutor.id
LEFT JOIN feedback f ON f.session_id = s.id

-- ✅ Joins to reach the packages table
JOIN bookings ON sc.booking_id = bookings.id
JOIN applications ON bookings.application_id = applications.id
JOIN packages ON applications.package_id = packages.id

WHERE tutor.id = ?
ORDER BY sc.scheduled_date, sc.start_time;
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
  sc.scheduled_date,
  sc.start_time,
  sc.end_time,
  student.lname AS student_name,
  tutor.lname AS tutor_name,
  f.rating,
  f.comment,
  packages.tutorial_type AS tutorial_type

FROM sessions s
JOIN schedules sc ON s.schedule_id = sc.id
JOIN users AS student ON sc.student_id = student.id
JOIN users AS tutor ON sc.tutor_id = tutor.id
LEFT JOIN feedback f ON f.session_id = s.id

-- ✅ Joins to access tutorial_type
JOIN bookings ON sc.booking_id = bookings.id
JOIN applications ON bookings.application_id = applications.id
JOIN packages ON applications.package_id = packages.id

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