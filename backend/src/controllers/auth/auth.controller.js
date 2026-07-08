const { registerService, loginService } = require('../../services/auth/auth.service');

/**
 * POST /api/v1/auth/register
 */
const register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and password'
            });
        }

        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        const result = await registerService({ name, email, password, phone, role, ipAddress, userAgent });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token: result.token,
            refreshToken: result.refreshToken,
            data: result.user
        });

    } catch (error) {
        console.error('Error in register:', error);

        if (error.message === 'USER_EXISTS') {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        // Mongoose validation error
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
 * POST /api/v1/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        const result = await loginService({ email, password, ipAddress, userAgent });

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token: result.token,
            refreshToken: result.refreshToken,
            data: result.user
        });

    } catch (error) {
        console.error('Error in login:', error);

        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        if (error.message === 'ACCOUNT_BANNED') {
            return res.status(403).json({
                success: false,
                message: 'Your account has been suspended. Please contact support.'
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
 * POST /api/v1/auth/logout
 * JWT is stateless — logout is handled client-side by discarding the token.
 * This endpoint serves as a formal logout signal and can be extended
 * to support token blacklisting in future.
 */
const logout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Logged out successfully. Please discard your token on the client side.'
        });
    } catch (error) {
        console.error('Error in logout:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    demoCustomerLogin, register, login, logout };

const demoCustomerLogin = async (req, res) => {
    try {
        const User = require('../../models/user.model');
        const jwt = require('jsonwebtoken');
        const { createSessionService } = require('../../services/auth/session.service');

        let user = await User.findOne({ email: 'dhruvatajapara@gmail.com' });
        if (!user) {
            user = await User.findOne({ role: 'user' });
        }
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No demo customer account found'
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'defaultsecret123',
            { expiresIn: '7d' }
        );

        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        const session = await createSessionService(user._id, { ipAddress, userAgent });

        res.status(200).json({
            success: true,
            message: 'Logged in as Demo Customer successfully',
            token,
            refreshToken: session.refreshToken,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                isBanned: user.isBanned,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (err) {
        console.error('Error in demoCustomerLogin:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
};
