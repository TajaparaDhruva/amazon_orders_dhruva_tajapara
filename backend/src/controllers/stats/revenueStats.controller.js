const { getRevenueTotalStats, getRevenueGroupedByDate } = require('../../services/stats/revenueStats.service');

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
 * GET /api/v1/stats/revenue/total
 */
const getRevenueTotal = async (req, res) => {
    try {
        const filter = buildStatsFilter(req.query);
        const stats = await getRevenueTotalStats(filter);
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error in getRevenueTotal:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/stats/revenue/daily
 */
const getRevenueDaily = async (req, res) => {
    try {
        const filter = buildStatsFilter(req.query);
        const data = await getRevenueGroupedByDate(filter, '%Y-%m-%d');
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error in getRevenueDaily:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/stats/revenue/monthly
 */
const getRevenueMonthly = async (req, res) => {
    try {
        const filter = buildStatsFilter(req.query);
        const data = await getRevenueGroupedByDate(filter, '%Y-%m');
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error in getRevenueMonthly:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/stats/revenue/yearly
 */
const getRevenueYearly = async (req, res) => {
    try {
        const filter = buildStatsFilter(req.query);
        const data = await getRevenueGroupedByDate(filter, '%Y');
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error in getRevenueYearly:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    getRevenueTotal,
    getRevenueDaily,
    getRevenueMonthly,
    getRevenueYearly
};
