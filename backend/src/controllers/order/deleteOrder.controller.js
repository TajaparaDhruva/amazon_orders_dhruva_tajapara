const { deleteOrderService } = require('../../services/order/deleteOrder.service');

/**
 * DELETE /api/v1/orders/:orderId
 * Remove an order by its OrderID
 */
const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await deleteOrderService(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: `Order with OrderID '${orderId}' not found`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully',
            data: order
        });

    } catch (error) {
        console.error('Error in deleteOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = { deleteOrder };
