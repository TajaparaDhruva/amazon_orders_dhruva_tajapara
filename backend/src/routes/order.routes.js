const express = require('express');
const router = express.Router();

const { createOrder }                = require('../controllers/order/createOrder.controller');
const { getAllOrders, getOrderById } = require('../controllers/order/getOrders.controller');
const { replaceOrder, updateOrder }  = require('../controllers/order/updateOrder.controller');
const { deleteOrder }                = require('../controllers/order/deleteOrder.controller');
const { checkOrderExists, getOrderSummary } = require('../controllers/order/orderUtility.controller');

// POST /api/v1/orders
router.post('/', createOrder);

// GET /api/v1/orders
router.get('/', getAllOrders);

// GET /api/v1/orders/:orderId/exists
router.get('/:orderId/exists', checkOrderExists);

// GET /api/v1/orders/:orderId/summary
router.get('/:orderId/summary', getOrderSummary);

// GET /api/v1/orders/:orderId
router.get('/:orderId', getOrderById);

// PUT /api/v1/orders/:orderId
router.put('/:orderId', replaceOrder);

// PATCH /api/v1/orders/:orderId
router.patch('/:orderId', updateOrder);

// DELETE /api/v1/orders/:orderId
router.delete('/:orderId', deleteOrder);

module.exports = router;
