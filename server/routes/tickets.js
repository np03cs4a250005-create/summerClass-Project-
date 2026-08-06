const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const tickets = await db.asyncAll('SELECT * FROM tickets');
        return res.json(tickets);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { eventId, name, type, price, capacity } = req.body;
        const id = 'tkt-' + Date.now();
        const qrCode = 'QR-EV-' + Date.now().toString().slice(-4);

        await db.asyncRun(
            `INSERT INTO tickets (id, eventId, name, type, price, capacity, qrCode) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, eventId || 'ev-1', name, type, price || 0, capacity || 100, qrCode]
        );

        const created = await db.asyncGet('SELECT * FROM tickets WHERE id = ?', [id]);
        return res.status(201).json(created);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to create ticket tier' });
    }
});

module.exports = router;
