const {
    getUserNotificationsService,
    markAsReadService,
    deleteNotificationService
} = require('../services/notification.service');

/**
 * GET /api/v1/notifications
 * Protected route — retrieves all notifications for the authenticated user
 */
const getUserNotifications = async (req, res) => {
    try {
        const result = await getUserNotificationsService(req.user._id, req.query);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in getUserNotifications:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * PATCH /api/v1/notifications/read/:id
 * Protected route — marks a notification as read
 */
const markAsRead = async (req, res) => {
    try {
        const notification = await markAsReadService(req.user._id, req.params.id);
        res.status(200).json({
            success: true,
            message: 'Notification marked as read successfully.',
            data: notification
        });
    } catch (error) {
        console.error('Error in markAsRead:', error);

        if (error.message === 'NOTIFICATION_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Notification not found or does not belong to your account.'
            });
        }

        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * DELETE /api/v1/notifications/:id
 * Protected route — deletes a specific notification
 */
const deleteNotification = async (req, res) => {
    try {
        await deleteNotificationService(req.user._id, req.params.id);
        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully.'
        });
    } catch (error) {
        console.error('Error in deleteNotification:', error);

        if (error.message === 'NOTIFICATION_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Notification not found or does not belong to your account.'
            });
        }

        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getUserNotifications,
    markAsRead,
    deleteNotification
};
