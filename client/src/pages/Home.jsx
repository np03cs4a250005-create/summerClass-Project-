import React from 'react';
import { Link } from 'react-router-dom';
import DemoVideoPlayer from '../components/DemoVideoPlayer';

const Home = () => {
    const scrollToDemo = () => {
        const demoSec = document.getElementById('explore-demo-video-section');
        if (demoSec) {
            demoSec.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="home-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: 'radial-gradient(ellipse at 50% -10%, #0d2a5d 0%, #081533 45%, #050b1a 100%)', color: '#f8fafc' }}>
            
            {/* Clean Top Navigation Bar */}
            <nav className="home-nav" style={{ margin: '20px 5%', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 28px', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                <div className="home-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.35rem', fontWeight: 800 }}>
                    <div style={{ background: 'linear-gradient(135deg, #2563eb, #0284c7)', padding: '9px 12px', borderRadius: '10px', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}>
                        <i className="fas fa-cubes brand-logo" style={{ color: '#fff' }}></i>
                    </div>
                    <span style={{ fontWeight: 800, letterSpacing: '-0.5px', color: '#fff' }}>
                        Gatherly
                    </span>
                </div>

                <div className="home-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#38bdf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>Features</a>
                    <a href="#explore-demo-video-section" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#38bdf8'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>Demo Video</a>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px' }}>
                        <Link to="/login" className="btn btn-secondary" style={{ borderRadius: '10px', padding: '8px 18px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)' }}>Sign In</Link>
                        <Link to="/signup" className="btn blue-glow-btn" style={{ borderRadius: '10px', padding: '8px 20px', fontSize: '0.9rem', fontWeight: 600 }}>Get Started Free</Link>
                    </div>
                </div>
            </nav>

            {/* Streamlined Hero Section */}
            <header className="hero-section" style={{ padding: '60px 20px 40px', textAlign: 'center', zIndex: 5, position: 'relative', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '30px', padding: '6px 18px', marginBottom: '20px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#38bdf8', display: 'inline-block' }}></span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7dd3fc', letterSpacing: '0.3px' }}>Gatherly Event Management Suite</span>
                </div>

                <h1 style={{ fontSize: '3.2rem', fontWeight: 800, margin: '0 auto 18px', lineHeight: 1.2, maxWidth: '820px', letterSpacing: '-0.5px', color: '#f8fafc' }}>
                    Bring People Together with Effortless Event Planning
                </h1>

                <p style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: '640px', margin: '0 auto 32px', lineHeight: 1.6, fontWeight: 400 }}>
                    From contactless QR check-ins and ticketing to interactive live chat and real-time dashboard analytics — all in one simple suite.
                </p>

                {/* Primary & Secondary Hero CTAs */}
                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '50px' }}>
                    <Link to="/signup" className="btn blue-glow-btn btn-lg" style={{ padding: '12px 28px', fontSize: '1rem', borderRadius: '10px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-arrow-right"></i> Get Started Free
                    </Link>
                    <button onClick={scrollToDemo} className="btn btn-secondary btn-lg" style={{ padding: '12px 24px', fontSize: '1rem', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 600, cursor: 'pointer' }}>
                        <i className="fas fa-play-circle" style={{ color: '#38bdf8', fontSize: '1.1rem' }}></i> Watch Demo Video
                    </button>
                </div>
            </header>

            {/* Core Features Grid Section */}
            <section id="features" style={{ zIndex: 5, maxWidth: '1100px', margin: '0 auto 60px', width: '100%', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px', color: '#f8fafc' }}>
                        Key Platform Features
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
                        Everything you need to organize summits, conferences, and community gatherings.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    
                    <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontSize: '1.4rem' }}>
                            <i className="fas fa-qrcode"></i>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Instant QR Code Passes</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                            Generate digital tickets with verified QR codes for fast contactless door scanning and automated check-ins.
                        </p>
                    </div>

                    <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontSize: '1.4rem' }}>
                            <i className="fas fa-comments"></i>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Real-Time Community Chat</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                            Keep attendees and hosts connected with live channel chats, organizer announcements, and instant updates.
                        </p>
                    </div>

                    <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(192, 132, 252, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', fontSize: '1.4rem' }}>
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Analytics & Live Gauges</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                            Monitor attendee registrations, check-in flow, and revenue metrics in real-time with one-click report exports.
                        </p>
                    </div>

                </div>
            </section>

            {/* Official Demo Video Walkthrough Section */}
            <section id="explore-demo-video-section" style={{ zIndex: 5, maxWidth: '950px', margin: '0 auto 60px', width: '100%', padding: '0 20px', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '20px', padding: '5px 16px', marginBottom: '14px' }}>
                    <i className="fas fa-video" style={{ color: '#38bdf8', fontSize: '0.85rem' }}></i>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7dd3fc', letterSpacing: '0.5px' }}>PLATFORM DEMO</span>
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px', color: '#f8fafc' }}>
                    Gatherly System Walkthrough
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.98rem', maxWidth: '640px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                    Watch a quick walkthrough to see how Gatherly streamlines event registration, ticketing, and live engagement.
                </p>

                <DemoVideoPlayer autoPlay={false} />
            </section>

            {/* Key Platform Stats */}
            <section style={{ zIndex: 5, maxWidth: '1000px', margin: '0 auto 60px', width: '100%', padding: '0 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {[
                        { label: 'Happy Organizers', val: '500+', icon: 'fa-heart', color: '#38bdf8' },
                        { label: 'Check-in Speed', val: '< 50ms', icon: 'fa-bolt', color: '#60a5fa' },
                        { label: 'System Uptime', val: '99.9%', icon: 'fa-shield-check', color: '#34d399' },
                        { label: 'Guests Welcomed', val: '100k+', icon: 'fa-smile-beam', color: '#fbbf24' },
                    ].map((stat, idx) => (
                        <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '20px', borderRadius: '14px', textAlign: 'center' }}>
                            <i className={`fas ${stat.icon}`} style={{ fontSize: '1.2rem', color: stat.color, marginBottom: '8px', display: 'block' }}></i>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '2px 0 4px', color: '#fff' }}>{stat.val}</h3>
                            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom Call to Action Section */}
            <section style={{ zIndex: 5, maxWidth: '850px', margin: '0 auto 60px', width: '90%', padding: '36px 24px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(2, 132, 199, 0.1))', border: '1px solid rgba(56, 189, 248, 0.25)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '10px', color: '#ffffff' }}>
                    Ready to Host Your Next Gathering?
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.98rem', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                    Join event organizers today and set up your event portal in minutes.
                </p>
                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/signup" className="btn blue-glow-btn btn-lg" style={{ padding: '12px 28px', fontSize: '0.95rem', borderRadius: '10px', fontWeight: 600 }}>
                        Create Free Account
                    </Link>
                    <Link to="/login" className="btn btn-secondary btn-lg" style={{ padding: '12px 24px', fontSize: '0.95rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.06)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                        Login to Portal
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ zIndex: 5, marginTop: 'auto', padding: '20px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', background: 'rgba(15, 23, 42, 0.8)' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                    &copy; 2026 Gatherly — Enterprise Event Management Platform.
                </p>
            </footer>
        </div>
    );
};

export default Home;
