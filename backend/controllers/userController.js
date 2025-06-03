// controllers/userController.js
const db = require('../db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT * FROM users WHERE account_type IN ('admin staff', 'tutor', 'student') and status = 'active' ORDER BY id DESC"
    );
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get login user data by ID
exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Update user password
exports.changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Missing old or new password.' });
  }

  try {
    // 1. Fetch existing user
    const [users] = await db.query('SELECT password FROM users WHERE id = ?', [id]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const hashedPassword = users[0].password;

    // 2. Compare old password
    const isMatch = await bcrypt.compare(oldPassword, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect old password.' });
    }

    // 3. Hash new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update in DB
    await db.query('UPDATE users SET password = ? WHERE id = ?', [newHashedPassword, id]);

    return res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// Get student profile by user ID
exports.getStudentProfileById = async (req, res) => {
  const userId = req.params.id;

  try {
    const [student] = await db.query('SELECT * FROM student_profile WHERE user_id = ?', [userId]);

    // Return null instead of 404 if profile is not found
    const profile = student.length > 0 ? student[0] : null;

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get tutor profile by user ID
exports.getTutorProfileById = async (req, res) => {
  const userId = req.params.id;

  try {
    const [tutor] = await db.query('SELECT * FROM tutor_profile WHERE user_id = ?', [userId]);

    const profile = tutor.length > 0 ? tutor[0] : null;

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching tutor profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Create a new user
exports.createUser = async (req, res) => {
  const {
    username, password, account_type,
    fname, mname, lname, birthdate, email, contact_no,
    parent_fname, parent_mname, parent_lname, parent_suffix, parent_email, parent_contact_no,
    certification, teaching_lvl, subject, credentials, graduate_at, major
  } = req.body;

  const profile_image = req.file ? req.file.filename : null;

  if (!username || !password || !account_type || !fname || !lname || !birthdate) {
    return res.status(400).json({ message: 'Required user fields missing.' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) return res.status(409).json({ message: 'Username already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await db.query(
      `INSERT INTO users (username, password, account_type, fname, mname, lname, birthdate, email, contact_no, profile_image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, account_type, fname, mname || null, lname, birthdate, email || null, contact_no || null, profile_image]
    );

    const userId = userResult.insertId;

    // Student Profile
    if (account_type === 'student') {
      await db.query(
        `INSERT INTO student_profile (user_id, parent_fname, parent_mname, parent_lname, parent_suffix, parent_email, parent_contact_no)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, parent_fname, parent_mname, parent_lname, parent_suffix, parent_email, parent_contact_no]
      );
    }

    // Tutor Profile
    if (account_type === 'tutor') {
      await db.query(
        `INSERT INTO tutor_profile (user_id, certification, teaching_lvl, subject, credentials, graduate_at, major)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, certification, teaching_lvl, subject, credentials, graduate_at, major]
      );
    }

    res.status(201).json({ message: 'User created', userId });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user account -----------------------------------------------------------------------------------------------------------------------------------------
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const {
    username, password, fname, mname, lname, birthdate, email, contact_no,
    account_type,
    parent_fname, parent_mname, parent_lname, parent_suffix, parent_email, parent_contact_no,
    certification, teaching_lvl, subject, credentials, graduate_at, major
  } = req.body;

  const profile_image = req.file ? req.file.filename : null;

  try {
    // Check if user exists
    const [userExists] = await db.query('SELECT profile_image_url FROM users WHERE id = ?', [userId]);
    if (userExists.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldImage = userExists[0]?.profile_image_url;

    // If new image is uploaded, delete the old one
    if (oldImage && profile_image) {
      const imagePath = path.join(__dirname, '..', 'uploads', oldImage);
      fs.unlink(imagePath, (err) => {
        if (err) console.warn('Could not delete old image:', err);
      });
    }

    let userUpdateQuery = `
      UPDATE users SET
        username = ?,
        ${password ? 'password = ?,' : ''}
        fname = ?,
        mname = ?,
        lname = ?,
        birthdate = ?,
        email = ?,
        contact_no = ?
        ${profile_image ? ', profile_image_url = ?' : ''}
      WHERE id = ?
    `;

    const params = [
      username,
      ...(password ? [await bcrypt.hash(password, 10)] : []),
      fname,
      mname || null,
      lname,
      birthdate,
      email || null,
      contact_no || null,
      ...(profile_image ? [profile_image] : []),
      userId,
    ];

    await db.query(userUpdateQuery, params);

    // Update or insert into student_profile if applicable
    if (account_type === 'student') {
      const [existingStudent] = await db.query('SELECT id FROM student_profile WHERE user_id = ?', [userId]);

      if (existingStudent.length > 0) {
        await db.query(
          `UPDATE student_profile SET
            parent_fname = ?, parent_mname = ?, parent_lname = ?, parent_suffix = ?, parent_email = ?, parent_contact_no = ?
           WHERE user_id = ?`,
          [parent_fname, parent_mname, parent_lname, parent_suffix, parent_email, parent_contact_no, userId]
        );
      } else {
        await db.query(
          `INSERT INTO student_profile 
            (user_id, parent_fname, parent_mname, parent_lname, parent_suffix, parent_email, parent_contact_no)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [userId, parent_fname, parent_mname, parent_lname, parent_suffix, parent_email, parent_contact_no]
        );
      }
    }

    // Update or insert into tutor_profile if applicable
    if (account_type === 'tutor') {
      const [existingTutor] = await db.query('SELECT id FROM tutor_profile WHERE user_id = ?', [userId]);

      if (existingTutor.length > 0) {
        await db.query(
          `UPDATE tutor_profile SET
            certification = ?, teaching_lvl = ?, subject = ?, credentials = ?, graduate_at = ?, major = ?
           WHERE user_id = ?`,
          [certification, teaching_lvl, subject, credentials, graduate_at, major, userId]
        );
      } else {
        await db.query(
          `INSERT INTO tutor_profile 
            (user_id, certification, teaching_lvl, subject, credentials, graduate_at, major)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [userId, certification, teaching_lvl, subject, credentials, graduate_at, major]
        );
      }
    }

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Delete user account
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Update the status to 'deleted' instead of removing the user
    await db.query('UPDATE users SET status = ? WHERE id = ?', ['inactive', userId]);

    res.status(200).json({ message: 'User account deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Tutor Accounts
exports.getActiveTutors = async (req, res) => {
  try {
    const [users] = await db.query(
    `SELECT 
      u.id,
      u.fname,
      u.mname,
      u.lname,
      u.profile_image_url,
      tp.user_id,
      tp.certification,
      tp.teaching_lvl,
      tp.subject,
      tp.credentials,
      tp.graduate_at,
      tp.major
    FROM users AS u
    LEFT JOIN tutor_profile AS tp ON u.id = tp.user_id
    WHERE u.account_type = 'tutor' AND u.status = 'active'
    ORDER BY tp.subject DESC`
    );
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};