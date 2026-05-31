const Product = require('../../models/product.model');

// @desc    Create a new product
// @route   POST /api/v1/products
// @access  Public (for now, until we add auth)
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to create product'
        });
    }
};

module.exports = {
    createProduct
};
