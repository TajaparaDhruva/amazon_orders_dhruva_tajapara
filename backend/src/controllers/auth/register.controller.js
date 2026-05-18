const User = require('../../models/user.model');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Check if all required fields are present
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and password'
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create the user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: role || 'user'
        });

        // Exclude password from the response
        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            isBanned: user.isBanned,
            isDeleted: user.isDeleted,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: userWithoutPassword
        });

    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    registerUser
};
