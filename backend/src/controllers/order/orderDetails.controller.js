const { getOrderItemsService, getOrderHistoryService } = require('../../services/order/orderDetails.service');

/**
 * GET /api/v1/orders/:orderId/items
 * Retrieve the item / product details for a given order
 */
const getOrderItems = async (req, res) => {
    try {
        const { orderId } = req.params;
        const items = await getOrderItemsService(orderId);

        if (!items) {
            return res.status(404).json({
                success: false,
                message: `Order with OrderID '${orderId}' not found`
            });
        }

        res.status(200).json({
            success: true,
            data: items
        });

    } catch (error) {
        console.error('Error in getOrderItems:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/orders/:orderId/history
 * Retrieve the lifecycle / history details for a given order
 */
const getOrderHistory = async (req, res) => {
    try {
        const { orderId } = req.params;
        const history = await getOrderHistoryService(orderId);

        if (!history) {
            return res.status(404).json({
                success: false,
                message: `Order with OrderID '${orderId}' not found`
            });
        }

        res.status(200).json({
            success: true,
            data: history
        });

    } catch (error) {
        console.error('Error in getOrderHistory:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = { getOrderItems, getOrderHistory };
