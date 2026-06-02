const Order = require('../../models/order.model');

// In-memory store for recent search queries
let recentSearches = [
    'Sony', 'Wireless Headphones', 'Electronics', 'Dhruva', 'UPI', 'Rajkot'
];

/**
 * Helper to calculate Levenshtein distance between two strings
 */
const getLevenshteinDistance = (a, b) => {
    const tmpA = a.toLowerCase();
    const tmpB = b.toLowerCase();
    const matrix = [];

    for (let i = 0; i <= tmpB.length; i++) matrix[i] = [i];
    for (let j = 0; j <= tmpA.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= tmpB.length; i++) {
        for (let j = 1; j <= tmpA.length; j++) {
            if (tmpB.charAt(i - 1) === tmpA.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1  // deletion
                    )
                );
            }
        }
    }
    return matrix[tmpB.length][tmpA.length];
};

/**
 * Record a search query in the recent searches store
 */
const recordSearchQuery = (q) => {
    if (!q || typeof q !== 'string') return;
    const trimmed = q.trim();
    if (!trimmed) return;

    // Remove duplicates if exists
    recentSearches = recentSearches.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
    // Add to the front
    recentSearches.unshift(trimmed);
    // Keep last 15 searches
    if (recentSearches.length > 15) {
        recentSearches.pop();
    }
};

/**
 * Fuzzy search using character distance (Levenshtein) and partial regex matching.
 * Compares query against ProductName, Brand, and CustomerName.
 */
const searchFuzzyService = async (queryParams) => {
    const { q, maxDistance = 3 } = queryParams;
    if (!q) {
        throw new Error('Search query "q" is required for fuzzy search');
    }

    // Record the search query
    recordSearchQuery(q);

    // Fetch candidate orders (doing a broad regex search on words to narrow down candidate pool)
    const words = q.split(/\s+/).filter(Boolean);
    const candidateFilter = {
        $or: words.map(w => {
            const escaped = w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            return {
                $or: [
                    { ProductName: { $regex: escaped, $options: 'i' } },
                    { CustomerName: { $regex: escaped, $options: 'i' } },
                    { Brand: { $regex: escaped, $options: 'i' } }
                ]
            };
        })
    };

    // If candidate list is empty, query all to see if spelling is completely off
    let candidates = await Order.find(candidateFilter).lean();
    if (candidates.length === 0) {
        candidates = await Order.find().limit(200).lean();
    }

    const maxDist = Number(maxDistance);

    // Score and filter candidates based on Levenshtein distance
    const scoredCandidates = candidates.map(order => {
        const prodDist = getLevenshteinDistance(order.ProductName, q);
        const brandDist = getLevenshteinDistance(order.Brand, q);
        const custDist = getLevenshteinDistance(order.CustomerName, q);
        const minDistance = Math.min(prodDist, brandDist, custDist);

        return {
            order,
            distance: minDistance
        };
    })
    .filter(candidate => candidate.distance <= maxDist)
    .sort((a, b) => a.distance - b.distance); // closest matches first

    return scoredCandidates.map(c => ({
        ...c.order,
        _fuzzyDistance: c.distance
    }));
};

/**
 * Auto-suggest search predictions for autocomplete dropdowns.
 * Returns unique suggestions from ProductName, CustomerName, Brand, and Category.
 */
const searchAutocompleteService = async (queryParams) => {
    const { q } = queryParams;
    if (!q) {
        throw new Error('Search query "q" is required for autocomplete');
    }

    const escapedQ = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regexObj = { $regex: `^${escapedQ}`, $options: 'i' }; // Prefix matching for suggestions

    const orders = await Order.find({
        $or: [
            { ProductName: regexObj },
            { CustomerName: regexObj },
            { Brand: regexObj },
            { Category: regexObj }
        ]
    })
    .select('ProductName CustomerName Brand Category')
    .limit(50)
    .lean();

    const suggestions = new Set();
    const queryLower = q.toLowerCase();

    orders.forEach(o => {
        if (o.ProductName && o.ProductName.toLowerCase().startsWith(queryLower)) {
            suggestions.add({ text: o.ProductName, type: 'product' });
        }
        if (o.CustomerName && o.CustomerName.toLowerCase().startsWith(queryLower)) {
            suggestions.add({ text: o.CustomerName, type: 'customer' });
        }
        if (o.Brand && o.Brand.toLowerCase().startsWith(queryLower)) {
            suggestions.add({ text: o.Brand, type: 'brand' });
        }
        if (o.Category && o.Category.toLowerCase().startsWith(queryLower)) {
            suggestions.add({ text: o.Category, type: 'category' });
        }
    });

    // If suggestions are fewer than 5, try matching anywhere in string (not just prefix)
    if (suggestions.size < 5) {
        const containsRegex = { $regex: escapedQ, $options: 'i' };
        const fallbackOrders = await Order.find({
            $or: [
                { ProductName: containsRegex },
                { CustomerName: containsRegex },
                { Brand: containsRegex },
                { Category: containsRegex }
            ]
        })
        .select('ProductName CustomerName Brand Category')
        .limit(50)
        .lean();

        fallbackOrders.forEach(o => {
            if (o.ProductName && o.ProductName.toLowerCase().includes(queryLower)) {
                suggestions.add({ text: o.ProductName, type: 'product' });
            }
            if (o.CustomerName && o.CustomerName.toLowerCase().includes(queryLower)) {
                suggestions.add({ text: o.CustomerName, type: 'customer' });
            }
            if (o.Brand && o.Brand.toLowerCase().includes(queryLower)) {
                suggestions.add({ text: o.Brand, type: 'brand' });
            }
            if (o.Category && o.Category.toLowerCase().includes(queryLower)) {
                suggestions.add({ text: o.Category, type: 'category' });
            }
        });
    }

    return Array.from(suggestions).slice(0, 10);
};

/**
 * Returns matching orders with highlighted matching terms.
 */
const searchHighlightService = async (queryParams) => {
    const { q } = queryParams;
    if (!q) {
        throw new Error('Search query "q" is required for highlight search');
    }

    // Record the search query
    recordSearchQuery(q);

    const escapedQ = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regexObj = { $regex: escapedQ, $options: 'i' };

    const orders = await Order.find({
        $or: [
            { ProductName: regexObj },
            { CustomerName: regexObj },
            { Brand: regexObj },
            { Category: regexObj },
            { City: regexObj }
        ]
    })
    .limit(20)
    .lean();

    const highlightText = (text, query) => {
        if (!text || !query) return text;
        const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    };

    return orders.map(order => {
        const highlightedFields = {};

        if (order.ProductName) highlightedFields.ProductName = highlightText(order.ProductName, q);
        if (order.CustomerName) highlightedFields.CustomerName = highlightText(order.CustomerName, q);
        if (order.Brand) highlightedFields.Brand = highlightText(order.Brand, q);
        if (order.Category) highlightedFields.Category = highlightText(order.Category, q);
        if (order.City) highlightedFields.City = highlightText(order.City, q);

        return {
            ...order,
            highlights: highlightedFields
        };
    });
};

/**
 * Returns the recorded list of recent searches.
 */
const getRecentSearchesService = async () => {
    return recentSearches;
};

/**
 * Returns popular searches and statistics aggregated from order volumes.
 */
const getPopularSearchesService = async () => {
    // Aggregate top brands
    const topBrands = await Order.aggregate([
        { $group: { _id: '$Brand', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    // Aggregate top categories
    const topCategories = await Order.aggregate([
        { $group: { _id: '$Category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    // Aggregate top products
    const topProducts = await Order.aggregate([
        { $group: { _id: '$ProductName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    return {
        popularBrands: topBrands.map(b => b._id),
        popularCategories: topCategories.map(c => c._id),
        popularProducts: topProducts.map(p => p._id),
        popularQueries: ['Sony', 'Electronics', 'Headphones', 'UPI']
    };
};

module.exports = {
    searchFuzzyService,
    searchAutocompleteService,
    searchHighlightService,
    getRecentSearchesService,
    getPopularSearchesService
};
