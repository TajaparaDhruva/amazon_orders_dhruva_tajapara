const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/product/product.controller');

// GET /api/v1/products
router.get('/', getProducts);

// GET /api/v1/products/:id
router.get('/:id', getProductById);

module.exports = router;
