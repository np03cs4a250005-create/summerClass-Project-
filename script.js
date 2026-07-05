// Event Management System (EventPro) Core Logic
// Persistent Data Store & State Management

const STORAGE_KEY = 'eventpro_db';

// Pre-hashed password for default admin (admin123)
const DEFAULT_ADMIN_EMAIL = 'admin@eventpro.com';
const DEFAULT_ADMIN_HASH = '240eb518362d535e6a47a73477f8cf8c5eceab43e622c34a15054f67623cf530'; // SHA-256 of 'admin123'

// Standard password hashing helper using Web Crypto API
async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Initial Mock Data
const INITIAL_DB = {
    users: [
        { email: DEFAULT_ADMIN_EMAIL, passwordHash: DEFAULT_ADMIN_HASH }
    ],
    events: [
        {
            id: 'ev-1',
            name: 'Global Tech Conference 2026',
            description: 'The ultimate gathering of developers, designers, and tech enthusiasts. Discover the latest in AI, Web Dev, and DevOps.',
            date: '2026-09-15',
            time: '09:00',
            location: 'San Francisco Innovation Hub',
            capacity: 250
        },
        {
            id: 'ev-2',
            name: 'Creative Design Summit',
            description: 'Explore the boundaries of UI/UX design, motion graphics, and visual design systems with global industry leaders.',
            date: '2026-10-22',
            time: '10:30',
            location: 'Metropolitan Art Center, NY',
            capacity: 150
        },
        {
            id: 'ev-3',
            name: 'Green Energy Startup Pitch',
            description: 'Promising clean-tech startups present their innovations to top tier venture capitalists and green energy experts.',
            date: '2026-11-05',
            time: '14:00',
            location: 'Sustainability Pavilion, Austin',
            capacity: 80
        }
    ],
    attendees: [
        { id: 'att-1', name: 'Jane Doe', email: 'jane.doe@example.com', phone: '+1-555-0199' },
        { id: 'att-2', name: 'John Smith', email: 'john.smith@example.com', phone: '+1-555-0142' },
        { id: 'att-3', name: 'Alice Johnson', email: 'alice.j@example.com', phone: '+1-555-0177' },
        { id: 'att-4', name: 'Carlos Mendez', email: 'carlos.m@example.com', phone: '+1-555-0158' }
    ],
    registrations: [
        { eventId: 'ev-1', attendeeId: 'att-1' },
        { eventId: 'ev-1', attendeeId: 'att-2' },
        { eventId: 'ev-2', attendeeId: 'att-2' },
        { eventId: 'ev-2', attendeeId: 'att-3' },
        { eventId: 'ev-3', attendeeId: 'att-1' },
        { eventId: 'ev-3', attendeeId: 'att-4' }
    ]
};

// Global App State
const App = {
    db: null,
    state: {
        currentView: 'login', // 'login', 'signup', 'dashboard', 'events', 'event-form', 'attendees', 'attendee-form'
        currentUser: null,
        editingEventId: null,
        editingAttendeeId: null,
        eventSearchQuery: '',
        attendeeSearchQuery: '',
        activeDetailEventId: null
    },

    // Initialize Database
    initDb() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                this.db = JSON.parse(stored);
                // Ensure structural integrity
                if (!this.db.users) this.db.users = INITIAL_DB.users;
                if (!this.db.events) this.db.events = INITIAL_DB.events;
                if (!this.db.attendees) this.db.attendees = INITIAL_DB.attendees;
                if (!this.db.registrations) this.db.registrations = INITIAL_DB.registrations;
            } catch (e) {
                console.error("Error parsing DB, resetting to defaults", e);
                this.db = JSON.parse(JSON.stringify(INITIAL_DB));
                this.saveDb();
            }
        } else {
            this.db = JSON.parse(JSON.stringify(INITIAL_DB));
            this.saveDb();
        }
    },

    saveDb() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
    },

    // Session Management
    checkSession() {
        const user = sessionStorage.getItem('eventpro_session');
        if (user) {
            this.state.currentUser = user;
            // If they were on login or signup, send them to dashboard
            if (this.state.currentView === 'login' || this.state.currentView === 'signup') {
                this.navigate('dashboard');
            } else {
                this.render();
            }
        } else {
            this.state.currentUser = null;
            // Route protection: If not logged in, force to login
            this.navigate('login');
        }
    },

    async handleLogin(email, password) {
        const errorDiv = document.getElementById('login-error');
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';

        if (!email || !password) {
            this.showFormError(errorDiv, 'Please enter both email and password.');
            return;
        }

        const hashed = await hashPassword(password);
        const user = this.db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hashed);

        if (user) {
            sessionStorage.setItem('eventpro_session', user.email);
            this.state.currentUser = user.email;
            this.showToast('Login successful! Welcome back.', 'success');
            this.navigate('dashboard');
        } else {
            this.showFormError(errorDiv, 'Invalid email or password.');
            this.showToast('Authentication failed.', 'error');
        }
    },

    async handleSignup(email, password, confirmPassword) {
        const errorDiv = document.getElementById('signup-error');
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';

        if (!email || !password || !confirmPassword) {
            this.showFormError(errorDiv, 'All fields are required.');
            return;
        }

        // Email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showFormError(errorDiv, 'Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            this.showFormError(errorDiv, 'Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            this.showFormError(errorDiv, 'Passwords do not match.');
            return;
        }

        const exists = this.db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
            this.showFormError(errorDiv, 'An account with this email already exists.');
            return;
        }

        const hashed = await hashPassword(password);
        this.db.users.push({
            email: email,
            passwordHash: hashed
        });
        this.saveDb();

        this.showToast('Account created successfully!', 'success');
        // Auto login
        sessionStorage.setItem('eventpro_session', email);
        this.state.currentUser = email;
        this.navigate('dashboard');
    },

    handleLogout() {
        sessionStorage.removeItem('eventpro_session');
        this.state.currentUser = null;
        this.showToast('Logged out successfully.', 'info');
        this.navigate('login');
    },

    // Navigation & Routing
    navigate(view) {
        this.state.currentView = view;
        
        // Hide sidebar menu overlay on mobile after clicking
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('active');

        // Scroll page to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Check auth requirements
        if (view !== 'login' && view !== 'signup' && !this.state.currentUser) {
            this.state.currentView = 'login';
        }

        this.render();
    },

    // Toast Notifications
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        if (type === 'warning') icon = 'fa-exclamation-triangle';

        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        // Slide in
        setTimeout(() => toast.classList.add('visible'), 50);

        // Dismiss handlers
        const dismiss = () => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        };

        toast.querySelector('.toast-close').addEventListener('click', dismiss);
        
        // Auto dismiss
        setTimeout(dismiss, 4000);
    },

    showFormError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
        element.style.animation = 'shake 0.4s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 400);
    },

    // Render Master Method
    render() {
        const body = document.body;
        
        // Kill previous particle animation if any
        if (this.particleAnimId) {
            cancelAnimationFrame(this.particleAnimId);
            this.particleAnimId = null;
        }

        // Setup base structure depending on whether we are logged in or out
        if (this.state.currentView === 'login' || this.state.currentView === 'signup') {
            body.className = 'auth-layout';
            body.innerHTML = this.getAuthTemplate();
            this.bindAuthEvents();
            this.initParticles();
        } else {
            body.className = 'dashboard-layout';
            body.innerHTML = this.getDashboardShellTemplate();
            this.renderActiveViewContent();
            this.bindDashboardEvents();
            this.animateCounters();
        }
    },

    // View templates generators
    getAuthTemplate() {
        const isLogin = this.state.currentView === 'login';
        return `
            <canvas id="particle-canvas"></canvas>
            <div class="auth-wrapper">
                <div class="auth-card">
                    <div class="auth-logo">
                        <i class="fas fa-cubes"></i>
                        <span>EventPro</span>
                    </div>
                    <h2>${isLogin ? 'Welcome Back' : 'Create Admin Account'}</h2>
                    <p class="auth-subtitle">${isLogin ? 'Sign in to manage your events & attendees' : 'Set up credentials to access the console'}</p>
                    
                    <div id="${isLogin ? 'login-error' : 'signup-error'}" class="auth-error-box" style="display: none;"></div>

                    <form id="${isLogin ? 'login-form' : 'signup-form'}" novalidate>
                        <div class="input-group">
                            <label for="auth-email">Admin Email</label>
                            <div class="input-wrapper">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="auth-email" placeholder="admin@eventpro.com" required>
                            </div>
                        </div>

                        <div class="input-group">
                            <label for="auth-password">Password</label>
                            <div class="input-wrapper">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="auth-password" placeholder="••••••••" required>
                            </div>
                        </div>

                        ${!isLogin ? `
                        <div class="input-group">
                            <label for="auth-confirm-password">Confirm Password</label>
                            <div class="input-wrapper">
                                <i class="fas fa-shield-alt"></i>
                                <input type="password" id="auth-confirm-password" placeholder="••••••••" required>
                            </div>
                        </div>
                        ` : ''}

                        <button type="submit" class="auth-submit-btn">
                            <span>${isLogin ? 'Sign In' : 'Sign Up'}</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </form>

                    <div class="auth-footer">
                        ${isLogin ? `
                            <span>Don't have an admin account?</span>
                            <a href="#" onclick="App.navigate('signup'); return false;">Register one now</a>
                        ` : `
                            <span>Already have an account?</span>
                            <a href="#" onclick="App.navigate('login'); return false;">Login here</a>
                        `}
                    </div>
                </div>
            </div>
            <div id="toast-container"></div>
        `;
    },

    getDashboardShellTemplate() {
        const view = this.state.currentView;
        return `
            <!-- Sidebar Drawer -->
            <aside class="sidebar" id="sidebar">
                <div class="sidebar-brand">
                    <i class="fas fa-cubes brand-logo"></i>
                    <span>EventPro</span>
                </div>
                <nav class="sidebar-menu">
                    <a href="#" class="menu-item ${view === 'dashboard' ? 'active' : ''}" onclick="App.navigate('dashboard'); return false;">
                        <i class="fas fa-th-large"></i>
                        <span>Dashboard</span>
                    </a>
                    <a href="#" class="menu-item ${view === 'events' || view === 'event-form' ? 'active' : ''}" onclick="App.navigate('events'); return false;">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Events</span>
                    </a>
                    <a href="#" class="menu-item ${view === 'attendees' || view === 'attendee-form' ? 'active' : ''}" onclick="App.navigate('attendees'); return false;">
                        <i class="fas fa-users"></i>
                        <span>Attendees</span>
                    </a>
                </nav>
                <div class="sidebar-footer">
                    <div class="user-pill">
                        <i class="fas fa-user-circle"></i>
                        <span class="user-email" title="${this.state.currentUser}">${this.state.currentUser}</span>
                    </div>
                    <button class="logout-btn" onclick="App.handleLogout()">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            <!-- Main Layout Wrapper -->
            <div class="main-wrapper">
                <!-- Top Header -->
                <header class="main-header">
                    <div class="header-left">
                        <button class="mobile-toggle" id="mobile-toggle-btn">
                            <i class="fas fa-bars"></i>
                        </button>
                        <h1 class="page-title">${this.getPageTitle()}</h1>
                    </div>
                    <div class="header-right">
                        <div class="header-date">
                            <i class="far fa-clock"></i>
                            <span id="current-time"></span>
                        </div>
                    </div>
                </header>

                <!-- Page Content Section -->
                <main class="content-body" id="content-body">
                    <!-- Loaded dynamically -->
                </main>

                <!-- Footer -->
                <footer class="dashboard-footer">
                    <p>&copy; 2026 EventPro Inc. All rights reserved. Premium Dashboard System.</p>
                </footer>
            </div>

            <!-- Modals Container -->
            <div class="modal-overlay" id="modal-overlay"></div>

            <!-- Toast Messages -->
            <div id="toast-container"></div>
        `;
    },

    getPageTitle() {
        switch (this.state.currentView) {
            case 'dashboard': return 'Dashboard Overview';
            case 'events': return 'Event Catalog';
            case 'event-form': return this.state.editingEventId ? 'Edit Event Details' : 'Create New Event';
            case 'attendees': return 'Attendee Registry';
            case 'attendee-form': return this.state.editingAttendeeId ? 'Edit Attendee' : 'Register New Attendee';
            default: return 'Console';
        }
    },

    // Rendering Active Page Contents
    renderActiveViewContent() {
        const container = document.getElementById('content-body');
        if (!container) return;

        switch (this.state.currentView) {
            case 'dashboard':
                container.innerHTML = this.getDashboardHTML();
                this.bindDashboardWidgets();
                break;
            case 'events':
                container.innerHTML = this.getEventsHTML();
                this.bindEventsListHandlers();
                break;
            case 'event-form':
                container.innerHTML = this.getEventFormHTML();
                this.bindEventFormHandlers();
                break;
            case 'attendees':
                container.innerHTML = this.getAttendeesHTML();
                this.bindAttendeesListHandlers();
                break;
            case 'attendee-form':
                container.innerHTML = this.getAttendeeFormHTML();
                this.bindAttendeeFormHandlers();
                break;
        }
    },

    // Render Dashboard View
    getDashboardHTML() {
        const eventCount = this.db.events.length;
        const attendeeCount = this.db.attendees.length;
        const regCount = this.db.registrations.length;

        // Calculate Capacity utilization
        let totalCapacity = 0;
        this.db.events.forEach(e => totalCapacity += Number(e.capacity || 0));
        const utilization = totalCapacity > 0 ? Math.round((regCount / totalCapacity) * 100) : 0;

        // Fetch upcoming events (sorted by date)
        const upcomingEvents = [...this.db.events]
            .filter(e => new Date(e.date) >= new Date().setHours(0,0,0,0))
            .sort((a,b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);

        return `
            <!-- Analytics Cards -->
            <div class="stats-grid">
                <div class="stat-card card-glow-indigo">
                    <div class="stat-icon bg-soft-indigo">
                        <i class="fas fa-calendar-alt text-indigo"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Total Events</h3>
                        <p class="stat-value">${eventCount}</p>
                        <span class="stat-desc">Scheduled in database</span>
                    </div>
                </div>

                <div class="stat-card card-glow-emerald">
                    <div class="stat-icon bg-soft-emerald">
                        <i class="fas fa-users text-emerald"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Registered Attendees</h3>
                        <p class="stat-value">${attendeeCount}</p>
                        <span class="stat-desc">Unique customers</span>
                    </div>
                </div>

                <div class="stat-card card-glow-violet">
                    <div class="stat-icon bg-soft-violet">
                        <i class="fas fa-ticket-alt text-violet"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Total Registrations</h3>
                        <p class="stat-value">${regCount}</p>
                        <span class="stat-desc">Active seat bookings</span>
                    </div>
                </div>

                <div class="stat-card card-glow-amber">
                    <div class="stat-icon bg-soft-amber">
                        <i class="fas fa-chart-pie text-amber"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Seat Occupancy</h3>
                        <p class="stat-value">${utilization}%</p>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${Math.min(utilization, 100)}%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Dashboard Split Content -->
            <div class="dashboard-split">
                <!-- Upcoming Events Table -->
                <div class="dashboard-panel">
                    <div class="panel-header">
                        <h2>Upcoming Scheduled Events</h2>
                        <button class="btn btn-primary btn-sm" onclick="App.navigate('event-form')">
                            <i class="fas fa-plus"></i> Add Event
                        </button>
                    </div>
                    <div class="panel-body">
                        ${upcomingEvents.length === 0 ? `
                            <div class="empty-state">
                                <i class="far fa-calendar-times"></i>
                                <p>No upcoming events scheduled.</p>
                            </div>
                        ` : `
                            <div class="table-responsive">
                                <table class="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Event Name</th>
                                            <th>Date & Time</th>
                                            <th>Location</th>
                                            <th>Occupancy</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${upcomingEvents.map(ev => {
                                            const registered = this.db.registrations.filter(r => r.eventId === ev.id).length;
                                            const dateObj = new Date(ev.date);
                                            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                            const fillPercent = ev.capacity > 0 ? Math.round((registered / ev.capacity) * 100) : 0;
                                            return `
                                                <tr>
                                                    <td>
                                                        <div class="event-name-td">
                                                            <strong>${this.escapeHTML(ev.name)}</strong>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="event-datetime-td">
                                                            <span><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                                                            <span><i class="far fa-clock"></i> ${ev.time}</span>
                                                        </div>
                                                    </td>
                                                    <td><i class="fas fa-map-marker-alt text-muted"></i> ${this.escapeHTML(ev.location)}</td>
                                                    <td>
                                                        <div class="capacity-indicator">
                                                            <span>${registered} / ${ev.capacity}</span>
                                                            <div class="capacity-bar-mini">
                                                                <div class="capacity-fill-mini" style="width: ${Math.min(fillPercent, 100)}%"></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="actions-cell">
                                                            <button class="btn-icon" title="View details" onclick="App.openEventDetails('${ev.id}')">
                                                                <i class="far fa-eye text-indigo"></i>
                                                            </button>
                                                            <button class="btn-icon" title="Edit" onclick="App.editEvent('${ev.id}')">
                                                                <i class="far fa-edit text-amber"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `}
                    </div>
                </div>

                <!-- Recent Registrations and Shortcuts -->
                <div class="dashboard-panel panel-shortcuts">
                    <div class="panel-header">
                        <h2>Quick Actions</h2>
                    </div>
                    <div class="panel-body grid-shortcuts">
                        <button class="shortcut-box hover-lift" onclick="App.navigate('event-form')">
                            <i class="fas fa-calendar-plus text-indigo"></i>
                            <span>New Event</span>
                        </button>
                        <button class="shortcut-box hover-lift" onclick="App.navigate('attendee-form')">
                            <i class="fas fa-user-plus text-emerald"></i>
                            <span>New Attendee</span>
                        </button>
                        <button class="shortcut-box hover-lift" onclick="App.navigate('events')">
                            <i class="fas fa-search text-violet"></i>
                            <span>Search Events</span>
                        </button>
                        <button class="shortcut-box hover-lift" onclick="App.navigate('attendees')">
                            <i class="fas fa-id-badge text-amber"></i>
                            <span>Attendee Registry</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Render Events List View
    getEventsHTML() {
        // Filter events based on search query
        const filtered = this.db.events.filter(e => 
            e.name.toLowerCase().includes(this.state.eventSearchQuery.toLowerCase())
        );

        return `
            <div class="toolbar-section">
                <div class="search-bar-wrapper">
                    <i class="fas fa-search"></i>
                    <input type="text" id="event-search-input" placeholder="Search events by name..." value="${this.escapeHTML(this.state.eventSearchQuery)}">
                </div>
                <button class="btn btn-primary" onclick="App.navigate('event-form')">
                    <i class="fas fa-plus"></i> Add Event
                </button>
            </div>

            ${filtered.length === 0 ? `
                <div class="empty-state card-glass">
                    <i class="fas fa-calendar-times empty-icon"></i>
                    <h3>No events found</h3>
                    <p>Try searching for a different keyword or create a new event.</p>
                </div>
            ` : `
                <div class="events-grid">
                    ${filtered.map(ev => {
                        const registeredCount = this.db.registrations.filter(r => r.eventId === ev.id).length;
                        const dateObj = new Date(ev.date);
                        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        const isSoldOut = registeredCount >= ev.capacity;
                        
                        return `
                            <div class="event-card hover-lift">
                                <div class="event-card-header">
                                    <div class="event-badge ${isSoldOut ? 'badge-danger' : 'badge-success'}">
                                        ${isSoldOut ? 'Sold Out' : 'Open'}
                                    </div>
                                    <div class="event-card-date">
                                        <span class="day">${dateObj.getDate() || ''}</span>
                                        <span class="month">${dateObj.toLocaleDateString('en-US', { month: 'short' })}</span>
                                    </div>
                                </div>
                                <div class="event-card-body">
                                    <h3 class="event-card-title">${this.escapeHTML(ev.name)}</h3>
                                    <p class="event-card-desc">${this.escapeHTML(ev.description.substring(0, 80))}${ev.description.length > 80 ? '...' : ''}</p>
                                    
                                    <div class="event-details-list">
                                        <div class="detail-item">
                                            <i class="far fa-clock"></i>
                                            <span>${ev.time}</span>
                                        </div>
                                        <div class="detail-item">
                                            <i class="fas fa-map-marker-alt"></i>
                                            <span title="${this.escapeHTML(ev.location)}">${this.escapeHTML(ev.location)}</span>
                                        </div>
                                        <div class="detail-item">
                                            <i class="fas fa-users"></i>
                                            <span>${registeredCount} / ${ev.capacity} Attendees</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="event-card-footer">
                                    <button class="btn btn-secondary btn-sm" onclick="App.openEventDetails('${ev.id}')">
                                        <i class="far fa-eye"></i> Details
                                    </button>
                                    <div class="event-card-actions">
                                        <button class="btn-icon-circle" title="Edit" onclick="App.editEvent('${ev.id}')">
                                            <i class="far fa-edit text-amber"></i>
                                        </button>
                                        <button class="btn-icon-circle" title="Delete" onclick="App.deleteEvent('${ev.id}')">
                                            <i class="far fa-trash-alt text-danger"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `}
        `;
    },

    // Render Event Add & Edit Form
    getEventFormHTML() {
        const ev = this.state.editingEventId ? this.db.events.find(e => e.id === this.state.editingEventId) : null;
        
        return `
            <div class="form-container-card card-glass">
                <div class="form-header">
                    <i class="fas ${ev ? 'fa-edit' : 'fa-calendar-plus'} text-indigo"></i>
                    <h2>${ev ? 'Update Event Details' : 'Design New Event'}</h2>
                </div>
                <div id="event-form-error" class="error-banner" style="display: none;"></div>
                
                <form id="event-input-form" novalidate>
                    <div class="form-grid">
                        <div class="input-group span-full">
                            <label for="ev-name">Event Title <span class="required">*</span></label>
                            <input type="text" id="ev-name" placeholder="e.g. Developer Roundtable Meeting" value="${ev ? this.escapeHTML(ev.name) : ''}" required>
                            <span class="field-error-msg" id="err-ev-name"></span>
                        </div>

                        <div class="input-group span-full">
                            <label for="ev-desc">Event Description <span class="required">*</span></label>
                            <textarea id="ev-desc" rows="4" placeholder="Enter key topics, speakers, schedules and guidelines..." required>${ev ? this.escapeHTML(ev.description) : ''}</textarea>
                            <span class="field-error-msg" id="err-ev-desc"></span>
                        </div>

                        <div class="input-group">
                            <label for="ev-date">Scheduled Date <span class="required">*</span></label>
                            <input type="date" id="ev-date" value="${ev ? ev.date : ''}" required>
                            <span class="field-error-msg" id="err-ev-date"></span>
                        </div>

                        <div class="input-group">
                            <label for="ev-time">Scheduled Time <span class="required">*</span></label>
                            <input type="time" id="ev-time" value="${ev ? ev.time : ''}" required>
                            <span class="field-error-msg" id="err-ev-time"></span>
                        </div>

                        <div class="input-group">
                            <label for="ev-location">Venue/Location <span class="required">*</span></label>
                            <input type="text" id="ev-location" placeholder="e.g. Room 404, Online, or NYC" value="${ev ? this.escapeHTML(ev.location) : ''}" required>
                            <span class="field-error-msg" id="err-ev-location"></span>
                        </div>

                        <div class="input-group">
                            <label for="ev-capacity">Max Ticket Stock / Capacity <span class="required">*</span></label>
                            <input type="number" id="ev-capacity" min="1" placeholder="e.g. 100" value="${ev ? ev.capacity : '100'}" required>
                            <span class="field-error-msg" id="err-ev-capacity"></span>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="App.navigate('events')">Cancel</button>
                        <button type="submit" class="btn btn-primary">${ev ? 'Save Changes' : 'Create Event'}</button>
                    </div>
                </form>
            </div>
        `;
    },

    // Render Attendees List View
    getAttendeesHTML() {
        const filtered = this.db.attendees.filter(a => 
            a.name.toLowerCase().includes(this.state.attendeeSearchQuery.toLowerCase()) ||
            a.email.toLowerCase().includes(this.state.attendeeSearchQuery.toLowerCase())
        );

        return `
            <div class="toolbar-section">
                <div class="search-bar-wrapper">
                    <i class="fas fa-search"></i>
                    <input type="text" id="attendee-search-input" placeholder="Search attendees by name or email..." value="${this.escapeHTML(this.state.attendeeSearchQuery)}">
                </div>
                <button class="btn btn-primary" onclick="App.navigate('attendee-form')">
                    <i class="fas fa-plus"></i> Add Attendee
                </button>
            </div>

            <div class="panel-body card-glass table-panel">
                ${filtered.length === 0 ? `
                    <div class="empty-state">
                        <i class="fas fa-users-slash empty-icon"></i>
                        <h3>No attendees found</h3>
                        <p>Register new attendees or clear your search criteria.</p>
                    </div>
                ` : `
                    <div class="table-responsive">
                        <table class="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email Address</th>
                                    <th>Phone Number</th>
                                    <th>Events Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filtered.map(att => {
                                    const eventsJoinedCount = this.db.registrations.filter(r => r.attendeeId === att.id).length;
                                    return `
                                        <tr>
                                            <td>
                                                <div class="user-cell">
                                                    <div class="avatar">${att.name.charAt(0).toUpperCase()}</div>
                                                    <strong>${this.escapeHTML(att.name)}</strong>
                                                </div>
                                            </td>
                                            <td><a href="mailto:${att.email}" class="table-link">${this.escapeHTML(att.email)}</a></td>
                                            <td>${this.escapeHTML(att.phone)}</td>
                                            <td>
                                                <span class="badge ${eventsJoinedCount > 0 ? 'badge-primary' : 'badge-secondary'}">
                                                    ${eventsJoinedCount} Event(s)
                                                </span>
                                            </td>
                                            <td>
                                                <div class="actions-cell">
                                                    <button class="btn-icon" title="Edit Profile" onclick="App.editAttendee('${att.id}')">
                                                        <i class="far fa-edit text-amber"></i>
                                                    </button>
                                                    <button class="btn-icon" title="Remove Attendee" onclick="App.deleteAttendee('${att.id}')">
                                                        <i class="far fa-trash-alt text-danger"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;
    },

    // Render Attendee Add & Edit Form
    getAttendeeFormHTML() {
        const att = this.state.editingAttendeeId ? this.db.attendees.find(a => a.id === this.state.editingAttendeeId) : null;
        
        return `
            <div class="form-container-card card-glass">
                <div class="form-header">
                    <i class="fas ${att ? 'fa-user-edit' : 'fa-user-plus'} text-indigo"></i>
                    <h2>${att ? 'Update Attendee Profile' : 'Register New Attendee'}</h2>
                </div>
                <div id="attendee-form-error" class="error-banner" style="display: none;"></div>

                <form id="attendee-input-form" novalidate>
                    <div class="form-grid">
                        <div class="input-group span-full">
                            <label for="att-name">Full Name <span class="required">*</span></label>
                            <input type="text" id="att-name" placeholder="John Doe" value="${att ? this.escapeHTML(att.name) : ''}" required>
                            <span class="field-error-msg" id="err-att-name"></span>
                        </div>

                        <div class="input-group">
                            <label for="att-email">Email Address <span class="required">*</span></label>
                            <input type="email" id="att-email" placeholder="john.doe@example.com" value="${att ? this.escapeHTML(att.email) : ''}" required>
                            <span class="field-error-msg" id="err-att-email"></span>
                        </div>

                        <div class="input-group">
                            <label for="att-phone">Phone Number <span class="required">*</span></label>
                            <input type="tel" id="att-phone" placeholder="+1-555-0199 or 5550199" value="${att ? this.escapeHTML(att.phone) : ''}" required>
                            <span class="field-error-msg" id="err-att-phone"></span>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="App.navigate('attendees')">Cancel</button>
                        <button type="submit" class="btn btn-primary">${att ? 'Save Changes' : 'Register Attendee'}</button>
                    </div>
                </form>
            </div>
        `;
    },

    // Modal view for Event Detail & Registration Management
    openEventDetails(eventId) {
        this.state.activeDetailEventId = eventId;
        const ev = this.db.events.find(e => e.id === eventId);
        if (!ev) return;

        const attendeesRegistered = this.db.registrations
            .filter(r => r.eventId === eventId)
            .map(r => this.db.attendees.find(a => a.id === r.attendeeId))
            .filter(Boolean);

        // Attendees not registered for this event (for selection)
        const unassignedAttendees = this.db.attendees.filter(
            a => !this.db.registrations.some(r => r.eventId === eventId && r.attendeeId === a.id)
        );

        const dateObj = new Date(ev.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        const remainingCapacity = ev.capacity - attendeesRegistered.length;

        const modalContent = `
            <div class="modal-box card-glass">
                <div class="modal-header">
                    <h2>Event Overview Details</h2>
                    <button class="modal-close-btn" onclick="App.closeModal()">&times;</button>
                </div>
                <div class="modal-body-content">
                    <div class="detail-hero">
                        <span class="detail-hero-tag"><i class="fas fa-calendar-day"></i> Event Details</span>
                        <h2>${this.escapeHTML(ev.name)}</h2>
                    </div>

                    <div class="detail-columns">
                        <!-- Left Info Panel -->
                        <div class="detail-main-info">
                            <h3>About the Event</h3>
                            <p class="description-text">${this.escapeHTML(ev.description)}</p>

                            <div class="location-time-box">
                                <div class="box-item">
                                    <i class="far fa-calendar-alt text-indigo"></i>
                                    <div>
                                        <strong>Date & Time</strong>
                                        <p>${formattedDate} at ${ev.time}</p>
                                    </div>
                                </div>
                                <div class="box-item">
                                    <i class="fas fa-map-marker-alt text-indigo"></i>
                                    <div>
                                        <strong>Venue</strong>
                                        <p>${this.escapeHTML(ev.location)}</p>
                                    </div>
                                </div>
                                <div class="box-item">
                                    <i class="fas fa-chair text-indigo"></i>
                                    <div>
                                        <strong>Ticket Availability</strong>
                                        <p>${attendeesRegistered.length} registered / ${ev.capacity} total seats (${remainingCapacity} left)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Registration Panel -->
                        <div class="detail-registration-info">
                            <h3>Manage Registrations</h3>
                            
                            <!-- Assign Attendee Form -->
                            <div class="assign-form-box">
                                <label for="assign-select">Register Attendee to Event</label>
                                <div class="assign-input-row">
                                    <select id="assign-select" ${remainingCapacity <= 0 ? 'disabled' : ''}>
                                        <option value="">-- Choose Attendee --</option>
                                        ${unassignedAttendees.map(a => `
                                            <option value="${a.id}">${this.escapeHTML(a.name)} (${this.escapeHTML(a.email)})</option>
                                        `).join('')}
                                    </select>
                                    <button class="btn btn-primary" onclick="App.handleAssignAttendee('${ev.id}')" ${remainingCapacity <= 0 || unassignedAttendees.length === 0 ? 'disabled' : ''}>
                                        <i class="fas fa-user-plus"></i> Register
                                    </button>
                                </div>
                                ${remainingCapacity <= 0 ? '<p class="error-text"><i class="fas fa-exclamation-triangle"></i> This event is at full capacity!</p>' : ''}
                                ${unassignedAttendees.length === 0 && remainingCapacity > 0 ? '<p class="info-text">All registered attendees are already assigned to this event.</p>' : ''}
                            </div>

                            <!-- Registered Attendees List -->
                            <div class="registered-users-section">
                                <h4>Attendee Roster (${attendeesRegistered.length})</h4>
                                ${attendeesRegistered.length === 0 ? `
                                    <div class="no-users-box">
                                        <i class="fas fa-user-friends"></i>
                                        <p>No attendees registered yet.</p>
                                    </div>
                                ` : `
                                    <ul class="roster-list">
                                        ${attendeesRegistered.map(a => `
                                            <li>
                                                <div class="roster-info">
                                                    <strong>${this.escapeHTML(a.name)}</strong>
                                                    <span>${this.escapeHTML(a.email)}</span>
                                                </div>
                                                <button class="btn-remove-roster" title="Remove Registration" onclick="App.handleUnregisterAttendee('${ev.id}', '${a.id}')">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </li>
                                        `).join('')}
                                    </ul>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const overlay = document.getElementById('modal-overlay');
        overlay.innerHTML = modalContent;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    },

    closeModal() {
        const overlay = document.getElementById('modal-overlay');
        overlay.classList.remove('active');
        overlay.innerHTML = '';
        document.body.style.overflow = ''; // Restore scroll
        this.state.activeDetailEventId = null;
        
        // Re-render the active view to reflect registration count updates instantly
        this.render();
    },

    handleAssignAttendee(eventId) {
        const select = document.getElementById('assign-select');
        if (!select) return;
        
        const attendeeId = select.value;
        if (!attendeeId) {
            this.showToast('Please select an attendee first.', 'warning');
            return;
        }

        // Double check capacity
        const ev = this.db.events.find(e => e.id === eventId);
        const registered = this.db.registrations.filter(r => r.eventId === eventId).length;
        if (registered >= ev.capacity) {
            this.showToast('Failed to assign: Event capacity has been reached.', 'error');
            return;
        }

        // Add registration
        this.db.registrations.push({ eventId, attendeeId });
        this.saveDb();

        this.showToast('Attendee registered successfully to this event.', 'success');
        
        // Re-open details to refresh lists dynamically
        this.openEventDetails(eventId);
    },

    handleUnregisterAttendee(eventId, attendeeId) {
        if (!confirm('Are you sure you want to remove this attendee registration?')) return;

        this.db.registrations = this.db.registrations.filter(
            r => !(r.eventId === eventId && r.attendeeId === attendeeId)
        );
        this.saveDb();

        this.showToast('Attendee registration removed.', 'info');
        
        // Re-open details to refresh
        this.openEventDetails(eventId);
    },

    // CRUD Event handlers
    editEvent(id) {
        this.state.editingEventId = id;
        this.navigate('event-form');
    },

    deleteEvent(id) {
        const ev = this.db.events.find(e => e.id === id);
        if (!ev) return;
        
        if (confirm(`Are you sure you want to delete the event "${ev.name}"? All associated registrations will also be deleted.`)) {
            // Delete registrations
            this.db.registrations = this.db.registrations.filter(r => r.eventId !== id);
            // Delete event
            this.db.events = this.db.events.filter(e => e.id !== id);
            this.saveDb();
            
            this.showToast('Event and registrations deleted successfully.', 'success');
            this.render();
        }
    },

    // CRUD Attendee handlers
    editAttendee(id) {
        this.state.editingAttendeeId = id;
        this.navigate('attendee-form');
    },

    deleteAttendee(id) {
        const att = this.db.attendees.find(a => a.id === id);
        if (!att) return;

        if (confirm(`Are you sure you want to delete attendee "${att.name}"? This removes them from all event rosters.`)) {
            // Delete registrations
            this.db.registrations = this.db.registrations.filter(r => r.attendeeId !== id);
            // Delete attendee
            this.db.attendees = this.db.attendees.filter(a => a.id !== id);
            this.saveDb();

            this.showToast('Attendee registry entry removed.', 'success');
            this.render();
        }
    },

    // Binding Event Listeners for Views
    bindAuthEvents() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('auth-email').value.trim();
                const password = document.getElementById('auth-password').value;
                this.handleLogin(email, password);
            });
        }

        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('auth-email').value.trim();
                const password = document.getElementById('auth-password').value;
                const confirmPassword = document.getElementById('auth-confirm-password').value;
                this.handleSignup(email, password, confirmPassword);
            });
        }
    },

    bindDashboardEvents() {
        // Toggle mobile drawer
        const toggleBtn = document.getElementById('mobile-toggle-btn');
        const sidebar = document.getElementById('sidebar');
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

        // Live Clock ticking
        this.updateClock();
        if (this.clockInterval) clearInterval(this.clockInterval);
        this.clockInterval = setInterval(() => this.updateClock(), 1000);
    },

    updateClock() {
        const timeEl = document.getElementById('current-time');
        if (timeEl) {
            const now = new Date();
            timeEl.textContent = now.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            }) + ' | ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
    },

    bindDashboardWidgets() {
        // Modal background close
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeModal();
                }
            });
        }
    },

    bindEventsListHandlers() {
        const searchInput = document.getElementById('event-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.state.eventSearchQuery = e.target.value;
                // De-bounce dynamic filtering or render again
                this.renderActiveViewContent();
            });
        }
    },

    bindEventFormHandlers() {
        const form = document.getElementById('event-input-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form Values
            const name = document.getElementById('ev-name').value.trim();
            const description = document.getElementById('ev-desc').value.trim();
            const date = document.getElementById('ev-date').value;
            const time = document.getElementById('ev-time').value;
            const location = document.getElementById('ev-location').value.trim();
            const capacity = document.getElementById('ev-capacity').value;

            // Form Validation Block
            let isValid = true;

            // Clear previous errors
            document.querySelectorAll('.field-error-msg').forEach(el => el.textContent = '');
            document.querySelectorAll('input, textarea').forEach(el => el.classList.remove('input-error'));

            if (!name) {
                this.setFieldError('ev-name', 'Event name is required.');
                isValid = false;
            }
            if (!description) {
                this.setFieldError('ev-desc', 'Description is required.');
                isValid = false;
            }
            if (!date) {
                this.setFieldError('ev-date', 'Please select a date.');
                isValid = false;
            }
            if (!time) {
                this.setFieldError('ev-time', 'Please select a time.');
                isValid = false;
            }
            if (!location) {
                this.setFieldError('ev-location', 'Venue/Location is required.');
                isValid = false;
            }
            
            const capacityVal = parseInt(capacity, 10);
            if (isNaN(capacityVal) || capacityVal <= 0) {
                this.setFieldError('ev-capacity', 'Capacity must be a positive number.');
                isValid = false;
            }

            if (!isValid) {
                const formError = document.getElementById('event-form-error');
                this.showFormError(formError, 'Validation failed. Please correct the fields marked in red.');
                return;
            }

            // Save details
            if (this.state.editingEventId) {
                // Update
                const index = this.db.events.findIndex(ev => ev.id === this.state.editingEventId);
                if (index !== -1) {
                    this.db.events[index] = {
                        ...this.db.events[index],
                        name, description, date, time, location, capacity: capacityVal
                    };
                    this.showToast('Event updated successfully!', 'success');
                }
            } else {
                // Create
                const newEvent = {
                    id: 'ev-' + Date.now(),
                    name, description, date, time, location, capacity: capacityVal
                };
                this.db.events.push(newEvent);
                this.showToast('Event created successfully!', 'success');
            }

            this.saveDb();
            this.state.editingEventId = null;
            this.navigate('events');
        });
    },

    bindAttendeesListHandlers() {
        const searchInput = document.getElementById('attendee-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.state.attendeeSearchQuery = e.target.value;
                this.renderActiveViewContent();
            });
        }
    },

    bindAttendeeFormHandlers() {
        const form = document.getElementById('attendee-input-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect Form Values
            const name = document.getElementById('att-name').value.trim();
            const email = document.getElementById('att-email').value.trim();
            const phone = document.getElementById('att-phone').value.trim();

            let isValid = true;
            
            // Clear previous errors
            document.querySelectorAll('.field-error-msg').forEach(el => el.textContent = '');
            document.querySelectorAll('input').forEach(el => el.classList.remove('input-error'));

            if (!name) {
                this.setFieldError('att-name', 'Name is required.');
                isValid = false;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                this.setFieldError('att-email', 'Email is required.');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                this.setFieldError('att-email', 'Please enter a valid email address.');
                isValid = false;
            }

            // Simple phone format (allow +,-,spaces,digits, min 7)
            const phoneRegex = /^[+\d\s\-()]{7,20}$/;
            if (!phone) {
                this.setFieldError('att-phone', 'Phone number is required.');
                isValid = false;
            } else if (!phoneRegex.test(phone)) {
                this.setFieldError('att-phone', 'Please enter a valid phone number (at least 7 digits/symbols).');
                isValid = false;
            }

            if (!isValid) {
                const formError = document.getElementById('attendee-form-error');
                this.showFormError(formError, 'Validation failed. Please correct the fields marked in red.');
                return;
            }

            // Save details
            if (this.state.editingAttendeeId) {
                // Update
                const index = this.db.attendees.findIndex(att => att.id === this.state.editingAttendeeId);
                if (index !== -1) {
                    this.db.attendees[index] = {
                        ...this.db.attendees[index],
                        name, email, phone
                    };
                    this.showToast('Attendee profile updated!', 'success');
                }
            } else {
                // Create
                const newAttendee = {
                    id: 'att-' + Date.now(),
                    name, email, phone
                };
                this.db.attendees.push(newAttendee);
                this.showToast('Attendee registered successfully!', 'success');
            }

            this.saveDb();
            this.state.editingAttendeeId = null;
            this.navigate('attendees');
        });
    },

    setFieldError(id, msg) {
        const input = document.getElementById(id);
        if (input) input.classList.add('input-error');
        const errSpan = document.getElementById('err-' + id);
        if (errSpan) errSpan.textContent = msg;
    },

    // Security helpers
    escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};

// ═══════════════════════════════════════════════════════════
// Floating Particle System for Login Screen
// ═══════════════════════════════════════════════════════════
App.initParticles = function() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.5 + 0.1,
            hue: Math.random() > 0.5 ? 230 : 270  // indigo or purple
        });
    }

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity})`;
            ctx.fill();

            // Draw connection lines to nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `hsla(240, 70%, 65%, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        });

        App.particleAnimId = requestAnimationFrame(draw);
    };

    draw();
};

// ═══════════════════════════════════════════════════════════
// Animated Number Counters for Dashboard Stats
// ═══════════════════════════════════════════════════════════
App.animateCounters = function() {
    const counters = document.querySelectorAll('.stat-value');
    counters.forEach(el => {
        const text = el.textContent.trim();
        // Only animate pure numeric values (including %)
        const isPercent = text.endsWith('%');
        const target = parseInt(text, 10);
        if (isNaN(target)) return;

        el.textContent = isPercent ? '0%' : '0';
        const duration = 1200;
        const start = performance.now();

        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            el.textContent = isPercent ? current + '%' : current;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
};

// Start the Application
window.addEventListener('DOMContentLoaded', () => {
    App.initDb();
    App.checkSession();
});
