/**
 * Handles responses for all validation sandbox endpoints.
 * Assumes `req.validationErrors` is populated by the validation middleware.
 */
const handleValidationResult = (req, res) => {
    const errors = req.validationErrors || [];

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed.',
            errors
        });
    }

    return res.status(200).json({
        success: true,
        message: 'Validation passed successfully.',
        data: req.body
    });
};

module.exports = {
    handleValidationResult
};
