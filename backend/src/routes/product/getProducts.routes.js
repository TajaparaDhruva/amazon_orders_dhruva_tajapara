const express = require('express');
const router = express.Router();
const { getProducts } = require('../../controllers/product/getProducts.controller');

router.get('/products', getProducts);

module.exports = router;
