const supabase = require('../config/supabase');

/**
 * Insert token data into the database
 * @param {Object} tokenData - The token data to insert
 * @param {string} tokenData.recipient - The recipient address
 * @param {string} tokenData.tokenURI - The token URI
 * @param {string} tokenData.tokenId - The token ID
 * @returns {Promise<Object>} The inserted data or error
 */
async function insertTokenData(tokenData) {
    try {
        const { recipient, tokenURI, tokenId } = tokenData;
        
        const { data, error } = await supabase
            .from('Tokens')
            .insert([
                {
                    recipient: recipient,
                    tokenURI: tokenURI, // Note: using snake_case for database column
                    tokenId: tokenId    // Note: using snake_case for database column
                }
            ])
            .select();

        if (error) {
            console.error('Database error:', error);
            throw new Error(`Database error: ${error.message}`);
        }

        return {
            success: true,
            data: data[0],
            message: 'Token data inserted successfully'
        };
    } catch (error) {
        console.error('Insert token data error:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to insert token data'
        };
    }
}

/**
 * Get all tokens from the database
 * @returns {Promise<Object>} All token records or error
 */
async function getAllTokens() {
    try {
        const { data, error } = await supabase
            .from('tokens')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Database error:', error);
            throw new Error(`Database error: ${error.message}`);
        }

        return {
            success: true,
            data: data,
            message: 'Tokens retrieved successfully'
        };
    } catch (error) {
        console.error('Get all tokens error:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to retrieve tokens'
        };
    }
}

/**
 * Get token by ID
 * @param {string} id - The token record ID
 * @returns {Promise<Object>} The token record or error
 */
async function getTokenById(id) {
    try {
        const { data, error } = await supabase
            .from('tokens')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Database error:', error);
            throw new Error(`Database error: ${error.message}`);
        }

        return {
            success: true,
            data: data,
            message: 'Token retrieved successfully'
        };
    } catch (error) {
        console.error('Get token by ID error:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to retrieve token'
        };
    }
}

module.exports = {
    insertTokenData,
    getAllTokens,
    getTokenById
};