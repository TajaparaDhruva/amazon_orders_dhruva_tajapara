const Order = require('../models/order.model');
const { enrichProduct } = require('./product/product.service');

/**
 * Recommend products for a customer based on their purchase history categories.
 * Fallbacks to top selling items if no history is found.
 */
const getCustomerRecommendationsService = async (customerName) => {
    // 1. Find customer's purchased categories and products
    const customerHistory = await Order.aggregate([
        { $match: { CustomerName: customerName, isArchived: { $ne: true } } },
        {
            $group: {
                _id: null,
                categories: { $addToSet: '$Category' },
                purchasedProducts: { $addToSet: '$ProductName' }
            }
        }
    ]);

    // If no purchase history, recommend top selling items on the platform
    if (!customerHistory || customerHistory.length === 0 || customerHistory[0].categories.length === 0) {
        const fallbackProducts = await Order.aggregate([
            { $match: { isArchived: { $ne: true } } },
            {
                $group: {
                    _id: '$ProductID',
                    ProductID: { $first: '$ProductID' },
                    ProductName: { $first: '$ProductName' },
                    Category: { $first: '$Category' },
                    Brand: { $first: '$Brand' },
                    UnitPrice: { $first: '$UnitPrice' },
                    salesCount: { $sum: '$Quantity' }
                }
            },
            { $sort: { salesCount: -1 } },
            { $limit: 5 }
        ]);

        return {
            recommendationType: 'Fallback (Top Sellers)',
            recommendations: fallbackProducts.map(p => enrichProduct({
                ProductID: p.ProductID,
                ProductName: p.ProductName,
                Category: p.Category,
                Brand: p.Brand,
                UnitPrice: p.UnitPrice,
                OrderCount: p.salesCount
            }))
        };
    }

    const { categories, purchasedProducts } = customerHistory[0];

    // 2. Query popular products in customer's favorite categories (excluding already purchased items)
    const recommendations = await Order.aggregate([
        {
            $match: {
                Category: { $in: categories },
                ProductName: { $nin: purchasedProducts },
                isArchived: { $ne: true }
            }
        },
        {
            $group: {
                _id: '$ProductID',
                ProductID: { $first: '$ProductID' },
                ProductName: { $first: '$ProductName' },
                Category: { $first: '$Category' },
                Brand: { $first: '$Brand' },
                UnitPrice: { $first: '$UnitPrice' },
                popularityScore: { $sum: '$Quantity' }
            }
        },
        { $sort: { popularityScore: -1 } },
        { $limit: 5 }
    ]);

    return {
        recommendationType: 'Personalized (Based on Category Preferences)',
        preferredCategories: categories,
        recommendations: recommendations.map(r => enrichProduct({
            ProductID: r.ProductID,
            ProductName: r.ProductName,
            Category: r.Category,
            Brand: r.Brand,
            UnitPrice: r.UnitPrice,
            OrderCount: r.popularityScore
        }))
    };
};

/**
 * Recommend products related to a specific order (Frequently Bought Together / Category Siblings)
 */
const getOrderRecommendationsService = async (orderId) => {
    // 1. Fetch current order items
    const sourceOrder = await Order.findOne({ OrderID: orderId, isArchived: { $ne: true } }).lean();
    if (!sourceOrder) return null;

    const sourceProduct = sourceOrder.ProductName;
    const sourceCategory = sourceOrder.Category;

    // 2. Find other products in same category bought by other users
    const recommendations = await Order.aggregate([
        {
            $match: {
                Category: sourceCategory,
                ProductName: { $ne: sourceProduct },
                isArchived: { $ne: true }
            }
        },
        {
            $group: {
                _id: '$ProductID',
                ProductID: { $first: '$ProductID' },
                ProductName: { $first: '$ProductName' },
                Category: { $first: '$Category' },
                Brand: { $first: '$Brand' },
                UnitPrice: { $first: '$UnitPrice' },
                popularityScore: { $sum: '$Quantity' }
            }
        },
        { $sort: { popularityScore: -1 } },
        { $limit: 5 }
    ]);

    return {
        orderId,
        sourceProduct,
        sourceCategory,
        recommendations: recommendations.map(r => enrichProduct({
            ProductID: r.ProductID,
            ProductName: r.ProductName,
            Category: r.Category,
            Brand: r.Brand,
            UnitPrice: r.UnitPrice,
            OrderCount: r.popularityScore
        }))
    };
};

/**
 * Get trending products based on total sales volume in the past 30 days
 */
const getTrendingProductsService = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trendingProducts = await Order.aggregate([
        {
            $match: {
                OrderDate: { $gte: thirtyDaysAgo },
                isArchived: { $ne: true }
            }
        },
        {
            $group: {
                _id: '$ProductID',
                ProductID: { $first: '$ProductID' },
                ProductName: { $first: '$ProductName' },
                Category: { $first: '$Category' },
                Brand: { $first: '$Brand' },
                UnitPrice: { $first: '$UnitPrice' },
                salesVolume: { $sum: '$Quantity' }
            }
        },
        { $sort: { salesVolume: -1 } },
        { $limit: 10 }
    ]);

    return trendingProducts.map(p => enrichProduct({
        ProductID: p.ProductID,
        ProductName: p.ProductName,
        Category: p.Category,
        Brand: p.Brand,
        UnitPrice: p.UnitPrice,
        OrderCount: p.salesVolume
    }));
};

/**
 * Get trending categories based on total orders and total sales volume in the past 30 days
 */
const getTrendingCategoriesService = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trendingCategories = await Order.aggregate([
        {
            $match: {
                OrderDate: { $gte: thirtyDaysAgo },
                isArchived: { $ne: true }
            }
        },
        {
            $group: {
                _id: '$Category',
                ordersCount: { $sum: 1 },
                unitsSold: { $sum: '$Quantity' },
                revenue: { $sum: '$TotalAmount' }
            }
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 }
    ]);

    return trendingCategories.map(c => ({
        category: c._id || 'Unknown',
        ordersCount: c.ordersCount,
        unitsSold: c.unitsSold,
        revenue: c.revenue
    }));
};

module.exports = {
    getCustomerRecommendationsService,
    getOrderRecommendationsService,
    getTrendingProductsService,
    getTrendingCategoriesService
};
