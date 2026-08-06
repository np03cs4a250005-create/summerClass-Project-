import React, { useState } from 'react';
import { useToast } from '../components/Toast';

const QrCertificates = () => {
    const [attendee, setAttendee] = useState('Jane Doe');
    const [event, setEvent] = useState('Global Tech Conference 2026');
    const [certId, setCertId] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [inputQR, setInputQR] = useState('');
    const { showToast } = useToast();

    const handleGenerate = () => {
        const id = `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        setCertId(id);
        showToast(`Certificate issued — ${id}`, 'success');
    };

    const handleScan = (e) => {
        e.preventDefault();
        setScanning(true);
        setScanResult(null);
        setTimeout(() => {
            setScanning(false);
            if (inputQR.startsWith('QR-')) {
                setScanResult({ valid: true, name: 'Michael Chen', ticket: 'VIP', event: 'Global Tech 2026' });
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
                    <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1, #c084fc)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(99,102,241,0.4)', flexShrink: 0, animation: 'floatUpDown 3s ease-in-out infinite' }}>
                        <i className="fas fa-qrcode" style={{ color: '#fff', fontSize: '1.4rem' }}></i>
                    </div>
                    <div>
                        <h1 className="page-hero-title">QR Verification & Certificates</h1>
                        <p className="page-hero-sub">Scan attendee QR codes and issue digital participation certificates</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '8px' }}>

                {/* QR Scanner */}
                <div className="card-glass anim-slide-left" style={{ padding: '28px', borderRadius: '18px', animationDelay: '100ms' }}>
                    <h3 style={{ margin: '0 0 16px' }}>
                        <i className="fas fa-camera text-indigo" style={{ marginRight: '10px' }}></i>QR Badge Scanner
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', margin: '0 0 20px', fontSize: '0.88rem' }}>Enter an attendee QR code to verify their identity at the gate.</p>

                    {/* Animated Scanner Box */}
                    <div className="scanner-container" style={{ background: 'rgba(0,0,0,0.4)', border: '2px solid var(--primary)', borderRadius: '14px', padding: '30px', textAlign: 'center', marginBottom: '20px', position: 'relative', minHeight: 140 }}>
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
                                        <div style={{ fontSize: '2.5rem', color: '#34d399', marginBottom: '8px', animation: 'popIn 0.5s ease' }}>
                                            <i className="fas fa-check-circle"></i>
                                        </div>
                                        <h4 style={{ color: '#34d399', margin: '0 0 6px' }}>VERIFIED</h4>
                                        <p style={{ fontSize: '0.84rem', margin: '4px 0', fontWeight: 600 }}>{scanResult.name}</p>
                                        <span className="badge badge-success">{scanResult.ticket} Tier</span>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ fontSize: '2.5rem', color: '#ef4444', marginBottom: '8px', animation: 'popIn 0.5s ease' }}><i className="fas fa-times-circle"></i></div>
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

                {/* Certificate Issuer */}
                <div className="card-glass anim-slide-right" style={{ padding: '28px', borderRadius: '18px', animationDelay: '150ms' }}>
                    <h3 style={{ margin: '0 0 16px' }}>
                        <i className="fas fa-certificate text-amber" style={{ marginRight: '10px' }}></i>Issue Certificate
                    </h3>
                    <div className="input-group" style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Attendee Name</label>
                        <input type="text" value={attendee} onChange={e => setAttendee(e.target.value)} className="form-input" />
                    </div>
                    <div className="input-group" style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Event Name</label>
                        <input type="text" value={event} onChange={e => setEvent(e.target.value)} className="form-input" />
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 15px rgba(251,191,36,0.3)', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', border: 'none' }}
                        onClick={handleGenerate}>
                        <i className="fas fa-award" style={{ marginRight: '8px' }}></i>Generate Certificate
                    </button>

                    {/* Certificate Preview */}
                    {certId && (
                        <div className="anim-scale-in" style={{ marginTop: '24px', background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(245,158,11,0.05))', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '14px', padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)', backgroundSize: '200% 100%', animation: 'shimmerSlide 2s infinite' }}></div>
                            <i className="fas fa-award" style={{ fontSize: '2.5rem', color: '#fbbf24', marginBottom: '12px', display: 'block', filter: 'drop-shadow(0 0 10px rgba(251,191,36,0.5))' }}></i>
                            <p style={{ fontSize: '0.72rem', letterSpacing: '2px', color: 'var(--text-muted)', margin: '0 0 8px', textTransform: 'uppercase' }}>Certificate of Participation</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 4px' }}>This certifies that</p>
                            <h3 style={{ margin: '6px 0', fontSize: '1.2rem', color: '#fbbf24', fontWeight: 800 }}>{attendee}</h3>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0 12px' }}>successfully attended</p>
                            <p style={{ fontWeight: 700, margin: '0 0 16px' }}>{event}</p>
                            <code style={{ fontSize: '0.76rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '6px' }}>{certId}</code>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QrCertificates;
