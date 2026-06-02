const {
    searchCategoryService,
    searchBrandService
} = require('../../services/search/categorySearch.service');

/**
 * GET /api/v1/search/category
 * Search orders by category, or return list of distinct categories
 */
const searchCategory = async (req, res) => {
    try {
        const results = await searchCategoryService(req.query);

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error in searchCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/search/brand
 * Search orders by brand, or return list of distinct brands
 */
const searchBrand = async (req, res) => {
    try {
        const results = await searchBrandService(req.query);

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error in searchBrand:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    searchCategory,
    searchBrand
};
