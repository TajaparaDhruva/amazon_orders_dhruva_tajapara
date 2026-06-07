/**
 * Express middleware factory for parsing and validating requests using a validator function.
 * Adds the validation errors array to the `req.validationErrors` property.
 * @param {Function} validatorFn - The validator function from utils/validators.js
 * @returns {Function} Express middleware handler
 */
const validate = (validatorFn) => {
    return (req, res, next) => {
        const data = req.body || {};
        const errors = validatorFn(data);
        req.validationErrors = errors || [];
        next();
    };
};

module.exports = { validate };
