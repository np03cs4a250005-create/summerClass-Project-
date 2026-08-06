import React, { useState, useEffect } from 'react';
import { financeAPI } from '../services/api';
import { useToast } from '../components/Toast';

const DEFAULT_SPONSORS = [
    { id: 1, name: 'TechCorp Global', tier: 'Platinum', amount: 8000, logo: 'fa-microchip', color: '#38bdf8', email: 'sponsor@techcorp.com' },
    { id: 2, name: 'InnovaDesign', tier: 'Gold', amount: 4500, logo: 'fa-palette', color: '#fbbf24', email: 'partners@innovadesign.com' },
    { id: 3, name: 'BuildStack Inc', tier: 'Silver', amount: 2500, logo: 'fa-layer-group', color: '#9ca3af', email: 'info@buildstack.io' },
];

const RevenueBar = ({ label, amount, max, color, delay = 0 }) => {
    const pct = Math.min(100, Math.max(0, Math.round((amount / max) * 100)));
    return (
        <div className="anim-fade-up" style={{ marginBottom: '18px', animationDelay: `${delay}ms` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>{label}</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color }}>${amount.toLocaleString()}</span>
            </div>
            <div className="bar-track">
                <div className="bar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}88)`, animationDelay: `${delay + 100}ms` }}></div>
            </div>
        </div>
    );
};

const FinanceSponsors = () => {
    const [data, setData] = useState({ expenses: [], sponsorshipIncome: 15000, ticketRevenue: 0 });
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const { showToast } = useToast();

    // Interactive Sponsors state
    const [sponsors, setSponsors] = useState(DEFAULT_SPONSORS);
    const [showSponsorModal, setShowSponsorModal] = useState(false);
    const [newSponsorName, setNewSponsorName] = useState('');
    const [newSponsorTier, setNewSponsorTier] = useState('Gold');
    const [newSponsorAmount, setNewSponsorAmount] = useState('');
    const [newSponsorEmail, setNewSponsorEmail] = useState('');

    // Calculator state
    const [calcAttendees, setCalcAttendees] = useState(250);
    const [calcTicketPrice, setCalcTicketPrice] = useState(75);
    const [calcVenue, setCalcVenue] = useState(4500);
    const [calcCatering, setCalcCatering] = useState(3000);
    const [calcMarketing, setCalcMarketing] = useState(1500);
    const [calcAudioVisual, setCalcAudioVisual] = useState(1200);

    const load = async () => {
        try { setLoading(true); const res = await financeAPI.getAll(); setData(res.data); }
        catch { showToast('Failed to load finance ledger', 'error'); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            await financeAPI.addExpense({ title, amount: parseFloat(amount) || 0 });
            showToast('Expense recorded!', 'success');
            setTitle('');
            setAmount('');
            load();
        } catch { showToast('Failed to add expense', 'error'); }
    };

    const handleAddSponsor = (e) => {
        e.preventDefault();
        if (!newSponsorName.trim() || !newSponsorAmount) return;
        const tierColors = { Platinum: '#38bdf8', Gold: '#fbbf24', Silver: '#9ca3af', Bronze: '#cd7f32' };
        const newSponsor = {
            id: Date.now(),
            name: newSponsorName,
            tier: newSponsorTier,
            amount: parseFloat(newSponsorAmount) || 0,
            logo: newSponsorTier === 'Platinum' ? 'fa-crown' : newSponsorTier === 'Gold' ? 'fa-award' : 'fa-handshake',
            color: tierColors[newSponsorTier] || '#38bdf8',
            email: newSponsorEmail || 'contact@sponsor.com',
        };
        setSponsors([newSponsor, ...sponsors]);
        setShowSponsorModal(false);
        setNewSponsorName('');
        setNewSponsorAmount('');
        setNewSponsorEmail('');
        showToast(`Sponsor ${newSponsor.name} added!`, 'success');
    };

    const handleDeleteSponsor = (id, name) => {
        setSponsors(sponsors.filter(s => s.id !== id));
        showToast(`Sponsor ${name} removed`, 'info');
    };

    // Dynamic Calculations
    const dynamicSponsorshipIncome = sponsors.reduce((acc, s) => acc + (s.amount || 0), 0);
    const totalExpenses = data.expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const totalIncome = (data.ticketRevenue || 0) + dynamicSponsorshipIncome;
    const netSurplus = totalIncome - totalExpenses;
    const maxVal = Math.max(totalIncome, totalExpenses, 1);

    // Financial Calculator outputs
    const calcGrossTicketRevenue = calcAttendees * calcTicketPrice;
    const calcTotalIncome = calcGrossTicketRevenue + dynamicSponsorshipIncome;
    const calcTotalExpenses = calcVenue + calcCatering + calcMarketing + calcAudioVisual;
    const calcNetProfit = calcTotalIncome - calcTotalExpenses;
    const calcMarginPct = calcTotalIncome > 0 ? Math.round((calcNetProfit / calcTotalIncome) * 100) : 0;
    const calcBreakEvenPrice = calcAttendees > 0 ? Math.max(0, Math.ceil((calcTotalExpenses - dynamicSponsorshipIncome) / calcAttendees)) : 0;

    const statCards = [
        { label: 'Ticket Revenue', val: data.ticketRevenue || 0, icon: 'fa-ticket-alt', color: '#38bdf8', glow: 'card-glow-indigo', prefix: '$' },
        { label: 'Sponsorships', val: dynamicSponsorshipIncome, icon: 'fa-handshake', color: '#60a5fa', glow: 'card-glow-indigo', prefix: '$' },
        { label: 'Total Expenses', val: totalExpenses, icon: 'fa-receipt', color: '#fbbf24', glow: 'card-glow-amber', prefix: '$' },
        { label: 'Net Surplus', val: netSurplus, icon: 'fa-chart-line', color: netSurplus >= 0 ? '#34d399' : '#ef4444', glow: netSurplus >= 0 ? 'card-glow-emerald' : '', prefix: '$' },
    ];

    return (
        <div>
            {/* Hero Header */}
            <div className="page-hero anim-fade-down" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(37,99,235,0.4)', flexShrink: 0, animation: 'floatUpDown 3s ease-in-out infinite' }}>
                        <i className="fas fa-dollar-sign" style={{ color: '#fff', fontSize: '1.4rem' }}></i>
                    </div>
                    <div>
                        <h1 className="page-hero-title">Finance, Sponsors & ROI Calculator</h1>
                        <p className="page-hero-sub">Live revenue ledger, sponsor management, and event budget calculator</p>
                    </div>
                </div>

                <button onClick={() => setShowSponsorModal(true)} className="btn blue-glow-btn" style={{ padding: '12px 22px', borderRadius: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-plus-circle"></i> Add New Sponsor
                </button>
            </div>

            {/* Stat Cards */}
            <div className="stats-grid" style={{ marginTop: '0' }}>
                {statCards.map((s, i) => (
                    <div key={s.label} className={`stat-card blue-card-glass anim-fade-up shimmer-card`} style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="stat-icon" style={{ background: `${s.color}22`, borderRadius: '14px', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className={`fas ${s.icon}`} style={{ color: s.color, fontSize: '1.2rem' }}></i>
                        </div>
                        <div className="stat-content">
                            <h3>{s.label}</h3>
                            <p className="stat-value" style={{ color: s.color, fontSize: '1.8rem', fontWeight: 800 }}>{s.prefix}{s.val.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '22px', marginTop: '24px' }}>

                {/* Revenue Breakdown */}
                <div className="blue-card-glass anim-slide-left" style={{ padding: '28px', borderRadius: '18px' }}>
                    <h3 style={{ margin: '0 0 20px', fontWeight: 700, color: '#f8fafc' }}>
                        <i className="fas fa-chart-bar" style={{ marginRight: '10px', color: '#38bdf8' }}></i>Live Revenue Breakdown
                    </h3>
                    <RevenueBar label="Ticket Revenue" amount={data.ticketRevenue || 0} max={maxVal} color="#38bdf8" delay={100} />
                    <RevenueBar label="Sponsorships" amount={dynamicSponsorshipIncome} max={maxVal} color="#60a5fa" delay={200} />
                    <RevenueBar label="Total Expenses" amount={totalExpenses} max={maxVal} color="#ef4444" delay={300} />
                    
                    <div style={{ marginTop: '20px', padding: '16px', background: netSurplus >= 0 ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)', borderRadius: '12px', border: `1px solid ${netSurplus >= 0 ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`, textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8' }}>Net Surplus / Deficit</p>
                        <p style={{ margin: '6px 0 0', fontSize: '1.7rem', fontWeight: 800, color: netSurplus >= 0 ? '#34d399' : '#ef4444' }}>
                            {netSurplus >= 0 ? '+' : ''}${netSurplus.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Record Expense Ledger */}
                <div className="blue-card-glass anim-fade-up" style={{ padding: '28px', borderRadius: '18px' }}>
                    <h3 style={{ margin: '0 0 20px', fontWeight: 700, color: '#f8fafc' }}>
                        <i className="fas fa-receipt" style={{ marginRight: '10px', color: '#fbbf24' }}></i>Record Expense
                    </h3>
                    <form onSubmit={handleAddExpense}>
                        <div className="input-group">
                            <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Description</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="form-input" placeholder="e.g. Catering & Snacks" style={{ width: '100%', height: '42px', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(56,189,248,0.25)', color: '#fff', borderRadius: '10px' }} />
                        </div>
                        <div className="input-group" style={{ marginTop: '14px' }}>
                            <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Amount ($)</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required className="form-input" placeholder="0.00" style={{ width: '100%', height: '42px', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(56,189,248,0.25)', color: '#fff', borderRadius: '10px' }} />
                        </div>
                        <button type="submit" className="btn blue-glow-btn" style={{ marginTop: '18px', width: '100%', height: '44px', borderRadius: '10px', fontWeight: 600 }}>
                            <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>Record Expense
                        </button>
                    </form>

                    <div style={{ marginTop: '22px' }}>
                        <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#94a3b8' }}>Recent Expense Entries</h4>
                        {data.expenses.length === 0 ? (
                            <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', padding: '16px 0' }}>No expenses recorded yet</p>
                        ) : data.expenses.slice(-4).reverse().map((e, i) => (
                            <div key={e.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ fontSize: '0.88rem', color: '#e2e8f0' }}>{e.title}</span>
                                <strong style={{ color: '#f87171', fontSize: '0.9rem' }}>-${e.amount}</strong>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sponsor Management */}
                <div className="blue-card-glass anim-slide-right" style={{ padding: '28px', borderRadius: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontWeight: 700, color: '#f8fafc' }}>
                            <i className="fas fa-handshake" style={{ marginRight: '10px', color: '#38bdf8' }}></i>Active Sponsors
                        </h3>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, background: 'rgba(56,189,248,0.15)', color: '#38bdf8', padding: '4px 12px', borderRadius: '20px' }}>
                            {sponsors.length} Sponsors
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '340px', overflowY: 'auto' }}>
                        {sponsors.map((s) => (
                            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}40`, borderRadius: '12px' }}>
                                <div style={{ width: 42, height: 42, borderRadius: '10px', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <i className={`fas ${s.logo}`} style={{ color: s.color, fontSize: '1.1rem' }}></i>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.92rem', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</p>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: s.color, background: `${s.color}22`, padding: '2px 8px', borderRadius: '10px' }}>{s.tier}</span>
                                    </div>
                                    <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>{s.email}</p>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontWeight: 800, fontSize: '0.98rem', color: s.color }}>${s.amount.toLocaleString()}</span>
                                    <button onClick={() => handleDeleteSponsor(s.id, s.name)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }} title="Remove Sponsor">
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Event Financial & ROI Calculator */}
            <div className="blue-card-glass anim-fade-up" style={{ marginTop: '28px', padding: '30px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(56,189,248,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-calculator" style={{ color: '#38bdf8', fontSize: '1.4rem' }}></i>
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>Event Budget & ROI Calculator</h3>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem' }}>Simulate attendance, ticket pricing, venue costs, and profitability margins</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    {/* Calculator Inputs */}
                    <div style={{ background: 'rgba(15,23,42,0.6)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <h4 style={{ margin: '0 0 14px', color: '#38bdf8', fontSize: '0.95rem' }}><i className="fas fa-users" style={{ marginRight: '8px' }}></i>Attendance & Ticket Price</h4>
                        <div className="input-group">
                            <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Expected Attendees</label>
                            <input type="number" value={calcAttendees} onChange={e => setCalcAttendees(parseInt(e.target.value) || 0)} className="form-input" style={{ width: '100%', height: '40px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '8px' }} />
                        </div>
                        <div className="input-group" style={{ marginTop: '12px' }}>
                            <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Average Ticket Price ($)</label>
                            <input type="number" value={calcTicketPrice} onChange={e => setCalcTicketPrice(parseFloat(e.target.value) || 0)} className="form-input" style={{ width: '100%', height: '40px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '8px' }} />
                        </div>
                    </div>

                    <div style={{ background: 'rgba(15,23,42,0.6)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <h4 style={{ margin: '0 0 14px', color: '#fbbf24', fontSize: '0.95rem' }}><i className="fas fa-building" style={{ marginRight: '8px' }}></i>Venue & Logistics Costs</h4>
                        <div className="input-group">
                            <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Venue Rental ($)</label>
                            <input type="number" value={calcVenue} onChange={e => setCalcVenue(parseFloat(e.target.value) || 0)} className="form-input" style={{ width: '100%', height: '40px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '8px' }} />
                        </div>
                        <div className="input-group" style={{ marginTop: '12px' }}>
                            <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Catering & Drinks ($)</label>
                            <input type="number" value={calcCatering} onChange={e => setCalcCatering(parseFloat(e.target.value) || 0)} className="form-input" style={{ width: '100%', height: '40px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '8px' }} />
                        </div>
                    </div>

                    <div style={{ background: 'rgba(15,23,42,0.6)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <h4 style={{ margin: '0 0 14px', color: '#60a5fa', fontSize: '0.95rem' }}><i className="fas fa-bullhorn" style={{ marginRight: '8px' }}></i>Marketing & Audio/Visual</h4>
                        <div className="input-group">
                            <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Marketing & Ads ($)</label>
                            <input type="number" value={calcMarketing} onChange={e => setCalcMarketing(parseFloat(e.target.value) || 0)} className="form-input" style={{ width: '100%', height: '40px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '8px' }} />
                        </div>
                        <div className="input-group" style={{ marginTop: '12px' }}>
                            <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>A/V & Equipment ($)</label>
                            <input type="number" value={calcAudioVisual} onChange={e => setCalcAudioVisual(parseFloat(e.target.value) || 0)} className="form-input" style={{ width: '100%', height: '40px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '8px' }} />
                        </div>
                    </div>

                    {/* Calculator Results */}
                    <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(2,132,199,0.15))', padding: '20px', borderRadius: '14px', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <h4 style={{ margin: '0 0 12px', color: '#fff', fontSize: '1rem', fontWeight: 700 }}>Simulated Financial Results</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
                                <span>Gross Revenue:</span>
                                <strong style={{ color: '#38bdf8' }}>${calcTotalIncome.toLocaleString()}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
                                <span>Total Costs:</span>
                                <strong style={{ color: '#ef4444' }}>-${calcTotalExpenses.toLocaleString()}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
                                <span>Profit Margin:</span>
                                <strong style={{ color: calcMarginPct >= 0 ? '#34d399' : '#ef4444' }}>{calcMarginPct}%</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
                                <span>Break-Even Ticket:</span>
                                <strong style={{ color: '#fbbf24' }}>${calcBreakEvenPrice}/guest</strong>
                            </div>
                        </div>

                        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.78rem', color: '#7dd3fc', uppercase: true }}>Projected Profit</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: calcNetProfit >= 0 ? '#34d399' : '#ef4444' }}>
                                ${calcNetProfit.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Sponsor Modal */}
            {showSponsorModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="blue-card-glass" style={{ width: '100%', maxWidth: '480px', padding: '30px', borderRadius: '20px', border: '1px solid rgba(56,189,248,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>Add New Event Sponsor</h3>
                            <button onClick={() => setShowSponsorModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleAddSponsor}>
                            <div className="input-group">
                                <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Sponsor Company Name</label>
                                <input type="text" value={newSponsorName} onChange={e => setNewSponsorName(e.target.value)} required placeholder="e.g. Acme Corporation" className="form-input" style={{ width: '100%', height: '42px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '10px' }} />
                            </div>

                            <div className="input-group" style={{ marginTop: '14px' }}>
                                <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Sponsorship Tier</label>
                                <select value={newSponsorTier} onChange={e => setNewSponsorTier(e.target.value)} className="form-input" style={{ width: '100%', height: '42px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '10px' }}>
                                    <option value="Platinum">Platinum ($8,000+)</option>
                                    <option value="Gold">Gold ($4,500+)</option>
                                    <option value="Silver">Silver ($2,500+)</option>
                                    <option value="Bronze">Bronze ($1,000+)</option>
                                </select>
                            </div>

                            <div className="input-group" style={{ marginTop: '14px' }}>
                                <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Contribution Amount ($)</label>
                                <input type="number" value={newSponsorAmount} onChange={e => setNewSponsorAmount(e.target.value)} required placeholder="5000" className="form-input" style={{ width: '100%', height: '42px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '10px' }} />
                            </div>

                            <div className="input-group" style={{ marginTop: '14px' }}>
                                <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Contact Email</label>
                                <input type="email" value={newSponsorEmail} onChange={e => setNewSponsorEmail(e.target.value)} placeholder="contact@acme.com" className="form-input" style={{ width: '100%', height: '42px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '10px' }} />
                            </div>

                            <button type="submit" className="btn blue-glow-btn" style={{ width: '100%', height: '46px', marginTop: '22px', borderRadius: '10px', fontWeight: 600 }}>
                                <i className="fas fa-handshake" style={{ marginRight: '8px' }}></i> Save & Activate Sponsor
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinanceSponsors;

