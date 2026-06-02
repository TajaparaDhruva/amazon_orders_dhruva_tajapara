const Order = require('../../models/order.model');

/**
 * Archive an order by setting isArchived = true.
 * Returns null if the order does not exist.
 * Returns { alreadyArchived: true } if it is already archived.
 */
const archiveOrderService = async (orderId) => {
    const order = await Order.findOne({ OrderID: orderId });

    if (!order) return null;

    if (order.isArchived) {
        return { alreadyArchived: true };
    }

    order.isArchived = true;
    await order.save();
    return order;
};

/**
 * Restore an archived order by setting isArchived = false.
 * Returns null if the order does not exist.
 * Returns { notArchived: true } if it is not currently archived.
 */
const restoreOrderService = async (orderId) => {
    const order = await Order.findOne({ OrderID: orderId });

    if (!order) return null;

    if (!order.isArchived) {
        return { notArchived: true };
    }

    order.isArchived = false;
    await order.save();
    return order;
};

module.exports = { archiveOrderService, restoreOrderService };
