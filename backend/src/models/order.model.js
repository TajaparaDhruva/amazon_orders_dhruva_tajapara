const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        OrderID: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        OrderDate: {
            type: Date,
            required: true
        },
        CustomerID: {
            type: String,
            required: true
        },
        CustomerName: {
            type: String,
            required: true
        },
        ProductID: {
            type: String,
            required: true
        },
        ProductName: {
            type: String,
            required: true
        },
        Category: {
            type: String,
            required: true
        },
        Brand: {
            type: String,
            required: true
        },
        Quantity: {
            type: Number,
            required: true
        },
        UnitPrice: {
            type: Number,
            required: true
        },
        Discount: {
            type: Number,
            default: 0
        },
        Tax: {
            type: Number,
            default: 0
        },
        ShippingCost: {
            type: Number,
            default: 0
        },
        TotalAmount: {
            type: Number,
            required: true
        },
        PaymentMethod: {
            type: String,
            required: true
        },
        OrderStatus: {
            type: String,
            required: true
        },
        City: {
            type: String
        },
        State: {
            type: String
        },
        Country: {
            type: String
        },
        SellerID: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
