const {
    searchFuzzyService,
    searchAutocompleteService,
    searchHighlightService,
    getRecentSearchesService,
    getPopularSearchesService
} = require('../../services/search/searchEnhancement.service');

/**
 * GET /api/v1/search/fuzzy
 * Execute character-distance based fuzzy match on orders
 */
const searchFuzzy = async (req, res) => {
    try {
        const results = await searchFuzzyService(req.query);
        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error in searchFuzzy:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/search/autocomplete
 * Predict full suggestions and category classifications based on prefix
 */
const searchAutocomplete = async (req, res) => {
    try {
        const results = await searchAutocompleteService(req.query);
        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error in searchAutocomplete:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/search/highlight
 * Match order fields and return search markup highlight formatting
 */
const searchHighlight = async (req, res) => {
    try {
        const results = await searchHighlightService(req.query);
        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error in searchHighlight:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/search/recent
 * Retrieve user's recent queries
 */
const searchRecent = async (req, res) => {
    try {
        const results = await getRecentSearchesService();
        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error in searchRecent:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/search/popular
 * Retrieve analytics showing most ordered products, brands, and categories
 */
const searchPopular = async (req, res) => {
    try {
        const results = await getPopularSearchesService();
        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error in searchPopular:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    searchFuzzy,
    searchAutocomplete,
    searchHighlight,
    searchRecent,
    searchPopular
};
