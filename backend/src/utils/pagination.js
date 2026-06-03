/**
 * Utility functions for pagination
 */

/**
 * Parse page and limit from query parameters
 */
const getOffsetPagination = (query, defaultLimit = 10) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || defaultLimit));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

/**
 * Generate standardized offset pagination metadata
 */
const getOffsetMetadata = (total, page, limit, baseUrl = '', queryParams = {}) => {
    const totalPages = Math.ceil(total / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    // Helper to construct URLs
    const buildUrl = (targetPage) => {
        if (!baseUrl) return null;
        const params = new URLSearchParams({ ...queryParams, page: targetPage, limit });
        return `${baseUrl}?${params.toString()}`;
    };

    return {
        total,
        page,
        limit,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        prevPageUrl: hasPrevPage ? buildUrl(page - 1) : null,
        nextPageUrl: hasNextPage ? buildUrl(page + 1) : null
    };
};

/**
 * Parse cursor pagination parameters
 * Cursor format: base64 encoded string containing the ID of the last item
 */
const getCursorPagination = (query, defaultLimit = 10) => {
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || defaultLimit));
    let nextCursor = null;

    if (query.cursor) {
        try {
            // Decode base64 cursor
            const decoded = Buffer.from(query.cursor, 'base64').toString('ascii');
            if (decoded) {
                nextCursor = decoded;
            }
        } catch (error) {
            console.warn('Invalid cursor format provided:', error.message);
        }
    }

    return { limit, cursor: nextCursor };
};

/**
 * Generate cursor pagination response metadata
 */
const getCursorMetadata = (items, limit, cursorField = '_id') => {
    const hasMore = items.length > limit;
    
    // If we fetched an extra item to check for more, slice it off
    const resultItems = hasMore ? items.slice(0, limit) : items;
    
    let nextCursorBase64 = null;
    if (resultItems.length > 0 && hasMore) {
        const lastItem = resultItems[resultItems.length - 1];
        const lastVal = lastItem[cursorField];
        if (lastVal) {
            nextCursorBase64 = Buffer.from(lastVal.toString()).toString('base64');
        }
    }

    return {
        items: resultItems,
        hasMore,
        nextCursor: nextCursorBase64
    };
};

module.exports = {
    getOffsetPagination,
    getOffsetMetadata,
    getCursorPagination,
    getCursorMetadata
};
