const { replaceOrderService, updateOrderService } = require('../../services/order/updateOrder.service');

/**
 * PUT /api/v1/orders/:orderId
 * Full replace — all required fields must be provided
 */
const replaceOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const {
            CustomerID, CustomerName, ProductID, ProductName,
            Category, Brand, Quantity, UnitPrice,
            TotalAmount, PaymentMethod, OrderDate, SellerID
        } = req.body;

        // All required fields must be present for a full replace
        if (
            !CustomerID || !CustomerName || !ProductID || !ProductName ||
            !Category || !Brand || !Quantity || !UnitPrice ||
            !TotalAmount || !PaymentMethod || !OrderDate || !SellerID
        ) {
            return res.status(400).json({
                success: false,
                message: 'PUT requires all required fields to be provided'
            });
        }

        const order = await replaceOrderService(orderId, req.body);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: `Order with OrderID '${orderId}' not found`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order replaced successfully',
            data: order
        });

    } catch (error) {
        console.error('Error in replaceOrder:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * PATCH /api/v1/orders/:orderId
 * Partial update — only provided fields are updated
 */
const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields provided to update'
            });
        }

        // Prevent changing OrderID via PATCH
        delete req.body.OrderID;

        const order = await updateOrderService(orderId, req.body);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: `Order with OrderID '${orderId}' not found`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order updated successfully',
            data: order
        });

    } catch (error) {
        console.error('Error in updateOrder:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = { replaceOrder, updateOrder };
