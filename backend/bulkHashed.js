// bulkHashPasswords.js
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // or your actual password
  database: 'tutorvise_db', // your database name 
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to database.');

  connection.query('SELECT id, username, password FROM users', async (err, results) => {
    if (err) throw err;

    for (const user of results) {
      const { id, username, password } = user;

      // Check if already bcrypt hashed (starts with $2a$ or $2b$ or $2y$)
      if (/^\$2[aby]\$/.test(password)) {
        console.log(`Password for ${username} is already hashed.`);
        continue;
      }

      try {
        const hashed = await bcrypt.hash(password, 10);
        connection.query(
          'UPDATE users SET password = ? WHERE id = ?',
          [hashed, id],
          (err) => {
            if (err) {
              console.error(`Error updating ${username}:`, err.message);
            } else {
              console.log(`✅ Updated password for ${username}`);
            }
          }
        );
      } catch (hashErr) {
        console.error(`Error hashing password for ${username}:`, hashErr.message);
      }
    }

    // Wait a bit then close connection
    setTimeout(() => connection.end(), 2000);
  });
});
