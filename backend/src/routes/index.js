const express = require('express');
const router = express.Router();

const registerRoutes = require('./auth/register.routes');
const loginRoutes = require('./auth/login.routes');
const authRoutes = require('./auth.routes');
const orderRoutes = require('./order.routes');
const searchRoutes = require('./search.routes');
const analyticsRoutes = require('./analytics.routes');
const statsRoutes = require('./stats.routes');
const shippingRoutes = require('./shipping.routes');
const adminRoutes = require('./admin.routes');
const validationRoutes = require('./validation.routes');
const notificationRoutes = require('./notification.routes');

// Base health-check route
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Amazon Orders API is up and running!'
    });
});

// Mount routes
router.use('/auth', registerRoutes);   // legacy: POST /auth/register
router.use('/auth', loginRoutes);      // legacy: POST /auth/login
router.use('/auth', authRoutes);       // consolidated: POST /auth/register, /auth/login, /auth/logout
router.use('/orders', orderRoutes);
router.use('/search', searchRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/stats', statsRoutes);
router.use('/shipping', shippingRoutes);
router.use('/admin', adminRoutes);
router.use('/validate', validationRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
