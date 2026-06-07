const express = require('express');
const router = express.Router();

const { handleValidationResult } = require('../controllers/validation/validation.controller');
const { validate } = require('../middlewares/validation.middleware');
const {
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
} = require('../utils/validators');

// POST /api/v1/validate/order
router.post('/order', validate(validateOrderCreation), handleValidationResult);

// PATCH /api/v1/validate/order/:id
router.patch('/order/:id', validate(validateOrderUpdate), handleValidationResult);

// POST /api/v1/validate/payment
router.post('/payment', validate(validatePayment), handleValidationResult);

// POST /api/v1/validate/address
router.post('/address', validate(validateAddress), handleValidationResult);

// POST /api/v1/validate/auth/register
router.post('/auth/register', validate(validateRegister), handleValidationResult);

// POST /api/v1/validate/auth/login
router.post('/auth/login', validate(validateLogin), handleValidationResult);

// POST /api/v1/validate/product
router.post('/product', validate(validateProduct), handleValidationResult);

// POST /api/v1/validate/refund
router.post('/refund', validate(validateRefund), handleValidationResult);

// POST /api/v1/validate/coupon
router.post('/coupon', validate(validateCoupon), handleValidationResult);

// POST /api/v1/validate/upload
router.post('/upload', validate(validateUpload), handleValidationResult);

module.exports = router;
