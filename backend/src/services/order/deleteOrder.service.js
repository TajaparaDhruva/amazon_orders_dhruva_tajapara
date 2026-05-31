const Order = require('../../models/order.model');

/**
 * Delete order by OrderID
 */
const deleteOrderService = async (orderId) => {
    const order = await Order.findOneAndDelete({ OrderID: orderId });
    return order;
};

module.exports = { deleteOrderService };
