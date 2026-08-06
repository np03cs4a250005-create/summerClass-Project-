// Gatherly AI Assistant & Knowledge Engine
// Powerful Natural Language Intent Processor & Website Flow Guide

export const getAIResponse = (userQuery, userRole = 'admin') => {
    const q = userQuery.toLowerCase().trim();

    // 1. Export Reports & Real File Downloads
    if (q.includes('report') || q.includes('export') || q.includes('csv') || q.includes('pdf') || q.includes('json') || q.includes('download')) {
        return {
            text: `To export real-life reports, navigate to the **Reports & Export Studio**! You can download actual CSV files for attendance rosters, financial audit ledgers, JSON engagement analytics, or printable PDF security audit documents.`,
            steps: [
                '1. Go to the Reports Studio.',
                '2. Select any report module (Attendance Roster, Financial Audit, Analytics).',
                '3. Click "Download Real CSV" or "Print PDF Audit Log".',
                '4. Or use the "Generate Custom Report" modal to export tailored formats.'
            ],
            action: { label: 'Navigate to Reports Studio', path: '/reports', icon: 'fa-chart-line' }
        };
    }

    // 2. Reviews & Rating Submissions
    if (q.includes('review') || q.includes('rating') || q.includes('feedback') || q.includes('star') || q.includes('comment')) {
        return {
            text: `Attendees and organizers can write verified 5-star event reviews and read community feedback in the **Attendee Reviews & Feedback** portal!`,
            steps: [
                '1. Open "Feedback & Reviews".',
                '2. Click "Write a Review" to submit your 5-star rating and experience.',
                '3. Filter reviews by star count (5★, 4★, 3★, 2★).',
                '4. Organizers can post official responses directly under attendee reviews.'
            ],
            action: { label: 'Navigate to Reviews & Feedback', path: '/feedback', icon: 'fa-star' }
        };
    }

    // 3. Real Ticket Reservations & QR Pass Exporter
    if (q.includes('ticket') || q.includes('reserve') || q.includes('pass') || q.includes('booking') || q.includes('capacity') || q.includes('price')) {
        return {
            text: `Gatherly includes a real ticket reservation system! Attendees can select ticket tiers, reserve seats, receive unique booking reference codes (e.g. RES-849201), and download digital event passes.`,
            steps: [
                '1. Navigate to "Tickets & Pricing".',
                '2. Click "Reserve Ticket Now" on your desired tier (VIP, Early Bird, General).',
                '3. Enter guest details, phone number, and pass quantity.',
                '4. Confirm to automatically update available seat capacity and download your digital pass file!'
            ],
            action: { label: 'Navigate to Tickets & Passes', path: '/tickets', icon: 'fa-ticket-alt' }
        };
    }

    // 4. Role Switching (Admin Mode vs User Mode)
    if (q.includes('role') || q.includes('admin') || q.includes('user mode') || q.includes('switch') || q.includes('portal') || q.includes('organizer')) {
        return {
            text: `Gatherly supports dual **Admin Mode** (full event & venue management) and **User Mode** (attendee booking, reviews & schedule view). You can switch modes anytime without logging out!`,
            steps: [
                '1. Look at the top navigation header bar.',
                '2. Click the "Admin Mode" or "User Mode" pill button.',
                '3. The navigation menu will automatically update and redirect you to the appropriate workspace.'
            ],
            action: { label: 'Go to Events Hub', path: '/events', icon: 'fa-calendar-alt' }
        };
    }

    // 5. Sponsor Management & Budget ROI Calculator
    if (q.includes('sponsor') || q.includes('tier') || q.includes('calc') || q.includes('calculator') || q.includes('roi') || q.includes('budget') || q.includes('finance') || q.includes('revenue')) {
        return {
            text: `Manage event sponsors and calculate financial ROI in the **Finance & Sponsorship** console!`,
            steps: [
                '1. Open "Finance & Sponsors".',
                '2. Click "Add New Sponsor" to register Platinum, Gold, Silver, or Bronze sponsors.',
                '3. Use the interactive "Event Budget & ROI Calculator" to adjust expected ticket prices, venue rentals, and calculate projected net ROI.'
            ],
            action: { label: 'Navigate to Finance & Sponsors', path: '/finance', icon: 'fa-wallet' }
        };
    }

    // 6. Email Communications & Broadcasts
    if (q.includes('email') || q.includes('mail') || q.includes('broadcast') || q.includes('notify') || q.includes('message')) {
        return {
            text: `Send individual email notifications or mass broadcasts to all registered attendees using the **Communications Hub**!`,
            steps: [
                '1. Navigate to "Communications & Email".',
                '2. Select "Send to Specific Email" or "Broadcast to All Attendees".',
                '3. Pick a quick template or type your custom announcement.',
                '4. Click "Send Email" to trigger delivery.'
            ],
            action: { label: 'Navigate to Communications', path: '/communications', icon: 'fa-satellite-dish' }
        };
    }

    // 7. Mini Arcade Game vs Computer AI
    if (q.includes('game') || q.includes('arcade') || q.includes('play') || q.includes('tic') || q.includes('computer')) {
        return {
            text: `Take a break or play while loading! Gatherly includes a built-in **Cyber Arcade Mini-Game** against Computer AI.`,
            steps: [
                '1. Go to the Home Page or top navigation bar.',
                '2. Click "Play Arcade Game vs AI".',
                '3. Play interactive Tic-Tac-Toe against the intelligent Gatherly AI bot!'
            ],
            action: { label: 'Go to Home Page', path: '/', icon: 'fa-gamepad' }
        };
    }

    // 8. QR Scanner & Gate Check-in
    if (q.includes('qr') || q.includes('scan') || q.includes('check-in') || q.includes('badge') || q.includes('cert')) {
        return {
            text: `Scan attendee QR badges at venue entry gates and issue digital completion certificates in **QR & Certificates**.`,
            steps: [
                '1. Open "QR Scanner & Certs".',
                '2. Launch camera scanning or enter badge codes manually.',
                '3. Check-ins sync in under 50ms to live attendance metrics.'
            ],
            action: { label: 'Navigate to QR & Certificates', path: '/qr', icon: 'fa-qrcode' }
        };
    }

    // 9. Creating & Managing Events
    if (q.includes('event') || q.includes('create') || q.includes('hub') || q.includes('new event')) {
        return {
            text: `Create and publish events in the **Events Management Hub**.`,
            steps: [
                '1. Go to Events Hub.',
                '2. Click "Create Event".',
                '3. Fill in title, category, date, venue, capacity limit, and description.',
                '4. Click "Save Event" to publish live!'
            ],
            action: { label: 'Navigate to Events Hub', path: '/events', icon: 'fa-calendar-alt' }
        };
    }

    // 10. General / Fallback Response
    return {
        text: `I am your Gatherly AI Assistant! I can help you create events, reserve tickets, export real CSV/PDF reports, write reviews, manage sponsors, and guide you through any feature on the platform. What would you like help with?`,
        steps: [
            '• Ask: "How do I reserve VIP tickets?"',
            '• Ask: "How do I export CSV reports?"',
            '• Ask: "How do I write a review?"',
            '• Ask: "How do I add sponsors?"'
        ],
        action: { label: 'Explore Dashboard Overview', path: '/dashboard', icon: 'fa-th-large' }
    };
};
