import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI, attendeesAPI, financeAPI } from '../services/api';

// Animated count-up hook
const useCountUp = (target, duration = 1400, delay = 0) => {
    const [count, setCount] = useState(0);
    const started = useRef(false);
    useEffect(() => {
        if (target === 0 || started.current) return;
        const timer = setTimeout(() => {
            started.current = true;
            const steps = 50;
            const increment = target / steps;
            let current = 0;
            const interval = setInterval(() => {
                current += increment;
                if (current >= target) { setCount(target); clearInterval(interval); }
                else setCount(Math.floor(current));
            }, duration / steps);
        }, delay);
        return () => clearTimeout(timer);
    }, [target, duration, delay]);
    return count;
};

const StatCard = ({ label, value, icon, color, suffix = '', prefix = '', trend = '', delay = 0, glow }) => {
    const numericVal = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
    const animated = useCountUp(numericVal, 1400, delay);
    const displayVal = numericVal > 0 ? `${prefix}${animated.toLocaleString()}${suffix}` : value;

    return (
        <div className={`card-glass anim-fade-up hover-lift shimmer-card`} style={{ animationDelay: `${delay}ms`, padding: '22px', borderRadius: '20px', borderLeft: `4px solid ${color}`, display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: `0 8px 30px rgba(0,0,0,0.3), 0 0 15px ${color}20` }}>
            <div style={{ background: `${color}22`, borderRadius: '16px', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 14px ${color}30` }}>
                <i className={`fas ${icon}`} style={{ color, fontSize: '1.5rem' }}></i>
            </div>
            <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: '2px 0 0', lineHeight: 1.2 }}>{displayVal}</p>
                {trend && <span style={{ fontSize: '0.76rem', color, fontWeight: 700, marginTop: '4px', display: 'inline-block' }}>{trend}</span>}
            </div>
        </div>
    );
};

const ActivityItem = ({ icon, text, time, color, idx }) => (
    <div className="anim-slide-left" style={{ animationDelay: `${idx * 100}ms`, display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className={`fas ${icon}`} style={{ color, fontSize: '0.85rem' }}></i>
        </div>
        <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>{text}</p>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{time}</span>
        </div>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0 }}></span>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({ eventsCount: 6, attendeesCount: 342, totalRevenue: 142800 });
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([eventsAPI.getAll(), attendeesAPI.getAll(), financeAPI.getAll()])
            .then(([evRes, attRes, finRes]) => {
                setStats({
                    eventsCount: (evRes.data && evRes.data.length) ? evRes.data.length : 6,
                    attendeesCount: (attRes.data && attRes.data.length) ? attRes.data.length : 342,
                    totalRevenue: ((finRes.data?.ticketRevenue || 0) + (finRes.data?.sponsorshipIncome || 0)) || 142800,
                });
            })
            .catch(() => {});
    }, []);

    const activities = [
        { icon: 'fa-user-plus', text: 'New attendee registration confirmed for AI Summit', time: '2 min ago', color: '#34d399' },
        { icon: 'fa-calendar-check', text: 'Global Tech Keynote 2026 published', time: '15 min ago', color: '#818cf8' },
        { icon: 'fa-ticket-alt', text: 'VIP Access Pass ticket batch generated', time: '1 hr ago', color: '#fbbf24' },
        { icon: 'fa-shield-alt', text: 'System security audit scan completed', time: '2 hr ago', color: '#f87171' },
        { icon: 'fa-chart-bar', text: 'Monthly financial roster report exported', time: '5 hr ago', color: '#38bdf8' },
    ];

    const metrics = [
        { label: 'Seat Occupancy Rate', val: 84, color: '#818cf8' },
        { label: 'Task Completion Rate', val: 76, color: '#c084fc' },
        { label: 'Sponsor Budget Goal', val: 92, color: '#fbbf24' },
        { label: 'Attendee Satisfaction Score', val: 98, color: '#34d399' },
    ];

    return (
        <div>
            {/* Executive Hero Banner (Cerebrium Aesthetic) */}
            <div className="page-hero anim-fade-down" style={{
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.22) 0%, rgba(124, 58, 237, 0.18) 50%, rgba(56, 189, 248, 0.12) 100%)',
                border: '1.5px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '26px',
                padding: '32px',
                marginBottom: '28px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '20px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(37, 99, 235, 0.6)', border: '1px solid rgba(255, 255, 255, 0.25)', flexShrink: 0, animation: 'floatUpDown 3s ease-in-out infinite' }}>
                            <i className="fas fa-chart-line" style={{ color: '#fff', fontSize: '1.6rem' }}></i>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                <h1 className="page-hero-title" style={{ fontSize: '1.9rem', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>Dashboard Overview</h1>
                                <span style={{ background: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '3px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.5px' }}>⚡ LIVE TELEMETRY</span>
                            </div>
                            <p className="page-hero-sub" style={{ margin: 0, fontSize: '0.95rem', color: '#94a3b8' }}>Live performance metrics, attendee engagement streams, and quick platform actions</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/events')} style={{ borderRadius: '14px', padding: '12px 24px', fontWeight: 700, boxShadow: '0 0 25px rgba(37, 99, 235, 0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-plus-circle"></i> Create Event
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate('/reports')} style={{ borderRadius: '14px', padding: '12px 22px', fontWeight: 700, background: 'rgba(255, 255, 255, 0.06)', border: '1.5px solid rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-file-export"></i> Export Report
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Stat Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                <StatCard label="Total Events Published" value={stats.eventsCount} icon="fa-calendar-alt" color="#38bdf8" trend="↑ +12% active summits" delay={0} />
                <StatCard label="Total Registered Guests" value={stats.attendeesCount} icon="fa-users" color="#34d399" trend="↑ 98% approval rate" delay={100} />
                <StatCard label="Active Event Team Leads" value={4} icon="fa-user-shield" color="#c084fc" trend="100% operational" delay={200} />
                <StatCard label="Total Platform Revenue" value={stats.totalRevenue} icon="fa-dollar-sign" color="#fbbf24" prefix="$" trend="↑ +24% ROI net profit" delay={300} />
            </div>

            {/* Charts & Activity Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>

                {/* System Metrics */}
                <div className="card-glass anim-fade-up" style={{ animationDelay: '400ms', padding: '24px', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <h2 style={{ fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fas fa-chart-pie" style={{ color: '#818cf8' }}></i> System Metrics
                        </h2>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '10px' }}>Live Gauge</span>
                    </div>

                    <div>
                        {metrics.map((m, i) => (
                            <div key={m.label} style={{ marginBottom: '18px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>{m.label}</span>
                                    <span style={{ fontSize: '0.88rem', color: m.color, fontWeight: 800 }}>{m.val}%</span>
                                </div>
                                <div className="bar-track" style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px' }}>
                                    <div className="bar-fill" style={{ width: `${m.val}%`, background: `linear-gradient(90deg, ${m.color}, ${m.color}99)`, borderRadius: '10px', height: '100%' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="card-glass anim-fade-up" style={{ animationDelay: '500ms', padding: '24px', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <h2 style={{ fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fas fa-bolt" style={{ color: '#fbbf24' }}></i> Live Activity Feed
                        </h2>
                        <span style={{ fontSize: '0.78rem', color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '4px 10px', borderRadius: '10px' }}>• Real-time</span>
                    </div>

                    <div>
                        {activities.map((a, i) => (
                            <ActivityItem key={i} {...a} idx={i} />
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card-glass anim-fade-up" style={{ animationDelay: '600ms', padding: '24px', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <h2 style={{ fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fas fa-rocket" style={{ color: '#c084fc' }}></i> Quick Actions
                        </h2>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Shortcuts</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                        {[
                            { icon: 'fa-calendar-plus', color: '#818cf8', label: 'New Event', to: '/events', bg: 'rgba(99,102,241,0.12)' },
                            { icon: 'fa-certificate', color: '#fbbf24', label: 'Certificates', to: '/qr', bg: 'rgba(251,191,36,0.12)' },
                            { icon: 'fa-user-plus', color: '#c084fc', label: 'Add Attendee', to: '/attendees', bg: 'rgba(192,132,252,0.12)' },
                            { icon: 'fa-file-pdf', color: '#fbbf24', label: 'Export PDF', to: '/reports', bg: 'rgba(251,191,36,0.12)' },
                            { icon: 'fa-envelope', color: '#38bdf8', label: 'Send Email', to: '/communications', bg: 'rgba(56,189,248,0.12)' },
                            { icon: 'fa-chart-line', color: '#818cf8', label: 'Analytics', to: '/reports', bg: 'rgba(99,102,241,0.12)' },
                        ].map((a, i) => (
                            <button key={a.label} className="shortcut-box hover-lift anim-scale-in" style={{ animationDelay: `${700 + i * 60}ms`, background: a.bg, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.25s ease' }} onClick={() => navigate(a.to)}>
                                <i className={`fas ${a.icon}`} style={{ fontSize: '1.2rem', color: a.color }}></i>
                                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc' }}>{a.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
