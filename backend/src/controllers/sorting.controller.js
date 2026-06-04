const Order = require('../models/order.model');
const { parseSortParams, getDatabaseField } = require('../utils/sorting');

/**
 * Helper to build pagination options
 */
const getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 10));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

/**
 * GET /api/v1/orders/sort/:field
 * Sort orders by a specific path parameter field (e.g. /orders/sort/price or /orders/sort/quantity)
 */
const getSortedOrdersByField = async (req, res) => {
    try {
        const { field } = req.params;
        const directionQuery = req.query.direction || req.query.order || 'desc';
        const direction = (directionQuery.toLowerCase() === 'desc' || directionQuery === '-1') ? -1 : 1;

        // Map path param to database field
        const dbField = getDatabaseField(field);
        const sortObj = { [dbField]: direction };

        // Support optional filters
        const filter = {};
        if (req.query.status) filter.OrderStatus = req.query.status;
        if (req.query.category) filter.Category = req.query.category;
        if (req.query.isArchived !== undefined) {
            filter.isArchived = req.query.isArchived === 'true';
        }

        const { page, limit, skip } = getPagination(req.query);

        const [orders, total] = await Promise.all([
            Order.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
            Order.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            sorting: {
                requestedField: field,
                mappedDatabaseField: dbField,
                direction: direction === 1 ? 'asc' : 'desc'
            },
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            data: orders
        });

    } catch (error) {
        console.error('Error in getSortedOrdersByField:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/orders (Alternative sorted view using ?sort=)
 * Can be mounted or called to sort by flexible sort query strings e.g. ?sort=-price,date
 */
const getSortedOrdersByQuery = async (req, res) => {
    try {
        const sortParam = req.query.sort;
        const sortObj = parseSortParams(sortParam);

        // Support optional filters
        const filter = {};
        if (req.query.status) filter.OrderStatus = req.query.status;
        if (req.query.category) filter.Category = req.query.category;
        if (req.query.isArchived !== undefined) {
            filter.isArchived = req.query.isArchived === 'true';
        }

        const { page, limit, skip } = getPagination(req.query);

        const [orders, total] = await Promise.all([
            Order.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
            Order.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            sorting: {
                parsedSortRule: sortObj
            },
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            data: orders
        });

    } catch (error) {
        console.error('Error in getSortedOrdersByQuery:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    getSortedOrdersByField,
    getSortedOrdersByQuery
};
