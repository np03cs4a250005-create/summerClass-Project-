const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const regs = await db.asyncAll(`
            SELECT r.*, a.name as attendeeName, a.email as attendeeEmail, e.name as eventName 
            FROM registrations r
            LEFT JOIN attendees a ON r.attendeeId = a.id
            LEFT JOIN events e ON r.eventId = e.id
            ORDER BY r.createdAt DESC
        `);
        const formatted = regs.map(r => ({
            ...r,
            paid: Boolean(r.paid)
        }));
        return res.json(formatted);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch registrations' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { eventId, attendeeId, ticketId, amount } = req.body;
        const id = 'reg-' + Date.now();

        await db.asyncRun(
            `INSERT INTO registrations (id, eventId, attendeeId, ticketId, status, paid, amount) VALUES (?, ?, ?, ?, 'Pending', 0, ?)`,
            [id, eventId, attendeeId, ticketId || '', amount || 0]
        );

        const created = await db.asyncGet('SELECT * FROM registrations WHERE id = ?', [id]);
        return res.status(201).json(created);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to submit registration' });
    }
});

router.patch('/:id/approve', async (req, res) => {
    try {
        await db.asyncRun(
            `UPDATE registrations SET status = 'Confirmed', paid = 1 WHERE id = ?`,
            [req.params.id]
        );
        const updated = await db.asyncGet('SELECT * FROM registrations WHERE id = ?', [req.params.id]);
        return res.json(updated);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to approve registration' });
    }
});

module.exports = router;
