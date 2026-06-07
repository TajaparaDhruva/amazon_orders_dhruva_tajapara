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

const {
    getPendingShipments,
    getDeliveredShipments,
    getReturnedShipments,
    createShippingLabel,
    getCarriers
} = require('../controllers/shipping/delivery.controller');

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

// GET /api/v1/shipping/pending
router.get('/pending', getPendingShipments);

// GET /api/v1/shipping/delivered
router.get('/delivered', getDeliveredShipments);

// GET /api/v1/shipping/returned
router.get('/returned', getReturnedShipments);

// POST /api/v1/shipping/create-label
router.post('/create-label', createShippingLabel);

// GET /api/v1/shipping/carriers
router.get('/carriers', getCarriers);

module.exports = router;
