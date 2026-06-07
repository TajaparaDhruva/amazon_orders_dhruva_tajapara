const Order = require('../../models/order.model');

/**
 * Gets detailed shipment tracking milestones, carrier info, and current status.
 */
const getShipmentTrackingService = async (orderId) => {
    const order = await Order.findOne({ OrderID: orderId }).lean();
    if (!order) return null;

    // Carrier assignment based on seller or order hash
    const carriers = ['DHL Express', 'FedEx', 'UPS', 'Blue Dart', 'Amazon Logistics'];
    const carrierIndex = (order.OrderID.charCodeAt(0) + order.OrderID.charCodeAt(order.OrderID.length - 1)) % carriers.length;
    const carrier = carriers[carrierIndex];

    // Tracking number generation
    const trackingNo = `TRK${order.OrderID}${order.OrderDate.getTime().toString().slice(-6)}`;

    // Build milestones depending on current status
    const statusSequence = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentStatusIndex = statusSequence.indexOf(order.OrderStatus);

    const milestones = [
        {
            stage: 'Order Placed',
            location: 'Warehouse Hub',
            timestamp: order.OrderDate,
            completed: true,
            description: 'Your order has been placed and received.'
        },
        {
            stage: 'Processing',
            location: 'Fulfillment Center',
            timestamp: order.createdAt,
            completed: currentStatusIndex >= 1 || order.OrderStatus === 'Returned' || order.OrderStatus === 'Cancelled',
            description: 'Order is being packed and prepared for shipment.'
        },
        {
            stage: 'Shipped',
            location: 'Carrier Facility',
            timestamp: currentStatusIndex >= 2 ? order.updatedAt : null,
            completed: currentStatusIndex >= 2,
            description: `Parcel received by carrier (${carrier}).`
        },
        {
            stage: 'In Transit',
            location: order.City ? `${order.City} Hub` : 'Delivery Network',
            timestamp: currentStatusIndex >= 2 ? new Date(order.updatedAt.getTime() + 12 * 60 * 60 * 1000) : null,
            completed: currentStatusIndex >= 2,
            description: 'Package is in transit to destination facility.'
        },
        {
            stage: 'Delivered',
            location: order.City ? `${order.City}, ${order.State}` : 'Customer Address',
            timestamp: currentStatusIndex >= 3 ? order.updatedAt : null,
            completed: currentStatusIndex >= 3,
            description: 'Package delivered successfully.'
        }
    ];

    // If cancelled or returned, adjust milestones
    if (order.OrderStatus === 'Cancelled') {
        milestones.push({
            stage: 'Cancelled',
            location: 'System Hub',
            timestamp: order.updatedAt,
            completed: true,
            description: 'Order was cancelled.'
        });
    } else if (order.OrderStatus === 'Returned') {
        milestones.push({
            stage: 'Returned',
            location: 'Fulfillment Center',
            timestamp: order.updatedAt,
            completed: true,
            description: 'Returned item received and processed.'
        });
    }

    return {
        orderId: order.OrderID,
        status: order.OrderStatus,
        carrier,
        trackingNumber: trackingNo,
        origin: 'Fulfillment Center #12 (Mumbai)',
        destination: {
            city: order.City || 'Unknown',
            state: order.State || 'Unknown',
            country: order.Country || 'Unknown'
        },
        lastUpdated: order.updatedAt,
        milestones
    };
};

/**
 * Calculates estimated delivery date, shipping type, and delivery cost breakdown.
 */
const getDeliveryEstimateService = async (orderId) => {
    const order = await Order.findOne({ OrderID: orderId }).lean();
    if (!order) return null;

    // Delivery duration calculation depending on destination
    let transitDays = 3; // Default within Gujarat
    let shippingTier = 'Standard Shipping';

    const cleanState = (order.State || '').toLowerCase();
    const cleanCountry = (order.Country || '').toLowerCase();

    if (cleanCountry && cleanCountry !== 'india') {
        transitDays = 10;
        shippingTier = 'International Priority';
    } else if (cleanState && cleanState !== 'gujarat') {
        transitDays = 6;
        shippingTier = 'Express Domestic';
    }

    const estimatedDeliveryDate = new Date(order.OrderDate);
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + transitDays);

    return {
        orderId: order.OrderID,
        shippingTier,
        transitDays,
        estimatedDeliveryDate,
        shippingCost: order.ShippingCost || 0,
        carrierAssignment: order.TotalAmount > 5000 ? 'Express Priority Courier' : 'Standard Parcel Post',
        destination: {
            city: order.City || 'Unknown',
            state: order.State || 'Unknown',
            country: order.Country || 'Unknown'
        }
    };
};

module.exports = {
    getShipmentTrackingService,
    getDeliveryEstimateService
};
