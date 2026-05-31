const Order = require('../../models/order.model');

const createOrder = async (req, res) => {
    try {
        const {
            OrderID,
            CustomerID,
            CustomerName,
            ProductID,
            ProductName,
            Category,
            Brand,
            Quantity,
            UnitPrice,
            Discount,
            Tax,
            ShippingCost,
            TotalAmount,
            PaymentMethod,
            OrderDate,
            OrderStatus,
            City,
            State,
            Country,
            SellerID
        } = req.body;

        // Check required fields
        if (
            !OrderID || !CustomerID || !CustomerName ||
            !ProductID || !ProductName || !Category ||
            !Brand || !Quantity || !UnitPrice ||
            !TotalAmount || !PaymentMethod || !OrderDate || !SellerID
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if order with same OrderID already exists
        const orderExists = await Order.findOne({ OrderID });

        if (orderExists) {
            return res.status(409).json({
                success: false,
                message: `Order with OrderID '${OrderID}' already exists`
            });
        }

        // Create the order
        const order = await Order.create({
            OrderID,
            CustomerID,
            CustomerName,
            ProductID,
            ProductName,
            Category,
            Brand,
            Quantity,
            UnitPrice,
            Discount,
            Tax,
            ShippingCost,
            TotalAmount,
            PaymentMethod,
            OrderDate,
            OrderStatus: OrderStatus || 'Pending',
            City,
            State,
            Country,
            SellerID
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });

    } catch (error) {
        console.error('Error in createOrder:', error);

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = { createOrder };
