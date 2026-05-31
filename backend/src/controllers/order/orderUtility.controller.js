const { checkOrderExistsService, getOrderSummaryService } = require('../../services/order/orderUtility.service');

/**
 * GET /api/v1/orders/:orderId/exists
 * Check whether an order exists
 */
const checkOrderExists = async (req, res) => {
    try {
        const { orderId } = req.params;
        const exists = await checkOrderExistsService(orderId);

        res.status(200).json({
            success: true,
            orderId,
            exists
        });

    } catch (error) {
        console.error('Error in checkOrderExists:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/orders/:orderId/summary
 * Get a brief summary of an order
 */
const getOrderSummary = async (req, res) => {
    try {
        const { orderId } = req.params;
        const summary = await getOrderSummaryService(orderId);

        if (!summary) {
            return res.status(404).json({
                success: false,
                message: `Order with OrderID '${orderId}' not found`
            });
        }

        res.status(200).json({
            success: true,
            data: summary
        });

    } catch (error) {
        console.error('Error in getOrderSummary:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = { checkOrderExists, getOrderSummary };
