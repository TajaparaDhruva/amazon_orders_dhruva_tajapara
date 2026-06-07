const express = require('express');
const router = express.Router();

const {
    getDashboardOverview,
    getDashboardRevenue,
    getDashboardOrders,
    getDashboardCustomers,
    getDashboardProducts
} = require('../controllers/dashboard/dashboard.controller');

const { protect } = require('../middlewares/auth.middleware');

// Apply auth middleware to protect dashboard insights
router.use(protect);

// GET /api/v1/dashboard/overview
router.get('/overview', getDashboardOverview);

// GET /api/v1/dashboard/revenue
router.get('/revenue', getDashboardRevenue);

// GET /api/v1/dashboard/orders
router.get('/orders', getDashboardOrders);

// GET /api/v1/dashboard/customers
router.get('/customers', getDashboardCustomers);

// GET /api/v1/dashboard/products
router.get('/products', getDashboardProducts);

module.exports = router;
