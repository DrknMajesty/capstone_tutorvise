const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log("✅ Connected to MySQL Database");
    connection.release(); // release the connection back to the pool
  } catch (err) {
    console.error("Database connection failed: ", err.stack);
  }
}

testConnection(); // Call the test function

module.exports = db;
