const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    banUser,
    unbanUser,
    updateUserRole
} = require('../controllers/admin/userManagement.controller');

const {
    getAdminOrders,
    getSalesReport,
    getRevenueReport,
    clearSystemCache,
    getSystemLogs,
    setMaintenanceMode,
    getBackups
} = require('../controllers/admin/adminReport.controller');

const { getSystemHealthOverview } = require('../controllers/system/system.controller');

const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// Apply admin auth guards to all routes defined in this file
router.use(protect);
router.use(authorize('admin'));

// GET /api/v1/admin/users
router.get('/users', getAllUsers);

// GET /api/v1/admin/users/:id
router.get('/users/:id', getUserById);

// PATCH /api/v1/admin/users/:id/ban
router.patch('/users/:id/ban', banUser);

// PATCH /api/v1/admin/users/:id/unban
router.patch('/users/:id/unban', unbanUser);

// PATCH /api/v1/admin/users/:id/role
router.patch('/users/:id/role', updateUserRole);

// GET /api/v1/admin/orders
router.get('/orders', getAdminOrders);

// GET /api/v1/admin/reports/sales
router.get('/reports/sales', getSalesReport);

// GET /api/v1/admin/reports/revenue
router.get('/reports/revenue', getRevenueReport);

// DELETE /api/v1/admin/cache/clear
router.delete('/cache/clear', clearSystemCache);

// GET /api/v1/admin/system/logs
router.get('/system/logs', getSystemLogs);

// POST /api/v1/admin/system/maintenance
router.post('/system/maintenance', setMaintenanceMode);

// GET /api/v1/admin/backups
router.get('/backups', getBackups);

// GET /api/v1/admin/system/health
router.get('/system/health', getSystemHealthOverview);

module.exports = router;
