const {
    getShipmentTrackingService,
    getDeliveryEstimateService
} = require('../../services/shipping/tracking.service');

/**
 * GET /api/v1/shipping/tracking/:orderId
 */
const getShipmentTracking = async (req, res) => {
    try {
        const { orderId } = req.params;
        const trackingInfo = await getShipmentTrackingService(orderId);

        if (!trackingInfo) {
            return res.status(404).json({
                success: false,
                message: `Shipment tracking not found for Order ID '${orderId}'`
            });
        }

        res.status(200).json({
            success: true,
            data: trackingInfo
        });
    } catch (error) {
        console.error('Error in getShipmentTracking:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/shipping/estimate/:orderId
 */
const getDeliveryEstimate = async (req, res) => {
    try {
        const { orderId } = req.params;
        const estimate = await getDeliveryEstimateService(orderId);

        if (!estimate) {
            return res.status(404).json({
                success: false,
                message: `Delivery estimation not found for Order ID '${orderId}'`
            });
        }

        res.status(200).json({
            success: true,
            data: estimate
        });
    } catch (error) {
        console.error('Error in getDeliveryEstimate:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    getShipmentTracking,
    getDeliveryEstimate
};
