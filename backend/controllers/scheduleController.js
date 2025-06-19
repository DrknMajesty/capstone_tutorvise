const db = require('../db'); // your MySQL2 connection
const { createNotification } = require('../utils/notification');

exports.getAllSchedules = async (req, res) => {
  try {
    const [rows] = await db.query(`
SELECT 
  schedules.id,
  schedules.scheduled_date,
  schedules.start_time,
  schedules.end_time,
  schedules.student_id,
  schedules.tutor_id,

  student.fname AS student_first_name,
  student.lname AS student_last_name,
  tutor.fname AS tutor_first_name,  
  tutor.lname AS tutor_last_name,

  packages.package_name AS package_name,
  packages.tutorial_type AS type

FROM schedules

-- Join student and tutor
JOIN users AS student ON schedules.student_id = student.id
JOIN users AS tutor ON schedules.tutor_id = tutor.id

-- Join booking → application → package path
JOIN bookings ON schedules.booking_id = bookings.id
JOIN applications ON bookings.application_id = applications.id
JOIN packages ON applications.package_id = packages.id

-- ✅ Join sessions and filter by 'upcoming'
JOIN sessions ON sessions.schedule_id = schedules.id
WHERE sessions.status IN ('upcoming', 'completed')

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
  console.log('🛠️ Received user_id:', user_id);

  if (!scheduled_date || !start_time || !end_time) {
    return res.status(400).json({ error: 'scheduled_date, start_time, and end_time are required' });
  }

  try {
    // 1. Fetch the schedule details including names
    const [scheduleRows] = await db.query(`
      SELECT 
        schedules.tutor_id, 
        schedules.student_id,
        CONCAT(tutor.fname, ' ', tutor.lname) AS tutor_name,
        CONCAT(student.fname, ' ', student.lname) AS student_name
      FROM schedules
      JOIN users AS tutor ON schedules.tutor_id = tutor.id
      JOIN users AS student ON schedules.student_id = student.id
      WHERE schedules.id = ?
    `, [scheduleId]);

    if (scheduleRows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const { tutor_id, student_id, tutor_name, student_name } = scheduleRows[0];

    // 2. Check for schedule conflicts
    const [conflicts] = await db.query(`
      SELECT 1 FROM schedules
      WHERE id != ?
        AND scheduled_date = ?
        AND (tutor_id = ? OR student_id = ?)
        AND (
          (start_time < ? AND end_time > ?) OR
          (start_time < ? AND end_time > ?) OR
          (start_time >= ? AND end_time <= ?)
        )
      LIMIT 1
    `, [
      scheduleId,
      scheduled_date,
      tutor_id,
      student_id,
      end_time,
      start_time,
      start_time,
      end_time,
      start_time,
      end_time
    ]);

    if (conflicts.length > 0) {
      return res.status(409).json({ error: 'Conflict detected with existing schedule.' });
    }

    // 3. Update the schedule
    await db.query(`
      UPDATE schedules
      SET scheduled_date = ?, start_time = ?, end_time = ?
      WHERE id = ?
    `, [scheduled_date, start_time, end_time, scheduleId]);

    // 3.5. Update the corresponding session status to 'upcoming'
    await db.query(`
      UPDATE sessions
      SET status = 'upcoming'
      WHERE schedule_id = ?
    `, [scheduleId]);

    // 4. Format message with 12-hour time
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

    const currentUserMsg = `You rescheduled a session of ${tutor_name} & ${student_name} to ${formattedDate}, from ${formattedStartTime} to ${formattedEndTime}.`
    const studentMessage = `Your session with ${tutor_name} has been rescheduled to ${formattedDate}, from ${formattedStartTime} to ${formattedEndTime}.`;
    const tutorMessage = `Your session with ${student_name} has been rescheduled to ${formattedDate}, from ${formattedStartTime} to ${formattedEndTime}.`;

    // 5. Send notifications to student and tutor
    await createNotification(user_id, currentUserMsg);
    await createNotification(student_id, studentMessage);
    await createNotification(tutor_id, tutorMessage);

    // 6. Notify all admins
    const [admins] = await db.query(`SELECT id FROM users WHERE account_type = 'Admin' AND status = 'active'`);

    const adminMessage = `Schedule between ${student_name} and ${tutor_name} has been rescheduled to ${formattedDate}, from ${formattedStartTime} to ${formattedEndTime}.`;

    for (const admin of admins) {
      await createNotification(admin.id, adminMessage);
    }

    return res.json({ message: 'Schedule updated successfully and notifications sent.' });

  } catch (error) {
    console.error('Error rescheduling:', error.stack || error.message || error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
