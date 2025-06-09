const db = require('../db'); // your MySQL2 connection

exports.getAllSchedules = async (req, res) => {
  try {
    const [rows] = await db.query(`
    SELECT 
      schedules.id,
      schedules.scheduled_date,
      schedules.start_time,
      schedules.end_time,
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



//         student.name AS student_name,       tutor.name AS tutor_name
//  JOIN users AS student ON schedules.student_id = student.id
//       JOIN users AS tutor ON schedules.tutor_id = tutor.id
//