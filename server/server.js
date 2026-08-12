const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS middleware to connect frontend & backend
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Import Database connection
require('./db');

// Healthcheck Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Gatherly Express SQLite API active' });
});

// Mounting Sub-Routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/venues', require('./routes/venues'));
app.use('/api/attendees', require('./routes/attendees'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/finance', require('./routes/finance'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/email', require('./routes/email'));

// Serve static files from React client build directory
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Catch-all route handler for unknown API endpoints
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API Endpoint not found' });
});

// React SPA fallback handler for non-API routes
app.get('*', (req, res) => {
    const indexPath = path.join(clientDistPath, 'index.html');
    if (require('fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).json({ error: 'Page not found' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gatherly Backend Server running on http://0.0.0.0:${PORT}`);
});
