const Order = require('../../models/order.model');

/**
 * Cancel an order by setting OrderStatus = 'Cancelled'.
 * Returns null if the order does not exist.
 * Returns { alreadyCancelled: true } if it is already cancelled.
 * Returns { alreadyDelivered: true } if it has been delivered (cannot cancel).
 */
const cancelOrderService = async (orderId) => {
    const order = await Order.findOne({ OrderID: orderId });

    if (!order) return null;

    if (order.OrderStatus === 'Cancelled') {
        return { alreadyCancelled: true };
    }

    if (order.OrderStatus === 'Delivered') {
        return { alreadyDelivered: true };
    }

    order.OrderStatus = 'Cancelled';
    await order.save();
    return order;
};

module.exports = { cancelOrderService };
