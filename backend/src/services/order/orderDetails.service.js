const Order = require('../../models/order.model');

/**
 * Get the item details (product + pricing info) for a specific order.
 * Returns only item-related fields instead of the full document.
 */
const getOrderItemsService = async (orderId) => {
    const order = await Order.findOne({ OrderID: orderId })
        .select(
            'OrderID ProductID ProductName Category Brand Quantity UnitPrice Discount Tax ShippingCost TotalAmount'
        )
        .lean();
    return order;
};

/**
 * Get the history / lifecycle details for a specific order.
 * Returns status, dates, payment and shipping information.
 */
const getOrderHistoryService = async (orderId) => {
    const order = await Order.findOne({ OrderID: orderId })
        .select(
            'OrderID CustomerID CustomerName OrderStatus OrderDate PaymentMethod City State Country SellerID createdAt updatedAt'
        )
        .lean();
    return order;
};

module.exports = { getOrderItemsService, getOrderHistoryService };
