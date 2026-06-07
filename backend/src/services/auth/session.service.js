const Session = require('../../models/session.model');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const REFRESH_TOKEN_EXPIRE_DAYS = 30;

/**
 * Helper to generate a secure refresh token
 */
const generateRandomRefreshToken = () => {
    return crypto.randomBytes(40).toString('hex');
};

/**
 * Create a new user session
 */
const createSessionService = async (userId, { ipAddress, userAgent } = {}) => {
    const refreshToken = generateRandomRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60 * 1000);

    const session = await Session.create({
        user: userId,
        refreshToken,
        expiresAt,
        ipAddress: ipAddress || 'Unknown',
        userAgent: userAgent || 'Unknown',
        isValid: true
    });

    return session;
};

/**
 * Get all active sessions for a specific user
 */
const getUserSessionsService = async (userId) => {
    return await Session.find({
        user: userId,
        isValid: true,
        expiresAt: { $gt: Date.now() }
    }).select('-refreshToken').sort({ updatedAt: -1 }).lean();
};

/**
 * Delete/Invalidate a specific session
 */
const deleteSessionService = async (userId, sessionId) => {
    const session = await Session.findOne({ _id: sessionId, user: userId });
    if (!session) {
        throw new Error('SESSION_NOT_FOUND');
    }

    session.isValid = false;
    await session.save();
    return session;
};

/**
 * Refresh the access token using a valid refresh token
 */
const refreshTokenService = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error('REFRESH_TOKEN_REQUIRED');
    }

    const session = await Session.findOne({
        refreshToken,
        isValid: true,
        expiresAt: { $gt: Date.now() }
    });

    if (!session) {
        throw new Error('INVALID_OR_EXPIRED_SESSION');
    }

    // Generate new JWT Access Token
    const accessToken = jwt.sign(
        { id: session.user },
        process.env.JWT_SECRET || 'defaultsecret123',
        { expiresIn: '7d' }
    );

    return {
        accessToken,
        userId: session.user
    };
};

module.exports = {
    createSessionService,
    getUserSessionsService,
    deleteSessionService,
    refreshTokenService
};
