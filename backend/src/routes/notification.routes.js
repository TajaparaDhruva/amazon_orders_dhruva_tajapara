const express = require('express');
const router = express.Router();

const {
    getUserNotifications,
    markAsRead,
    deleteNotification
} = require('../controllers/notification.controller');

const { protect } = require('../middlewares/auth.middleware');

// Apply auth middleware to all notification routes
router.use(protect);

// GET /api/v1/notifications
router.get('/', getUserNotifications);

// PATCH /api/v1/notifications/read/:id
router.patch('/read/:id', markAsRead);

// DELETE /api/v1/notifications/:id
router.delete('/:id', deleteNotification);

module.exports = router;
