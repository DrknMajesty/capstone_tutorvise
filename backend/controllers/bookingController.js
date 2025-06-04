const db = require('../db');

// Get Active Packages
exports.getActivePackage = async (req, res) => {
      try {
        const [packages] = await db.query(
          `SELECT 
            p.id, 
            p.package_name, 
            p.price_package, 
            p.total_sessions, 
            p.price_sessions, 
            p.tutorial_type, 
            p.description, 
            p.status
          FROM packages AS p
          WHERE p.status = 'active'
          ORDER BY p.id DESC;`
        );
        res.json(packages);
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getAvailableTimeslots = async (req, res) => {
  const tutorId = req.params.tutorId;

  try {
    const [rows] = await db.query(
       `SELECT * 
        FROM timeslots 
        WHERE tutor_id = ? AND status = 'Available' 
        ORDER BY start_time;`,
      [tutorId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching timeslots:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitApplication = async (req, res) => {
  const { student_id, package_id, tutor_id, timeslot_id } = req.body;

  if (!student_id || !package_id || !tutor_id || !timeslot_id) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    // Fetch timeslot snapshot
    const [timeslotRows] = await db.query(
      `SELECT start_time, end_time, status FROM timeslots WHERE id = ?`,
      [timeslot_id]
    );

    if (timeslotRows.length === 0) {
      return res.status(404).json({ message: 'Timeslot not found.' });
    }

    const timeslot = timeslotRows[0];

    // ⏳ Calculate deadline: 10 minutes from now
    const deadline = new Date(Date.now() + 1 * 60 * 1000); // 10 minutes in ms

    // Save application with deadline and snapshot info
    await db.query(
      `INSERT INTO applications 
        (student_id, package_id, tutor_id, timeslot_id, snapshot_start_time, snapshot_end_time, deadline)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id,
        package_id,
        tutor_id,
        timeslot_id,
        timeslot.start_time,
        timeslot.end_time,
        deadline,
      ]
    );

    await db.query(
      `UPDATE timeslots SET status = 'pending' WHERE id = ?`,
      [timeslot_id]
    );

    res.json({ message: 'Application submitted successfully.', deadline });
  } catch (err) {
    console.error('Error submitting application:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};
