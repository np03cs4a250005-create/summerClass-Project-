import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import BackgroundMusic from './BackgroundMusic';

const Header = ({ pageTitle, onToggleMobileMenu, isSidebarCollapsed, onToggleSidebarCollapse }) => {
    const [timeStr, setTimeStr] = useState('');
    const [colorBlindMode, setColorBlindMode] = useState(() => localStorage.getItem('gatherly_colorblind') || 'none');
    const { user, switchRole } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin = user?.role === 'Super Admin' || user?.role === 'Organizer' || user?.role === 'admin';

    useEffect(() => {
        const update = () => setTimeStr(new Date().toLocaleTimeString());
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
            highcontrast: 'High Contrast Monochrome'
        };
        showToast(`Accessibility Vision Mode: ${labels[mode] || mode}`, 'info');
    };

    const handleRoleToggle = (targetRole) => {
        switchRole(targetRole);
        showToast(`Switched workspace to ${targetRole === 'admin' ? 'Admin / Organizer Mode' : 'Attendee / User Mode'}!`, 'info');
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
            justify: 'space-between',
            padding: '12px 24px',
            background: 'rgba(5, 11, 26, 0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(129, 140, 248, 0.12)',
            minHeight: '70px',
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
                    title={isSidebarCollapsed ? "Expand Sidebar Navigation" : "Collapse Sidebar for Full Screen View"}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', borderRadius: '10px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0 }}
                    onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(99,102,241,0.3)'; }}
                    onMouseOut={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}>
                    <i className={`fas ${isSidebarCollapsed ? 'fa-indent' : 'fa-outdent'}`}></i>
                </button>
                <h1 className="page-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>{pageTitle}</h1>
            </div>

            <div className="header-right" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'nowrap', flexShrink: 0 }}>
                
                {/* Embedded Background Music Control */}
                <BackgroundMusic embedMode={true} />
                
                {/* Header AI Voice Assistant Quick Button */}
                <button
                    onClick={() => {
                        const orbBtn = document.querySelector('.voice-assistant-orb-btn button');
                        if (orbBtn) orbBtn.click();
                    }}
                    title="Talk to Gatherly AI Voice Assistant"
                    style={{
                        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(2, 132, 199, 0.2))',
                        border: '1.5px solid rgba(56, 189, 248, 0.6)',
                        color: '#ffffff',
                        borderRadius: '12px',
                        padding: '7px 14px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 0 20px rgba(56, 189, 248, 0.35)',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                    }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 10px #38bdf8', display: 'inline-block' }}></span>
                    <i className="fas fa-microphone" style={{ color: '#38bdf8' }}></i> Voice AI Assistant
                </button>

                {/* Color Blindness & Accessibility Mode Selector */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <select
                        value={colorBlindMode}
                        onChange={(e) => handleColorBlindChange(e.target.value)}
                        title="Accessibility & Color Blindness Vision Modes"
                        style={{
                            background: colorBlindMode !== 'none' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'rgba(15,23,42,0.8)',
                            color: colorBlindMode !== 'none' ? '#fff' : '#94a3b8',
                            border: '1px solid rgba(56,189,248,0.3)',
                            borderRadius: '12px',
                            padding: '6px 12px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap'
                        }}>
                        <option value="none">👁️ Vision: Default</option>
                        <option value="protanopia">👁️ Protanopia (Red-Blind)</option>
                        <option value="deuteranopia">👁️ Deuteranopia (Green-Blind)</option>
                        <option value="tritanopia">👁️ Tritanopia (Blue-Blind)</option>
                        <option value="highcontrast">👁️ High Contrast Monochrome</option>
                    </select>
                </div>

                {/* Role Mode Switcher Toggle */}
                <div style={{ display: 'inline-flex', gap: '4px', background: 'rgba(15,23,42,0.8)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(56,189,248,0.25)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                    <button
                        onClick={() => handleRoleToggle('admin')}
                        style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.2s', background: isAdmin ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'transparent', color: isAdmin ? '#fff' : '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                        title="Switch to Admin Management Console">
                        <i className="fas fa-user-shield"></i> Admin Mode
                    </button>
                    <button
                        onClick={() => handleRoleToggle('user')}
                        style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.2s', background: !isAdmin ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'transparent', color: !isAdmin ? '#fff' : '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                        title="Switch to Attendee User Portal">
                        <i className="fas fa-user"></i> User Mode
                    </button>
                </div>

                <span className="badge badge-success" style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', flexShrink: 0, whiteSpace: 'nowrap' }}>
                    <span className="pulse-dot"></span> {isAdmin ? 'Admin Console' : 'User Portal'}
                </span>
                <div className="header-date" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                    <i className="far fa-clock"></i>
                    <span>{timeStr}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
