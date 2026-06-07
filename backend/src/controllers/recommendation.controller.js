const {
    getCustomerRecommendationsService,
    getOrderRecommendationsService,
    getTrendingProductsService,
    getTrendingCategoriesService
} = require('../services/recommendation.service');

/**
 * GET /api/v1/recommendations/products/:customerId
 * Treats :customerId param as the CustomerName to match the seeded dataset.
 */
const getCustomerRecommendations = async (req, res) => {
    try {
        const customerName = req.params.customerId;
        if (!customerName) {
            return res.status(400).json({ success: false, message: 'Customer name identifier is required.' });
        }

        const data = await getCustomerRecommendationsService(customerName);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getCustomerRecommendations:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/recommendations/orders/:orderId
 */
const getOrderRecommendations = async (req, res) => {
    try {
        const { orderId } = req.params;
        const data = await getOrderRecommendationsService(orderId);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: `Order with ID '${orderId}' not found.`
            });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getOrderRecommendations:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/trending/products
 */
const getTrendingProducts = async (req, res) => {
    try {
        const data = await getTrendingProductsService();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getTrendingProducts:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * GET /api/v1/trending/categories
 */
const getTrendingCategories = async (req, res) => {
    try {
        const data = await getTrendingCategoriesService();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getTrendingCategories:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getCustomerRecommendations,
    getOrderRecommendations,
    getTrendingProducts,
    getTrendingCategories
};
