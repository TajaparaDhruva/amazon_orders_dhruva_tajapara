const Order = require('../../models/order.model');

/**
 * Helper to build pagination & sorting options
 */
const getPaginationOptions = (queryParams) => {
    const {
        page = 1,
        limit = 10,
        sortBy = 'OrderDate',
        sortOrder = 'desc'
    } = queryParams;

    const skip = (Number(page) - 1) * Number(limit);
    const sortDir = sortOrder === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortDir };

    return {
        page: Number(page),
        limit: Number(limit),
        skip,
        sortObj
    };
};

/**
 * Helper to execute paginated query
 */
const executeQuery = async (filter, queryParams) => {
    const { page, limit, skip, sortObj } = getPaginationOptions(queryParams);

    const [orders, total] = await Promise.all([
        Order.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
        Order.countDocuments(filter)
    ]);

    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        orders
    };
};

/**
 * Search/filter orders by status, or return aggregation if aggregate=true
 */
const searchStatusService = async (queryParams) => {
    const { q, status, aggregate } = queryParams;

    if (aggregate === 'true') {
        const counts = await Order.aggregate([
            { $group: { _id: '$OrderStatus', count: { $sum: 1 } } }
        ]);
        return {
            aggregated: true,
            statusCounts: counts.reduce((acc, curr) => {
                if (curr._id) acc[curr._id] = curr.count;
                return acc;
            }, {})
        };
    }

    const filter = {};
    const targetStatus = status || q;
    if (targetStatus) {
        filter.OrderStatus = { $regex: `^${targetStatus}$`, $options: 'i' };
    }

    return await executeQuery(filter, queryParams);
};

/**
 * Search/filter orders by payment method, or return aggregation if aggregate=true
 */
const searchPaymentService = async (queryParams) => {
    const { q, method, aggregate } = queryParams;

    if (aggregate === 'true') {
        const counts = await Order.aggregate([
            { $group: { _id: '$PaymentMethod', count: { $sum: 1 } } }
        ]);
        return {
            aggregated: true,
            paymentCounts: counts.reduce((acc, curr) => {
                if (curr._id) acc[curr._id] = curr.count;
                return acc;
            }, {})
        };
    }

    const filter = {};
    const targetMethod = method || q;
    if (targetMethod) {
        filter.PaymentMethod = { $regex: targetMethod, $options: 'i' };
    }

    return await executeQuery(filter, queryParams);
};

/**
 * Search/filter orders by location (city, state, country)
 */
const searchLocationService = async (queryParams) => {
    const { q, city, state, country } = queryParams;
    const filter = {};

    if (city) filter.City = { $regex: city, $options: 'i' };
    if (state) filter.State = { $regex: state, $options: 'i' };
    if (country) filter.Country = { $regex: country, $options: 'i' };

    if (q && !city && !state && !country) {
        const escapedQ = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regexObj = { $regex: escapedQ, $options: 'i' };
        filter.$or = [
            { City: regexObj },
            { State: regexObj },
            { Country: regexObj }
        ];
    }

    return await executeQuery(filter, queryParams);
};

/**
 * Search/filter orders by OrderDate range or exact date
 */
const searchDateService = async (queryParams) => {
    const { startDate, endDate, date } = queryParams;
    const filter = {};

    if (date) {
        // Start and end of the specified day
        const targetDate = new Date(date);
        const nextDate = new Date(date);
        nextDate.setDate(targetDate.getDate() + 1);

        filter.OrderDate = {
            $gte: targetDate,
            $lt: nextDate
        };
    } else if (startDate || endDate) {
        filter.OrderDate = {};
        if (startDate) filter.OrderDate.$gte = new Date(startDate);
        if (endDate) filter.OrderDate.$lte = new Date(endDate);
    }

    return await executeQuery(filter, queryParams);
};

/**
 * Search tracking details for an order by OrderID
 */
const searchTrackingService = async (queryParams) => {
    const { q, orderId } = queryParams;
    const id = orderId || q;

    if (!id) {
        throw new Error('Please provide an orderId or q query parameter to search tracking info');
    }

    const order = await Order.findOne({ OrderID: id }).lean();
    if (!order) return null;

    return {
        orderId: order.OrderID,
        status: order.OrderStatus,
        orderDate: order.OrderDate,
        lastUpdated: order.updatedAt,
        shippingAddress: {
            city: order.City || null,
            state: order.State || null,
            country: order.Country || null
        },
        // Mock shipping milestones depending on order status
        trackingMilestones: [
            { stage: 'Order Placed', completed: true, date: order.OrderDate },
            { stage: 'Processing', completed: ['Processing', 'Shipped', 'Delivered'].includes(order.OrderStatus), date: order.createdAt },
            { stage: 'Shipped', completed: ['Shipped', 'Delivered'].includes(order.OrderStatus), date: order.OrderStatus === 'Shipped' || order.OrderStatus === 'Delivered' ? order.updatedAt : null },
            { stage: 'Delivered', completed: order.OrderStatus === 'Delivered', date: order.OrderStatus === 'Delivered' ? order.updatedAt : null }
        ]
    };
};

module.exports = {
    searchStatusService,
    searchPaymentService,
    searchLocationService,
    searchDateService,
    searchTrackingService
};
