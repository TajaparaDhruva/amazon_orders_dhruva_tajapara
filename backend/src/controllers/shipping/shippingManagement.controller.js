const {
    updateShippingStatusService,
    changeShippingAddressService,
    rescheduleDeliveryService
} = require('../../services/shipping/shippingManagement.service');

/**
 * PATCH /api/v1/shipping/update-status/:orderId
 */
const updateShippingStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status parameter is required in request body.'
            });
        }

        const order = await updateShippingStatusService(orderId, status);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: `Order with ID '${orderId}' not found.`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Shipping status updated successfully.',
            data: order
        });
    } catch (error) {
        console.error('Error in updateShippingStatus:', error);
        res.status(400).json({
            success: false,
            message: 'Bad Request',
            error: error.message
        });
    }
};

/**
 * PATCH /api/v1/shipping/change-address/:orderId
 */
const changeShippingAddress = async (req, res) => {
    try {
        const { orderId } = req.params;
        const result = await changeShippingAddressService(orderId, req.body);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: `Order with ID '${orderId}' not found.`
            });
        }

        if (result.cannotModify) {
            return res.status(400).json({
                success: false,
                message: `Cannot change shipping address. Order has already been ${result.status.toLowerCase()}.`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Shipping address updated successfully.',
            data: result
        });
    } catch (error) {
        console.error('Error in changeShippingAddress:', error);
        res.status(400).json({
            success: false,
            message: 'Bad Request',
            error: error.message
        });
    }
};

/**
 * POST /api/v1/shipping/reschedule/:orderId
 */
const rescheduleDelivery = async (req, res) => {
    try {
        const { orderId } = req.params;
        const result = await rescheduleDeliveryService(orderId, req.body);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: `Order with ID '${orderId}' not found.`
            });
        }

        if (result.cannotReschedule) {
            return res.status(400).json({
                success: false,
                message: `Cannot reschedule delivery. Order has already been ${result.status.toLowerCase()}.`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Delivery rescheduled successfully.',
            data: result
        });
    } catch (error) {
        console.error('Error in rescheduleDelivery:', error);
        res.status(400).json({
            success: false,
            message: 'Bad Request',
            error: error.message
        });
    }
};

module.exports = {
    updateShippingStatus,
    changeShippingAddress,
    rescheduleDelivery
};
