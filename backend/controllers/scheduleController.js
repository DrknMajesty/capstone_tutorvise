const db = require('../db'); // your MySQL2 connection

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
      tutor.lname AS tutor_last_name
    FROM schedules
    JOIN users AS student ON schedules.student_id = student.id
    JOIN users AS tutor ON schedules.tutor_id = tutor.id
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
    // Get the current schedule info
    const scheduleRes = await db.query(
      `SELECT tutor_id, student_id FROM schedules WHERE id = ?`,
      [scheduleId]
    );

    if (scheduleRes[0].length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const { tutor_id, student_id } = scheduleRes[0][0];

    // Check for schedule conflicts
    const conflictQuery = `
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
    `;

    const conflictRes = await db.query(conflictQuery, [
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

    if (conflictRes[0].length > 0) {
      return res.status(409).json({ error: 'Conflict detected with existing schedule.' });
    }

    // Proceed to update the schedule
    const updateQuery = `
      UPDATE schedules
      SET scheduled_date = ?,
          start_time = ?,
          end_time = ?
      WHERE id = ?
    `;

    await db.query(updateQuery, [
      scheduled_date,
      start_time,
      end_time,
      scheduleId
    ]);

    return res.json({ message: 'Schedule updated successfully' });

  } catch (error) {
    console.error('Error rescheduling:', error.stack || error.message || error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
