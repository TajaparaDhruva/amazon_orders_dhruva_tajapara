const express = require('express');
const router = express.Router();

const {
    getShipmentTracking,
    getDeliveryEstimate
} = require('../controllers/shipping/tracking.controller');

const {
    updateShippingStatus,
    changeShippingAddress,
    rescheduleDelivery
} = require('../controllers/shipping/shippingManagement.controller');

// GET /api/v1/shipping/tracking/:orderId
router.get('/tracking/:orderId', getShipmentTracking);

// GET /api/v1/shipping/estimate/:orderId
router.get('/estimate/:orderId', getDeliveryEstimate);

// PATCH /api/v1/shipping/update-status/:orderId
router.patch('/update-status/:orderId', updateShippingStatus);

// PATCH /api/v1/shipping/change-address/:orderId
router.patch('/change-address/:orderId', changeShippingAddress);

// POST /api/v1/shipping/reschedule/:orderId
router.post('/reschedule/:orderId', rescheduleDelivery);

module.exports = router;
