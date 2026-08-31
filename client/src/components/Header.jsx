import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

const Header = ({ pageTitle, onToggleMobileMenu, isSidebarCollapsed, onToggleSidebarCollapse }) => {
    const [timeStr, setTimeStr] = useState('');
    const [colorBlindMode, setColorBlindMode] = useState(() => localStorage.getItem('gatherly_colorblind') || 'none');
    const { user, switchRole } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin = user?.role === 'Super Admin' || user?.role === 'Organizer' || user?.role === 'admin';

    useEffect(() => {
        const update = () => setTimeStr(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('gatherly_colorblind') || 'none';
        document.body.setAttribute('data-colorblind', saved);
    }, []);

    const handleColorBlindChange = (mode) => {
        setColorBlindMode(mode);
        localStorage.setItem('gatherly_colorblind', mode);
        document.body.setAttribute('data-colorblind', mode);
        const labels = {
            none: 'Default Vision',
            protanopia: 'Protanopia (Red-Blind)',
            deuteranopia: 'Deuteranopia (Green-Blind)',
            tritanopia: 'Tritanopia (Blue-Blind)',
            highcontrast: 'High Contrast'
        };
        showToast(`Vision Mode: ${labels[mode] || mode}`, 'info');
    };

    const handleRoleToggle = (targetRole) => {
        switchRole(targetRole);
        showToast(`Switched to ${targetRole === 'admin' ? 'Admin Mode' : 'User Mode'}`, 'info');
        if (targetRole === 'user' && (location.pathname === '/dashboard' || location.pathname === '/security' || location.pathname === '/finance')) {
            navigate('/events');
        } else if (targetRole === 'admin' && location.pathname === '/events') {
            navigate('/dashboard');
        }
    };

    return (
        <header className="main-header" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 24px',
            background: 'rgba(5, 11, 26, 0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(129, 140, 248, 0.12)',
            minHeight: '64px',
            width: '100%',
            gap: '16px',
            flexWrap: 'nowrap'
        }}>
            <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '0 1 auto', minWidth: 0 }}>
                <button className="mobile-toggle" id="mobile-toggle-btn" onClick={onToggleMobileMenu} style={{ flexShrink: 0 }}>
                    <i className="fas fa-bars"></i>
                </button>
                <button
                    className="desktop-toggle-btn"
                    onClick={onToggleSidebarCollapse}
                    title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0 }}
                    onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(99,102,241,0.3)'; }}
                    onMouseOut={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}>
                    <i className={`fas ${isSidebarCollapsed ? 'fa-indent' : 'fa-outdent'}`}></i>
                </button>
                <h1 className="page-title" style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pageTitle}</h1>
            </div>

            <div className="header-right" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'nowrap', flexShrink: 0 }}>
                {/* Accessibility Mode Selector */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <select
                        value={colorBlindMode}
                        onChange={(e) => handleColorBlindChange(e.target.value)}
                        title="Vision & Accessibility Modes"
                        style={{
                            background: colorBlindMode !== 'none' ? '#0284c7' : 'rgba(15,23,42,0.8)',
                            color: '#f1f5f9',
                            border: '1px solid rgba(56,189,248,0.25)',
                            borderRadius: '10px',
                            padding: '6px 12px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap'
                        }}>
                        <option value="none">👁️ Default</option>
                        <option value="protanopia">👁️ Protanopia</option>
                        <option value="deuteranopia">👁️ Deuteranopia</option>
                        <option value="tritanopia">👁️ Tritanopia</option>
                        <option value="highcontrast">👁️ High Contrast</option>
                    </select>
                </div>

                {/* Role Switcher Toggle */}
                <div style={{ display: 'inline-flex', gap: '2px', background: 'rgba(15,23,42,0.8)', padding: '3px', borderRadius: '10px', border: '1px solid rgba(56,189,248,0.2)', flexShrink: 0 }}>
                    <button
                        onClick={() => handleRoleToggle('admin')}
                        style={{ padding: '5px 10px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.2s', background: isAdmin ? '#2563eb' : 'transparent', color: isAdmin ? '#fff' : '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        title="Switch to Admin Mode">
                        <i className="fas fa-user-shield"></i> Admin
                    </button>
                    <button
                        onClick={() => handleRoleToggle('user')}
                        style={{ padding: '5px 10px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.2s', background: !isAdmin ? '#2563eb' : 'transparent', color: !isAdmin ? '#fff' : '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        title="Switch to User Mode">
                        <i className="fas fa-user"></i> User
                    </button>
                </div>

                <div className="header-date" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(255,255,255,0.03)', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <i className="far fa-clock"></i>
                    <span>{timeStr}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
