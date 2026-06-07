const express = require('express');
const router = express.Router();

const registerRoutes = require('./auth/register.routes');
const loginRoutes = require('./auth/login.routes');
const orderRoutes = require('./order.routes');
const searchRoutes = require('./search.routes');
const analyticsRoutes = require('./analytics.routes');
const statsRoutes = require('./stats.routes');
const shippingRoutes = require('./shipping.routes');

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
router.use('/analytics', analyticsRoutes);
router.use('/stats', statsRoutes);
router.use('/shipping', shippingRoutes);

module.exports = router;
