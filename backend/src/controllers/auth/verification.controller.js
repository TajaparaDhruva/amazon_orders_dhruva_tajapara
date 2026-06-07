const {
    sendOtpService,
    verifyOtpService,
    verifyEmailService
} = require('../../services/auth/verification.service');

/**
 * Helper to identify email or userId from request
 */
const getIdentifier = (req) => {
    if (req.body.email) {
        return req.body.email;
    }
    if (req.user && req.user._id) {
        return req.user._id.toString();
    }
    return null;
};

/**
 * Map named verification errors to HTTP responses
 */
const ERROR_MAP = {
    USER_NOT_FOUND:   [404, 'No account found with this identifier'],
    MISSING_OTP:      [400, 'OTP code is required'],
    NO_OTP_REQUESTED: [400, 'No OTP request found. Please request a new code.'],
    OTP_EXPIRED:      [400, 'OTP has expired. Please request a new one.'],
    INVALID_OTP:      [400, 'Invalid OTP code. Please try again.'],
    ALREADY_VERIFIED: [400, 'Email address is already verified']
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
 * POST /api/v1/auth/send-otp
 * Body: { email } (optional if authenticated)
 */
const sendOtp = async (req, res) => {
    try {
        const identifier = getIdentifier(req);
        if (!identifier) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email or log in to request an OTP.'
            });
        }

        const result = await sendOtpService(identifier);

        res.status(200).json({
            success: true,
            message: `OTP sent successfully to ${result.email}`,
            data: result
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * POST /api/v1/auth/verify-otp
 * Body: { email, otp } (email optional if authenticated)
 */
const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const identifier = getIdentifier(req);

        if (!identifier) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email or log in to verify OTP.'
            });
        }

        const user = await verifyOtpService(identifier, otp);

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully.',
            data: user
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * POST /api/v1/auth/verify-email
 * Body: { email, otp } (email optional if authenticated)
 */
const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body;
        const identifier = getIdentifier(req);

        if (!identifier) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email or log in to verify your email.'
            });
        }

        const user = await verifyEmailService(identifier, otp);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully.',
            data: user
        });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
    verifyEmail
};
