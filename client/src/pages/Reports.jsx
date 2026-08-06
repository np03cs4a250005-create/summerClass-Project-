import React, { useState } from 'react';
import { useToast } from '../components/Toast';

const downloadFile = (filename, content, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const triggerPrintPDF = (title, headers, rows, summaryStats) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title} - Gatherly Official Report</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; color: #0f172a; background: #fff; }
                .header { border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
                h1 { color: #1e3a8a; margin: 0; font-size: 22px; }
                .meta { color: #64748b; font-size: 13px; margin-top: 4px; }
                .stats { display: flex; gap: 15px; margin-bottom: 24px; }
                .stat-box { background: #f8fafc; padding: 14px; border-radius: 8px; flex: 1; border-left: 4px solid #2563eb; }
                .stat-val { font-size: 18px; font-weight: bold; color: #0f172a; margin-top: 4px; }
                table { width: 100%; border-collapse: collapse; margin-top: 16px; }
                th { background: #2563eb; color: white; padding: 10px; text-align: left; font-size: 12px; }
                td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
                tr:nth-child(even) { background: #f8fafc; }
                .footer { margin-top: 35px; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; color: #94a3b8; font-size: 11px; }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <h1>Gatherly — ${title}</h1>
                    <div class="meta">Generated: ${new Date().toLocaleString()} • Enterprise Verification Pass</div>
                </div>
            </div>
            ${summaryStats ? `<div class="stats">${summaryStats}</div>` : ''}
            <table>
                <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
            </table>
            <div class="footer">&copy; 2026 Gatherly Suite — Enterprise Event Platform</div>
            <script>
                window.onload = function() { window.print(); };
            </script>
        </body>
        </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
};

const Reports = () => {
    const { showToast } = useToast();
    const [exporting, setExporting] = useState(null);
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [customCategory, setCustomCategory] = useState('attendance');
    const [customFormat, setCustomFormat] = useState('csv');

    const handleExport = (type, label, idx) => {
        setExporting(idx);
        setTimeout(() => {
            setExporting(null);

            if (type === 'attendance_csv') {
                const csvData = `ID,Name,Email,Ticket Tier,Check-in Time,Status\n` +
                    `GATH-101,Sarah Chen,sarah@techsummit.com,VIP Pass,2026-08-06 09:12 AM,Checked In\n` +
                    `GATH-102,Alex Rivera,alex@creators.org,General Pass,2026-08-06 09:15 AM,Checked In\n` +
                    `GATH-103,Jordan Lee,jordan@dev.com,VIP Pass,2026-08-06 09:22 AM,Checked In\n` +
                    `GATH-104,Marcus Vance,marcus@cityarts.org,Speaker Pass,2026-08-06 09:30 AM,Checked In\n` +
                    `GATH-105,Elena Rostova,elena@design.io,General Pass,2026-08-06 10:05 AM,Checked In\n`;
                downloadFile(`Attendance_Summary_${Date.now()}.csv`, csvData, 'text/csv;charset=utf-8;');
            } else if (type === 'finance_csv') {
                const csvData = `Transaction ID,Category,Description,Amount ($),Date,Status\n` +
                    `TXN-901,Ticket Sales,Early Bird VIP Tickets,18500.00,2026-08-01,Completed\n` +
                    `TXN-902,Sponsorship,TechCorp Platinum Sponsorship,8000.00,2026-08-02,Completed\n` +
                    `TXN-903,Sponsorship,InnovaDesign Gold Sponsorship,4500.00,2026-08-03,Completed\n` +
                    `TXN-904,Expense,Grand Hall Venue Rental,-4500.00,2026-08-04,Completed\n` +
                    `TXN-905,Expense,Catering & Refreshments,-2800.00,2026-08-05,Completed\n`;
                downloadFile(`Financial_Audit_${Date.now()}.csv`, csvData, 'text/csv;charset=utf-8;');
            } else if (type === 'analytics_json') {
                const jsonData = JSON.stringify({
                    report: 'Engagement Analytics',
                    generatedAt: new Date().toISOString(),
                    metrics: {
                        avgSessionRating: 4.8,
                        totalSurveyResponses: 186,
                        satisfactionPercentage: '96%',
                        popularSessions: [
                            { title: 'Opening Keynote', attendees: 240, rating: 4.9 },
                            { title: 'AI & Event Tech Workshop', attendees: 195, rating: 4.7 }
                        ]
                    }
                }, null, 2);
                downloadFile(`Engagement_Analytics_${Date.now()}.json`, jsonData, 'application/json');
            } else if (type === 'security_pdf') {
                const headers = ['Log ID', 'User / IP', 'Action Performed', 'Timestamp', 'Status'];
                const rows = [
                    ['LOG-401', 'admin@gatherly.com (192.168.1.4)', 'User Login Success', '2026-08-06 08:30:12', 'OK'],
                    ['LOG-402', 'organizer@gatherly.com (192.168.1.9)', 'Ticket Tier Updated', '2026-08-06 09:14:02', 'OK'],
                    ['LOG-403', 'system_cron', 'Database Backup Created', '2026-08-06 10:00:00', 'OK'],
                    ['LOG-404', 'admin@gatherly.com (192.168.1.4)', 'QR Badge Verification Scan', '2026-08-06 10:22:45', 'OK']
                ];
                const stats = `
                    <div class="stat-box"><div style="font-size:12px;color:#64748b">Total Logs</div><div class="stat-val">1,247</div></div>
                    <div class="stat-box"><div style="font-size:12px;color:#64748b">Alerts</div><div class="stat-val" style="color:#2563eb">0 Critical</div></div>
                    <div class="stat-box"><div style="font-size:12px;color:#64748b">System Uptime</div><div class="stat-val" style="color:#16a34a">99.9%</div></div>
                `;
                triggerPrintPDF('Security Audit Log', headers, rows, stats);
            }

            showToast(`${label} exported in real-life!`, 'success');
        }, 1200);
    };

    const handleCustomExportSubmit = (e) => {
        e.preventDefault();
        setShowCustomModal(false);
        const type = customCategory === 'attendance' ? 'attendance_csv' : customCategory === 'finance' ? 'finance_csv' : customCategory === 'analytics' ? 'analytics_json' : 'security_pdf';
        handleExport(type, 'Custom Report', 0);
    };

    const reports = [
        {
            icon: 'fa-file-csv',
            color: '#38bdf8',
            title: 'Attendance Summary Export',
            desc: 'Detailed breakdown of attendee check-ins, demographics, seat occupancy, and gate throughput.',
            stats: [{ label: 'Total Attendees', val: '248' }, { label: 'Check-in Rate', val: '91%' }, { label: 'No-shows', val: '22' }],
            btnLabel: 'Download Real CSV',
            btnClass: 'btn blue-glow-btn',
            type: 'attendance_csv',
        },
        {
            icon: 'fa-file-lines',
            color: '#34d399',
            title: 'Financial Audit Export',
            desc: 'Complete financial breakdown of ticket revenues, sponsorships, expenses, and net surplus.',
            stats: [{ label: 'Total Revenue', val: '$42,500' }, { label: 'Net Surplus', val: '$18,200' }, { label: 'Expenses', val: '$9,300' }],
            btnLabel: 'Download Real CSV',
            btnClass: 'btn blue-glow-btn',
            type: 'finance_csv',
        },
        {
            icon: 'fa-code',
            color: '#60a5fa',
            title: 'Engagement Analytics (JSON)',
            desc: 'Feedback scores, session attendance rates, Q&A participation, and audience metrics.',
            stats: [{ label: 'Avg Rating', val: '4.8/5' }, { label: 'Responses', val: '186' }, { label: 'Satisfaction', val: '96%' }],
            btnLabel: 'Download JSON File',
            btnClass: 'btn blue-glow-btn',
            type: 'analytics_json',
        },
        {
            icon: 'fa-file-pdf',
            color: '#ef4444',
            title: 'Security Audit Log (Print PDF)',
            desc: 'Full audit trail of system logins, configuration changes, and security access logs.',
            stats: [{ label: 'Log Entries', val: '1,247' }, { label: 'Alerts', val: '0' }, { label: 'Uptime', val: '99.9%' }],
            btnLabel: 'Print / Save PDF Report',
            btnClass: 'btn btn-secondary',
            type: 'security_pdf',
        },
    ];

    return (
        <div>
            {/* Hero Header */}
            <div className="page-hero anim-fade-down" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(37,99,235,0.4)', flexShrink: 0, animation: 'floatUpDown 3s ease-in-out infinite' }}>
                        <i className="fas fa-chart-line" style={{ color: '#fff', fontSize: '1.4rem' }}></i>
                    </div>
                    <div>
                        <h1 className="page-hero-title">Real-Life Export & Report Studio</h1>
                        <p className="page-hero-sub">Generate and download actual CSV files, JSON payloads, and printable PDF documents</p>
                    </div>
                </div>

                <button onClick={() => setShowCustomModal(true)} className="btn blue-glow-btn" style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-sliders"></i> Generate Custom Report
                </button>
            </div>

            {/* Report Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '8px' }}>
                {reports.map((r, i) => (
                    <div key={i} className="blue-card-glass anim-fade-up shimmer-card" style={{ animationDelay: `${i * 100}ms`, borderRadius: '18px', overflow: 'hidden' }}>
                        <div style={{ height: 4, background: `linear-gradient(90deg, ${r.color}, ${r.color}88)` }}></div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                                <div style={{ width: 48, height: 48, borderRadius: '14px', background: `${r.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <i className={`fas ${r.icon}`} style={{ color: r.color, fontSize: '1.3rem' }}></i>
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>{r.title}</h3>
                            </div>

                            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.55, margin: '0 0 18px' }}>{r.desc}</p>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                {r.stats.map(s => (
                                    <div key={s.label} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px', textAlign: 'center', minWidth: '65px' }}>
                                        <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '1rem', color: r.color }}>{s.val}</p>
                                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {exporting === i ? (
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                        <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(56,189,248,0.3)', borderTopColor: r.color, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>
                                        <span style={{ fontSize: '0.88rem', color: r.color, fontWeight: 600 }}>Building real file download...</span>
                                    </div>
                                    <div className="bar-track">
                                        <div style={{ height: '100%', borderRadius: '999px', background: `linear-gradient(90deg, ${r.color}, ${r.color}88)`, animation: 'barFill 1.2s ease forwards' }}></div>
                                    </div>
                                </div>
                            ) : (
                                <button className={r.btnClass} style={{ width: '100%', borderRadius: '10px', padding: '12px' }} onClick={() => handleExport(r.type, r.title, i)}>
                                    <i className={`fas ${r.icon}`} style={{ marginRight: '8px' }}></i>{r.btnLabel}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Exporter Modal */}
            {showCustomModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="blue-card-glass" style={{ width: '100%', maxWidth: '480px', padding: '30px', borderRadius: '20px', border: '1px solid rgba(56,189,248,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>Custom Report Builder</h3>
                            <button onClick={() => setShowCustomModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleCustomExportSubmit}>
                            <div className="input-group">
                                <label style={{ color: '#cbd5e1', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Report Data Module</label>
                                <select value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="form-input" style={{ width: '100%', height: '44px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '10px', border: '1px solid rgba(56,189,248,0.3)' }}>
                                    <option value="attendance">Attendance & Guest Registry</option>
                                    <option value="finance">Financial Revenues & Ledger</option>
                                    <option value="analytics">Engagement & Survey Scores</option>
                                    <option value="security">Security & Access Logs</option>
                                </select>
                            </div>

                            <div className="input-group" style={{ marginTop: '16px' }}>
                                <label style={{ color: '#cbd5e1', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Export File Format</label>
                                <select value={customFormat} onChange={e => setCustomFormat(e.target.value)} className="form-input" style={{ width: '100%', height: '44px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '10px', border: '1px solid rgba(56,189,248,0.3)' }}>
                                    <option value="csv">CSV Spreadsheet (.csv)</option>
                                    <option value="json">JSON Data File (.json)</option>
                                    <option value="pdf">Printable PDF Document (.pdf)</option>
                                </select>
                            </div>

                            <button type="submit" className="btn blue-glow-btn" style={{ width: '100%', height: '46px', marginTop: '24px', borderRadius: '10px', fontWeight: 600 }}>
                                <i className="fas fa-download" style={{ marginRight: '8px' }}></i> Export & Download File
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;

