const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { validateTokenData, handleValidationErrors } = require('../middleware/validation');
const { insertTokenData, getAllTokens, getTokenById } = require('../services/tokenService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    console.log('Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
    }
    next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// GET route at root - serve the HTML page
app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).json({ success: false, message: 'Error serving home page' });
    }
});

// POST /api/token - Create new token record (MAIN ENDPOINT)
app.post('/api/token', handleValidationErrors, async (req, res) => {
    try {
        console.log('📝 POST /api/token - Processing request...');
        const { recipient, tokenURI, tokenId } = req.body;
        
        console.log('📦 Received token data:', { recipient, tokenURI, tokenId });
        
        const result = await insertTokenData({
            recipient,
            tokenURI,
            tokenId
        });

        console.log('💾 Database result:', result);

        if (result.success) {
            console.log('✅ Token inserted successfully');
            res.status(201).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } else {
            console.log('❌ Token insertion failed:', result.error);
            res.status(500).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }
    } catch (error) {
        console.error('🚨 POST /api/token error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET /api/tokens - Get all token records
app.get('/api/tokens', async (req, res) => {
    try {
        console.log('📋 GET /api/tokens - Fetching all tokens...');
        const result = await getAllTokens();

        if (result.success) {
            res.status(200).json({
                success: true,
                message: result.message,
                data: result.data,
                count: result.data ? result.data.length : 0
            });
        } else {
            res.status(500).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }
    } catch (error) {
        console.error('🚨 GET /api/tokens error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET /api/tokens/:id - Get token by ID
app.get('/api/tokens/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔍 GET /api/tokens/${id} - Fetching token...`);
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid token ID provided'
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
        console.error('🚨 GET /api/tokens/:id error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Test route to debug routing
app.all('/api/*', (req, res, next) => {
    console.log(`🔧 API Route Debug: ${req.method} ${req.originalUrl}`);
    next();
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    console.log(`❌ API Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: 'API route not found',
        path: req.originalUrl,
        method: req.method,
        availableAPIRoutes: [
            'POST /api/token - Insert new token',
            'GET /api/tokens - Get all tokens', 
            'GET /api/tokens/:id - Get token by ID'
        ]
    });
});

// General 404 handler
app.use('*', (req, res) => {
    console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        availableRoutes: [
            'GET / - Home page',
            'POST /api/token - Insert new token',
            'GET /api/tokens - Get all tokens',
            'GET /api/tokens/:id - Get token by ID'
        ]
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('🚨 Global error handler:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Enable CORS for the home page handler
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Handle preflight request for the home page
app.options('/', (req, res) => {
    res.status(200).end();
});

// Only allow GET method for the home page
app.get('/', (req, res) => {
    // Serve the HTML home page
    const htmlPath = path.join(process.cwd(), 'public', 'index.html');
    fs.readFile(htmlPath, 'utf8', (err, htmlContent) => {
        if (err) {
            console.error('Error serving home page:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error serving home page',
                error: err.message
            });
        }
        
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(htmlContent);
    });
});

module.exports = app;