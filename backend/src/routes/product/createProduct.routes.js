const express = require('express');
const router = express.Router();
const { createProduct } = require('../../controllers/product/createProduct.controller');

router.post('/products', createProduct);

module.exports = router;
