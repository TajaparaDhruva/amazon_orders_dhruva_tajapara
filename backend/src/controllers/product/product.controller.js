const {
    getUniqueProductsService,
    getProductByIdService
} = require('../../services/product/product.service');

/**
 * GET /api/v1/products
 * Get all unique products with search and category filters.
 */
const getProducts = async (req, res) => {
    try {
        const products = await getUniqueProductsService(req.query);
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error in getProducts controller:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/products/:id
 * Get details for a single product by its ProductID.
 */
const getProductById = async (req, res) => {
    try {
        const product = await getProductByIdService(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Product with ID '${req.params.id}' not found`
            });
        }
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error in getProductById controller:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    getProducts,
    getProductById
};
