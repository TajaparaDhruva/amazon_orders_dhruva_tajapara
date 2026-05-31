const express = require('express');
const router = express.Router();

const { createOrder }              = require('../controllers/order/createOrder.controller');
const { getAllOrders, getOrderById } = require('../controllers/order/getOrders.controller');

// POST /api/v1/orders
router.post('/', createOrder);

// GET /api/v1/orders
router.get('/', getAllOrders);

// GET /api/v1/orders/:orderId
router.get('/:orderId', getOrderById);

module.exports = router;
