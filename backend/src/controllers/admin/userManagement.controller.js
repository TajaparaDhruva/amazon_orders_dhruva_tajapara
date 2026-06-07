const {
    getAllUsersService,
    getUserByIdService,
    banUserService,
    unbanUserService,
    updateUserRoleService
} = require('../../services/admin/userManagement.service');

/**
 * GET /api/v1/admin/users
 */
const getAllUsers = async (req, res) => {
    try {
        const result = await getAllUsersService(req.query);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/admin/users/:id
 */
const getUserById = async (req, res) => {
    try {
        const user = await getUserByIdService(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with ID '${req.params.id}' not found.`
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error in getUserById:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * PATCH /api/v1/admin/users/:id/ban
 */
const banUser = async (req, res) => {
    try {
        const user = await banUserService(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with ID '${req.params.id}' not found.`
            });
        }

        res.status(200).json({
            success: true,
            message: 'User banned successfully.',
            data: user
        });
    } catch (error) {
        console.error('Error in banUser:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * PATCH /api/v1/admin/users/:id/unban
 */
const unbanUser = async (req, res) => {
    try {
        const user = await unbanUserService(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with ID '${req.params.id}' not found.`
            });
        }

        res.status(200).json({
            success: true,
            message: 'User unbanned successfully.',
            data: user
        });
    } catch (error) {
        console.error('Error in unbanUser:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * PATCH /api/v1/admin/users/:id/role
 */
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!role) {
            return res.status(400).json({
                success: false,
                message: 'role field is required in request body.'
            });
        }

        const user = await updateUserRoleService(req.params.id, role);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with ID '${req.params.id}' not found.`
            });
        }

        res.status(200).json({
            success: true,
            message: 'User role updated successfully.',
            data: user
        });
    } catch (error) {
        console.error('Error in updateUserRole:', error);

        if (error.message === 'INVALID_ROLE') {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Allowed roles are: 'user', 'seller', 'admin'."
            });
        }

        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    banUser,
    unbanUser,
    updateUserRole
};
