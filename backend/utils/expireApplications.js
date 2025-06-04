// utils/expireApplications.js
const db = require('../db'); // Adjust path to your DB config

const expireOldApplications = async () => {
  try {
    const [expiredApps] = await db.query(
      `SELECT id, timeslot_id FROM applications 
       WHERE application_status = 'pending' 
       AND deadline < NOW()`
    );

    if (expiredApps.length === 0) return;

    const applicationIds = expiredApps.map(app => app.id);
    const timeslotIds = expiredApps.map(app => app.timeslot_id);

    await db.query(
      `UPDATE applications 
       SET application_status = 'expired' 
       WHERE id IN (?)`,
      [applicationIds]
    );

    await db.query(
      `UPDATE timeslots 
       SET status = 'available' 
       WHERE id IN (?)`,
      [timeslotIds]
    );

    console.log(`✅ Expired ${applicationIds.length} application(s).`);
  } catch (err) {
    console.error('❌ Error expiring applications:', err);
  }
};

module.exports = expireOldApplications;
