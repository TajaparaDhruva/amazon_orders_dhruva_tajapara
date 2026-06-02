const {
    searchGeneralService,
    searchCustomerService,
    searchProductService
} = require('../../services/search/basicSearch.service');

/**
 * GET /api/v1/search
 * General search across all order fields
 */
const searchGeneral = async (req, res) => {
    try {
        const results = await searchGeneralService(req.query);

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error in searchGeneral:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/search/customer
 * Search focused on customer-related fields
 */
const searchCustomer = async (req, res) => {
    try {
        const results = await searchCustomerService(req.query);

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error in searchCustomer:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/search/product
 * Search focused on product-related fields
 */
const searchProduct = async (req, res) => {
    try {
        const results = await searchProductService(req.query);

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error in searchProduct:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    searchGeneral,
    searchCustomer,
    searchProduct
};
