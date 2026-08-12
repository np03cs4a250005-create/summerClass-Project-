import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../components/Toast';

function drawCertificate(canvas, { attendee, event, certId, date, org }) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0,   '#0a0c1b');
    bg.addColorStop(0.5, '#0e1128');
    bg.addColorStop(1,   '#070912');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const glow = ctx.createRadialGradient(W/2, H/2, 40, W/2, H/2, W*0.6);
    glow.addColorStop(0,   'rgba(251,191,36,0.12)');
    glow.addColorStop(0.5, 'rgba(245,158,11,0.05)');
    glow.addColorStop(1,   'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 3;
    ctx.strokeRect(18, 18, W-36, H-36);

    ctx.strokeStyle = 'rgba(251,191,36,0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(26, 26, W-52, H-52);

    ctx.strokeStyle = 'rgba(251,191,36,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(34, 34, W-68, H-68);

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

    const bannerGrad = ctx.createLinearGradient(0, 55, 0, 110);
    bannerGrad.addColorStop(0,   'rgba(251,191,36,0.18)');
    bannerGrad.addColorStop(1,   'transparent');
    ctx.fillStyle = bannerGrad;
    ctx.fillRect(50, 55, W-100, 55);

    ctx.textAlign = 'center';
    ctx.font = '700 13px "Georgia", serif';
    ctx.letterSpacing = '3px';
    ctx.fillStyle = 'rgba(251,191,36,0.7)';
    ctx.fillText((org || 'GATHERLY SUITE').toUpperCase(), W/2, 82);

    const lineGrad = ctx.createLinearGradient(120, 0, W-120, 0);
    lineGrad.addColorStop(0,   'transparent');
    lineGrad.addColorStop(0.2, '#fbbf24');
    lineGrad.addColorStop(0.8, '#fbbf24');
    lineGrad.addColorStop(1,   'transparent');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(120, 93); ctx.lineTo(W-120, 93); ctx.stroke();

    ctx.font = 'italic 700 38px "Georgia", serif';
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = 'rgba(251,191,36,0.55)';
    ctx.shadowBlur = 20;
    ctx.fillText('Certificate of Participation', W/2, 158);
    ctx.shadowBlur = 0;

    ctx.font = '400 14px "Georgia", serif';
    ctx.fillStyle = 'rgba(200,200,220,0.75)';
    ctx.fillText('This is to proudly certify that', W/2, 202);

    const nameGlow = ctx.createRadialGradient(W/2, 248, 10, W/2, 248, 220);
    nameGlow.addColorStop(0,   'rgba(99,102,241,0.18)');
    nameGlow.addColorStop(1,   'transparent');
    ctx.fillStyle = nameGlow;
    ctx.fillRect(80, 218, W-160, 62);

    ctx.font = '700 42px "Georgia", serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(99,102,241,0.8)';
    ctx.shadowBlur = 18;
    ctx.fillText(attendee || 'Participant Name', W/2, 258);
    ctx.shadowBlur = 0;

    const nameLineGrad = ctx.createLinearGradient(200, 0, W-200, 0);
    nameLineGrad.addColorStop(0,   'transparent');
    nameLineGrad.addColorStop(0.3, '#818cf8');
    nameLineGrad.addColorStop(0.7, '#818cf8');
    nameLineGrad.addColorStop(1,   'transparent');
    ctx.strokeStyle = nameLineGrad;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(200, 268); ctx.lineTo(W-200, 268); ctx.stroke();

    ctx.font = '400 14px "Georgia", serif';
    ctx.fillStyle = 'rgba(200,200,220,0.75)';
    ctx.fillText('has successfully participated in', W/2, 302);

    ctx.font = '700 26px "Georgia", serif';
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
    lines.forEach((l, i) => ctx.fillText(l, W/2, 338 + i * 34));
    ctx.shadowBlur = 0;

    const medalY = 408 + (lines.length - 1) * 34;
    ctx.beginPath();
    ctx.arc(W/2, medalY, 34, 0, Math.PI * 2);
    const ringGrad = ctx.createRadialGradient(W/2, medalY, 8, W/2, medalY, 34);
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
        if (i === 0) ctx.moveTo(Math.cos(ang)*20, Math.sin(ang)*20);
        else ctx.lineTo(Math.cos(ang)*20, Math.sin(ang)*20);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.shadowBlur = 0;

    const infoY = medalY + 55;
    ctx.font = '400 12px "Georgia", serif';
    ctx.fillStyle = 'rgba(160,160,180,0.75)';
    ctx.fillText(`Issued: ${date}`, W/2 - 120, infoY);
    ctx.fillText(`Cert ID: ${certId}`, W/2 + 80, infoY);

    const sigY = infoY + 55;
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
    ctx.beginPath(); ctx.moveTo(60, H - 50); ctx.lineTo(W-60, H - 50); ctx.stroke();

    ctx.font = '400 10px "Georgia", serif';
    ctx.fillStyle = 'rgba(140,140,160,0.55)';
    ctx.fillText('This certificate is digitally issued by Gatherly Suite — Enterprise Event Platform', W/2, H - 34);
}

const SAMPLE_EVENTS = [
    { id: 'ev-1', title: 'Global Tech Conference 2026', venue: 'Kathmandu International Convention Center', totalCapacity: 100 },
    { id: 'ev-2', title: 'Creative Design & UX Summit 2026', venue: 'Himalayan Tech Hub', totalCapacity: 80 },
    { id: 'ev-3', title: 'DevOps & AI Cloud Expo 2026', venue: 'Grand Ball Room • Hotel Yak & Yeti', totalCapacity: 150 }
];

const INITIAL_PASSES = {
    'ev-1': [
        { qr: 'GATH-VIP-88219', name: 'Sita Rai', email: 'sita.rai@example.com', tier: 'VIP Gold Pass', checkedIn: false, seat: 'VIP-A04', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
        { qr: 'GATH-PREM-44102', name: 'Anil Bajracharya', email: 'anil.b@example.com', tier: 'Premium All-Access', checkedIn: false, seat: 'PREM-B12', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
        { qr: 'GATH-STD-19302', name: 'Bikram Thapa', email: 'bikram.t@example.com', tier: 'Standard Admission', checkedIn: false, seat: 'STD-C22', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
        { qr: 'GATH-VIP-99103', name: 'Dr. Aarav Sharma', email: 'aarav.sharma@example.com', tier: 'Speaker VIP Pass', checkedIn: true, time: '10:14 AM', seat: 'STAGE-KEYNOTE', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' }
    ],
    'ev-2': [
        { qr: 'GATH-DES-001', name: 'Pooja Shrestha', email: 'pooja.s@example.com', tier: 'VIP Gold Pass', checkedIn: false, seat: 'VIP-101', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
        { qr: 'GATH-DES-002', name: 'Rohan Adhikari', email: 'rohan.a@example.com', tier: 'Standard Admission', checkedIn: false, seat: 'STD-55', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100' }
    ],
    'ev-3': [
        { qr: 'GATH-AI-771', name: 'Kiran Maharjan', email: 'kiran.m@example.com', tier: 'VIP Gold Pass', checkedIn: false, seat: 'VIP-02', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' }
    ]
};

const QrCertificates = () => {
    const [selectedEventId, setSelectedEventId] = useState('ev-1');
    const [passesDb, setPassesDb] = useState(INITIAL_PASSES);
    const [gateLog, setGateLog] = useState([
        { time: '10:14 AM', name: 'Dr. Aarav Sharma', eventTitle: 'Global Tech Conference 2026', tier: 'Speaker VIP Pass', gate: 'Main Entrance Gate A', status: 'VERIFIED' }
    ]);

    const [attendee, setAttendee] = useState('Sita Rai');
    const [event, setEvent] = useState('Global Tech Conference 2026');
    const [org, setOrg] = useState('Gatherly Suite Nepal');
    const [certId, setCertId] = useState(null);
    const [generated, setGenerated] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [inputQR, setInputQR] = useState('');

    const canvasRef = useRef(null);
    const { showToast } = useToast();

    const currentEvent = SAMPLE_EVENTS.find((e) => e.id === selectedEventId) || SAMPLE_EVENTS[0];
    const eventPasses = passesDb[selectedEventId] || [];
    const checkedInCount = eventPasses.filter((p) => p.checkedIn).length;
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        setEvent(currentEvent.title);
    }, [selectedEventId]);

    useEffect(() => {
        if (!generated || !canvasRef.current) return;
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
        } catch (e) {
            // Ignore audio restriction
        }
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
                        eventTitle: currentEvent.title,
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
                showToast('Demo QR badge verified successfully!', 'success');
            } else {
                setScanResult({ valid: false, code: query });
                playBeep('error');
                showToast('Access Denied — Unregistered or Invalid QR Code', 'error');
            }
        }, 1200);
    };

    const handleFormScan = (e) => {
        e.preventDefault();
        processScan(inputQR);
    };

    const handleGenerate = () => {
        const id = `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        setCertId(id);
        setGenerated(true);
        showToast(`Certificate issued — ${id}`, 'success');
        setTimeout(() => {
            if (canvasRef.current) {
                drawCertificate(canvasRef.current, { attendee, event, org, certId: id, date: today });
            }
        }, 60);
    };

    const handleAutoFillCert = (pass) => {
        setAttendee(pass.name);
        setEvent(currentEvent.title);
        handleGenerate();
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `Certificate_${attendee.replace(/\s+/g, '_')}_${certId}.png`;
        link.href = canvasRef.current.toDataURL('image/png', 1.0);
        link.click();
        showToast('Certificate downloaded!', 'success');
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="page-hero anim-fade-down" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 25px rgba(56,189,248,0.4)', flexShrink: 0 }}>
                            <i className="fas fa-qrcode" style={{ color: '#fff', fontSize: '1.6rem' }}></i>
                        </div>
                        <div>
                            <h1 className="page-hero-title">Live Gate QR Scanner & Certificates</h1>
                            <p className="page-hero-sub">Scan attendee digital QR passes at event entrance with real-time check-in tracking & instant certificate issuing</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>Select Active Event:</label>
                        <select
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            style={{
                                background: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(56, 189, 248, 0.4)',
                                color: '#f8fafc',
                                padding: '10px 16px',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                outline: 'none'
                            }}>
                            {SAMPLE_EVENTS.map((e) => (
                                <option key={e.id} value={e.id}>{e.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div className="card-glass" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-users" style={{ color: '#38bdf8', fontSize: '1.2rem' }}></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Total Registered</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>{eventPasses.length} Guests</div>
                    </div>
                </div>

                <div className="card-glass" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(74, 222, 128, 0.15)', border: '1px solid rgba(74, 222, 128, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-check-double" style={{ color: '#4ade80', fontSize: '1.2rem' }}></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Door Checked-In</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4ade80' }}>{checkedInCount} / {eventPasses.length} In</div>
                    </div>
                </div>

                <div className="card-glass" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-location-dot" style={{ color: '#c084fc', fontSize: '1.2rem' }}></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Event Venue</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{currentEvent.venue}</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>

                <div className="card-glass anim-slide-left" style={{ padding: '28px', borderRadius: '20px', border: '1.5px solid rgba(56, 189, 248, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 800 }}>
                            <i className="fas fa-camera text-indigo"></i> Real Event Gate Scanner
                        </h3>
                        <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.3)', fontWeight: 700 }}>
                            LIVE GATE READY
                        </span>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', margin: '0 0 20px', fontSize: '0.88rem' }}>
                        Scan guest digital QR badges at venue door. Verified guests automatically update real-time check-in stats.
                    </p>

                    <div style={{
                        background: 'rgba(5, 11, 26, 0.85)',
                        border: '2px solid rgba(56, 189, 248, 0.5)',
                        borderRadius: '16px',
                        padding: '24px',
                        textAlign: 'center',
                        marginBottom: '20px',
                        position: 'relative',
                        minHeight: 180,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {scanning && <div className="scanner-line"></div>}

                        {!scanning && !scanResult && (
                            <div>
                                <i className="fas fa-qrcode" style={{ fontSize: '3.5rem', color: '#38bdf8', marginBottom: '12px', display: 'block' }}></i>
                                <p style={{ color: '#e2e8f0', fontSize: '0.92rem', fontWeight: 600, margin: '0 0 4px' }}>Ready for Gate Pass Scan</p>
                                <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: 0 }}>Select a sample QR pass below or enter badge code</p>
                            </div>
                        )}

                        {scanning && (
                            <div>
                                <div style={{ width: 44, height: 44, border: '3.5px solid rgba(56,189,248,0.3)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }}></div>
                                <p style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Verifying Gate Pass Code...</p>
                            </div>
                        )}

                        {scanResult && !scanning && (
                            <div className="anim-scale-in" style={{ width: '100%' }}>
                                {scanResult.valid ? (
                                    <div style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.4)', padding: '16px', borderRadius: '14px' }}>
                                        <div style={{ fontSize: '2.4rem', color: '#4ade80', marginBottom: '4px' }}><i className="fas fa-circle-check"></i></div>
                                        <h4 style={{ color: '#4ade80', margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 800 }}>ENTRY GRANTED • VERIFIED</h4>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(15, 23, 42, 0.8)', padding: '12px', borderRadius: '12px', textAlign: 'left', marginTop: '12px' }}>
                                            <img src={scanResult.pass.avatar} alt="Avatar" style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #4ade80' }} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>{scanResult.pass.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{scanResult.pass.email} • Seat: {scanResult.pass.seat}</div>
                                                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                                                    <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>{scanResult.pass.tier}</span>
                                                    <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '2px 8px', borderRadius: '8px' }}>Checked in at {scanResult.pass.time}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleAutoFillCert(scanResult.pass)}
                                            style={{
                                                marginTop: '14px',
                                                padding: '8px 16px',
                                                borderRadius: '10px',
                                                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                                                border: 'none',
                                                color: '#000',
                                                fontWeight: 800,
                                                fontSize: '0.82rem',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                            <i className="fas fa-award"></i> Auto-Fill & Issue Certificate
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '16px', borderRadius: '14px' }}>
                                        <div style={{ fontSize: '2.4rem', color: '#ef4444', marginBottom: '4px' }}><i className="fas fa-circle-xmark"></i></div>
                                        <h4 style={{ color: '#ef4444', margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 800 }}>ACCESS DENIED</h4>
                                        <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: 0 }}>QR code "{scanResult.code}" is not registered for {currentEvent.title}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>Tap Sample Registered Pass to Test Gate Scan:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {eventPasses.map((p) => (
                                <button
                                    key={p.qr}
                                    onClick={() => {
                                        setInputQR(p.qr);
                                        processScan(p.qr);
                                    }}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '10px',
                                        background: p.checkedIn ? 'rgba(74, 222, 128, 0.15)' : 'rgba(56, 189, 248, 0.12)',
                                        border: p.checkedIn ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(56, 189, 248, 0.3)',
                                        color: p.checkedIn ? '#4ade80' : '#38bdf8',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
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
                                placeholder="Scan/Type QR Code (e.g. GATH-VIP-88219)"
                                className="form-input"
                                style={{ flex: 1 }}
                                required
                            />
                            <button type="submit" disabled={scanning} className="btn btn-primary" style={{ borderRadius: '10px', padding: '0 20px' }}>
                                {scanning ? (
                                    <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>
                                ) : (
                                    <i className="fas fa-barcode"></i>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="card-glass anim-slide-right" style={{ padding: '28px', borderRadius: '20px' }}>
                    <h3 style={{ margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 800 }}>
                        <i className="fas fa-certificate text-amber"></i> Issue Official Certificate
                    </h3>

                    {[
                        { label: 'Attendee Name', val: attendee, set: setAttendee },
                        { label: 'Event Name', val: event, set: setEvent },
                        { label: 'Issuing Organization', val: org, set: setOrg },
                    ].map(({ label, val, set }) => (
                        <div key={label} style={{ marginBottom: '14px' }}>
                            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>{label}</label>
                            <input type="text" value={val} onChange={(e) => set(e.target.value)} className="form-input" />
                        </div>
                    ))}

                    <button
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                            border: 'none',
                            color: '#000',
                            boxShadow: '0 4px 20px rgba(251,191,36,0.35)',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            padding: '12px',
                            cursor: 'pointer'
                        }}
                        onClick={handleGenerate}>
                        <i className="fas fa-magic" style={{ marginRight: '8px' }}></i> Generate Gold Certificate
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '24px' }} className="card-glass">
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-clock-rotate-left text-sky"></i> Live Gate Check-in Feed Log
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Real-time updates</span>
                </div>

                <div style={{ padding: '16px 24px', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                                <th style={{ padding: '10px' }}>Timestamp</th>
                                <th style={{ padding: '10px' }}>Attendee Name</th>
                                <th style={{ padding: '10px' }}>Event Name</th>
                                <th style={{ padding: '10px' }}>Ticket Tier</th>
                                <th style={{ padding: '10px' }}>Gate Door</th>
                                <th style={{ padding: '10px' }}>Verification</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gateLog.map((log, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#f8fafc' }}>
                                    <td style={{ padding: '12px 10px', color: '#38bdf8', fontWeight: 600 }}>{log.time}</td>
                                    <td style={{ padding: '12px 10px', fontWeight: 700 }}>{log.name}</td>
                                    <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>{log.eventTitle}</td>
                                    <td style={{ padding: '12px 10px' }}>
                                        <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>{log.tier}</span>
                                    </td>
                                    <td style={{ padding: '12px 10px', color: '#94a3b8' }}>{log.gate}</td>
                                    <td style={{ padding: '12px 10px' }}>
                                        <span style={{ color: '#4ade80', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <i className="fas fa-circle-check"></i> {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {generated && (
                <div className="anim-scale-in" style={{ marginTop: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fas fa-eye text-amber"></i> Certificate Preview
                        </h3>
                        <button className="btn btn-primary" onClick={handleDownload}
                            style={{ background: 'linear-gradient(135deg, #34d399, #059669)', border: 'none', borderRadius: '12px', padding: '10px 22px', fontWeight: 700, boxShadow: '0 4px 20px rgba(52,211,153,0.35)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-download"></i> Download PNG
                        </button>
                    </div>

                    <div style={{ borderRadius: '18px', overflow: 'hidden', boxShadow: '0 0 60px rgba(251,191,36,0.22), 0 20px 60px rgba(0,0,0,0.7)', border: '1px solid rgba(251,191,36,0.2)', background: '#0a0c1b' }}>
                        <canvas
                            ref={canvasRef}
                            width={900}
                            height={560}
                            style={{ display: 'block', width: '100%', height: 'auto' }}
                        />
                    </div>

                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '12px' }}>
                        <i className="fas fa-info-circle" style={{ marginRight: '6px' }}></i>
                        High-resolution 900×560 PNG certificate — edit the fields above to update the preview live
                    </p>
                </div>
            )}
        </div>
    );
};

export default QrCertificates;
