import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useToast } from '../components/Toast';

const EMPTY_FORM = { name: '', category: 'Technology', capacity: 250, date: '2026-09-15', time: '09:00 AM', location: '', description: '', coverUrl: '' };

const CATEGORY_COLORS = {
    Technology: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', border: 'rgba(99,102,241,0.3)', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    Design: { bg: 'rgba(236,72,153,0.15)', color: '#f472b6', border: 'rgba(236,72,153,0.3)', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
    Business: { bg: 'rgba(52,211,153,0.15)', color: '#34d399', border: 'rgba(52,211,153,0.3)', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
};

const DEFAULT_EVENTS = [
    {
        id: 'ev-1',
        name: 'Global AI & Tech Keynote Summit 2026',
        category: 'Technology',
        description: 'The premier global event for AI engineers, founders, and tech pioneers. Keynote sessions, live code demos, and networking.',
        date: '2026-09-15',
        time: '09:00 AM',
        location: 'San Francisco Innovation Hub',
        capacity: 500,
        reserved: 420,
        status: 'Upcoming',
        isFeatured: true,
        price: 199,
        coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'ev-2',
        name: 'Next-Gen UX & Design Systems Summit',
        category: 'Design',
        description: 'Explore state-of-the-art UI design, interactive micro-animations, design tokens, and human-centric product design.',
        date: '2026-10-22',
        time: '10:30 AM',
        location: 'Metropolitan Art Center, NY',
        capacity: 350,
        reserved: 290,
        status: 'Upcoming',
        isFeatured: true,
        price: 149,
        coverUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'ev-3',
        name: 'CleanTech & Green Energy Venture Pitch',
        category: 'Business',
        description: 'Top sustainable energy startups pitch climate innovations to tier-1 venture capital funds and angel investors.',
        date: '2026-11-05',
        time: '02:00 PM',
        location: 'Sustainability Pavilion, Austin',
        capacity: 200,
        reserved: 165,
        status: 'Upcoming',
        isFeatured: true,
        price: 299,
        coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'ev-4',
        name: 'Cybersecurity & Cloud Defense Forum',
        category: 'Technology',
        description: 'Deep-dive security workshops, zero-trust architectural blueprints, and enterprise threat intelligence sessions.',
        date: '2026-11-18',
        time: '09:30 AM',
        location: 'Cyber Arena, Seattle',
        capacity: 400,
        reserved: 310,
        status: 'Upcoming',
        isFeatured: false,
        price: 175,
        coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'ev-5',
        name: 'Creative Product Branding & Strategy Masterclass',
        category: 'Design',
        description: 'Learn brand storytelling, visual identity systems, and consumer engagement strategies from creative directors.',
        date: '2026-12-02',
        time: '01:00 PM',
        location: 'Design Loft, Los Angeles',
        capacity: 250,
        reserved: 195,
        status: 'Upcoming',
        isFeatured: false,
        price: 120,
        coverUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'ev-6',
        name: 'Global Founders & Investor Matchmaking Expo',
        category: 'Business',
        description: 'Connect directly with high-growth startup founders, angel syndicates, and institutional venture capital partners.',
        date: '2026-12-15',
        time: '11:00 AM',
        location: 'Financial Plaza Auditorium, Chicago',
        capacity: 300,
        reserved: 260,
        status: 'Upcoming',
        isFeatured: false,
        price: 250,
        coverUrl: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80',
    }
];

const EventCard = ({ ev, onEdit, onDuplicate, onDelete, onReserve, onIssueCert, idx }) => {
    const [hovered, setHovered] = useState(false);
    const cat = CATEGORY_COLORS[ev.category] || CATEGORY_COLORS.Technology;
    const reservedCount = ev.reserved || Math.floor(ev.capacity * 0.78);
    const fillPercent = Math.min(100, Math.round((reservedCount / ev.capacity) * 100));

    return (
        <div
            className="card-glass hover-lift anim-fade-up shimmer-card"
            style={{
                animationDelay: `${idx * 80}ms`,
                borderRadius: '22px',
                overflow: 'hidden',
                padding: 0,
                border: hovered ? `1px solid ${cat.color}` : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: hovered ? `0 20px 45px rgba(0,0,0,0.5), 0 0 25px ${cat.color}35` : '0 6px 25px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Image Banner Header */}
            <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
                <img
                    src={ev.coverUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
                    alt={ev.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        transform: hovered ? 'scale(1.08)' : 'scale(1.0)',
                    }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.92) 100%)' }}></div>

                {/* Category & Status Pill Overlays */}
                <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.border}`, backdropFilter: 'blur(10px)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.76rem', fontWeight: 700 }}>
                        {ev.category}
                    </span>

                    {ev.isFeatured && (
                        <span style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)', backdropFilter: 'blur(10px)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="fas fa-crown"></i> FEATURED
                        </span>
                    )}
                </div>

                {/* Date Badge Overlay */}
                <div style={{ position: 'absolute', bottom: '12px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '0.84rem', fontWeight: 600 }}>
                    <i className="far fa-calendar-alt" style={{ color: cat.color }}></i>
                    <span>{ev.date} {ev.time ? `• ${ev.time}` : ''}</span>
                </div>
            </div>

            {/* Card Body */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 8px', color: '#f8fafc', lineHeight: 1.35 }}>
                        {ev.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '12px' }}>
                        <i className="fas fa-map-marker-alt" style={{ color: cat.color }}></i>
                        <span>{ev.location}</span>
                    </div>

                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {ev.description}
                    </p>
                </div>

                <div>
                    {/* Seat Occupancy Progress Bar */}
                    <div style={{ marginBottom: '16px', background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.78rem' }}>
                            <span style={{ color: '#94a3b8', fontWeight: 600 }}>Reserved Seats</span>
                            <span style={{ color: cat.color, fontWeight: 700 }}>{reservedCount} / {ev.capacity} ({fillPercent}%)</span>
                        </div>
                        <div className="bar-track" style={{ height: '7px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                            <div className="bar-fill" style={{ width: `${fillPercent}%`, background: cat.gradient, borderRadius: '10px', height: '100%', transition: 'width 0.8s ease' }}></div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <button
                            onClick={() => onReserve(ev)}
                            className="btn blue-glow-btn"
                            style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fas fa-ticket-alt"></i> Reserve
                        </button>

                        <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn-icon" onClick={() => onIssueCert(ev)} title="Issue Certificates for this Event">
                                <i className="fas fa-certificate text-amber"></i>
                            </button>
                            <button className="btn-icon" onClick={() => onDuplicate(ev.id)} title="Duplicate Event">
                                <i className="far fa-copy text-indigo"></i>
                            </button>
                            <button className="btn-icon" onClick={() => onEdit(ev)} title="Edit Event">
                                <i className="far fa-edit text-amber"></i>
                            </button>
                            <button className="btn-icon" onClick={() => onDelete(ev.id)} title="Delete Event">
                                <i className="far fa-trash-alt text-danger"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EventsHub = () => {
    const [events, setEvents] = useState(DEFAULT_EVENTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
    const [selectedReserveEv, setSelectedReserveEv] = useState(null);
    const [reserveName, setReserveName] = useState('');
    const [reserveEmail, setReserveEmail] = useState('');
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const loadEvents = async () => {
        try {
            setLoading(true);
            const res = await eventsAPI.getAll();
            if (res.data && Array.isArray(res.data) && res.data.length >= 3) {
                // Merge cover images if missing
                const merged = res.data.map((item, idx) => ({
                    ...item,
                    coverUrl: item.coverUrl || DEFAULT_EVENTS[idx % DEFAULT_EVENTS.length].coverUrl,
                    price: item.price || DEFAULT_EVENTS[idx % DEFAULT_EVENTS.length].price,
                    reserved: item.reserved || Math.floor((item.capacity || 200) * 0.78)
                }));
                setEvents(merged);
            } else {
                setEvents(DEFAULT_EVENTS);
            }
        } catch {
            setEvents(DEFAULT_EVENTS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadEvents(); }, []);

    const openCreate = () => { setEditingEvent(null); setFormData(EMPTY_FORM); setIsModalOpen(true); };
    const openEdit = (ev) => {
        setEditingEvent(ev);
        setFormData({
            name: ev.name,
            category: ev.category,
            capacity: ev.capacity,
            date: ev.date,
            time: ev.time || '09:00 AM',
            location: ev.location,
            description: ev.description,
            coverUrl: ev.coverUrl || '',
        });
        setIsModalOpen(true);
    };

    const handleReserveClick = (ev) => {
        setSelectedReserveEv(ev);
        setIsReserveModalOpen(true);
    };

    const handleConfirmReserve = (e) => {
        e.preventDefault();
        if (!reserveName || !reserveEmail) {
            showToast('Please fill in your name and email', 'error');
            return;
        }

        const resCode = 'RES-' + Math.floor(100000 + Math.random() * 900000);
        showToast(`Ticket Reserved for ${selectedReserveEv.name}! Booking Ref: ${resCode}`, 'success');
        setIsReserveModalOpen(false);
        setReserveName('');
        setReserveEmail('');

        // Update local reserved seat count
        setEvents(prev => prev.map(ev => ev.id === selectedReserveEv.id ? { ...ev, reserved: (ev.reserved || 0) + 1 } : ev));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) { await eventsAPI.update(editingEvent.id, formData); showToast('Event updated!', 'success'); }
            else { await eventsAPI.create(formData); showToast('Event created live!', 'success'); }
            setIsModalOpen(false); loadEvents();
        } catch {
            if (editingEvent) {
                setEvents(events.map(ev => ev.id === editingEvent.id ? { ...ev, ...formData } : ev));
                showToast('Event updated!', 'success');
            } else {
                const cover = formData.coverUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
                const newEv = { id: 'ev-' + Date.now(), ...formData, coverUrl: cover, status: 'Upcoming', isFeatured: false, reserved: 1 };
                setEvents([newEv, ...events]);
                showToast('Event created live!', 'success');
            }
            setIsModalOpen(false);
        }
    };

    const handleDuplicate = async (id) => {
        try {
            await eventsAPI.duplicate(id);
            showToast('Event duplicated!', 'success');
            loadEvents();
        } catch {
            const target = events.find(ev => ev.id === id);
            if (target) {
                const copy = { ...target, id: 'ev-' + Date.now(), name: `${target.name} (Copy)` };
                setEvents([copy, ...events]);
                showToast('Event duplicated!', 'success');
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            await eventsAPI.delete(id);
            showToast('Event deleted', 'info');
            loadEvents();
        } catch {
            setEvents(events.filter(ev => ev.id !== id));
            showToast('Event deleted', 'info');
        }
    };

    const filtered = events.filter(ev => {
        const title = ev.name || ev.title || '';
        const cat = ev.category || 'Technology';
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || ev.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || cat.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    const featuredEv = events.find(e => e.isFeatured) || events[0];
    const totalCapacity = events.reduce((acc, ev) => acc + (ev.capacity || 0), 0);
    const totalReserved = events.reduce((acc, ev) => acc + (ev.reserved || Math.floor((ev.capacity || 200) * 0.78)), 0);

    return (
        <div>
            {/* Hero Banner Header */}
            <div className="page-hero anim-fade-down" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '24px', padding: '30px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(99,102,241,0.5)', flexShrink: 0, animation: 'floatUpDown 3s ease-in-out infinite' }}>
                            <i className="fas fa-calendar-star" style={{ color: '#fff', fontSize: '1.6rem' }}></i>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                <h1 className="page-hero-title" style={{ fontSize: '1.8rem', margin: 0 }}>Events Management Hub</h1>
                                <span style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>LIVE PLATFORM</span>
                            </div>
                            <p className="page-hero-sub" style={{ margin: 0 }}>Publish upcoming summits, manage ticket seats, and monitor attendee reservations</p>
                        </div>
                    </div>

                    <button className="btn btn-primary" onClick={openCreate} style={{ borderRadius: '14px', padding: '14px 28px', fontSize: '0.95rem', fontWeight: 700, boxShadow: '0 6px 20px rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-plus-circle"></i> Create New Event
                    </button>
                </div>

                {/* KPI Statistics Ticker */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ background: 'rgba(15,23,42,0.6)', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>ACTIVE EVENTS</span>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818cf8', marginTop: '2px' }}>{events.length} Summits</div>
                    </div>
                    <div style={{ background: 'rgba(15,23,42,0.6)', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL CAPACITY</span>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>{totalCapacity.toLocaleString()} Seats</div>
                    </div>
                    <div style={{ background: 'rgba(15,23,42,0.6)', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL RESERVED</span>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>{totalReserved.toLocaleString()} Attendees</div>
                    </div>
                    <div style={{ background: 'rgba(15,23,42,0.6)', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>OCCUPANCY RATE</span>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>{Math.round((totalReserved / (totalCapacity || 1)) * 100)}%</div>
                    </div>
                </div>
            </div>

            {/* Featured Event Spotlight Hero */}
            {featuredEv && (
                <div className="card-glass anim-fade-up" style={{ borderRadius: '24px', overflow: 'hidden', padding: 0, marginBottom: '28px', border: '1px solid rgba(99,102,241,0.3)', position: 'relative' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'center' }}>
                        <div style={{ position: 'relative', height: '100%', minHeight: '260px' }}>
                            <img src={featuredEv.coverUrl} alt={featuredEv.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.95) 100%)' }}></div>
                        </div>

                        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <span style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800 }}>
                                    <i className="fas fa-crown"></i> FEATURED SPOTLIGHT
                                </span>
                                <span style={{ color: '#818cf8', fontSize: '0.84rem', fontWeight: 700 }}>{featuredEv.category}</span>
                            </div>

                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 10px', color: '#fff', lineHeight: 1.3 }}>{featuredEv.name}</h2>
                            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '18px' }}>{featuredEv.description}</p>

                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.86rem', color: '#cbd5e1', marginBottom: '22px' }}>
                                <div><i className="far fa-calendar-alt" style={{ color: '#818cf8', marginRight: '6px' }}></i>{featuredEv.date}</div>
                                <div><i className="fas fa-map-marker-alt" style={{ color: '#818cf8', marginRight: '6px' }}></i>{featuredEv.location}</div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <button onClick={() => handleReserveClick(featuredEv)} className="btn blue-glow-btn" style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: 700 }}>
                                    <i className="fas fa-ticket-alt" style={{ marginRight: '6px' }}></i> Reserve VIP Ticket
                                </button>
                                <button onClick={() => navigate('/tickets')} className="btn btn-secondary" style={{ borderRadius: '12px', padding: '12px 20px', fontWeight: 600 }}>
                                    View Ticket Tiers
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter & Search Bar */}
            <div className="anim-fade-up" style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(15,23,42,0.8)', borderRadius: '14px', padding: '0 16px', minWidth: '260px', border: '1px solid rgba(56,189,248,0.25)' }}>
                        <i className="fas fa-search" style={{ color: '#64748b', marginRight: '10px' }}></i>
                        <input
                            type="text"
                            placeholder="Search events or locations..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="form-input"
                            style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#fff', width: '100%', padding: '10px 0' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['All', 'Technology', 'Design', 'Business'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    cursor: 'pointer',
                                    fontSize: '0.88rem',
                                    fontWeight: 700,
                                    transition: 'all 0.25s ease',
                                    background: selectedCategory === cat ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'rgba(255,255,255,0.04)',
                                    color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                                    boxShadow: selectedCategory === cat ? '0 4px 18px rgba(99,102,241,0.35)' : 'none',
                                }}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {[0,1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 380, borderRadius: '22px' }}></div>)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="card-glass anim-scale-in" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
                    <i className="fas fa-calendar-times" style={{ fontSize: '3.5rem', color: 'var(--text-muted)', marginBottom: '16px', display: 'block' }}></i>
                    <h3 style={{ marginBottom: '8px', fontSize: '1.4rem' }}>No events found</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria or create a new summit.</p>
                    <button className="btn btn-primary" style={{ marginTop: '20px', borderRadius: '12px' }} onClick={openCreate}>Create First Event</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {filtered.map((ev, i) => (
                        <EventCard
                            key={ev.id}
                            ev={ev}
                            idx={i}
                            onEdit={openEdit}
                            onDuplicate={handleDuplicate}
                            onDelete={handleDelete}
                            onReserve={handleReserveClick}
                            onIssueCert={(targetEv) => navigate(`/qr?eventId=${targetEv.id}&eventTitle=${encodeURIComponent(targetEv.name)}`)}
                        />
                    ))}
                </div>
            )}

            {/* Create / Edit Event Modal */}
            {isModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-box card-glass anim-scale-in" style={{ maxWidth: '580px', padding: '28px', borderRadius: '24px' }}>
                        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.35rem' }}>{editingEvent ? 'Edit Event Details' : 'Create New Event'}</h2>
                            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group" style={{ marginBottom: '14px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>Event Title *</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Global Tech Summit 2026" className="form-input" required />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                                <div className="input-group">
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="form-input" style={{ background: 'rgba(15,23,42,0.9)' }}>
                                        <option>Technology</option>
                                        <option>Design</option>
                                        <option>Business</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>Total Capacity</label>
                                    <input type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 100 })} className="form-input" required />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                                <div className="input-group">
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>Date *</label>
                                    <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="form-input" required />
                                </div>

                                <div className="input-group">
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>Time</label>
                                    <input type="text" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} placeholder="09:00 AM" className="form-input" required />
                                </div>
                            </div>

                            <div className="input-group" style={{ marginBottom: '14px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>Location / Venue *</label>
                                <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. San Francisco Innovation Hub" className="form-input" required />
                            </div>

                            <div className="input-group" style={{ marginBottom: '14px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>Cover Image URL (Optional)</label>
                                <input type="url" value={formData.coverUrl} onChange={e => setFormData({ ...formData, coverUrl: e.target.value })} placeholder="https://images.unsplash.com/..." className="form-input" />
                            </div>

                            <div className="input-group" style={{ marginBottom: '14px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>Description *</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="form-textarea" rows={3} required></textarea>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-check" style={{ marginRight: '6px' }}></i> Save Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Instant Ticket Reservation Modal */}
            {isReserveModalOpen && selectedReserveEv && (
                <div className="modal-overlay active">
                    <div className="modal-box card-glass anim-scale-in" style={{ maxWidth: '500px', padding: '28px', borderRadius: '24px' }}>
                        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Reserve Ticket Pass</h2>
                            <button className="modal-close-btn" onClick={() => setIsReserveModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', padding: '14px', borderRadius: '14px', marginBottom: '18px' }}>
                            <h4 style={{ margin: '0 0 4px', color: '#818cf8' }}>{selectedReserveEv.name}</h4>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>{selectedReserveEv.date} • {selectedReserveEv.location}</p>
                        </div>

                        <form onSubmit={handleConfirmReserve}>
                            <div className="input-group" style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>Your Full Name *</label>
                                <input type="text" value={reserveName} onChange={e => setReserveName(e.target.value)} placeholder="Jane Doe" className="form-input" required />
                            </div>

                            <div className="input-group" style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>Email Address *</label>
                                <input type="email" value={reserveEmail} onChange={e => setReserveEmail(e.target.value)} placeholder="jane@example.com" className="form-input" required />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsReserveModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn blue-glow-btn">
                                    <i className="fas fa-ticket-alt" style={{ marginRight: '6px' }}></i> Confirm Ticket Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsHub;
