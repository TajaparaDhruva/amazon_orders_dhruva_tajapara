const express = require('express');
const router = express.Router();
const { loginUser } = require('../../controllers/auth/login.controller');

router.post('/login', loginUser);

module.exports = router;
