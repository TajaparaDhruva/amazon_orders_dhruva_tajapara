const express = require('express');
const router = express.Router();

const { register, login, logout } = require('../controllers/auth/auth.controller');
const { getProfile, updateProfile, deleteProfile } = require('../controllers/auth/profile.controller');
const { forgotPassword, resetPassword, changePassword } = require('../controllers/auth/password.controller');
const { protect } = require('../middlewares/auth.middleware');

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

module.exports = router;
