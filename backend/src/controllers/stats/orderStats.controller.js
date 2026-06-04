const { getOrderTotalStats, getOrdersGroupedByDate } = require('../../services/stats/orderStats.service');

/**
 * Helper to build optional date range filters
 */
const buildStatsFilter = (query) => {
    const filter = {};
    if (query.startDate || query.endDate) {
        filter.OrderDate = {};
        if (query.startDate) filter.OrderDate.$gte = new Date(query.startDate);
        if (query.endDate) filter.OrderDate.$lte = new Date(query.endDate);
    }
    if (query.includeArchived !== 'true') {
        filter.isArchived = { $ne: true };
    }
    return filter;
};

/**
 * GET /api/v1/stats/orders/total
 */
const getOrderTotal = async (req, res) => {
    try {
        const filter = buildStatsFilter(req.query);
        const stats = await getOrderTotalStats(filter);
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error in getOrderTotal:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/stats/orders/daily
 */
const getOrderDaily = async (req, res) => {
    try {
        const filter = buildStatsFilter(req.query);
        const data = await getOrdersGroupedByDate(filter, '%Y-%m-%d');
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error in getOrderDaily:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/stats/orders/monthly
 */
const getOrderMonthly = async (req, res) => {
    try {
        const filter = buildStatsFilter(req.query);
        const data = await getOrdersGroupedByDate(filter, '%Y-%m');
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error in getOrderMonthly:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/stats/orders/yearly
 */
const getOrderYearly = async (req, res) => {
    try {
        const filter = buildStatsFilter(req.query);
        const data = await getOrdersGroupedByDate(filter, '%Y');
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error in getOrderYearly:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    getOrderTotal,
    getOrderDaily,
    getOrderMonthly,
    getOrderYearly
};
