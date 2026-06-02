const Order = require('../../models/order.model');

/**
 * Helper to build common pagination & sorting options
 */
const getPaginationOptions = (queryParams) => {
    const {
        page = 1,
        limit = 10,
        sortBy = 'OrderDate',
        sortOrder = 'desc'
    } = queryParams;

    const skip = (Number(page) - 1) * Number(limit);
    const sortDir = sortOrder === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortDir };

    return {
        page: Number(page),
        limit: Number(limit),
        skip,
        sortObj
    };
};

/**
 * Helper to execute paginated query on Order model
 */
const executeSearchQuery = async (filter, queryParams) => {
    const { page, limit, skip, sortObj } = getPaginationOptions(queryParams);

    const [orders, total] = await Promise.all([
        Order.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
        Order.countDocuments(filter)
    ]);

    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        orders
    };
};

/**
 * General search across all text-based fields of an order
 */
const searchGeneralService = async (queryParams) => {
    const { q, status, isArchived } = queryParams;
    const filter = {};

    // Apply soft-archived filter if specified, default to non-archived or all?
    // Let's filter by isArchived if specified, else match both or default false? Let's check model default.
    // In our model, isArchived is false by default. Let's make it not filter by default, but if specified we apply it.
    if (isArchived !== undefined) {
        filter.isArchived = isArchived === 'true';
    }

    if (status) {
        filter.OrderStatus = status;
    }

    if (q) {
        const escapedQ = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // escape regex specials
        const regexObj = { $regex: escapedQ, $options: 'i' };

        filter.$or = [
            { OrderID: regexObj },
            { CustomerID: regexObj },
            { CustomerName: regexObj },
            { ProductID: regexObj },
            { ProductName: regexObj },
            { Brand: regexObj },
            { Category: regexObj },
            { City: regexObj },
            { State: regexObj },
            { Country: regexObj },
            { SellerID: regexObj }
        ];
    }

    return await executeSearchQuery(filter, queryParams);
};

/**
 * Customer specific search (CustomerID, CustomerName, City, State, Country)
 */
const searchCustomerService = async (queryParams) => {
    const { q, city, state, country } = queryParams;
    const filter = {};

    if (city) filter.City = { $regex: city, $options: 'i' };
    if (state) filter.State = { $regex: state, $options: 'i' };
    if (country) filter.Country = { $regex: country, $options: 'i' };

    if (q) {
        const escapedQ = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regexObj = { $regex: escapedQ, $options: 'i' };

        filter.$or = [
            { CustomerID: regexObj },
            { CustomerName: regexObj },
            { City: regexObj },
            { State: regexObj },
            { Country: regexObj }
        ];
    }

    return await executeSearchQuery(filter, queryParams);
};

/**
 * Product specific search (ProductID, ProductName, Brand, Category)
 */
const searchProductService = async (queryParams) => {
    const { q, category, brand } = queryParams;
    const filter = {};

    if (category) filter.Category = category;
    if (brand) filter.Brand = { $regex: brand, $options: 'i' };

    if (q) {
        const escapedQ = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regexObj = { $regex: escapedQ, $options: 'i' };

        filter.$or = [
            { ProductID: regexObj },
            { ProductName: regexObj },
            { Brand: regexObj },
            { Category: regexObj }
        ];
    }

    return await executeSearchQuery(filter, queryParams);
};

module.exports = {
    searchGeneralService,
    searchCustomerService,
    searchProductService
};
