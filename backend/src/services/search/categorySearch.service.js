const Order = require('../../models/order.model');

/**
 * Helper to build pagination & sorting options
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
 * Search categories.
 * 1. Autocomplete/Distinct list: if `distinct=true` is passed, returns a list of distinct matching category names.
 * 2. Order list: returns paginated orders matching the category query.
 */
const searchCategoryService = async (queryParams) => {
    const { q, distinct } = queryParams;

    // Autocomplete/Distinct list pattern
    if (distinct === 'true') {
        let matchFilter = {};
        if (q) {
            const escapedQ = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            matchFilter = { Category: { $regex: escapedQ, $options: 'i' } };
        }
        const distinctCategories = await Order.distinct('Category', matchFilter);
        return {
            distinct: true,
            categories: distinctCategories
        };
    }

    // Paginated orders list matching the category pattern
    const filter = {};
    if (q) {
        const escapedQ = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        filter.Category = { $regex: escapedQ, $options: 'i' };
    }

    const { page, limit, skip, sortObj } = getPaginationOptions(queryParams);

    const [orders, total] = await Promise.all([
        Order.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
        Order.countDocuments(filter)
    ]);

    return {
        distinct: false,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        orders
    };
};

/**
 * Search brands.
 * 1. Autocomplete/Distinct list: if `distinct=true` is passed, returns a list of distinct matching brand names.
 * 2. Order list: returns paginated orders matching the brand query.
 */
const searchBrandService = async (queryParams) => {
    const { q, distinct } = queryParams;

    // Autocomplete/Distinct list pattern
    if (distinct === 'true') {
        let matchFilter = {};
        if (q) {
            const escapedQ = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            matchFilter = { Brand: { $regex: escapedQ, $options: 'i' } };
        }
        const distinctBrands = await Order.distinct('Brand', matchFilter);
        return {
            distinct: true,
            brands: distinctBrands
        };
    }

    // Paginated orders list matching the brand pattern
    const filter = {};
    if (q) {
        const escapedQ = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        filter.Brand = { $regex: escapedQ, $options: 'i' };
    }

    const { page, limit, skip, sortObj } = getPaginationOptions(queryParams);

    const [orders, total] = await Promise.all([
        Order.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
        Order.countDocuments(filter)
    ]);

    return {
        distinct: false,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        orders
    };
};

module.exports = {
    searchCategoryService,
    searchBrandService
};
