const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const list = await db.asyncAll('SELECT * FROM feedback');
        return res.json(list);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { attendeeName, rating, comment } = req.body;
        const id = 'fb-' + Date.now();

        await db.asyncRun(
            `INSERT INTO feedback (id, attendeeName, rating, comment) VALUES (?, ?, ?, ?)`,
            [id, attendeeName || 'Anonymous', rating || 5, comment || '']
        );

        const created = await db.asyncGet('SELECT * FROM feedback WHERE id = ?', [id]);
        return res.status(201).json(created);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

router.post('/:id/reply', async (req, res) => {
    try {
        const { reply } = req.body;
        await db.asyncRun(`UPDATE feedback SET reply = ? WHERE id = ?`, [reply, req.params.id]);
        const updated = await db.asyncGet('SELECT * FROM feedback WHERE id = ?', [req.params.id]);
        return res.json(updated);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to reply to feedback' });
    }
});

module.exports = router;
