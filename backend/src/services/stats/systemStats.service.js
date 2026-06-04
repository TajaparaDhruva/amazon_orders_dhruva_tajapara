const mongoose = require('mongoose');
const os = require('os');
const Order = require('../../models/order.model');

/**
 * Returns distinct count of products
 */
const getProductsCountService = async (filter = {}) => {
    const result = await Order.distinct('ProductID', filter);
    return { count: result.length };
};

/**
 * Returns distinct count of customers
 */
const getCustomersCountService = async (filter = {}) => {
    const result = await Order.distinct('CustomerID', filter);
    return { count: result.length };
};

/**
 * Returns distinct count of categories
 */
const getCategoriesCountService = async (filter = {}) => {
    const result = await Order.distinct('Category', filter);
    return { count: result.length };
};

/**
 * Returns count and total value of returned (refunded) orders
 */
const getRefundsCountService = async (filter = {}) => {
    const matchFilter = { ...filter, OrderStatus: 'Returned' };
    const stats = await Order.aggregate([
        { $match: matchFilter },
        {
            $group: {
                _id: null,
                count: { $sum: 1 },
                totalRefundAmount: { $sum: '$TotalAmount' }
            }
        }
    ]);

    return stats[0] || { count: 0, totalRefundAmount: 0 };
};

/**
 * Returns count and total value of cancelled orders
 */
const getCancellationsCountService = async (filter = {}) => {
    const matchFilter = { ...filter, OrderStatus: 'Cancelled' };
    const stats = await Order.aggregate([
        { $match: matchFilter },
        {
            $group: {
                _id: null,
                count: { $sum: 1 },
                totalCancelledAmount: { $sum: '$TotalAmount' }
            }
        }
    ]);

    return stats[0] || { count: 0, totalCancelledAmount: 0 };
};

/**
 * Computes average delivery time (difference between OrderDate and updatedAt for Delivered orders)
 */
const getAverageShippingTimeService = async (filter = {}) => {
    const matchFilter = { ...filter, OrderStatus: 'Delivered' };
    const stats = await Order.aggregate([
        { $match: matchFilter },
        {
            $project: {
                shippingDurationMs: { $subtract: ['$updatedAt', '$OrderDate'] }
            }
        },
        {
            $group: {
                _id: null,
                avgDurationMs: { $avg: '$shippingDurationMs' },
                minDurationMs: { $min: '$shippingDurationMs' },
                maxDurationMs: { $max: '$shippingDurationMs' },
                count: { $sum: 1 }
            }
        }
    ]);

    if (!stats[0] || stats[0].count === 0) {
        return {
            count: 0,
            averageDays: 0,
            averageHours: 0
        };
    }

    const avgMs = stats[0].avgDurationMs;
    const avgHours = avgMs / (1000 * 60 * 60);
    const avgDays = avgHours / 24;

    return {
        count: stats[0].count,
        averageDays: Math.round(avgDays * 100) / 100,
        averageHours: Math.round(avgHours * 100) / 100,
        minHours: Math.round((stats[0].minDurationMs / (1000 * 60 * 60)) * 100) / 100,
        maxHours: Math.round((stats[0].maxDurationMs / (1000 * 60 * 60)) * 100) / 100
    };
};

/**
 * Generates runtime system performance and health stats
 */
const getSystemPerformanceService = async () => {
    const startTime = Date.now();
    let dbPing = -1;
    try {
        await mongoose.connection.db.admin().ping();
        dbPing = Date.now() - startTime;
    } catch (err) {
        console.error('Database ping error:', err.message);
    }

    const processMemory = process.memoryUsage();
    const systemMemory = {
        total: os.totalmem(),
        free: os.freemem(),
        usagePercentage: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)
    };

    return {
        uptimeSeconds: Math.round(process.uptime()),
        databasePingMs: dbPing,
        memoryUsage: {
            processRssMb: Math.round(processMemory.rss / (1024 * 1024) * 100) / 100,
            processHeapTotalMb: Math.round(processMemory.heapTotal / (1024 * 1024) * 100) / 100,
            processHeapUsedMb: Math.round(processMemory.heapUsed / (1024 * 1024) * 100) / 100,
            systemTotalGb: Math.round(systemMemory.total / (1024 * 1024 * 1024) * 100) / 100,
            systemFreeGb: Math.round(systemMemory.free / (1024 * 1024 * 1024) * 100) / 100,
            systemUsagePercentage: systemMemory.usagePercentage
        },
        cpu: {
            model: os.cpus()[0]?.model || 'Unknown',
            cores: os.cpus().length,
            loadAverage: os.loadavg()
        },
        platform: process.platform,
        nodeVersion: process.version
    };
};

module.exports = {
    getProductsCountService,
    getCustomersCountService,
    getCategoriesCountService,
    getRefundsCountService,
    getCancellationsCountService,
    getAverageShippingTimeService,
    getSystemPerformanceService
};
