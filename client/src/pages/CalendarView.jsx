import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../services/api';

const DEFAULT_EVENTS = [
    { id: 'ev-1', name: 'Global Tech Conference 2026', date: '2026-09-15', color: '#818cf8' },
    { id: 'ev-2', name: 'Creative Design Summit', date: '2026-09-22', color: '#c084fc' },
    { id: 'ev-3', name: 'Green Energy Pitch', date: '2026-09-05', color: '#34d399' }
];

const CalendarView = () => {
    const [events, setEvents] = useState(DEFAULT_EVENTS);
    useEffect(() => {
        eventsAPI.getAll()
            .then(r => {
                if (r.data && Array.isArray(r.data) && r.data.length > 0) {
                    setEvents(r.data);
                } else {
                    setEvents(DEFAULT_EVENTS);
                }
            })
            .catch(() => setEvents(DEFAULT_EVENTS));
    }, []);

    return (
        <div>
            <h2>September 2026 Interactive Event Calendar</h2>
            <div className="card-glass" style={{ padding:'20px', marginTop:'20px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'10px', textAlign:'center', fontWeight:700, color:'var(--primary)', marginBottom:'15px' }}>
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'10px' }}>
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                        const dateStr = `2026-09-${day < 10 ? '0' + day : day}`;
                        const dayEvents = events.filter(e => e.date === dateStr);
                        return (
                            <div key={day} style={{ minHeight:'90px', background:'rgba(0,0,0,0.2)', border:'1px solid var(--border-color)', borderRadius:'8px', padding:'8px' }}>
                                <strong>{day}</strong>
                                {dayEvents.map(ev => (
                                    <div key={ev.id} style={{ background: ev.color || 'var(--primary)', color:'#fff', padding:'3px 6px', borderRadius:'4px', marginTop:'4px', fontSize:'0.72rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                        {ev.name}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
