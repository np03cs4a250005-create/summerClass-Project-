import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { soundFx } from './utils/soundEffects';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ParticleCanvas from './components/ParticleCanvas';
import BackgroundMusic from './components/BackgroundMusic';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EventsHub from './pages/EventsHub';
import Venues from './pages/Venues';
import Attendees from './pages/Attendees';
import Tickets from './pages/Tickets';
import RegistrationPortal from './pages/RegistrationPortal';
import CalendarView from './pages/CalendarView';
import Reports from './pages/Reports';
import Communications from './pages/Communications';
import QrCertificates from './pages/QrCertificates';
import Feedback from './pages/Feedback';
import TeamSpeakers from './pages/TeamSpeakers';
import FinanceSponsors from './pages/FinanceSponsors';
import GamificationFiles from './pages/GamificationFiles';
import LiveChat from './pages/LiveChat';
import TasksAgenda from './pages/TasksAgenda';
import SecurityLogs from './pages/SecurityLogs';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="app-spinner-wrapper">
            <div className="app-spinner"></div>
            <p>Loading Gatherly Suite...</p>
        </div>
    );
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const Layout = ({ children }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const location = useLocation();

    const getTitle = () => {
        const titles = {
            '/dashboard': 'Dashboard Overview',
            '/events': 'Events Management Hub',
            '/venues': 'Venues & Locations',
            '/attendees': 'Attendee Registry & Imports',
            '/tickets': 'Tickets & Digital Issuance',
            '/registration': 'Registration Portal',
            '/calendar': 'Interactive Calendar',
            '/reports': 'Reports & Analytics',
            '/communications': 'Communications & Email',
            '/qr': 'QR Code & Certificate System',
            '/feedback': 'Feedback & Reviews',
            '/team': 'Team, Staff & Speakers',
            '/finance': 'Finance & Sponsors',
            '/gamification': 'Gamification & Files',
            '/realtime': 'Real-Time Features & Chat',
            '/tasks': 'Tasks & Master Agenda',
            '/security': 'Security Settings & Logs',
        };
        return titles[location.pathname] || 'Console';
    };

    return (
        <div className={`dashboard-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`} style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
            <ParticleCanvas />
            <Sidebar
                isOpen={isMobileOpen}
                isCollapsed={isSidebarCollapsed}
                onClose={() => setIsMobileOpen(false)}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <div className="main-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header
                    pageTitle={getTitle()}
                    onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
                    isSidebarCollapsed={isSidebarCollapsed}
                    onToggleSidebarCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
                <main className="content-body" id="content-body" style={{ flex: 1, padding: '25px' }}>
                    {children}
                </main>
                <footer className="dashboard-footer">
                    <p>&copy; 2026 Gatherly Suite — Enterprise Event Platform</p>
                </footer>
            </div>
        </div>
    );
};

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Layout><EventsHub /></Layout></ProtectedRoute>} />
        <Route path="/venues" element={<ProtectedRoute><Layout><Venues /></Layout></ProtectedRoute>} />
        <Route path="/attendees" element={<ProtectedRoute><Layout><Attendees /></Layout></ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute><Layout><Tickets /></Layout></ProtectedRoute>} />
        <Route path="/registration" element={<ProtectedRoute><Layout><RegistrationPortal /></Layout></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Layout><CalendarView /></Layout></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
        <Route path="/communications" element={<ProtectedRoute><Layout><Communications /></Layout></ProtectedRoute>} />
        <Route path="/qr" element={<ProtectedRoute><Layout><QrCertificates /></Layout></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><Layout><Feedback /></Layout></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><Layout><TeamSpeakers /></Layout></ProtectedRoute>} />
        <Route path="/finance" element={<ProtectedRoute><Layout><FinanceSponsors /></Layout></ProtectedRoute>} />
        <Route path="/gamification" element={<ProtectedRoute><Layout><GamificationFiles /></Layout></ProtectedRoute>} />
        <Route path="/realtime" element={<ProtectedRoute><Layout><LiveChat /></Layout></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Layout><TasksAgenda /></Layout></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute><Layout><SecurityLogs /></Layout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

const App = () => {
    useEffect(() => {
        const handleGlobalClick = (e) => {
            const target = e.target.closest('button, .btn, a, [role="button"], input[type="submit"], input[type="button"], .tab-btn, .nav-item');
            if (target) {
                soundFx.playRoboticClick();
            }
        };
        window.addEventListener('click', handleGlobalClick, true);
        return () => window.removeEventListener('click', handleGlobalClick, true);
    }, []);

    return (
        <AuthProvider>
            <ToastProvider>
                <AppRoutes />
                <BackgroundMusic />
            </ToastProvider>
        </AuthProvider>
    );
};

export default App;

