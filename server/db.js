const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Failed to connect to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database (database.sqlite) at:', dbPath);
    }
});

// Promisified DB methods for cleaner async/await usage
db.asyncRun = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        this.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

db.asyncAll = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        this.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

db.asyncGet = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        this.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

async function initDb() {
    db.serialize(async () => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            passwordHash TEXT NOT NULL,
            role TEXT NOT NULL,
            name TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Events Table
        db.run(`CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            tags TEXT,
            description TEXT,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            location TEXT NOT NULL,
            venueId TEXT,
            capacity INTEGER DEFAULT 100,
            status TEXT DEFAULT 'Upcoming',
            priority TEXT DEFAULT 'Normal',
            color TEXT DEFAULT '#818cf8',
            isPublic INTEGER DEFAULT 1,
            isFeatured INTEGER DEFAULT 0,
            isPublished INTEGER DEFAULT 1
        )`);

        // Venues Table
        db.run(`CREATE TABLE IF NOT EXISTS venues (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            capacity INTEGER DEFAULT 200,
            isIndoor INTEGER DEFAULT 1,
            mapUrl TEXT,
            facilities TEXT,
            hallLayout TEXT,
            parkingInfo TEXT
        )`);

        // Attendees Table
        db.run(`CREATE TABLE IF NOT EXISTS attendees (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            avatar TEXT,
            status TEXT DEFAULT 'Approved',
            emergencyContact TEXT
        )`);

        // Tickets Table
        db.run(`CREATE TABLE IF NOT EXISTS tickets (
            id TEXT PRIMARY KEY,
            eventId TEXT NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            price REAL DEFAULT 0,
            capacity INTEGER DEFAULT 100,
            qrCode TEXT
        )`);

        // Registrations Table
        db.run(`CREATE TABLE IF NOT EXISTS registrations (
            id TEXT PRIMARY KEY,
            eventId TEXT NOT NULL,
            attendeeId TEXT NOT NULL,
            ticketId TEXT,
            status TEXT DEFAULT 'Pending',
            paid INTEGER DEFAULT 0,
            amount REAL DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Tasks Table
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            assignee TEXT,
            progress INTEGER DEFAULT 0,
            completed INTEGER DEFAULT 0
        )`);

        // Agenda Table
        db.run(`CREATE TABLE IF NOT EXISTS agenda (
            id TEXT PRIMARY KEY,
            time TEXT NOT NULL,
            title TEXT NOT NULL,
            speaker TEXT,
            room TEXT
        )`);

        // Chat Messages Table
        db.run(`CREATE TABLE IF NOT EXISTS chat_messages (
            id TEXT PRIMARY KEY,
            sender TEXT NOT NULL,
            text TEXT NOT NULL,
            time TEXT NOT NULL
        )`);

        // Feedback Table
        db.run(`CREATE TABLE IF NOT EXISTS feedback (
            id TEXT PRIMARY KEY,
            attendeeName TEXT NOT NULL,
            rating INTEGER DEFAULT 5,
            comment TEXT,
            reply TEXT
        )`);

        // Finance Expenses Table
        db.run(`CREATE TABLE IF NOT EXISTS finance_expenses (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            amount REAL DEFAULT 0
        )`);

        // Activity Logs Table
        db.run(`CREATE TABLE IF NOT EXISTS activity_logs (
            id TEXT PRIMARY KEY,
            action TEXT NOT NULL,
            detail TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )`);

        // Seed Data if empty
        const userCount = await db.asyncGet(`SELECT count(*) as count FROM users`);
        if (userCount && userCount.count === 0) {
            console.log('Seeding initial SQLite database values...');
            const DEFAULT_ADMIN_HASH = '240eb518362d535e6a47a73477f8cf8c5eceab43e622c34a15054f67623cf530'; // sha-256 for admin123

            await db.asyncRun(`INSERT INTO users (id, email, passwordHash, role, name) VALUES (?, ?, ?, ?, ?)`,
                ['usr-1', 'admin@gatherly.com', DEFAULT_ADMIN_HASH, 'Super Admin', 'System Administrator']);
            await db.asyncRun(`INSERT INTO users (id, email, passwordHash, role, name) VALUES (?, ?, ?, ?, ?)`,
                ['usr-2', 'organizer@gatherly.com', DEFAULT_ADMIN_HASH, 'Organizer', 'Sarah Jenkins']);

            // Events
            await db.asyncRun(`INSERT INTO events (id, name, category, tags, description, date, time, location, venueId, capacity, status, priority, color, isPublic, isFeatured, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                ['ev-1', 'Global Tech Conference 2026', 'Technology', 'AI,WebDev', 'The ultimate gathering of developers, designers, and tech enthusiasts. Discover AI and Cloud.', '2026-09-15', '09:00', 'San Francisco Innovation Hub', 'v-1', 250, 'Upcoming', 'High', '#818cf8', 1, 1, 1]);
            await db.asyncRun(`INSERT INTO events (id, name, category, tags, description, date, time, location, venueId, capacity, status, priority, color, isPublic, isFeatured, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                ['ev-2', 'Creative Design Summit', 'Design', 'UI/UX,Figma', 'Explore the boundaries of UI/UX design, motion graphics, and visual design systems.', '2026-10-22', '10:30', 'Metropolitan Art Center, NY', 'v-2', 150, 'Upcoming', 'Medium', '#c084fc', 1, 1, 1]);
            await db.asyncRun(`INSERT INTO events (id, name, category, tags, description, date, time, location, venueId, capacity, status, priority, color, isPublic, isFeatured, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                ['ev-3', 'Green Energy Pitch', 'Business', 'CleanTech,VC', 'Promising clean-tech startups present innovations to top tier venture capitalists.', '2026-11-05', '14:00', 'Sustainability Pavilion, Austin', 'v-3', 80, 'Upcoming', 'Normal', '#34d399', 1, 0, 1]);

            // Venues
            await db.asyncRun(`INSERT INTO venues (id, name, capacity, isIndoor, mapUrl, facilities, hallLayout, parkingInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                ['v-1', 'San Francisco Innovation Hub', 500, 1, 'https://maps.google.com/?q=San+Francisco+Innovation+Hub', 'WiFi,Parking,VIP Lounge', 'Auditorium Style (500 seats)', '500 vehicle spots in subterranean garage']);
            await db.asyncRun(`INSERT INTO venues (id, name, capacity, isIndoor, mapUrl, facilities, hallLayout, parkingInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                ['v-2', 'Metropolitan Art Center, NY', 300, 1, 'https://maps.google.com/?q=Metropolitan+Art+Center+NY', 'High-speed WiFi,A/V System', 'Exhibition Layout', 'Street parking & valet']);
            await db.asyncRun(`INSERT INTO venues (id, name, capacity, isIndoor, mapUrl, facilities, hallLayout, parkingInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                ['v-3', 'Sustainability Pavilion, Austin', 200, 0, 'https://maps.google.com/?q=Sustainability+Pavilion+Austin', 'Solar Charging,Open-air Stage', 'Outdoor Amphitheater', 'Solar EV charging parking']);

            // Attendees
            await db.asyncRun(`INSERT INTO attendees (id, name, email, phone, avatar, status, emergencyContact) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['att-1', 'Jane Doe', 'jane.doe@example.com', '+1-555-0199', 'J', 'Approved', 'Mark Doe (+1-555-9999)']);
            await db.asyncRun(`INSERT INTO attendees (id, name, email, phone, avatar, status, emergencyContact) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['att-2', 'John Smith', 'john.smith@example.com', '+1-555-0142', 'J', 'Approved', 'Mary Smith (+1-555-8888)']);
            await db.asyncRun(`INSERT INTO attendees (id, name, email, phone, avatar, status, emergencyContact) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['att-3', 'Alice Johnson', 'alice.j@example.com', '+1-555-0177', 'A', 'Pending', 'Bob Johnson (+1-555-7777)']);

            // Tickets
            await db.asyncRun(`INSERT INTO tickets (id, eventId, name, type, price, capacity, qrCode) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['tkt-1', 'ev-1', 'Early Bird Pass', 'Early Bird', 99, 100, 'QR-EV1-EB']);
            await db.asyncRun(`INSERT INTO tickets (id, eventId, name, type, price, capacity, qrCode) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['tkt-2', 'ev-1', 'VIP Access Pass', 'VIP', 399, 50, 'QR-EV1-VIP']);
            await db.asyncRun(`INSERT INTO tickets (id, eventId, name, type, price, capacity, qrCode) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['tkt-3', 'ev-2', 'Student Pass', 'Student', 49, 50, 'QR-EV2-ST']);

            // Registrations
            await db.asyncRun(`INSERT INTO registrations (id, eventId, attendeeId, ticketId, status, paid, amount) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['reg-1', 'ev-1', 'att-1', 'tkt-1', 'Confirmed', 1, 99]);
            await db.asyncRun(`INSERT INTO registrations (id, eventId, attendeeId, ticketId, status, paid, amount) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['reg-2', 'ev-1', 'att-2', 'tkt-2', 'Confirmed', 1, 399]);
            await db.asyncRun(`INSERT INTO registrations (id, eventId, attendeeId, ticketId, status, paid, amount) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['reg-3', 'ev-2', 'att-3', 'tkt-3', 'Pending', 0, 49]);

            // Tasks
            await db.asyncRun(`INSERT INTO tasks (id, title, assignee, progress, completed) VALUES (?, ?, ?, ?, ?)`,
                ['tsk-1', 'Confirm Keynote AV setup', 'Sarah Jenkins', 80, 0]);

            // Agenda
            await db.asyncRun(`INSERT INTO agenda (id, time, title, speaker, room) VALUES (?, ?, ?, ?, ?)`,
                ['ag-1', '09:00 - 10:00', 'Opening Keynote', 'Dr. Alex Vance', 'Auditorium']);

            // Chat
            await db.asyncRun(`INSERT INTO chat_messages (id, sender, text, time) VALUES (?, ?, ?, ?)`,
                ['msg-1', 'Sarah Jenkins', 'Welcome team! Registration desk is open.', '09:15 AM']);

            // Feedback
            await db.asyncRun(`INSERT INTO feedback (id, attendeeName, rating, comment, reply) VALUES (?, ?, ?, ?, ?)`,
                ['fb-1', 'Jane Doe', 5, 'Incredible organization!', 'Thank you Jane!']);

            // Finance Expenses
            await db.asyncRun(`INSERT INTO finance_expenses (id, title, amount) VALUES (?, ?, ?)`,
                ['exp-1', 'A/V Rental', 1500]);

            // Logs
            await db.asyncRun(`INSERT INTO activity_logs (id, action, detail, timestamp) VALUES (?, ?, ?, ?)`,
                ['log-1', 'System Init', 'Gatherly SQLite database operational', new Date().toISOString()]);

            console.log('Seeding completed successfully.');
        }
    });
}

initDb();

module.exports = db;
