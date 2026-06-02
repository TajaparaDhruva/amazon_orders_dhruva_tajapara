const express = require('express');
const router = express.Router();

const registerRoutes = require('./auth/register.routes');
const loginRoutes = require('./auth/login.routes');
const orderRoutes = require('./order.routes');
const searchRoutes = require('./search.routes');

// Base health-check route
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Amazon Orders API is up and running!'
    });
});

// Mount routes
router.use('/auth', registerRoutes);
router.use('/auth', loginRoutes);
router.use('/orders', orderRoutes);
router.use('/search', searchRoutes);

module.exports = router;
