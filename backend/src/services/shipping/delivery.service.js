const Order = require('../../models/order.model');

// Supported carriers list
const CARRIERS = [
    { id: 'CARRIER001', name: 'Blue Dart', coverage: 'Domestic', maxWeight: '30kg', estimatedDays: '2-4', trackingUrl: 'https://www.bluedart.com/tracking' },
    { id: 'CARRIER002', name: 'DTDC',      coverage: 'Domestic', maxWeight: '50kg', estimatedDays: '3-5', trackingUrl: 'https://www.dtdc.in/tracking' },
    { id: 'CARRIER003', name: 'FedEx',     coverage: 'International', maxWeight: '68kg', estimatedDays: '3-7', trackingUrl: 'https://www.fedex.com/tracking' },
    { id: 'CARRIER004', name: 'DHL',       coverage: 'International', maxWeight: '70kg', estimatedDays: '3-6', trackingUrl: 'https://www.dhl.com/tracking' },
    { id: 'CARRIER005', name: 'Amazon Logistics', coverage: 'Domestic', maxWeight: '25kg', estimatedDays: '1-3', trackingUrl: 'https://track.amazon.in' },
    { id: 'CARRIER006', name: 'Delhivery', coverage: 'Domestic', maxWeight: '30kg', estimatedDays: '2-5', trackingUrl: 'https://www.delhivery.com/tracking' }
];

/**
 * Helper to build optional pagination options
 */
const getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 10));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

/**
 * Returns paginated list of pending/processing orders (not yet shipped)
 */
const getPendingShipmentsService = async (queryParams = {}) => {
    const { page, limit, skip } = getPagination(queryParams);
    const filter = {
        OrderStatus: { $in: ['Pending', 'Processing'] },
        isArchived: { $ne: true }
    };

    const [orders, total] = await Promise.all([
        Order.find(filter).sort({ OrderDate: 1 }).skip(skip).limit(limit).lean(),
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
 * Returns paginated list of delivered orders
 */
const getDeliveredShipmentsService = async (queryParams = {}) => {
    const { page, limit, skip } = getPagination(queryParams);
    const filter = {
        OrderStatus: 'Delivered',
        isArchived: { $ne: true }
    };

    if (queryParams.startDate || queryParams.endDate) {
        filter.updatedAt = {};
        if (queryParams.startDate) filter.updatedAt.$gte = new Date(queryParams.startDate);
        if (queryParams.endDate) filter.updatedAt.$lte = new Date(queryParams.endDate);
    }

    const [orders, total] = await Promise.all([
        Order.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
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
 * Returns paginated list of returned orders
 */
const getReturnedShipmentsService = async (queryParams = {}) => {
    const { page, limit, skip } = getPagination(queryParams);
    const filter = {
        OrderStatus: 'Returned',
        isArchived: { $ne: true }
    };

    const [orders, total] = await Promise.all([
        Order.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
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
 * Generates a shipping label for a given order.
 * Assigns a carrier, barcode, and formatted label payload.
 */
const createShippingLabelService = async (orderId, labelOptions = {}) => {
    const order = await Order.findOne({ OrderID: orderId }).lean();
    if (!order) return null;

    // Cannot create label for cancelled or already-delivered orders
    if (['Cancelled', 'Delivered'].includes(order.OrderStatus)) {
        return { cannotCreateLabel: true, status: order.OrderStatus };
    }

    // Select carrier from options or auto-assign
    const isInternational = order.Country && order.Country.toLowerCase() !== 'india';
    const preferredCarrierId = labelOptions.carrierId;
    let carrier;
    if (preferredCarrierId) {
        carrier = CARRIERS.find(c => c.id === preferredCarrierId);
        if (!carrier) throw new Error(`Carrier '${preferredCarrierId}' not found. Use GET /carriers to list options.`);
    } else {
        const domestic = CARRIERS.filter(c => c.coverage === 'Domestic');
        const international = CARRIERS.filter(c => c.coverage === 'International');
        const pool = isInternational ? international : domestic;
        const idx = order.OrderID.charCodeAt(order.OrderID.length - 1) % pool.length;
        carrier = pool[idx];
    }

    const barcode = `BC${order.OrderID.replace(/\D/g, '')}${Date.now().toString().slice(-6)}`;
    const trackingNumber = `${carrier.name.substring(0, 3).toUpperCase()}${order.OrderID}${Date.now().toString().slice(-4)}`;

    return {
        label: {
            labelId: `LBL-${order.OrderID}-${Date.now()}`,
            barcode,
            trackingNumber,
            carrier: carrier.name,
            carrierId: carrier.id,
            trackingUrl: `${carrier.trackingUrl}/${trackingNumber}`,
            generatedAt: new Date()
        },
        shipFrom: {
            name: `Seller ${order.SellerID}`,
            location: 'Fulfillment Center #12, Mumbai, Maharashtra, India'
        },
        shipTo: {
            name: order.CustomerName,
            city: order.City || 'N/A',
            state: order.State || 'N/A',
            country: order.Country || 'India'
        },
        order: {
            orderId: order.OrderID,
            product: order.ProductName,
            quantity: order.Quantity,
            totalAmount: order.TotalAmount
        }
    };
};

/**
 * Returns the list of all available shipping carriers
 */
const getCarriersService = async () => {
    return CARRIERS;
};

module.exports = {
    getPendingShipmentsService,
    getDeliveredShipmentsService,
    getReturnedShipmentsService,
    createShippingLabelService,
    getCarriersService
};
