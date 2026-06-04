const Order = require('../../models/order.model');

/**
 * Returns overall revenue statistics
 */
const getRevenueTotalStats = async (filter = {}) => {
    const stats = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: null,
                grossSales: { $sum: { $multiply: ['$UnitPrice', '$Quantity'] } },
                totalRevenue: { $sum: '$TotalAmount' }, // Net revenue (TotalAmount = price * qty - discount + tax + shipping)
                totalDiscounts: { $sum: { $multiply: [{ $multiply: ['$UnitPrice', '$Quantity'] }, '$Discount'] } },
                totalTax: { $sum: '$Tax' },
                totalShipping: { $sum: '$ShippingCost' },
                transactionCount: { $sum: 1 },
                avgOrderAmount: { $avg: '$TotalAmount' }
            }
        }
    ]);

    return stats[0] || {
        grossSales: 0,
        totalRevenue: 0,
        totalDiscounts: 0,
        totalTax: 0,
        totalShipping: 0,
        transactionCount: 0,
        avgOrderAmount: 0
    };
};

/**
 * Groups revenue statistics by date format
 */
const getRevenueGroupedByDate = async (filter = {}, groupFormat = '%Y-%m-%d') => {
    const data = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: { $dateToString: { format: groupFormat, date: '$OrderDate' } },
                revenue: { $sum: '$TotalAmount' },
                discounts: { $sum: { $multiply: [{ $multiply: ['$UnitPrice', '$Quantity'] }, '$Discount'] } },
                tax: { $sum: '$Tax' },
                shipping: { $sum: '$ShippingCost' },
                transactionCount: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return data;
};

module.exports = {
    getRevenueTotalStats,
    getRevenueGroupedByDate
};
