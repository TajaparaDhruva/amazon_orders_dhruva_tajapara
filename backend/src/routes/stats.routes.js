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

module.exports = router;
