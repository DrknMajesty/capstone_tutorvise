// utils/expireApplications.js
const db = require('../db');

const expireOldApplications = async () => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Find applications that should be expired
    const [expiredApps] = await connection.query(`
      SELECT a.id, a.timeslot_id
      FROM applications a
      LEFT JOIN payments p ON p.application_id = a.id
      WHERE a.application_status = 'pending'
        AND a.deadline < NOW()
        AND (p.payment_proof IS NULL OR p.payment_proof = '');
    `);

    if (expiredApps.length === 0) {
      await connection.commit();
      return { expiredCount: 0 };
    }

    // Free up each timeslot
    for (const app of expiredApps) {
      if (app.timeslot_id) {
        await connection.query(
          `UPDATE timeslots 
           SET status = 'available' 
           WHERE id = ?`,
          [app.timeslot_id]
        );
      }

      await connection.query(
        `UPDATE applications 
         SET application_status = 'Expired' 
         WHERE id = ?`,
        [app.id]
      );
    }

    await connection.commit();
    console.log(`✅ Expired ${expiredApps.length} application(s) and freed timeslots`);
    return { expiredCount: expiredApps.length };
  } catch (err) {
    await connection.rollback();
    console.error('❌ Error expiring applications:', err);
    throw err;
  } finally {
    connection.release();
  }
};

module.exports = expireOldApplications;