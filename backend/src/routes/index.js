const express = require('express');
const router = express.Router();

// Base health-check route
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Amazon Orders API is up and running!'
    });
});

module.exports = router;
