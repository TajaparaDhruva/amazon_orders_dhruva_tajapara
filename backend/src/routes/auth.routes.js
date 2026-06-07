const express = require('express');
const router = express.Router();

const { register, login, logout } = require('../controllers/auth/auth.controller');
const { getProfile, updateProfile, deleteProfile } = require('../controllers/auth/profile.controller');
const { forgotPassword, resetPassword, changePassword } = require('../controllers/auth/password.controller');
const { sendOtp, verifyOtp, verifyEmail } = require('../controllers/auth/verification.controller');
const { protect } = require('../middlewares/auth.middleware');

// Helper middleware: extracts user info if Bearer token is provided, but does not block request if token is missing.
const optionalProtect = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return protect(req, res, next);
    }
    next();
};

// POST /api/v1/auth/register
router.post('/register', register);

// POST /api/v1/auth/login
router.post('/login', login);

// POST /api/v1/auth/logout
router.post('/logout', logout);

// GET /api/v1/auth/profile
router.get('/profile', protect, getProfile);

// PATCH /api/v1/auth/profile
router.patch('/profile', protect, updateProfile);

// DELETE /api/v1/auth/profile
router.delete('/profile', protect, deleteProfile);

// POST /api/v1/auth/forgot-password  (public)
router.post('/forgot-password', forgotPassword);

// POST /api/v1/auth/reset-password   (public — user arrives via reset link)
router.post('/reset-password', resetPassword);

// POST /api/v1/auth/change-password  (protected — must be logged in)
router.post('/change-password', protect, changePassword);

// POST /api/v1/auth/send-otp (public or protected)
router.post('/send-otp', optionalProtect, sendOtp);

// POST /api/v1/auth/verify-otp (public or protected)
router.post('/verify-otp', optionalProtect, verifyOtp);

// POST /api/v1/auth/verify-email (public or protected)
router.post('/verify-email', optionalProtect, verifyEmail);

module.exports = router;
