import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

const adminMenuItems = [
    { path: '/dashboard', icon: 'fa-th-large', label: 'Admin Dashboard' },
    { path: '/events', icon: 'fa-calendar-alt', label: 'Events Management' },
    { path: '/venues', icon: 'fa-map-marked-alt', label: 'Venues & Seating' },
    { path: '/attendees', icon: 'fa-users', label: 'Attendee Registry' },
    { path: '/tickets', icon: 'fa-ticket-alt', label: 'Ticket Tiers & Passes' },
    { path: '/registration', icon: 'fa-user-check', label: 'Registration Approval' },
    { path: '/calendar', icon: 'fa-calendar-week', label: 'Master Calendar' },
    { path: '/reports', icon: 'fa-chart-line', label: 'Reports & Real Export' },
    { path: '/communications', icon: 'fa-bell', label: 'Communications & Email' },
    { path: '/qr', icon: 'fa-qrcode', label: 'QR Scanner & Certs' },
    { path: '/feedback', icon: 'fa-star', label: 'Feedback & Reviews' },
    { path: '/team', icon: 'fa-user-shield', label: 'Team & Speakers' },
    { path: '/finance', icon: 'fa-wallet', label: 'Finance & Sponsors' },
    { path: '/realtime', icon: 'fa-satellite-dish', label: 'Real-Time AI & Chat' },
    { path: '/tasks', icon: 'fa-tasks', label: 'Tasks & Agenda' },
    { path: '/security', icon: 'fa-lock', label: 'Security & Audit Logs' },
];

const userMenuItems = [
    { path: '/events', icon: 'fa-calendar-alt', label: 'Browse Events' },
    { path: '/tickets', icon: 'fa-ticket-alt', label: 'Reserve Tickets & Passes' },
    { path: '/feedback', icon: 'fa-star', label: 'Write & Read Reviews' },
    { path: '/realtime', icon: 'fa-robot', label: 'Gatherly AI Support & Chat' },
    { path: '/calendar', icon: 'fa-calendar-week', label: 'My Calendar & Schedule' },
    { path: '/tasks', icon: 'fa-tasks', label: 'Event Agenda' },
    { path: '/reports', icon: 'fa-file-lines', label: 'My Reports & Passes' },
];

const Sidebar = ({ isOpen, isCollapsed, onClose, onToggleCollapse }) => {
    const { user, logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const isAdmin = user?.role === 'Super Admin' || user?.role === 'Organizer' || user?.role === 'admin';
    const menuItems = isAdmin ? adminMenuItems : userMenuItems;

    const handleLogout = () => {
        logout();
        showToast('Logged out successfully', 'info');
        navigate('/login');
    };

    return (
        <aside className={`sidebar ${isOpen ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
            <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', height: 'auto', borderBottom: '1px solid rgba(56,189,248,0.2)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-cubes brand-logo" style={{ fontSize: '1.4rem' }}></i>
                        <span className="sidebar-brand-text" style={{ fontSize: '1.2rem', fontWeight: 800 }}>Gatherly</span>
                    </div>
                    <span className="sidebar-brand-badge" style={{ fontSize: '0.7rem', fontWeight: 700, marginTop: '4px', background: isAdmin ? 'rgba(56,189,248,0.15)' : 'rgba(52,211,153,0.15)', color: isAdmin ? '#38bdf8' : '#34d399', padding: '2px 8px', borderRadius: '10px', border: `1px solid ${isAdmin ? 'rgba(56,189,248,0.3)' : 'rgba(52,211,153,0.3)'}` }}>
                        <i className={`fas ${isAdmin ? 'fa-user-shield' : 'fa-user'}`} style={{ marginRight: '4px' }}></i>
                        {isAdmin ? 'ADMIN' : 'USER'}
                    </span>
                </div>

                {/* Close / Collapse Sidebar Toggle Button */}
                <button
                    className="sidebar-close-btn"
                    onClick={onToggleCollapse}
                    title={isCollapsed ? "Expand Sidebar" : "Close / Collapse Sidebar (Full Screen View)"}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0 }}
                    onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(99,102,241,0.3)'; }}
                    onMouseOut={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}>
                    <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
                </button>
            </div>
            <nav className="sidebar-menu" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 160px)', padding: isCollapsed ? '16px 8px' : '16px' }}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        title={isCollapsed ? item.label : ''}
                        className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                    >
                        <i className={`fas ${item.icon}`}></i>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="sidebar-footer">
                <div className="user-pill" title={user?.email || 'Guest User'}>
                    <i className={`fas ${isAdmin ? 'fa-user-shield' : 'fa-user-circle'}`}></i>
                    <span className="user-email">{user?.email || 'Guest User'}</span>
                </div>
                <button className="logout-btn" onClick={handleLogout} title="Log Out">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
