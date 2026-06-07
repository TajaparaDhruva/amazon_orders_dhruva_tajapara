const {
    getProfileService,
    updateProfileService,
    deleteProfileService
} = require('../../services/auth/profile.service');

/**
 * GET /api/v1/auth/profile
 * Requires: Bearer token (protect middleware)
 */
const getProfile = async (req, res) => {
    try {
        const user = await getProfileService(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * PATCH /api/v1/auth/profile
 * Requires: Bearer token (protect middleware)
 * Updatable fields: name, phone
 */
const updateProfile = async (req, res) => {
    try {
        const user = await updateProfileService(req.user._id, req.body);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Error in updateProfile:', error);

        if (error.message === 'NO_VALID_FIELDS') {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update. Allowed fields: name, phone'
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * DELETE /api/v1/auth/profile
 * Requires: Bearer token (protect middleware)
 * Performs a soft-delete (sets isDeleted = true, isBanned = true)
 */
const deleteProfile = async (req, res) => {
    try {
        const result = await deleteProfileService(req.user._id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully. You have been logged out.',
            data: result
        });
    } catch (error) {
        console.error('Error in deleteProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = { getProfile, updateProfile, deleteProfile };
