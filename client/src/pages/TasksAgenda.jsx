import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import { useToast } from '../components/Toast';

const TasksAgenda = () => {
    const [tasks, setTasks] = useState([]); const [agenda, setAgenda] = useState([]); const [loading, setLoading] = useState(true); const [newTitle, setNewTitle] = useState('');
    const { showToast } = useToast();

    const load = async () => { try { setLoading(true); const res = await tasksAPI.getAll(); setTasks(res.data.tasks); setAgenda(res.data.agenda); } catch { showToast('Failed to load','error'); } finally { setLoading(false); } };
    useEffect(() => { load(); }, []);

    const handleAdd = async (e) => { e.preventDefault(); try { await tasksAPI.create({ title: newTitle, assignee: 'Staff' }); showToast('Task added!','success'); setNewTitle(''); load(); } catch { showToast('Failed','error'); } };

    return (
        <div>
            <h2>Master Agenda & Team Checklist</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'20px', marginTop:'20px' }}>
                <div className="card-glass" style={{ padding:'24px' }}>
                    <h3>Team Tasks</h3>
                    <form onSubmit={handleAdd} style={{ display:'flex', gap:'8px', margin:'15px 0' }}>
                        <input type="text" placeholder="New task title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} required className="form-input" />
                        <button type="submit" className="btn btn-primary btn-sm">Add</button>
                    </form>
                    {loading ? <p>Loading tasks...</p> : tasks.map(t => (
                        <div key={t.id} style={{ padding:'12px', background:'rgba(255,255,255,0.03)', borderRadius:'8px', marginBottom:'8px' }}>
                            <strong>{t.title}</strong>
                            <p style={{ fontSize:'0.8rem', color:'var(--text-secondary)', marginTop:'4px' }}>Assignee: {t.assignee}</p>
                            <div style={{ background:'rgba(255,255,255,0.1)', height:'6px', borderRadius:'3px', marginTop:'8px', overflow:'hidden' }}>
                                <div style={{ width:`${t.progress}%`, background:'var(--primary)', height:'100%' }}></div>
                            </div>
                            <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', float:'right' }}>{t.progress}%</span>
                        </div>
                    ))}
                </div>
                <div className="card-glass" style={{ padding:'24px' }}>
                    <h3>Master Event Agenda</h3>
                    <div style={{ marginTop:'15px' }}>
                        {agenda.map(ag => (
                            <div key={ag.id} style={{ borderLeft:'3px solid var(--accent)', paddingLeft:'12px', marginBottom:'15px' }}>
                                <span style={{ fontSize:'0.8rem', color:'var(--accent)', fontWeight:'bold' }}>{ag.time}</span>
                                <h4 style={{ margin:'4px 0' }}>{ag.title}</h4>
                                <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>Speaker: {ag.speaker} | Room: {ag.room}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TasksAgenda;
