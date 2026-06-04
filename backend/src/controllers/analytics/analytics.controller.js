const {
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
} = require('../../services/analytics/analytics.service');

/**
 * Helper to build optional date range filters
 */
const buildDateFilter = (query) => {
    const filter = {};
    if (query.startDate || query.endDate) {
        filter.OrderDate = {};
        if (query.startDate) filter.OrderDate.$gte = new Date(query.startDate);
        if (query.endDate) filter.OrderDate.$lte = new Date(query.endDate);
    }
    // Filter out soft-archived orders by default from analytics unless specified
    if (query.includeArchived !== 'true') {
        filter.isArchived = { $ne: true };
    }
    return filter;
};

// ==========================================
// FEATURE 24: Revenue Analytics Controllers
// ==========================================

const getRevenueSummary = async (req, res) => {
    try {
        const filter = buildDateFilter(req.query);
        const data = await getRevenueSummaryService(filter);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getRevenueSummary:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getRevenueByDate = async (req, res) => {
    try {
        const filter = buildDateFilter(req.query);
        const interval = req.query.interval || 'day'; // day, month, year
        const data = await getRevenueByDateService(filter, interval);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getRevenueByDate:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getRevenueByPayment = async (req, res) => {
    try {
        const filter = buildDateFilter(req.query);
        const data = await getRevenueByPaymentService(filter);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getRevenueByPayment:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==========================================
// FEATURE 25: Order Analytics Controllers
// ==========================================

const getOrderSummary = async (req, res) => {
    try {
        const filter = buildDateFilter(req.query);
        const data = await getOrderSummaryService(filter);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getOrderSummary:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getOrdersByStatus = async (req, res) => {
    try {
        const filter = buildDateFilter(req.query);
        const data = await getOrdersByStatusService(filter);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getOrdersByStatus:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getOrdersBySeller = async (req, res) => {
    try {
        const filter = buildDateFilter(req.query);
        const data = await getOrdersBySellerService(filter);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getOrdersBySeller:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==========================================
// FEATURE 26: Product Analytics Controllers
// ==========================================

const getTopProducts = async (req, res) => {
    try {
        const filter = buildDateFilter(req.query);
        const limit = req.query.limit || 5;
        const data = await getTopProductsService(filter, limit);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getTopProducts:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getProductsByBrand = async (req, res) => {
    try {
        const filter = buildDateFilter(req.query);
        const data = await getProductsByBrandService(filter);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getProductsByBrand:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==========================================
// FEATURE 27: Customer & Category Controllers
// ==========================================

const getTopCustomers = async (req, res) => {
    try {
        const filter = buildDateFilter(req.query);
        const limit = req.query.limit || 5;
        const data = await getTopCustomersService(filter, limit);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getTopCustomers:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getCustomersByLocation = async (req, res) => {
    try {
        const filter = buildDateFilter(req.query);
        const type = req.query.type || 'city'; // city, state, country
        const data = await getCustomersByLocationService(filter, type);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getCustomersByLocation:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getCategoriesSummary = async (req, res) => {
    try {
        const filter = buildDateFilter(req.query);
        const data = await getCategoriesSummaryService(filter);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getCategoriesSummary:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getRevenueSummary,
    getRevenueByDate,
    getRevenueByPayment,
    getOrderSummary,
    getOrdersByStatus,
    getOrdersBySeller,
    getTopProducts,
    getProductsByBrand,
    getTopCustomers,
    getCustomersByLocation,
    getCategoriesSummary
};
