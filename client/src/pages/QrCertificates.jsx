import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../components/Toast';

// ── Certificate Canvas Renderer ──────────────────────────────────────────────
function drawCertificate(canvas, { attendee, event, certId, date, org }) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // ── 1. Deep Dark Background ──────────────────────────────────────────
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0,   '#0a0c1b');
    bg.addColorStop(0.5, '#0e1128');
    bg.addColorStop(1,   '#070912');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // ── 2. Gold Radial Glow ──────────────────────────────────────────────
    const glow = ctx.createRadialGradient(W/2, H/2, 40, W/2, H/2, W*0.6);
    glow.addColorStop(0,   'rgba(251,191,36,0.12)');
    glow.addColorStop(0.5, 'rgba(245,158,11,0.05)');
    glow.addColorStop(1,   'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // ── 3. Ornate Triple Border Frame ────────────────────────────────────
    // Outermost border — gold
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 3;
    ctx.strokeRect(18, 18, W-36, H-36);

    // Middle border — lighter gold
    ctx.strokeStyle = 'rgba(251,191,36,0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(26, 26, W-52, H-52);

    // Inner thin border
    ctx.strokeStyle = 'rgba(251,191,36,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(34, 34, W-68, H-68);

    // ── 4. Corner Ornaments ──────────────────────────────────────────────
    const corners = [[40, 40], [W-40, 40], [40, H-40], [W-40, H-40]];
    corners.forEach(([cx, cy]) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;

        // Small diamond
        ctx.beginPath();
        ctx.moveTo(0, -12); ctx.lineTo(12, 0);
        ctx.lineTo(0, 12);  ctx.lineTo(-12, 0);
        ctx.closePath();
        ctx.stroke();

        // Dot center
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
        ctx.restore();
    });

    // ── 5. Top Gold Banner ───────────────────────────────────────────────
    const bannerGrad = ctx.createLinearGradient(0, 55, 0, 110);
    bannerGrad.addColorStop(0,   'rgba(251,191,36,0.18)');
    bannerGrad.addColorStop(1,   'transparent');
    ctx.fillStyle = bannerGrad;
    ctx.fillRect(50, 55, W-100, 55);

    // ── 6. Organisation Name ─────────────────────────────────────────────
    ctx.textAlign = 'center';
    ctx.font = '700 13px "Georgia", serif';
    ctx.letterSpacing = '3px';
    ctx.fillStyle = 'rgba(251,191,36,0.7)';
    ctx.fillText((org || 'GATHERLY SUITE').toUpperCase(), W/2, 82);

    // Horizontal ornament line under org
    const lineGrad = ctx.createLinearGradient(120, 0, W-120, 0);
    lineGrad.addColorStop(0,   'transparent');
    lineGrad.addColorStop(0.2, '#fbbf24');
    lineGrad.addColorStop(0.8, '#fbbf24');
    lineGrad.addColorStop(1,   'transparent');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(120, 93); ctx.lineTo(W-120, 93); ctx.stroke();

    // ── 7. "Certificate of Participation" Title ──────────────────────────
    ctx.font = 'italic 700 38px "Georgia", serif';
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = 'rgba(251,191,36,0.55)';
    ctx.shadowBlur = 20;
    ctx.fillText('Certificate of Participation', W/2, 158);
    ctx.shadowBlur = 0;

    // ── 8. "This is to certify that" ────────────────────────────────────
    ctx.font = '400 14px "Georgia", serif';
    ctx.fillStyle = 'rgba(200,200,220,0.75)';
    ctx.fillText('This is to proudly certify that', W/2, 202);

    // ── 9. Attendee Name ─────────────────────────────────────────────────
    // Name background glow
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

    // Underline below name
    const nameLineGrad = ctx.createLinearGradient(200, 0, W-200, 0);
    nameLineGrad.addColorStop(0,   'transparent');
    nameLineGrad.addColorStop(0.3, '#818cf8');
    nameLineGrad.addColorStop(0.7, '#818cf8');
    nameLineGrad.addColorStop(1,   'transparent');
    ctx.strokeStyle = nameLineGrad;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(200, 268); ctx.lineTo(W-200, 268); ctx.stroke();

    // ── 10. "has successfully participated in" ───────────────────────────
    ctx.font = '400 14px "Georgia", serif';
    ctx.fillStyle = 'rgba(200,200,220,0.75)';
    ctx.fillText('has successfully participated in', W/2, 302);

    // ── 11. Event Name ───────────────────────────────────────────────────
    ctx.font = '700 26px "Georgia", serif';
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = 'rgba(251,191,36,0.5)';
    ctx.shadowBlur = 10;
    // Word wrap if long
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

    // ── 12. Decorative center medallion ─────────────────────────────────
    const medalY = 408 + (lines.length - 1) * 34;
    // Outer ring
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

    // Star inside
    ctx.save();
    ctx.translate(W/2, medalY);
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = 'rgba(251,191,36,0.9)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const ang = (i * 4 * Math.PI / 5) - Math.PI / 2;
        const r = i === 0 ? 20 : 20;
        if (i === 0) ctx.moveTo(Math.cos(ang)*20, Math.sin(ang)*20);
        else ctx.lineTo(Math.cos(ang)*20, Math.sin(ang)*20);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.shadowBlur = 0;

    // ── 13. Date + Cert ID ───────────────────────────────────────────────
    const infoY = medalY + 55;
    ctx.font = '400 12px "Georgia", serif';
    ctx.fillStyle = 'rgba(160,160,180,0.75)';
    ctx.fillText(`Issued: ${date}`, W/2 - 120, infoY);
    ctx.fillText(`Cert ID: ${certId}`, W/2 + 80, infoY);

    // ── 14. Signature Lines ──────────────────────────────────────────────
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

    // ── 15. Bottom ornament bar ──────────────────────────────────────────
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

// ── Main Page ────────────────────────────────────────────────────────────────
const QrCertificates = () => {
    const [attendee, setAttendee]   = useState('Sita Rai');
    const [event,    setEvent]      = useState('Global Tech Conference 2026');
    const [org,      setOrg]        = useState('Gatherly Suite Nepal');
    const [certId,   setCertId]     = useState(null);
    const [generated, setGenerated] = useState(false);
    const [scanning,  setScanning]  = useState(false);
    const [scanResult,setScanResult]= useState(null);
    const [inputQR,   setInputQR]   = useState('');
    const canvasRef = useRef(null);
    const { showToast } = useToast();

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Redraw whenever fields change (after first generation)
    useEffect(() => {
        if (!generated || !canvasRef.current) return;
        drawCertificate(canvasRef.current, { attendee, event, org, certId, date: today });
    }, [attendee, event, org, certId, generated]);

    const handleGenerate = () => {
        const id = `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        setCertId(id);
        setGenerated(true);
        showToast(`Certificate issued — ${id}`, 'success');
        // Draw on next tick after canvas mounts
        setTimeout(() => {
            if (canvasRef.current) {
                drawCertificate(canvasRef.current, { attendee, event, org, certId: id, date: today });
            }
        }, 60);
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `Certificate_${attendee.replace(/\s+/g, '_')}_${certId}.png`;
        link.href = canvasRef.current.toDataURL('image/png', 1.0);
        link.click();
        showToast('Certificate downloaded!', 'success');
    };

    const handleScan = (e) => {
        e.preventDefault();
        setScanning(true);
        setScanResult(null);
        setTimeout(() => {
            setScanning(false);
            if (inputQR.startsWith('QR-')) {
                setScanResult({ valid: true, name: 'Anil Bajracharya', ticket: 'VIP', event: 'Global Tech 2026' });
                showToast('Attendee verified successfully!', 'success');
            } else {
                setScanResult({ valid: false });
                showToast('Invalid QR code', 'error');
            }
        }, 2000);
    };

    return (
        <div>
            {/* Hero */}
            <div className="page-hero anim-fade-down">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(251,191,36,0.4)', flexShrink: 0, animation: 'floatUpDown 3s ease-in-out infinite' }}>
                        <i className="fas fa-award" style={{ color: '#fff', fontSize: '1.4rem' }}></i>
                    </div>
                    <div>
                        <h1 className="page-hero-title">QR Verification &amp; Certificates</h1>
                        <p className="page-hero-sub">Issue stunning downloadable certificates and scan attendee QR codes at the gate</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px', marginTop: '8px' }}>

                {/* ── QR Scanner ── */}
                <div className="card-glass anim-slide-left" style={{ padding: '28px', borderRadius: '18px' }}>
                    <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-camera text-indigo"></i> QR Badge Scanner
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', margin: '0 0 20px', fontSize: '0.88rem' }}>Enter an attendee QR code to verify their identity at the gate.</p>

                    <div style={{ background: 'rgba(0,0,0,0.4)', border: '2px solid var(--primary)', borderRadius: '14px', padding: '30px', textAlign: 'center', marginBottom: '20px', position: 'relative', minHeight: 140 }}>
                        {scanning && <div className="scanner-line"></div>}
                        {!scanning && !scanResult && (
                            <div style={{ animation: 'floatUpDown 2s ease-in-out infinite' }}>
                                <i className="fas fa-camera" style={{ fontSize: '3rem', color: 'var(--primary)', display: 'block', marginBottom: '10px' }}></i>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Ready for QR input...</p>
                            </div>
                        )}
                        {scanning && (
                            <div style={{ paddingTop: '20px' }}>
                                <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }}></div>
                                <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.88rem' }}>Verifying QR code...</p>
                            </div>
                        )}
                        {scanResult && !scanning && (
                            <div className="anim-scale-in">
                                {scanResult.valid ? (
                                    <>
                                        <div style={{ fontSize: '2.5rem', color: '#34d399', marginBottom: '8px' }}><i className="fas fa-check-circle"></i></div>
                                        <h4 style={{ color: '#34d399', margin: '0 0 6px' }}>VERIFIED</h4>
                                        <p style={{ fontSize: '0.84rem', margin: '4px 0', fontWeight: 600 }}>{scanResult.name}</p>
                                        <span className="badge badge-success">{scanResult.ticket} Tier</span>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ fontSize: '2.5rem', color: '#ef4444', marginBottom: '8px' }}><i className="fas fa-times-circle"></i></div>
                                        <h4 style={{ color: '#ef4444', margin: 0 }}>INVALID QR</h4>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleScan}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input type="text" value={inputQR} onChange={e => setInputQR(e.target.value)} placeholder="Enter QR code (e.g. QR-ABC123)" className="form-input" style={{ flex: 1 }} required />
                            <button type="submit" disabled={scanning} className="btn btn-primary" style={{ borderRadius: '10px' }}>
                                {scanning ? <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span> : <i className="fas fa-search"></i>}
                            </button>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Tip: Try "QR-TEST001" for a valid scan demo</p>
                    </form>
                </div>

                {/* ── Certificate Issuer ── */}
                <div className="card-glass anim-slide-right" style={{ padding: '28px', borderRadius: '18px' }}>
                    <h3 style={{ margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-certificate text-amber"></i> Issue Certificate
                    </h3>

                    {[
                        { label: 'Attendee Name', val: attendee, set: setAttendee },
                        { label: 'Event Name',    val: event,    set: setEvent },
                        { label: 'Organisation',  val: org,      set: setOrg },
                    ].map(({ label, val, set }) => (
                        <div key={label} style={{ marginBottom: '14px' }}>
                            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>{label}</label>
                            <input type="text" value={val} onChange={e => set(e.target.value)} className="form-input" />
                        </div>
                    ))}

                    <button className="btn btn-primary" style={{ width: '100%', borderRadius: '10px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', border: 'none', boxShadow: '0 4px 20px rgba(251,191,36,0.35)', fontWeight: 700, fontSize: '0.95rem', padding: '12px' }}
                        onClick={handleGenerate}>
                        <i className="fas fa-magic" style={{ marginRight: '8px' }}></i>Generate Certificate
                    </button>
                </div>
            </div>

            {/* ── Certificate Preview + Download ── */}
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

                    {/* Canvas Certificate */}
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
