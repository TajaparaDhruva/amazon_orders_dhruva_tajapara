const Order = require('../../models/order.model');

/**
 * PUT — Full replace (all fields required)
 */
const replaceOrderService = async (orderId, data) => {
    const order = await Order.findOneAndUpdate(
        { OrderID: orderId },
        { $set: data },
        { new: true, runValidators: true, overwrite: true }
    );
    return order;
};

/**
 * PATCH — Partial update (only provided fields)
 */
const updateOrderService = async (orderId, data) => {
    const order = await Order.findOneAndUpdate(
        { OrderID: orderId },
        { $set: data },
        { new: true, runValidators: true }
    );
    return order;
};

module.exports = { replaceOrderService, updateOrderService };
