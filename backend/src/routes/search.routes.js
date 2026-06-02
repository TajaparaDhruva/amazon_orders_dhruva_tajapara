const express = require('express');
const router = express.Router();

const {
    searchGeneral,
    searchCustomer,
    searchProduct
} = require('../controllers/search/basicSearch.controller');

const {
    searchCategory,
    searchBrand
} = require('../controllers/search/categorySearch.controller');

const {
    searchStatus,
    searchPayment,
    searchLocation,
    searchDate,
    searchTracking
} = require('../controllers/search/advancedSearch.controller');

// GET /api/v1/search
router.get('/', searchGeneral);

// GET /api/v1/search/customer
router.get('/customer', searchCustomer);

// GET /api/v1/search/product
router.get('/product', searchProduct);

// GET /api/v1/search/category
router.get('/category', searchCategory);

// GET /api/v1/search/brand
router.get('/brand', searchBrand);

// GET /api/v1/search/status
router.get('/status', searchStatus);

// GET /api/v1/search/payment
router.get('/payment', searchPayment);

// GET /api/v1/search/location
router.get('/location', searchLocation);

// GET /api/v1/search/date
router.get('/date', searchDate);

// GET /api/v1/search/tracking
router.get('/tracking', searchTracking);

module.exports = router;
