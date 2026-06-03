const Order = require('../models/order.model');
const {
    getOffsetPagination,
    getOffsetMetadata,
    getCursorPagination,
    getCursorMetadata
} = require('../utils/pagination');

/**
 * Helper to build database filter from query params
 */
const buildOrderFilter = (query) => {
    const filter = {};

    if (query.status) {
        filter.OrderStatus = query.status;
    }
    if (query.category) {
        filter.Category = query.category;
    }
    if (query.paymentMethod) {
        filter.PaymentMethod = query.paymentMethod;
    }
    if (query.sellerID) {
        filter.SellerID = query.sellerID;
    }
    if (query.customerID) {
        filter.CustomerID = query.customerID;
    }
    if (query.isArchived !== undefined) {
        filter.isArchived = query.isArchived === 'true';
    }

    return filter;
};

/**
 * GET /api/v1/orders/paged
 * Offset-based pagination with complete page navigation metadata and URLs
 */
const getPagedOrders = async (req, res) => {
    try {
        const filter = buildOrderFilter(req.query);
        const { page, limit, skip } = getOffsetPagination(req.query);
        
        // Sorting defaults
        const sortBy = req.query.sortBy || 'OrderDate';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const sortObj = { [sortBy]: sortOrder };

        const [orders, total] = await Promise.all([
            Order.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
            Order.countDocuments(filter)
        ]);

        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
        const queryParamsWithoutPage = { ...req.query };
        delete queryParamsWithoutPage.page;

        const pagination = getOffsetMetadata(total, page, limit, baseUrl, queryParamsWithoutPage);

        res.status(200).json({
            success: true,
            pagination,
            data: orders
        });

    } catch (error) {
        console.error('Error in getPagedOrders:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/orders/infinite
 * Cursor-based pagination for infinite scroll behaviors (returns hasMore and nextCursor)
 */
const getInfiniteOrders = async (req, res) => {
    try {
        const filter = buildOrderFilter(req.query);
        const { limit, cursor } = getCursorPagination(req.query);

        // Sorting is strictly by _id descending to support proper cursors chronologically
        const sortObj = { _id: -1 };

        if (cursor) {
            // Because we sort descending, next page will have _ids strictly less than the cursor
            filter._id = { $lt: cursor };
        }

        // Fetch limit + 1 items to determine if hasMore is true
        const orders = await Order.find(filter)
            .sort(sortObj)
            .limit(limit + 1)
            .lean();

        const result = getCursorMetadata(orders, limit, '_id');

        res.status(200).json({
            success: true,
            data: result.items,
            pagination: {
                limit,
                hasMore: result.hasMore,
                nextCursor: result.nextCursor
            }
        });

    } catch (error) {
        console.error('Error in getInfiniteOrders:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    getPagedOrders,
    getInfiniteOrders
};
