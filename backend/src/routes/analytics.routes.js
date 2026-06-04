const express = require('express');
const router = express.Router();

const {
    getRevenueSummary,
    getRevenueByDate,
    getRevenueByPayment,
    getOrderSummary,
    getOrdersByStatus,
    getOrdersBySeller,
    getTopProducts,
    getProductsByBrand,
    getTopCustomers,
    getCustomersByLocation,
    getCategoriesSummary
} = require('../controllers/analytics/analytics.controller');

// ==========================================
// FEATURE 24: Revenue Analytics Routes
// ==========================================
router.get('/revenue/summary', getRevenueSummary);
router.get('/revenue/by-date', getRevenueByDate);
router.get('/revenue/by-payment', getRevenueByPayment);

// ==========================================
// FEATURE 25: Order Analytics Routes
// ==========================================
router.get('/orders/summary', getOrderSummary);
router.get('/orders/by-status', getOrdersByStatus);
router.get('/orders/by-seller', getOrdersBySeller);

// ==========================================
// FEATURE 26: Product Analytics Routes
// ==========================================
router.get('/products/top', getTopProducts);
router.get('/products/by-brand', getProductsByBrand);

// ==========================================
// FEATURE 27: Customer & Category Analytics
// ==========================================
router.get('/customers/top', getTopCustomers);
router.get('/customers/by-location', getCustomersByLocation);
router.get('/categories/summary', getCategoriesSummary);

module.exports = router;
