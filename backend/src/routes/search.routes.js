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

const {
    searchFuzzy,
    searchAutocomplete,
    searchHighlight,
    searchRecent,
    searchPopular
} = require('../controllers/search/searchEnhancement.controller');

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

// GET /api/v1/search/fuzzy
router.get('/fuzzy', searchFuzzy);

// GET /api/v1/search/autocomplete
router.get('/autocomplete', searchAutocomplete);

// GET /api/v1/search/highlight
router.get('/highlight', searchHighlight);

// GET /api/v1/search/recent
router.get('/recent', searchRecent);

// GET /api/v1/search/popular
router.get('/popular', searchPopular);

module.exports = router;
