const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all events
router.get('/', async (req, res) => {
    try {
        const events = await db.asyncAll('SELECT * FROM events ORDER BY date ASC');
        // convert integers 0/1 back to boolean for isPublic, isFeatured, isPublished
        const formatted = events.map(e => ({
            ...e,
            tags: e.tags ? e.tags.split(',') : [],
            isPublic: Boolean(e.isPublic),
            isFeatured: Boolean(e.isFeatured),
            isPublished: Boolean(e.isPublished)
        }));
        return res.json(formatted);
    } catch (err) {
        console.error('Fetch events error:', err);
        return res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// GET single event by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await db.asyncGet('SELECT * FROM events WHERE id = ?', [req.params.id]);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        event.tags = event.tags ? event.tags.split(',') : [];
        event.isPublic = Boolean(event.isPublic);
        event.isFeatured = Boolean(event.isFeatured);
        event.isPublished = Boolean(event.isPublished);
        return res.json(event);
    } catch (err) {
        return res.status(500).json({ error: 'Error fetching event' });
    }
});

// POST create new event
router.post('/', async (req, res) => {
    try {
        const { name, category, capacity, date, time, location, description, tags, priority, color } = req.body;
        if (!name || !date || !location) {
            return res.status(400).json({ error: 'Title, date, and location are required' });
        }

        const id = 'ev-' + Date.now();
        const tagStr = Array.isArray(tags) ? tags.join(',') : (tags || 'General');

        await db.asyncRun(
            `INSERT INTO events (id, name, category, tags, description, date, time, location, capacity, status, priority, color, isPublic, isFeatured, isPublished)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Upcoming', ?, ?, 1, 0, 1)`,
            [id, name, category || 'Technology', tagStr, description || '', date, time || '09:00', location, capacity || 100, priority || 'Normal', color || '#818cf8']
        );

        const created = await db.asyncGet('SELECT * FROM events WHERE id = ?', [id]);
        return res.status(201).json(created);
    } catch (err) {
        console.error('Create event error:', err);
        return res.status(500).json({ error: 'Failed to create event' });
    }
});

// PUT update event
router.put('/:id', async (req, res) => {
    try {
        const { name, category, capacity, date, location, description } = req.body;
        await db.asyncRun(
            `UPDATE events SET name = ?, category = ?, capacity = ?, date = ?, location = ?, description = ? WHERE id = ?`,
            [name, category, capacity, date, location, description, req.params.id]
        );
        const updated = await db.asyncGet('SELECT * FROM events WHERE id = ?', [req.params.id]);
        return res.json(updated);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to update event' });
    }
});

// POST duplicate event
router.post('/:id/duplicate', async (req, res) => {
    try {
        const ev = await db.asyncGet('SELECT * FROM events WHERE id = ?', [req.params.id]);
        if (!ev) return res.status(404).json({ error: 'Event not found' });

        const newId = 'ev-' + Date.now();
        const newName = ev.name + ' (Copy)';

        await db.asyncRun(
            `INSERT INTO events (id, name, category, tags, description, date, time, location, venueId, capacity, status, priority, color, isPublic, isFeatured, isPublished)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [newId, newName, ev.category, ev.tags, ev.description, ev.date, ev.time, ev.location, ev.venueId, ev.capacity, ev.status, ev.priority, ev.color, ev.isPublic, ev.isFeatured, ev.isPublished]
        );

        const copy = await db.asyncGet('SELECT * FROM events WHERE id = ?', [newId]);
        return res.status(201).json(copy);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to duplicate event' });
    }
});

// DELETE event
router.delete('/:id', async (req, res) => {
    try {
        await db.asyncRun('DELETE FROM events WHERE id = ?', [req.params.id]);
        return res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to delete event' });
    }
});

module.exports = router;
