const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['Order', 'Payment', 'System', 'Account'],
            default: 'System'
        },
        isRead: {
            type: Boolean,
            default: false
        },
        link: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// Index to retrieve a user's notifications quickly
notificationSchema.index({ user: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
