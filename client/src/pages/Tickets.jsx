import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketsAPI, registrationsAPI } from '../services/api';
import { useToast } from '../components/Toast';

const TIER_CONFIG = {
    VIP: { gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)', glow: 'rgba(251,191,36,0.5)', icon: 'fa-crown', badge: 'GOLD VIP' },
    Premium: { gradient: 'linear-gradient(135deg, #38bdf8, #0284c7)', glow: 'rgba(56,189,248,0.5)', icon: 'fa-star', badge: 'SILVER ALL-ACCESS' },
    Standard: { gradient: 'linear-gradient(135deg, #818cf8, #6366f1)', glow: 'rgba(129,140,248,0.5)', icon: 'fa-ticket-alt', badge: 'STANDARD ADMISSION' },
};

const DEFAULT_TICKETS = [
    { id: 'tkt-1', eventId: 'ev-1', eventName: 'Global Tech Conference 2026', name: 'VIP Access Pass', type: 'VIP', price: 399, capacity: 50, qrCode: 'GATH-VIP-88219' },
    { id: 'tkt-2', eventId: 'ev-1', eventName: 'Global Tech Conference 2026', name: 'Premium All-Access', type: 'Premium', price: 199, capacity: 100, qrCode: 'GATH-PREM-44102' },
    { id: 'tkt-3', eventId: 'ev-2', eventName: 'Creative Design Summit', name: 'Standard General Pass', type: 'Standard', price: 79, capacity: 250, qrCode: 'GATH-STD-19302' },
];

const downloadPassBlob = (refCode, name, eventName, ticketType, qrCode) => {
    const passText = `=================================================\n` +
        `       GATHERLY ENTERPRISE EVENT PASS           \n` +
        `=================================================\n\n` +
        `RESERVATION CODE: ${refCode}\n` +
        `ATTENDEE NAME   : ${name}\n` +
        `EVENT           : ${eventName}\n` +
        `TICKET TIER     : ${ticketType}\n` +
        `QR BADGE CODE   : ${qrCode}\n` +
        `STATUS          : RESERVED & CONFIRMED\n` +
        `ISSUED DATE     : ${new Date().toLocaleString()}\n\n` +
        `=================================================\n` +
        `Please present this digital pass or QR badge code \n` +
        `at the venue gate scanner for entry verification.\n` +
        `=================================================\n`;
    
    const blob = new Blob([passText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Event_Pass_${refCode}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const QRCode = ({ code }) => {
    const [scanning, setScanning] = useState(false);
    return (
        <div
            className="scanner-container"
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease', marginTop: '16px' }}
            onClick={() => setScanning(s => !s)}
            onMouseEnter={() => setScanning(true)}
            onMouseLeave={() => setScanning(false)}
            title="Hover to simulate gate scanner"
        >
            {scanning && <div className="scanner-line"></div>}
            <i className="fas fa-qrcode" style={{ fontSize: '2.8rem', color: '#38bdf8', marginBottom: '8px', display: 'block', transition: 'all 0.3s', transform: scanning ? 'scale(1.1)' : 'scale(1)', filter: scanning ? `drop-shadow(0 0 12px #38bdf8)` : 'none' }}></i>
            <p style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#94a3b8', marginTop: '6px', wordBreak: 'break-all' }}>{code}</p>
            <p style={{ fontSize: '0.72rem', color: scanning ? '#38bdf8' : '#64748b', marginTop: '4px', fontWeight: 600 }}>
                {scanning ? 'SCANNER ACTIVE' : 'Hover to view QR'}
            </p>
        </div>
    );
};

const TicketCard = ({ t, idx, onReserveClick }) => {
    const config = TIER_CONFIG[t.type] || TIER_CONFIG.Standard;
    const [flipped, setFlipped] = useState(false);

    return (
        <div className="anim-fade-up" style={{ animationDelay: `${idx * 100}ms`, perspective: '1000px' }}>
            <div style={{ position: 'relative', transition: 'transform 0.6s', transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', minHeight: '340px' }}>
                {/* Front */}
                <div style={{ position: 'absolute', width: '100%', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                    <div className="blue-card-glass shimmer-card" style={{ borderRadius: '20px', overflow: 'hidden', padding: 0 }}>
                        <div style={{ background: config.gradient, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2px', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase' }}>GATHERLY ENTERPRISE</span>
                                <h3 style={{ margin: '4px 0 0', color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>{t.name}</h3>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '8px', padding: '6px 12px', backdropFilter: 'blur(4px)' }}>
                                    <i className={`fas ${config.icon}`} style={{ color: '#fff', fontSize: '0.9rem', marginRight: '6px' }}></i>
                                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.82rem' }}>{config.badge}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 4px' }}>TICKET PRICE</p>
                                    <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#fff' }}>${t.price}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 4px' }}>AVAILABLE SEATS</p>
                                    <p style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#38bdf8' }}>{t.capacity}</p>
                                </div>
                            </div>

                            <QRCode code={t.qrCode} />

                            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                <button className="btn btn-secondary" style={{ flex: 1, borderRadius: '10px', padding: '10px' }} onClick={() => setFlipped(true)}>
                                    <i className="fas fa-info-circle" style={{ marginRight: '6px' }}></i>Benefits
                                </button>
                                <button className="btn blue-glow-btn" style={{ flex: 1.2, borderRadius: '10px', padding: '10px', fontWeight: 600 }} onClick={() => onReserveClick(t)}>
                                    <i className="fas fa-ticket-alt" style={{ marginRight: '6px' }}></i>Reserve Pass
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back */}
                <div style={{ position: 'absolute', width: '100%', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <div className="blue-card-glass" style={{ borderRadius: '20px', padding: '26px', minHeight: '340px', border: `1px solid ${config.glow}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
                                <i className={`fas ${config.icon}`} style={{ marginRight: '8px', color: '#38bdf8' }}></i>{config.badge} Included Benefits
                            </h3>
                            <button onClick={() => setFlipped(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {(t.type === 'VIP' ? ['Priority front-row seating', 'Exclusive executive networking dinner', 'Keynote speaker meet & greet', 'Official printed certificate + swag', 'VIP lounge access with catering']
                            : t.type === 'Premium' ? ['Reserved center seating', 'Interactive networking session', 'Verified digital badge', 'Event welcome swag bag', 'Priority fast-track check-in']
                            : ['General auditorium seating', 'Verified digital badge', 'All open track access', 'Online presentation slides']).map((b, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <i className="fas fa-check-circle" style={{ color: '#34d399', fontSize: '0.85rem' }}></i>
                                <span style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>{b}</span>
                            </div>
                        ))}

                        <button className="btn blue-glow-btn" style={{ marginTop: '20px', width: '100%', borderRadius: '10px', padding: '12px', fontWeight: 600 }} onClick={() => onReserveClick(t)}>
                            <i className="fas fa-ticket-alt" style={{ marginRight: '8px' }}></i>Reserve Ticket Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Tickets = () => {
    const [tickets, setTickets] = useState(DEFAULT_TICKETS);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    
    // Reservation Modal Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');

    // Confirmed Reservation payload
    const [confirmedReservation, setConfirmedReservation] = useState(null);

    const { showToast } = useToast();
    const navigate = useNavigate();

    const loadTickets = async () => {
        try {
            setLoading(true);
            const res = await ticketsAPI.getAll();
            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                setTickets(res.data);
            } else {
                setTickets(DEFAULT_TICKETS);
            }
        } catch {
            setTickets(DEFAULT_TICKETS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadTickets(); }, []);

    const openReservationModal = (t) => {
        setSelectedTicket(t);
        setConfirmedReservation(null);
        setName('');
        setEmail('');
        setPhone('');
        setQuantity(1);
    };

    const handleConfirmReservation = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;

        const refCode = `RES-${Math.floor(100000 + Math.random() * 900000)}`;
        const qrCode = `QR-${selectedTicket.type}-${Math.floor(1000 + Math.random() * 9000)}`;
        const totalAmount = (selectedTicket.price || 0) * quantity;

        const regData = {
            id: refCode,
            attendeeName: name,
            email: email,
            phone: phone,
            eventName: selectedTicket.eventName || 'Global Tech Conference 2026',
            ticketType: selectedTicket.type,
            ticketName: selectedTicket.name,
            quantity: quantity,
            amount: totalAmount,
            status: 'Confirmed',
            qrCode: qrCode,
            createdAt: new Date().toISOString()
        };

        try {
            await registrationsAPI.create(regData);
        } catch {
            // Local state fallback
        }

        // Decrement ticket capacity locally
        setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, capacity: Math.max(0, t.capacity - quantity) } : t));

        setConfirmedReservation(regData);
        showToast(`Ticket Reserved Successfully! Reference: ${refCode}`, 'success');
    };

    return (
        <div>
            {/* Hero Header */}
            <div className="page-hero anim-fade-down">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(37,99,235,0.4)', flexShrink: 0, animation: 'floatUpDown 3s ease-in-out infinite' }}>
                        <i className="fas fa-ticket-alt" style={{ color: '#fff', fontSize: '1.4rem' }}></i>
                    </div>
                    <div>
                        <h1 className="page-hero-title">Real Ticket Reservation & QR Badges</h1>
                        <p className="page-hero-sub">Select your ticket tier, reserve seats instantly, and download digital event passes</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="events-grid">
                    {[0,1,2].map(i => <div key={i} className="skeleton" style={{ height: 340, borderRadius: '20px' }}></div>)}
                </div>
            ) : (
                <div className="events-grid" style={{ marginTop: '16px' }}>
                    {tickets.map((t, i) => <TicketCard key={t.id || i} t={t} idx={i} onReserveClick={openReservationModal} />)}
                </div>
            )}

            {/* Real Reservation Modal */}
            {selectedTicket && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="blue-card-glass anim-scale-in" style={{ width: '100%', maxWidth: '520px', padding: '32px', borderRadius: '24px', border: '1px solid rgba(56,189,248,0.3)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-ticket-alt" style={{ color: '#38bdf8', fontSize: '1.3rem' }}></i>
                                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>Ticket Reservation</h3>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {!confirmedReservation ? (
                            <form onSubmit={handleConfirmReservation}>
                                <div style={{ background: 'rgba(15,23,42,0.8)', padding: '14px', borderRadius: '12px', marginBottom: '18px', border: '1px solid rgba(56,189,248,0.2)' }}>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>SELECTED TIER</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                        <strong style={{ color: '#fff', fontSize: '1.05rem' }}>{selectedTicket.name} ({selectedTicket.type})</strong>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>${selectedTicket.price}/pass</span>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Full Name *</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Alex Rivera" className="form-input" style={{ width: '100%', height: '42px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '10px' }} />
                                </div>

                                <div className="input-group" style={{ marginTop: '14px' }}>
                                    <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Email Address *</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="alex@techsummit.org" className="form-input" style={{ width: '100%', height: '42px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '10px' }} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
                                    <div className="input-group">
                                        <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Quantity</label>
                                        <input type="number" min="1" max="5" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} className="form-input" style={{ width: '100%', height: '42px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '10px' }} />
                                    </div>
                                    <div className="input-group">
                                        <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Payment</label>
                                        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="form-input" style={{ width: '100%', height: '42px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '10px' }}>
                                            <option value="credit_card">Credit Card ($)</option>
                                            <option value="paypal">PayPal ($)</option>
                                            <option value="comp">Complimentary VIP</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>TOTAL DUE</span>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>${(selectedTicket.price * quantity).toLocaleString()}</div>
                                    </div>
                                    <button type="submit" className="btn blue-glow-btn" style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: 600 }}>
                                        <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>Confirm & Reserve
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* Confirmed Receipt Card */
                            <div className="anim-scale-in" style={{ textAlign: 'center' }}>
                                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '2px solid #34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <i className="fas fa-check" style={{ color: '#34d399', fontSize: '2rem' }}></i>
                                </div>

                                <h4 style={{ margin: '0 0 6px', color: '#34d399', fontSize: '1.3rem', fontWeight: 800 }}>Reservation Confirmed!</h4>
                                <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>Your ticket pass is activated and ready for venue entrance.</p>

                                <div style={{ background: 'rgba(15,23,42,0.8)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(56,189,248,0.3)', margin: '20px 0', textAlign: 'left' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>REF CODE</span>
                                        <strong style={{ color: '#38bdf8' }}>{confirmedReservation.id}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>GUEST NAME</span>
                                        <strong style={{ color: '#fff' }}>{confirmedReservation.attendeeName}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>EVENT</span>
                                        <strong style={{ color: '#fff' }}>{confirmedReservation.eventName}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>TICKET TIER</span>
                                        <strong style={{ color: '#fbbf24' }}>{confirmedReservation.ticketType} ({confirmedReservation.quantity} Pass)</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>QR BADGE CODE</span>
                                        <code style={{ color: '#38bdf8', background: 'rgba(0,0,0,0.4)', padding: '2px 8px', borderRadius: '4px' }}>{confirmedReservation.qrCode}</code>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => downloadPassBlob(confirmedReservation.id, confirmedReservation.attendeeName, confirmedReservation.eventName, confirmedReservation.ticketType, confirmedReservation.qrCode)}
                                        className="btn blue-glow-btn"
                                        style={{ flex: 1, borderRadius: '12px', padding: '12px', fontWeight: 600 }}>
                                        <i className="fas fa-download" style={{ marginRight: '6px' }}></i>Download Pass
                                    </button>
                                    <button
                                        onClick={() => { setSelectedTicket(null); navigate('/registrations'); }}
                                        className="btn btn-secondary"
                                        style={{ flex: 1, borderRadius: '12px', padding: '12px' }}>
                                        <i className="fas fa-[#38bdf8]" style={{ marginRight: '6px' }}></i>View Portal
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tickets;

