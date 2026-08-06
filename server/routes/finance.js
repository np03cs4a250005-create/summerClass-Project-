const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const expenses = await db.asyncAll('SELECT * FROM finance_expenses');
        const regRev = await db.asyncGet('SELECT SUM(amount) as total FROM registrations WHERE paid = 1');

        return res.json({
            expenses,
            sponsorshipIncome: 15000,
            ticketRevenue: regRev ? (regRev.total || 0) : 0
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch financial data' });
    }
});

router.post('/expenses', async (req, res) => {
    try {
        const { title, amount } = req.body;
        const id = 'exp-' + Date.now();

        await db.asyncRun(`INSERT INTO finance_expenses (id, title, amount) VALUES (?, ?, ?)`,
            [id, title, amount || 0]);

        const created = await db.asyncGet('SELECT * FROM finance_expenses WHERE id = ?', [id]);
        return res.status(201).json(created);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to record expense' });
    }
});

module.exports = router;
