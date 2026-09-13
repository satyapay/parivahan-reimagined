const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Parivahan Reimagined Backend API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        database: process.env.SUPABASE_URL ? 'Connected to Supabase PostgreSQL' : 'Memory/State Engine Active'
    });
});

// API Routes Mount
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/licenses', require('./routes/licenses'));
app.use('/api/transfers', require('./routes/transfers'));
app.use('/api/challans', require('./routes/challans'));
app.use('/api/services', require('./routes/services'));
app.use('/api/chat', require('./routes/chat'));

// Serve Static Frontend
app.use(express.static(path.join(__dirname, '..')));

app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`=======================================================`);
        console.log(`🚀 Parivahan Reimagined Server running at http://localhost:${PORT}`);
        console.log(`📡 API Endpoints live at http://localhost:${PORT}/api/health`);
        console.log(`=======================================================`);
    });
}

module.exports = app;
