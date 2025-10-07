const { insertTokenData } = require('../services/tokenService');

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST method
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false,
            error: 'Method Not Allowed',
            allowedMethods: ['POST']
        });
    }

    try {
        console.log('📝 POST /api/token - Processing request...');
        const { recipient, tokenURI, tokenId } = req.body;

        // Basic validation
        if (!recipient || !tokenURI || !tokenId) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: [
                    ...((!recipient) ? [{ field: 'recipient', message: 'Recipient is required' }] : []),
                    ...((!tokenURI) ? [{ field: 'tokenURI', message: 'Token URI is required' }] : []),
                    ...((!tokenId) ? [{ field: 'tokenId', message: 'Token ID is required' }] : [])
                ]
            });
        }

        console.log('📦 Received token data:', { recipient, tokenURI, tokenId });

        const result = await insertTokenData({
            recipient,
            tokenURI,
            tokenId
        });

        console.log('💾 Database result:', result);

        if (result.success) {
            console.log('✅ Token inserted successfully');
            return res.status(201).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } else {
            console.log('❌ Token insertion failed:', result.error);
            return res.status(500).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }
    } catch (error) {
        console.error('🚨 POST /api/token error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};