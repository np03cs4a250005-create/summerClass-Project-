import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DemoVideoPlayer from '../components/DemoVideoPlayer';

const Home = () => {
    const navigate = useNavigate();

    const scrollToDemo = () => {
        const demoSec = document.getElementById('explore-demo-video-section');
        if (demoSec) {
            demoSec.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="home-layout" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backgroundColor: '#030712',
            backgroundImage: `
                radial-gradient(circle at 50% -10%, rgba(56, 189, 248, 0.32) 0%, rgba(37, 99, 235, 0.18) 35%, transparent 65%),
                radial-gradient(circle at 90% 75%, rgba(139, 92, 246, 0.22) 0%, transparent 50%),
                radial-gradient(circle at 8% 55%, rgba(20, 184, 166, 0.18) 0%, transparent 45%),
                linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 48px 48px, 48px 48px',
            backgroundAttachment: 'fixed',
            color: '#f8fafc',
            overflowX: 'hidden'
        }}>
            {/* Luminous Ambient Glowing Background Aurora Orbs */}
            <div className="float-anim" style={{
                position: 'absolute',
                top: '6%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '720px',
                height: '420px',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(56, 189, 248, 0.25) 0%, rgba(37, 99, 235, 0.1) 50%, transparent 75%)',
                filter: 'blur(80px)',
                pointerEvents: 'none',
                zIndex: 1
            }} />

            <div style={{
                position: 'absolute',
                top: '45%',
                right: '-5%',
                width: '550px',
                height: '550px',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(168, 85, 247, 0.18) 0%, transparent 70%)',
                filter: 'blur(90px)',
                pointerEvents: 'none',
                zIndex: 1
            }} />

            {/* Clean Top Navigation Bar */}
            <nav className="home-nav" style={{
                margin: '20px auto',
                width: '92%',
                maxWidth: '1200px',
                zIndex: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 28px',
                borderRadius: '20px',
                background: 'rgba(9, 14, 28, 0.85)',
                backdropFilter: 'blur(20px) saturate(1.3)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 25px rgba(56, 189, 248, 0.12)'
            }}>
                <div className="home-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.35rem', fontWeight: 800 }}>
                    <div style={{ background: 'linear-gradient(135deg, #2563eb, #0284c7)', padding: '9px 12px', borderRadius: '12px', boxShadow: '0 0 15px rgba(37, 99, 235, 0.4)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                        <i className="fas fa-cubes brand-logo" style={{ color: '#fff' }}></i>
                    </div>
                    <span style={{ fontWeight: 800, letterSpacing: '-0.5px', color: '#fff' }}>
                        Gatherly
                    </span>
                </div>

                <div className="home-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                    <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#38bdf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>Features</a>
                    <a href="#explore-arcade-section" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#fbbf24'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>Arcade Lounge</a>
                    <a href="#explore-demo-video-section" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#38bdf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>Demo Tour</a>

                    {/* Single Clean Sign In / Launch App Button */}
                    <Link to="/login" className="btn blue-glow-btn" style={{ borderRadius: '12px', padding: '10px 22px', fontSize: '0.9rem', fontWeight: 700, boxShadow: '0 0 20px rgba(37, 99, 235, 0.35)', marginLeft: '8px' }}>
                        <i className="fas fa-right-to-bracket" style={{ marginRight: '6px' }}></i> Sign In
                    </Link>
                </div>
            </nav>

            {/* Glowing Hero Section with Tasteful Medium Ease-in-out Glow */}
            <header className="hero-section" style={{ padding: '65px 20px 40px', textAlign: 'center', zIndex: 5, position: 'relative', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
                <div className="glow-breathe-cyan" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(56, 189, 248, 0.12))',
                    border: '1.5px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '30px',
                    padding: '8px 22px',
                    marginBottom: '24px'
                }}>
                    <span className="radar-ping" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#38bdf8', display: 'inline-block' }}></span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7dd3fc', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        ⚡ Next-Gen Event Operations & Arcade Platform
                    </span>
                </div>

                <h1 className="blue-text-shimmer glow-text-ease" style={{
                    fontSize: '3.6rem',
                    fontWeight: 900,
                    margin: '0 auto 20px',
                    lineHeight: 1.18,
                    maxWidth: '920px',
                    letterSpacing: '-1px'
                }}>
                    Bring People Together with Effortless Event Planning
                </h1>

                <p style={{ fontSize: '1.18rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 36px', lineHeight: 1.65, fontWeight: 400 }}>
                    From contactless QR check-ins and smart ticketing to interactive retro arcade games, schedule builders, and real-time dashboard analytics.
                </p>

                {/* Primary Action Buttons */}
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
                    <Link to="/login" className="btn blue-glow-btn btn-lg" style={{ padding: '14px 32px', fontSize: '1.05rem', borderRadius: '14px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 0 25px rgba(37, 99, 235, 0.4)' }}>
                        <span>Explore Dashboard</span> <i className="fas fa-arrow-right"></i>
                    </Link>
                    <button onClick={scrollToDemo} className="btn btn-secondary btn-lg" style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: '14px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1.5px solid rgba(56, 189, 248, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)' }}>
                        <i className="fas fa-play-circle" style={{ color: '#38bdf8', fontSize: '1.2rem' }}></i> Watch Video Tour
                    </button>
                </div>
            </header>

            {/* Core Features Grid Section with Ease-in-out Medium Glows */}
            <section id="features" style={{ zIndex: 5, maxWidth: '1140px', margin: '0 auto 60px', width: '100%', padding: '0 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '10px', color: '#f8fafc', letterSpacing: '-0.5px' }}>
                        Enterprise-Grade Event Features
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>
                        Everything you need to orchestrate summits, conferences, and community gatherings.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    
                    {/* Feature Card 1 - Cyan Medium Glow Breathing */}
                    <div className="card-cyber-glow glow-breathe-cyan" style={{
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(9, 14, 28, 0.95) 100%)',
                        border: '1.5px solid rgba(56, 189, 248, 0.35)',
                        borderRadius: '22px',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: 'rgba(37, 99, 235, 0.2)', border: '1px solid rgba(56, 189, 248, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontSize: '1.5rem', boxShadow: '0 0 15px rgba(56, 189, 248, 0.25)' }}>
                            <i className="fas fa-qrcode"></i>
                        </div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>Instant QR Code Passes</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
                            Generate digital tickets with verified QR codes for fast contactless door scanning and automated check-ins.
                        </p>
                    </div>

                    {/* Feature Card 2 - Emerald Medium Glow Breathing */}
                    <div className="card-cyber-glow glow-breathe-emerald" style={{
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(9, 14, 28, 0.95) 100%)',
                        border: '1.5px solid rgba(52, 211, 153, 0.35)',
                        borderRadius: '22px',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: 'rgba(52, 211, 153, 0.2)', border: '1px solid rgba(52, 211, 153, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontSize: '1.5rem', boxShadow: '0 0 15px rgba(52, 211, 153, 0.25)' }}>
                            <i className="fas fa-comments"></i>
                        </div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>Real-Time Community Chat</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
                            Keep attendees and hosts connected with live channel chats, organizer announcements, and instant updates.
                        </p>
                    </div>

                    {/* Feature Card 3 - Purple Medium Glow Breathing */}
                    <div className="card-cyber-glow glow-breathe-purple" style={{
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(9, 14, 28, 0.95) 100%)',
                        border: '1.5px solid rgba(192, 132, 252, 0.35)',
                        borderRadius: '22px',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: 'rgba(192, 132, 252, 0.2)', border: '1px solid rgba(192, 132, 252, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', fontSize: '1.5rem', boxShadow: '0 0 15px rgba(192, 132, 252, 0.25)' }}>
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>Analytics & Live Gauges</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
                            Monitor attendee registrations, check-in flow, and revenue metrics in real-time with one-click report exports.
                        </p>
                    </div>

                </div>
            </section>

            {/* Glowing Interactive Arcade Showcase Section */}
            <section id="explore-arcade-section" style={{ zIndex: 5, maxWidth: '1140px', margin: '0 auto 70px', width: '100%', padding: '0 24px' }}>
                <div className="glow-breathe-gold" style={{
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(124, 58, 237, 0.2) 50%, rgba(251, 191, 36, 0.15) 100%)',
                    border: '1.5px solid rgba(251, 191, 36, 0.45)',
                    borderRadius: '26px',
                    padding: '36px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '24px'
                }}>
                    <div style={{ maxWidth: '640px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(251, 191, 36, 0.18)', border: '1px solid rgba(251, 191, 36, 0.45)', padding: '4px 14px', borderRadius: '18px', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 800, marginBottom: '12px' }}>
                            <i className="fas fa-gamepad"></i> LIVE ARCADE & LEADERBOARD
                        </div>
                        <h2 style={{ fontSize: '2.1rem', fontWeight: 900, margin: '0 0 10px', color: '#ffffff', letterSpacing: '-0.5px' }}>
                            Play Retro Mini-Games & Earn Summit XP
                        </h2>
                        <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                            Engage your attendees with Cyber Security Card Match, Retro Cyber Pong, and the Lucky Prize Wheel. All scores link directly to attendee profiles and digital certificates!
                        </p>
                    </div>

                    <Link to="/gamification" className="btn btn-primary" style={{
                        background: 'linear-gradient(135deg, #d97706, #fbbf24)',
                        color: '#090d16',
                        padding: '14px 28px',
                        borderRadius: '16px',
                        fontWeight: 900,
                        fontSize: '1rem',
                        boxShadow: '0 0 25px rgba(251, 191, 36, 0.35)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <i className="fas fa-play"></i> Play Arcade Lounge
                    </Link>
                </div>
            </section>

            {/* Official Demo Video Walkthrough Section */}
            <section id="explore-demo-video-section" style={{ zIndex: 5, maxWidth: '980px', margin: '0 auto 70px', width: '100%', padding: '0 24px', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.12)', border: '1.5px solid rgba(56, 189, 248, 0.35)', borderRadius: '24px', padding: '6px 18px', marginBottom: '16px', boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)' }}>
                    <i className="fas fa-video" style={{ color: '#38bdf8', fontSize: '0.85rem' }}></i>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#7dd3fc', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Interactive Demo Tour</span>
                </div>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '12px', color: '#f8fafc', letterSpacing: '-0.5px' }}>
                    Gatherly System Walkthrough
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1.02rem', maxWidth: '640px', margin: '0 auto 28px', lineHeight: 1.65 }}>
                    Watch a quick walkthrough to see how Gatherly streamlines event registration, ticketing, and live engagement.
                </p>

                <div className="glow-breathe-cyan" style={{
                    borderRadius: '24px',
                    padding: '12px',
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(56, 189, 248, 0.15))',
                    border: '1.5px solid rgba(56, 189, 248, 0.4)'
                }}>
                    <DemoVideoPlayer autoPlay={false} />
                </div>
            </section>

            {/* Key Platform Stats */}
            <section style={{ zIndex: 5, maxWidth: '1080px', margin: '0 auto 70px', width: '100%', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    {[
                        { label: 'Happy Organizers', val: '500+', icon: 'fa-heart', color: '#38bdf8' },
                        { label: 'Check-in Speed', val: '< 50ms', icon: 'fa-bolt', color: '#60a5fa' },
                        { label: 'System Uptime', val: '99.9%', icon: 'fa-shield-check', color: '#34d399' },
                        { label: 'Guests Welcomed', val: '100k+', icon: 'fa-smile-beam', color: '#fbbf24' },
                    ].map((stat, idx) => (
                        <div key={idx} style={{
                            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(9, 14, 28, 0.85) 100%)',
                            border: `1.5px solid ${stat.color}35`,
                            padding: '24px 20px',
                            borderRadius: '18px',
                            textAlign: 'center',
                            boxShadow: `0 10px 30px -10px rgba(0,0,0,0.6), 0 0 15px ${stat.color}15`
                        }}>
                            <i className={`fas ${stat.icon}`} style={{ fontSize: '1.35rem', color: stat.color, marginBottom: '10px', display: 'block' }}></i>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '2px 0 6px', color: '#fff', letterSpacing: '-0.5px' }}>{stat.val}</h3>
                            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer style={{ zIndex: 5, marginTop: 'auto', padding: '24px', textAlign: 'center', borderTop: '1px solid rgba(56, 189, 248, 0.15)', background: 'rgba(9, 14, 28, 0.9)' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                    &copy; 2026 Gatherly — Enterprise Event Management & Gamification Suite.
                </p>
            </footer>
        </div>
    );
};

export default Home;

