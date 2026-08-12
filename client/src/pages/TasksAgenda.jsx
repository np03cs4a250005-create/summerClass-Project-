import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import { useToast } from '../components/Toast';

const DEFAULT_TASKS = [
    { id: 'tsk-1', title: 'Confirm Main Keynote AV & Wireless Microphones', assignee: 'Rohan Shrestha', progress: 85, completed: false, category: 'Technical' },
    { id: 'tsk-2', title: 'Setup Attendee VIP Registration & Badge Scanner', assignee: 'Pooja Sharma', progress: 100, completed: true, category: 'Operations' },
    { id: 'tsk-3', title: 'Distribute Sponsor Badges & Swag Merch Packs', assignee: 'Aarav Thapa', progress: 60, completed: false, category: 'Logistics' },
    { id: 'tsk-4', title: 'Finalize Eco Catering & Organic Coffee Station', assignee: 'Sneha Gurung', progress: 45, completed: false, category: 'Hospitality' },
    { id: 'tsk-5', title: '4K Live Stream Broadcast & Backup Recording Test', assignee: 'Bikram Adhikari', progress: 95, completed: false, category: 'Media' },
    { id: 'tsk-6', title: 'Verify Emergency Exit Routes & First Aid Kits', assignee: 'Karan Patel', progress: 70, completed: false, category: 'Operations' }
];

const DEFAULT_AGENDA = [
    { id: 'ag-1', time: '09:00 AM - 10:00 AM', title: 'Opening Keynote: The Future of AI & Tech 2026', speaker: 'Dr. Aarav Sharma', room: 'Grand Cyber Hall A', category: 'Keynote', color: '#38bdf8' },
    { id: 'ag-2', time: '10:15 AM - 11:30 AM', title: 'Interactive Workshop: Design Systems & Micro-Interactions', speaker: 'Pooja Gurung', room: 'Studio 4', category: 'Workshop', color: '#c084fc' },
    { id: 'ag-3', time: '11:45 AM - 01:00 PM', title: 'CleanTech & Green Energy Venture Pitch', speaker: 'Marcus Vance', room: 'Eco Center Main Stage', category: 'Pitch', color: '#34d399' },
    { id: 'ag-4', time: '01:00 PM - 02:00 PM', title: 'VIP Networking Lunch & Organic Coffee Hour', speaker: 'Gatherly Host Team', room: 'Skyline Dining Lounge', category: 'Break', color: '#fbbf24' },
    { id: 'ag-5', time: '02:00 PM - 04:00 PM', title: 'Hackathon Demo Showcase & Award Ceremony', speaker: 'Rohan Shrestha & Jury', room: 'Innovation Lab 2', category: 'Showcase', color: '#f472b6' },
    { id: 'ag-6', time: '04:30 PM - 06:00 PM', title: 'Closing Ceremony & VIP Afterparty Toast', speaker: 'Sarah Jenkins & Founders', room: 'Skyline Ballroom VIP', category: 'Networking', color: '#818cf8' }
];

const CATEGORY_COLORS = {
    Technical: '#38bdf8',
    Operations: '#34d399',
    Logistics: '#fbbf24',
    Hospitality: '#f472b6',
    Media: '#c084fc',
    General: '#818cf8'
};

const TasksAgenda = () => {
    const { showToast } = useToast();
    const [tasks, setTasks] = useState(DEFAULT_TASKS);
    const [agenda, setAgenda] = useState(DEFAULT_AGENDA);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [showAddAgendaModal, setShowAddAgendaModal] = useState(false);

    const [newTask, setNewTask] = useState({
        title: '',
        assignee: '',
        category: 'Operations',
        progress: 0
    });

    const [newAgenda, setNewAgenda] = useState({
        title: '',
        speaker: '',
        room: 'Grand Cyber Hall A',
        time: '02:00 PM - 03:30 PM',
        category: 'Keynote'
    });

    const loadTasks = async () => {
        try {
            setLoading(true);
            const res = await tasksAPI.getAll();
            if (res.data) {
                const apiTasks = Array.isArray(res.data.tasks) ? res.data.tasks : [];
                const apiAgenda = Array.isArray(res.data.agenda) ? res.data.agenda : [];

                const combinedTasks = [...apiTasks, ...DEFAULT_TASKS.filter(d => !apiTasks.some(a => a.id === d.id))];
                const combinedAgenda = [...apiAgenda, ...DEFAULT_AGENDA.filter(d => !apiAgenda.some(a => a.id === d.id))];

                setTasks(combinedTasks);
                setAgenda(combinedAgenda);
            }
        } catch {
            setTasks(DEFAULT_TASKS);
            setAgenda(DEFAULT_AGENDA);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleAddTaskSubmit = async (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) return;

        const created = {
            id: `tsk-${Date.now()}`,
            title: newTask.title.trim(),
            assignee: newTask.assignee.trim() || 'Team Member',
            category: newTask.category,
            progress: Number(newTask.progress) || 0,
            completed: Number(newTask.progress) === 100
        };

        try {
            await tasksAPI.create(created);
        } catch {
            // local update fallback
        }

        setTasks(prev => [created, ...prev]);
        setShowAddTaskModal(false);
        setNewTask({ title: '', assignee: '', category: 'Operations', progress: 0 });
        showToast(`Task "${created.title}" added!`, 'success');
    };

    const handleAddAgendaSubmit = (e) => {
        e.preventDefault();
        if (!newAgenda.title.trim()) return;

        const colors = ['#38bdf8', '#c084fc', '#34d399', '#fbbf24', '#f472b6'];
        const created = {
            id: `ag-${Date.now()}`,
            title: newAgenda.title.trim(),
            speaker: newAgenda.speaker.trim() || 'Main Presenter',
            room: newAgenda.room.trim() || 'Auditorium',
            time: newAgenda.time.trim() || '02:00 PM - 03:00 PM',
            category: newAgenda.category,
            color: colors[agenda.length % colors.length]
        };

        setAgenda(prev => [...prev, created]);
        setShowAddAgendaModal(false);
        setNewAgenda({ title: '', speaker: '', room: 'Grand Cyber Hall A', time: '02:00 PM - 03:30 PM', category: 'Keynote' });
        showToast(`Session "${created.title}" added to Agenda!`, 'success');
    };

    const handleToggleTaskComplete = (id) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                const nextCompleted = !t.completed;
                const nextProgress = nextCompleted ? 100 : 0;
                return { ...t, completed: nextCompleted, progress: nextProgress };
            }
            return t;
        }));
        showToast('Task status updated!', 'info');
    };

    const handleDeleteTask = (id, title) => {
        if (window.confirm(`Are you sure you want to remove task "${title}"?`)) {
            setTasks(prev => prev.filter(t => t.id !== id));
            showToast(`Task removed`, 'info');
        }
    };

    const handleDeleteAgenda = (id, title) => {
        if (window.confirm(`Are you sure you want to remove session "${title}"?`)) {
            setAgenda(prev => prev.filter(a => a.id !== id));
            showToast(`Session removed from agenda`, 'info');
        }
    };

    const handleProgressChange = (id, newProgress) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                return { ...t, progress: newProgress, completed: newProgress === 100 };
            }
            return t;
        }));
    };

    const filteredTasks = tasks.filter(t => {
        const matchesTab = activeTab === 'all' ? true : (activeTab === 'completed' ? t.completed : (t.category && t.category.toLowerCase() === activeTab.toLowerCase()));
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || (t.assignee && t.assignee.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    const completedCount = tasks.filter(t => t.completed || t.progress === 100).length;
    const avgProgress = tasks.length > 0 ? Math.round(tasks.reduce((acc, t) => acc + (t.progress || 0), 0) / tasks.length) : 0;

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Top Hero Banner & Command Center */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(9, 13, 22, 0.98))',
                border: '1.5px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '24px',
                padding: '28px 32px',
                marginBottom: '28px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 35px rgba(37,99,235,0.25)',
                backdropFilter: 'blur(16px)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 14px', borderRadius: '20px', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 800, marginBottom: '10px' }}>
                            <i className="fas fa-sparkles"></i> GATHERLY OPERATIONS & AGENDA ENGINE
                        </div>
                        <h2 style={{ fontSize: '2.3rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #ffffff, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <i className="fas fa-list-check" style={{ color: '#38bdf8' }}></i>
                            Tasks & Master Event Agenda
                        </h2>
                        <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: '0.98rem', maxWidth: '680px' }}>
                            Track team execution progress, manage operational checklists, and inspect session timelines in real-time.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setShowAddTaskModal(true)}
                            style={{
                                background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                                border: 'none',
                                color: '#ffffff',
                                padding: '12px 22px',
                                borderRadius: '14px',
                                fontWeight: 800,
                                fontSize: '0.92rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 0 25px rgba(37, 99, 235, 0.5)'
                            }}>
                            <i className="fas fa-plus-circle"></i> Add Task
                        </button>

                        <button
                            onClick={() => setShowAddAgendaModal(true)}
                            style={{
                                background: 'rgba(192, 132, 252, 0.15)',
                                border: '1px solid rgba(192, 132, 252, 0.4)',
                                color: '#c084fc',
                                padding: '12px 22px',
                                borderRadius: '14px',
                                fontWeight: 800,
                                fontSize: '0.92rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                            <i className="fas fa-calendar-plus"></i> Add Session
                        </button>
                    </div>
                </div>

                {/* 4 KPI Metrics Banner Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
                    <div style={{ background: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontSize: '1.2rem', flexShrink: 0 }}>
                            <i className="fas fa-tasks"></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Total Team Tasks</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>{tasks.length} Items</div>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontSize: '1.2rem', flexShrink: 0 }}>
                            <i className="fas fa-circle-check"></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Tasks Completed</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>{completedCount} / {tasks.length}</div>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(192, 132, 252, 0.3)', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(192, 132, 252, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', fontSize: '1.2rem', flexShrink: 0 }}>
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Avg Overall Progress</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>{avgProgress}%</div>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', fontSize: '1.2rem', flexShrink: 0 }}>
                            <i className="fas fa-calendar-day"></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Master Agenda</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>{agenda.length} Sessions</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Side-by-Side Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '24px' }}>
                
                {/* Left Column: Operational Checklist */}
                <div style={{
                    background: 'rgba(15, 23, 42, 0.88)',
                    border: '1.5px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(16px)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-clipboard-check" style={{ color: '#38bdf8' }}></i>
                            Operational Checklist
                        </h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* Search Input */}
                            <div style={{ position: 'relative', width: '200px' }}>
                                <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '0.82rem' }}></i>
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '7px 12px 7px 34px',
                                        borderRadius: '12px',
                                        background: 'rgba(15, 23, 42, 0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#ffffff',
                                        fontSize: '0.82rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            {/* + Add Task Button inside Card Header */}
                            <button
                                onClick={() => setShowAddTaskModal(true)}
                                style={{
                                    background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                                    border: 'none',
                                    color: '#ffffff',
                                    padding: '7px 14px',
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 0 15px rgba(37, 99, 235, 0.4)'
                                }}>
                                <i className="fas fa-plus"></i> Add Task
                            </button>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '18px' }}>
                        {['all', 'Technical', 'Operations', 'Logistics', 'Hospitality', 'Media', 'completed'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '16px',
                                    border: activeTab === tab ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                                    background: activeTab === tab ? 'rgba(37, 99, 235, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                                    color: activeTab === tab ? '#ffffff' : '#94a3b8',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                    whiteSpace: 'nowrap'
                                }}>
                                {tab === 'all' ? '✨ All Tasks' : tab}
                            </button>
                        ))}
                    </div>

                    {/* Task Cards List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map(t => {
                                const catColor = CATEGORY_COLORS[t.category] || '#38bdf8';
                                return (
                                    <div
                                        key={t.id}
                                        style={{
                                            background: 'rgba(9, 13, 22, 0.85)',
                                            border: t.completed ? '1px solid rgba(52, 211, 153, 0.4)' : `1px solid ${catColor}40`,
                                            borderRadius: '16px',
                                            padding: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '10px',
                                            transition: 'all 0.25s ease',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                                        }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                                {/* Completion Checkbox */}
                                                <button
                                                    onClick={() => handleToggleTaskComplete(t.id)}
                                                    style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '7px',
                                                        border: t.completed ? 'none' : '2px solid rgba(255,255,255,0.3)',
                                                        background: t.completed ? 'linear-gradient(135deg, #10b981, #34d399)' : 'rgba(255,255,255,0.05)',
                                                        color: '#ffffff',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justify: 'center',
                                                        flexShrink: 0
                                                    }}>
                                                    {t.completed && <i className="fas fa-check" style={{ fontSize: '0.75rem' }}></i>}
                                                </button>

                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: t.completed ? '#94a3b8' : '#f8fafc', textDecoration: t.completed ? 'line-through' : 'none' }}>
                                                        {t.title}
                                                    </h4>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.78rem', color: '#94a3b8' }}>
                                                        <span><i className="far fa-user" style={{ color: catColor }}></i> {t.assignee || 'Assigned Staff'}</span>
                                                        <span>•</span>
                                                        <span style={{ color: catColor, fontWeight: 700 }}>{t.category || 'Operations'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 100% DEAD-CENTERED Grid Trash Button */}
                                            <button
                                                onClick={() => handleDeleteTask(t.id, t.title)}
                                                title="Delete task"
                                                style={{
                                                    display: 'grid',
                                                    placeItems: 'center',
                                                    placeContent: 'center',
                                                    width: '32px',
                                                    height: '32px',
                                                    minWidth: '32px',
                                                    minHeight: '32px',
                                                    borderRadius: '8px',
                                                    background: 'rgba(239, 68, 68, 0.15)',
                                                    border: '1px solid rgba(239, 68, 68, 0.35)',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    padding: 0,
                                                    margin: 0,
                                                    boxSizing: 'border-box'
                                                }}>
                                                <i className="fas fa-trash-can" style={{ fontSize: '0.8rem', margin: '0 auto', padding: 0, lineHeight: 1, display: 'block', textCenter: 'center' }}></i>
                                            </button>
                                        </div>

                                        {/* Progress Bar & Slider */}
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px', color: t.completed ? '#34d399' : '#cbd5e1' }}>
                                                <span>Completion Progress</span>
                                                <span>{t.progress}%</span>
                                            </div>
                                            <div style={{ height: '7px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                                                <div style={{ height: '100%', width: `${t.progress}%`, background: t.completed ? 'linear-gradient(90deg, #10b981, #34d399)' : `linear-gradient(90deg, ${catColor}, #38bdf8)`, borderRadius: '10px', transition: 'width 0.3s ease' }}></div>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                step="5"
                                                value={t.progress}
                                                onChange={(e) => handleProgressChange(t.id, Number(e.target.value))}
                                                style={{ width: '100%', marginTop: '6px', height: '4px', opacity: 0.7, cursor: 'pointer' }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '18px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <i className="fas fa-list-dots" style={{ fontSize: '2.2rem', color: '#475569', marginBottom: '10px', display: 'block' }}></i>
                                <h4 style={{ color: '#f8fafc', fontWeight: 700, margin: '0 0 4px' }}>No Tasks Found</h4>
                                <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: 0 }}>Try clearing search or click "Add Task".</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Master Event Agenda Timeline */}
                <div style={{
                    background: 'rgba(15, 23, 42, 0.88)',
                    border: '1.5px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(16px)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                EVENT SCHEDULE TIMELINE
                            </span>
                            <h3 style={{ margin: '2px 0 0', fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fas fa-clock" style={{ color: '#fbbf24' }}></i>
                                Master Event Agenda
                            </h3>
                        </div>

                        {/* + Add Session Button */}
                        <button
                            onClick={() => setShowAddAgendaModal(true)}
                            style={{
                                background: 'rgba(192, 132, 252, 0.18)',
                                border: '1px solid rgba(192, 132, 252, 0.4)',
                                color: '#c084fc',
                                padding: '7px 14px',
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                            <i className="fas fa-plus"></i> Add Session
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {agenda.map((item, idx) => {
                            const themeColor = item.color || ['#38bdf8', '#c084fc', '#34d399', '#fbbf24', '#f472b6', '#818cf8'][idx % 6];
                            return (
                                <div
                                    key={item.id || idx}
                                    style={{
                                        position: 'relative',
                                        paddingLeft: '20px',
                                        borderLeft: `3px solid ${themeColor}`,
                                        background: 'rgba(9, 13, 22, 0.6)',
                                        borderRadius: '0 14px 14px 0',
                                        padding: '14px 14px 14px 18px',
                                        boxShadow: `0 4px 15px ${themeColor}10`
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: themeColor, background: `${themeColor}18`, padding: '2px 8px', borderRadius: '10px' }}>
                                            <i className="far fa-clock" style={{ marginRight: '4px' }}></i>
                                            {item.time}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                                                {item.category || 'Session'}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteAgenda(item.id, item.title)}
                                                title="Delete agenda session"
                                                style={{
                                                    display: 'grid',
                                                    placeItems: 'center',
                                                    placeContent: 'center',
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '6px',
                                                    background: 'rgba(239, 68, 68, 0.15)',
                                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    padding: 0
                                                }}>
                                                <i className="fas fa-trash-can" style={{ fontSize: '0.7rem', margin: '0 auto', lineHeight: 1 }}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <h4 style={{ margin: '6px 0 4px', fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                                        {item.title}
                                    </h4>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className="fas fa-microphone" style={{ color: themeColor }}></i>
                                            <span>Speaker: <strong style={{ color: '#e2e8f0' }}>{item.speaker || 'Main Presenter'}</strong></span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className="fas fa-location-dot" style={{ color: '#fbbf24' }}></i>
                                            <span>Venue Room: <strong style={{ color: '#e2e8f0' }}>{item.room || 'Main Stage'}</strong></span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Add Task Modal */}
            {showAddTaskModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99999,
                    background: 'rgba(5, 11, 26, 0.88)',
                    backdropFilter: 'blur(16px)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '480px',
                        background: 'linear-gradient(135deg, #0f172a, #090d16)',
                        border: '1.5px solid rgba(56, 189, 248, 0.4)',
                        borderRadius: '24px',
                        padding: '28px',
                        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(37, 99, 235, 0.3)',
                        fontFamily: 'Inter, system-ui, sans-serif'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-plus-circle" style={{ color: '#38bdf8' }}></i>
                                Add Operational Task
                            </h3>
                            <button
                                onClick={() => setShowAddTaskModal(false)}
                                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                                <i className="fas fa-times" style={{ margin: 0 }}></i>
                            </button>
                        </div>

                        <form onSubmit={handleAddTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Task Description / Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Verify Speaker Wireless Microphones"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#ffffff', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Assignee Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Rohan Shrestha"
                                        value={newTask.assignee}
                                        onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#ffffff', outline: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Category</label>
                                    <select
                                        value={newTask.category}
                                        onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#ffffff', outline: 'none' }}>
                                        <option value="Operations">Operations</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Logistics">Logistics</option>
                                        <option value="Hospitality">Hospitality</option>
                                        <option value="Media">Media</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Initial Progress ({newTask.progress}%)</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={newTask.progress}
                                    onChange={(e) => setNewTask({ ...newTask, progress: Number(e.target.value) })}
                                    style={{ width: '100%', cursor: 'pointer' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddTaskModal(false)}
                                    style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontWeight: 600, cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '10px 22px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)' }}>
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Agenda Session Modal */}
            {showAddAgendaModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99999,
                    background: 'rgba(5, 11, 26, 0.88)',
                    backdropFilter: 'blur(16px)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '480px',
                        background: 'linear-gradient(135deg, #0f172a, #090d16)',
                        border: '1.5px solid rgba(192, 132, 252, 0.4)',
                        borderRadius: '24px',
                        padding: '28px',
                        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(192, 132, 252, 0.3)',
                        fontFamily: 'Inter, system-ui, sans-serif'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-calendar-plus" style={{ color: '#c084fc' }}></i>
                                Add Agenda Session
                            </h3>
                            <button
                                onClick={() => setShowAddAgendaModal(false)}
                                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                                <i className="fas fa-times" style={{ margin: 0 }}></i>
                            </button>
                        </div>

                        <form onSubmit={handleAddAgendaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Session Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. CleanTech Venture Pitch"
                                    value={newAgenda.title}
                                    onChange={(e) => setNewAgenda({ ...newAgenda, title: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(192, 132, 252, 0.3)', color: '#ffffff', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Speaker Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Dr. Aarav Sharma"
                                        value={newAgenda.speaker}
                                        onChange={(e) => setNewAgenda({ ...newAgenda, speaker: e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(192, 132, 252, 0.3)', color: '#ffffff', outline: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Category</label>
                                    <select
                                        value={newAgenda.category}
                                        onChange={(e) => setNewAgenda({ ...newAgenda, category: e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(192, 132, 252, 0.3)', color: '#ffffff', outline: 'none' }}>
                                        <option value="Keynote">Keynote</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Pitch">Pitch</option>
                                        <option value="Break">Break</option>
                                        <option value="Showcase">Showcase</option>
                                        <option value="Networking">Networking</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Time Schedule</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 02:00 PM - 03:30 PM"
                                        value={newAgenda.time}
                                        onChange={(e) => setNewAgenda({ ...newAgenda, time: e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(192, 132, 252, 0.3)', color: '#ffffff', outline: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Venue Room</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Grand Cyber Hall A"
                                        value={newAgenda.room}
                                        onChange={(e) => setNewAgenda({ ...newAgenda, room: e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(192, 132, 252, 0.3)', color: '#ffffff', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddAgendaModal(false)}
                                    style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontWeight: 600, cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '10px 22px', borderRadius: '10px', background: 'linear-gradient(135deg, #a855f7, #c084fc)', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(192, 132, 252, 0.4)' }}>
                                    Save Session
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksAgenda;
