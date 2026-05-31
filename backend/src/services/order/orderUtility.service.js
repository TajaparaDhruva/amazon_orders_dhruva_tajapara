const Order = require('../../models/order.model');

/**
 * Check if an order exists by OrderID
 * Returns true/false (lightweight — no full document fetch)
 */
const checkOrderExistsService = async (orderId) => {
    const order = await Order.exists({ OrderID: orderId });
    return !!order;
};

/**
 * Get a brief summary of an order by OrderID
 * Returns only key fields instead of the full document
 */
const getOrderSummaryService = async (orderId) => {
    const order = await Order.findOne({ OrderID: orderId })
        .select('OrderID CustomerName ProductName Quantity TotalAmount OrderStatus OrderDate PaymentMethod')
        .lean();
    return order;
};

module.exports = { checkOrderExistsService, getOrderSummaryService };
