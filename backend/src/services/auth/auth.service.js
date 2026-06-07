const User = require('../../models/user.model');
const jwt = require('jsonwebtoken');
const { createSessionService } = require('./session.service');

/**
 * Generate a signed JWT token for the user
 */
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || 'defaultsecret123',
        { expiresIn: '7d' }
    );
};

/**
 * Register a new user
 */
const registerService = async ({ name, email, password, phone, role, ipAddress, userAgent }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('USER_EXISTS');
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
        role: role || 'user'
    });

    const token = generateToken(user._id);
    const session = await createSessionService(user._id, { ipAddress, userAgent });

    return {
        token,
        refreshToken: session.refreshToken,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            isBanned: user.isBanned,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    };
};

/**
 * Login an existing user
 */
const loginService = async ({ email, password, ipAddress, userAgent }) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user) throw new Error('INVALID_CREDENTIALS');

    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new Error('INVALID_CREDENTIALS');

    if (user.isBanned) throw new Error('ACCOUNT_BANNED');

    const token = generateToken(user._id);
    const session = await createSessionService(user._id, { ipAddress, userAgent });

    return {
        token,
        refreshToken: session.refreshToken,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            isBanned: user.isBanned,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    };
};

module.exports = {
    registerService,
    loginService
};
