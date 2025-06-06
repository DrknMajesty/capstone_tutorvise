const express = require('express');
const router = express.Router();
const expireOldApplications = require('../utils/expireApplications');

router.post('/expire-applications', async (req, res) => {
  try {
    await expireOldApplications();
    res.status(200).json({ message: 'Expired applications processed.' });
  } catch (err) {
    console.error('Error running expiration:', err);
    res.status(500).json({ error: 'Failed to expire applications.' });
  }
});

module.exports = router;
