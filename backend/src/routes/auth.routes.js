const express = require('express');
const router = express.Router();

const { register, login, logout } = require('../controllers/auth/auth.controller');

// POST /api/v1/auth/register
router.post('/register', register);

// POST /api/v1/auth/login
router.post('/login', login);

// POST /api/v1/auth/logout
router.post('/logout', logout);

module.exports = router;
