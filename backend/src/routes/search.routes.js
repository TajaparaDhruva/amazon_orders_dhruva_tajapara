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

module.exports = router;
