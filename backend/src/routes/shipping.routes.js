const express = require('express');
const router = express.Router();

const {
    getShipmentTracking,
    getDeliveryEstimate
} = require('../controllers/shipping/tracking.controller');

// GET /api/v1/shipping/tracking/:orderId
router.get('/tracking/:orderId', getShipmentTracking);

// GET /api/v1/shipping/estimate/:orderId
router.get('/estimate/:orderId', getDeliveryEstimate);

module.exports = router;
