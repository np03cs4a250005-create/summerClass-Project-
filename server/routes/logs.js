const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const logs = await db.asyncAll('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 50');
        return res.json(logs);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch activity logs' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { action, detail } = req.body;
        const id = 'log-' + Date.now();
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

        await db.asyncRun(`INSERT INTO activity_logs (id, action, detail, timestamp) VALUES (?, ?, ?, ?)`,
            [id, action, detail, timestamp]);

        const created = await db.asyncGet('SELECT * FROM activity_logs WHERE id = ?', [id]);
        return res.status(201).json(created);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to record activity log' });
    }
});

module.exports = router;
