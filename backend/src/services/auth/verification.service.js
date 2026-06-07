const User = require('../../models/user.model');
const sendEmail = require('../../utils/sendEmail');
const crypto = require('crypto');

const OTP_EXPIRE_MINUTES = 10;

/**
 * Generate a 6-digit random numeric OTP
 */
const generateNumericOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP to the user's email
 * @param {string} emailOrUserId - User's email or database ID
 */
const sendOtpService = async (emailOrUserId) => {
    let query = {};
    if (emailOrUserId.includes('@')) {
        query = { email: emailOrUserId.toLowerCase() };
    } else {
        query = { _id: emailOrUserId };
    }

    const user = await User.findOne(query).select('+otp +otpExpire');
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    const otpCode = generateNumericOtp();

    // Store OTP (plain text is fine for short-lived numeric OTP, or hash it for max security)
    // We will hash it using SHA-256 for optimal security
    const hashedOtp = crypto.createHash('sha256').update(otpCode).digest('hex');

    user.otp = hashedOtp;
    user.otpExpire = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    // Send the email
    const subject = 'Your Secure OTP Code';
    const message = `Your one-time password (OTP) code is ${otpCode}. It is valid for ${OTP_EXPIRE_MINUTES} minutes. Please do not share this code with anyone.`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h2 style="color: #ff9900;">Amazon Orders Verification</h2>
            <p>Your one-time password (OTP) is:</p>
            <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; padding: 10px 0; color: #333;">${otpCode}</div>
            <p>This code is valid for <strong>${OTP_EXPIRE_MINUTES} minutes</strong>.</p>
            <p style="font-size: 12px; color: #777; margin-top: 20px;">If you did not request this code, please ignore this email.</p>
        </div>
    `;

    await sendEmail({
        email: user.email,
        subject,
        message,
        html
    });

    return {
        email: user.email,
        expiresInMinutes: OTP_EXPIRE_MINUTES,
        // Include raw OTP in development response for easy testing
        otp: process.env.NODE_ENV === 'production' ? undefined : otpCode
    };
};

/**
 * Verify OTP without marking email verified
 * @param {string} emailOrUserId - User's email or database ID
 * @param {string} otpCode - The code to check
 */
const verifyOtpService = async (emailOrUserId, otpCode) => {
    if (!otpCode) {
        throw new Error('MISSING_OTP');
    }

    let query = {};
    if (emailOrUserId.includes('@')) {
        query = { email: emailOrUserId.toLowerCase() };
    } else {
        query = { _id: emailOrUserId };
    }

    const user = await User.findOne(query).select('+otp +otpExpire');
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    if (!user.otp || !user.otpExpire) {
        throw new Error('NO_OTP_REQUESTED');
    }

    if (new Date() > user.otpExpire) {
        throw new Error('OTP_EXPIRED');
    }

    const hashedOtp = crypto.createHash('sha256').update(otpCode).digest('hex');
    if (user.otp !== hashedOtp) {
        throw new Error('INVALID_OTP');
    }

    // Clear OTP details upon verification success
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return {
        _id: user._id,
        email: user.email,
        name: user.name
    };
};

/**
 * Verify email using OTP
 * @param {string} emailOrUserId - User's email or database ID
 * @param {string} otpCode - The code to check
 */
const verifyEmailService = async (emailOrUserId, otpCode) => {
    if (!otpCode) {
        throw new Error('MISSING_OTP');
    }

    let query = {};
    if (emailOrUserId.includes('@')) {
        query = { email: emailOrUserId.toLowerCase() };
    } else {
        query = { _id: emailOrUserId };
    }

    const user = await User.findOne(query).select('+otp +otpExpire');
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    if (user.isEmailVerified) {
        throw new Error('ALREADY_VERIFIED');
    }

    if (!user.otp || !user.otpExpire) {
        throw new Error('NO_OTP_REQUESTED');
    }

    if (new Date() > user.otpExpire) {
        throw new Error('OTP_EXPIRED');
    }

    const hashedOtp = crypto.createHash('sha256').update(otpCode).digest('hex');
    if (user.otp !== hashedOtp) {
        throw new Error('INVALID_OTP');
    }

    // Mark email as verified and clear OTP fields
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return {
        _id: user._id,
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified
    };
};

module.exports = {
    sendOtpService,
    verifyOtpService,
    verifyEmailService
};
