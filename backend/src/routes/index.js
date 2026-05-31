const express = require('express');
const router = express.Router();

const registerRoutes = require('./auth/register.routes');
const loginRoutes = require('./auth/login.routes');

// Base health-check route
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Amazon Orders API is up and running!'
    });
});

const createProductRoutes = require('./product/createProduct.routes');

// Mount routes
router.use('/auth', registerRoutes);
router.use('/auth', loginRoutes);
router.use('/', createProductRoutes);

module.exports = router;
