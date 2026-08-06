const express = require('express');
const db = require('../db');
const router = express.Router();

// Tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await db.asyncAll('SELECT * FROM tasks');
        const agenda = await db.asyncAll('SELECT * FROM agenda');
        return res.json({ tasks, agenda });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch tasks/agenda' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, assignee } = req.body;
        const id = 'tsk-' + Date.now();

        await db.asyncRun(
            `INSERT INTO tasks (id, title, assignee, progress, completed) VALUES (?, ?, ?, 0, 0)`,
            [id, title, assignee || 'Staff']
        );

        const created = await db.asyncGet('SELECT * FROM tasks WHERE id = ?', [id]);
        return res.status(201).json(created);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to add task' });
    }
});

router.patch('/:id/progress', async (req, res) => {
    try {
        const { progress, completed } = req.body;
        await db.asyncRun(
            `UPDATE tasks SET progress = ?, completed = ? WHERE id = ?`,
            [progress, completed ? 1 : 0, req.params.id]
        );
        const updated = await db.asyncGet('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
        return res.json(updated);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to update task progress' });
    }
});

module.exports = router;
