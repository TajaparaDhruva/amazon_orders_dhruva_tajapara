const Order = require('../../models/order.model');

/**
 * Returns overall order totals and status breakdown
 */
const getOrderTotalStats = async (filter = {}) => {
    const stats = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$TotalAmount' },
                avgOrderAmount: { $avg: '$TotalAmount' },
                minOrderAmount: { $min: '$TotalAmount' },
                maxOrderAmount: { $max: '$TotalAmount' },
                totalQuantitySold: { $sum: '$Quantity' },
                avgQuantityPerOrder: { $avg: '$Quantity' }
            }
        }
    ]);

    const statusCounts = await Order.aggregate([
        { $match: filter },
        { $group: { _id: '$OrderStatus', count: { $sum: 1 } } }
    ]);

    const statusBreakdown = statusCounts.reduce((acc, curr) => {
        if (curr._id) acc[curr._id] = curr.count;
        return acc;
    }, {});

    return {
        overall: stats[0] || {
            totalOrders: 0,
            totalRevenue: 0,
            avgOrderAmount: 0,
            minOrderAmount: 0,
            maxOrderAmount: 0,
            totalQuantitySold: 0,
            avgQuantityPerOrder: 0
        },
        statusBreakdown
    };
};

/**
 * Groups order counts and revenue by date format
 */
const getOrdersGroupedByDate = async (filter = {}, groupFormat = '%Y-%m-%d') => {
    const data = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: { $dateToString: { format: groupFormat, date: '$OrderDate' } },
                orderCount: { $sum: 1 },
                totalSales: { $sum: '$TotalAmount' },
                avgOrderAmount: { $avg: '$TotalAmount' },
                totalQuantitySold: { $sum: '$Quantity' }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return data;
};

module.exports = {
    getOrderTotalStats,
    getOrdersGroupedByDate
};
