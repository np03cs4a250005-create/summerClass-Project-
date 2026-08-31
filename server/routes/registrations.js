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
        const { eventId, attendeeId, attendeeName, email, phone, ticketId, ticketType, ticketName, amount, quantity } = req.body;
        const id = req.body.id || 'reg-' + Date.now();
        const totalAmt = Number(amount) || 0;
        let finalAttId = attendeeId;

        // If attendee details provided, ensure they exist in attendees table
        if (attendeeName && email) {
            const existing = await db.asyncGet('SELECT * FROM attendees WHERE email = ?', [email]);
            if (existing) {
                finalAttId = existing.id;
            } else {
                finalAttId = 'att-' + Date.now();
                await db.asyncRun(
                    `INSERT INTO attendees (id, name, email, phone, avatar, status, emergencyContact) VALUES (?, ?, ?, ?, ?, 'Approved', 'N/A')`,
                    [finalAttId, attendeeName, email, phone || '', attendeeName.charAt(0).toUpperCase()]
                );
            }
        }

        // Insert confirmed registration with paid status so finance picks up revenue
        await db.asyncRun(
            `INSERT INTO registrations (id, eventId, attendeeId, ticketId, status, paid, amount) VALUES (?, ?, ?, ?, 'Confirmed', 1, ?)`,
            [id, eventId || 'ev-1', finalAttId || 'att-guest', ticketId || '', totalAmt]
        );

        // If ticketId provided, decrement ticket capacity
        if (ticketId) {
            await db.asyncRun(`UPDATE tickets SET capacity = MAX(0, capacity - ?) WHERE id = ?`, [Number(quantity) || 1, ticketId]);
        }

        // Record Activity Log
        const guestName = attendeeName || 'Guest';
        await db.asyncRun(
            `INSERT INTO activity_logs (id, action, detail, timestamp) VALUES (?, ?, ?, ?)`,
            ['log-' + Date.now(), 'Ticket Reserved', `${guestName} reserved ${ticketType || 'Pass'} ($${totalAmt})`, new Date().toISOString()]
        );

        const created = await db.asyncGet('SELECT * FROM registrations WHERE id = ?', [id]);
        return res.status(201).json(created);
    } catch (err) {
        console.error('Registration submit error:', err);
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
