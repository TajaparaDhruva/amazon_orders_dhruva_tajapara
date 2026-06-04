/**
 * Utility functions for sorting orders
 */

// Mapping friendly names to database fields
const FIELD_MAPPINGS = {
    price: 'TotalAmount',
    unitprice: 'UnitPrice',
    date: 'OrderDate',
    quantity: 'Quantity',
    customer: 'CustomerName',
    product: 'ProductName',
    status: 'OrderStatus',
    category: 'Category',
    brand: 'Brand',
    created: 'createdAt',
    updated: 'updatedAt'
};

/**
 * Maps a user-friendly field name to the corresponding database field.
 * Defaults to the input field if no mapping exists.
 */
const getDatabaseField = (friendlyField) => {
    if (!friendlyField) return 'OrderDate';
    const cleanField = friendlyField.toLowerCase().trim();
    return FIELD_MAPPINGS[cleanField] || friendlyField;
};

/**
 * Parses sort parameter string into a MongoDB sorting object.
 * Supported formats:
 * - Query param string: "price" -> { TotalAmount: 1 }
 * - Query param string: "-price" -> { TotalAmount: -1 }
 * - Query param string: "price:desc" -> { TotalAmount: -1 }
 * - Query param string: "price:desc,date:asc" -> { TotalAmount: -1, OrderDate: 1 }
 */
const parseSortParams = (sortParam) => {
    const sortObj = {};
    if (!sortParam || typeof sortParam !== 'string') {
        // Default sorting: OrderDate descending
        return { OrderDate: -1 };
    }

    const parts = sortParam.split(',');
    parts.forEach(part => {
        const cleanPart = part.trim();
        if (!cleanPart) return;

        let field = cleanPart;
        let direction = 1; // 1 = asc, -1 = desc

        // Format: -price
        if (cleanPart.startsWith('-')) {
            field = cleanPart.substring(1);
            direction = -1;
        } 
        // Format: price:desc or price:asc
        else if (cleanPart.includes(':')) {
            const [f, dir] = cleanPart.split(':');
            field = f.trim();
            if (dir.trim().toLowerCase() === 'desc' || dir.trim() === '-1') {
                direction = -1;
            }
        }

        const dbField = getDatabaseField(field);
        sortObj[dbField] = direction;
    });

    // Ensure we have at least one sorting field, fallback to OrderDate desc
    if (Object.keys(sortObj).length === 0) {
        sortObj['OrderDate'] = -1;
    }

    return sortObj;
};

module.exports = {
    getDatabaseField,
    parseSortParams
};
