const {
    getDashboardOverviewService,
    getDashboardRevenueService,
    getDashboardOrdersService,
    getDashboardCustomersService,
    getDashboardProductsService
} = require('../../services/dashboard/dashboard.service');

/**
 * GET /api/v1/dashboard/overview
 */
const getDashboardOverview = async (req, res) => {
    try {
        const data = await getDashboardOverviewService(req.query);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getDashboardOverview:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/dashboard/revenue
 */
const getDashboardRevenue = async (req, res) => {
    try {
        const data = await getDashboardRevenueService(req.query);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getDashboardRevenue:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/dashboard/orders
 */
const getDashboardOrders = async (req, res) => {
    try {
        const data = await getDashboardOrdersService(req.query);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getDashboardOrders:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/dashboard/customers
 */
const getDashboardCustomers = async (req, res) => {
    try {
        const data = await getDashboardCustomersService();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getDashboardCustomers:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/dashboard/products
 */
const getDashboardProducts = async (req, res) => {
    try {
        const data = await getDashboardProductsService(req.query);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getDashboardProducts:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getDashboardOverview,
    getDashboardRevenue,
    getDashboardOrders,
    getDashboardCustomers,
    getDashboardProducts
};
