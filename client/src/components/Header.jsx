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
        <header className="main-header">
            <div className="header-left">
                <button className="mobile-toggle" id="mobile-toggle-btn" onClick={onToggleMobileMenu}>
                    <i className="fas fa-bars"></i>
                </button>
                <button
                    className="desktop-toggle-btn"
                    onClick={onToggleSidebarCollapse}
                    title={isSidebarCollapsed ? "Expand Sidebar Navigation" : "Collapse Sidebar for Full Screen View"}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', borderRadius: '10px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(99,102,241,0.3)'; }}
                    onMouseOut={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}>
                    <i className={`fas ${isSidebarCollapsed ? 'fa-indent' : 'fa-outdent'}`}></i>
                </button>
                <h1 className="page-title">{pageTitle}</h1>
            </div>
            <div className="header-right" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                
                {/* Color Blindness & Accessibility Mode Selector */}
                <div style={{ position: 'relative' }}>
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
                        }}>
                        <option value="none">👁️ Vision: Default</option>
                        <option value="protanopia">👁️ Protanopia (Red-Blind)</option>
                        <option value="deuteranopia">👁️ Deuteranopia (Green-Blind)</option>
                        <option value="tritanopia">👁️ Tritanopia (Blue-Blind)</option>
                        <option value="highcontrast">👁️ High Contrast Monochrome</option>
                    </select>
                </div>

                {/* Role Mode Switcher Toggle */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(15,23,42,0.8)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(56,189,248,0.25)' }}>
                    <button
                        onClick={() => handleRoleToggle('admin')}
                        style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.2s', background: isAdmin ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'transparent', color: isAdmin ? '#fff' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}
                        title="Switch to Admin Management Console">
                        <i className="fas fa-user-shield"></i> Admin Mode
                    </button>
                    <button
                        onClick={() => handleRoleToggle('user')}
                        style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.2s', background: !isAdmin ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'transparent', color: !isAdmin ? '#fff' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}
                        title="Switch to Attendee User Portal">
                        <i className="fas fa-user"></i> User Mode
                    </button>
                </div>

                <span className="badge badge-success" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span className="pulse-dot"></span> {isAdmin ? 'Admin Console' : 'User Portal'}
                </span>
                <div className="header-date">
                    <i className="far fa-clock"></i>
                    <span>{timeStr}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
