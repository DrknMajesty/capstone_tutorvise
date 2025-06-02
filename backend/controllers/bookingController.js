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
