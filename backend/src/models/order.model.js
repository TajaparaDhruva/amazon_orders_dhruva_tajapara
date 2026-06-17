const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        // ── Identifiers ──────────────────────────────────────────────────────
        OrderID: {
            type: String,
            required: [true, 'OrderID is required'],
            unique: true,
            trim: true,
            index: true
        },

        // ── Customer Info ────────────────────────────────────────────────────
        CustomerID: {
            type: String,
            required: [true, 'CustomerID is required'],
            trim: true,
            index: true
        },
        CustomerName: {
            type: String,
            required: [true, 'CustomerName is required'],
            trim: true
        },

        // ── Product Info ─────────────────────────────────────────────────────
        ProductID: {
            type: String,
            required: [true, 'ProductID is required'],
            trim: true,
            index: true
        },
        ProductName: {
            type: String,
            required: [true, 'ProductName is required'],
            trim: true
        },
        Category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            enum: {
                values: [
                    'Electronics',
                    'Clothing',
                    'Home & Kitchen',
                    'Books',
                    'Sports & Outdoors',
                    'Toys & Games',
                    'Beauty & Personal Care',
                    'Health & Household',
                    'Automotive',
                    'Fashion',
                    'Home & Living',
                    'Beauty',
                    'Sports',
                    'Other'
                ],
                message: '{VALUE} is not a valid category'
            }
        },
        Brand: {
            type: String,
            required: [true, 'Brand is required'],
            trim: true
        },

        // ── Pricing & Financials ─────────────────────────────────────────────
        Quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1']
        },
        UnitPrice: {
            type: Number,
            required: [true, 'UnitPrice is required'],
            min: [0, 'UnitPrice cannot be negative']
        },
        Discount: {
            type: Number,
            default: 0,
            min: [0, 'Discount cannot be negative'],
            max: [1, 'Discount cannot exceed 1 (100%)']
        },
        Tax: {
            type: Number,
            default: 0,
            min: [0, 'Tax cannot be negative']
        },
        ShippingCost: {
            type: Number,
            default: 0,
            min: [0, 'ShippingCost cannot be negative']
        },
        TotalAmount: {
            type: Number,
            required: [true, 'TotalAmount is required'],
            min: [0, 'TotalAmount cannot be negative']
        },

        // ── Payment ──────────────────────────────────────────────────────────
        PaymentMethod: {
            type: String,
            required: [true, 'PaymentMethod is required'],
            enum: {
                values: [
                    'Credit Card',
                    'Debit Card',
                    'UPI',
                    'Net Banking',
                    'Amazon Pay',
                    'Cash on Delivery',
                    'Other'
                ],
                message: '{VALUE} is not a valid payment method'
            }
        },

        // ── Order Lifecycle ──────────────────────────────────────────────────
        OrderDate: {
            type: Date,
            required: [true, 'OrderDate is required'],
            index: true
        },
        OrderStatus: {
            type: String,
            required: [true, 'OrderStatus is required'],
            enum: {
                values: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
                message: '{VALUE} is not a valid order status'
            },
            default: 'Pending',
            index: true
        },

        // ── Shipping Address ─────────────────────────────────────────────────
        City: {
            type: String,
            trim: true
        },
        State: {
            type: String,
            trim: true
        },
        Country: {
            type: String,
            trim: true
        },

        // ── Seller ───────────────────────────────────────────────────────────
        SellerID: {
            type: String,
            required: [true, 'SellerID is required'],
            trim: true,
            index: true
        },

        // ── Archive ──────────────────────────────────────────────────────────
        isArchived: {
            type: Boolean,
            default: false,
            index: true
        }
    },
    {
        timestamps: true   // createdAt & updatedAt
    }
);

// ── Compound indexes for common query patterns ───────────────────────────────
orderSchema.index({ SellerID: 1, OrderStatus: 1 });
orderSchema.index({ CustomerID: 1, OrderDate: -1 });
orderSchema.index({ OrderDate: -1 });
orderSchema.index({ Category: 1, OrderDate: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
