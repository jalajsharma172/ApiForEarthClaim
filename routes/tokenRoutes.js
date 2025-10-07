const express = require('express');
const router = express.Router();
const { validateTokenData, handleValidationErrors } = require('../middleware/validation');
const { insertTokenData, getAllTokens, getTokenById } = require('../services/tokenService');

/**
 * POST /api/tokens
 * Create a new token record
 */
router.post('/tokens', validateTokenData, handleValidationErrors, async (req, res) => {
    try {
        const { recipient, tokenURI, tokenId } = req.body;
        
        const result = await insertTokenData({
            recipient,
            tokenURI,
            tokenId
        });

        if (result.success) {
            res.status(201).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } else {
            res.status(500).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }
    } catch (error) {
        console.error('POST /tokens error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

/**
 * GET /api/tokens
 * Get all token records
 */
router.get('/tokens', async (req, res) => {
    try {
        const result = await getAllTokens();

        if (result.success) {
            res.status(200).json({
                success: true,
                message: result.message,
                data: result.data,
                count: result.data.length
            });
        } else {
            res.status(500).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }
    } catch (error) {
        console.error('GET /tokens error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

/**
 * GET /api/tokens/:id
 * Get a specific token record by ID
 */
router.get('/tokens/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid token ID'
            });
        }

        const result = await getTokenById(id);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } else {
            res.status(404).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }
    } catch (error) {
        console.error('GET /tokens/:id error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

module.exports = router;