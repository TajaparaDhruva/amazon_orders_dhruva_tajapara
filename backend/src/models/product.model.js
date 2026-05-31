const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter product name'],
            trim: true,
            maxLength: [100, 'Product name cannot exceed 100 characters']
        },
        description: {
            type: String,
            required: [true, 'Please enter product description']
        },
        price: {
            type: Number,
            required: [true, 'Please enter product price'],
            default: 0.0
        },
        category: {
            type: String,
            required: [true, 'Please enter product category']
        },
        brand: {
            type: String,
            required: [true, 'Please enter product brand']
        },
        stock: {
            type: Number,
            required: [true, 'Please enter product stock'],
            default: 0
        },
        sellerId: {
            type: String,
            required: true
        },
        images: [
            {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ],
        ratings: {
            type: Number,
            default: 0
        },
        numOfReviews: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
