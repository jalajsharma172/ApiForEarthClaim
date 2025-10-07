const { getAllTokens } = require('../services/tokenService');

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow GET method
    if (req.method !== 'GET') {
        return res.status(405).json({ 
            success: false,
            error: 'Method Not Allowed',
            allowedMethods: ['GET']
        });
    }

    try {
        console.log('📋 GET /api/tokens - Fetching all tokens...');
        
        const result = await getAllTokens();

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data,
                count: result.data ? result.data.length : 0
            });
        } else {
            return res.status(500).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }
    } catch (error) {
        console.error('🚨 GET /api/tokens error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};