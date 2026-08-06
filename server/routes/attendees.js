const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const attendees = await db.asyncAll('SELECT * FROM attendees ORDER BY name ASC');
        return res.json(attendees);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch attendees' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

        const id = 'att-' + Date.now();
        const avatar = name.charAt(0).toUpperCase();

        await db.asyncRun(
            `INSERT INTO attendees (id, name, email, phone, avatar, status, emergencyContact) VALUES (?, ?, ?, ?, ?, 'Approved', 'N/A')`,
            [id, name, email, phone || '', avatar]
        );

        const created = await db.asyncGet('SELECT * FROM attendees WHERE id = ?', [id]);
        return res.status(201).json(created);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to add attendee' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.asyncRun('DELETE FROM attendees WHERE id = ?', [req.params.id]);
        return res.json({ message: 'Attendee deleted' });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to delete attendee' });
    }
});

module.exports = router;
