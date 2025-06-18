const cron = require('node-cron');
const db = require('./db');
const { createNotification } = require('./utils/notification');

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    const [sessions] = await db.query(`
      SELECT 
        sessions.id AS session_id,
        sessions.reminder_sent,
        schedules.scheduled_date,
        schedules.start_time,
        schedules.student_id,
        schedules.tutor_id,
        CONCAT(tutor.fname, ' ', tutor.lname) AS tutor_name,
        CONCAT(student.fname, ' ', student.lname) AS student_name
      FROM sessions
      JOIN schedules ON sessions.schedule_id = schedules.id
      JOIN users AS tutor ON schedules.tutor_id = tutor.id
      JOIN users AS student ON schedules.student_id = student.id
      WHERE 
        sessions.status = 'upcoming'
        AND sessions.reminder_sent = FALSE
        AND TIMESTAMPDIFF(MINUTE, NOW(), CONCAT(schedules.scheduled_date, ' ', schedules.start_time)) BETWEEN 0 AND 120
    `);

 for (const session of sessions) {
  const dateFormatted = new Date(session.scheduled_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const [hour, minute] = session.start_time.split(':');
  const dateTime = new Date(session.scheduled_date);
  dateTime.setHours(hour, minute);

  const timeFormatted = dateTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const message = `Reminder: You have a session scheduled on ${dateFormatted} at ${timeFormatted}. Please be on time.`;

  await createNotification(session.student_id, message);
  await createNotification(session.tutor_id, message);

  await db.query(`UPDATE sessions SET reminder_sent = TRUE WHERE id = ?`, [session.session_id]);
}

    console.log(`[REMINDER JOB] Checked and notified ${sessions.length} session(s).`);

  } catch (err) {
    console.error('Reminder job error:', err);
  }
});
