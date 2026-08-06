import React, { useState } from 'react';
import { useToast } from '../components/Toast';

const DEFAULT_SPEAKERS = [
    {
        id: 'spk-1',
        name: 'Dr. Arjun Shrestha',
        role: 'Chief AI Architect & Futurist',
        company: 'Neural Dynamics Labs',
        session: 'Keynote: Scalable Generative Intelligence 2026',
        category: 'Keynote Speaker',
        bio: 'Pioneer in deep neural synthesis and high-performance transformer architectures with 15+ patents.',
        email: 'arjun.shrestha@neuraldyn.io',
        avatarGradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        rating: '4.9 ★',
    },
    {
        id: 'spk-2',
        name: 'Sunita Maharjan',
        role: 'VP of Product Design Systems',
        company: 'Metropolis Design Co.',
        session: 'Workshop: Spatial UI & Dynamic Motion Tokens',
        category: 'Workshop Host',
        bio: 'Leading international design systems, accessibility standards, and spatial computing interfaces for enterprise web.',
        email: 'sunita.maharjan@metropolis.design',
        avatarGradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
        rating: '4.8 ★',
    },
    {
        id: 'spk-3',
        name: 'Bikash Thapa',
        role: 'Head of Global CleanTech Ventures',
        company: 'Vanguard Sustainable Capital',
        session: 'Panel: Financing Net-Zero Climate Technology',
        category: 'Panelist',
        bio: 'Venture partner allocating over $400M in sustainable energy startups across South Asia and Europe.',
        email: 'bikash.thapa@vanguardcap.com',
        avatarGradient: 'linear-gradient(135deg, #10b981, #34d399)',
        rating: '4.9 ★',
    },
    {
        id: 'spk-4',
        name: 'Anisha Karki',
        role: 'Head of Event Operations & Logistics',
        company: 'Gatherly Suite Team',
        session: 'Organizing Operations & VIP Hospitality',
        category: 'Organizer',
        bio: 'Veteran event director overseeing 100+ global summits, VIP logistics, and interactive guest experiences.',
        email: 'anisha.karki@gatherly.com',
        avatarGradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
        rating: '5.0 ★',
    }
];

const EMPTY_FORM = {
    name: '',
    role: '',
    company: '',
    session: '',
    category: 'Keynote Speaker',
    bio: '',
    email: '',
};

const TeamSpeakers = () => {
    const [speakers, setSpeakers] = useState(DEFAULT_SPEAKERS);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSpeaker, setEditingSpeaker] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const { showToast } = useToast();

    const openCreateModal = () => {
        setEditingSpeaker(null);
        setFormData(EMPTY_FORM);
        setIsModalOpen(true);
    };

    const openEditModal = (spk) => {
        setEditingSpeaker(spk);
        setFormData({
            name: spk.name,
            role: spk.role,
            company: spk.company,
            session: spk.session,
            category: spk.category,
            bio: spk.bio,
            email: spk.email,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.session.trim()) {
            showToast('Speaker name and session title are required', 'error');
            return;
        }

        if (editingSpeaker) {
            setSpeakers(speakers.map(s => s.id === editingSpeaker.id ? { ...s, ...formData } : s));
            showToast(`Updated speaker details for ${formData.name}`, 'success');
        } else {
            const gradients = [
                'linear-gradient(135deg, #6366f1, #8b5cf6)',
                'linear-gradient(135deg, #34d399, #10b981)',
                'linear-gradient(135deg, #f59e0b, #fbbf24)',
                'linear-gradient(135deg, #ec4899, #f472b6)',
                'linear-gradient(135deg, #3b82f6, #60a5fa)',
            ];
            const randomGrad = gradients[Math.floor(Math.random() * gradients.length)];
            const newSpk = {
                id: 'spk-' + Date.now(),
                ...formData,
                avatarGradient: randomGrad,
                rating: '5.0 ★'
            };
            setSpeakers([newSpk, ...speakers]);
            showToast(`Added keynote speaker ${formData.name}!`, 'success');
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id, name) => {
        if (!window.confirm(`Remove ${name} from keynote speaker roster?`)) return;
        setSpeakers(speakers.filter(s => s.id !== id));
        showToast(`Removed ${name}`, 'info');
    };

    const filtered = speakers.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.role.toLowerCase().includes(search.toLowerCase()) ||
            s.session.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === 'All' || s.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const getBadgeStyle = (cat) => {
        switch (cat) {
            case 'Keynote Speaker': return { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', border: 'rgba(99,102,241,0.3)' };
            case 'Workshop Host': return { bg: 'rgba(236,72,153,0.15)', color: '#f472b6', border: 'rgba(236,72,153,0.3)' };
            case 'Panelist': return { bg: 'rgba(52,211,153,0.15)', color: '#34d399', border: 'rgba(52,211,153,0.3)' };
            default: return { bg: 'rgba(56,189,248,0.15)', color: '#38bdf8', border: 'rgba(56,189,248,0.3)' };
        }
    };

    return (
        <div>
            {/* Hero Header */}
            <div className="page-hero anim-fade-down">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(99,102,241,0.4)', flexShrink: 0, animation: 'floatUpDown 3s ease-in-out infinite' }}>
                            <i className="fas fa-microphone-alt" style={{ color: '#fff', fontSize: '1.4rem' }}></i>
                        </div>
                        <div>
                            <h1 className="page-hero-title">Keynote Speakers & Event Team</h1>
                            <p className="page-hero-sub">Manage keynote speakers, panel hosts, workshop leaders, and event organizers</p>
                        </div>
                    </div>

                    <button className="btn btn-primary" onClick={openCreateModal} style={{ borderRadius: '12px', padding: '12px 22px', boxShadow: '0 4px 18px rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-plus"></i> Add Keynote Speaker
                    </button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="anim-fade-up" style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '10px', flex: 1, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(15,23,42,0.8)', borderRadius: '12px', padding: '0 14px', minWidth: '240px', border: '1px solid rgba(56,189,248,0.25)' }}>
                        <i className="fas fa-search" style={{ color: '#64748b', marginRight: '10px' }}></i>
                        <input
                            type="text"
                            placeholder="Search speakers or sessions..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="form-input"
                            style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#fff', padding: '10px 0', width: '100%' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['All', 'Keynote Speaker', 'Workshop Host', 'Panelist', 'Organizer'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    transition: 'all 0.2s ease',
                                    background: filterCategory === cat ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'rgba(255,255,255,0.04)',
                                    color: filterCategory === cat ? '#fff' : 'var(--text-secondary)'
                                }}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Speakers Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
                {filtered.map((spk, idx) => {
                    const badge = getBadgeStyle(spk.category);
                    return (
                        <div key={spk.id} className="card-glass anim-fade-up hover-lift" style={{ animationDelay: `${idx * 80}ms`, padding: '24px', borderRadius: '20px', borderTop: `4px solid ${badge.color}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                                        <div style={{ width: 52, height: 52, borderRadius: '16px', background: spk.avatarGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.2rem', boxShadow: `0 6px 16px ${badge.color}40` }}>
                                            {spk.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{spk.name}</h3>
                                            <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: badge.color, fontWeight: 600 }}>{spk.role}</p>
                                        </div>
                                    </div>
                                    <span style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                                        {spk.category}
                                    </span>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px 14px', marginBottom: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', fontWeight: 700 }}>Session Keynote</span>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>
                                        <i className="fas fa-microphone" style={{ color: badge.color, marginRight: '8px' }}></i>
                                        {spk.session}
                                    </p>
                                </div>

                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>{spk.bio}</p>
                            </div>

                            <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700 }}>
                                    <i className="fas fa-star" style={{ marginRight: '4px' }}></i> Rating: {spk.rating}
                                </span>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => openEditModal(spk)} className="btn-icon" title="Edit Speaker">
                                        <i className="far fa-edit text-amber"></i>
                                    </button>
                                    <button onClick={() => handleDelete(spk.id, spk.name)} className="btn-icon" title="Delete Speaker">
                                        <i className="far fa-trash-alt text-danger"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add / Edit Speaker Modal */}
            {isModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-box card-glass anim-scale-in" style={{ maxWidth: '540px', padding: '28px', borderRadius: '24px' }}>
                        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{editingSpeaker ? 'Edit Keynote Speaker' : 'Add New Keynote Speaker'}</h2>
                            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group" style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>Full Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Dr. Alex Vance"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                <div className="input-group">
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>Role / Designation</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="e.g. Lead AI Architect"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="form-input"
                                        style={{ background: 'rgba(15,23,42,0.9)' }}>
                                        <option>Keynote Speaker</option>
                                        <option>Workshop Host</option>
                                        <option>Panelist</option>
                                        <option>Organizer</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-group" style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>Session / Keynote Title *</label>
                                <input
                                    type="text"
                                    value={formData.session}
                                    onChange={e => setFormData({ ...formData, session: e.target.value })}
                                    placeholder="e.g. Keynote: Scalable Generative Intelligence"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="input-group" style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>Biography / Abstract</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Brief background and keynote focus..."
                                    className="form-textarea"
                                    rows={3}
                                    required
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-check" style={{ marginRight: '6px' }}></i> Save Speaker
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamSpeakers;
