const db = require('../db'); // your MySQL2 connection
const { createNotification } = require('../utils/notification');
const { sendEmail } = require('../utils/emailService');

exports.getAllSchedules = async (req, res) => {
  try {
    const [rows] = await db.query(`
SELECT 
  schedules.id,
  schedules.scheduled_date,
  schedules.start_time,
  schedules.end_time,

  applications.student_id,
  applications.tutor_id,

  student.fname AS student_first_name,
  student.lname AS student_last_name,
  tutor.fname AS tutor_first_name,  
  tutor.lname AS tutor_last_name,

  packages.package_name AS package_name,
  packages.tutorial_type AS type

FROM schedules

-- Link to booking
JOIN bookings ON schedules.booking_id = bookings.id

-- Link to application
JOIN applications ON bookings.application_id = applications.id

-- Join users via applications
JOIN users AS student ON applications.student_id = student.id
JOIN users AS tutor ON applications.tutor_id = tutor.id

-- Join package info
JOIN packages ON applications.package_id = packages.id

-- Join session
JOIN sessions ON sessions.schedule_id = schedules.id

-- Filter for upcoming
WHERE sessions.status IN ('upcoming')

ORDER BY schedules.scheduled_date, schedules.start_time;
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.rescheduleSchedule = async (req, res) => {
  const scheduleId = parseInt(req.params.id, 10);
  const { user_id, scheduled_date, start_time, end_time } = req.body;

  if (!scheduled_date || !start_time || !end_time) {
    return res.status(400).json({ error: 'scheduled_date, start_time, and end_time are required' });
  }

  try {
    const [scheduleRows] = await db.query(`
    SELECT 
      applications.tutor_id,
      applications.student_id,
      CONCAT(tutor.fname, ' ', tutor.lname) AS tutor_name,
      CONCAT(student.fname, ' ', student.lname) AS student_name,
      tutor.email AS tutor_email,
      student.email AS student_email

    FROM schedules
    JOIN bookings ON schedules.booking_id = bookings.id
    JOIN applications ON bookings.application_id = applications.id
    JOIN users AS tutor ON applications.tutor_id = tutor.id
    JOIN users AS student ON applications.student_id = student.id

    WHERE schedules.id = ?;
    `, [scheduleId]);

    if (scheduleRows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const {
      tutor_id,
      student_id,
      tutor_name,
      student_name,
      tutor_email,
      student_email
    } = scheduleRows[0];

    const [conflicts] = await db.query(`
      SELECT 1
      FROM schedules sch
      JOIN bookings b ON sch.booking_id = b.id
      JOIN applications a ON b.application_id = a.id
      WHERE sch.id != ?
        AND sch.scheduled_date = ?
        AND (a.tutor_id = ? OR a.student_id = ?)
        AND (
          (sch.start_time < ? AND sch.end_time > ?) OR
          (sch.start_time < ? AND sch.end_time > ?) OR
          (sch.start_time >= ? AND sch.end_time <= ?)
        )
      LIMIT 1
    `, [
      scheduleId,
      scheduled_date,
      tutor_id,
      student_id,
      end_time, start_time,
      start_time, end_time,
      start_time, end_time
    ]);

    if (conflicts.length > 0) {
      return res.status(409).json({ error: 'Conflict detected with existing schedule.' });
    }

    await db.query(`
      UPDATE schedules
      SET scheduled_date = ?, start_time = ?, end_time = ?
      WHERE id = ?
    `, [scheduled_date, start_time, end_time, scheduleId]);

    await db.query(`
      UPDATE sessions
      SET status = 'upcoming'
      WHERE schedule_id = ?
    `, [scheduleId]);

    const formattedDate = new Date(scheduled_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const [startHour, startMinute] = start_time.split(':');
    const [endHour, endMinute] = end_time.split(':');

    const startDateTime = new Date(scheduled_date);
    startDateTime.setHours(startHour, startMinute);
    const endDateTime = new Date(scheduled_date);
    endDateTime.setHours(endHour, endMinute);

    const formattedStartTime = startDateTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const formattedEndTime = endDateTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const currentUserMsg = `You rescheduled a session of ${tutor_name} & ${student_name} to ${formattedDate}, from ${formattedStartTime} to ${formattedEndTime}.`;
    const studentMessage = `Your session with ${tutor_name} has been rescheduled to ${formattedDate}, from ${formattedStartTime} to ${formattedEndTime}.`;
    const tutorMessage = `Your session with ${student_name} has been rescheduled to ${formattedDate}, from ${formattedStartTime} to ${formattedEndTime}.`;

    // ✅ Notifications - fire without blocking
    const notify = [
      createNotification(user_id, currentUserMsg),
      createNotification(student_id, studentMessage),
      createNotification(tutor_id, tutorMessage)
    ];

    const [admins] = await db.query(`SELECT id FROM users WHERE account_type = 'Admin' AND status = 'active'`);
    const adminMessage = `Schedule between ${student_name} and ${tutor_name} has been rescheduled to ${formattedDate}, from ${formattedStartTime} to ${formattedEndTime}.`;

    for (const admin of admins) {
      notify.push(createNotification(admin.id, adminMessage));
    }

    // Wait for all notifications in parallel, but do not throw if one fails
    await Promise.allSettled(notify);

    // ✅ Send emails in background
    setImmediate(async () => {
      try {
        const subject = 'TutorVise: Session Rescheduled';

        const studentEmailBody = `
          <p>Dear ${student_name},</p>
          <p>Your session with <strong>${tutor_name}</strong> has been rescheduled.</p>
          <p><strong>Date:</strong> ${formattedDate}<br/>
          <strong>Time:</strong> ${formattedStartTime} to ${formattedEndTime}</p>
          <p>Please check your dashboard for updated details.</p>
          <p>Regards,<br/>TutorVise System</p>
        `;

        const tutorEmailBody = `
          <p>Dear ${tutor_name},</p>
          <p>Your session with <strong>${student_name}</strong> has been rescheduled.</p>
          <p><strong>Date:</strong> ${formattedDate}<br/>
          <strong>Time:</strong> ${formattedStartTime} to ${formattedEndTime}</p>
          <p>Please check your dashboard for updated details.</p>
          <p>Regards,<br/>TutorVise System</p>
        `;

        await Promise.allSettled([
          student_email && sendEmail(student_email, subject, studentEmailBody),
          tutor_email && sendEmail(tutor_email, subject, tutorEmailBody)
        ]);
      } catch (e) {
        console.error('Error sending reschedule emails:', e.message);
      }
    });

    return res.json({ message: 'Schedule updated successfully and notifications queued.' });

  } catch (error) {
    console.error('Error rescheduling:', error.stack || error.message || error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
