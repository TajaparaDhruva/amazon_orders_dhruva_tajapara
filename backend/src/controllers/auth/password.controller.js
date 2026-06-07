const {
    forgotPasswordService,
    resetPasswordService,
    changePasswordService
} = require('../../services/auth/password.service');

/**
 * Map named service error codes to HTTP responses
 */
const ERROR_MAP = {
    USER_NOT_FOUND:          [404, 'No account found with that email address'],
    MISSING_FIELDS:          [400, 'Required fields are missing'],
    PASSWORD_TOO_SHORT:      [400, 'New password must be at least 6 characters'],
    SAME_PASSWORD:           [400, 'New password must be different from the current password'],
    WRONG_CURRENT_PASSWORD:  [401, 'Current password is incorrect'],
    TOKEN_INVALID_OR_EXPIRED:[400, 'Reset token is invalid or has expired. Please request a new one.']
};

const handleError = (res, error) => {
    const mapped = ERROR_MAP[error.message];
    if (mapped) {
        return res.status(mapped[0]).json({ success: false, message: mapped[1] });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
};

/**
 * POST /api/v1/auth/forgot-password
 * Body: { email }
 * Public route — no auth required
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        const result = await forgotPasswordService(email);

        res.status(200).json({
            success: true,
            message: `Password reset token generated. In production this would be emailed to ${result.email}.`,
            data: {
                resetToken: result.resetToken,
                resetUrl: result.resetUrl,
                expiresInMinutes: result.expiresInMinutes
            }
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * POST /api/v1/auth/reset-password
 * Body: { token, newPassword }
 * Public route — no auth required (user arrives via reset link)
 */
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide token and newPassword'
            });
        }

        const user = await resetPasswordService(token, newPassword);

        res.status(200).json({
            success: true,
            message: 'Password reset successfully. You can now log in with your new password.',
            data: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * POST /api/v1/auth/change-password
 * Body: { currentPassword, newPassword }
 * Protected route — requires Bearer token
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide currentPassword and newPassword'
            });
        }

        const user = await changePasswordService(req.user._id, currentPassword, newPassword);

        res.status(200).json({
            success: true,
            message: 'Password changed successfully.',
            data: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { forgotPassword, resetPassword, changePassword };
