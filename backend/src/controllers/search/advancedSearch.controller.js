const {
    searchStatusService,
    searchPaymentService,
    searchLocationService,
    searchDateService,
    searchTrackingService
} = require('../../services/search/advancedSearch.service');

/**
 * GET /api/v1/search/status
 * Search/filter orders by status, or return aggregation counts
 */
const searchStatus = async (req, res) => {
    try {
        const results = await searchStatusService(req.query);
        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error in searchStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/search/payment
 * Search/filter orders by payment method, or return aggregation counts
 */
const searchPayment = async (req, res) => {
    try {
        const results = await searchPaymentService(req.query);
        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error in searchPayment:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/search/location
 * Search/filter orders by location (city, state, country)
 */
const searchLocation = async (req, res) => {
    try {
        const results = await searchLocationService(req.query);
        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error in searchLocation:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/search/date
 * Search/filter orders by date range
 */
const searchDate = async (req, res) => {
    try {
        const results = await searchDateService(req.query);
        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error in searchDate:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/search/tracking
 * Get tracking progress milestones and current location details for an order
 */
const searchTracking = async (req, res) => {
    try {
        const result = await searchTrackingService(req.query);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: `Tracking info not found for order ID '${req.query.orderId || req.query.q}'`
            });
        }

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in searchTracking:', error);
        res.status(400).json({
            success: false,
            message: 'Bad Request',
            error: error.message
        });
    }
};

module.exports = {
    searchStatus,
    searchPayment,
    searchLocation,
    searchDate,
    searchTracking
};
