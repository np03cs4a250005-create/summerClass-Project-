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
                padding: '16px 32px',
                borderRadius: '24px',
                background: 'rgba(9, 14, 28, 0.88)',
                backdropFilter: 'blur(24px) saturate(1.4)',
                border: '1.5px solid rgba(56, 189, 248, 0.45)',
                boxShadow: '0 0 45px rgba(56, 189, 248, 0.25), inset 0 0 20px rgba(56, 189, 248, 0.1), 0 25px 50px rgba(0,0,0,0.85)'
            }}>
                <div className="home-brand" style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '1.45rem', fontWeight: 900 }}>
                    <div style={{ background: 'linear-gradient(135deg, #2563eb, #0284c7)', padding: '10px 14px', borderRadius: '14px', boxShadow: '0 0 30px rgba(56, 189, 248, 0.8)', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
                        <i className="fas fa-cubes brand-logo" style={{ color: '#fff', filter: 'drop-shadow(0 0 10px #38bdf8)' }}></i>
                    </div>
                    <span style={{ fontWeight: 900, letterSpacing: '-0.5px', color: '#fff', textShadow: '0 0 25px rgba(56, 189, 248, 0.85), 0 0 50px rgba(37, 99, 235, 0.5)' }}>
                        Gatherly
                    </span>
                </div>

                <div className="home-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <a href="#features" style={{ color: '#bae6fd', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700, textShadow: '0 0 12px rgba(56, 189, 248, 0.4)', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.color = '#38bdf8'; e.target.style.textShadow = '0 0 20px #38bdf8'; }} onMouseOut={(e) => { e.target.style.color = '#bae6fd'; e.target.style.textShadow = '0 0 12px rgba(56, 189, 248, 0.4)'; }}>Features</a>
                    <a href="#explore-arcade-section" style={{ color: '#fde68a', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700, textShadow: '0 0 12px rgba(251, 191, 36, 0.5)', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.color = '#fbbf24'; e.target.style.textShadow = '0 0 20px #fbbf24'; }} onMouseOut={(e) => { e.target.style.color = '#fde68a'; e.target.style.textShadow = '0 0 12px rgba(251, 191, 36, 0.5)'; }}>Arcade Lounge</a>
                    <a href="#explore-demo-video-section" style={{ color: '#bae6fd', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700, textShadow: '0 0 12px rgba(56, 189, 248, 0.4)', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.color = '#38bdf8'; e.target.style.textShadow = '0 0 20px #38bdf8'; }} onMouseOut={(e) => { e.target.style.color = '#bae6fd'; e.target.style.textShadow = '0 0 12px rgba(56, 189, 248, 0.4)'; }}>Demo Tour</a>

                    {/* Glowing Sign In Launcher */}
                    <Link to="/login" className="btn blue-glow-btn" style={{ borderRadius: '14px', padding: '11px 26px', fontSize: '0.92rem', fontWeight: 800, boxShadow: '0 0 35px rgba(56, 189, 248, 0.6), 0 0 60px rgba(37, 99, 235, 0.4)', border: '1.5px solid rgba(56, 189, 248, 0.6)', marginLeft: '8px' }}>
                        <i className="fas fa-right-to-bracket" style={{ marginRight: '8px' }}></i> Sign In
                    </Link>
                </div>
            </nav>

            {/* Glowing Hero Section */}
            <header className="hero-section" style={{ padding: '70px 20px 45px', textAlign: 'center', zIndex: 5, position: 'relative', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.35), rgba(56, 189, 248, 0.2))',
                    border: '2px solid rgba(56, 189, 248, 0.65)',
                    borderRadius: '30px',
                    padding: '10px 28px',
                    marginBottom: '28px',
                    boxShadow: '0 0 45px rgba(56, 189, 248, 0.5), inset 0 0 15px rgba(56, 189, 248, 0.25)'
                }}>
                    <span className="radar-ping" style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#38bdf8', display: 'inline-block', boxShadow: '0 0 15px #38bdf8' }}></span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#e0f2fe', letterSpacing: '0.8px', textTransform: 'uppercase', textShadow: '0 0 15px rgba(56, 189, 248, 0.8)' }}>
                        ⚡ NEXT-GEN EVENT INTELLIGENCE & ARCADE PLATFORM
                    </span>
                </div>

                <h1 className="blue-text-shimmer" style={{
                    fontSize: '3.8rem',
                    fontWeight: 900,
                    margin: '0 auto 24px',
                    lineHeight: 1.15,
                    maxWidth: '960px',
                    letterSpacing: '-1.2px',
                    color: '#ffffff',
                    textShadow: '0 0 35px rgba(56, 189, 248, 0.85), 0 0 70px rgba(37, 99, 235, 0.6), 0 0 100px rgba(56, 189, 248, 0.35)',
                    filter: 'drop-shadow(0 0 25px rgba(56, 189, 248, 0.7))'
                }}>
                    Bring People Together with Effortless Event Planning
                </h1>

                <p style={{ fontSize: '1.22rem', color: '#e2e8f0', maxWidth: '720px', margin: '0 auto 42px', lineHeight: 1.7, fontWeight: 500, textShadow: '0 0 20px rgba(186, 230, 253, 0.4)' }}>
                    From contactless QR check-ins and smart ticketing to interactive retro arcade games, schedule builders, and real-time dashboard analytics.
                </p>

                {/* Primary Action Buttons with Intense Cyber Glow */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '65px' }}>
                    <Link to="/login" className="btn blue-glow-btn btn-lg" style={{ padding: '16px 40px', fontSize: '1.1rem', borderRadius: '18px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '12px', boxShadow: '0 0 45px rgba(56, 189, 248, 0.8), 0 0 85px rgba(37, 99, 235, 0.6)', border: '2px solid rgba(56, 189, 248, 0.7)' }}>
                        <span>Explore Dashboard</span> <i className="fas fa-arrow-right" style={{ filter: 'drop-shadow(0 0 6px #fff)' }}></i>
                    </Link>
                    <button onClick={scrollToDemo} className="btn btn-secondary btn-lg" style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '18px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '2px solid rgba(56, 189, 248, 0.55)', display: 'inline-flex', alignItems: 'center', gap: '12px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 0 35px rgba(56, 189, 248, 0.35)', textShadow: '0 0 15px rgba(56, 189, 248, 0.7)' }}>
                        <i className="fas fa-play-circle" style={{ color: '#38bdf8', fontSize: '1.35rem', filter: 'drop-shadow(0 0 10px #38bdf8)' }}></i> Watch Video Tour
                    </button>
                </div>
            </header>

            {/* Core Features Grid Section with Intense Glow */}
            <section id="features" style={{ zIndex: 5, maxWidth: '1160px', margin: '0 auto 65px', width: '100%', padding: '0 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '12px', color: '#f8fafc', letterSpacing: '-0.5px', textShadow: '0 0 30px rgba(56, 189, 248, 0.7), 0 0 60px rgba(37, 99, 235, 0.4)' }}>
                        Enterprise-Grade Event Features
                    </h2>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', textShadow: '0 0 15px rgba(186, 230, 253, 0.35)' }}>
                        Everything you need to orchestrate summits, conferences, and community gatherings.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
                    
                    {/* Feature Card 1 - Cyan Neon Glow */}
                    <div className="card-cyber-glow" style={{
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(9, 14, 28, 0.98) 100%)',
                        border: '2px solid rgba(56, 189, 248, 0.55)',
                        borderRadius: '26px',
                        padding: '36px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '18px',
                        boxShadow: '0 0 40px rgba(56, 189, 248, 0.3), inset 0 0 25px rgba(56, 189, 248, 0.12), 0 25px 50px rgba(0, 0, 0, 0.8)'
                    }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(37, 99, 235, 0.3)', border: '2px solid rgba(56, 189, 248, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontSize: '1.7rem', boxShadow: '0 0 35px rgba(56, 189, 248, 0.6)' }}>
                            <i className="fas fa-qrcode" style={{ filter: 'drop-shadow(0 0 8px #38bdf8)' }}></i>
                        </div>
                        <h3 style={{ fontSize: '1.45rem', fontWeight: 900, margin: 0, color: '#f8fafc', textShadow: '0 0 20px rgba(56, 189, 248, 0.75)' }}>Instant QR Code Passes</h3>
                        <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.7, margin: 0, textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>
                            Generate digital tickets with verified QR codes for fast contactless door scanning and automated check-ins.
                        </p>
                    </div>

                    {/* Feature Card 2 - Emerald Neon Glow */}
                    <div className="card-cyber-glow" style={{
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(9, 14, 28, 0.98) 100%)',
                        border: '2px solid rgba(52, 211, 153, 0.55)',
                        borderRadius: '26px',
                        padding: '36px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '18px',
                        boxShadow: '0 0 40px rgba(52, 211, 153, 0.3), inset 0 0 25px rgba(52, 211, 153, 0.12), 0 25px 50px rgba(0, 0, 0, 0.8)'
                    }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(52, 211, 153, 0.3)', border: '2px solid rgba(52, 211, 153, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontSize: '1.7rem', boxShadow: '0 0 35px rgba(52, 211, 153, 0.6)' }}>
                            <i className="fas fa-comments" style={{ filter: 'drop-shadow(0 0 8px #34d399)' }}></i>
                        </div>
                        <h3 style={{ fontSize: '1.45rem', fontWeight: 900, margin: 0, color: '#f8fafc', textShadow: '0 0 20px rgba(52, 211, 153, 0.75)' }}>Real-Time Community Chat</h3>
                        <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.7, margin: 0, textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>
                            Keep attendees and hosts connected with live channel chats, organizer announcements, and instant updates.
                        </p>
                    </div>

                    {/* Feature Card 3 - Purple Neon Glow */}
                    <div className="card-cyber-glow" style={{
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(9, 14, 28, 0.98) 100%)',
                        border: '2px solid rgba(192, 132, 252, 0.55)',
                        borderRadius: '26px',
                        padding: '36px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '18px',
                        boxShadow: '0 0 40px rgba(192, 132, 252, 0.3), inset 0 0 25px rgba(192, 132, 252, 0.12), 0 25px 50px rgba(0, 0, 0, 0.8)'
                    }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(192, 132, 252, 0.3)', border: '2px solid rgba(192, 132, 252, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', fontSize: '1.7rem', boxShadow: '0 0 35px rgba(192, 132, 252, 0.6)' }}>
                            <i className="fas fa-chart-line" style={{ filter: 'drop-shadow(0 0 8px #c084fc)' }}></i>
                        </div>
                        <h3 style={{ fontSize: '1.45rem', fontWeight: 900, margin: 0, color: '#f8fafc', textShadow: '0 0 20px rgba(192, 132, 252, 0.75)' }}>Analytics & Live Gauges</h3>
                        <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.7, margin: 0, textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>
                            Monitor attendee registrations, check-in flow, and revenue metrics in real-time with one-click report exports.
                        </p>
                    </div>

                </div>
            </section>

            {/* Glowing Interactive Arcade Showcase Section */}
            <section id="explore-arcade-section" style={{ zIndex: 5, maxWidth: '1160px', margin: '0 auto 75px', width: '100%', padding: '0 24px' }}>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(124, 58, 237, 0.28) 50%, rgba(251, 191, 36, 0.22) 100%)',
                    border: '2px solid rgba(251, 191, 36, 0.65)',
                    borderRadius: '28px',
                    padding: '40px',
                    boxShadow: '0 0 60px rgba(251, 191, 36, 0.4), inset 0 0 30px rgba(251, 191, 36, 0.15), 0 30px 70px rgba(0,0,0,0.9)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '28px'
                }}>
                    <div style={{ maxWidth: '660px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(251, 191, 36, 0.25)', border: '1.5px solid rgba(251, 191, 36, 0.65)', padding: '6px 18px', borderRadius: '20px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 900, marginBottom: '14px', boxShadow: '0 0 25px rgba(251, 191, 36, 0.4)' }}>
                            <i className="fas fa-gamepad" style={{ filter: 'drop-shadow(0 0 6px #fbbf24)' }}></i> LIVE ARCADE & LEADERBOARD
                        </div>
                        <h2 style={{ fontSize: '2.3rem', fontWeight: 900, margin: '0 0 12px', color: '#ffffff', letterSpacing: '-0.5px', textShadow: '0 0 30px rgba(251, 191, 36, 0.8), 0 0 60px rgba(245, 158, 11, 0.5)' }}>
                            Play Retro Mini-Games & Earn Summit XP
                        </h2>
                        <p style={{ color: '#f1f5f9', fontSize: '1.05rem', lineHeight: 1.7, margin: 0, textShadow: '0 0 15px rgba(251, 191, 36, 0.3)' }}>
                            Engage your attendees with Cyber Security Card Match, Retro Cyber Pong, and the Lucky Prize Wheel. All scores link directly to attendee profiles and digital certificates!
                        </p>
                    </div>

                    <Link to="/gamification" className="btn btn-primary" style={{
                        background: 'linear-gradient(135deg, #d97706, #fbbf24)',
                        color: '#090d16',
                        padding: '16px 36px',
                        borderRadius: '18px',
                        fontWeight: 900,
                        fontSize: '1.08rem',
                        boxShadow: '0 0 45px rgba(251, 191, 36, 0.75), 0 0 85px rgba(245, 158, 11, 0.45)',
                        border: '2px solid rgba(255, 255, 255, 0.8)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <i className="fas fa-play" style={{ filter: 'drop-shadow(0 0 6px #000)' }}></i> Play Arcade Lounge
                    </Link>
                </div>
            </section>

            {/* Official Demo Video Walkthrough Section with Glowing Frame */}
            <section id="explore-demo-video-section" style={{ zIndex: 5, maxWidth: '1000px', margin: '0 auto 75px', width: '100%', padding: '0 24px', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(56, 189, 248, 0.18)', border: '2px solid rgba(56, 189, 248, 0.55)', borderRadius: '26px', padding: '8px 22px', marginBottom: '18px', boxShadow: '0 0 30px rgba(56, 189, 248, 0.35)' }}>
                    <i className="fas fa-video" style={{ color: '#38bdf8', fontSize: '0.95rem', filter: 'drop-shadow(0 0 6px #38bdf8)' }}></i>
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#7dd3fc', letterSpacing: '0.8px', textTransform: 'uppercase', textShadow: '0 0 12px rgba(56, 189, 248, 0.6)' }}>Interactive Demo Tour</span>
                </div>
                <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '14px', color: '#f8fafc', letterSpacing: '-0.5px', textShadow: '0 0 30px rgba(56, 189, 248, 0.7), 0 0 60px rgba(37, 99, 235, 0.45)' }}>
                    Gatherly System Walkthrough
                </h2>
                <p style={{ color: '#cbd5e1', fontSize: '1.08rem', maxWidth: '660px', margin: '0 auto 32px', lineHeight: 1.7, textShadow: '0 0 15px rgba(186, 230, 253, 0.3)' }}>
                    Watch a quick walkthrough to see how Gatherly streamlines event registration, ticketing, and live engagement.
                </p>

                <div style={{
                    borderRadius: '26px',
                    padding: '14px',
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.35), rgba(56, 189, 248, 0.25))',
                    border: '2px solid rgba(56, 189, 248, 0.6)',
                    boxShadow: '0 0 65px rgba(56, 189, 248, 0.45), 0 30px 80px rgba(0,0,0,0.9), inset 0 0 30px rgba(56, 189, 248, 0.2)'
                }}>
                    <DemoVideoPlayer autoPlay={false} />
                </div>
            </section>

            {/* Key Platform Stats with Radiant Cyber Glow */}
            <section style={{ zIndex: 5, maxWidth: '1100px', margin: '0 auto 75px', width: '100%', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                    {[
                        { label: 'Happy Organizers', val: '500+', icon: 'fa-heart', color: '#38bdf8' },
                        { label: 'Check-in Speed', val: '< 50ms', icon: 'fa-bolt', color: '#60a5fa' },
                        { label: 'System Uptime', val: '99.9%', icon: 'fa-shield-check', color: '#34d399' },
                        { label: 'Guests Welcomed', val: '100k+', icon: 'fa-smile-beam', color: '#fbbf24' },
                    ].map((stat, idx) => (
                        <div key={idx} style={{
                            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(9, 14, 28, 0.95) 100%)',
                            border: `2px solid ${stat.color}60`,
                            padding: '28px 24px',
                            borderRadius: '22px',
                            textAlign: 'center',
                            boxShadow: `0 0 35px ${stat.color}35, inset 0 0 20px ${stat.color}15, 0 15px 35px rgba(0,0,0,0.7)`
                        }}>
                            <i className={`fas ${stat.icon}`} style={{ fontSize: '1.6rem', color: stat.color, marginBottom: '12px', display: 'block', filter: `drop-shadow(0 0 10px ${stat.color})` }}></i>
                            <h3 style={{ fontSize: '2rem', fontWeight: 900, margin: '2px 0 6px', color: '#fff', letterSpacing: '-0.5px', textShadow: `0 0 20px ${stat.color}80` }}>{stat.val}</h3>
                            <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 700, textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>{stat.label}</span>
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

