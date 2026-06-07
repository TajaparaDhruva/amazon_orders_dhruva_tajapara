const User = require('../../models/user.model');
const { generateResetToken, hashToken } = require('../../utils/tokenGenerator');

const RESET_TOKEN_EXPIRE_MINUTES = 15;

/**
 * Forgot Password — find user by email, generate and store a hashed reset token.
 * Returns the raw token to be sent to the user (simulate sending via email).
 * Throws 'USER_NOT_FOUND' if no account exists for the given email.
 */
const forgotPasswordService = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('USER_NOT_FOUND');

    const { rawToken, hashedToken } = generateResetToken();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + RESET_TOKEN_EXPIRE_MINUTES * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    // In production, the rawToken would be emailed as a reset link.
    // We return it in the response for testing purposes.
    return {
        resetToken: rawToken,
        expiresInMinutes: RESET_TOKEN_EXPIRE_MINUTES,
        email: user.email,
        // Simulate the reset URL that would be sent via email
        resetUrl: `http://localhost:3000/reset-password/${rawToken}`
    };
};

/**
 * Reset Password — verify the raw token against the stored hash,
 * check it hasn't expired, and update the password.
 */
const resetPasswordService = async (rawToken, newPassword) => {
    if (!rawToken || !newPassword) {
        throw new Error('MISSING_FIELDS');
    }

    if (newPassword.length < 6) {
        throw new Error('PASSWORD_TOO_SHORT');
    }

    const hashedToken = hashToken(rawToken);

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) throw new Error('TOKEN_INVALID_OR_EXPIRED');

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return {
        _id: user._id,
        email: user.email,
        name: user.name
    };
};

/**
 * Change Password — verify current password, then update to new password.
 * Used by authenticated users who know their current password.
 */
const changePasswordService = async (userId, currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
        throw new Error('MISSING_FIELDS');
    }

    if (newPassword.length < 6) {
        throw new Error('PASSWORD_TOO_SHORT');
    }

    if (currentPassword === newPassword) {
        throw new Error('SAME_PASSWORD');
    }

    const user = await User.findById(userId).select('+password');
    if (!user) throw new Error('USER_NOT_FOUND');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) throw new Error('WRONG_CURRENT_PASSWORD');

    user.password = newPassword;
    await user.save();

    return {
        _id: user._id,
        email: user.email,
        name: user.name
    };
};

module.exports = {
    forgotPasswordService,
    resetPasswordService,
    changePasswordService
};
