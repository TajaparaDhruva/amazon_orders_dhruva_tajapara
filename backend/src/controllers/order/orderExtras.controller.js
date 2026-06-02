const { duplicateOrderService, getOrderInvoiceService } = require('../../services/order/orderExtras.service');

/**
 * POST /api/v1/orders/:orderId/duplicate
 * Create a duplicate of an existing order
 */
const duplicateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const duplicate = await duplicateOrderService(orderId);

        if (!duplicate) {
            return res.status(404).json({
                success: false,
                message: `Order with OrderID '${orderId}' not found`
            });
        }

        res.status(201).json({
            success: true,
            message: 'Order duplicated successfully',
            data: duplicate
        });

    } catch (error) {
        console.error('Error in duplicateOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/orders/:orderId/invoice
 * Generate an invoice for a specific order
 */
const getOrderInvoice = async (req, res) => {
    try {
        const { orderId } = req.params;
        const invoice = await getOrderInvoiceService(orderId);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: `Order with OrderID '${orderId}' not found`
            });
        }

        res.status(200).json({
            success: true,
            data: invoice
        });

    } catch (error) {
        console.error('Error in getOrderInvoice:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = { duplicateOrder, getOrderInvoice };
