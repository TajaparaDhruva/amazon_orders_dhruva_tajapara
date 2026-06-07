/**
 * Email format validator
 */
const isValidEmail = (email) => {
    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase());
};

/**
 * Password strength validator (min 6 chars)
 */
const isValidPassword = (password) => {
    return typeof password === 'string' && password.length >= 6;
};

/**
 * Validate Order Creation payload
 */
const validateOrderCreation = (data) => {
    const errors = [];
    if (!data.OrderID || typeof data.OrderID !== 'string') errors.push('OrderID is required and must be a string.');
    if (!data.CustomerName || typeof data.CustomerName !== 'string') errors.push('CustomerName is required.');
    if (!data.ProductName || typeof data.ProductName !== 'string') errors.push('ProductName is required.');
    if (data.Quantity === undefined || typeof data.Quantity !== 'number' || data.Quantity <= 0) {
        errors.push('Quantity must be a positive number.');
    }
    if (data.UnitPrice === undefined || typeof data.UnitPrice !== 'number' || data.UnitPrice < 0) {
        errors.push('UnitPrice must be a non-negative number.');
    }
    if (data.TotalAmount === undefined || typeof data.TotalAmount !== 'number') {
        errors.push('TotalAmount is required.');
    } else if (data.Quantity && data.UnitPrice && data.TotalAmount !== (data.Quantity * data.UnitPrice)) {
        errors.push(`TotalAmount mismatch. Calculated: ${data.Quantity * data.UnitPrice}, Provided: ${data.TotalAmount}`);
    }
    if (data.OrderDate && isNaN(Date.parse(data.OrderDate))) {
        errors.push('OrderDate is not a valid date string.');
    }
    return errors;
};

/**
 * Validate Order Update payload
 */
const validateOrderUpdate = (data) => {
    const errors = [];
    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

    if (data.OrderStatus && !allowedStatuses.includes(data.OrderStatus)) {
        errors.push(`OrderStatus must be one of: ${allowedStatuses.join(', ')}`);
    }
    if (data.Quantity !== undefined && (typeof data.Quantity !== 'number' || data.Quantity <= 0)) {
        errors.push('Quantity must be a positive number.');
    }
    if (data.TotalAmount !== undefined && (typeof data.TotalAmount !== 'number' || data.TotalAmount < 0)) {
        errors.push('TotalAmount must be a non-negative number.');
    }
    return errors;
};

/**
 * Validate Payment Transaction payload
 */
const validatePayment = (data) => {
    const errors = [];
    const allowedMethods = ['Card', 'UPI', 'NetBanking', 'COD', 'Wallet'];

    if (!data.transactionId) errors.push('transactionId is required.');
    if (data.amount === undefined || typeof data.amount !== 'number' || data.amount <= 0) {
        errors.push('amount must be a positive number.');
    }
    if (!data.paymentMethod || !allowedMethods.includes(data.paymentMethod)) {
        errors.push(`paymentMethod must be one of: ${allowedMethods.join(', ')}`);
    }
    if (data.currency && typeof data.currency !== 'string') {
        errors.push('currency must be a string (e.g. INR, USD).');
    }
    return errors;
};

/**
 * Validate Shipping/Billing Address
 */
const validateAddress = (data) => {
    const errors = [];
    if (!data.receiverName || typeof data.receiverName !== 'string') errors.push('receiverName is required.');
    if (!data.street || typeof data.street !== 'string') errors.push('street is required.');
    if (!data.city || typeof data.city !== 'string') errors.push('city is required.');
    if (!data.state || typeof data.state !== 'string') errors.push('state is required.');
    if (!data.postalCode || typeof data.postalCode !== 'string' || data.postalCode.length < 3) {
        errors.push('postalCode is required and must be a valid zip code.');
    }
    if (!data.country || typeof data.country !== 'string') errors.push('country is required.');
    return errors;
};

/**
 * Validate Auth Register payload
 */
const validateRegister = (data) => {
    const errors = [];
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Name is required.');
    }
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('A valid email address is required.');
    }
    if (!data.password || !isValidPassword(data.password)) {
        errors.push('Password is required and must be at least 6 characters.');
    }
    if (data.role && !['user', 'seller', 'admin'].includes(data.role)) {
        errors.push("Role must be 'user', 'seller', or 'admin'.");
    }
    return errors;
};

/**
 * Validate Auth Login payload
 */
const validateLogin = (data) => {
    const errors = [];
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('A valid email address is required.');
    }
    if (!data.password) {
        errors.push('Password is required.');
    }
    return errors;
};

/**
 * Validate Catalog Product details
 */
const validateProduct = (data) => {
    const errors = [];
    if (!data.sku || typeof data.sku !== 'string') errors.push('Product SKU is required.');
    if (!data.title || typeof data.title !== 'string') errors.push('Product Title is required.');
    if (data.price === undefined || typeof data.price !== 'number' || data.price <= 0) {
        errors.push('Product price must be a positive number.');
    }
    if (data.stock === undefined || typeof data.stock !== 'number' || data.stock < 0) {
        errors.push('Product stock must be a non-negative number.');
    }
    return errors;
};

/**
 * Validate Refund Request
 */
const validateRefund = (data) => {
    const errors = [];
    if (!data.orderId) errors.push('orderId is required.');
    if (data.refundAmount === undefined || typeof data.refundAmount !== 'number' || data.refundAmount <= 0) {
        errors.push('refundAmount must be a positive number.');
    }
    if (!data.reason || typeof data.reason !== 'string' || data.reason.trim().length === 0) {
        errors.push('Refund reason is required.');
    }
    return errors;
};

/**
 * Validate Coupon code applicability
 */
const validateCoupon = (data) => {
    const errors = [];
    if (!data.code || typeof data.code !== 'string') errors.push('Coupon code is required.');
    if (data.cartValue === undefined || typeof data.cartValue !== 'number' || data.cartValue <= 0) {
        errors.push('cartValue must be a positive number.');
    }
    return errors;
};

/**
 * Validate File Upload metadata
 */
const validateUpload = (data) => {
    const errors = [];
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/csv'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    if (!data.filename) errors.push('filename is required.');
    if (!data.mimeType || !allowedMimeTypes.includes(data.mimeType)) {
        errors.push(`mimeType must be one of: ${allowedMimeTypes.join(', ')}`);
    }
    if (data.fileSize === undefined || typeof data.fileSize !== 'number' || data.fileSize <= 0) {
        errors.push('fileSize must be a positive number of bytes.');
    } else if (data.fileSize > maxFileSize) {
        errors.push('fileSize exceeds the maximum limit of 10MB.');
    }
    return errors;
};

module.exports = {
    validateOrderCreation,
    validateOrderUpdate,
    validatePayment,
    validateAddress,
    validateRegister,
    validateLogin,
    validateProduct,
    validateRefund,
    validateCoupon,
    validateUpload
};
