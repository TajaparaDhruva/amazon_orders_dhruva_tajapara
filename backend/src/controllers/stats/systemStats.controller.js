const {
    getProductsCountService,
    getCustomersCountService,
    getCategoriesCountService,
    getRefundsCountService,
    getCancellationsCountService,
    getAverageShippingTimeService,
    getSystemPerformanceService
} = require('../../services/stats/systemStats.service');

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
 * GET /api/v1/stats/products/count
 */
const getProductsCount = async (req, res) => {
    try {
        const filter = buildStatsFilter(req.query);
        const data = await getProductsCountService(filter);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getProductsCount:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/stats/customers/count
 */
const getCustomersCount = async (req, res) => {
    try {
        const filter = buildStatsFilter(req.query);
        const data = await getCustomersCountService(filter);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getCustomersCount:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/stats/categories/count
 */
const getCategoriesCount = async (req, res) => {
    try {
        const filter = buildStatsFilter(req.query);
        const data = await getCategoriesCountService(filter);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getCategoriesCount:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/stats/refunds/count
 */
const getRefundsCount = async (req, res) => {
    try {
        const filter = buildStatsFilter(req.query);
        const data = await getRefundsCountService(filter);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getRefundsCount:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/stats/cancellations/count
 */
const getCancellationsCount = async (req, res) => {
    try {
        const filter = buildStatsFilter(req.query);
        const data = await getCancellationsCountService(filter);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getCancellationsCount:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/stats/shipping/average-time
 */
const getAverageShippingTime = async (req, res) => {
    try {
        const filter = buildStatsFilter(req.query);
        const data = await getAverageShippingTimeService(filter);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getAverageShippingTime:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/stats/system/performance
 */
const getSystemPerformance = async (req, res) => {
    try {
        const data = await getSystemPerformanceService();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getSystemPerformance:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getProductsCount,
    getCustomersCount,
    getCategoriesCount,
    getRefundsCount,
    getCancellationsCount,
    getAverageShippingTime,
    getSystemPerformance
};
