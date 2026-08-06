const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const messages = await db.asyncAll('SELECT * FROM chat_messages ORDER BY id ASC');
        return res.json(messages);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch chat messages' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { sender, text } = req.body;
        if (!text) return res.status(400).json({ error: 'Message text is required' });

        const id = 'msg-' + Date.now();
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        await db.asyncRun(
            `INSERT INTO chat_messages (id, sender, text, time) VALUES (?, ?, ?, ?)`,
            [id, sender || 'Guest', text, time]
        );

        const created = await db.asyncGet('SELECT * FROM chat_messages WHERE id = ?', [id]);
        return res.status(201).json(created);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to send chat message' });
    }
});

module.exports = router;
