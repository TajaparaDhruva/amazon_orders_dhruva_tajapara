const {
    getPendingShipmentsService,
    getDeliveredShipmentsService,
    getReturnedShipmentsService,
    createShippingLabelService,
    getCarriersService
} = require('../../services/shipping/delivery.service');

/**
 * GET /api/v1/shipping/pending
 */
const getPendingShipments = async (req, res) => {
    try {
        const data = await getPendingShipmentsService(req.query);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getPendingShipments:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/shipping/delivered
 */
const getDeliveredShipments = async (req, res) => {
    try {
        const data = await getDeliveredShipmentsService(req.query);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getDeliveredShipments:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/shipping/returned
 */
const getReturnedShipments = async (req, res) => {
    try {
        const data = await getReturnedShipmentsService(req.query);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getReturnedShipments:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * POST /api/v1/shipping/create-label
 */
const createShippingLabel = async (req, res) => {
    try {
        const { orderId, carrierId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'orderId is required in request body.'
            });
        }

        const result = await createShippingLabelService(orderId, { carrierId });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: `Order with ID '${orderId}' not found.`
            });
        }

        if (result.cannotCreateLabel) {
            return res.status(409).json({
                success: false,
                message: `Cannot generate shipping label. Order is already '${result.status}'.`
            });
        }

        res.status(201).json({
            success: true,
            message: 'Shipping label created successfully.',
            data: result
        });
    } catch (error) {
        console.error('Error in createShippingLabel:', error);
        res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
    }
};

/**
 * GET /api/v1/shipping/carriers
 */
const getCarriers = async (req, res) => {
    try {
        const carriers = await getCarriersService();
        res.status(200).json({ success: true, data: carriers });
    } catch (error) {
        console.error('Error in getCarriers:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getPendingShipments,
    getDeliveredShipments,
    getReturnedShipments,
    createShippingLabel,
    getCarriers
};
