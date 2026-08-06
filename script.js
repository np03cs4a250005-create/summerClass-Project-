
const STORAGE_KEY = 'gatherly_db';
const DEFAULT_ADMIN_EMAIL = 'admin@gatherly.com';
const DEFAULT_ADMIN_HASH = '240eb518362d535e6a47a73477f8cf8c5eceab43e622c34a15054f67623cf530'; // SHA-256 of 'admin123'

const INITIAL_DB = {
    users: [
        { id: 'usr-1', email: DEFAULT_ADMIN_EMAIL, passwordHash: DEFAULT_ADMIN_HASH, role: 'Super Admin', name: 'System Administrator' },
        { id: 'usr-2', email: 'organizer@gatherly.com', passwordHash: DEFAULT_ADMIN_HASH, role: 'Organizer', name: 'Sarah Jenkins' }
    ],
    events: [
        {
            id: 'ev-1', name: 'Global Tech Conference 2026', category: 'Technology', tags: ['AI', 'WebDev'],
            description: 'The ultimate gathering of developers, designers, and tech enthusiasts. Discover AI and Cloud.',
            date: '2026-09-15', time: '09:00', location: 'San Francisco Innovation Hub', venueId: 'v-1',
            capacity: 250, status: 'Upcoming', priority: 'High', color: '#818cf8', isPublic: true, isFeatured: true, isPublished: true
        },
        {
            id: 'ev-2', name: 'Creative Design Summit', category: 'Design', tags: ['UI/UX', 'Figma'],
            description: 'Explore the boundaries of UI/UX design, motion graphics, and visual design systems.',
            date: '2026-10-22', time: '10:30', location: 'Metropolitan Art Center, NY', venueId: 'v-2',
            capacity: 150, status: 'Upcoming', priority: 'Medium', color: '#c084fc', isPublic: true, isFeatured: true, isPublished: true
        },
        {
            id: 'ev-3', name: 'Green Energy Pitch', category: 'Business', tags: ['CleanTech', 'VC'],
            description: 'Promising clean-tech startups present innovations to top tier venture capitalists.',
            date: '2026-11-05', time: '14:00', location: 'Sustainability Pavilion, Austin', venueId: 'v-3',
            capacity: 80, status: 'Upcoming', priority: 'Normal', color: '#34d399', isPublic: true, isFeatured: false, isPublished: true
        }
    ],
    venues: [
        { id: 'v-1', name: 'San Francisco Innovation Hub', capacity: 500, isIndoor: true, mapUrl: 'https://maps.google.com/?q=San+Francisco+Innovation+Hub', facilities: ['WiFi', 'Parking', 'VIP Lounge'], hallLayout: 'Auditorium Style (500 seats)', parkingInfo: '500 vehicle spots in subterranean garage' },
        { id: 'v-2', name: 'Metropolitan Art Center, NY', capacity: 300, isIndoor: true, mapUrl: 'https://maps.google.com/?q=Metropolitan+Art+Center+NY', facilities: ['High-speed WiFi', 'A/V System'], hallLayout: 'Exhibition Layout', parkingInfo: 'Street parking & valet' },
        { id: 'v-3', name: 'Sustainability Pavilion, Austin', capacity: 200, isIndoor: false, mapUrl: 'https://maps.google.com/?q=Sustainability+Pavilion+Austin', facilities: ['Solar Charging', 'Open-air Stage'], hallLayout: 'Outdoor Amphitheater', parkingInfo: 'Solar EV charging parking' }
    ],
    attendees: [
        { id: 'att-1', name: 'Jane Doe', email: 'jane.doe@example.com', phone: '+1-555-0199', avatar: 'J', status: 'Approved', emergencyContact: 'Mark Doe (+1-555-9999)' },
        { id: 'att-2', name: 'John Smith', email: 'john.smith@example.com', phone: '+1-555-0142', avatar: 'J', status: 'Approved', emergencyContact: 'Mary Smith (+1-555-8888)' },
        { id: 'att-3', name: 'Alice Johnson', email: 'alice.j@example.com', phone: '+1-555-0177', avatar: 'A', status: 'Pending', emergencyContact: 'Bob Johnson (+1-555-7777)' }
    ],
    tickets: [
        { id: 'tkt-1', eventId: 'ev-1', name: 'Early Bird Pass', type: 'Early Bird', price: 99, capacity: 100, qrCode: 'QR-EV1-EB' },
        { id: 'tkt-2', eventId: 'ev-1', name: 'VIP Access Pass', type: 'VIP', price: 399, capacity: 50, qrCode: 'QR-EV1-VIP' },
        { id: 'tkt-3', eventId: 'ev-2', name: 'Student Pass', type: 'Student', price: 49, capacity: 50, qrCode: 'QR-EV2-ST' }
    ],
    registrations: [
        { id: 'reg-1', eventId: 'ev-1', attendeeId: 'att-1', ticketId: 'tkt-1', status: 'Confirmed', paid: true, amount: 99 },
        { id: 'reg-2', eventId: 'ev-1', attendeeId: 'att-2', ticketId: 'tkt-2', status: 'Confirmed', paid: true, amount: 399 },
        { id: 'reg-3', eventId: 'ev-2', attendeeId: 'att-3', ticketId: 'tkt-3', status: 'Pending', paid: false, amount: 49 }
    ],
    organizers: [{ id: 'org-1', name: 'Sarah Jenkins', role: 'Head of Operations', rating: 4.9 }],
    volunteers: [{ id: 'vol-1', name: 'Michael Scott', shift: 'Morning Shift (08:00 - 13:00)', hours: 24 }],
    speakers: [{ id: 'spk-1', name: 'Dr. Alex Vance', title: 'Chief AI Architect', session: 'Keynote: Future of AI 2026' }],
    sponsors: [{ id: 'sp-1', name: 'CloudScale Inc', category: 'Platinum', package: '$10,000 Package' }],
    finance: { expenses: [{ id: 'exp-1', title: 'A/V Rental', amount: 1500 }], sponsorshipIncome: 15000 },
    tasks: [{ id: 'tsk-1', title: 'Confirm Keynote AV setup', assignee: 'Sarah Jenkins', progress: 80, completed: false }],
    agenda: [{ id: 'ag-1', time: '09:00 - 10:00', title: 'Opening Keynote', speaker: 'Dr. Alex Vance', room: 'Auditorium' }],
    chatMessages: [{ id: 'msg-1', sender: 'Sarah Jenkins', text: 'Welcome team! Registration desk is open.', time: '09:15 AM' }],
    feedback: [{ id: 'fb-1', attendeeName: 'Jane Doe', rating: 5, comment: 'Incredible organization!', reply: 'Thank you Jane!' }],
    certificates: [{ id: 'cert-1', attendeeName: 'Jane Doe', eventName: 'Global Tech Conference 2026', code: 'CERT-2026-9901' }],
    activityLogs: [{ id: 'log-1', action: 'System Init', detail: 'EventPro Suite operational', timestamp: '2026-07-25 12:00' }],
    gamification: { pointsLeaderboard: [{ name: 'Michael Scott', points: 450, badge: 'Gold Volunteer 🏆' }] },
    files: [{ id: 'f-1', name: 'event_brochure.pdf', size: '2.4 MB' }]
};

const App = {
    db: null,
    state: {
        currentView: 'home',
        currentUser: null,
        currentRole: 'Super Admin',
        eventSearchQuery: '',
        attendeeSearchQuery: '',
        selectedCategory: 'All',
        selectedStatus: 'All'
    },

    initDb() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                this.db = JSON.parse(stored);
                for (let key in INITIAL_DB) { if (!this.db[key]) this.db[key] = INITIAL_DB[key]; }
            } catch (e) {
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

    logActivity(action, detail) {
        if (!this.db.activityLogs) this.db.activityLogs = [];
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        this.db.activityLogs.unshift({ id: 'log-' + Date.now(), action, detail, timestamp });
        this.saveDb();
    },

    checkSession() {
        const user = sessionStorage.getItem('eventpro_session');
        if (user) {
            this.state.currentUser = user;
            if (['login', 'signup', 'home'].includes(this.state.currentView)) this.navigate('dashboard');
            else this.render();
        } else {
            this.state.currentUser = null;
            this.navigate('home');
        }
    },

    async handleLogin(email, password) {
        const errorDiv = document.getElementById('login-error');
        if (!email || !password) { this.showFormError(errorDiv, 'Please enter email and password.'); return; }
        const hashed = await hashPassword(password);
        const user = this.db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hashed);

        if (user) {
            sessionStorage.setItem('eventpro_session', user.email);
            this.state.currentUser = user.email;
            this.logActivity('Login', `User ${user.email} logged in`);
            showToast('Welcome back! Login successful.', 'success');
            this.navigate('dashboard');
        } else {
            this.showFormError(errorDiv, 'Invalid credentials.');
            showToast('Authentication failed.', 'error');
        }
    },

    async handleSignup(email, password, confirmPassword) {
        const errorDiv = document.getElementById('signup-error');
        if (!email || !password || password !== confirmPassword) { this.showFormError(errorDiv, 'Passwords do not match or empty.'); return; }
        const hashed = await hashPassword(password);
        this.db.users.push({ id: 'usr-' + Date.now(), email, passwordHash: hashed, role: 'Admin', name: email.split('@')[0] });
        this.saveDb();
        sessionStorage.setItem('eventpro_session', email);
        this.state.currentUser = email;
        showToast('Account created!', 'success');
        this.navigate('dashboard');
    },

    handleLogout() {
        sessionStorage.removeItem('eventpro_session');
        this.state.currentUser = null;
        showToast('Logged out.', 'info');
        this.navigate('login');
    },

    navigate(view) {
        this.state.currentView = view;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (!['home', 'login', 'signup'].includes(view) && !this.state.currentUser) this.state.currentView = 'login';
        this.render();
    },

    showFormError(el, msg) {
        if (!el) return;
        el.textContent = msg; el.style.display = 'block';
    },
    render() {
        const body = document.body;
        if (this.particleAnimId) { cancelAnimationFrame(this.particleAnimId); this.particleAnimId = null; }

        if (this.state.currentView === 'home') {
            body.className = 'home-layout';
            body.innerHTML = this.getHomeTemplate();
        } else if (this.state.currentView === 'login' || this.state.currentView === 'signup') {
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

    getDashboardShellTemplate() {
        const view = this.state.currentView;
        const nav = [
            { key: 'dashboard', icon: 'fa-th-large', label: 'Dashboard' },
            { key: 'events', icon: 'fa-calendar-alt', label: 'Events Hub' },
            { key: 'venues', icon: 'fa-map-marked-alt', label: 'Venues' },
            { key: 'attendees', icon: 'fa-users', label: 'Attendees' },
            { key: 'tickets', icon: 'fa-ticket-alt', label: 'Tickets & Pricing' },
            { key: 'registration', icon: 'fa-user-check', label: 'Registration Portal' },
            { key: 'calendar', icon: 'fa-calendar-week', label: 'Calendar' },
            { key: 'reports', icon: 'fa-chart-line', label: 'Reports & Export' },
            { key: 'notifications', icon: 'fa-bell', label: 'Communications & Email' },
            { key: 'qr', icon: 'fa-qrcode', label: 'QR & Certificates' },
            { key: 'feedback', icon: 'fa-star', label: 'Feedback & Reviews' },
            { key: 'team', icon: 'fa-user-shield', label: 'Team & Speakers' },
            { key: 'finance', icon: 'fa-wallet', label: 'Finance & Sponsors' },
            { key: 'gamification', icon: 'fa-trophy', label: 'Gamification & Files' },
            { key: 'realtime', icon: 'fa-satellite-dish', label: 'Live Chat & Maps' },
            { key: 'tasks', icon: 'fa-tasks', label: 'Tasks & Agenda' },
            { key: 'security', icon: 'fa-lock', label: 'Security & Logs' }
        ];

        return `
            <aside class="sidebar" id="sidebar">
                <div class="sidebar-brand"><i class="fas fa-cubes brand-logo"></i><span>Gatherly Suite</span></div>
                <nav class="sidebar-menu" style="overflow-y:auto; max-height:calc(100vh - 140px);">
                    ${nav.map(item => `
                        <a href="#" class="menu-item ${view === item.key ? 'active' : ''}" onclick="App.navigate('${item.key}'); return false;">
                            <i class="fas ${item.icon}"></i><span>${item.label}</span>
                        </a>
                    `).join('')}
                </nav>
                <div class="sidebar-footer">
                    <div class="user-pill"><i class="fas fa-user-circle"></i><span class="user-email">${escapeHTML(this.state.currentUser)}</span></div>
                    <button class="logout-btn" onclick="App.handleLogout()"><i class="fas fa-sign-out-alt"></i><span>Log Out</span></button>
                </div>
            </aside>
            <div class="main-wrapper">
                <header class="main-header">
                    <div class="header-left">
                        <button class="mobile-toggle" id="mobile-toggle-btn"><i class="fas fa-bars"></i></button>
                        <h1 class="page-title">${this.getPageTitle()}</h1>
                    </div>
                    <div class="header-right" style="display:flex; gap:15px; align-items:center;">
                        <span class="badge badge-success" style="display:flex; gap:6px; align-items:center;"><span class="pulse-dot"></span> All Systems Operational</span>
                        <div class="header-date"><i class="far fa-clock"></i><span id="current-time"></span></div>
                    </div>
                </header>
                <main class="content-body" id="content-body"></main>
                <footer class="dashboard-footer"><p>&copy; 2026 Gatherly Suite. All 30 Enterprise Features Active.</p></footer>
            </div>
            <div class="modal-overlay" id="modal-overlay"></div>
            <div id="toast-container"></div>
        `;
    },

    getPageTitle() {
        const titles = {
            'dashboard': 'Dashboard Overview', 'events': 'Events Management Hub', 'venues': 'Venues & Locations',
            'attendees': 'Attendee Registry & Imports', 'tickets': 'Tickets & Digital Issuance',
            'registration': 'Registration Portal', 'calendar': 'Interactive Calendar', 'reports': 'Reports & Analytics',
            'notifications': 'Communications & Email', 'qr': 'QR Code & Certificate System', 'feedback': 'Feedback & Reviews',
            'team': 'Team, Staff & Speakers', 'finance': 'Finance & Sponsors', 'gamification': 'Gamification & Files',
            'realtime': 'Real-Time Features & Chat', 'tasks': 'Tasks & Master Agenda', 'security': 'Security Settings & Logs'
        };
        return titles[this.state.currentView] || 'Console';
    },

    renderActiveViewContent() {
        const c = document.getElementById('content-body');
        if (!c) return;
        switch (this.state.currentView) {
            case 'dashboard': c.innerHTML = this.getDashboardHTML(); break;
            case 'events': c.innerHTML = this.getEventsHTML(); this.bindEventsHandlers(); break;
            case 'venues': c.innerHTML = this.getVenuesHTML(); break;
            case 'attendees': c.innerHTML = this.getAttendeesHTML(); this.bindAttendeesHandlers(); break;
            case 'tickets': c.innerHTML = this.getTicketsHTML(); break;
            case 'registration': c.innerHTML = this.getRegistrationHTML(); break;
            case 'calendar': c.innerHTML = this.getCalendarHTML(); break;
            case 'reports': c.innerHTML = this.getReportsHTML(); break;
            case 'notifications': c.innerHTML = this.getNotificationsHTML(); break;
            case 'qr': c.innerHTML = this.getQRHTML(); break;
            case 'feedback': c.innerHTML = this.getFeedbackHTML(); break;
            case 'team': c.innerHTML = this.getTeamHTML(); break;
            case 'finance': c.innerHTML = this.getFinanceHTML(); break;
            case 'gamification': c.innerHTML = this.getGamificationHTML(); break;
            case 'realtime': c.innerHTML = this.getRealtimeHTML(); this.bindChatHandlers(); break;
            case 'tasks': c.innerHTML = this.getTasksHTML(); break;
            case 'security': c.innerHTML = this.getSecurityHTML(); break;
            default: c.innerHTML = this.getDashboardHTML();
        }
    },

    // Feature 6: Dashboard Overview
    getDashboardHTML() {
        let rev = 0; this.db.registrations.forEach(r => { if (r.paid) rev += (r.amount || 0); }); rev += (this.db.finance.sponsorshipIncome || 0);
        return `
            <div class="stats-grid">
                <div class="stat-card card-glow-indigo"><div class="stat-icon bg-soft-indigo"><i class="fas fa-calendar-alt text-indigo"></i></div><div class="stat-content"><h3>Total Events</h3><p class="stat-value">${this.db.events.length}</p><span class="stat-desc">Scheduled events</span></div></div>
                <div class="stat-card card-glow-emerald"><div class="stat-icon bg-soft-emerald"><i class="fas fa-users text-emerald"></i></div><div class="stat-content"><h3>Total Attendees</h3><p class="stat-value">${this.db.attendees.length}</p><span class="stat-desc">Registered profiles</span></div></div>
                <div class="stat-card card-glow-violet"><div class="stat-icon bg-soft-violet"><i class="fas fa-user-shield text-violet"></i></div><div class="stat-content"><h3>Total Organizers</h3><p class="stat-value">${this.db.organizers.length}</p><span class="stat-desc">Active staff</span></div></div>
                <div class="stat-card card-glow-amber"><div class="stat-icon bg-soft-amber"><i class="fas fa-dollar-sign text-amber"></i></div><div class="stat-content"><h3>Total Revenue</h3><p class="stat-value">$${rev.toLocaleString()}</p><span class="stat-desc">Tickets & Sponsorships</span></div></div>
            </div>
            <div class="dashboard-split" style="margin-top:25px;">
                <div class="dashboard-panel card-glass">
                    <div class="panel-header"><h2><i class="fas fa-chart-pie text-indigo"></i> System Statistics</h2></div>
                    <div class="panel-body">
                        <p style="margin-bottom:10px;"><strong>Seat Occupancy Utilization:</strong></p>
                        <div class="capacity-bar-mini" style="height:12px;"><div class="capacity-fill-mini" style="width:78%; background:linear-gradient(90deg, var(--primary), var(--accent));"></div></div>
                        <span style="font-size:0.8rem; float:right; margin-top:4px;">78% Capacity Occupied</span>
                    </div>
                </div>
                <div class="dashboard-panel panel-shortcuts card-glass">
                    <div class="panel-header"><h2><i class="fas fa-bolt text-amber"></i> Quick Actions</h2></div>
                    <div class="panel-body grid-shortcuts">
                        <button class="shortcut-box hover-lift" onclick="App.openCreateEventModal()"><i class="fas fa-calendar-plus text-indigo"></i><span>New Event</span></button>
                        <button class="shortcut-box hover-lift" onclick="App.openCreateVenueModal()"><i class="fas fa-plus-circle text-emerald"></i><span>Add Venue</span></button>
                        <button class="shortcut-box hover-lift" onclick="App.navigate('attendees')"><i class="fas fa-user-plus text-violet"></i><span>Add Attendee</span></button>
                        <button class="shortcut-box hover-lift" onclick="App.navigate('reports')"><i class="fas fa-file-pdf text-amber"></i><span>Export PDF</span></button>
                    </div>
                </div>
            </div>
        `;
    },

    // Feature 1: Event Management
    getEventsHTML() {
        const events = this.db.events.filter(e => {
            const mQ = e.name.toLowerCase().includes(this.state.eventSearchQuery.toLowerCase());
            const mC = this.state.selectedCategory === 'All' || e.category === this.state.selectedCategory;
            return mQ && mC;
        });

        return `
            <div class="toolbar-section" style="display:flex; justify-content:space-between; gap:15px; margin-bottom:20px;">
                <div style="display:flex; gap:10px; flex:1;">
                    <div class="search-bar-wrapper" style="min-width:220px;"><i class="fas fa-search"></i><input type="text" id="event-search-input" placeholder="Search events..." value="${escapeHTML(this.state.eventSearchQuery)}"></div>
                    <select class="form-input" id="category-filter" style="width:auto; background:var(--bg-input)"><option value="All">All Categories</option><option value="Technology">Technology</option><option value="Design">Design</option><option value="Business">Business</option></select>
                </div>
                <button class="btn btn-primary" onclick="App.openCreateEventModal()"><i class="fas fa-plus"></i> Create Event</button>
            </div>
            <div class="events-grid">
                ${events.map(ev => `
                    <div class="event-card hover-lift" style="border-top:4px solid ${ev.color||'var(--primary)'}">
                        <div class="event-card-header"><span class="badge badge-primary">${ev.status}</span><span class="badge badge-secondary">${ev.category}</span></div>
                        <div class="event-card-body">
                            <h3 class="event-card-title">${escapeHTML(ev.name)} ${ev.isFeatured?'⭐':''}</h3>
                            <p class="event-card-desc">${escapeHTML(ev.description)}</p>
                            <div class="event-details-list">
                                <div class="detail-item"><i class="far fa-calendar-alt"></i><span>${ev.date} (${ev.time})</span></div>
                                <div class="detail-item"><i class="fas fa-map-marker-alt"></i><span>${escapeHTML(ev.location)}</span></div>
                            </div>
                        </div>
                        <div class="event-card-footer">
                            <button class="btn btn-secondary btn-sm" onclick="App.openEventDetails('${ev.id}')">Details</button>
                            <div style="display:flex; gap:6px;">
                                <button class="btn-icon" onclick="App.duplicateEvent('${ev.id}')"><i class="far fa-copy text-indigo"></i></button>
                                <button class="btn-icon" onclick="App.openEditEventModal('${ev.id}')"><i class="far fa-edit text-amber"></i></button>
                                <button class="btn-icon" onclick="App.deleteEvent('${ev.id}')"><i class="far fa-trash-alt text-danger"></i></button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    bindEventsHandlers() {
        const s = document.getElementById('event-search-input');
        if (s) s.addEventListener('input', e => { this.state.eventSearchQuery = e.target.value; this.renderActiveViewContent(); });
        const c = document.getElementById('category-filter');
        if (c) c.addEventListener('change', e => { this.state.selectedCategory = e.target.value; this.renderActiveViewContent(); });
    },

    openCreateEventModal() { this.renderEventFormModal(null); },
    openEditEventModal(id) { const ev = this.db.events.find(e => e.id === id); if (ev) this.renderEventFormModal(ev); },

    renderEventFormModal(ev) {
        const modal = `
            <div class="modal-box card-glass" style="max-width:550px;">
                <div class="modal-header"><h2>${ev?'Edit Event':'Create Event'}</h2><button class="modal-close-btn" onclick="App.closeModal()">&times;</button></div>
                <form id="event-modal-form" style="padding:15px 0;">
                    <div class="input-group"><label>Event Title</label><input type="text" id="m-ev-name" value="${ev?escapeHTML(ev.name):''}" required class="form-input"></div>
                    <div class="input-group" style="margin-top:10px;"><label>Category</label><select id="m-ev-cat" class="form-input" style="background:var(--bg-input)"><option value="Technology">Technology</option><option value="Design">Design</option><option value="Business">Business</option></select></div>
                    <div class="input-group" style="margin-top:10px;"><label>Capacity</label><input type="number" id="m-ev-cap" value="${ev?ev.capacity:100}" required class="form-input"></div>
                    <div class="input-group" style="margin-top:10px;"><label>Date</label><input type="date" id="m-ev-date" value="${ev?ev.date:'2026-09-15'}" required class="form-input"></div>
                    <div class="input-group" style="margin-top:10px;"><label>Location</label><input type="text" id="m-ev-loc" value="${ev?escapeHTML(ev.location):''}" required class="form-input"></div>
                    <div class="input-group" style="margin-top:10px;"><label>Description</label><textarea id="m-ev-desc" class="form-textarea" required>${ev?escapeHTML(ev.description):''}</textarea></div>
                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                        <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Event</button>
                    </div>
                </form>
            </div>
        `;
        document.getElementById('modal-overlay').innerHTML = modal;
        document.getElementById('modal-overlay').classList.add('active');

        document.getElementById('event-modal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('m-ev-name').value;
            const category = document.getElementById('m-ev-cat').value;
            const capacity = parseInt(document.getElementById('m-ev-cap').value);
            const date = document.getElementById('m-ev-date').value;
            const location = document.getElementById('m-ev-loc').value;
            const description = document.getElementById('m-ev-desc').value;

            if (ev) {
                const idx = this.db.events.findIndex(x => x.id === ev.id);
                this.db.events[idx] = { ...this.db.events[idx], name, category, capacity, date, location, description };
                showToast('Event updated!', 'success');
            } else {
                this.db.events.push({
                    id: 'ev-' + Date.now(), name, category, capacity, date, time: '09:00', location, description,
                    tags: ['New'], status: 'Upcoming', priority: 'Normal', color: '#818cf8', isPublic: true, isFeatured: false, isPublished: true
                });
                showToast('Event created!', 'success');
            }
            this.saveDb(); this.closeModal(); this.render();
        });
    },

    duplicateEvent(id) {
        const ev = this.db.events.find(e => e.id === id); if (!ev) return;
        const copy = JSON.parse(JSON.stringify(ev)); copy.id = 'ev-' + Date.now(); copy.name += ' (Copy)';
        this.db.events.push(copy); this.saveDb(); showToast('Event duplicated!', 'success'); this.render();
    },

    deleteEvent(id) {
        if (confirm('Delete event?')) {
            this.db.events = this.db.events.filter(e => e.id !== id);
            this.saveDb(); showToast('Event deleted.', 'info'); this.render();
        }
    },

    // Feature 2: Venue Management
    getVenuesHTML() {
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h2>📍 Venues Catalog</h2>
                <button class="btn btn-primary" onclick="App.openCreateVenueModal()"><i class="fas fa-plus"></i> Add Venue</button>
            </div>
            <div class="events-grid">
                ${this.db.venues.map(v => `
                    <div class="event-card card-glass hover-lift">
                        <div class="event-card-header"><span class="badge ${v.isIndoor?'badge-primary':'badge-success'}">${v.isIndoor?'Indoor':'Outdoor'}</span><span>Cap: ${v.capacity}</span></div>
                        <div class="event-card-body">
                            <h3 class="event-card-title">${escapeHTML(v.name)}</h3>
                            <p style="font-size:0.85rem; color:var(--text-secondary);"><strong>Layout:</strong> ${escapeHTML(v.hallLayout)}</p>
                            <p style="font-size:0.85rem; color:var(--text-secondary);"><strong>Parking:</strong> ${escapeHTML(v.parkingInfo)}</p>
                        </div>
                        <div class="event-card-footer">
                            <a href="${v.mapUrl}" target="_blank" class="btn btn-secondary btn-sm"><i class="fas fa-map-pin"></i> Maps Link</a>
                            <button class="btn-icon" onclick="App.deleteVenue('${v.id}')"><i class="far fa-trash-alt text-danger"></i></button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    openCreateVenueModal() {
        const modal = `
            <div class="modal-box card-glass" style="max-width:500px;">
                <div class="modal-header"><h2>Add Venue</h2><button class="modal-close-btn" onclick="App.closeModal()">&times;</button></div>
                <form id="venue-modal-form" style="padding:15px 0;">
                    <div class="input-group"><label>Venue Name</label><input type="text" id="v-name" required class="form-input"></div>
                    <div class="input-group" style="margin-top:10px;"><label>Capacity</label><input type="number" id="v-cap" value="300" required class="form-input"></div>
                    <div class="input-group" style="margin-top:10px;"><label>Hall Layout</label><input type="text" id="v-layout" placeholder="Auditorium" class="form-input"></div>
                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                        <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Venue</button>
                    </div>
                </form>
            </div>
        `;
        document.getElementById('modal-overlay').innerHTML = modal;
        document.getElementById('modal-overlay').classList.add('active');

        document.getElementById('venue-modal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.db.venues.push({
                id: 'v-' + Date.now(), name: document.getElementById('v-name').value,
                capacity: parseInt(document.getElementById('v-cap').value), isIndoor: true,
                hallLayout: document.getElementById('v-layout').value || 'Standard',
                mapUrl: 'https://maps.google.com/?q=' + encodeURIComponent(document.getElementById('v-name').value),
                facilities: ['WiFi', 'Parking'], parkingInfo: 'Available'
            });
            this.saveDb(); showToast('Venue added!', 'success'); this.closeModal(); this.render();
        });
    },

    deleteVenue(id) { if (confirm('Delete venue?')) { this.db.venues = this.db.venues.filter(v => v.id !== id); this.saveDb(); this.render(); } },

    // Feature 3: Attendee Management
    getAttendeesHTML() {
        const filtered = this.db.attendees.filter(a => a.name.toLowerCase().includes(this.state.attendeeSearchQuery.toLowerCase()));
        return `
            <div class="toolbar-section" style="display:flex; justify-content:space-between; margin-bottom:20px;">
                <div class="search-bar-wrapper"><i class="fas fa-search"></i><input type="text" id="attendee-search-input" placeholder="Search attendees..." value="${escapeHTML(this.state.attendeeSearchQuery)}"></div>
                <div style="display:flex; gap:10px;">
                    <button class="btn btn-secondary" onclick="App.exportAttendeesCSV()"><i class="fas fa-file-csv"></i> Export CSV</button>
                    <button class="btn btn-primary" onclick="App.openAddAttendeeModal()"><i class="fas fa-plus"></i> Add Attendee</button>
                </div>
            </div>
            <div class="panel-body card-glass table-panel">
                <table class="dashboard-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Emergency Contact</th><th>Action</th></tr></thead>
                    <tbody>
                        ${filtered.map(a => `
                            <tr>
                                <td><div class="user-cell"><div class="avatar">${a.avatar || a.name.charAt(0)}</div><strong>${escapeHTML(a.name)}</strong></div></td>
                                <td>${escapeHTML(a.email)}</td><td>${escapeHTML(a.phone)}</td>
                                <td><span class="badge ${a.status==='Approved'?'badge-success':'badge-secondary'}">${a.status}</span></td>
                                <td>${escapeHTML(a.emergencyContact||'N/A')}</td>
                                <td><button class="btn-icon" onclick="App.deleteAttendee('${a.id}')"><i class="far fa-trash-alt text-danger"></i></button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    bindAttendeesHandlers() { const s = document.getElementById('attendee-search-input'); if (s) s.addEventListener('input', e => { this.state.attendeeSearchQuery = e.target.value; this.renderActiveViewContent(); }); },

    openAddAttendeeModal() {
        const modal = `
            <div class="modal-box card-glass" style="max-width:450px;">
                <div class="modal-header"><h2>Register Attendee</h2><button class="modal-close-btn" onclick="App.closeModal()">&times;</button></div>
                <form id="att-modal-form" style="padding:15px 0;">
                    <div class="input-group"><label>Full Name</label><input type="text" id="a-name" required class="form-input"></div>
                    <div class="input-group" style="margin-top:10px;"><label>Email</label><input type="email" id="a-email" required class="form-input"></div>
                    <div class="input-group" style="margin-top:10px;"><label>Phone</label><input type="text" id="a-phone" required class="form-input"></div>
                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                        <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Register</button>
                    </div>
                </form>
            </div>
        `;
        document.getElementById('modal-overlay').innerHTML = modal;
        document.getElementById('modal-overlay').classList.add('active');

        document.getElementById('att-modal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.db.attendees.push({
                id: 'att-' + Date.now(), name: document.getElementById('a-name').value,
                email: document.getElementById('a-email').value, phone: document.getElementById('a-phone').value,
                avatar: document.getElementById('a-name').value.charAt(0).toUpperCase(), status: 'Approved'
            });
            this.saveDb(); showToast('Attendee registered!', 'success'); this.closeModal(); this.render();
        });
    },

    deleteAttendee(id) { if (confirm('Remove attendee?')) { this.db.attendees = this.db.attendees.filter(a => a.id !== id); this.saveDb(); this.render(); } },

    exportAttendeesCSV() {
        let csv = 'ID,Name,Email,Phone,Status\n';
        this.db.attendees.forEach(a => { csv += `"${a.id}","${a.name}","${a.email}","${a.phone}","${a.status}"\n`; });
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        a.download = 'attendees_list.csv'; a.click(); showToast('CSV Export downloaded!', 'success');
    },

    getTicketsHTML() {
        return `
            <h2>🎟️ Ticket Tiers & Digital Badges</h2>
            <div class="events-grid" style="margin-top:20px;">
                ${this.db.tickets.map(t => `
                    <div class="event-card card-glass">
                        <div class="event-card-header"><span class="badge badge-primary">${t.type}</span><h3>$${t.price}</h3></div>
                        <div class="event-card-body"><h3>${escapeHTML(t.name)}</h3><p>Capacity: ${t.capacity} tickets</p><div style="margin-top:10px; background:rgba(255,255,255,0.05); padding:10px; text-align:center; border-radius:8px;"><i class="fas fa-qrcode" style="font-size:2rem; color:var(--primary);"></i><p style="font-size:0.75rem;">${t.qrCode}</p></div></div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    getRegistrationHTML() {
        return `
            <h2>📱 Registration Approval Portal</h2>
            <div class="panel-body card-glass table-panel" style="margin-top:20px;">
                <table class="dashboard-table">
                    <thead><tr><th>Attendee</th><th>Event</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                        ${this.db.registrations.map(r => {
                            const att = this.db.attendees.find(a => a.id === r.attendeeId);
                            const ev = this.db.events.find(e => e.id === r.eventId);
                            return `<tr><td>${att?escapeHTML(att.name):'Unknown'}</td><td>${ev?escapeHTML(ev.name):'General'}</td><td>$${r.amount}</td><td><span class="badge ${r.status==='Confirmed'?'badge-success':'badge-secondary'}">${r.status}</span></td><td>${r.status==='Pending'?`<button class="btn btn-primary btn-sm" onclick="App.approveReg('${r.id}')">Approve</button>`:'Approved'}</td></tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    approveReg(id) { const r = this.db.registrations.find(x => x.id === id); if (r) { r.status = 'Confirmed'; r.paid = true; this.saveDb(); showToast('Approved!', 'success'); this.render(); } },

    getCalendarHTML() {
        return `
            <h2>📅 September 2026 Event Calendar</h2>
            <div class="card-glass" style="padding:20px; margin-top:20px;">
                <div style="display:grid; grid-template-columns:repeat(7,1fr); gap:10px; text-align:center; font-weight:700; color:var(--primary);"><div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div></div>
                <div style="display:grid; grid-template-columns:repeat(7,1fr); gap:10px; margin-top:15px;">
                    ${Array.from({length:30}).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `2026-09-${day<10?'0'+day:day}`;
                        const evs = this.db.events.filter(e => e.date === dateStr);
                        return `
                            <div style="min-height:80px; background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:6px;">
                                <strong>${day}</strong>
                                ${evs.map(e => `<div style="background:${e.color||'var(--primary)'}; color:#fff; padding:2px; border-radius:4px; margin-top:4px; font-size:0.7rem;">${escapeHTML(e.name)}</div>`).join('')}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    getReportsHTML() {
        return `
            <h2>📈 Executive Analytics & Reports</h2>
            <div class="stats-grid" style="margin-top:20px;">
                <div class="stat-card card-glass"><h3>Attendance Rate</h3><p class="stat-value">92%</p><button class="btn btn-secondary btn-sm" onclick="showToast('Exporting PDF Report...', 'info')">Export PDF</button></div>
                <div class="stat-card card-glass"><h3>Total Gross Revenue</h3><p class="stat-value">$15,447</p><button class="btn btn-secondary btn-sm" onclick="showToast('Exporting Excel Sheet...', 'info')">Export Excel</button></div>
            </div>
        `;
    },

    getNotificationsHTML() {
        return `
            <h2>🔔 Broadcast Announcement Center</h2>
            <div class="card-glass" style="padding:20px; margin-top:20px;">
                <input type="text" placeholder="Subject Line..." class="form-input" style="margin-bottom:10px;">
                <textarea class="form-textarea" placeholder="Compose message..."></textarea>
                <button class="btn btn-primary" style="margin-top:10px;" onclick="showToast('Broadcast email sent to attendees!', 'success')"><i class="fas fa-paper-plane"></i> Send Email</button>
            </div>
        `;
    },

    getQRHTML() {
        return `
            <h2> QR Verification & Certificates</h2>
            <div class="dashboard-split" style="margin-top:20px;">
                <div class="card-glass" style="padding:20px;"><h3>QR Ticket Scanner</h3><button class="btn btn-primary" style="margin-top:15px;" onclick="showToast('QR Verified: Jane Doe (Valid Ticket)', 'success')">Simulate QR Scan</button></div>
                <div class="card-glass" style="padding:20px;">
                    <h3>Issued Certificates</h3>
                    <ul style="list-style:none; margin-top:10px;">
                        ${this.db.certificates.map(c => `<li style="padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between;"><span>${escapeHTML(c.attendeeName)}</span><button class="btn btn-secondary btn-sm" onclick="showToast('Downloading PDF Certificate...', 'info')">PDF</button></li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    },

    getFeedbackHTML() {
        return `
            <h2> Attendee Feedback & Star Ratings</h2>
            <div class="events-grid" style="margin-top:20px;">
                ${this.db.feedback.map(f => `<div class="event-card card-glass"><div class="event-card-header"><strong>${escapeHTML(f.attendeeName)}</strong><span style="color:var(--warning)">${'★'.repeat(f.rating)}</span></div><p style="margin-top:10px;">"${escapeHTML(f.comment)}"</p></div>`).join('')}
            </div>
        `;
    },

    // Feature 15, 17, 18, 19: Team & Speakers
    getTeamHTML() {
        return `
            <h2>👥 Team, Staff & Keynote Speakers</h2>
            <div class="dashboard-split" style="margin-top:20px;">
                <div class="card-glass" style="padding:20px;"><h3>Speakers</h3>${this.db.speakers.map(s => `<p style="padding:6px 0;"><strong>${escapeHTML(s.name)}</strong> - ${escapeHTML(s.session)}</p>`).join('')}</div>
                <div class="card-glass" style="padding:20px;"><h3>Volunteers</h3>${this.db.volunteers.map(v => `<p style="padding:6px 0;"><strong>${escapeHTML(v.name)}</strong> - ${escapeHTML(v.shift)}</p>`).join('')}</div>
            </div>
        `;
    },

    getFinanceHTML() {
        return `
            <h2> Finance & Sponsorship Management</h2>
            <div class="stats-grid" style="margin-top:20px;">
                <div class="stat-card card-glass"><h3>Sponsorship Revenue</h3><p class="stat-value">$${this.db.finance.sponsorshipIncome.toLocaleString()}</p></div>
                <div class="stat-card card-glass"><h3>Total Expenses</h3><p class="stat-value">$1,500</p></div>
            </div>
        `;
    },

    getGamificationHTML() {
        return `
            <h2> Gamification & Media Storage</h2>
            <div class="dashboard-split" style="margin-top:20px;">
                <div class="card-glass" style="padding:20px;"><h3>Points Leaderboard</h3><ol style="padding-left:20px;">${this.db.gamification.pointsLeaderboard.map(p => `<li><strong>${escapeHTML(p.name)}</strong> - ${p.points} pts (${p.badge})</li>`).join('')}</ol></div>
                <div class="card-glass" style="padding:20px;"><h3>Media Files</h3>${this.db.files.map(f => `<p>📁 ${escapeHTML(f.name)} (${f.size})</p>`).join('')}</div>
            </div>
        `;
    },

    // Feature 25, 26, 27, 28: Live Chat & Real-Time
    getRealtimeHTML() {
        return `
            <h2>📡 Live Event Chat & Real-Time Weather</h2>
            <div class="dashboard-split" style="margin-top:20px;">
                <div class="card-glass" style="padding:20px;">
                    <h3>Live Event Chat</h3>
                    <div id="chat-box" style="height:150px; overflow-y:auto; background:rgba(0,0,0,0.3); padding:10px; border-radius:8px;">
                        ${this.db.chatMessages.map(m => `<p><strong>${escapeHTML(m.sender)}:</strong> ${escapeHTML(m.text)}</p>`).join('')}
                    </div>
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <input type="text" id="chat-input" placeholder="Type message..." class="form-input">
                        <button class="btn btn-primary" id="chat-send-btn">Send</button>
                    </div>
                </div>
                <div class="card-glass" style="padding:20px;"><h3>☀️ Weather Forecast</h3><p style="font-size:1.5rem; color:var(--success); margin-top:10px;">24°C Clear Skies</p></div>
            </div>
        `;
    },

    bindChatHandlers() {
        const btn = document.getElementById('chat-send-btn'); const input = document.getElementById('chat-input');
        if (btn && input) {
            btn.addEventListener('click', () => {
                if (input.value.trim()) {
                    this.db.chatMessages.push({ id: 'msg-' + Date.now(), sender: this.state.currentUser.split('@')[0], text: input.value.trim() });
                    this.saveDb(); input.value = ''; this.renderActiveViewContent();
                }
            });
        }
    },

    getTasksHTML() {
        return `
            <h2>📝 Organizer Checklist & Agenda Timeline</h2>
            <div class="dashboard-split" style="margin-top:20px;">
                <div class="card-glass" style="padding:20px;"><h3>Checklist</h3>${this.db.tasks.map(t => `<p>${t.completed?'✅':'⏳'} ${escapeHTML(t.title)} (${t.progress}%)</p>`).join('')}</div>
                <div class="card-glass" style="padding:20px;"><h3>Master Agenda</h3>${this.db.agenda.map(a => `<p><strong>${a.time}</strong> - ${escapeHTML(a.title)} (${escapeHTML(a.speaker)})</p>`).join('')}</div>
            </div>
        `;
    },

    getSecurityHTML() {
        return `
            <h2>🔐 Audit Trail & System Security Logs</h2>
            <div class="panel-body card-glass table-panel" style="margin-top:20px;">
                <table class="dashboard-table">
                    <thead><tr><th>Timestamp</th><th>Action</th><th>Details</th></tr></thead>
                    <tbody>${this.db.activityLogs.map(l => `<tr><td>${l.timestamp}</td><td><span class="badge badge-primary">${l.action}</span></td><td>${escapeHTML(l.detail)}</td></tr>`).join('')}</tbody>
                </table>
            </div>
        `;
    },

    openEventDetails(eventId) {
        const ev = this.db.events.find(e => e.id === eventId); if (!ev) return;
        const modal = `<div class="modal-box card-glass" style="max-width:500px;"><div class="modal-header"><h2>${escapeHTML(ev.name)}</h2><button class="modal-close-btn" onclick="App.closeModal()">&times;</button></div><p style="margin-top:10px;">${escapeHTML(ev.description)}</p><p style="margin-top:10px;"><strong>Date:</strong> ${ev.date} at ${ev.time}</p><p><strong>Venue:</strong> ${escapeHTML(ev.location)}</p></div>`;
        document.getElementById('modal-overlay').innerHTML = modal;
        document.getElementById('modal-overlay').classList.add('active');
    },

    closeModal() { document.getElementById('modal-overlay').classList.remove('active'); document.getElementById('modal-overlay').innerHTML = ''; },

    getAuthTemplate() {
        const isLogin = this.state.currentView === 'login';
        return `
            <canvas id="particle-canvas"></canvas>
            <div class="auth-container">
                <div class="auth-image-panel" style="background-image:url('assets/login_hero.png')">
                    <div class="auth-image-overlay"></div>
                    <div class="auth-image-content"><h2>Gatherly Suite</h2><p>Enterprise event management suite with 30 active feature modules.</p></div>
                </div>
                <div class="auth-form-panel">
                    <div class="auth-wrapper">
                        <div class="auth-card">
                            <a href="#" class="back-to-home" onclick="App.navigate('home'); return false;"><i class="fas fa-arrow-left"></i> Back</a>
                            <h2 style="margin-top:15px;">${isLogin?'Sign In':'Register'}</h2>
                            <div id="${isLogin?'login-error':'signup-error'}" class="auth-error-box" style="display:none;"></div>
                            <form id="${isLogin?'login-form':'signup-form'}" novalidate style="margin-top:15px;">
                                <div class="input-group"><label>Email</label><div class="input-wrapper"><i class="fas fa-envelope"></i><input type="email" id="auth-email" value="admin@eventpro.com" required></div></div>
                                <div class="input-group" style="margin-top:10px;"><label>Password</label><div class="input-wrapper"><i class="fas fa-lock"></i><input type="password" id="auth-password" value="admin123" required></div></div>
                                ${!isLogin?`<div class="input-group" style="margin-top:10px;"><label>Confirm Password</label><div class="input-wrapper"><i class="fas fa-shield-alt"></i><input type="password" id="auth-confirm-password" value="admin123" required></div></div>`:''}
                                <button type="submit" class="auth-submit-btn" style="margin-top:20px;"><span>${isLogin?'Sign In':'Sign Up'}</span><i class="fas fa-arrow-right"></i></button>
                            </form>
                            <div class="auth-footer" style="margin-top:15px;">
                                ${isLogin?`<a href="#" onclick="App.navigate('signup'); return false;">Register Account</a>`:`<a href="#" onclick="App.navigate('login'); return false;">Login Here</a>`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="toast-container"></div>
        `;
    },

    bindAuthEvents() {
        const lF = document.getElementById('login-form'); if (lF) lF.addEventListener('submit', e => { e.preventDefault(); this.handleLogin(document.getElementById('auth-email').value.trim(), document.getElementById('auth-password').value); });
        const sF = document.getElementById('signup-form'); if (sF) sF.addEventListener('submit', e => { e.preventDefault(); this.handleSignup(document.getElementById('auth-email').value.trim(), document.getElementById('auth-password').value, document.getElementById('auth-confirm-password').value); });
    },

    bindDashboardEvents() {
        const btn = document.getElementById('mobile-toggle-btn'); const side = document.getElementById('sidebar');
        if (btn && side) btn.addEventListener('click', () => side.classList.toggle('active'));
        this.updateClock(); if (this.clockInterval) clearInterval(this.clockInterval);
        this.clockInterval = setInterval(() => this.updateClock(), 1000);
    },

    updateClock() {
        const el = document.getElementById('current-time');
        if (el) el.textContent = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' | ' + new Date().toLocaleTimeString();
    },

    initParticles() {
        const c = document.getElementById('particle-canvas'); if (!c) return;
        const ctx = c.getContext('2d'); let p = [];
        const r = () => { c.width = window.innerWidth; c.height = window.innerHeight; }; r();
        window.addEventListener('resize', r);
        for (let i = 0; i < 30; i++) p.push({ x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 2 + 1, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4 });
        const draw = () => {
            ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = 'rgba(129, 140, 248, 0.4)';
            p.forEach(pt => { pt.x += pt.vx; pt.y += pt.vy; if (pt.x < 0) pt.x = c.width; if (pt.x > c.width) pt.x = 0; if (pt.y < 0) pt.y = c.height; if (pt.y > c.height) pt.y = 0; ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2); ctx.fill(); });
            App.particleAnimId = requestAnimationFrame(draw);
        };
        draw();
    },

    animateCounters() {
        document.querySelectorAll('.stat-value').forEach(el => {
            const txt = el.textContent.trim(); if (txt.startsWith('$')) return;
            const target = parseInt(txt, 10); if (isNaN(target)) return;
            el.textContent = '0'; let current = 0;
            const step = () => { current += Math.ceil(target / 12); if (current >= target) el.textContent = target; else { el.textContent = current; requestAnimationFrame(step); } };
            requestAnimationFrame(step);
        });
    },

    getHomeTemplate() {
        return `
            <nav class="home-nav"><a href="#" class="nav-logo" onclick="App.navigate('home'); return false;"><i class="fas fa-cubes"></i><span>Gatherly Suite</span></a><div class="nav-links"><a href="#" class="nav-btn" onclick="App.navigate('login'); return false;"><span>Launch Console</span><i class="fas fa-arrow-right"></i></a></div></nav>
            <header class="home-hero">
                <div class="hero-grid">
                    <div class="hero-content">
                        <span class="section-subtitle">30 Enterprise Feature Modules</span>
                        <h1>Elevate Your Events. Streamline Operations.</h1>
                        <p>Control center for events, venue capacity, attendee registry, digital tickets, live chat, and analytics.</p>
                        <div class="hero-ctas"><a href="#" class="nav-btn" onclick="App.navigate('login'); return false;"><span>Go to Admin Suite</span><i class="fas fa-arrow-right"></i></a></div>
                    </div>
                    <div class="hero-image-wrapper"><img src="assets/homepage_hero.png" alt="Console Mockup" class="hero-image"></div>
                </div>
            </header>
        `;
    }
};

window.addEventListener('DOMContentLoaded', () => { App.initDb(); App.checkSession(); });
