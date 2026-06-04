const express = require('express');
const router = express.Router();

const {
    getOrderTotal,
    getOrderDaily,
    getOrderMonthly,
    getOrderYearly
} = require('../controllers/stats/orderStats.controller');

// GET /api/v1/stats/orders/total
router.get('/orders/total', getOrderTotal);

// GET /api/v1/stats/orders/daily
router.get('/orders/daily', getOrderDaily);

// GET /api/v1/stats/orders/monthly
router.get('/orders/monthly', getOrderMonthly);

// GET /api/v1/stats/orders/yearly
router.get('/orders/yearly', getOrderYearly);

module.exports = router;
