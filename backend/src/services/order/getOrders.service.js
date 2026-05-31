const Order = require('../../models/order.model');

/**
 * Get all orders with filtering, sorting & pagination
 */
const getAllOrdersService = async (query) => {
    const {
        page = 1,
        limit = 10,
        status,
        category,
        paymentMethod,
        sellerID,
        customerID,
        startDate,
        endDate,
        minAmount,
        maxAmount,
        search,
        sortBy = 'OrderDate',
        sortOrder = 'desc'
    } = query;

    const filter = {};

    // Filters
    if (status)        filter.OrderStatus   = status;
    if (category)      filter.Category      = category;
    if (paymentMethod) filter.PaymentMethod  = paymentMethod;
    if (sellerID)      filter.SellerID      = sellerID;
    if (customerID)    filter.CustomerID    = customerID;

    // Date range
    if (startDate || endDate) {
        filter.OrderDate = {};
        if (startDate) filter.OrderDate.$gte = new Date(startDate);
        if (endDate)   filter.OrderDate.$lte = new Date(endDate);
    }

    // Amount range
    if (minAmount || maxAmount) {
        filter.TotalAmount = {};
        if (minAmount) filter.TotalAmount.$gte = Number(minAmount);
        if (maxAmount) filter.TotalAmount.$lte = Number(maxAmount);
    }

    // Search by ProductName or CustomerName
    if (search) {
        filter.$or = [
            { ProductName:   { $regex: search, $options: 'i' } },
            { CustomerName:  { $regex: search, $options: 'i' } }
        ];
    }

    const skip      = (Number(page) - 1) * Number(limit);
    const sortDir   = sortOrder === 'asc' ? 1 : -1;
    const sortObj   = { [sortBy]: sortDir };

    const [orders, total] = await Promise.all([
        Order.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
        Order.countDocuments(filter)
    ]);

    return {
        total,
        page:       Number(page),
        limit:      Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        orders
    };
};

/**
 * Get single order by OrderID
 */
const getOrderByIdService = async (orderId) => {
    const order = await Order.findOne({ OrderID: orderId });
    return order;
};

module.exports = { getAllOrdersService, getOrderByIdService };
