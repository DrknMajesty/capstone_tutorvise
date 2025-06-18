const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// GET all notifications for a user
router.get('/:userId', notificationController.getNotifications);

// POST create a new notification
router.post('/', notificationController.createNotification);

// PATCH mark a specific notification as read
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
