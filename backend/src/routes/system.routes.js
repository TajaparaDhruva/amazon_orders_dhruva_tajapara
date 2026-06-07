const express = require('express');
const router = express.Router();

const {
    getVersion,
    getConfig,
    getUptime,
    ping,
    getDatabaseStatus,
    getCacheStatus,
    getStorageStatus
} = require('../controllers/system/system.controller');

// GET /api/v1/system/version
router.get('/version', getVersion);

// GET /api/v1/system/config
router.get('/config', getConfig);

// GET /api/v1/system/uptime
router.get('/uptime', getUptime);

// GET /api/v1/system/ping
router.get('/ping', ping);

// GET /api/v1/system/status/database
router.get('/status/database', getDatabaseStatus);

// GET /api/v1/system/status/cache
router.get('/status/cache', getCacheStatus);

// GET /api/v1/system/status/storage
router.get('/status/storage', getStorageStatus);

module.exports = router;
