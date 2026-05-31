const { getAllOrdersService, getOrderByIdService } = require('../../services/order/getOrders.service');

/**
 * GET /api/v1/orders
 */
const getAllOrders = async (req, res) => {
    try {
        const result = await getAllOrdersService(req.query);

        res.status(200).json({
            success:    true,
            total:      result.total,
            page:       result.page,
            totalPages: result.totalPages,
            count:      result.orders.length,
            data:       result.orders
        });

    } catch (error) {
        console.error('Error in getAllOrders:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error:   error.message
        });
    }
};

/**
 * GET /api/v1/orders/:id
 */
const getOrderById = async (req, res) => {
    try {
        const order = await getOrderByIdService(req.params.orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: `Order with OrderID '${req.params.orderId}' not found`
            });
        }

        res.status(200).json({
            success: true,
            data:    order
        });

    } catch (error) {
        console.error('Error in getOrderById:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error:   error.message
        });
    }
};

module.exports = { getAllOrders, getOrderById };
