import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import ParticleCanvas from '../components/ParticleCanvas';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password || password !== confirm) { setError('Passwords do not match or fields are empty.'); return; }
        try {
            setLoading(true);
            await signup(email, password);
            showToast('Account created successfully!', 'success');
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.error || 'Signup failed.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '20px', background: '#030712', color: '#f8fafc' }}>
            {/* Cerebrium AI Perspective Grid & Nebula Canvas */}
            <ParticleCanvas />

            {/* Glowing Ambient Ambient Orbs */}
            <div className="blue-ambient-orb" style={{ top: '-120px', left: '15%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(56, 189, 248, 0.12) 60%, transparent 80%)' }}></div>
            <div className="blue-ambient-orb" style={{ bottom: '-120px', right: '15%', width: '550px', height: '550px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, rgba(168, 85, 247, 0.12) 60%, transparent 80%)', animationDelay: '-4s' }}></div>

            <div style={{ display: 'flex', width: '100%', maxWidth: '1020px', minHeight: '600px', borderRadius: '28px', overflow: 'hidden', background: 'rgba(9, 14, 28, 0.75)', border: '1px solid rgba(99, 102, 241, 0.35)', boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.85), 0 0 45px rgba(99, 102, 241, 0.3)', backdropFilter: 'blur(24px)', zIndex: 5 }}>
                {/* Left Visual Panel */}
                <div style={{ flex: 1.1, backgroundImage: "url('/assets/login_hero.png')", backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px' }} className="auth-left-panel">
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(11, 17, 32, 0.9) 0%, rgba(37, 99, 235, 0.45) 100%)' }}></div>
                    
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#e0f2fe', textDecoration: 'none', background: 'rgba(255, 255, 255, 0.1)', padding: '8px 18px', borderRadius: '20px', backdropFilter: 'blur(10px)', fontSize: '0.88rem', fontWeight: 600, border: '1px solid rgba(255, 255, 255, 0.15)', transition: 'all 0.2s' }}>
                            <i className="fas fa-arrow-left" style={{ color: '#38bdf8' }}></i> Back to Home
                        </Link>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '20px', padding: '5px 14px', marginBottom: '16px' }}>
                            <i className="fas fa-sparkles" style={{ color: '#38bdf8', fontSize: '0.8rem' }}></i>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7dd3fc' }}>Join Gatherly Today</span>
                        </div>
                        <h2 className="blue-text-shimmer" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: '14px', lineHeight: 1.25 }}>
                            Host Events People Love to Attend.
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.96rem', lineHeight: 1.6, margin: 0 }}>
                            Instant setup for community leads, event hosts, venue managers, and team coordinators.
                        </p>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div style={{ flex: 1, padding: '40px 45px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.5)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 25px rgba(37, 99, 235, 0.5)' }}>
                            <i className="fas fa-cubes" style={{ fontSize: '1.6rem', color: '#fff' }}></i>
                        </div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>Create Your Free Account</h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>Get started with Gatherly in less than a minute</p>
                    </div>

                    {error && <div className="form-error" style={{ display: 'block', marginBottom: '15px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '0.88rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <i className="fas fa-envelope" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="organizer@gatherly.com" 
                                    className="form-input" 
                                    autoComplete="email"
                                    style={{ paddingLeft: '40px', borderRadius: '10px', height: '46px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.25)', color: '#f8fafc', fontSize: '0.95rem' }}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="input-group" style={{ marginTop: '15px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <i className="fas fa-lock" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="••••••••" 
                                    className="form-input" 
                                    autoComplete="new-password"
                                    style={{ paddingLeft: '40px', borderRadius: '10px', height: '46px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.25)', color: '#f8fafc', fontSize: '0.95rem' }}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="input-group" style={{ marginTop: '15px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <i className="fas fa-shield-alt" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
                                <input 
                                    type="password" 
                                    value={confirm} 
                                    onChange={(e) => setConfirm(e.target.value)} 
                                    placeholder="••••••••" 
                                    className="form-input" 
                                    autoComplete="new-password"
                                    style={{ paddingLeft: '40px', borderRadius: '10px', height: '46px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.25)', color: '#f8fafc', fontSize: '0.95rem' }}
                                    required 
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn blue-glow-btn btn-block" style={{ marginTop: '24px', width: '100%', height: '48px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600 }} disabled={loading}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <i className="fas fa-spinner fa-spin"></i> Registering...
                                </span>
                            ) : (
                                <span>Create Free Account</span>
                            )}
                        </button>
                    </form>

                    <div style={{ marginTop: '22px', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0 }}>
                            Already have an account? <Link to="/login" style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;

