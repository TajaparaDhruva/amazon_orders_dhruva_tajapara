const express = require('express');
const router = express.Router();

const {
    searchGeneral,
    searchCustomer,
    searchProduct
} = require('../controllers/search/basicSearch.controller');

// GET /api/v1/search
router.get('/', searchGeneral);

// GET /api/v1/search/customer
router.get('/customer', searchCustomer);

// GET /api/v1/search/product
router.get('/product', searchProduct);

module.exports = router;
