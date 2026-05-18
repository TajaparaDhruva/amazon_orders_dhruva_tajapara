const express = require('express');
const router = express.Router();

const registerRoutes = require('./auth/register.routes');

// Base health-check route
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Amazon Orders API is up and running!'
    });
});

// Mount routes
router.use('/auth', registerRoutes);

module.exports = router;
