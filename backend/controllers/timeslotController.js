const db = require('../db');

exports.getAvailableTimeslots = async (req, res) => {
  const tutorId = req.params.tutorId;
  try {
    const [rows] = await db.query(
      'SELECT * FROM timeslots WHERE tutor_id = ? ORDER BY start_time',
      [tutorId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching timeslots:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTimeslot = async (req, res) => {
  const { tutor_id, start_time, end_time, status } = req.body;
  try {
    const [conflict] = await db.query(
      `SELECT * FROM timeslots
       WHERE tutor_id = ? AND (
         (start_time < ? AND end_time > ?) OR
         (start_time < ? AND end_time > ?) OR
         (start_time >= ? AND end_time <= ?)
       )`,
      [tutor_id, end_time, end_time, start_time, start_time, start_time, end_time]
    );

    if (conflict.length > 0) {
      return res.status(400).json({ message: 'Conflicting timeslot exists' });
    }

    await db.query(
      `INSERT INTO timeslots (tutor_id, start_time, end_time, status) VALUES (?, ?, ?, ?)`,
      [tutor_id, start_time, end_time, status]
    );

    res.json({ message: 'Timeslot created successfully' });
  } catch (err) {
    console.error('Error creating timeslot:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTimeslot = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM timeslots WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Timeslot not found' });
    const status = rows[0].status.toLowerCase();
    if (status !== 'available' && status !== 'unavailable') {
      return res.status(400).json({ message: 'Cannot delete booked timeslot' });
    }
    await db.query('DELETE FROM timeslots WHERE id = ?', [id]);
    res.json({ message: 'Timeslot deleted successfully' });
  } catch (err) {
    console.error('Error deleting timeslot:', err);
    res.status(500).json({ message: 'Server error' });
  }
};