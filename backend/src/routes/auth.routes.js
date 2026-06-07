const express = require('express');
const router = express.Router();

const { register, login, logout } = require('../controllers/auth/auth.controller');
const { getProfile, updateProfile, deleteProfile } = require('../controllers/auth/profile.controller');
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

module.exports = router;
