const Order = require('../../models/order.model');

// ==========================================
// FEATURE 24: Revenue Analytics Services
// ==========================================

/**
 * Get revenue totals, average order value, average price, total discounts, etc.
 */
const getRevenueSummaryService = async (filter = {}) => {
    const summary = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$TotalAmount' },
                totalOrders: { $sum: 1 },
                avgOrderValue: { $avg: '$TotalAmount' },
                totalQuantity: { $sum: '$Quantity' },
                avgUnitPrice: { $avg: '$UnitPrice' },
                totalDiscounts: { $sum: { $multiply: [{ $multiply: ['$UnitPrice', '$Quantity'] }, '$Discount'] } },
                totalTax: { $sum: '$Tax' },
                totalShipping: { $sum: '$ShippingCost' }
            }
        }
    ]);

    return summary[0] || {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        totalQuantity: 0,
        avgUnitPrice: 0,
        totalDiscounts: 0,
        totalTax: 0,
        totalShipping: 0
    };
};

/**
 * Get revenue trend grouped by date/month/year
 */
const getRevenueByDateService = async (filter = {}, interval = 'day') => {
    let groupFormat = '%Y-%m-%d';
    if (interval === 'month') groupFormat = '%Y-%m';
    if (interval === 'year') groupFormat = '%Y';

    const trend = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: { $dateToString: { format: groupFormat, date: '$OrderDate' } },
                revenue: { $sum: '$TotalAmount' },
                orders: { $sum: 1 },
                unitsSold: { $sum: '$Quantity' }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return trend;
};

/**
 * Get revenue distribution grouped by payment method
 */
const getRevenueByPaymentService = async (filter = {}) => {
    const data = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$PaymentMethod',
                revenue: { $sum: '$TotalAmount' },
                orders: { $sum: 1 },
                avgOrderValue: { $avg: '$TotalAmount' }
            }
        },
        { $sort: { revenue: -1 } }
    ]);

    return data;
};

// ==========================================
// FEATURE 25: Order Analytics Services
// ==========================================

/**
 * Get total order volume, overall status counts
 */
const getOrderSummaryService = async (filter = {}) => {
    const totalOrders = await Order.countDocuments(filter);
    const statusCounts = await Order.aggregate([
        { $match: filter },
        { $group: { _id: '$OrderStatus', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    return {
        totalOrders,
        statusDistribution: statusCounts.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {})
    };
};

/**
 * Get orders stats grouped by status
 */
const getOrdersByStatusService = async (filter = {}) => {
    const stats = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$OrderStatus',
                count: { $sum: 1 },
                totalValue: { $sum: '$TotalAmount' },
                avgValue: { $avg: '$TotalAmount' }
            }
        },
        { $sort: { count: -1 } }
    ]);
    return stats;
};

/**
 * Get orders stats grouped by seller
 */
const getOrdersBySellerService = async (filter = {}) => {
    const stats = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$SellerID',
                totalOrders: { $sum: 1 },
                totalSales: { $sum: '$TotalAmount' },
                unitsSold: { $sum: '$Quantity' }
            }
        },
        { $sort: { totalSales: -1 } }
    ]);
    return stats;
};

// ==========================================
// FEATURE 26: Product Analytics Services
// ==========================================

/**
 * Get top selling products
 */
const getTopProductsService = async (filter = {}, limit = 5) => {
    const topProducts = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$ProductID',
                productName: { $first: '$ProductName' },
                category: { $first: '$Category' },
                brand: { $first: '$Brand' },
                unitsSold: { $sum: '$Quantity' },
                totalRevenue: { $sum: '$TotalAmount' },
                orderCount: { $sum: 1 }
            }
        },
        { $sort: { unitsSold: -1 } },
        { $limit: Number(limit) }
    ]);
    return topProducts;
};

/**
 * Get products sales grouped by brand
 */
const getProductsByBrandService = async (filter = {}) => {
    const stats = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$Brand',
                totalRevenue: { $sum: '$TotalAmount' },
                unitsSold: { $sum: '$Quantity' },
                orderCount: { $sum: 1 }
            }
        },
        { $sort: { totalRevenue: -1 } }
    ]);
    return stats;
};

// ==========================================
// FEATURE 27: Customer & Category Analytics Services
// ==========================================

/**
 * Get top spending customers
 */
const getTopCustomersService = async (filter = {}, limit = 5) => {
    const topCustomers = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$CustomerID',
                customerName: { $first: '$CustomerName' },
                totalSpent: { $sum: '$TotalAmount' },
                orderCount: { $sum: 1 },
                unitsBought: { $sum: '$Quantity' }
            }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: Number(limit) }
    ]);
    return topCustomers;
};

/**
 * Get customers distribution and spending grouped by geography
 */
const getCustomersByLocationService = async (filter = {}, groupField = 'city') => {
    const dbFieldMap = {
        city: '$City',
        state: '$State',
        country: '$Country'
    };
    const dbField = dbFieldMap[groupField.toLowerCase()] || '$City';

    const locationStats = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: dbField,
                uniqueCustomers: { $addToSet: '$CustomerID' },
                totalSpent: { $sum: '$TotalAmount' },
                orderCount: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 1,
                uniqueCustomerCount: { $size: '$uniqueCustomers' },
                totalSpent: 1,
                orderCount: 1
            }
        },
        { $sort: { totalSpent: -1 } }
    ]);
    return locationStats;
};

/**
 * Get category performance metrics
 */
const getCategoriesSummaryService = async (filter = {}) => {
    const categoryStats = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$Category',
                totalRevenue: { $sum: '$TotalAmount' },
                unitsSold: { $sum: '$Quantity' },
                orderCount: { $sum: 1 },
                avgOrderValue: { $avg: '$TotalAmount' }
            }
        },
        { $sort: { totalRevenue: -1 } }
    ]);
    return categoryStats;
};

module.exports = {
    getRevenueSummaryService,
    getRevenueByDateService,
    getRevenueByPaymentService,
    getOrderSummaryService,
    getOrdersByStatusService,
    getOrdersBySellerService,
    getTopProductsService,
    getProductsByBrandService,
    getTopCustomersService,
    getCustomersByLocationService,
    getCategoriesSummaryService
};
