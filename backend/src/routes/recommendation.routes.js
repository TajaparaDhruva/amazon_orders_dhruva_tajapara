const express = require('express');
const router = express.Router();

const {
    getCustomerRecommendations,
    getOrderRecommendations,
    getTrendingProducts,
    getTrendingCategories
} = require('../controllers/recommendation.controller');

// GET /api/v1/recommendations/products/:customerId
router.get('/recommendations/products/:customerId', getCustomerRecommendations);

// GET /api/v1/recommendations/orders/:orderId
router.get('/recommendations/orders/:orderId', getOrderRecommendations);

// GET /api/v1/trending/products
router.get('/trending/products', getTrendingProducts);

// GET /api/v1/trending/categories
router.get('/trending/categories', getTrendingCategories);

module.exports = router;
