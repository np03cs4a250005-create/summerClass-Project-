import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendeesAPI, emailAPI } from '../services/api';
import { useToast } from '../components/Toast';

const AVATAR_COLORS = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#10b981,#34d399)',
    'linear-gradient(135deg,#f59e0b,#fbbf24)',
    'linear-gradient(135deg,#ef4444,#f87171)',
    'linear-gradient(135deg,#3b82f6,#60a5fa)',
    'linear-gradient(135deg,#ec4899,#f472b6)',
    'linear-gradient(135deg,#14b8a6,#2dd4bf)',
];

const Attendees = () => {
    const [attendees, setAttendees] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [emailModal, setEmailModal] = useState(null); // { email, name }
    const [emailSubject, setEmailSubject] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [emailSending, setEmailSending] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const load = async () => {
        try { setLoading(true); const res = await attendeesAPI.getAll(); setAttendees(res.data); }
        catch { showToast('Failed to load', 'error'); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await attendeesAPI.create({ name, email, phone });
            showToast('Attendee registered!', 'success');
            setIsModalOpen(false); setName(''); setEmail(''); setPhone('');
            load();
        } catch { showToast('Failed', 'error'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove attendee?')) return;
        try { await attendeesAPI.delete(id); showToast('Attendee removed', 'info'); load(); }
        catch { showToast('Failed', 'error'); }
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setEmailSending(true);
        try {
            const res = await emailAPI.send({ to: emailModal.email, subject: emailSubject, message: emailMsg });
            showToast(res.data.simulated ? `Email simulated to ${emailModal.name}!` : `Email sent to ${emailModal.name}!`, 'success');
            setEmailModal(null); setEmailSubject(''); setEmailMsg('');
        } catch { showToast('Failed to send email', 'error'); }
        finally { setEmailSending(false); }
    };

    const exportCSV = () => {
        let csv = 'ID,Name,Email,Phone,Status\n';
        attendees.forEach(a => { csv += `"${a.id}","${a.name}","${a.email}","${a.phone}","${a.status}"\n`; });
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'attendees.csv'; a.click();
        showToast('CSV downloaded!', 'success');
    };

    const filtered = attendees.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Hero */}
            <div className="page-hero anim-fade-down">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(16,185,129,0.4)', flexShrink: 0, animation: 'floatUpDown 3.2s ease-in-out infinite' }}>
                        <i className="fas fa-users" style={{ color: '#fff', fontSize: '1.4rem' }}></i>
                    </div>
                    <div>
                        <h1 className="page-hero-title">Attendee Registry</h1>
                        <p className="page-hero-sub">{filtered.length} registered profiles — manage, search and export</p>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="anim-fade-up" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', borderRadius: '10px', padding: '0 14px', minWidth: '260px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <i className="fas fa-search" style={{ color: 'var(--text-secondary)', marginRight: '10px' }}></i>
                    <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', padding: '12px 0', fontSize: '0.9rem' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary" onClick={exportCSV}><i className="fas fa-file-csv"></i> Export CSV</button>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><i className="fas fa-plus"></i> Add Attendee</button>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[0,1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 60, borderRadius: '10px' }}></div>)}
                </div>
            ) : (
                <div className="panel-body card-glass table-panel anim-fade-up" style={{ animationDelay: '100ms', borderRadius: '16px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(99,102,241,0.08)' }}>
                                {['Attendee', 'Email', 'Phone', 'Status', 'Action'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', padding: '14px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((a, i) => {
                                const initials = a.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                const avatarBg = AVATAR_COLORS[i % AVATAR_COLORS.length];
                                return (
                                    <tr key={a.id} className="anim-slide-left" style={{ animationDelay: `${i * 50}ms`, borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: 38, height: 38, borderRadius: '50%', background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#fff', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{initials}</div>
                                                <strong style={{ fontSize: '0.9rem' }}>{a.name}</strong>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{a.email}</td>
                                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{a.phone}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span className={`badge ${a.status === 'Approved' ? 'badge-success' : 'badge-secondary'}`} style={{ borderRadius: '999px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700 }}>{a.status}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button className="btn-icon" title={`Issue Official Certificate for ${a.name}`} onClick={() => navigate(`/qr?attendeeName=${encodeURIComponent(a.name)}`)}>
                                                    <i className="fas fa-award text-amber"></i>
                                                </button>
                                                {a.email && (
                                                    <button className="btn-icon" title={`Email ${a.name}`} onClick={() => { setEmailModal({ email: a.email, name: a.name }); setEmailSubject(''); setEmailMsg(''); }}>
                                                        <i className="fas fa-envelope text-info"></i>
                                                    </button>
                                                )}
                                                <button className="btn-icon" onClick={() => handleDelete(a.id)} title="Remove">
                                                    <i className="far fa-trash-alt text-danger"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            <i className="fas fa-search" style={{ fontSize: '2rem', marginBottom: '12px', display: 'block', opacity: 0.3 }}></i>
                            No attendees match your search
                        </div>
                    )}
                </div>
            )}

            {/* Add Attendee Modal */}
            {isModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-box card-glass anim-scale-in" style={{ maxWidth: '450px' }}>
                        <div className="modal-header"><h2>Register Attendee</h2><button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>&times;</button></div>
                        <form onSubmit={handleCreate} style={{ padding: '15px 0' }}>
                            <div className="input-group"><label>Full Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className="form-input" /></div>
                            <div className="input-group" style={{ marginTop: '10px' }}><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="form-input" /></div>
                            <div className="input-group" style={{ marginTop: '10px' }}><label>Phone</label><input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="form-input" /></div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Email Individual Modal */}
            {emailModal && (
                <div className="modal-overlay active">
                    <div className="modal-box card-glass anim-scale-in" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2><i className="fas fa-envelope text-info" style={{ marginRight: '10px' }}></i>Email {emailModal.name}</h2>
                            <button className="modal-close-btn" onClick={() => setEmailModal(null)}>&times;</button>
                        </div>
                        <form onSubmit={handleSendEmail} style={{ padding: '15px 0' }}>
                            <div style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', fontSize: '0.84rem', color: '#38bdf8' }}>
                                <i className="fas fa-paper-plane" style={{ marginRight: '6px' }}></i>To: <strong>{emailModal.email}</strong>
                            </div>
                            <div className="input-group"><label>Subject</label><input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} required className="form-input" placeholder="Email subject..." /></div>
                            <div className="input-group" style={{ marginTop: '12px' }}><label>Message</label><textarea value={emailMsg} onChange={e => setEmailMsg(e.target.value)} required className="form-textarea" rows="5" placeholder="Your message..."></textarea></div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setEmailModal(null)}>Cancel</button>
                                <button type="submit" disabled={emailSending} className="btn btn-primary">
                                    {emailSending ? <><span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginRight: '8px', verticalAlign: 'middle' }}></span>Sending...</> : <><i className="fas fa-paper-plane" style={{ marginRight: '6px' }}></i>Send Email</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendees;
