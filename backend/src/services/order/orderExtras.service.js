const Order = require('../../models/order.model');

/**
 * Duplicate an existing order.
 * Creates a new order with a generated OrderID, reset status, and fresh date.
 * Returns null if the source order does not exist.
 */
const duplicateOrderService = async (orderId) => {
    const sourceOrder = await Order.findOne({ OrderID: orderId }).lean();

    if (!sourceOrder) return null;

    // Generate a new unique OrderID based on timestamp
    const newOrderID = `DUP-${orderId}-${Date.now()}`;

    // Remove fields that should not carry over to the duplicate
    const { _id, __v, createdAt, updatedAt, ...orderData } = sourceOrder;

    const duplicate = await Order.create({
        ...orderData,
        OrderID: newOrderID,
        OrderStatus: 'Pending',
        OrderDate: new Date(),
        isArchived: false
    });

    return duplicate;
};

/**
 * Generate an invoice for a specific order.
 * Returns a structured invoice object with calculated totals.
 * Returns null if the order does not exist.
 */
const getOrderInvoiceService = async (orderId) => {
    const order = await Order.findOne({ OrderID: orderId }).lean();

    if (!order) return null;

    // Calculate pricing breakdown
    const subtotal = order.Quantity * order.UnitPrice;
    const discountAmount = subtotal * (order.Discount || 0);
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = order.Tax || 0;
    const shippingCost = order.ShippingCost || 0;
    const grandTotal = taxableAmount + taxAmount + shippingCost;

    const invoice = {
        invoiceNumber: `INV-${order.OrderID}`,
        invoiceDate: new Date(),

        // Customer details
        customer: {
            customerId: order.CustomerID,
            name: order.CustomerName,
            city: order.City || null,
            state: order.State || null,
            country: order.Country || null
        },

        // Item details
        items: [
            {
                productId: order.ProductID,
                productName: order.ProductName,
                category: order.Category,
                brand: order.Brand,
                quantity: order.Quantity,
                unitPrice: order.UnitPrice
            }
        ],

        // Pricing breakdown
        pricing: {
            subtotal,
            discountRate: order.Discount || 0,
            discountAmount,
            taxableAmount,
            tax: taxAmount,
            shippingCost,
            grandTotal
        },

        // Order meta
        order: {
            orderId: order.OrderID,
            orderDate: order.OrderDate,
            orderStatus: order.OrderStatus,
            paymentMethod: order.PaymentMethod,
            sellerId: order.SellerID
        }
    };

    return invoice;
};

module.exports = { duplicateOrderService, getOrderInvoiceService };
