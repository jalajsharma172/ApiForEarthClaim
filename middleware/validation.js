const { body, validationResult } = require('express-validator');

// Validation rules for token data
const validateTokenData = [
    body('recipient')
        .notEmpty()
        .withMessage('Recipient is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('Recipient must be between 1 and 255 characters'),
    
    body('tokenURI')
        .notEmpty()
        .withMessage('TokenURI is required')
        .isURL({ protocols: ['http', 'https'] })
        .withMessage('TokenURI must be a valid URL'),
    
    body('tokenId')
        .notEmpty()
        .withMessage('TokenId is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('TokenId must be between 1 and 255 characters')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

module.exports = {
    validateTokenData,
    handleValidationErrors
};