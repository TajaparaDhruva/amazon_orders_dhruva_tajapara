const {
    getUserSessionsService,
    deleteSessionService,
    refreshTokenService
} = require('../../services/auth/session.service');

/**
 * GET /api/v1/auth/sessions
 * Returns list of active sessions for the logged-in user
 */
const getUserSessions = async (req, res) => {
    try {
        const sessions = await getUserSessionsService(req.user._id);
        res.status(200).json({
            success: true,
            data: sessions
        });
    } catch (error) {
        console.error('Error in getUserSessions:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * DELETE /api/v1/auth/sessions/:id
 * Invalidates a specific session for the logged-in user
 */
const deleteSession = async (req, res) => {
    try {
        const sessionId = req.params.id;
        await deleteSessionService(req.user._id, sessionId);

        res.status(200).json({
            success: true,
            message: 'Session invalidated/logged out successfully.'
        });
    } catch (error) {
        console.error('Error in deleteSession:', error);

        if (error.message === 'SESSION_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Session not found or does not belong to your account.'
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
 * POST /api/v1/auth/refresh-token
 * Generates a new access token using a refresh token
 */
const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required.'
            });
        }

        const result = await refreshTokenService(refreshToken);

        res.status(200).json({
            success: true,
            message: 'Access token refreshed successfully.',
            token: result.accessToken
        });
    } catch (error) {
        console.error('Error in refreshAccessToken:', error);

        if (error.message === 'INVALID_OR_EXPIRED_SESSION') {
            return res.status(401).json({
                success: false,
                message: 'Session has expired or is invalid. Please log in again.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    getUserSessions,
    deleteSession,
    refreshAccessToken
};
