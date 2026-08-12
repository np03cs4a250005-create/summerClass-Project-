import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../services/api';
import { useToast } from '../components/Toast';

const DEFAULT_EVENTS = [
    { id: 'ev-1', name: 'Global Tech Summit 2026', date: '2026-09-15', time: '09:00 AM - 04:00 PM', venue: 'Grand Cyber Hall A', category: 'Tech Summit', color: '#38bdf8', icon: 'fa-microchip', organizer: 'Alex Rivera' },
    { id: 'ev-2', name: 'Creative UI/UX Masterclass', date: '2026-09-22', time: '01:00 PM - 05:00 PM', venue: 'Design Hub Studio 4', category: 'Workshop', color: '#c084fc', icon: 'fa-pen-nib', organizer: 'Sophia Taylor' },
    { id: 'ev-3', name: 'Green Energy & Sustainability Pitch', date: '2026-09-05', time: '10:00 AM - 02:00 PM', venue: 'Eco Center Main Stage', category: 'Keynote', color: '#34d399', icon: 'fa-leaf', organizer: 'Marcus Vance' },
    { id: 'ev-4', name: 'Developer & AI Builders Hackathon', date: '2026-09-12', time: '09:00 AM - 09:00 PM', venue: 'Innovation Lab 2', category: 'Hackathon', color: '#fbbf24', icon: 'fa-code', organizer: 'David Miller' },
    { id: 'ev-5', name: 'VIP Networking & Dinner Gala', date: '2026-09-18', time: '06:30 PM - 10:00 PM', venue: 'Skyline Ballroom VIP', category: 'Networking', color: '#f472b6', icon: 'fa-wine-glass', organizer: 'Elena Rostova' },
    { id: 'ev-6', name: 'Startup Pitch & Investor Meetup', date: '2026-09-28', time: '02:00 PM - 06:00 PM', venue: 'Venture Capital Arena', category: 'Investors', color: '#60a5fa', icon: 'fa-chart-pie', organizer: 'James Wilson' }
];

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarView = () => {
    const { showToast } = useToast();
    const [events, setEvents] = useState(DEFAULT_EVENTS);
    const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 15));
    const [selectedDateStr, setSelectedDateStr] = useState('2026-09-15');
    const [activeFilter, setActiveFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        name: '',
        category: 'Conference',
        time: '10:00 AM - 02:00 PM',
        venue: 'Main Auditorium',
        color: '#38bdf8',
        icon: 'fa-star'
    });

    useEffect(() => {
        eventsAPI.getAll()
            .then(r => {
                if (r.data && Array.isArray(r.data) && r.data.length > 0) {
                    const mapped = r.data.map((ev, i) => ({
                        id: ev._id || ev.id || `ev-api-${i}`,
                        name: ev.title || ev.name || 'Community Gathering',
                        date: ev.date ? (ev.date.includes('T') ? ev.date.split('T')[0] : ev.date) : '2026-09-15',
                        time: ev.time || '10:00 AM - 04:00 PM',
                        venue: ev.location || ev.venue || 'Gatherly Center',
                        category: ev.category || 'General',
                        color: ev.color || ['#38bdf8', '#c084fc', '#34d399', '#fbbf24', '#f472b6'][i % 5],
                        icon: 'fa-calendar-check',
                        organizer: ev.organizer || 'Host Team'
                    }));
                    setEvents([...DEFAULT_EVENTS, ...mapped]);
                } else {
                    setEvents(DEFAULT_EVENTS);
                }
            })
            .catch(() => setEvents(DEFAULT_EVENTS));
    }, []);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleToday = () => {
        const today = new Date(2026, 8, 15);
        setCurrentDate(today);
        setSelectedDateStr('2026-09-15');
        showToast('Jumped to September 15, 2026', 'info');
    };

    const handleDateClick = (dayNum) => {
        const mStr = String(month + 1).padStart(2, '0');
        const dStr = String(dayNum).padStart(2, '0');
        const formatted = `${year}-${mStr}-${dStr}`;
        setSelectedDateStr(formatted);
        showToast(`Selected Date: ${MONTH_NAMES[month]} ${dayNum}, ${year}`, 'success');
    };

    const handleCreateEventSubmit = (e) => {
        e.preventDefault();
        if (!newEvent.name.trim()) return;

        const created = {
            id: `ev-custom-${Date.now()}`,
            name: newEvent.name.trim(),
            date: selectedDateStr,
            time: newEvent.time,
            venue: newEvent.venue,
            category: newEvent.category,
            color: newEvent.color,
            icon: newEvent.icon,
            organizer: 'Current Host'
        };

        setEvents(prev => [created, ...prev]);
        setShowAddModal(false);
        setNewEvent({ name: '', category: 'Conference', time: '10:00 AM - 02:00 PM', venue: 'Main Auditorium', color: '#38bdf8', icon: 'fa-star' });
        showToast(`Scheduled "${created.name}" on ${selectedDateStr}!`, 'success');
    };

    const filteredEvents = events.filter(ev => {
        if (activeFilter === 'all') return true;
        return ev.category.toLowerCase() === activeFilter.toLowerCase();
    });

    const selectedDateEvents = filteredEvents.filter(ev => ev.date === selectedDateStr);

    const categories = ['all', 'Tech Summit', 'Workshop', 'Keynote', 'Hackathon', 'Networking', 'Investors'];

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '2.1rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f8fafc, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <i className="fas fa-calendar-alt" style={{ color: '#38bdf8' }}></i>
                        Interactive Event Calendar
                    </h2>
                    <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.95rem' }}>
                        Click any date cell to select, inspect events, or schedule new gatherings.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleToday}
                        style={{
                            background: 'rgba(56, 189, 248, 0.15)',
                            border: '1px solid rgba(56, 189, 248, 0.4)',
                            color: '#38bdf8',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                        <i className="fas fa-calendar-day"></i> Today
                    </button>

                    <button
                        onClick={() => setShowAddModal(true)}
                        style={{
                            background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                            border: 'none',
                            color: '#ffffff',
                            padding: '8px 18px',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)'
                        }}>
                        <i className="fas fa-plus"></i> Schedule Event
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        style={{
                            padding: '7px 16px',
                            borderRadius: '20px',
                            border: activeFilter === cat ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                            background: activeFilter === cat ? 'rgba(37, 99, 235, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                            color: activeFilter === cat ? '#ffffff' : '#94a3b8',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease'
                        }}>
                        {cat === 'all' ? '✨ All Categories' : cat}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '24px' }}>
                <div style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1.5px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(16px)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={handlePrevMonth}
                                title="Previous Month"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                                {MONTH_NAMES[month]} {year}
                            </h3>
                            <button
                                onClick={handleNextMonth}
                                title="Next Month"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>

                        <span style={{ fontSize: '0.85rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '4px 12px', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.25)', fontWeight: 600 }}>
                            {filteredEvents.length} Total Scheduled Events
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', fontWeight: 700, color: '#38bdf8', fontSize: '0.88rem', marginBottom: '14px' }}>
                        {DAY_NAMES.map(d => (
                            <div key={d} style={{ padding: '8px 0', background: 'rgba(56, 189, 248, 0.06)', borderRadius: '10px' }}>
                                {d}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
                        {Array.from({ length: firstDayIndex }, (_, i) => (
                            <div key={`blank-${i}`} style={{ minHeight: '105px', background: 'rgba(0,0,0,0.15)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)', opacity: 0.3 }} />
                        ))}

                        {Array.from({ length: totalDaysInMonth }, (_, i) => {
                            const dayNum = i + 1;
                            const mStr = String(month + 1).padStart(2, '0');
                            const dStr = String(dayNum).padStart(2, '0');
                            const cellDateStr = `${year}-${mStr}-${dStr}`;

                            const isSelected = selectedDateStr === cellDateStr;
                            const isToday = cellDateStr === '2026-09-15';
                            const dayEvents = filteredEvents.filter(ev => ev.date === cellDateStr);

                            return (
                                <div
                                    key={dayNum}
                                    onClick={() => handleDateClick(dayNum)}
                                    style={{
                                        minHeight: '105px',
                                        background: isSelected
                                            ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.35), rgba(2, 132, 199, 0.25))'
                                            : (isToday ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.7)'),
                                        border: isSelected
                                            ? '2px solid #38bdf8'
                                            : (isToday ? '1.5px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255,255,255,0.08)'),
                                        borderRadius: '16px',
                                        padding: '10px',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        boxShadow: isSelected ? '0 0 25px rgba(56, 189, 248, 0.4)' : 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justify: 'space-between'
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{
                                            fontSize: '1rem',
                                            fontWeight: isSelected || isToday ? 800 : 600,
                                            color: isSelected ? '#ffffff' : (isToday ? '#38bdf8' : '#e2e8f0'),
                                            width: '26px',
                                            height: '26px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justify: 'center',
                                            background: isSelected ? '#2563eb' : (isToday ? 'rgba(56, 189, 248, 0.2)' : 'transparent')
                                        }}>
                                            {dayNum}
                                        </span>

                                        {dayEvents.length > 0 && (
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.18)', padding: '2px 6px', borderRadius: '10px' }}>
                                                {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', overflow: 'hidden' }}>
                                        {dayEvents.slice(0, 2).map(ev => (
                                            <div
                                                key={ev.id}
                                                style={{
                                                    background: `${ev.color}25`,
                                                    borderLeft: `3px solid ${ev.color}`,
                                                    color: '#f8fafc',
                                                    padding: '3px 6px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.72rem',
                                                    fontWeight: 600,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                {ev.name}
                                            </div>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>
                                                +{dayEvents.length - 2} more...
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1.5px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(16px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between'
                }}>
                    <div>
                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '20px' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                SELECTED DATE INSPECTOR
                            </span>
                            <h3 style={{ margin: '4px 0 0', fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                                {selectedDateStr}
                            </h3>
                        </div>

                        {selectedDateEvents.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {selectedDateEvents.map(ev => (
                                    <div
                                        key={ev.id}
                                        style={{
                                            background: 'rgba(9, 13, 22, 0.8)',
                                            border: `1.5px solid ${ev.color}50`,
                                            borderRadius: '16px',
                                            padding: '16px',
                                            boxShadow: `0 8px 20px ${ev.color}15`
                                        }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: ev.color, background: `${ev.color}18`, padding: '3px 10px', borderRadius: '12px', border: `1px solid ${ev.color}40` }}>
                                                {ev.category}
                                            </span>
                                            <i className={`fas ${ev.icon}`} style={{ color: ev.color, fontSize: '1.1rem' }}></i>
                                        </div>

                                        <h4 style={{ margin: '0 0 8px', fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                                            {ev.name}
                                        </h4>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem', color: '#94a3b8' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <i className="far fa-clock" style={{ color: '#38bdf8' }}></i>
                                                <span>{ev.time}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <i className="fas fa-location-dot" style={{ color: '#fbbf24' }}></i>
                                                <span>{ev.venue}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <i className="fas fa-user-tie" style={{ color: '#4ade80' }}></i>
                                                <span>Host: {ev.organizer}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '18px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <i className="fas fa-calendar-xmark" style={{ fontSize: '2.4rem', color: '#475569', marginBottom: '12px', display: 'block' }}></i>
                                <h4 style={{ color: '#f8fafc', fontWeight: 700, margin: '0 0 6px' }}>No Events Scheduled</h4>
                                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                                    There are no events on {selectedDateStr}. Click below to schedule one!
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                            border: 'none',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.92rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justify: 'center',
                            gap: '8px',
                            marginTop: '20px',
                            boxShadow: '0 0 25px rgba(37, 99, 235, 0.4)'
                        }}>
                        <i className="fas fa-plus-circle"></i>
                        <span>Add Event for {selectedDateStr}</span>
                    </button>
                </div>
            </div>

            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99999,
                    background: 'rgba(5, 11, 26, 0.88)',
                    backdropFilter: 'blur(16px)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '520px',
                        background: 'linear-gradient(135deg, #0f172a, #090d16)',
                        border: '1.5px solid rgba(56, 189, 248, 0.4)',
                        borderRadius: '24px',
                        padding: '28px',
                        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(37, 99, 235, 0.3)',
                        fontFamily: 'Inter, system-ui, sans-serif'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-calendar-plus" style={{ color: '#38bdf8' }}></i>
                                Schedule Event ({selectedDateStr})
                            </h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer' }}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleCreateEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Event Name / Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. AI Innovation Summit"
                                    value={newEvent.name}
                                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#ffffff', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Category</label>
                                    <select
                                        value={newEvent.category}
                                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#ffffff', outline: 'none' }}>
                                        <option value="Tech Summit">Tech Summit</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Keynote">Keynote</option>
                                        <option value="Hackathon">Hackathon</option>
                                        <option value="Networking">Networking</option>
                                        <option value="Investors">Investors</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Accent Color</label>
                                    <select
                                        value={newEvent.color}
                                        onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#ffffff', outline: 'none' }}>
                                        <option value="#38bdf8">Sky Blue</option>
                                        <option value="#c084fc">Violet</option>
                                        <option value="#34d399">Emerald Green</option>
                                        <option value="#fbbf24">Amber Gold</option>
                                        <option value="#f472b6">Rose Pink</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Time Schedule</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 10:00 AM - 04:00 PM"
                                    value={newEvent.time}
                                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#ffffff', outline: 'none' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Venue Location</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Grand Cyber Hall A"
                                    value={newEvent.venue}
                                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#ffffff', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontWeight: 600, cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '10px 22px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)' }}>
                                    Create Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarView;
