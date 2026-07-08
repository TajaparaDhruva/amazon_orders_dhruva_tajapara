const Order = require('../../models/order.model');
const User = require('../../models/user.model');

/**
 * GET /api/v1/dashboard/overview
 * Top-level dashboard summary metrics
 */
const getDashboardOverviewService = async (query = {}) => {
    const filter = { isArchived: { $ne: true } };

    // Support optional date ranges
    if (query.startDate || query.endDate) {
        filter.OrderDate = {};
        if (query.startDate) filter.OrderDate.$gte = new Date(query.startDate);
        if (query.endDate) filter.OrderDate.$lte = new Date(query.endDate);
    }

    const [orderMetrics, statusCounts, totalUsers, totalSellers] = await Promise.all([
        Order.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$TotalAmount' },
                    totalOrders: { $sum: 1 },
                    pendingShipments: {
                        $sum: { $cond: [{ $in: ['$OrderStatus', ['Pending', 'Processing']] }, 1, 0] }
                    },
                    deliveredOrders: {
                        $sum: { $cond: [{ $eq: ['$OrderStatus', 'Delivered'] }, 1, 0] }
                    }
                }
            }
        ]),
        Order.aggregate([
            { $match: filter },
            { $group: { _id: '$OrderStatus', count: { $sum: 1 } } }
        ]),
        User.countDocuments({ role: 'user', isDeleted: { $ne: true } }),
        User.countDocuments({ role: 'seller', isDeleted: { $ne: true } })
    ]);

    const metrics = orderMetrics[0] || { totalRevenue: 0, totalOrders: 0, pendingShipments: 0, deliveredOrders: 0 };

    const statusMap = {};
    if (statusCounts && statusCounts.length > 0) {
        statusCounts.forEach(item => {
            if (item._id) {
                statusMap[item._id.toLowerCase()] = item.count;
            }
        });
    }

    // Get MoM sales count comparison (this month vs last month)
    const startOfThisMonth = new Date();
    startOfThisMonth.setDate(1);
    startOfThisMonth.setHours(0, 0, 0, 0);

    const startOfLastMonth = new Date(startOfThisMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    const [thisMonthOrders, lastMonthOrders] = await Promise.all([
        Order.countDocuments({ OrderDate: { $gte: startOfThisMonth }, isArchived: { $ne: true } }),
        Order.countDocuments({ OrderDate: { $gte: startOfLastMonth, $lt: startOfThisMonth }, isArchived: { $ne: true } })
    ]);

    let momGrowthRate = 0;
    if (lastMonthOrders > 0) {
        momGrowthRate = Number((((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100).toFixed(2));
    } else if (thisMonthOrders > 0) {
        momGrowthRate = 100; // 100% growth if previous month had 0 orders
    }

    return {
        totalRevenue: metrics.totalRevenue,
        totalOrders: metrics.totalOrders,
        totalCustomers: totalUsers,
        totalSellers: totalSellers,
        pendingShipments: metrics.pendingShipments,
        deliveredOrders: statusMap['delivered'] || 0,
        processingOrders: statusMap['processing'] || 0,
        pendingOrders: statusMap['pending'] || 0,
        cancelledOrders: statusMap['cancelled'] || 0,
        shippedOrders: statusMap['shipped'] || 0,
        returnedOrders: statusMap['returned'] || 0,
        confirmedOrders: statusMap['confirmed'] || 0,
        momGrowthRate,
        currentMonthOrders: thisMonthOrders,
        previousMonthOrders: lastMonthOrders
    };
};

/**
 * GET /api/v1/dashboard/revenue
 * Detailed breakdown of revenue metrics (monthly trends, refunds, category splits)
 */
const getDashboardRevenueService = async (query = {}) => {
    const filter = { isArchived: { $ne: true } };

    if (query.startDate || query.endDate) {
        filter.OrderDate = {};
        if (query.startDate) filter.OrderDate.$gte = new Date(query.startDate);
        if (query.endDate) filter.OrderDate.$lte = new Date(query.endDate);
    }

    // Monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [monthlyRevenue, categoryDistribution, summary] = await Promise.all([
        Order.aggregate([
            { $match: { OrderDate: { $gte: sixMonthsAgo }, isArchived: { $ne: true } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$OrderDate' },
                        month: { $month: '$OrderDate' }
                    },
                    revenue: { $sum: '$TotalAmount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]),
        Order.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$Category',
                    value: { $sum: '$TotalAmount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { value: -1 } }
        ]),
        Order.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    grossRevenue: { $sum: '$TotalAmount' },
                    averageOrderValue: { $avg: '$TotalAmount' },
                    refundedRevenue: {
                        $sum: { $cond: [{ $eq: ['$OrderStatus', 'Returned'] }, '$TotalAmount', 0] }
                    },
                    cancelledRevenue: {
                        $sum: { $cond: [{ $eq: ['$OrderStatus', 'Cancelled'] }, '$TotalAmount', 0] }
                    }
                }
            }
        ])
    ]);

    const stats = summary[0] || { grossRevenue: 0, averageOrderValue: 0, refundedRevenue: 0, cancelledRevenue: 0 };
    const netRevenue = stats.grossRevenue - stats.refundedRevenue - stats.cancelledRevenue;

    // Formatting monthly revenue trend to be easily readable
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueTrend = monthlyRevenue.map(item => ({
        month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
        revenue: item.revenue,
        orders: item.orders
    }));

    return {
        summary: {
            grossRevenue: stats.grossRevenue,
            netRevenue,
            averageOrderValue: Number(stats.averageOrderValue.toFixed(2)),
            refundedRevenue: stats.refundedRevenue,
            cancelledRevenue: stats.cancelledRevenue
        },
        revenueTrend,
        categoryDistribution: categoryDistribution.map(cat => ({
            category: cat._id || 'Unknown',
            revenue: cat.value,
            percentage: stats.grossRevenue > 0 ? Number(((cat.value / stats.grossRevenue) * 100).toFixed(2)) : 0
        }))
    };
};

/**
 * GET /api/v1/dashboard/orders
 * Breakdowns of statuses, geographical distribution, and order trends
 */
const getDashboardOrdersService = async (query = {}) => {
    const filter = { isArchived: { $ne: true } };

    if (query.startDate || query.endDate) {
        filter.OrderDate = {};
        if (query.startDate) filter.OrderDate.$gte = new Date(query.startDate);
        if (query.endDate) filter.OrderDate.$lte = new Date(query.endDate);
    }

    const [statusBreakdown, locationBreakdown, recentOrders] = await Promise.all([
        Order.aggregate([
            { $match: filter },
            { $group: { _id: '$OrderStatus', count: { $sum: 1 }, revenue: { $sum: '$TotalAmount' } } }
        ]),
        Order.aggregate([
            { $match: filter },
            { $group: { _id: '$State', count: { $sum: 1 }, revenue: { $sum: '$TotalAmount' } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]),
        Order.find(filter).sort({ OrderDate: -1 }).limit(5).lean()
    ]);

    return {
        statusBreakdown: statusBreakdown.map(item => ({
            status: item._id,
            count: item.count,
            revenue: item.revenue
        })),
        locationBreakdown: locationBreakdown.map(item => ({
            state: item._id || 'Unknown',
            count: item.count,
            revenue: item.revenue
        })),
        recentOrders: recentOrders.map(o => ({
            orderId: o.OrderID,
            customer: o.CustomerName,
            amount: o.TotalAmount,
            status: o.OrderStatus,
            date: o.OrderDate
        }))
    };
};

/**
 * GET /api/v1/dashboard/customers
 * User acquisition metrics and spending leaders
 */
const getDashboardCustomersService = async () => {
    // Top 5 customers by spending
    const topCustomers = await Order.aggregate([
        { $match: { isArchived: { $ne: true } } },
        {
            $group: {
                _id: '$CustomerName',
                totalSpent: { $sum: '$TotalAmount' },
                totalOrders: { $sum: 1 },
                avgOrderValue: { $avg: '$TotalAmount' }
            }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 5 }
    ]);

    // Simple user growth trend (users created in past 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userAcquisitionTrend = await User.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo }, role: 'user', isDeleted: { $ne: true } } },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                newCustomers: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const growthTrend = userAcquisitionTrend.map(item => ({
        month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
        newCustomers: item.newCustomers
    }));

    return {
        topCustomers: topCustomers.map(c => ({
            name: c._id,
            totalSpent: c.totalSpent,
            totalOrders: c.totalOrders,
            avgOrderValue: Number(c.avgOrderValue.toFixed(2))
        })),
        customerGrowthTrend: growthTrend
    };
};

/**
 * GET /api/v1/dashboard/products
 * Product sales performance metrics
 */
const getDashboardProductsService = async (query = {}) => {
    const filter = { isArchived: { $ne: true } };

    if (query.startDate || query.endDate) {
        filter.OrderDate = {};
        if (query.startDate) filter.OrderDate.$gte = new Date(query.startDate);
        if (query.endDate) filter.OrderDate.$lte = new Date(query.endDate);
    }

    const [topProducts, salesByCategory] = await Promise.all([
        Order.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$ProductName',
                    unitsSold: { $sum: '$Quantity' },
                    revenue: { $sum: '$TotalAmount' },
                    ordersCount: { $sum: 1 }
                }
            },
            { $sort: { unitsSold: -1 } },
            { $limit: 10 }
        ]),
        Order.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$Category',
                    unitsSold: { $sum: '$Quantity' },
                    ordersCount: { $sum: 1 }
                }
            },
            { $sort: { unitsSold: -1 } }
        ])
    ]);

    return {
        topProducts: topProducts.map(p => ({
            name: p._id,
            unitsSold: p.unitsSold,
            revenue: p.revenue,
            ordersCount: p.ordersCount
        })),
        categorySales: salesByCategory.map(cat => ({
            category: cat._id || 'Unknown',
            unitsSold: cat.unitsSold,
            ordersCount: cat.ordersCount
        }))
    };
};

module.exports = {
    getDashboardOverviewService,
    getDashboardRevenueService,
    getDashboardOrdersService,
    getDashboardCustomersService,
    getDashboardProductsService
};
