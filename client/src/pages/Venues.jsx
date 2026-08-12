import React, { useState, useEffect } from 'react';
import { venuesAPI } from '../services/api';
import { useToast } from '../components/Toast';

const DEFAULT_VENUES = [
    {
        id: 'v-1',
        name: 'San Francisco Innovation Hub',
        capacity: 500,
        isIndoor: true,
        mapUrl: 'https://maps.google.com/?q=San+Francisco+Innovation+Hub',
        facilities: 'High-Speed Wi-Fi 6E, 4K LED Wall Stage, VIP Executive Lounge, Solar AC, Full Sound System',
        hallLayout: 'Auditorium Style (500 seats)',
        parkingInfo: '500 vehicle spots in subterranean garage + EV Chargers',
        coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        rentPrice: 3500,
        tags: ['Wi-Fi 6E', '4K LED Wall', 'VIP Lounge', 'Solar AC']
    },
    {
        id: 'v-2',
        name: 'Metropolitan Art & Design Center, NY',
        capacity: 350,
        isIndoor: true,
        mapUrl: 'https://maps.google.com/?q=Metropolitan+Art+Center+NY',
        facilities: 'Interactive Projection Mapping, Soundproof Audio Booths, Catering Kitchen, Valet Parking',
        hallLayout: 'Exhibition & Gallery Flex Layout',
        parkingInfo: 'Valet parking & 150 dedicated street parking bays',
        coverUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
        rentPrice: 2800,
        tags: ['Projection Mapping', 'Catering Kitchen', 'Gallery Flex', 'Valet']
    },
    {
        id: 'v-3',
        name: 'Sustainability Eco Pavilion, Austin',
        capacity: 200,
        isIndoor: false,
        mapUrl: 'https://maps.google.com/?q=Sustainability+Pavilion+Austin',
        facilities: 'Solar Powered Open-Air Stage, Native Audio System, Solar EV Charging, Organic Refreshment Bar',
        hallLayout: 'Outdoor Tiered Amphitheater',
        parkingInfo: '100 Eco & EV charging priority parking spots',
        coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        rentPrice: 1900,
        tags: ['Solar Powered', 'Open-Air Stage', 'EV Charging', 'Eco Amphitheater']
    },
    {
        id: 'v-4',
        name: 'Grand Skyline Cyber Ballroom & VIP Suite',
        capacity: 450,
        isIndoor: true,
        mapUrl: 'https://maps.google.com/?q=Grand+Skyline+Ballroom',
        facilities: '360-Degree Panoramic View, Crystal Sound Rig, Private VIP Suites, Helipad Access',
        hallLayout: 'Banquet & Round Table Executive Layout',
        parkingInfo: '300 Underground VIP Valet parking spaces',
        coverUrl: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80',
        rentPrice: 4200,
        tags: ['360° Panoramic View', 'VIP Suites', 'Crystal Sound', 'Helipad Access']
    }
];

const Venues = () => {
    const { showToast } = useToast();
    const [venues, setVenues] = useState(DEFAULT_VENUES);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [newVenue, setNewVenue] = useState({
        name: '',
        capacity: 250,
        isIndoor: true,
        hallLayout: 'Auditorium Style',
        facilities: 'Wi-Fi 6E, Audio System, Stage Lighting',
        parkingInfo: 'On-site vehicle parking available',
        mapUrl: '',
        rentPrice: 2500
    });

    const loadVenues = async () => {
        try {
            setLoading(true);
            const res = await venuesAPI.getAll();
            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                const mapped = res.data.map((v, i) => ({
                    id: v._id || v.id || `v-api-${i}`,
                    name: v.name || 'Premier Venue Hall',
                    capacity: v.capacity || 250,
                    isIndoor: v.isIndoor !== undefined ? Boolean(v.isIndoor) : true,
                    mapUrl: v.mapUrl || 'https://maps.google.com',
                    facilities: v.facilities || 'High-Speed Wi-Fi 6E, Stage Lighting, Full Sound System',
                    hallLayout: v.hallLayout || 'Auditorium Style',
                    parkingInfo: v.parkingInfo || 'On-site vehicle parking available',
                    coverUrl: v.coverUrl || DEFAULT_VENUES[i % DEFAULT_VENUES.length].coverUrl,
                    rentPrice: v.rentPrice || 2500,
                    tags: ['Wi-Fi 6E', 'AV Certified', 'Stage Lighting', 'VIP Ready']
                }));
                setVenues(mapped);
            } else {
                setVenues(DEFAULT_VENUES);
            }
        } catch {
            setVenues(DEFAULT_VENUES);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVenues();
    }, []);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!newVenue.name.trim()) return;

        const created = {
            id: `v-custom-${Date.now()}`,
            name: newVenue.name.trim(),
            capacity: Number(newVenue.capacity) || 200,
            isIndoor: Boolean(newVenue.isIndoor),
            hallLayout: newVenue.hallLayout || 'Auditorium Style',
            facilities: newVenue.facilities || 'Wi-Fi 6E, Audio System, Stage Lighting',
            parkingInfo: newVenue.parkingInfo || 'On-site vehicle parking available',
            mapUrl: newVenue.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(newVenue.name)}`,
            coverUrl: DEFAULT_VENUES[venues.length % DEFAULT_VENUES.length].coverUrl,
            rentPrice: Number(newVenue.rentPrice) || 2500,
            tags: ['Custom Venue', 'AV Ready', 'VIP Access']
        };

        try {
            await venuesAPI.create(created);
        } catch {
            // local update fallback
        }

        setVenues(prev => [created, ...prev]);
        setIsAddModalOpen(false);
        setNewVenue({ name: '', capacity: 250, isIndoor: true, hallLayout: 'Auditorium Style', facilities: 'Wi-Fi 6E, Audio System, Stage Lighting', parkingInfo: 'On-site vehicle parking available', mapUrl: '', rentPrice: 2500 });
        showToast(`Venue "${created.name}" added successfully!`, 'success');
    };

    const handleDeleteVenue = async (id, name, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete venue "${name}"?`)) return;

        try {
            await venuesAPI.delete(id);
        } catch {
            // local update fallback
        }
        setVenues(prev => prev.filter(v => v.id !== id));
        if (selectedVenue && selectedVenue.id === id) {
            setSelectedVenue(null);
        }
        showToast(`Venue "${name}" removed.`, 'info');
    };

    const filteredVenues = venues.filter(v => {
        const matchesType = filterType === 'all' ? true : (filterType === 'indoor' ? v.isIndoor : !v.isIndoor);
        const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || (v.hallLayout && v.hallLayout.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesType && matchesSearch;
    });

    const totalCapacity = venues.reduce((sum, v) => sum + (v.capacity || 0), 0);
    const avgRentPrice = venues.length > 0 ? Math.round(venues.reduce((sum, v) => sum + (v.rentPrice || 2500), 0) / venues.length) : 2500;

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Header Title & Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '2.1rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f8fafc, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <i className="fas fa-building" style={{ color: '#38bdf8' }}></i>
                        Venues & Seating Hub
                    </h2>
                    <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.95rem' }}>
                        Explore event halls, inspect seating layout configurations, and reserve world-class venues.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        style={{
                            background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                            border: 'none',
                            color: '#ffffff',
                            padding: '10px 20px',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)'
                        }}>
                        <i className="fas fa-plus"></i> Add New Venue
                    </button>
                </div>
            </div>

            {/* Top KPI Analytics Banner */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '18px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontSize: '1.3rem', flexShrink: 0 }}>
                        <i className="fas fa-landmark"></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Active Venues</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>{venues.length} Facilities</div>
                    </div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(52, 211, 153, 0.25)', borderRadius: '18px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'rgba(52, 211, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontSize: '1.3rem', flexShrink: 0 }}>
                        <i className="fas fa-chair"></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Total Seating Capacity</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>{totalCapacity.toLocaleString()} Max Seats</div>
                    </div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(192, 132, 252, 0.25)', borderRadius: '18px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'rgba(192, 132, 252, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', fontSize: '1.3rem', flexShrink: 0 }}>
                        <i className="fas fa-sack-dollar"></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Avg Rental Rate</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>${avgRentPrice.toLocaleString()} / Day</div>
                    </div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(251, 191, 36, 0.25)', borderRadius: '18px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', fontSize: '1.3rem', flexShrink: 0 }}>
                        <i className="fas fa-bolt"></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>AV & Tech Rating</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>99.4% Certified</div>
                    </div>
                </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['all', 'indoor', 'outdoor'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            style={{
                                padding: '8px 18px',
                                borderRadius: '20px',
                                border: filterType === type ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                                background: filterType === type ? 'rgba(37, 99, 235, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                                color: filterType === type ? '#ffffff' : '#94a3b8',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}>
                            {type === 'all' ? '✨ All Types' : (type === 'indoor' ? '🏢 Indoor Halls' : '🌿 Outdoor Stages')}
                        </button>
                    ))}
                </div>

                <div style={{ position: 'relative', width: '280px' }}>
                    <i className="fas fa-search" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '0.88rem' }}></i>
                    <input
                        type="text"
                        placeholder="Search venues or layouts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px 14px 8px 38px',
                            borderRadius: '14px',
                            background: 'rgba(15, 23, 42, 0.85)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            color: '#ffffff',
                            fontSize: '0.88rem',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Venues Grid Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                {filteredVenues.map((v) => (
                    <div
                        key={v.id}
                        onClick={() => setSelectedVenue(v)}
                        style={{
                            background: 'rgba(15, 23, 42, 0.88)',
                            border: '1.5px solid rgba(56, 189, 248, 0.3)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            justify: 'space-between',
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.borderColor = '#38bdf8';
                            e.currentTarget.style.boxShadow = '0 20px 45px rgba(0,0,0,0.7), 0 0 25px rgba(56,189,248,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                        }}
                    >
                        {/* Image Header with Gradient & Overlay Badges */}
                        <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                            <img
                                src={v.coverUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
                                alt={v.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.95) 100%)' }}></div>

                            {/* Top Badges: Indoor/Outdoor Pill + Seat Capacity */}
                            <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{
                                    background: v.isIndoor ? 'rgba(56, 189, 248, 0.25)' : 'rgba(52, 211, 153, 0.25)',
                                    color: v.isIndoor ? '#38bdf8' : '#34d399',
                                    border: v.isIndoor ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(52, 211, 153, 0.4)',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    {v.isIndoor ? '🏢 Indoor Hall' : '🌿 Outdoor Stage'}
                                </span>

                                <span style={{ background: 'rgba(15,23,42,0.85)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, backdropFilter: 'blur(10px)' }}>
                                    Cap: {v.capacity} Seats
                                </span>
                            </div>

                            {/* Rental Rate Overlay */}
                            <div style={{ position: 'absolute', bottom: '12px', right: '14px', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, background: 'rgba(9, 13, 22, 0.85)', padding: '3px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <i className="fas fa-tag" style={{ color: '#34d399', marginRight: '4px' }}></i>
                                ${v.rentPrice || 2500} / day
                            </div>
                        </div>

                        {/* Card Content Body */}
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 10px', color: '#f8fafc', lineHeight: 1.3 }}>
                                    {v.name}
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fas fa-chair" style={{ color: '#38bdf8', width: '16px' }}></i>
                                        <span><strong>Layout:</strong> {v.hallLayout}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fas fa-square-parking" style={{ color: '#fbbf24', width: '16px' }}></i>
                                        <span><strong>Parking:</strong> {v.parkingInfo}</span>
                                    </div>
                                </div>

                                {/* Feature Facility Badges */}
                                {v.tags && v.tags.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                                        {v.tags.slice(0, 3).map((tag, tIdx) => (
                                            <span key={tIdx} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                ✨ {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Card Footer Action Bar */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                <button
                                    onClick={() => setSelectedVenue(v)}
                                    style={{
                                        background: 'rgba(56, 189, 248, 0.15)',
                                        border: '1px solid rgba(56, 189, 248, 0.35)',
                                        color: '#38bdf8',
                                        padding: '8px 16px',
                                        borderRadius: '10px',
                                        fontWeight: 700,
                                        fontSize: '0.84rem',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justify: 'center',
                                        gap: '6px'
                                    }}>
                                    <i className="fas fa-eye"></i> View Details & Map
                                </button>

                                {/* Perfectly Centered Icon Buttons */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <a
                                        href={v.mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        title="Open Google Maps Location"
                                        style={{
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            color: '#f8fafc',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '10px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justify: 'center',
                                            textDecoration: 'none',
                                            boxSizing: 'border-box',
                                            padding: 0,
                                            margin: 0
                                        }}>
                                        <i className="fas fa-location-dot" style={{ color: '#fbbf24', fontSize: '0.92rem', margin: 0, lineHeight: 1 }}></i>
                                    </a>

                                    <button
                                        onClick={(e) => handleDeleteVenue(v.id, v.name, e)}
                                        title="Delete Venue"
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.15)',
                                            border: '1px solid rgba(239, 68, 68, 0.35)',
                                            color: '#ef4444',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justify: 'center',
                                            boxSizing: 'border-box',
                                            padding: 0,
                                            margin: 0
                                        }}>
                                        <i className="fas fa-trash-can" style={{ fontSize: '0.88rem', margin: 0, lineHeight: 1 }}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Venue Inspector & Seating Map Modal */}
            {selectedVenue && (
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
                        maxWidth: '660px',
                        background: 'linear-gradient(135deg, #0f172a, #090d16)',
                        border: '1.5px solid rgba(56, 189, 248, 0.4)',
                        borderRadius: '24px',
                        padding: '28px',
                        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(37, 99, 235, 0.3)',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-building" style={{ color: '#38bdf8' }}></i>
                                {selectedVenue.name}
                            </h3>
                            <button
                                onClick={() => setSelectedVenue(null)}
                                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', width: '34px', height: '34px', borderRadius: '10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fas fa-times" style={{ margin: 0 }}></i>
                            </button>
                        </div>

                        <div style={{ position: 'relative', height: '220px', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
                            <img src={selectedVenue.coverUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'} alt={selectedVenue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(15,23,42,0.95) 100%)' }}></div>
                            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ background: 'rgba(56,189,248,0.25)', color: '#38bdf8', padding: '4px 12px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
                                    {selectedVenue.isIndoor ? 'Indoor Multi-Purpose Hall' : 'Outdoor Open-Air Pavilion'}
                                </span>
                                <span style={{ background: 'rgba(251,191,36,0.25)', color: '#fbbf24', padding: '4px 12px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 800 }}>
                                    Capacity: {selectedVenue.capacity} Guests
                                </span>
                            </div>
                        </div>

                        {/* Interactive Seating Layout Preview Grid */}
                        <div style={{ background: 'rgba(9, 13, 22, 0.9)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(56,189,248,0.25)', marginBottom: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
                                STAGE & SEATING MAP PREVIEW
                            </div>
                            <div style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(56,189,248,0.4)', borderRadius: '8px', padding: '6px', fontSize: '0.8rem', color: '#f8fafc', fontWeight: 700, margin: '0 auto 14px', maxWidth: '300px' }}>
                                🎭 MAIN PRESENTATION STAGE
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '6px', maxWidth: '320px', margin: '0 auto' }}>
                                {Array.from({ length: 30 }, (_, i) => (
                                    <div key={i} title={`Seat ${i + 1}`} style={{
                                        height: '18px',
                                        borderRadius: '4px',
                                        background: i < 6 ? '#fbbf24' : (i < 18 ? '#38bdf8' : '#34d399'),
                                        opacity: 0.85
                                    }}></div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', fontSize: '0.72rem', color: '#94a3b8', marginTop: '12px' }}>
                                <span><span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#fbbf24', borderRadius: '2px', marginRight: '4px' }}></span>VIP Row</span>
                                <span><span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#38bdf8', borderRadius: '2px', marginRight: '4px' }}></span>Premium Pass</span>
                                <span><span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#34d399', borderRadius: '2px', marginRight: '4px' }}></span>General Admission</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Seating & Hall Layout</div>
                                <div style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 600 }}>{selectedVenue.hallLayout}</div>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Facilities & Amenities</div>
                                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{selectedVenue.facilities}</div>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Parking & Access Info</div>
                                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{selectedVenue.parkingInfo}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <a
                                href={selectedVenue.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justify: 'center',
                                    gap: '8px'
                                }}>
                                <i className="fas fa-map-location-dot" style={{ margin: 0 }}></i> Open Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Venue Modal */}
            {isAddModalOpen && (
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
                                <i className="fas fa-plus-circle" style={{ color: '#38bdf8' }}></i>
                                Add New Venue
                            </h3>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fas fa-times" style={{ margin: 0 }}></i>
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Venue Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. San Francisco Innovation Hub"
                                    value={newVenue.name}
                                    onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#ffffff', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Capacity (Seats)</label>
                                    <input
                                        type="number"
                                        required
                                        value={newVenue.capacity}
                                        onChange={(e) => setNewVenue({ ...newVenue, capacity: Number(e.target.value) })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#ffffff', outline: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Type</label>
                                    <select
                                        value={newVenue.isIndoor ? 'indoor' : 'outdoor'}
                                        onChange={(e) => setNewVenue({ ...newVenue, isIndoor: e.target.value === 'indoor' })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#ffffff', outline: 'none' }}>
                                        <option value="indoor">Indoor Hall</option>
                                        <option value="outdoor">Outdoor Stage</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Hall Seating Layout</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Auditorium Style (500 seats)"
                                    value={newVenue.hallLayout}
                                    onChange={(e) => setNewVenue({ ...newVenue, hallLayout: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#ffffff', outline: 'none' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Facilities & Amenities</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Wi-Fi 6E, Stage Lighting, Audio System"
                                    value={newVenue.facilities}
                                    onChange={(e) => setNewVenue({ ...newVenue, facilities: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#ffffff', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontWeight: 600, cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '10px 22px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)' }}>
                                    Save Venue
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Venues;
