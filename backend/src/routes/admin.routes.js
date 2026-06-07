const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    banUser,
    unbanUser,
    updateUserRole
} = require('../controllers/admin/userManagement.controller');

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

module.exports = router;
