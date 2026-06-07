const {
    getAdminOrdersService,
    getSalesReportService,
    getRevenueReportService,
    clearSystemCacheService,
    getSystemLogsService,
    setMaintenanceModeService,
    getBackupsService
} = require('../../services/admin/adminReport.service');

/**
 * GET /api/v1/admin/orders
 */
const getAdminOrders = async (req, res) => {
    try {
        const result = await getAdminOrdersService(req.query);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error in getAdminOrders:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/admin/reports/sales
 */
const getSalesReport = async (req, res) => {
    try {
        const result = await getSalesReportService(req.query);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error in getSalesReport:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/admin/reports/revenue
 */
const getRevenueReport = async (req, res) => {
    try {
        const result = await getRevenueReportService(req.query);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error in getRevenueReport:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * DELETE /api/v1/admin/cache/clear
 */
const clearSystemCache = async (req, res) => {
    try {
        const result = await clearSystemCacheService();
        res.status(200).json({ success: true, message: 'System cache cleared successfully.', data: result });
    } catch (error) {
        console.error('Error in clearSystemCache:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/admin/system/logs
 */
const getSystemLogs = async (req, res) => {
    try {
        const result = await getSystemLogsService();
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error in getSystemLogs:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * POST /api/v1/admin/system/maintenance
 */
const setMaintenanceMode = async (req, res) => {
    try {
        const { status } = req.body;
        const result = await setMaintenanceModeService(status);
        const statusText = result.maintenanceMode ? 'enabled' : 'disabled';
        res.status(200).json({
            success: true,
            message: `Maintenance mode has been ${statusText}.`,
            data: result
        });
    } catch (error) {
        console.error('Error in setMaintenanceMode:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/admin/backups
 */
const getBackups = async (req, res) => {
    try {
        const result = await getBackupsService();
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error in getBackups:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getAdminOrders,
    getSalesReport,
    getRevenueReport,
    clearSystemCache,
    getSystemLogs,
    setMaintenanceMode,
    getBackups
};
