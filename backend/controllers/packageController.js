const db = require('../db');

exports.getAllPackages = async (req, res) => {
    try {
        const [packages] = await db.query(
            `SELECT p.id, p.package_name, p.price_package, p.total_sessions, 
                    p.price_sessions, p.tutorial_type, p.description, p.status
             FROM packages AS p
             WHERE status IN ('active', 'inactive')
             ORDER BY p.id DESC`
        );
        res.json(packages);
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.createPackage = async (req, res) => {
  try {
    const {
      package_name,
      price_package,
      total_sessions,
      price_sessions,
      tutorial_type,
      description,
      status
    } = req.body;

    if (!package_name || !price_package || !total_sessions || !price_sessions || !tutorial_type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = `
      INSERT INTO packages 
        (package_name, price_package, total_sessions, price_sessions, tutorial_type, description, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(sql, [
      package_name,
      price_package,
      total_sessions,
      price_sessions,
      tutorial_type,
      description,
      status
    ]);

    res.status(200).json({ message: 'Package created successfully' });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      package_name,
      price_package,
      total_sessions,
      price_sessions,
      tutorial_type,
      description,
      status
    } = req.body;

    if (!package_name || !price_package || !total_sessions || !price_sessions || !tutorial_type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = `
      UPDATE packages 
      SET package_name = ?, price_package = ?, total_sessions = ?, 
          price_sessions = ?, tutorial_type = ?, description = ?, status = ?
      WHERE id = ?
    `;

    await db.execute(sql, [
      package_name,
      price_package,
      total_sessions,
      price_sessions,
      tutorial_type,
      description,
      status,
      id
    ]);

    res.status(200).json({ message: 'Package updated successfully' });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.archivePackage = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE packages SET status = ? WHERE id = ?', ['archived', id]);
    res.json({ message: 'Package archived successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to archive package.' });
  }
};

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