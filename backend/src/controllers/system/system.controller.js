const {
    getVersionService,
    getConfigService,
    getUptimeService,
    getDatabaseStatusService,
    getCacheStatusService,
    getStorageStatusService,
    getSystemHealthOverviewService
} = require('../../services/system/system.service');

/**
 * GET /api/v1/system/version
 */
const getVersion = async (req, res) => {
    try {
        const data = await getVersionService();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getVersion:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/system/config
 */
const getConfig = async (req, res) => {
    try {
        const data = await getConfigService();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getConfig:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/system/uptime
 */
const getUptime = async (req, res) => {
    try {
        const data = await getUptimeService();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getUptime:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/system/ping
 */
const ping = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'pong',
        timestamp: new Date().toISOString()
    });
};

/**
 * GET /api/v1/system/status/database
 */
const getDatabaseStatus = async (req, res) => {
    try {
        const data = await getDatabaseStatusService();
        const statusCode = data.isOperational ? 200 : 503;
        res.status(statusCode).json({ success: data.isOperational, data });
    } catch (error) {
        console.error('Error in getDatabaseStatus:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/system/status/cache
 */
const getCacheStatus = async (req, res) => {
    try {
        const data = await getCacheStatusService();
        const statusCode = data.isOperational ? 200 : 503;
        res.status(statusCode).json({ success: data.isOperational, data });
    } catch (error) {
        console.error('Error in getCacheStatus:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/system/status/storage
 */
const getStorageStatus = async (req, res) => {
    try {
        const data = await getStorageStatusService();
        const statusCode = data.isOperational ? 200 : 503;
        res.status(statusCode).json({ success: data.isOperational, data });
    } catch (error) {
        console.error('Error in getStorageStatus:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/admin/system/health
 */
const getSystemHealthOverview = async (req, res) => {
    try {
        const data = await getSystemHealthOverviewService();
        const isHealthy = data.status === 'healthy';
        const statusCode = isHealthy ? 200 : 503;
        res.status(statusCode).json({ success: isHealthy, data });
    } catch (error) {
        console.error('Error in getSystemHealthOverview:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getVersion,
    getConfig,
    getUptime,
    ping,
    getDatabaseStatus,
    getCacheStatus,
    getStorageStatus,
    getSystemHealthOverview
};
