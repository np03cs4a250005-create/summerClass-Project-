import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { eventsAPI, attendeesAPI } from '../services/api';
import { useToast } from '../components/Toast';

function drawCertificate(canvas, { attendee, event, certId, date, org }) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background Gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0,   '#0a0c1b');
    bg.addColorStop(0.5, '#0e1128');
    bg.addColorStop(1,   '#070912');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Ambient Golden Glow
    const glow = ctx.createRadialGradient(W/2, H/2, 40, W/2, H/2, W*0.6);
    glow.addColorStop(0,   'rgba(251,191,36,0.12)');
    glow.addColorStop(0.5, 'rgba(245,158,11,0.05)');
    glow.addColorStop(1,   'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Decorative Borders
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 3;
    ctx.strokeRect(18, 18, W-36, H-36);

    ctx.strokeStyle = 'rgba(251,191,36,0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(26, 26, W-52, H-52);

    ctx.strokeStyle = 'rgba(251,191,36,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(34, 34, W-68, H-68);

    // Corner Ornaments
    const corners = [[40, 40], [W-40, 40], [40, H-40], [W-40, H-40]];
    corners.forEach(([cx, cy]) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, -12); ctx.lineTo(12, 0);
        ctx.lineTo(0, 12);  ctx.lineTo(-12, 0);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
        ctx.restore();
    });

    // Top Brand Header Banner
    const bannerGrad = ctx.createLinearGradient(0, 55, 0, 110);
    bannerGrad.addColorStop(0,   'rgba(251,191,36,0.18)');
    bannerGrad.addColorStop(1,   'transparent');
    ctx.fillStyle = bannerGrad;
    ctx.fillRect(50, 55, W-100, 55);

    ctx.textAlign = 'center';
    ctx.font = '700 13px "Georgia", serif';
    ctx.letterSpacing = '3px';
    ctx.fillStyle = 'rgba(251,191,36,0.85)';
    ctx.fillText((org || 'GATHERLY SUITE').toUpperCase(), W/2, 82);

    const lineGrad = ctx.createLinearGradient(120, 0, W-120, 0);
    lineGrad.addColorStop(0,   'transparent');
    lineGrad.addColorStop(0.2, '#fbbf24');
    lineGrad.addColorStop(0.8, '#fbbf24');
    lineGrad.addColorStop(1,   'transparent');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(120, 93); ctx.lineTo(W-120, 93); ctx.stroke();

    // Certificate Title
    ctx.font = 'italic 700 36px "Georgia", serif';
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = 'rgba(251,191,36,0.55)';
    ctx.shadowBlur = 20;
    ctx.fillText('Certificate of Participation', W/2, 154);
    ctx.shadowBlur = 0;

    ctx.font = '400 14px "Georgia", serif';
    ctx.fillStyle = 'rgba(200,200,220,0.75)';
    ctx.fillText('This is to proudly certify that', W/2, 198);

    // Attendee Name Highlight
    const nameGlow = ctx.createRadialGradient(W/2, 244, 10, W/2, 244, 220);
    nameGlow.addColorStop(0,   'rgba(99,102,241,0.18)');
    nameGlow.addColorStop(1,   'transparent');
    ctx.fillStyle = nameGlow;
    ctx.fillRect(80, 214, W-160, 60);

    ctx.font = '700 40px "Georgia", serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(99,102,241,0.8)';
    ctx.shadowBlur = 18;
    ctx.fillText(attendee || 'Participant Name', W/2, 252);
    ctx.shadowBlur = 0;

    const nameLineGrad = ctx.createLinearGradient(200, 0, W-200, 0);
    nameLineGrad.addColorStop(0,   'transparent');
    nameLineGrad.addColorStop(0.3, '#818cf8');
    nameLineGrad.addColorStop(0.7, '#818cf8');
    nameLineGrad.addColorStop(1,   'transparent');
    ctx.strokeStyle = nameLineGrad;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(200, 262); ctx.lineTo(W-200, 262); ctx.stroke();

    ctx.font = '400 14px "Georgia", serif';
    ctx.fillStyle = 'rgba(200,200,220,0.75)';
    ctx.fillText('has successfully participated in', W/2, 296);

    // Event Title (wraps nicely)
    ctx.font = '700 24px "Georgia", serif';
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = 'rgba(251,191,36,0.5)';
    ctx.shadowBlur = 10;
    const maxW = W - 160;
    const words = (event || 'Event Name').split(' ');
    let line = '', lines = [];
    for (const w of words) {
        const test = line + w + ' ';
        if (ctx.measureText(test).width > maxW && line) {
            lines.push(line.trim());
            line = w + ' ';
        } else { line = test; }
    }
    lines.push(line.trim());
    lines.forEach((l, i) => ctx.fillText(l, W/2, 330 + i * 32));
    ctx.shadowBlur = 0;

    // Gold Medal Seal
    const medalY = 398 + (lines.length - 1) * 32;
    ctx.beginPath();
    ctx.arc(W/2, medalY, 32, 0, Math.PI * 2);
    const ringGrad = ctx.createRadialGradient(W/2, medalY, 8, W/2, medalY, 32);
    ringGrad.addColorStop(0,   'rgba(251,191,36,0.25)');
    ringGrad.addColorStop(1,   'rgba(251,191,36,0.06)');
    ctx.fillStyle = ringGrad;
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(W/2, medalY);
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = 'rgba(251,191,36,0.9)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const ang = (i * 4 * Math.PI / 5) - Math.PI / 2;
        if (i === 0) ctx.moveTo(Math.cos(ang)*18, Math.sin(ang)*18);
        else ctx.lineTo(Math.cos(ang)*18, Math.sin(ang)*18);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.shadowBlur = 0;

    const infoY = medalY + 50;
    ctx.font = '400 12px "Georgia", serif';
    ctx.fillStyle = 'rgba(160,160,180,0.75)';
    ctx.fillText(`Issued: ${date}`, W/2 - 120, infoY);
    ctx.fillText(`Cert ID: ${certId}`, W/2 + 80, infoY);

    // Signatures
    const sigY = infoY + 50;
    [W*0.27, W*0.73].forEach(sx => {
        ctx.strokeStyle = 'rgba(251,191,36,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(sx - 70, sigY); ctx.lineTo(sx + 70, sigY); ctx.stroke();
    });

    ctx.font = '700 12px "Georgia", serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('Authorised Signatory', W*0.27, sigY + 16);
    ctx.fillText('Event Director', W*0.73, sigY + 16);

    const barGrad = ctx.createLinearGradient(0, 0, W, 0);
    barGrad.addColorStop(0,   'transparent');
    barGrad.addColorStop(0.2, '#fbbf24');
    barGrad.addColorStop(0.5, '#818cf8');
    barGrad.addColorStop(0.8, '#fbbf24');
    barGrad.addColorStop(1,   'transparent');
    ctx.strokeStyle = barGrad;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(60, H - 46); ctx.lineTo(W-60, H - 46); ctx.stroke();

    ctx.font = '400 10px "Georgia", serif';
    ctx.fillStyle = 'rgba(140,140,160,0.55)';
    ctx.fillText('This certificate is digitally issued by Gatherly Suite — Enterprise Event Platform', W/2, H - 30);
}

const FALLBACK_EVENTS = [
    { id: 'ev-1', name: 'Global AI & Tech Keynote Summit 2026', location: 'San Francisco Innovation Hub', capacity: 500 },
    { id: 'ev-2', name: 'Next-Gen UX & Design Systems Summit', location: 'Metropolitan Art Center, NY', capacity: 350 },
    { id: 'ev-3', name: 'CleanTech & Green Energy Venture Pitch', location: 'Sustainability Pavilion, Austin', capacity: 200 }
];

const QrCertificates = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [eventsList, setEventsList] = useState(FALLBACK_EVENTS);
    const [attendeesList, setAttendeesList] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [loadingEvents, setLoadingEvents] = useState(true);

    const [passesDb, setPassesDb] = useState({});
    const [gateLog, setGateLog] = useState([
        { time: '10:14 AM', name: 'Dr. Aarav Sharma', eventTitle: 'Global AI & Tech Keynote Summit 2026', tier: 'Speaker VIP Pass', gate: 'Main Entrance Gate A', status: 'VERIFIED' }
    ]);

    const [attendee, setAttendee] = useState('Alex Rivera');
    const [event, setEvent] = useState('');
    const [org, setOrg] = useState('Gatherly Suite');
    const [certId, setCertId] = useState('CERT-2026-8812');
    const [generated, setGenerated] = useState(true);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [inputQR, setInputQR] = useState('');

    const canvasRef = useRef(null);
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Load registered events and attendees from database APIs
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoadingEvents(true);
                const [evRes, attRes] = await Promise.all([
                    eventsAPI.getAll().catch(() => ({ data: [] })),
                    attendeesAPI.getAll().catch(() => ({ data: [] }))
                ]);

                let liveEvents = (evRes.data && Array.isArray(evRes.data) && evRes.data.length > 0)
                    ? evRes.data
                    : FALLBACK_EVENTS;

                setEventsList(liveEvents);

                let liveAttendees = (attRes.data && Array.isArray(attRes.data)) ? attRes.data : [];
                setAttendeesList(liveAttendees);

                // Check URL Params for pre-selected event or attendee
                const paramEventId = searchParams.get('eventId');
                const paramEventTitle = searchParams.get('eventTitle');
                const paramAttendee = searchParams.get('attendeeName');

                let targetEvent = null;
                if (paramEventId) {
                    targetEvent = liveEvents.find(e => e.id === paramEventId);
                }
                if (!targetEvent && paramEventTitle) {
                    targetEvent = liveEvents.find(e => (e.name || e.title) === paramEventTitle);
                }
                if (!targetEvent) {
                    targetEvent = liveEvents[0];
                }

                if (targetEvent) {
                    setSelectedEventId(targetEvent.id);
                    setEvent(targetEvent.name || targetEvent.title || 'Event Name');
                }

                if (paramAttendee) {
                    setAttendee(paramAttendee);
                } else if (liveAttendees.length > 0) {
                    setAttendee(liveAttendees[0].name);
                }

                // Generate initial passes for events
                const passesMap = {};
                liveEvents.forEach((evItem, idx) => {
                    const evTitle = evItem.name || evItem.title;
                    passesMap[evItem.id] = [
                        { qr: `GATH-VIP-${1000 + idx * 111}`, name: 'Sita Rai', email: 'sita.rai@example.com', tier: 'VIP Gold Pass', checkedIn: false, seat: 'VIP-A04', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
                        { qr: `GATH-PREM-${2000 + idx * 222}`, name: 'Anil Bajracharya', email: 'anil.b@example.com', tier: 'Premium Pass', checkedIn: false, seat: 'PREM-B12', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
                        { qr: `GATH-STD-${3000 + idx * 333}`, name: 'Bikram Thapa', email: 'bikram.t@example.com', tier: 'Standard Pass', checkedIn: false, seat: 'STD-C22', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' }
                    ];

                    // Merge real attendees into passes if available
                    if (liveAttendees.length > 0) {
                        liveAttendees.forEach((attItem, attIdx) => {
                            if (attIdx < 3) {
                                passesMap[evItem.id].push({
                                    qr: `GATH-${attItem.id || 'REG-' + attIdx}`,
                                    name: attItem.name,
                                    email: attItem.email || 'attendee@gatherly.org',
                                    tier: 'Verified Attendee',
                                    checkedIn: false,
                                    seat: `SEAT-${attIdx + 1}`,
                                    avatar: `https://images.unsplash.com/photo-${1500000000000 + attIdx}?w=100`
                                });
                            }
                        });
                    }
                });

                setPassesDb(passesMap);

            } catch (err) {
                console.error('Failed to load events for certificates:', err);
            } finally {
                setLoadingEvents(false);
            }
        };

        fetchInitialData();
    }, [searchParams]);

    const currentEvent = eventsList.find((e) => e.id === selectedEventId) || eventsList[0] || { name: 'Event Name', location: 'Main Venue' };
    const eventPasses = passesDb[selectedEventId] || [];
    const checkedInCount = eventPasses.filter((p) => p.checkedIn).length;

    const handleEventChange = (newId) => {
        setSelectedEventId(newId);
        const evObj = eventsList.find(e => e.id === newId);
        if (evObj) {
            const evName = evObj.name || evObj.title;
            setEvent(evName);
        }
    };

    useEffect(() => {
        if (!canvasRef.current) return;
        drawCertificate(canvasRef.current, { attendee, event, org, certId, date: today });
    }, [attendee, event, org, certId, generated]);

    const playBeep = (type = 'success') => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = type === 'success' ? 880 : 300;
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
        } catch (e) {}
    };

    const processScan = (codeToScan) => {
        const query = codeToScan.trim().toUpperCase();
        if (!query) return;

        setScanning(true);
        setScanResult(null);

        setTimeout(() => {
            setScanning(false);
            const foundIndex = eventPasses.findIndex(
                (p) => p.qr.toUpperCase() === query || p.name.toUpperCase().includes(query)
            );

            if (foundIndex !== -1) {
                const matchedPass = eventPasses[foundIndex];
                const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                const updatedList = [...eventPasses];
                updatedList[foundIndex] = {
                    ...matchedPass,
                    checkedIn: true,
                    time: matchedPass.time || nowTime
                };

                setPassesDb((prev) => ({
                    ...prev,
                    [selectedEventId]: updatedList
                }));

                setScanResult({
                    valid: true,
                    pass: updatedList[foundIndex],
                    alreadyCheckedIn: matchedPass.checkedIn
                });

                playBeep('success');
                showToast(`Verified: ${matchedPass.name} (${matchedPass.tier})`, 'success');

                setGateLog((prev) => [
                    {
                        time: nowTime,
                        name: matchedPass.name,
                        eventTitle: currentEvent.name || currentEvent.title,
                        tier: matchedPass.tier,
                        gate: 'Gate Scanner #01',
                        status: 'VERIFIED'
                    },
                    ...prev.slice(0, 7)
                ]);
            } else if (query.startsWith('QR-') || query.startsWith('GATH-')) {
                const demoPass = {
                    qr: query,
                    name: 'Guest Attendee',
                    email: 'guest@gatherly.io',
                    tier: 'VIP Gold Pass',
                    checkedIn: true,
                    seat: 'ZONE-A',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                };
                setScanResult({ valid: true, pass: demoPass, alreadyCheckedIn: false });
                playBeep('success');
                showToast('QR badge verified successfully!', 'success');
            } else {
                setScanResult({ valid: false, code: query });
                playBeep('error');
                showToast('Access Denied — Invalid QR Code for this event', 'error');
            }
        }, 800);
    };

    const handleFormScan = (e) => {
        e.preventDefault();
        processScan(inputQR);
    };

    const handleGenerate = () => {
        const id = `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        setCertId(id);
        setGenerated(true);
        showToast(`Official Certificate generated: ${id}`, 'success');
        setTimeout(() => {
            if (canvasRef.current) {
                drawCertificate(canvasRef.current, { attendee, event, org, certId: id, date: today });
            }
        }, 50);
    };

    const handleAutoFillCert = (pass) => {
        setAttendee(pass.name);
        setEvent(currentEvent.name || currentEvent.title);
        handleGenerate();
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `Certificate_${attendee.replace(/\s+/g, '_')}_${certId}.png`;
        link.href = canvasRef.current.toDataURL('image/png', 1.0);
        link.click();
        showToast('Certificate PNG downloaded successfully!', 'success');
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Hero Header */}
            <div className="page-hero anim-fade-down" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 25px rgba(56,189,248,0.4)', flexShrink: 0 }}>
                            <i className="fas fa-certificate" style={{ color: '#fff', fontSize: '1.6rem' }}></i>
                        </div>
                        <div>
                            <h1 className="page-hero-title">Live Gate QR Scanner & Certificate System</h1>
                            <p className="page-hero-sub">Interconnected with Events Management Hub to scan digital passes and issue certificates for all registered events</p>
                        </div>
                    </div>

                    {/* Dynamic Active Event Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>Select Event:</label>
                        <select
                            value={selectedEventId}
                            onChange={(e) => handleEventChange(e.target.value)}
                            style={{
                                background: 'rgba(15, 23, 42, 0.95)',
                                border: '1px solid rgba(56, 189, 248, 0.4)',
                                color: '#f8fafc',
                                padding: '10px 16px',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                outline: 'none'
                            }}>
                            {eventsList.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.name || e.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div className="card-glass" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-calendar-check" style={{ color: '#38bdf8', fontSize: '1.2rem' }}></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Active Event</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                            {currentEvent.name || currentEvent.title}
                        </div>
                    </div>
                </div>

                <div className="card-glass" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(74, 222, 128, 0.15)', border: '1px solid rgba(74, 222, 128, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-check-double" style={{ color: '#4ade80', fontSize: '1.2rem' }}></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Gate Checked-In</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ade80' }}>
                            {checkedInCount} / {eventPasses.length} Checked In
                        </div>
                    </div>
                </div>

                <div className="card-glass" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.15)', border: '1px solid rgba(251, 191, 36, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-award" style={{ color: '#fbbf24', fontSize: '1.2rem' }}></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Certificate Format</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fbbf24' }}>Gold Digital Seal</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>

                {/* Left Panel: Real Event Gate Scanner */}
                <div className="card-glass anim-slide-left" style={{ padding: '26px', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.15rem', fontWeight: 800 }}>
                            <i className="fas fa-camera text-indigo"></i> Event Entrance Gate Scanner
                        </h3>
                        <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.3)', fontWeight: 700 }}>
                            LIVE GATE
                        </span>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', margin: '0 0 16px', fontSize: '0.86rem' }}>
                        Scan digital QR passes for <strong>{currentEvent.name || currentEvent.title}</strong> to verify door admittance.
                    </p>

                    <div style={{
                        background: 'rgba(5, 11, 26, 0.85)',
                        border: '1.5px solid rgba(56, 189, 248, 0.4)',
                        borderRadius: '16px',
                        padding: '20px',
                        textAlign: 'center',
                        marginBottom: '18px',
                        position: 'relative',
                        minHeight: 170,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {scanning && <div className="scanner-line"></div>}

                        {!scanning && !scanResult && (
                            <div>
                                <i className="fas fa-qrcode" style={{ fontSize: '3rem', color: '#38bdf8', marginBottom: '10px', display: 'block' }}></i>
                                <p style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600, margin: '0 0 4px' }}>Ready for Gate Pass Scan</p>
                                <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>Tap any sample pass below or enter badge ID</p>
                            </div>
                        )}

                        {scanning && (
                            <div>
                                <div style={{ width: 40, height: 40, border: '3px solid rgba(56,189,248,0.3)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }}></div>
                                <p style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>Verifying Gate Pass...</p>
                            </div>
                        )}

                        {scanResult && !scanning && (
                            <div className="anim-scale-in" style={{ width: '100%' }}>
                                {scanResult.valid ? (
                                    <div style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.4)', padding: '14px', borderRadius: '14px' }}>
                                        <div style={{ fontSize: '2rem', color: '#4ade80', marginBottom: '2px' }}><i className="fas fa-circle-check"></i></div>
                                        <h4 style={{ color: '#4ade80', margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800 }}>ENTRY VERIFIED</h4>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15, 23, 42, 0.8)', padding: '10px', borderRadius: '10px', textAlign: 'left', marginTop: '10px' }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>{scanResult.pass.name}</div>
                                                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{scanResult.pass.email} • {scanResult.pass.seat}</div>
                                                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                                                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{scanResult.pass.tier}</span>
                                                    <span style={{ fontSize: '0.7rem', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '2px 6px', borderRadius: '6px' }}>Checked in {scanResult.pass.time}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleAutoFillCert(scanResult.pass)}
                                            style={{
                                                marginTop: '12px',
                                                padding: '8px 14px',
                                                borderRadius: '8px',
                                                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                                                border: 'none',
                                                color: '#000',
                                                fontWeight: 800,
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                            <i className="fas fa-award"></i> Auto-Fill & Issue Certificate
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '14px', borderRadius: '14px' }}>
                                        <div style={{ fontSize: '2rem', color: '#ef4444', marginBottom: '2px' }}><i className="fas fa-circle-xmark"></i></div>
                                        <h4 style={{ color: '#ef4444', margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800 }}>ACCESS DENIED</h4>
                                        <p style={{ color: '#cbd5e1', fontSize: '0.82rem', margin: 0 }}>QR pass not recognized for {currentEvent.name || currentEvent.title}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                            Tap Sample Registered Pass for {currentEvent.name || currentEvent.title}:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {eventPasses.map((p) => (
                                <button
                                    key={p.qr}
                                    onClick={() => {
                                        setInputQR(p.qr);
                                        processScan(p.qr);
                                    }}
                                    style={{
                                        padding: '5px 10px',
                                        borderRadius: '8px',
                                        background: p.checkedIn ? 'rgba(74, 222, 128, 0.15)' : 'rgba(56, 189, 248, 0.12)',
                                        border: p.checkedIn ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(56, 189, 248, 0.3)',
                                        color: p.checkedIn ? '#4ade80' : '#38bdf8',
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                    <i className={`fas ${p.checkedIn ? 'fa-user-check' : 'fa-qrcode'}`}></i>
                                    <span>{p.name} ({p.tier.split(' ')[0]})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleFormScan}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                value={inputQR}
                                onChange={(e) => setInputQR(e.target.value)}
                                placeholder="Scan/Type QR Code..."
                                className="form-input"
                                style={{ flex: 1, padding: '8px 12px' }}
                                required
                            />
                            <button type="submit" disabled={scanning} className="btn btn-primary" style={{ borderRadius: '8px', padding: '0 16px' }}>
                                {scanning ? (
                                    <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>
                                ) : (
                                    <i className="fas fa-barcode"></i>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Panel: Interconnected Certificate Generator */}
                <div className="card-glass anim-slide-right" style={{ padding: '26px', borderRadius: '20px' }}>
                    <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.15rem', fontWeight: 800 }}>
                        <i className="fas fa-certificate text-amber"></i> Issue Official Certificate
                    </h3>

                    {/* Dynamic Event Selection for Certificate */}
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block', fontWeight: 600 }}>
                            Registered Event *
                        </label>
                        <select
                            value={event}
                            onChange={(e) => {
                                setEvent(e.target.value);
                                const found = eventsList.find(ev => (ev.name || ev.title) === e.target.value);
                                if (found) setSelectedEventId(found.id);
                            }}
                            className="form-input"
                            style={{ background: 'rgba(15,23,42,0.9)', color: '#fff', fontWeight: 600 }}>
                            {eventsList.map((evItem) => (
                                <option key={evItem.id} value={evItem.name || evItem.title}>
                                    {evItem.name || evItem.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Attendee Name Input with Autocomplete / Quick Fill */}
                    <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                Attendee Full Name *
                            </label>
                            {attendeesList.length > 0 && (
                                <span style={{ fontSize: '0.72rem', color: '#38bdf8' }}>
                                    {attendeesList.length} registered profiles
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            value={attendee}
                            onChange={(e) => setAttendee(e.target.value)}
                            list="attendees-datalist"
                            placeholder="e.g. Alex Rivera"
                            className="form-input"
                            required
                        />
                        <datalist id="attendees-datalist">
                            {attendeesList.map((att) => (
                                <option key={att.id} value={att.name}>{att.email}</option>
                            ))}
                        </datalist>
                    </div>

                    {/* Issuing Organization Input */}
                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block', fontWeight: 600 }}>
                            Issuing Organization
                        </label>
                        <input
                            type="text"
                            value={org}
                            onChange={(e) => setOrg(e.target.value)}
                            placeholder="Gatherly Enterprise Suite"
                            className="form-input"
                        />
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                            border: 'none',
                            color: '#000',
                            boxShadow: '0 4px 18px rgba(251,191,36,0.35)',
                            fontWeight: 800,
                            fontSize: '0.92rem',
                            padding: '12px',
                            cursor: 'pointer'
                        }}
                        onClick={handleGenerate}>
                        <i className="fas fa-magic" style={{ marginRight: '8px' }}></i> Generate & Update Certificate
                    </button>
                </div>
            </div>

            {/* Live Certificate Preview Canvas */}
            {generated && (
                <div className="anim-scale-in" style={{ marginTop: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 800 }}>
                            <i className="fas fa-award text-amber"></i> Digital Certificate Preview
                        </h3>
                        <button className="btn btn-primary" onClick={handleDownload}
                            style={{ background: 'linear-gradient(135deg, #34d399, #059669)', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 700, boxShadow: '0 4px 16px rgba(52,211,153,0.35)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-download"></i> Download Official PNG
                        </button>
                    </div>

                    <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 0 50px rgba(251,191,36,0.2), 0 20px 50px rgba(0,0,0,0.7)', border: '1px solid rgba(251,191,36,0.25)', background: '#0a0c1b' }}>
                        <canvas
                            ref={canvasRef}
                            width={900}
                            height={550}
                            style={{ display: 'block', width: '100%', height: 'auto' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default QrCertificates;
