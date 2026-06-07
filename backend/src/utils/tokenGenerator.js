const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Generate a secure random hex token (for password reset links)
 * Returns both the raw token (sent to user via email) and its
 * SHA-256 hash (stored in DB so raw token never touches the DB).
 */
const generateResetToken = () => {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    return { rawToken, hashedToken };
};

/**
 * Hash a given raw token for comparison against DB-stored hash
 */
const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generate a JWT access token for user sessions
 */
const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

module.exports = {
    generateResetToken,
    hashToken,
    generateAccessToken
};
