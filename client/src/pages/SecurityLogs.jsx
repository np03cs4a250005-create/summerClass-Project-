import React, { useState, useEffect } from 'react';
import { logsAPI } from '../services/api';

const SecurityLogs = () => {
    const [logs, setLogs] = useState([]); const [loading, setLoading] = useState(true);
    useEffect(() => { logsAPI.getAll().then(r => setLogs(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);

    return (
        <div>
            <h2>Security Settings & Audit Trail Logs</h2>
            {loading ? <p style={{ marginTop:'20px' }}>Loading system logs...</p> : (
                <div className="panel-body card-glass table-panel" style={{ marginTop:'20px' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                        <thead><tr>{['Action','Details','Timestamp'].map(h => <th key={h} style={{ textAlign:'left', padding:'12px', borderBottom:'1px solid var(--border-color)' }}>{h}</th>)}</tr></thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id} style={{ borderBottom:'1px solid var(--border-color)' }}>
                                    <td style={{ padding:'12px' }}><span className="badge badge-primary">{log.action}</span></td>
                                    <td style={{ padding:'12px' }}>{log.detail}</td>
                                    <td style={{ padding:'12px', fontSize:'0.85rem', color:'var(--text-muted)' }}>{log.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SecurityLogs;
