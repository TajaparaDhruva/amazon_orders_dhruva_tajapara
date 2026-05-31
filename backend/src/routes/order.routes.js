const express = require('express');
const router = express.Router();

const { createOrder } = require('../controllers/order/createOrder.controller');

// POST /api/v1/orders
router.post('/', createOrder);

module.exports = router;
