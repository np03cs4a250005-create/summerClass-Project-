import React, { useState, useEffect } from 'react';
import { financeAPI } from '../services/api';
import { useToast } from '../components/Toast';

const DEFAULT_SPONSORS = [
    { id: 1, eventId: 'ev-1', name: 'TechCorp Global', tier: 'Platinum Title Sponsor', amount: 8500, logo: 'fa-microchip', color: '#38bdf8', email: 'sponsor@techcorp.com', status: 'Paid & Signed', contractDate: '2026-07-15' },
    { id: 2, eventId: 'ev-1', name: 'InnovaDesign Studio', tier: 'Gold Partner', amount: 4500, logo: 'fa-palette', color: '#fbbf24', email: 'partners@innovadesign.com', status: 'Paid & Signed', contractDate: '2026-07-20' },
    { id: 3, eventId: 'ev-2', name: 'BuildStack Cloud', tier: 'Silver Tech Sponsor', amount: 2500, logo: 'fa-layer-group', color: '#a855f7', email: 'info@buildstack.io', status: 'Pledged', contractDate: '2026-08-01' },
    { id: 4, eventId: 'ev-1', name: 'Nepal Telecom & Cyber', tier: 'Gold Partner', amount: 5000, logo: 'fa-tower-cell', color: '#4ade80', email: 'corporate@ntc.np', status: 'Paid & Signed', contractDate: '2026-07-28' },
];

const DEFAULT_EXPENSES = [
    { id: 101, eventId: 'ev-1', title: 'Main Auditorium & Hall Rental', category: 'Venue', amount: 4500, status: 'Paid', date: '2026-07-10', vendor: 'KICC International' },
    { id: 102, eventId: 'ev-1', title: 'VIP Buffet & Coffee Break Catering', category: 'Catering', amount: 3200, status: 'Paid', date: '2026-07-18', vendor: 'Himalayan Catering' },
    { id: 103, eventId: 'ev-1', title: 'Keynote Speaker Flight & Hotel', category: 'Speakers', amount: 1800, status: 'Pending', date: '2026-08-02', vendor: 'Air Nepal Travel' },
    { id: 104, eventId: 'ev-1', title: 'Digital Billboard & Meta Ads Campaign', category: 'Marketing', amount: 1200, status: 'Paid', date: '2026-07-25', vendor: 'CyberMedia Ads' },
    { id: 105, eventId: 'ev-2', title: 'Stage LED Screen & Audio Equipment', category: 'Equipment', amount: 2100, status: 'Paid', date: '2026-08-01', vendor: 'SoundWave A/V' }
];

const SAMPLE_EVENTS = [
    { id: 'all', title: 'All Combined Events' },
    { id: 'ev-1', title: 'Global Tech Conference 2026' },
    { id: 'ev-2', title: 'Creative Design & UX Summit' },
    { id: 'ev-3', title: 'DevOps & AI Cloud Expo' }
];

const RevenueBar = ({ label, amount, max, color, delay = 0 }) => {
    const pct = Math.min(100, Math.max(0, Math.round((amount / max) * 100)));
    return (
        <div className="anim-fade-up" style={{ marginBottom: '18px', animationDelay: `${delay}ms` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>{label}</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color }}>${amount.toLocaleString()} ({pct}%)</span>
            </div>
            <div className="bar-track" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
                <div className="bar-fill" style={{ width: `${pct}%`, height: '100%', borderRadius: '8px', background: `linear-gradient(90deg, ${color}, ${color}88)`, transition: 'width 0.6s ease' }}></div>
            </div>
        </div>
    );
};

const FinanceSponsors = () => {
    const [selectedEventId, setSelectedEventId] = useState('all');
    const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
    const [sponsors, setSponsors] = useState(DEFAULT_SPONSORS);
    const [ticketRevenue, setTicketRevenue] = useState(18450);

    const [expenseFilter, setExpenseFilter] = useState('All');
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Venue');

    const [showSponsorModal, setShowSponsorModal] = useState(false);
    const [newSponsorName, setNewSponsorName] = useState('');
    const [newSponsorTier, setNewSponsorTier] = useState('Gold Partner');
    const [newSponsorAmount, setNewSponsorAmount] = useState('');
    const [newSponsorEmail, setNewSponsorEmail] = useState('');

    const [calcAttendees, setCalcAttendees] = useState(300);
    const [calcTicketPrice, setCalcTicketPrice] = useState(85);
    const [calcVenue, setCalcVenue] = useState(5000);
    const [calcCatering, setCalcCatering] = useState(3500);
    const [calcMarketing, setCalcMarketing] = useState(1800);
    const [calcAudioVisual, setCalcAudioVisual] = useState(1500);

    const { showToast } = useToast();

    const filteredExpenses = expenses.filter((e) => {
        const matchesEvent = selectedEventId === 'all' || e.eventId === selectedEventId;
        const matchesStatus = expenseFilter === 'All' || e.status === expenseFilter;
        return matchesEvent && matchesStatus;
    });

    const filteredSponsors = sponsors.filter((s) => {
        return selectedEventId === 'all' || s.eventId === selectedEventId;
    });

    const dynamicSponsorshipIncome = filteredSponsors.reduce((acc, s) => acc + (s.amount || 0), 0);
    const totalExpenses = filteredExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const totalIncome = ticketRevenue + dynamicSponsorshipIncome;
    const netSurplus = totalIncome - totalExpenses;
    const maxVal = Math.max(totalIncome, totalExpenses, 1);

    const calcGrossTicketRevenue = calcAttendees * calcTicketPrice;
    const calcTotalIncome = calcGrossTicketRevenue + dynamicSponsorshipIncome;
    const calcTotalExpenses = calcVenue + calcCatering + calcMarketing + calcAudioVisual;
    const calcNetProfit = calcTotalIncome - calcTotalExpenses;
    const calcMarginPct = calcTotalIncome > 0 ? Math.round((calcNetProfit / calcTotalIncome) * 100) : 0;
    const calcBreakEvenPrice = calcAttendees > 0 ? Math.max(0, Math.ceil((calcTotalExpenses - dynamicSponsorshipIncome) / calcAttendees)) : 0;

    const handleAddExpense = (e) => {
        e.preventDefault();
        if (!title.trim() || !amount) return;
        const newEntry = {
            id: Date.now(),
            eventId: selectedEventId === 'all' ? 'ev-1' : selectedEventId,
            title,
            category,
            amount: parseFloat(amount) || 0,
            status: 'Paid',
            date: new Date().toISOString().split('T')[0],
            vendor: 'Direct Provider'
        };
        setExpenses([newEntry, ...expenses]);
        setTitle('');
        setAmount('');
        showToast('Expense successfully recorded!', 'success');
    };

    const handleAddSponsor = (e) => {
        e.preventDefault();
        if (!newSponsorName.trim() || !newSponsorAmount) return;
        const tierColors = {
            'Platinum Title Sponsor': '#38bdf8',
            'Gold Partner': '#fbbf24',
            'Silver Tech Sponsor': '#a855f7',
            'Community Supporter': '#4ade80'
        };
        const newSponsor = {
            id: Date.now(),
            eventId: selectedEventId === 'all' ? 'ev-1' : selectedEventId,
            name: newSponsorName,
            tier: newSponsorTier,
            amount: parseFloat(newSponsorAmount) || 0,
            logo: newSponsorTier.includes('Platinum') ? 'fa-crown' : newSponsorTier.includes('Gold') ? 'fa-award' : 'fa-handshake',
            color: tierColors[newSponsorTier] || '#38bdf8',
            email: newSponsorEmail || 'contact@sponsor.com',
            status: 'Paid & Signed',
            contractDate: new Date().toISOString().split('T')[0]
        };
        setSponsors([newSponsor, ...sponsors]);
        setShowSponsorModal(false);
        setNewSponsorName('');
        setNewSponsorAmount('');
        setNewSponsorEmail('');
        showToast(`Sponsor ${newSponsor.name} activated!`, 'success');
    };

    const handleDeleteSponsor = (id, name) => {
        setSponsors(sponsors.filter((s) => s.id !== id));
        showToast(`Sponsor ${name} removed`, 'info');
    };

    const handleExportCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            "Type,Title/Name,Category/Tier,Amount ($),Status,Date\n" +
            filteredExpenses.map(e => `Expense,"${e.title}",${e.category},${e.amount},${e.status},${e.date}`).join("\n") + "\n" +
            filteredSponsors.map(s => `Sponsorship,"${s.name}",${s.tier},${s.amount},${s.status},${s.contractDate}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Gatherly_Financial_Report_${selectedEventId}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Financial CSV report downloaded!', 'success');
    };

    const statCards = [
        { label: 'Ticket Gross Revenue', val: ticketRevenue, icon: 'fa-ticket-alt', color: '#38bdf8', prefix: '$' },
        { label: 'Sponsorship Income', val: dynamicSponsorshipIncome, icon: 'fa-handshake', color: '#fbbf24', prefix: '$' },
        { label: 'Total Recorded Costs', val: totalExpenses, icon: 'fa-receipt', color: '#f472b6', prefix: '$' },
        { label: 'Net Profit Surplus', val: netSurplus, icon: 'fa-chart-line', color: netSurplus >= 0 ? '#4ade80' : '#ef4444', prefix: '$' }
    ];

    return (
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div className="page-hero anim-fade-down" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 25px rgba(37,99,235,0.4)', flexShrink: 0 }}>
                        <i className="fas fa-wallet" style={{ color: '#fff', fontSize: '1.5rem' }}></i>
                    </div>
                    <div>
                        <h1 className="page-hero-title">Event Finance, Sponsors & ROI Forecast</h1>
                        <p className="page-hero-sub">Live revenue ledger, sponsorship contract manager, and budget profitability simulator</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <select
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        style={{
                            background: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(56, 189, 248, 0.4)',
                            color: '#f8fafc',
                            padding: '10px 16px',
                            borderRadius: '12px',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}>
                        {SAMPLE_EVENTS.map((ev) => (
                            <option key={ev.id} value={ev.id}>{ev.title}</option>
                        ))}
                    </select>

                    <button onClick={handleExportCSV} className="btn" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#f8fafc', padding: '10px 16px', borderRadius: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <i className="fas fa-file-csv"></i> Export CSV
                    </button>

                    <button onClick={() => setShowSponsorModal(true)} className="btn blue-glow-btn" style={{ padding: '10px 20px', borderRadius: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-plus-circle"></i> Add Sponsor
                    </button>
                </div>
            </div>

            <div className="stats-grid" style={{ marginTop: '0', marginBottom: '24px' }}>
                {statCards.map((s, i) => (
                    <div key={s.label} className="stat-card blue-card-glass anim-fade-up" style={{ animationDelay: `${i * 90}ms` }}>
                        <div className="stat-icon" style={{ background: `${s.color}22`, borderRadius: '14px', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className={`fas ${s.icon}`} style={{ color: s.color, fontSize: '1.2rem' }}></i>
                        </div>
                        <div className="stat-content">
                            <h3 style={{ fontSize: '0.88rem', color: '#94a3b8' }}>{s.label}</h3>
                            <p className="stat-value" style={{ color: s.color, fontSize: '1.8rem', fontWeight: 800 }}>
                                {s.prefix}{s.val.toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px', marginBottom: '28px' }}>

                <div className="blue-card-glass anim-slide-left" style={{ padding: '26px', borderRadius: '20px' }}>
                    <h3 style={{ margin: '0 0 20px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-chart-pie text-sky"></i> Revenue vs Cost Balance
                    </h3>
                    <RevenueBar label="Ticket Sales Revenue" amount={ticketRevenue} max={maxVal} color="#38bdf8" delay={100} />
                    <RevenueBar label="Sponsorship Contributions" amount={dynamicSponsorshipIncome} max={maxVal} color="#fbbf24" delay={200} />
                    <RevenueBar label="Total Event Expenses" amount={totalExpenses} max={maxVal} color="#f472b6" delay={300} />

                    <div style={{
                        marginTop: '20px',
                        padding: '16px',
                        background: netSurplus >= 0 ? 'rgba(74, 222, 128, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        borderRadius: '14px',
                        border: `1px solid ${netSurplus >= 0 ? 'rgba(74, 222, 128, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
                        textAlign: 'center'
                    }}>
                        <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Net Operating Balance</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: netSurplus >= 0 ? '#4ade80' : '#ef4444', marginTop: '4px' }}>
                            {netSurplus >= 0 ? '+' : ''}${netSurplus.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="blue-card-glass anim-fade-up" style={{ padding: '26px', borderRadius: '20px' }}>
                    <h3 style={{ margin: '0 0 16px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-receipt text-amber"></i> Record Event Expense
                    </h3>
                    <form onSubmit={handleAddExpense}>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ color: '#cbd5e1', fontSize: '0.82rem', marginBottom: '4px', display: 'block' }}>Expense Description</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="form-input"
                                placeholder="e.g. Stage LED Screen & Audio"
                                style={{ width: '100%', height: '40px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(56,189,248,0.25)', color: '#fff', borderRadius: '10px' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <div>
                                <label style={{ color: '#cbd5e1', fontSize: '0.82rem', marginBottom: '4px', display: 'block' }}>Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="form-input"
                                    style={{ width: '100%', height: '40px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(56,189,248,0.25)', color: '#fff', borderRadius: '10px' }}>
                                    <option value="Venue">Venue</option>
                                    <option value="Catering">Catering</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Speakers">Speakers</option>
                                    <option value="Equipment">Equipment</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ color: '#cbd5e1', fontSize: '0.82rem', marginBottom: '4px', display: 'block' }}>Amount ($)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    className="form-input"
                                    placeholder="1500"
                                    style={{ width: '100%', height: '40px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(56,189,248,0.25)', color: '#fff', borderRadius: '10px' }}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn blue-glow-btn" style={{ width: '100%', height: '44px', borderRadius: '10px', fontWeight: 700 }}>
                            <i className="fas fa-plus" style={{ marginRight: '8px' }}></i> Add Expense Entry
                        </button>
                    </form>
                </div>

                <div className="blue-card-glass anim-slide-right" style={{ padding: '26px', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                        <h3 style={{ margin: 0, fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fas fa-handshake text-sky"></i> Active Sponsors
                        </h3>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, background: 'rgba(56,189,248,0.18)', color: '#38bdf8', padding: '4px 10px', borderRadius: '20px' }}>
                            {filteredSponsors.length} Partners
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                        {filteredSponsors.map((s) => (
                            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}40`, borderRadius: '12px' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '10px', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <i className={`fas ${s.logo}`} style={{ color: s.color, fontSize: '1.1rem' }}></i>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</p>
                                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: s.color, background: `${s.color}22`, padding: '2px 6px', borderRadius: '8px' }}>{s.tier}</span>
                                    </div>
                                    <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#94a3b8' }}>{s.email}</p>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: s.color }}>${s.amount.toLocaleString()}</span>
                                    <button onClick={() => handleDeleteSponsor(s.id, s.name)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }} title="Remove Sponsor">
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="blue-card-glass" style={{ padding: '24px', borderRadius: '20px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-list-check text-sky"></i> Expense Ledger Table
                    </h3>

                    <div style={{ display: 'flex', gap: '6px' }}>
                        {['All', 'Paid', 'Pending'].map((st) => (
                            <button
                                key={st}
                                onClick={() => setExpenseFilter(st)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: expenseFilter === st ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255,255,255,0.06)',
                                    color: expenseFilter === st ? '#38bdf8' : '#94a3b8',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}>
                                {st}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                                <th style={{ padding: '10px' }}>Date</th>
                                <th style={{ padding: '10px' }}>Title Description</th>
                                <th style={{ padding: '10px' }}>Category</th>
                                <th style={{ padding: '10px' }}>Vendor</th>
                                <th style={{ padding: '10px' }}>Amount</th>
                                <th style={{ padding: '10px' }}>Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.map((exp) => (
                                <tr key={exp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#f8fafc' }}>
                                    <td style={{ padding: '12px 10px', color: '#94a3b8' }}>{exp.date}</td>
                                    <td style={{ padding: '12px 10px', fontWeight: 700 }}>{exp.title}</td>
                                    <td style={{ padding: '12px 10px' }}>
                                        <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '8px' }}>{exp.category}</span>
                                    </td>
                                    <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>{exp.vendor}</td>
                                    <td style={{ padding: '12px 10px', fontWeight: 800, color: '#f87171' }}>-${exp.amount.toLocaleString()}</td>
                                    <td style={{ padding: '12px 10px' }}>
                                        <span className={`badge ${exp.status === 'Paid' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.75rem' }}>
                                            {exp.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="blue-card-glass anim-fade-up" style={{ padding: '28px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(56,189,248,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-calculator" style={{ color: '#38bdf8', fontSize: '1.4rem' }}></i>
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Interactive Event ROI & Budget Simulator</h3>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem' }}>Simulate expected attendees, ticket prices, venue costs, and profit margins</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    <div style={{ background: 'rgba(15,23,42,0.6)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <h4 style={{ margin: '0 0 12px', color: '#38bdf8', fontSize: '0.92rem' }}><i className="fas fa-users" style={{ marginRight: '8px' }}></i>Ticket Sales Inputs</h4>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Expected Attendees: {calcAttendees}</label>
                            <input type="number" value={calcAttendees} onChange={(e) => setCalcAttendees(parseInt(e.target.value) || 0)} className="form-input" style={{ width: '100%', height: '38px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '8px', marginTop: '4px' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Avg Ticket Price ($): ${calcTicketPrice}</label>
                            <input type="number" value={calcTicketPrice} onChange={(e) => setCalcTicketPrice(parseFloat(e.target.value) || 0)} className="form-input" style={{ width: '100%', height: '38px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '8px', marginTop: '4px' }} />
                        </div>
                    </div>

                    <div style={{ background: 'rgba(15,23,42,0.6)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <h4 style={{ margin: '0 0 12px', color: '#fbbf24', fontSize: '0.92rem' }}><i className="fas fa-building" style={{ marginRight: '8px' }}></i>Venue & Logistics</h4>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Venue Rental ($)</label>
                            <input type="number" value={calcVenue} onChange={(e) => setCalcVenue(parseFloat(e.target.value) || 0)} className="form-input" style={{ width: '100%', height: '38px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '8px', marginTop: '4px' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Catering & Drinks ($)</label>
                            <input type="number" value={calcCatering} onChange={(e) => setCalcCatering(parseFloat(e.target.value) || 0)} className="form-input" style={{ width: '100%', height: '38px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '8px', marginTop: '4px' }} />
                        </div>
                    </div>

                    <div style={{ background: 'rgba(15,23,42,0.6)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <h4 style={{ margin: '0 0 12px', color: '#f472b6', fontSize: '0.92rem' }}><i className="fas fa-bullhorn" style={{ marginRight: '8px' }}></i>Ads & Equipment</h4>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Marketing Ads ($)</label>
                            <input type="number" value={calcMarketing} onChange={(e) => setCalcMarketing(parseFloat(e.target.value) || 0)} className="form-input" style={{ width: '100%', height: '38px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '8px', marginTop: '4px' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>A/V & Equipment ($)</label>
                            <input type="number" value={calcAudioVisual} onChange={(e) => setCalcAudioVisual(parseFloat(e.target.value) || 0)} className="form-input" style={{ width: '100%', height: '38px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '8px', marginTop: '4px' }} />
                        </div>
                    </div>

                    <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(2,132,199,0.15))', padding: '18px', borderRadius: '14px', border: '1px solid rgba(56,189,248,0.35)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <h4 style={{ margin: '0 0 10px', color: '#fff', fontSize: '0.95rem', fontWeight: 800 }}>Forecast Results</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                                <span>Gross Income:</span>
                                <strong style={{ color: '#38bdf8' }}>${calcTotalIncome.toLocaleString()}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                                <span>Total Costs:</span>
                                <strong style={{ color: '#ef4444' }}>-${calcTotalExpenses.toLocaleString()}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                                <span>Profit Margin:</span>
                                <strong style={{ color: calcMarginPct >= 0 ? '#4ade80' : '#ef4444' }}>{calcMarginPct}%</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                                <span>Break-Even Ticket:</span>
                                <strong style={{ color: '#fbbf24' }}>${calcBreakEvenPrice}/guest</strong>
                            </div>
                        </div>

                        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', color: '#7dd3fc', textTransform: 'uppercase', fontWeight: 700 }}>Simulated Net Profit</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: calcNetProfit >= 0 ? '#4ade80' : '#ef4444' }}>
                                ${calcNetProfit.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showSponsorModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="blue-card-glass" style={{ width: '100%', maxWidth: '480px', padding: '28px', borderRadius: '20px', border: '1.5px solid rgba(56,189,248,0.4)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Add Event Sponsor Partner</h3>
                            <button onClick={() => setShowSponsorModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleAddSponsor}>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ color: '#cbd5e1', fontSize: '0.82rem', marginBottom: '4px', display: 'block' }}>Company Name</label>
                                <input type="text" value={newSponsorName} onChange={(e) => setNewSponsorName(e.target.value)} required placeholder="e.g. Acme Global Corp" className="form-input" style={{ width: '100%', height: '40px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '10px' }} />
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ color: '#cbd5e1', fontSize: '0.82rem', marginBottom: '4px', display: 'block' }}>Sponsorship Tier</label>
                                <select value={newSponsorTier} onChange={(e) => setNewSponsorTier(e.target.value)} className="form-input" style={{ width: '100%', height: '40px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '10px' }}>
                                    <option value="Platinum Title Sponsor">Platinum Title Sponsor ($8,500+)</option>
                                    <option value="Gold Partner">Gold Partner ($4,500+)</option>
                                    <option value="Silver Tech Sponsor">Silver Tech Sponsor ($2,500+)</option>
                                    <option value="Community Supporter">Community Supporter ($1,000+)</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ color: '#cbd5e1', fontSize: '0.82rem', marginBottom: '4px', display: 'block' }}>Contribution Amount ($)</label>
                                <input type="number" value={newSponsorAmount} onChange={(e) => setNewSponsorAmount(e.target.value)} required placeholder="5000" className="form-input" style={{ width: '100%', height: '40px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '10px' }} />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ color: '#cbd5e1', fontSize: '0.82rem', marginBottom: '4px', display: 'block' }}>Contact Email</label>
                                <input type="email" value={newSponsorEmail} onChange={(e) => setNewSponsorEmail(e.target.value)} placeholder="contact@acme.com" className="form-input" style={{ width: '100%', height: '40px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '10px' }} />
                            </div>

                            <button type="submit" className="btn blue-glow-btn" style={{ width: '100%', height: '44px', borderRadius: '10px', fontWeight: 700 }}>
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
