const { archiveOrderService, restoreOrderService } = require('../../services/order/archiveOrder.service');

/**
 * PATCH /api/v1/orders/:orderId/archive
 * Soft-archive an order (sets isArchived = true)
 */
const archiveOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const result = await archiveOrderService(orderId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: `Order with OrderID '${orderId}' not found`
            });
        }

        if (result.alreadyArchived) {
            return res.status(409).json({
                success: false,
                message: `Order with OrderID '${orderId}' is already archived`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order archived successfully',
            data: result
        });

    } catch (error) {
        console.error('Error in archiveOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * PATCH /api/v1/orders/:orderId/restore
 * Restore an archived order (sets isArchived = false)
 */
const restoreOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const result = await restoreOrderService(orderId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: `Order with OrderID '${orderId}' not found`
            });
        }

        if (result.notArchived) {
            return res.status(409).json({
                success: false,
                message: `Order with OrderID '${orderId}' is not archived`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order restored successfully',
            data: result
        });

    } catch (error) {
        console.error('Error in restoreOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = { archiveOrder, restoreOrder };
