import React, { useState } from 'react';
import { useToast } from '../components/Toast';
const GamificationFiles = () => {
    const leaderboard = [{ name: 'Ramesh Adhikari', points: 450, badge: 'Gold Volunteer' }];
    const files = [{ id: 'f-1', name: 'event_brochure.pdf', size: '2.4 MB' }, { id: 'f-2', name: 'venue_blueprint.png', size: '5.1 MB' }];
    const { showToast } = useToast();
    return (
        <div>
            <h2>Gamification & Media Assets Directory</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'20px', marginTop:'20px' }}>
                <div className="card-glass" style={{ padding:'24px' }}>
                    <h3><i className="fas fa-trophy text-amber"></i> Volunteer Points Leaderboard</h3>
                    {leaderboard.map((u, i) => (<div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'15px', padding:'12px', background:'rgba(255,255,255,0.03)', borderRadius:'8px' }}><div><strong>{u.name}</strong><p style={{ fontSize:'0.8rem', color:'var(--accent)' }}>{u.badge}</p></div><span className="badge badge-success">{u.points} pts</span></div>))}
                </div>
                <div className="card-glass" style={{ padding:'24px' }}>
                    <h3><i className="fas fa-folder-open text-indigo"></i> Event File Storage</h3>
                    {files.map(f => (<div key={f.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'15px', padding:'12px', background:'rgba(255,255,255,0.03)', borderRadius:'8px' }}><span><i className="fas fa-file-pdf text-indigo" style={{ marginRight:'8px' }}></i>{f.name}</span><span style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{f.size}</span></div>))}
                </div>
            </div>
        </div>
    );
};
export default GamificationFiles;
