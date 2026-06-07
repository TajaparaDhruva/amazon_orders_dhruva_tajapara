const Notification = require('../models/notification.model');

/**
 * Get notifications for user with optional filter & pagination
 */
const getUserNotificationsService = async (userId, query = {}) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const filter = { user: userId };

    if (query.isRead !== undefined) {
        filter.isRead = query.isRead === 'true';
    }

    if (query.type) {
        filter.type = query.type;
    }

    const [notifications, total] = await Promise.all([
        Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Notification.countDocuments(filter)
    ]);

    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        notifications
    };
};

/**
 * Mark a notification as read
 */
const markAsReadService = async (userId, notificationId) => {
    const notification = await Notification.findOne({ _id: notificationId, user: userId });
    if (!notification) {
        throw new Error('NOTIFICATION_NOT_FOUND');
    }

    notification.isRead = true;
    await notification.save();
    return notification;
};

/**
 * Delete a notification
 */
const deleteNotificationService = async (userId, notificationId) => {
    const notification = await Notification.findOneAndDelete({ _id: notificationId, user: userId });
    if (!notification) {
        throw new Error('NOTIFICATION_NOT_FOUND');
    }
    return notification;
};

/**
 * Create a notification (Utility to trigger from other services)
 */
const createNotificationService = async (userId, { title, message, type, link }) => {
    return await Notification.create({
        user: userId,
        title,
        message,
        type: type || 'System',
        link
    });
};

module.exports = {
    getUserNotificationsService,
    markAsReadService,
    deleteNotificationService,
    createNotificationService
};
