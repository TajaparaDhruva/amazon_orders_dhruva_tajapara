const User = require('../../models/user.model');

/**
 * Get profile of the authenticated user
 */
const getProfileService = async (userId) => {
    const user = await User.findById(userId).lean();
    if (!user) return null;
    return user;
};

/**
 * Update profile fields of the authenticated user.
 * Password changes are intentionally excluded — handled by a separate change-password route.
 */
const updateProfileService = async (userId, updateData) => {
    const allowedFields = ['name', 'phone'];
    const updates = {};

    allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
            updates[field] = updateData[field];
        }
    });

    if (Object.keys(updates).length === 0) {
        throw new Error('NO_VALID_FIELDS');
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
    ).lean();

    if (!user) return null;
    return user;
};

/**
 * Soft-delete the authenticated user's account (sets isDeleted = true)
 */
const deleteProfileService = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return null;

    user.isDeleted = true;
    user.isBanned = true; // prevent any further login
    await user.save();

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        isDeleted: user.isDeleted
    };
};

module.exports = {
    getProfileService,
    updateProfileService,
    deleteProfileService
};
