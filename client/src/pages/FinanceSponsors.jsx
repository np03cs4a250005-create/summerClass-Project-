import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { financeAPI } from '../services/api';
import { useToast } from '../components/Toast';

const DEFAULT_SPONSORS = [
    { id: 1, eventId: 'ev-1', name: 'TechCorp Global Systems', tier: 'Platinum Title Sponsor', amount: 12500, logo: 'fa-microchip', color: '#38bdf8', email: 'sponsor@techcorp.com', status: 'Paid & Signed', contractDate: '2026-07-15' },
    { id: 2, eventId: 'ev-1', name: 'InnovaDesign Creative Studio', tier: 'Gold Partner', amount: 7500, logo: 'fa-palette', color: '#fbbf24', email: 'partners@innovadesign.com', status: 'Paid & Signed', contractDate: '2026-07-20' },
    { id: 3, eventId: 'ev-2', name: 'BuildStack Cyber Cloud', tier: 'Silver Tech Sponsor', amount: 4500, logo: 'fa-layer-group', color: '#c084fc', email: 'info@buildstack.io', status: 'Pledged', contractDate: '2026-08-01' },
    { id: 4, eventId: 'ev-1', name: 'Nepal Telecom & Fiber', tier: 'Gold Partner', amount: 6000, logo: 'fa-tower-cell', color: '#34d399', email: 'corporate@ntc.np', status: 'Paid & Signed', contractDate: '2026-07-28' },
    { id: 5, eventId: 'ev-3', name: 'EcoVentures Green Energy', tier: 'Platinum Title Sponsor', amount: 15000, logo: 'fa-leaf', color: '#34d399', email: 'sponsorships@ecoventures.org', status: 'Paid & Signed', contractDate: '2026-08-05' }
];

const DEFAULT_EXPENSES = [
    { id: 101, eventId: 'ev-1', title: 'Main Grand Auditorium & Hall Rental', category: 'Venue', amount: 4500, status: 'Paid', date: '2026-07-10', vendor: 'KICC International Center' },
    { id: 102, eventId: 'ev-1', title: 'VIP Executive Buffet & Coffee Break', category: 'Catering', amount: 3200, status: 'Paid', date: '2026-07-18', vendor: 'Himalayan Organic Catering' },
    { id: 103, eventId: 'ev-1', title: 'Keynote Speaker Airfare & VIP Suite', category: 'Speakers', amount: 1800, status: 'Pending', date: '2026-08-02', vendor: 'Air Nepal Travels' },
    { id: 104, eventId: 'ev-1', title: 'Digital Billboard & Meta Ads Campaign', category: 'Marketing', amount: 1200, status: 'Paid', date: '2026-07-25', vendor: 'CyberMedia Marketing' },
    { id: 105, eventId: 'ev-2', title: 'Stage 4K LED Screen & Sound Rig', category: 'Equipment', amount: 2100, status: 'Paid', date: '2026-08-01', vendor: 'SoundWave A/V Systems' }
];

const SAMPLE_EVENTS = [
    { id: 'all', title: 'All Combined Events' },
    { id: 'ev-1', title: 'Global Tech Conference 2026' },
    { id: 'ev-2', title: 'Creative Design & UX Summit' },
    { id: 'ev-3', title: 'CleanTech & Green Energy Expo' }
];

const RevenueBar = ({ label, amount, max, color, delay = 0 }) => {
    const pct = Math.min(100, Math.max(0, Math.round((amount / max) * 100)));
    return (
        <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.86rem', fontWeight: 600 }}>
                <span style={{ color: '#e2e8f0' }}>{label}</span>
                <span style={{ color, fontWeight: 800 }}>${amount.toLocaleString()} ({pct}%)</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', borderRadius: '10px', background: `linear-gradient(90deg, ${color}, ${color}dd)`, transition: 'width 0.6s ease' }}></div>
            </div>
        </div>
    );
};

const FinanceSponsors = () => {
    const { showToast } = useToast();
    const [selectedEventId, setSelectedEventId] = useState('all');
    const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
    const [sponsors, setSponsors] = useState(DEFAULT_SPONSORS);
    const [ticketRevenue, setTicketRevenue] = useState(24850);

    const [expenseFilter, setExpenseFilter] = useState('All');
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showSponsorModal, setShowSponsorModal] = useState(false);

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Venue');

    const [newSponsorName, setNewSponsorName] = useState('');
    const [newSponsorTier, setNewSponsorTier] = useState('Gold Partner');
    const [newSponsorAmount, setNewSponsorAmount] = useState('');
    const [newSponsorEmail, setNewSponsorEmail] = useState('');

    const [calcAttendees, setCalcAttendees] = useState(350);
    const [calcTicketPrice, setCalcTicketPrice] = useState(95);
    const [calcVenue, setCalcVenue] = useState(5500);
    const [calcCatering, setCalcCatering] = useState(3800);
    const [calcMarketing, setCalcMarketing] = useState(2000);
    const [calcAudioVisual, setCalcAudioVisual] = useState(1800);

    useEffect(() => {
        financeAPI.getSummary()
            .then(r => {
                if (r.data) {
                    if (Array.isArray(r.data.expenses) && r.data.expenses.length > 0) {
                        setExpenses(prev => [...prev, ...r.data.expenses.filter(e => !prev.some(p => p.id === e.id))]);
                    }
                    if (Array.isArray(r.data.sponsors) && r.data.sponsors.length > 0) {
                        setSponsors(prev => [...prev, ...r.data.sponsors.filter(s => !prev.some(p => p.id === s.id))]);
                    }
                }
            })
            .catch(() => {});
    }, []);

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

    const handleAddExpenseSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !amount) return;

        const newEntry = {
            id: Date.now(),
            eventId: selectedEventId === 'all' ? 'ev-1' : selectedEventId,
            title: title.trim(),
            category,
            amount: parseFloat(amount) || 0,
            status: 'Paid',
            date: new Date().toISOString().split('T')[0],
            vendor: 'Direct Provider'
        };

        setExpenses([newEntry, ...expenses]);
        setShowExpenseModal(false);
        setTitle('');
        setAmount('');
        showToast('Expense entry recorded successfully!', 'success');
    };

    const handleAddSponsorSubmit = (e) => {
        e.preventDefault();
        if (!newSponsorName.trim() || !newSponsorAmount) return;

        const tierColors = {
            'Platinum Title Sponsor': '#38bdf8',
            'Gold Partner': '#fbbf24',
            'Silver Tech Sponsor': '#c084fc',
            'Community Supporter': '#34d399'
        };

        const newSponsor = {
            id: Date.now(),
            eventId: selectedEventId === 'all' ? 'ev-1' : selectedEventId,
            name: newSponsorName.trim(),
            tier: newSponsorTier,
            amount: parseFloat(newSponsorAmount) || 0,
            logo: newSponsorTier.includes('Platinum') ? 'fa-crown' : newSponsorTier.includes('Gold') ? 'fa-award' : 'fa-handshake',
            color: tierColors[newSponsorTier] || '#38bdf8',
            email: newSponsorEmail.trim() || 'contact@sponsor.com',
            status: 'Paid & Signed',
            contractDate: new Date().toISOString().split('T')[0]
        };

        setSponsors([newSponsor, ...sponsors]);
        setShowSponsorModal(false);
        setNewSponsorName('');
        setNewSponsorAmount('');
        setNewSponsorEmail('');
        showToast(`Sponsor "${newSponsor.name}" activated!`, 'success');
    };

    const handleDeleteSponsor = (id, name) => {
        if (window.confirm(`Are you sure you want to remove sponsor "${name}"?`)) {
            setSponsors(prev => prev.filter(s => s.id !== id));
            showToast(`Sponsor "${name}" removed.`, 'info');
        }
    };

    const handleDeleteExpense = (id, titleStr) => {
        if (window.confirm(`Are you sure you want to delete expense "${titleStr}"?`)) {
            setExpenses(prev => prev.filter(e => e.id !== id));
            showToast(`Expense entry deleted.`, 'info');
        }
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
                            <i className="fas fa-sparkles"></i> GATHERLY FINANCE & SPONSORSHIP ENGINE
                        </div>
                        <h2 style={{ fontSize: '2.3rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #ffffff, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <i className="fas fa-wallet" style={{ color: '#38bdf8' }}></i>
                            Finance, Sponsors & Budget ROI
                        </h2>
                        <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: '0.98rem', maxWidth: '680px' }}>
                            Track live event revenue ledgers, manage corporate sponsorship contracts, and simulate financial ROI profit forecasts.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <select
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            style={{
                                background: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(56, 189, 248, 0.4)',
                                color: '#f8fafc',
                                padding: '12px 18px',
                                borderRadius: '14px',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                outline: 'none'
                            }}>
                            {SAMPLE_EVENTS.map((ev) => (
                                <option key={ev.id} value={ev.id}>{ev.title}</option>
                            ))}
                        </select>

                        <button
                            onClick={handleExportCSV}
                            style={{
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.18)',
                                color: '#f8fafc',
                                padding: '12px 18px',
                                borderRadius: '14px',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                            <i className="fas fa-file-csv"></i> Export CSV
                        </button>

                        <button
                            onClick={() => setShowSponsorModal(true)}
                            style={{
                                background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                                border: 'none',
                                color: '#ffffff',
                                padding: '12px 22px',
                                borderRadius: '14px',
                                fontWeight: 800,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 0 25px rgba(37, 99, 235, 0.5)'
                            }}>
                            <i className="fas fa-handshake"></i> Add Sponsor
                        </button>
                    </div>
                </div>

                {/* 4 KPI Metrics Banner Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
                    <div style={{ background: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontSize: '1.2rem', flexShrink: 0 }}>
                            <i className="fas fa-ticket-simple"></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Ticket Sales Revenue</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>${ticketRevenue.toLocaleString()}</div>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', fontSize: '1.2rem', flexShrink: 0 }}>
                            <i className="fas fa-crown"></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Sponsorship Contributions</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>${dynamicSponsorshipIncome.toLocaleString()}</div>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(244, 114, 182, 0.3)', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(244, 114, 182, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f472b6', fontSize: '1.2rem', flexShrink: 0 }}>
                            <i className="fas fa-receipt"></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Total Recorded Costs</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>${totalExpenses.toLocaleString()}</div>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(9, 13, 22, 0.75)', border: `1px solid ${netSurplus >= 0 ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: netSurplus >= 0 ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: netSurplus >= 0 ? '#34d399' : '#ef4444', fontSize: '1.2rem', flexShrink: 0 }}>
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Net Operating Balance</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: netSurplus >= 0 ? '#34d399' : '#ef4444' }}>
                                {netSurplus >= 0 ? '+' : ''}${netSurplus.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Overview Grid: Balance Progress & Active Sponsors Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '24px', marginBottom: '28px' }}>
                
                {/* Left Card: Revenue & Cost Distribution */}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fas fa-chart-pie" style={{ color: '#38bdf8' }}></i>
                                Revenue vs Cost Balance
                            </h3>

                            <button
                                onClick={() => setShowExpenseModal(true)}
                                style={{
                                    background: 'rgba(56, 189, 248, 0.15)',
                                    border: '1px solid rgba(56, 189, 248, 0.35)',
                                    color: '#38bdf8',
                                    padding: '6px 12px',
                                    borderRadius: '10px',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}>
                                <i className="fas fa-plus" style={{ marginRight: '4px' }}></i> Add Expense
                            </button>
                        </div>

                        <RevenueBar label="Ticket Sales Revenue" amount={ticketRevenue} max={maxVal} color="#38bdf8" />
                        <RevenueBar label="Sponsorship Contributions" amount={dynamicSponsorshipIncome} max={maxVal} color="#fbbf24" />
                        <RevenueBar label="Total Event Expenses" amount={totalExpenses} max={maxVal} color="#f472b6" />
                    </div>

                    <div style={{
                        marginTop: '16px',
                        padding: '16px',
                        background: netSurplus >= 0 ? 'rgba(52, 211, 153, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        borderRadius: '16px',
                        border: `1.5px solid ${netSurplus >= 0 ? 'rgba(52, 211, 153, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
                        textAlign: 'center'
                    }}>
                        <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Net Surplus Operating Cashflow</span>
                        <div style={{ fontSize: '1.9rem', fontWeight: 900, color: netSurplus >= 0 ? '#34d399' : '#ef4444', marginTop: '4px' }}>
                            {netSurplus >= 0 ? '+' : ''}${netSurplus.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Right Card: Corporate Sponsors Showcase */}
                <div style={{
                    background: 'rgba(15, 23, 42, 0.88)',
                    border: '1.5px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(16px)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '18px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-handshake" style={{ color: '#fbbf24' }}></i>
                            Corporate Sponsors & Partners
                        </h3>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fbbf24', background: 'rgba(251, 191, 36, 0.18)', padding: '4px 10px', borderRadius: '12px' }}>
                            {filteredSponsors.length} Active Partners
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '340px', overflowY: 'auto' }}>
                        {filteredSponsors.map((s) => (
                            <div
                                key={s.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justify: 'space-between',
                                    gap: '14px',
                                    padding: '14px 16px',
                                    background: 'rgba(9, 13, 22, 0.8)',
                                    border: `1.5px solid ${s.color}40`,
                                    borderRadius: '16px',
                                    boxShadow: `0 4px 15px ${s.color}10`
                                }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <i className={`fas ${s.logo}`} style={{ color: s.color, fontSize: '1.2rem' }}></i>
                                    </div>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</h4>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: s.color, background: `${s.color}20`, padding: '2px 8px', borderRadius: '10px', border: `1px solid ${s.color}40` }}>{s.tier}</span>
                                        </div>
                                        <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>{s.email} • Contract: {s.contractDate}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontWeight: 900, fontSize: '1.1rem', color: s.color }}>${s.amount.toLocaleString()}</span>
                                    
                                    {/* 100% DEAD-CENTERED Delete Button */}
                                    <button
                                        onClick={() => handleDeleteSponsor(s.id, s.name)}
                                        title="Delete sponsor"
                                        style={{
                                            display: 'grid',
                                            placeItems: 'center',
                                            placeContent: 'center',
                                            width: '32px',
                                            height: '32px',
                                            minWidth: '32px',
                                            minHeight: '32px',
                                            borderRadius: '8px',
                                            background: 'rgba(239, 68, 68, 0.15)',
                                            border: '1px solid rgba(239, 68, 68, 0.35)',
                                            color: '#ef4444',
                                            cursor: 'pointer',
                                            padding: 0,
                                            margin: 0,
                                            boxSizing: 'border-box'
                                        }}>
                                        <i className="fas fa-trash-can" style={{ fontSize: '0.8rem', margin: '0 auto', padding: 0, lineHeight: 1, display: 'block', textCenter: 'center' }}></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Financial ROI Profitability Simulator Panel */}
            <div style={{
                background: 'rgba(15, 23, 42, 0.88)',
                border: '1.5px solid rgba(52, 211, 153, 0.35)',
                borderRadius: '24px',
                padding: '28px',
                marginBottom: '28px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(16px)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34d399', letterSpacing: '1px', textTransform: 'uppercase' }}>PROFITABILITY FORECAST MODEL</span>
                        <h3 style={{ margin: '2px 0 0', fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fas fa-calculator" style={{ color: '#34d399' }}></i>
                            Event ROI & Budget Profit Simulator
                        </h3>
                    </div>

                    <span style={{ background: calcNetProfit >= 0 ? 'rgba(52, 211, 153, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: calcNetProfit >= 0 ? '#34d399' : '#ef4444', border: `1px solid ${calcNetProfit >= 0 ? '#34d399' : '#ef4444'}`, padding: '6px 14px', borderRadius: '16px', fontWeight: 800, fontSize: '0.88rem' }}>
                        Simulated Profit Margin: {calcMarginPct}%
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {/* Sliders Inputs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                                <span>Expected Attendees</span>
                                <span style={{ color: '#38bdf8' }}>{calcAttendees} Guests</span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="1000"
                                step="25"
                                value={calcAttendees}
                                onChange={(e) => setCalcAttendees(Number(e.target.value))}
                                style={{ width: '100%', cursor: 'pointer' }}
                            />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                                <span>Average Ticket Price</span>
                                <span style={{ color: '#34d399' }}>${calcTicketPrice} / Ticket</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="500"
                                step="5"
                                value={calcTicketPrice}
                                onChange={(e) => setCalcTicketPrice(Number(e.target.value))}
                                style={{ width: '100%', cursor: 'pointer' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Venue ($)</label>
                                <input
                                    type="number"
                                    value={calcVenue}
                                    onChange={(e) => setCalcVenue(Number(e.target.value))}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Catering ($)</label>
                                <input
                                    type="number"
                                    value={calcCatering}
                                    onChange={(e) => setCalcCatering(Number(e.target.value))}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Calculated Metrics Showcase Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div style={{ background: 'rgba(9, 13, 22, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '16px' }}>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Forecast Total Revenue</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>${calcTotalIncome.toLocaleString()}</div>
                        </div>

                        <div style={{ background: 'rgba(9, 13, 22, 0.8)', border: '1px solid rgba(244, 114, 182, 0.3)', borderRadius: '16px', padding: '16px' }}>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Forecast Budget Costs</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f472b6', marginTop: '4px' }}>${calcTotalExpenses.toLocaleString()}</div>
                        </div>

                        <div style={{ background: 'rgba(9, 13, 22, 0.8)', border: `1px solid ${calcNetProfit >= 0 ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, borderRadius: '16px', padding: '16px' }}>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Simulated Net Profit</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: calcNetProfit >= 0 ? '#34d399' : '#ef4444', marginTop: '4px' }}>
                                {calcNetProfit >= 0 ? '+' : ''}${calcNetProfit.toLocaleString()}
                            </div>
                        </div>

                        <div style={{ background: 'rgba(9, 13, 22, 0.8)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '16px', padding: '16px' }}>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Break-Even Ticket Price</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>${calcBreakEvenPrice} / seat</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expenses Ledger Table */}
            <div style={{
                background: 'rgba(15, 23, 42, 0.88)',
                border: '1.5px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(16px)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-list-check" style={{ color: '#38bdf8' }}></i>
                        Expense Ledger Table
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {['All', 'Paid', 'Pending'].map((st) => (
                                <button
                                    key={st}
                                    onClick={() => setExpenseFilter(st)}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: '16px',
                                        border: expenseFilter === st ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                                        background: expenseFilter === st ? 'rgba(37, 99, 235, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                                        color: expenseFilter === st ? '#ffffff' : '#94a3b8',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}>
                                    {st}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowExpenseModal(true)}
                            style={{
                                background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                                border: 'none',
                                color: '#ffffff',
                                padding: '8px 16px',
                                borderRadius: '12px',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                            <i className="fas fa-plus"></i> Record Expense
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e2e8f0', fontSize: '0.88rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase', fontSize: '0.75rem', color: '#38bdf8', letterSpacing: '1px' }}>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Description / Vendor</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Category</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Date</th>
                                <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
                                <th style={{ textAlign: 'right', padding: '12px' }}>Amount</th>
                                <th style={{ textAlign: 'center', padding: '12px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.map((exp) => (
                                <tr key={exp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s ease' }}>
                                    <td style={{ padding: '14px 12px' }}>
                                        <div style={{ fontWeight: 700, color: '#f8fafc' }}>{exp.title}</div>
                                        <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Vendor: {exp.vendor}</div>
                                    </td>
                                    <td style={{ padding: '14px 12px' }}>
                                        <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '3px 10px', borderRadius: '10px', fontSize: '0.76rem', fontWeight: 700 }}>
                                            {exp.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 12px', color: '#94a3b8' }}>{exp.date}</td>
                                    <td style={{ padding: '14px 12px' }}>
                                        <span style={{ background: exp.status === 'Paid' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(251, 191, 36, 0.2)', color: exp.status === 'Paid' ? '#34d399' : '#fbbf24', padding: '3px 10px', borderRadius: '10px', fontSize: '0.76rem', fontWeight: 800 }}>
                                            {exp.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: 800, color: '#f472b6', fontSize: '0.98rem' }}>
                                        ${exp.amount.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleDeleteExpense(exp.id, exp.title)}
                                            title="Delete expense"
                                            style={{
                                                display: 'inline-grid',
                                                placeItems: 'center',
                                                placeContent: 'center',
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '8px',
                                                background: 'rgba(239, 68, 68, 0.15)',
                                                border: '1px solid rgba(239, 68, 68, 0.35)',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                padding: 0
                                            }}>
                                            <i className="fas fa-trash-can" style={{ fontSize: '0.78rem', margin: '0 auto', lineHeight: 1 }}></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PORTAL: Add Expense Modal */}
            {showExpenseModal && createPortal(
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
                        maxWidth: '560px',
                        background: 'linear-gradient(135deg, #0f172a 0%, #090d16 100%)',
                        border: '2px solid rgba(56, 189, 248, 0.5)',
                        borderRadius: '28px',
                        padding: '36px',
                        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 60px rgba(56, 189, 248, 0.35)',
                        fontFamily: 'Inter, system-ui, sans-serif'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-receipt" style={{ color: '#38bdf8' }}></i>
                                Record Event Expense
                            </h3>
                            <button
                                onClick={() => setShowExpenseModal(false)}
                                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', width: '38px', height: '38px', borderRadius: '12px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                                <i className="fas fa-times" style={{ margin: 0, fontSize: '1rem' }}></i>
                            </button>
                        </div>

                        <form onSubmit={handleAddExpenseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>Expense Description</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Stage 4K LED Screen & Audio Equipment"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(56, 189, 248, 0.4)', color: '#ffffff', fontSize: '0.95rem', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(56, 189, 248, 0.4)', color: '#ffffff', fontSize: '0.95rem', outline: 'none' }}>
                                        <option value="Venue">Venue</option>
                                        <option value="Catering">Catering</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Speakers">Speakers</option>
                                        <option value="Equipment">Equipment</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>Amount ($)</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="e.g. 2500"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(56, 189, 248, 0.4)', color: '#ffffff', fontSize: '0.95rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '14px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowExpenseModal(false)}
                                    style={{ padding: '12px 24px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '12px 30px', borderRadius: '14px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', border: 'none', color: '#ffffff', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 0 25px rgba(37, 99, 235, 0.5)' }}>
                                    Save Expense Entry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* PORTAL: Add Sponsor Modal */}
            {showSponsorModal && createPortal(
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
                        maxWidth: '600px',
                        background: 'linear-gradient(135deg, #0f172a 0%, #090d16 100%)',
                        border: '2px solid rgba(251, 191, 36, 0.5)',
                        borderRadius: '28px',
                        padding: '36px',
                        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 60px rgba(251, 191, 36, 0.35)',
                        fontFamily: 'Inter, system-ui, sans-serif'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-handshake" style={{ color: '#fbbf24' }}></i>
                                Add Corporate Sponsor
                            </h3>
                            <button
                                onClick={() => setShowSponsorModal(false)}
                                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', width: '38px', height: '38px', borderRadius: '12px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                                <i className="fas fa-times" style={{ margin: 0, fontSize: '1rem' }}></i>
                            </button>
                        </div>

                        <form onSubmit={handleAddSponsorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>Company / Organization Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. TechCorp Global Systems"
                                    value={newSponsorName}
                                    onChange={(e) => setNewSponsorName(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(251, 191, 36, 0.4)', color: '#ffffff', fontSize: '0.95rem', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>Sponsorship Tier</label>
                                    <select
                                        value={newSponsorTier}
                                        onChange={(e) => setNewSponsorTier(e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(251, 191, 36, 0.4)', color: '#ffffff', fontSize: '0.95rem', outline: 'none' }}>
                                        <option value="Platinum Title Sponsor">Platinum Title Sponsor</option>
                                        <option value="Gold Partner">Gold Partner</option>
                                        <option value="Silver Tech Sponsor">Silver Tech Sponsor</option>
                                        <option value="Community Supporter">Community Supporter</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>Pledged Contribution ($)</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="e.g. 7500"
                                        value={newSponsorAmount}
                                        onChange={(e) => setNewSponsorAmount(e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(251, 191, 36, 0.4)', color: '#ffffff', fontSize: '0.95rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>Corporate Contact Email</label>
                                <input
                                    type="email"
                                    placeholder="e.g. sponsor@company.com"
                                    value={newSponsorEmail}
                                    onChange={(e) => setNewSponsorEmail(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(251, 191, 36, 0.4)', color: '#ffffff', fontSize: '0.95rem', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '14px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowSponsorModal(false)}
                                    style={{ padding: '12px 24px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '12px 30px', borderRadius: '14px', background: 'linear-gradient(135deg, #d97706, #fbbf24)', border: 'none', color: '#ffffff', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 0 25px rgba(251, 191, 36, 0.5)' }}>
                                    Activate Partner
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

export default FinanceSponsors;
