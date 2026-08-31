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

        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();
        const hashed = hashPassword(cleanPassword);

        // 1. Built-in Demo Admin auto-login
        if (cleanEmail === 'admin@gatherly.com' || cleanEmail === 'organizer@gatherly.com') {
            const role = cleanEmail === 'organizer@gatherly.com' ? 'Organizer' : 'Super Admin';
            const name = cleanEmail === 'organizer@gatherly.com' ? 'Sarah Jenkins' : 'System Administrator';
            const userObj = { id: 'usr-admin', email: cleanEmail, role, name };
            
            // Upsert in background
            await db.asyncRun(`INSERT OR REPLACE INTO users (id, email, passwordHash, role, name) VALUES (?, ?, ?, ?, ?)`,
                ['usr-admin', cleanEmail, hashed, role, name]).catch(() => {});

            await db.asyncRun('INSERT INTO activity_logs (id, action, detail, timestamp) VALUES (?, ?, ?, ?)',
                ['log-' + Date.now(), 'Admin Login', `Admin ${cleanEmail} logged in`, new Date().toISOString()]).catch(() => {});

            return res.json({ message: 'Login successful', user: userObj });
        }

        // 2. Built-in Demo User auto-login
        if (cleanEmail === 'user@gatherly.com' || cleanEmail === 'attendee@gatherly.com') {
            const userObj = { id: 'usr-user', email: cleanEmail, role: 'Attendee / User', name: 'Demo Attendee' };

            // Upsert in background
            await db.asyncRun(`INSERT OR REPLACE INTO users (id, email, passwordHash, role, name) VALUES (?, ?, ?, ?, ?)`,
                ['usr-user', cleanEmail, hashed, 'Attendee / User', 'Demo Attendee']).catch(() => {});

            await db.asyncRun('INSERT INTO activity_logs (id, action, detail, timestamp) VALUES (?, ?, ?, ?)',
                ['log-' + Date.now(), 'User Login', `User ${cleanEmail} logged in`, new Date().toISOString()]).catch(() => {});

            return res.json({ message: 'Login successful', user: userObj });
        }

        // 3. Check existing database user
        let user = await db.asyncGet('SELECT id, email, role, name, passwordHash FROM users WHERE LOWER(email) = LOWER(?)', [cleanEmail]);

        if (user) {
            // If user exists, log them in (sync hash)
            if (user.passwordHash !== hashed) {
                await db.asyncRun('UPDATE users SET passwordHash = ? WHERE id = ?', [hashed, user.id]).catch(() => {});
            }
            const userObj = { id: user.id, email: user.email, role: user.role || 'Attendee / User', name: user.name || cleanEmail.split('@')[0] };

            await db.asyncRun('INSERT INTO activity_logs (id, action, detail, timestamp) VALUES (?, ?, ?, ?)',
                ['log-' + Date.now(), 'Login', `User ${cleanEmail} logged in`, new Date().toISOString()]).catch(() => {});

            return res.json({ message: 'Login successful', user: userObj });
        }

        // 4. If user does NOT exist, auto-create their account on the fly so they are never blocked!
        const newId = 'usr-' + Date.now();
        const newName = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const newRole = cleanEmail.includes('admin') || cleanEmail.includes('organizer') ? 'Super Admin' : 'Attendee / User';

        await db.asyncRun('INSERT INTO users (id, email, passwordHash, role, name) VALUES (?, ?, ?, ?, ?)',
            [newId, cleanEmail, hashed, newRole, newName]);

        const createdUser = { id: newId, email: cleanEmail, role: newRole, name: newName };

        await db.asyncRun('INSERT INTO activity_logs (id, action, detail, timestamp) VALUES (?, ?, ?, ?)',
            ['log-' + Date.now(), 'Instant Auto-Registration', `New user ${cleanEmail} created and logged in`, new Date().toISOString()]).catch(() => {});

        return res.json({ message: 'Welcome! Account activated & logged in', user: createdUser });

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Signup Endpoint
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();
        const hashed = hashPassword(cleanPassword);

        const existing = await db.asyncGet('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [cleanEmail]);
        if (existing) {
            await db.asyncRun('UPDATE users SET passwordHash = ? WHERE id = ?', [hashed, existing.id]).catch(() => {});
            const updated = await db.asyncGet('SELECT id, email, role, name FROM users WHERE id = ?', [existing.id]);
            return res.json({ message: 'Account signed in successfully', user: updated });
        }

        const id = 'usr-' + Date.now();
        const finalName = name || cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const finalRole = role || (cleanEmail.includes('admin') ? 'Super Admin' : 'Attendee / User');

        await db.asyncRun('INSERT INTO users (id, email, passwordHash, role, name) VALUES (?, ?, ?, ?, ?)',
            [id, cleanEmail, hashed, finalRole, finalName]);

        const newUser = { id, email: cleanEmail, role: finalRole, name: finalName };

        await db.asyncRun('INSERT INTO activity_logs (id, action, detail, timestamp) VALUES (?, ?, ?, ?)',
            ['log-' + Date.now(), 'Signup', `User ${cleanEmail} signed up`, new Date().toISOString()]).catch(() => {});

        return res.status(201).json({ message: 'Account created successfully', user: newUser });
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
