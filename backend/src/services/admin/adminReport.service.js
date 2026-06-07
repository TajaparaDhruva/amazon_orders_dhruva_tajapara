const Order = require('../../models/order.model');

// Mock data for simulated logs, backups, and cache
let maintenanceMode = false;

const SYSTEM_LOGS = [
    { timestamp: new Date(Date.now() - 300000).toISOString(), level: 'INFO',  message: 'DB connection healthy.' },
    { timestamp: new Date(Date.now() - 240000).toISOString(), level: 'INFO',  message: 'Cache initialized with redis client.' },
    { timestamp: new Date(Date.now() - 180000).toISOString(), level: 'DEBUG', message: 'Auth middleware resolved active session.' },
    { timestamp: new Date(Date.now() - 120000).toISOString(), level: 'WARN',  message: 'Slower query detected: Order aggregation took 150ms.' },
    { timestamp: new Date(Date.now() - 60000).toISOString(),  level: 'ERROR', message: 'Failed SMTP handshake: connection timed out.' },
    { timestamp: new Date().toISOString(),                   level: 'INFO',  message: 'Admin requested system logs report.' }
];

const DB_BACKUPS = [
    { filename: 'backup_2026-06-01_daily.tar.gz', size: '12.4 MB', type: 'Daily',  status: 'Completed', generatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
    { filename: 'backup_2026-06-05_daily.tar.gz', size: '12.7 MB', type: 'Daily',  status: 'Completed', generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { filename: 'backup_2026-06-07_manual.tar.gz', size: '12.9 MB', type: 'Manual', status: 'Completed', generatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000) }
];

/**
 * Admin: Get all orders across the entire platform
 */
const getAdminOrdersService = async (query = {}) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by order status
    if (query.status) {
        filter.OrderStatus = query.status;
    }

    // Filter by seller
    if (query.sellerId) {
        filter.SellerID = query.sellerId;
    }

    // Date range filter
    if (query.startDate || query.endDate) {
        filter.OrderDate = {};
        if (query.startDate) filter.OrderDate.$gte = new Date(query.startDate);
        if (query.endDate) filter.OrderDate.$lte = new Date(query.endDate);
    }

    // Soft delete inclusion/exclusion
    if (query.includeArchived !== 'true') {
        filter.isArchived = { $ne: true };
    }

    const [orders, total] = await Promise.all([
        Order.find(filter).sort({ OrderDate: -1 }).skip(skip).limit(limit).lean(),
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
 * Admin: Sales Report Aggregation
 */
const getSalesReportService = async (query = {}) => {
    const filter = { isArchived: { $ne: true } };

    if (query.startDate || query.endDate) {
        filter.OrderDate = {};
        if (query.startDate) filter.OrderDate.$gte = new Date(query.startDate);
        if (query.endDate) filter.OrderDate.$lte = new Date(query.endDate);
    }

    const salesStats = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalUnitsSold: { $sum: '$Quantity' },
                averageUnitsPerOrder: { $avg: '$Quantity' }
            }
        }
    ]);

    const topProducts = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$ProductName',
                totalSold: { $sum: '$Quantity' },
                revenueGenerated: { $sum: '$TotalAmount' }
            }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 }
    ]);

    const stats = salesStats[0] || { totalOrders: 0, totalUnitsSold: 0, averageUnitsPerOrder: 0 };

    return {
        filterApplied: { startDate: query.startDate || null, endDate: query.endDate || null },
        totalOrders: stats.totalOrders,
        totalUnitsSold: stats.totalUnitsSold,
        averageUnitsPerOrder: Number(stats.averageUnitsPerOrder.toFixed(2)),
        topProducts
    };
};

/**
 * Admin: Revenue Report Aggregation
 */
const getRevenueReportService = async (query = {}) => {
    const filter = { isArchived: { $ne: true } };

    if (query.startDate || query.endDate) {
        filter.OrderDate = {};
        if (query.startDate) filter.OrderDate.$gte = new Date(query.startDate);
        if (query.endDate) filter.OrderDate.$lte = new Date(query.endDate);
    }

    const revenueStats = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: null,
                totalGrossRevenue: { $sum: '$TotalAmount' },
                averageOrderValue: { $avg: '$TotalAmount' },
                refundedRevenue: {
                    $sum: { $cond: [{ $eq: ['$OrderStatus', 'Returned'] }, '$TotalAmount', 0] }
                },
                cancelledRevenue: {
                    $sum: { $cond: [{ $eq: ['$OrderStatus', 'Cancelled'] }, '$TotalAmount', 0] }
                }
            }
        }
    ]);

    const revenueByCategory = await Order.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$Category',
                revenue: { $sum: '$TotalAmount' },
                ordersCount: { $sum: 1 }
            }
        },
        { $sort: { revenue: -1 } }
    ]);

    const stats = revenueStats[0] || { totalGrossRevenue: 0, averageOrderValue: 0, refundedRevenue: 0, cancelledRevenue: 0 };
    const netRevenue = stats.totalGrossRevenue - stats.refundedRevenue - stats.cancelledRevenue;

    return {
        filterApplied: { startDate: query.startDate || null, endDate: query.endDate || null },
        grossRevenue: stats.totalGrossRevenue,
        netRevenue,
        averageOrderValue: Number(stats.averageOrderValue.toFixed(2)),
        refundedAmount: stats.refundedRevenue,
        cancelledAmount: stats.cancelledRevenue,
        revenueByCategory
    };
};

/**
 * Admin: Clear System Cache
 */
const clearSystemCacheService = async () => {
    // Mock action
    return {
        cacheCleared: true,
        clearedAt: new Date(),
        clearedKeys: ['users:*', 'orders:analytics:*', 'stats:*', 'shipping:estimate:*']
    };
};

/**
 * Admin: Get System Performance Logs
 */
const getSystemLogsService = async () => {
    return {
        systemLogs: SYSTEM_LOGS,
        serverUptimeSeconds: Math.floor(process.uptime()),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
    };
};

/**
 * Admin: Set/Toggle Maintenance Mode
 */
const setMaintenanceModeService = async (status) => {
    if (status === undefined) {
        maintenanceMode = !maintenanceMode; // toggle
    } else {
        maintenanceMode = !!status;
    }
    return {
        maintenanceMode,
        updatedAt: new Date()
    };
};

/**
 * Admin: Get Backups Directory list
 */
const getBackupsService = async () => {
    return {
        totalBackups: DB_BACKUPS.length,
        backups: DB_BACKUPS
    };
};

module.exports = {
    getAdminOrdersService,
    getSalesReportService,
    getRevenueReportService,
    clearSystemCacheService,
    getSystemLogsService,
    setMaintenanceModeService,
    getBackupsService
};
