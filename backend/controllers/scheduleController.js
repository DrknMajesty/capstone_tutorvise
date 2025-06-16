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

-- Follow the booking → application → package path
JOIN bookings ON schedules.booking_id = bookings.id
JOIN applications ON bookings.application_id = applications.id
JOIN packages ON applications.package_id = packages.id

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
  const { scheduled_date, start_time, end_time } = req.body;

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

    // 4. Format message
    const formattedDate = new Date(scheduled_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const studentMessage = `Your session with ${tutor_name} has been rescheduled to ${formattedDate}, from ${start_time} to ${end_time}.`;
    const tutorMessage = `The session with ${student_name} has been rescheduled to ${formattedDate}, from ${start_time} to ${end_time}.`;

    // 5. Send notifications
    await createNotification(student_id, studentMessage);
    await createNotification(tutor_id, tutorMessage);

    return res.json({ message: 'Schedule updated successfully and notifications sent.' });

  } catch (error) {
    console.error('Error rescheduling:', error.stack || error.message || error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

