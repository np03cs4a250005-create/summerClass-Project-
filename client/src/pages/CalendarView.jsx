import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { eventsAPI } from '../services/api';
import { useToast } from '../components/Toast';

const DEFAULT_EVENTS = [
    { id: 'ev-1', name: 'Global Tech Summit 2026', date: '2026-09-15', time: '09:00 AM - 04:00 PM', venue: 'Grand Cyber Hall A', category: 'Tech Summit', color: '#38bdf8', icon: 'fa-microchip', organizer: 'Alex Rivera' },
    { id: 'ev-2', name: 'Creative UI/UX Masterclass', date: '2026-09-22', time: '01:00 PM - 05:00 PM', venue: 'Design Hub Studio 4', category: 'Workshop', color: '#c084fc', icon: 'fa-pen-nib', organizer: 'Sophia Taylor' },
    { id: 'ev-3', name: 'Green Energy & Pitch', date: '2026-09-05', time: '10:00 AM - 02:00 PM', venue: 'Eco Center Main Stage', category: 'Keynote', color: '#34d399', icon: 'fa-leaf', organizer: 'Marcus Vance' },
    { id: 'ev-4', name: 'Developer AI Hackathon', date: '2026-09-12', time: '09:00 AM - 09:00 PM', venue: 'Innovation Lab 2', category: 'Hackathon', color: '#fbbf24', icon: 'fa-code', organizer: 'David Miller' },
    { id: 'ev-5', name: 'VIP Networking Gala', date: '2026-09-18', time: '06:30 PM - 10:00 PM', venue: 'Skyline Ballroom VIP', category: 'Networking', color: '#f472b6', icon: 'fa-wine-glass', organizer: 'Elena Rostova' },
    { id: 'ev-6', name: 'Startup Pitch Meetup', date: '2026-09-28', time: '02:00 PM - 06:00 PM', venue: 'Venture Capital Arena', category: 'Investors', color: '#60a5fa', icon: 'fa-chart-pie', organizer: 'James Wilson' },
    { id: 'ev-7', name: 'Global Tech Conference', date: '2026-09-15', time: '09:00 AM - 03:00 PM', venue: 'San Francisco Innovation Hub', category: 'Technology', color: '#818cf8', icon: 'fa-calendar-check', organizer: 'Host Team' },
    { id: 'ev-8', name: 'Cyber Security Keynote', date: '2026-09-08', time: '11:00 AM - 01:00 PM', venue: 'Metropolitan Art Center', category: 'Security', color: '#f87171', icon: 'fa-shield-halved', organizer: 'Karan Patel' },
    { id: 'ev-9', name: 'Sustainability Expo', date: '2026-09-02', time: '10:00 AM - 04:00 PM', venue: 'Sustainability Pavilion', category: 'Expo', color: '#34d399', icon: 'fa-tree', organizer: 'Eco Council' }
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
                        name: ev.title || ev.name || 'Community Event',
                        date: ev.date ? (ev.date.includes('T') ? ev.date.split('T')[0] : ev.date) : '2026-09-15',
                        time: ev.time || '10:00 AM - 04:00 PM',
                        venue: ev.location || ev.venue || 'Gatherly Center',
                        category: ev.category || 'General',
                        color: ev.color || ['#38bdf8', '#c084fc', '#34d399', '#fbbf24', '#f472b6'][i % 5],
                        icon: 'fa-calendar-check',
                        organizer: ev.organizer || 'Host Team'
                    }));
                    setEvents([...DEFAULT_EVENTS, ...mapped.filter(m => !DEFAULT_EVENTS.some(d => d.id === m.id))]);
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
        showToast(`Event "${created.name}" added to ${selectedDateStr}!`, 'success');
    };

    const handleDeleteEvent = (id, name) => {
        if (window.confirm(`Are you sure you want to remove "${name}" from calendar?`)) {
            setEvents(prev => prev.filter(e => e.id !== id));
            showToast(`Event removed.`, 'info');
        }
    };

    const filteredEvents = events.filter(e => {
        if (activeFilter === 'all') return true;
        return e.category && e.category.toLowerCase().includes(activeFilter.toLowerCase());
    });

    const selectedDateEvents = filteredEvents.filter(e => e.date === selectedDateStr);

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Top Hero Banner & Command Center */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(9, 13, 22, 0.98))',
                border: '1.5px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '24px',
                padding: '28px 32px',
                marginBottom: '28px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 35px rgba(37,99,235,0.25)',
                backdropFilter: 'blur(16px)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 14px', borderRadius: '20px', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 800, marginBottom: '10px' }}>
                            <i className="fas fa-sparkles"></i> GATHERLY SCHEDULING CALENDAR
                        </div>
                        <h2 style={{ fontSize: '2.3rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #ffffff, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <i className="fas fa-calendar-days" style={{ color: '#38bdf8' }}></i>
                            Interactive Event Calendar
                        </h2>
                        <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: '0.98rem', maxWidth: '680px' }}>
                            Browse scheduled dates, inspect daily event line-ups, and manage venue bookings with interactive controls.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            onClick={handleToday}
                            style={{
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.18)',
                                color: '#f8fafc',
                                padding: '12px 20px',
                                borderRadius: '14px',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                cursor: 'pointer'
                            }}>
                            📅 Today (Sep 15)
                        </button>

                        <button
                            onClick={() => setShowAddModal(true)}
                            style={{
                                background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                                border: 'none',
                                color: '#ffffff',
                                padding: '12px 24px',
                                borderRadius: '14px',
                                fontWeight: 800,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 0 25px rgba(37, 99, 235, 0.5)'
                            }}>
                            <i className="fas fa-plus"></i> Schedule Event
                        </button>
                    </div>
                </div>

                {/* 4 KPI Metrics Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
                    <div style={{ background: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontSize: '1.2rem', flexShrink: 0 }}>
                            <i className="fas fa-calendar-check"></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Scheduled Events</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>{events.length} Active</div>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontSize: '1.2rem', flexShrink: 0 }}>
                            <i className="fas fa-building"></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Venues Utilized</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>6 Prime Halls</div>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(192, 132, 252, 0.3)', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(192, 132, 252, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', fontSize: '1.2rem', flexShrink: 0 }}>
                            <i className="fas fa-users-gear"></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Event Hosts</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>6 Organizers</div>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', fontSize: '1.2rem', flexShrink: 0 }}>
                            <i className="fas fa-crosshairs"></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Selected Date</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>{selectedDateStr}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filter Pills Bar */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '24px' }}>
                {['all', 'Tech Summit', 'Workshop', 'Keynote', 'Hackathon', 'Networking'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        style={{
                            padding: '8px 18px',
                            borderRadius: '20px',
                            border: activeFilter === cat ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                            background: activeFilter === cat ? 'rgba(37, 99, 235, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                            color: activeFilter === cat ? '#ffffff' : '#94a3b8',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}>
                        {cat === 'all' ? '✨ All Event Types' : cat}
                    </button>
                ))}
            </div>

            {/* Calendar Main Grid & Inspector Panel */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '24px' }}>
                
                {/* Left: Monthly Calendar Box */}
                <div style={{
                    background: 'rgba(15, 23, 42, 0.88)',
                    border: '1.5px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(16px)',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={handlePrevMonth}
                                title="Previous Month"
                                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#f8fafc', width: '38px', height: '38px', borderRadius: '12px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                                <i className="fas fa-chevron-left" style={{ margin: 0 }}></i>
                            </button>

                            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                                {MONTH_NAMES[month]} {year}
                            </h3>

                            <button
                                onClick={handleNextMonth}
                                title="Next Month"
                                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#f8fafc', width: '38px', height: '38px', borderRadius: '12px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                                <i className="fas fa-chevron-right" style={{ margin: 0 }}></i>
                            </button>
                        </div>

                        <span style={{ fontSize: '0.85rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.3)', fontWeight: 700 }}>
                            {filteredEvents.length} Total Events
                        </span>
                    </div>

                    {/* Day Name Header Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: 800, color: '#38bdf8', fontSize: '0.85rem', marginBottom: '12px' }}>
                        {DAY_NAMES.map(d => (
                            <div key={d} style={{ padding: '8px 0', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days Matrix */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                        {Array.from({ length: firstDayIndex }, (_, i) => (
                            <div key={`blank-${i}`} style={{ minHeight: '110px', background: 'rgba(0,0,0,0.15)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)', opacity: 0.25 }} />
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
                                        minHeight: '110px',
                                        background: isSelected
                                            ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.35), rgba(2, 132, 199, 0.25))'
                                            : (isToday ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.75)'),
                                        border: isSelected
                                            ? '2px solid #38bdf8'
                                            : (isToday ? '1.5px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255,255,255,0.08)'),
                                        borderRadius: '16px',
                                        padding: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        boxShadow: isSelected ? '0 0 25px rgba(56, 189, 248, 0.4)' : 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justify: 'space-between',
                                        overflow: 'hidden'
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{
                                            fontSize: '0.92rem',
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
                                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.2)', padding: '2px 6px', borderRadius: '10px' }}>
                                                {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>

                                    {/* Event Chips List inside Cell */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', overflow: 'hidden', width: '100%' }}>
                                        {dayEvents.slice(0, 2).map(ev => (
                                            <div
                                                key={ev.id}
                                                style={{
                                                    background: `${ev.color}25`,
                                                    borderLeft: `3px solid ${ev.color}`,
                                                    color: '#f8fafc',
                                                    padding: '3px 6px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600,
                                                    overflow: 'hidden',
                                                    display: 'flex',
                                                    justify: 'space-between',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    width: '100%',
                                                    boxSizing: 'border-box'
                                                }}>
                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{ev.name}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteEvent(ev.id, ev.name);
                                                    }}
                                                    title="Remove event"
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ef4444',
                                                        cursor: 'pointer',
                                                        padding: 0,
                                                        fontSize: '0.72rem',
                                                        lineHeight: 1,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}>
                                                    <i className="fas fa-xmark" style={{ fontSize: '0.7rem' }}></i>
                                                </button>
                                            </div>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>
                                                +{dayEvents.length - 2} more...
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Selected Date Inspector Panel */}
                <div style={{
                    background: 'rgba(15, 23, 42, 0.88)',
                    border: '1.5px solid rgba(56, 189, 248, 0.35)',
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
                            <h3 style={{ margin: '4px 0 0', fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                                {selectedDateStr}
                            </h3>
                        </div>

                        {selectedDateEvents.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {selectedDateEvents.map(ev => (
                                    <div
                                        key={ev.id}
                                        style={{
                                            background: 'rgba(9, 13, 22, 0.85)',
                                            border: `1.5px solid ${ev.color}50`,
                                            borderRadius: '18px',
                                            padding: '16px',
                                            boxShadow: `0 8px 20px ${ev.color}15`
                                        }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: ev.color, background: `${ev.color}18`, padding: '3px 10px', borderRadius: '12px', border: `1px solid ${ev.color}40` }}>
                                                {ev.category}
                                            </span>

                                            {/* 100% DEAD-CENTERED Delete Button */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteEvent(ev.id, ev.name);
                                                    }}
                                                    title="Remove event from calendar"
                                                    style={{
                                                        display: 'grid',
                                                        placeItems: 'center',
                                                        placeContent: 'center',
                                                        width: '30px',
                                                        height: '30px',
                                                        minWidth: '30px',
                                                        minHeight: '30px',
                                                        borderRadius: '8px',
                                                        background: 'rgba(239, 68, 68, 0.15)',
                                                        border: '1px solid rgba(239, 68, 68, 0.35)',
                                                        color: '#ef4444',
                                                        cursor: 'pointer',
                                                        padding: 0,
                                                        margin: 0,
                                                        boxSizing: 'border-box'
                                                    }}>
                                                    <i className="fas fa-trash-can" style={{ fontSize: '0.78rem', margin: '0 auto', padding: 0, lineHeight: 1, display: 'block', textCenter: 'center' }}></i>
                                                </button>
                                                <i className={`fas ${ev.icon}`} style={{ color: ev.color, fontSize: '1.1rem' }}></i>
                                            </div>
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
                                                <i className="fas fa-user-tie" style={{ color: '#34d399' }}></i>
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
                            marginTop: '20px',
                            background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                            border: 'none',
                            color: '#ffffff',
                            padding: '14px 20px',
                            borderRadius: '14px',
                            fontWeight: 800,
                            fontSize: '0.92rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justify: 'center',
                            gap: '8px',
                            boxShadow: '0 0 25px rgba(37, 99, 235, 0.4)'
                        }}>
                        <i className="fas fa-circle-plus"></i> Add Event for {selectedDateStr}
                    </button>
                </div>
            </div>

            {/* PORTAL: Add Event Modal (DEAD-CENTERED & LARGE) */}
            {showAddModal && createPortal(
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 999999,
                    background: 'rgba(5, 11, 26, 0.88)',
                    backdropFilter: 'blur(20px)',
                    display: 'grid',
                    placeItems: 'center',
                    placeContent: 'center',
                    padding: '24px',
                    boxSizing: 'border-box',
                    margin: 0
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '620px',
                        background: 'linear-gradient(135deg, #0f172a 0%, #090d16 100%)',
                        border: '2px solid rgba(56, 189, 248, 0.5)',
                        borderRadius: '28px',
                        padding: '36px',
                        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 60px rgba(56, 189, 248, 0.35)',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
                            <div>
                                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '1px', textTransform: 'uppercase' }}>DATE: {selectedDateStr}</span>
                                <h3 style={{ margin: '4px 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-calendar-plus" style={{ color: '#38bdf8' }}></i>
                                    Schedule New Event
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', width: '38px', height: '38px', borderRadius: '12px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                                <i className="fas fa-times" style={{ margin: 0, fontSize: '1rem' }}></i>
                            </button>
                        </div>

                        <form onSubmit={handleCreateEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>Event Name / Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. AI & Developer Hackathon 2026"
                                    value={newEvent.name}
                                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(56, 189, 248, 0.4)', color: '#ffffff', fontSize: '0.95rem', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>Category</label>
                                    <select
                                        value={newEvent.category}
                                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(56, 189, 248, 0.4)', color: '#ffffff', fontSize: '0.95rem', outline: 'none' }}>
                                        <option value="Tech Summit">Tech Summit</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Keynote">Keynote</option>
                                        <option value="Hackathon">Hackathon</option>
                                        <option value="Networking">Networking</option>
                                        <option value="Conference">Conference</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>Time Schedule</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 10:00 AM - 04:00 PM"
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(56, 189, 248, 0.4)', color: '#ffffff', fontSize: '0.95rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>Venue Location</label>
                                <input
                                    type="text"
                                    placeholder="e.g. San Francisco Innovation Hub"
                                    value={newEvent.venue}
                                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(56, 189, 248, 0.4)', color: '#ffffff', fontSize: '0.95rem', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '14px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    style={{ padding: '12px 24px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '12px 30px', borderRadius: '14px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', border: 'none', color: '#ffffff', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 0 25px rgba(37, 99, 235, 0.5)' }}>
                                    Save Event to Calendar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default CalendarView;
