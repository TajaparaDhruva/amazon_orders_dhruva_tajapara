const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        refreshToken: {
            type: String,
            required: true,
            unique: true
        },
        expiresAt: {
            type: Date,
            required: true
        },
        ipAddress: {
            type: String
        },
        userAgent: {
            type: String
        },
        isValid: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Index to automatically remove expired sessions from DB
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
