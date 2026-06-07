const User = require('../../models/user.model');

/**
 * Get all users with search, filtering, and pagination
 */
const getAllUsersService = async (query = {}) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const filter = {};

    // Search query on name or email
    if (query.search) {
        filter.$or = [
            { name: { $regex: query.search, $options: 'i' } },
            { email: { $regex: query.search, $options: 'i' } }
        ];
    }

    // Filter by role
    if (query.role) {
        filter.role = query.role;
    }

    // Filter by ban status
    if (query.isBanned !== undefined) {
        filter.isBanned = query.isBanned === 'true';
    }

    // Filter by deletion status
    if (query.isDeleted !== undefined) {
        filter.isDeleted = query.isDeleted === 'true';
    }

    const [users, total] = await Promise.all([
        User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        User.countDocuments(filter)
    ]);

    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        users
    };
};

/**
 * Get single user by ID
 */
const getUserByIdService = async (userId) => {
    const user = await User.findById(userId).lean();
    return user;
};

/**
 * Ban a user
 */
const banUserService = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return null;

    user.isBanned = true;
    await user.save();
    return user;
};

/**
 * Unban a user
 */
const unbanUserService = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return null;

    user.isBanned = false;
    await user.save();
    return user;
};

/**
 * Update user's system role
 */
const updateUserRoleService = async (userId, newRole) => {
    const validRoles = ['user', 'seller', 'admin'];
    if (!validRoles.includes(newRole)) {
        throw new Error('INVALID_ROLE');
    }

    const user = await User.findById(userId);
    if (!user) return null;

    user.role = newRole;
    await user.save();
    return user;
};

module.exports = {
    getAllUsersService,
    getUserByIdService,
    banUserService,
    unbanUserService,
    updateUserRoleService
};
