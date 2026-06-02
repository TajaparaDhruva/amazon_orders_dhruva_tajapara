const { cancelOrderService } = require('../../services/order/cancelOrder.service');

/**
 * PATCH /api/v1/orders/:orderId/cancel
 * Cancel an order (sets OrderStatus = 'Cancelled')
 */
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const result = await cancelOrderService(orderId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: `Order with OrderID '${orderId}' not found`
            });
        }

        if (result.alreadyCancelled) {
            return res.status(409).json({
                success: false,
                message: `Order with OrderID '${orderId}' is already cancelled`
            });
        }

        if (result.alreadyDelivered) {
            return res.status(409).json({
                success: false,
                message: `Order with OrderID '${orderId}' has already been delivered and cannot be cancelled`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: result
        });

    } catch (error) {
        console.error('Error in cancelOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = { cancelOrder };
