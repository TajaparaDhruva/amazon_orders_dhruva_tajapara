const Order = require('../../models/order.model');

/**
 * Updates the order status.
 */
const updateShippingStatusService = async (orderId, status) => {
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
    if (!validStatuses.includes(status)) {
        throw new Error(`Invalid order status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findOne({ OrderID: orderId });
    if (!order) return null;

    order.OrderStatus = status;
    await order.save();
    return order;
};

/**
 * Changes shipping destination address if order has not shipped yet.
 */
const changeShippingAddressService = async (orderId, addressData) => {
    const { city, state, country } = addressData;
    if (!city && !state && !country) {
        throw new Error('Please provide at least one address field to update (city, state, country).');
    }

    const order = await Order.findOne({ OrderID: orderId });
    if (!order) return null;

    // Validation: Cannot change address if shipped or delivered
    const nonModifiableStatuses = ['Shipped', 'Delivered', 'Cancelled', 'Returned'];
    if (nonModifiableStatuses.includes(order.OrderStatus)) {
        return {
            cannotModify: true,
            status: order.OrderStatus
        };
    }

    if (city) order.City = city;
    if (state) order.State = state;
    if (country) order.Country = country;

    await order.save();
    return order;
};

/**
 * Reschedules shipping delivery details (simulated slots and instructions).
 */
const rescheduleDeliveryService = async (orderId, rescheduleData) => {
    const { newDeliveryDate, deliverySlot, instructions } = rescheduleData;
    if (!newDeliveryDate) {
        throw new Error('Please provide a newDeliveryDate to reschedule.');
    }

    const order = await Order.findOne({ OrderID: orderId }).lean();
    if (!order) return null;

    // Validation: Cannot reschedule if already delivered
    if (order.OrderStatus === 'Delivered') {
        return {
            cannotReschedule: true,
            status: order.OrderStatus
        };
    }

    return {
        rescheduled: true,
        orderId: order.OrderID,
        currentStatus: order.OrderStatus,
        originalOrderDate: order.OrderDate,
        newDeliveryDate: new Date(newDeliveryDate),
        deliverySlot: deliverySlot || 'Standard Delivery (9 AM - 6 PM)',
        instructions: instructions || 'Leave at front desk',
        updatedAt: new Date()
    };
};

module.exports = {
    updateShippingStatusService,
    changeShippingAddressService,
    rescheduleDeliveryService
};
