const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const router = express.Router();

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Login Endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const hashed = hashPassword(password);
        const user = await db.asyncGet('SELECT id, email, role, name FROM users WHERE LOWER(email) = LOWER(?) AND passwordHash = ?', [email, hashed]);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create log
        await db.asyncRun('INSERT INTO activity_logs (id, action, detail, timestamp) VALUES (?, ?, ?, ?)',
            ['log-' + Date.now(), 'Login', `User ${user.email} logged in`, new Date().toISOString()]);

        return res.json({ message: 'Login successful', user });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Signup Endpoint
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const existing = await db.asyncGet('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [email]);
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const id = 'usr-' + Date.now();
        const hashed = hashPassword(password);
        const name = email.split('@')[0];
        const role = 'Admin';

        await db.asyncRun('INSERT INTO users (id, email, passwordHash, role, name) VALUES (?, ?, ?, ?, ?)',
            [id, email, hashed, role, name]);

        const newUser = { id, email, role, name };

        await db.asyncRun('INSERT INTO activity_logs (id, action, detail, timestamp) VALUES (?, ?, ?, ?)',
            ['log-' + Date.now(), 'Signup', `User ${email} signed up`, new Date().toISOString()]);

        return res.status(201).json({ message: 'Account created successfully', user: newUser });
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
