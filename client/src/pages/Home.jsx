import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ParticleCanvas from '../components/ParticleCanvas';
import CyberArcadeGame from '../components/CyberArcadeGame';

const Home = () => {
    const [activeTab, setActiveTab] = useState('qr');
    const [showGameModal, setShowGameModal] = useState(false);

    return (
        <div className="home-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 50% -10%, #0d2a5d 0%, #081533 45%, #050b1a 100%)', color: '#f8fafc' }}>
            {/* Interactive Blue Particle Canvas Background */}
            <ParticleCanvas />

            {/* Glowing Ambient Blue Background Orbs */}
            <div className="blue-ambient-orb" style={{ top: '-100px', left: '15%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, rgba(56, 189, 248, 0.08) 60%, transparent 80%)' }}></div>
            <div className="blue-ambient-orb" style={{ top: '40%', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(99, 102, 241, 0.1) 60%, transparent 80%)', animationDelay: '-6s' }}></div>

            {/* Top Navigation Bar */}
            <nav className="home-nav blue-card-glass" style={{ margin: '20px 5%', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 28px', borderRadius: '16px' }}>
                <div className="home-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4rem', fontWeight: 800 }}>
                    <div style={{ background: 'linear-gradient(135deg, #2563eb, #0284c7)', padding: '10px 14px', borderRadius: '12px', boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)' }}>
                        <i className="fas fa-cubes brand-logo" style={{ color: '#fff' }}></i>
                    </div>
                    <span className="blue-text-shimmer" style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                        Gatherly
                    </span>
                </div>

                <div className="home-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <a href="#how-it-works" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#38bdf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>How It Works</a>
                    <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#38bdf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>Features</a>
                    
                    {/* Interactive Arcade Game Button */}
                    <button onClick={() => setShowGameModal(true)} style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(251, 191, 36, 0.15)', border: '1px solid rgba(251, 191, 36, 0.4)', color: '#fbbf24', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 15px rgba(251,191,36,0.2)' }}>
                        <i className="fas fa-gamepad"></i> Play Arcade Game vs AI
                    </button>

                    <Link to="/login" className="btn btn-secondary" style={{ borderRadius: '10px', padding: '8px 18px', fontSize: '0.95rem', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)' }}>Sign In</Link>
                    <Link to="/signup" className="btn blue-glow-btn" style={{ borderRadius: '10px', padding: '8px 20px', fontSize: '0.95rem', fontWeight: 600 }}>Get Started Free</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section" style={{ padding: '60px 20px 40px', textAlign: 'center', zIndex: 5, position: 'relative' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '30px', padding: '6px 20px', marginBottom: '24px', backdropFilter: 'blur(10px)' }}>
                    <span className="pulse-dot" style={{ backgroundColor: '#38bdf8', boxShadow: '0 0 10px #38bdf8' }}></span>
                    <i className="fas fa-sparkles" style={{ color: '#38bdf8', fontSize: '0.85rem' }}></i>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#7dd3fc', letterSpacing: '0.3px' }}>Crafted for Event Hosts, Creators & Communities</span>
                </div>

                <h1 className="hero-title blue-text-shimmer" style={{ fontSize: '3.6rem', fontWeight: 800, margin: '0 auto 20px', lineHeight: 1.18, maxWidth: '850px', letterSpacing: '-1px' }}>
                    Bring People Together with Effortless Event Planning.
                </h1>

                <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 36px', lineHeight: 1.6, fontWeight: 400 }}>
                    From seamless guest check-ins to instant QR tickets and live community chats — Gatherly gives you everything you need to create unforgettable gatherings.
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '50px' }}>
                    <Link to="/signup" className="btn blue-glow-btn btn-lg" style={{ padding: '15px 36px', fontSize: '1.05rem', borderRadius: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-sparkles"></i> Host Your First Event
                    </Link>
                    <button onClick={() => setShowGameModal(true)} className="btn btn-secondary btn-lg" style={{ padding: '15px 32px', fontSize: '1.05rem', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)', backdropFilter: 'blur(10px)', display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}>
                        <i className="fas fa-gamepad" style={{ color: '#fbbf24' }}></i> Play Arcade vs Computer AI
                    </button>
                    <Link to="/login" className="btn btn-secondary btn-lg" style={{ padding: '15px 32px', fontSize: '1.05rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', color: '#e2e8f0', border: '1px solid rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(10px)', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-play-circle" style={{ color: '#38bdf8' }}></i> Explore Demo
                    </Link>
                </div>

                {/* Interactive Platform Feature Showcase Card */}
                <div style={{ maxWidth: '1000px', margin: '0 auto 40px', padding: '24px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 35px rgba(37, 99, 235, 0.2)', backdropFilter: 'blur(20px)', position: 'relative' }}>
                    
                    {/* Showcase Tabs */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
                        <button 
                            onClick={() => setActiveTab('qr')} 
                            style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s', background: activeTab === 'qr' ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'rgba(255,255,255,0.05)', color: activeTab === 'qr' ? '#fff' : '#94a3b8' }}>
                            <i className="fas fa-qrcode" style={{ marginRight: '8px' }}></i> Instant QR Ticket
                        </button>
                        <button 
                            onClick={() => setActiveTab('chat')} 
                            style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s', background: activeTab === 'chat' ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'rgba(255,255,255,0.05)', color: activeTab === 'chat' ? '#fff' : '#94a3b8' }}>
                            <i className="fas fa-comments" style={{ marginRight: '8px' }}></i> Live Attendee Chat
                        </button>
                        <button 
                            onClick={() => setActiveTab('analytics')} 
                            style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s', background: activeTab === 'analytics' ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'rgba(255,255,255,0.05)', color: activeTab === 'analytics' ? '#fff' : '#94a3b8' }}>
                            <i className="fas fa-chart-pie" style={{ marginRight: '8px' }}></i> Real-Time Stats
                        </button>
                    </div>

                    {/* Showcase Content Views */}
                    {activeTab === 'qr' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center', textAlign: 'left', padding: '10px' }}>
                            <div className="holo-card" style={{ padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, #1e3a8a, #0369a1)', color: '#fff', boxShadow: '0 10px 30px rgba(37, 99, 235, 0.4)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px' }}>VIP PASS</span>
                                    <i className="fas fa-bolt" style={{ color: '#38bdf8' }}></i>
                                </div>
                                <h4 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 6px' }}>Summer Tech Summit 2026</h4>
                                <p style={{ fontSize: '0.85rem', color: '#bae6fd', margin: '0 0 20px' }}>Grand Innovation Hall • Gate 4</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '12px' }}>
                                    <div style={{ background: '#fff', padding: '8px', borderRadius: '8px' }}>
                                        <i className="fas fa-qrcode" style={{ fontSize: '2.5rem', color: '#0f172a' }}></i>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Alex Rivera</div>
                                        <div style={{ fontSize: '0.8rem', color: '#7dd3fc' }}>ID: #GATH-88492</div>
                                        <div style={{ fontSize: '0.75rem', color: '#4ade80', marginTop: '4px' }}>✓ Verified Guest</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '10px' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
                                    Fast, Contactless Door Check-Ins
                                </h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '18px' }}>
                                    No long queues or paper list printouts. Guests receive sleek digital QR passes that scan in under 50 milliseconds at the entrance.
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', fontSize: '0.92rem' }}>
                                        <i className="fas fa-check-circle" style={{ color: '#38bdf8' }}></i> Automatic QR Pass Generation
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', fontSize: '0.92rem' }}>
                                        <i className="fas fa-check-circle" style={{ color: '#38bdf8' }}></i> Instant Offline & Online Scanner
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', fontSize: '0.92rem' }}>
                                        <i className="fas fa-check-circle" style={{ color: '#38bdf8' }}></i> Real-time Attendance Sync
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center', textAlign: 'left', padding: '10px' }}>
                            <div style={{ background: '#0f172a', padding: '18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>S</div>
                                    <div>
                                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>Sarah Chen</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Can't wait for the opening keynote!</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '10px 14px', borderRadius: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>M</div>
                                    <div>
                                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#38bdf8' }}>Marcus Vance (Organizer)</div>
                                        <div style={{ fontSize: '0.8rem', color: '#e0f2fe' }}>Welcome everyone! Workshop materials are pinned above.</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', width: 'fit-content', fontSize: '0.8rem', color: '#94a3b8' }}>
                                    <span className="typing-dot" style={{ backgroundColor: '#38bdf8' }}></span>
                                    <span>32 attendees are chatting live...</span>
                                </div>
                            </div>

                            <div style={{ padding: '10px' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
                                    Engage Guests in Real-Time
                                </h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '18px' }}>
                                    Keep your event vibrant with interactive live chat, organizer announcements, and real-time audience Q&A.
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', fontSize: '0.92rem' }}>
                                        <i className="fas fa-check-circle" style={{ color: '#38bdf8' }}></i> Dedicated Channel per Event
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', fontSize: '0.92rem' }}>
                                        <i className="fas fa-check-circle" style={{ color: '#38bdf8' }}></i> Organizer Pinned Updates
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center', textAlign: 'left', padding: '10px' }}>
                            <div style={{ background: '#0f172a', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Live Capacity Fill</span>
                                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8' }}>88% Filled</span>
                                </div>
                                <div className="bar-track" style={{ height: '10px', marginBottom: '20px' }}>
                                    <div className="bar-fill" style={{ width: '88%', background: 'linear-gradient(90deg, #2563eb, #38bdf8)' }}></div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Check-ins</div>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc' }}>442 / 500</div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Ticket Revenue</div>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#4ade80' }}>$12,450</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '10px' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
                                    Clear Live Dashboard
                                </h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '18px' }}>
                                    Monitor ticket sales, venue capacity, check-in flow, and revenue stats live from any mobile or desktop screen.
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', fontSize: '0.92rem' }}>
                                        <i className="fas fa-check-circle" style={{ color: '#38bdf8' }}></i> Real-Time Guest Tracking
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', fontSize: '0.92rem' }}>
                                        <i className="fas fa-check-circle" style={{ color: '#38bdf8' }}></i> One-Click CSV Export
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Impact & Community Stats */}
            <section style={{ zIndex: 5, maxWidth: '1100px', margin: '0 auto 70px', width: '100%', padding: '0 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    {[
                        { label: 'Happy Organizers', val: '500+', icon: 'fa-heart', color: '#38bdf8' },
                        { label: 'Check-in Speed', val: '< 50ms', icon: 'fa-bolt', color: '#60a5fa' },
                        { label: 'System Uptime', val: '99.9%', icon: 'fa-shield-check', color: '#34d399' },
                        { label: 'Guests Welcomed', val: '100k+', icon: 'fa-smile-beam', color: '#fbbf24' },
                    ].map((stat, idx) => (
                        <div key={idx} className="blue-card-glass" style={{ padding: '24px', borderRadius: '18px', textAlign: 'center' }}>
                            <i className={`fas ${stat.icon}`} style={{ fontSize: '1.6rem', color: stat.color, marginBottom: '10px', display: 'block' }}></i>
                            <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: '4px 0 6px', color: '#fff' }}>{stat.val}</h3>
                            <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works Step-by-Step Guide */}
            <section id="how-it-works" style={{ zIndex: 5, maxWidth: '1100px', margin: '0 auto 80px', width: '100%', padding: '0 20px', textAlign: 'center' }}>
                <h2 className="blue-text-shimmer" style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '15px' }}>
                    How Gathering Works in 3 Easy Steps
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 45px' }}>
                    Designed so you can launch your event page and welcome attendees effortlessly.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '28px' }}>
                    {[
                        { step: '01', title: 'Create & Customize', desc: 'Set up your event title, schedule, venue map, and ticket types in just a few clicks.', icon: 'fa-pen-sparkles' },
                        { step: '02', title: 'Send Smart QR Passes', desc: 'Attendees register online and instantly receive dynamic digital badges on their devices.', icon: 'fa-qrcode' },
                        { step: '03', title: 'Welcome Your Community', desc: 'Scan passes at entry with high precision while watching live check-in stats update.', icon: 'fa-users-gear' },
                    ].map((s, idx) => (
                        <div key={idx} className="blue-card-glass" style={{ padding: '32px 24px', borderRadius: '20px', textAlign: 'left', position: 'relative' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '2px', marginBottom: '16px', background: 'rgba(56, 189, 248, 0.1)', display: 'inline-block', padding: '4px 12px', borderRadius: '20px' }}>
                                STEP {s.step}
                            </div>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                <i className={`fas ${s.icon}`} style={{ fontSize: '1.4rem', color: '#38bdf8' }}></i>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: '#f8fafc' }}>{s.title}</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.93rem', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Platform Features Grid */}
            <section id="features" style={{ zIndex: 5, maxWidth: '1200px', margin: '0 auto 80px', width: '100%', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                    <h2 className="blue-text-shimmer" style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '12px' }}>
                        Everything You Need to Host Great Events
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.08rem' }}>
                        Thoughtfully crafted features to keep hosts organized and guests delighted.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {[
                        { icon: 'fa-calendar-days', title: 'Complete Event Control', desc: 'Manage single or recurring events, venues, speaker tags, and registration limits.' },
                        { icon: 'fa-id-badge', title: 'Digital QR Passes', desc: 'Instant QR badges for seamless check-in and attendance certificate issuing.' },
                        { icon: 'fa-chart-line', title: 'Live Dashboard', desc: 'Track real-time check-ins, remaining capacity, ticket revenue, and organizer logs.' },
                        { icon: 'fa-user-group', title: 'Guest Management', desc: 'Search, filter, approve, and export your entire guest list anytime in CSV.' },
                        { icon: 'fa-comments', title: 'Community Live Chat', desc: 'Facilitate real-time attendee networking, announcements, and Q&A sessions.' },
                        { icon: 'fa-shield-halved', title: 'Reliable Security', desc: 'Built-in security logs, role access, and data protection for event safety.' },
                    ].map((f, i) => (
                        <div key={i} className="blue-card-glass hover-lift" style={{ padding: '28px', textAlign: 'left', borderRadius: '20px' }}>
                            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(56, 189, 248, 0.1))', border: '1px solid rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                <i className={`fas ${f.icon}`} style={{ fontSize: '1.5rem', color: '#38bdf8' }}></i>
                            </div>
                            <h3 style={{ marginBottom: '10px', fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>{f.title}</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.93rem', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Authentic Organizer Testimonials */}
            <section id="testimonials" style={{ zIndex: 5, maxWidth: '1100px', margin: '0 auto 80px', width: '100%', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                    <h2 className="blue-text-shimmer" style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '12px' }}>
                        Loved by Event Creators & Organizers
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.08rem' }}>
                        See how real teams simplify their event day operations.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    {[
                        { quote: "Gatherly turned our tech summit check-in into a 5-minute breeze. Our guests were amazed by how smooth the digital QR passes were!", name: "Sarah Chen", role: "Lead Host • Global Tech Summit" },
                        { quote: "The real-time attendee chat and live capacity gauges gave our staff complete clarity throughout the whole festival day.", name: "Marcus Vance", role: "Community Lead • City Arts Festival" },
                    ].map((t, idx) => (
                        <div key={idx} className="blue-card-glass" style={{ padding: '30px', borderRadius: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '24px' }}>
                                "{t.quote}"
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>{t.name}</div>
                                    <div style={{ fontSize: '0.82rem', color: '#7dd3fc' }}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom Call to Action Section */}
            <section style={{ zIndex: 5, maxWidth: '1000px', margin: '0 auto 80px', width: '90%', padding: '50px 30px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(2, 132, 199, 0.15))', border: '1px solid rgba(56, 189, 248, 0.3)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>
                    Ready to Host Your Next Unforgettable Event?
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 30px', lineHeight: 1.6 }}>
                    Join hundreds of event creators today. Set up your portal in minutes with no complex setup required.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/signup" className="btn blue-glow-btn btn-lg" style={{ padding: '15px 36px', fontSize: '1.05rem', borderRadius: '12px', fontWeight: 600 }}>
                        Create Free Account
                    </Link>
                    <Link to="/login" className="btn btn-secondary btn-lg" style={{ padding: '15px 30px', fontSize: '1.05rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.08)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                        Login to Portal
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ zIndex: 5, marginTop: 'auto', padding: '30px 20px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                    &copy; 2026 Gatherly — Designed with passion for human connection & unforgettable events.
                </p>
            </footer>

            {/* Cyber Arcade Mini-Game Modal */}
            {showGameModal && <CyberArcadeGame onClose={() => setShowGameModal(false)} />}
        </div>
    );
};

export default Home;

