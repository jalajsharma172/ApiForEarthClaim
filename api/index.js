    const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const tokenRoutes = require('../routes/tokenRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Home route - serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Token API is running on Vercel!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        endpoints: {
            'POST /api/': 'Create a new token record',
            'GET /api/tokens': 'Get all token records',
            'GET /api/tokens/:id': 'Get a specific token record'
        }
    });
});

// API routes
app.use('/api', tokenRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
        availableRoutes: [
            'GET /',
            'GET /health', 
            'POST /api/',
            'GET /api/tokens',
            'GET /api/tokens/:id'
        ]
    });
});

module.exports = app;