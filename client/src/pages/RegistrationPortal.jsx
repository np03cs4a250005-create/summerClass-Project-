import React, { useState, useEffect } from 'react';
import { registrationsAPI } from '../services/api';
import { useToast } from '../components/Toast';

const RegistrationPortal = () => {
    const [regs, setRegs] = useState([]); const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const load = async () => { try { setLoading(true); const res = await registrationsAPI.getAll(); setRegs(res.data); } catch { showToast('Failed to load','error'); } finally { setLoading(false); } };
    useEffect(() => { load(); }, []);

    const handleApprove = async (id) => { try { await registrationsAPI.approve(id); showToast('Registration approved!','success'); load(); } catch { showToast('Failed to approve','error'); } };

    return (
        <div>
            <h2>Registration Approval Portal</h2>
            {loading ? <p style={{ marginTop:'20px' }}>Loading registrations...</p> : (
                <div className="panel-body card-glass table-panel" style={{ marginTop:'20px' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                        <thead><tr>{['Attendee','Event','Amount','Status','Action'].map(h => <th key={h} style={{ textAlign:'left', padding:'12px', borderBottom:'1px solid var(--border-color)' }}>{h}</th>)}</tr></thead>
                        <tbody>
                            {regs.map(r => (
                                <tr key={r.id} style={{ borderBottom:'1px solid var(--border-color)' }}>
                                    <td style={{ padding:'12px' }}>{r.attendeeName || 'Unknown'}</td>
                                    <td style={{ padding:'12px' }}>{r.eventName || 'General Event'}</td>
                                    <td style={{ padding:'12px' }}>${r.amount}</td>
                                    <td style={{ padding:'12px' }}><span className={`badge ${r.status==='Confirmed'?'badge-success':'badge-secondary'}`}>{r.status}</span></td>
                                    <td style={{ padding:'12px' }}>
                                        {r.status === 'Pending' ? <button className="btn btn-primary btn-sm" onClick={() => handleApprove(r.id)}>Approve</button> : <span style={{ color:'var(--success)', fontWeight:'bold' }}><i className="fas fa-check"></i> Approved</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RegistrationPortal;
