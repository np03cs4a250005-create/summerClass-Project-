const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const venues = await db.asyncAll('SELECT * FROM venues');
        const formatted = venues.map(v => ({
            ...v,
            isIndoor: Boolean(v.isIndoor),
            facilities: v.facilities ? v.facilities.split(',') : []
        }));
        return res.json(formatted);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch venues' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, capacity, hallLayout } = req.body;
        if (!name) return res.status(400).json({ error: 'Venue name is required' });

        const id = 'v-' + Date.now();
        const mapUrl = 'https://maps.google.com/?q=' + encodeURIComponent(name);

        await db.asyncRun(
            `INSERT INTO venues (id, name, capacity, isIndoor, mapUrl, facilities, hallLayout, parkingInfo)
             VALUES (?, ?, ?, 1, ?, 'WiFi,Parking', ?, 'Standard Garage')`,
            [id, name, capacity || 200, mapUrl, hallLayout || 'Auditorium']
        );

        const created = await db.asyncGet('SELECT * FROM venues WHERE id = ?', [id]);
        return res.status(201).json(created);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to create venue' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.asyncRun('DELETE FROM venues WHERE id = ?', [req.params.id]);
        return res.json({ message: 'Venue deleted' });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to delete venue' });
    }
});

module.exports = router;
