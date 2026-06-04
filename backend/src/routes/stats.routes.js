const express = require('express');
const router = express.Router();

const {
    getOrderTotal,
    getOrderDaily,
    getOrderMonthly,
    getOrderYearly
} = require('../controllers/stats/orderStats.controller');

const {
    getRevenueTotal,
    getRevenueDaily,
    getRevenueMonthly,
    getRevenueYearly
} = require('../controllers/stats/revenueStats.controller');

const {
    getProductsCount,
    getCustomersCount,
    getCategoriesCount,
    getRefundsCount,
    getCancellationsCount,
    getAverageShippingTime,
    getSystemPerformance
} = require('../controllers/stats/systemStats.controller');

// GET /api/v1/stats/orders/total
router.get('/orders/total', getOrderTotal);

// GET /api/v1/stats/orders/daily
router.get('/orders/daily', getOrderDaily);

// GET /api/v1/stats/orders/monthly
router.get('/orders/monthly', getOrderMonthly);

// GET /api/v1/stats/orders/yearly
router.get('/orders/yearly', getOrderYearly);

// GET /api/v1/stats/revenue/total
router.get('/revenue/total', getRevenueTotal);

// GET /api/v1/stats/revenue/daily
router.get('/revenue/daily', getRevenueDaily);

// GET /api/v1/stats/revenue/monthly
router.get('/revenue/monthly', getRevenueMonthly);

// GET /api/v1/stats/revenue/yearly
router.get('/revenue/yearly', getRevenueYearly);

// GET /api/v1/stats/products/count
router.get('/products/count', getProductsCount);

// GET /api/v1/stats/customers/count
router.get('/customers/count', getCustomersCount);

// GET /api/v1/stats/categories/count
router.get('/categories/count', getCategoriesCount);

// GET /api/v1/stats/refunds/count
router.get('/refunds/count', getRefundsCount);

// GET /api/v1/stats/cancellations/count
router.get('/cancellations/count', getCancellationsCount);

// GET /api/v1/stats/shipping/average-time
router.get('/shipping/average-time', getAverageShippingTime);

// GET /api/v1/stats/system/performance
router.get('/system/performance', getSystemPerformance);

module.exports = router;
