import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { getAIResponse } from '../utils/aiKnowledgeEngine';

const ONLINE_USERS = ['Anisha K. (Host)', 'Arjun M. (Speaker)', 'Dipesh L. (Attendee)'];

const PROMPT_SUGGESTIONS = [
    'How do I reserve VIP tickets & passes?',
    'How do I export real CSV/PDF reports?',
    'How do I submit reviews & 5-star ratings?',
    'How do I add sponsors & calculate budget ROI?',
    'How do I switch between Admin and User mode?',
];

const LiveChat = () => {
    const [activeTab, setActiveTab] = useState('ai'); // 'group' or 'ai'
    const [messages, setMessages] = useState([]);
    const [aiMessages, setAiMessages] = useState([
        {
            id: 'ai-welcome',
            sender: 'Gatherly AI Assistant',
            text: 'Hello! I am your Gatherly AI Assistant. I am here to guide you through ticket reservations, event publishing, CSV/PDF exports, sponsor management, and feature navigation!',
            steps: [
                '• Ask me: "How do I reserve tickets?" for ticket bookings.',
                '• Ask me: "How do I export reports?" for CSV/PDF downloads.',
                '• Ask me: "How do I write a review?" for rating submissions.',
                '• Ask me: "How do I add sponsors?" for budget ROI calculations.'
            ],
            action: { label: 'Explore Dashboard Overview', path: '/dashboard', icon: 'fa-th-large' },
            isAi: true,
            time: 'Just now'
        }
    ]);

    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const loadMsgs = async () => {
        try { const res = await chatAPI.getAll(); setMessages(res.data); }
        catch {} finally { setLoading(false); }
    };

    useEffect(() => {
        loadMsgs();
        const interval = setInterval(loadMsgs, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, aiMessages, activeTab]);

    const handleSendGroupMsg = async (inputText) => {
        if (!inputText.trim()) return;
        setIsTyping(false);
        try {
            await chatAPI.send({ sender: user?.name || 'Organizer', text: inputText });
            setText('');
            loadMsgs();
        } catch { showToast('Failed to send message', 'error'); }
    };

    const handleSendAIMsg = (inputText) => {
        if (!inputText.trim()) return;
        const userMsg = {
            id: 'usr-' + Date.now(),
            sender: user?.name || 'You',
            text: inputText,
            isAi: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setAiMessages(prev => [...prev, userMsg]);
        setText('');
        setIsTyping(true);

        setTimeout(() => {
            const aiResult = getAIResponse(inputText, user?.role || 'admin');
            const aiMsg = {
                id: 'ai-' + Date.now(),
                sender: 'Gatherly AI Assistant',
                text: aiResult.text,
                steps: aiResult.steps,
                action: aiResult.action,
                isAi: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setAiMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 650);
    };

    const handleDeleteAiMsg = (id) => {
        setAiMessages(prev => prev.filter(m => m.id !== id));
        showToast('Message deleted', 'info');
    };

    const handleDeleteGroupMsg = async (id) => {
        try {
            await chatAPI.delete(id).catch(() => {});
        } catch {}
        setMessages(prev => prev.filter(m => m.id !== id));
        showToast('Message deleted', 'info');
    };

    const handleClearChat = () => {
        if (activeTab === 'ai') {
            setAiMessages([
                {
                    id: 'ai-welcome-' + Date.now(),
                    sender: 'Gatherly AI Assistant',
                    text: 'Chat history cleared. How else can I assist you?',
                    steps: [],
                    isAi: true,
                    time: 'Just now'
                }
            ]);
        } else {
            setMessages([]);
        }
        showToast('Chat history cleared', 'info');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (activeTab === 'group') {
            handleSendGroupMsg(text);
        } else {
            handleSendAIMsg(text);
        }
    };

    const handlePromptClick = (prompt) => {
        if (activeTab !== 'ai') setActiveTab('ai');
        handleSendAIMsg(prompt);
    };

    const isOwn = (m) => m.sender === (user?.name || 'Organizer');

    return (
        <div>
            {/* Hero Header */}
            <div className="page-hero anim-fade-down">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(37,99,235,0.4)', flexShrink: 0, animation: 'floatUpDown 3s ease-in-out infinite' }}>
                            <i className="fas fa-robot" style={{ color: '#fff', fontSize: '1.4rem' }}></i>
                        </div>
                        <div>
                            <h1 className="page-hero-title">Real-Time Event Chat & AI Assistant</h1>
                            <p className="page-hero-sub">Engage with event attendees or consult Gatherly AI for instant website guidance</p>
                        </div>
                    </div>

                    {/* Mode Toggle Tabs */}
                    <div style={{ display: 'flex', gap: '10px', background: 'rgba(15,23,42,0.8)', padding: '6px', borderRadius: '14px', border: '1px solid rgba(56,189,248,0.25)' }}>
                        <button
                            onClick={() => setActiveTab('ai')}
                            style={{ padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s', background: activeTab === 'ai' ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'transparent', color: activeTab === 'ai' ? '#fff' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-sparkles"></i> Gatherly AI Assistant
                        </button>
                        <button
                            onClick={() => setActiveTab('group')}
                            style={{ padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s', background: activeTab === 'group' ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'transparent', color: activeTab === 'group' ? '#fff' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-comments"></i> Live Group Chat
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Suggestion Prompt Chips */}
            {activeTab === 'ai' && (
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '8px' }}>
                    {PROMPT_SUGGESTIONS.map((prompt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handlePromptClick(prompt)}
                            className="blue-card-glass"
                            style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '0.84rem', color: '#7dd3fc', fontWeight: 600, whiteSpace: 'nowrap', border: '1px solid rgba(56,189,248,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fas fa-lightbulb" style={{ color: '#fbbf24' }}></i> {prompt}
                        </button>
                    ))}
                </div>
            )}

            {/* Main Chat Container */}
            <div className="blue-card-glass anim-fade-up" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                
                {/* Header Sub-bar */}
                <div style={{ padding: '12px 20px', background: 'rgba(15,23,42,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }}></span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                            {activeTab === 'ai' ? 'Gatherly AI Support Console' : 'Live Community Event Channel'}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {activeTab === 'group' && ONLINE_USERS.map((u, i) => (
                            <span key={i} style={{ fontSize: '0.78rem', color: '#94a3b8' }}>• {u}</span>
                        ))}

                        <button onClick={handleClearChat} className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', fontSize: '0.8rem', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fas fa-trash-alt"></i> Clear Chat
                        </button>
                    </div>
                </div>

                {/* Messages Box */}
                <div style={{ height: 440, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.2)' }}>
                    
                    {/* MODE 1: GATHERLY AI ASSISTANT CHAT */}
                    {activeTab === 'ai' && aiMessages.map((m) => (
                        <div key={m.id} style={{ display: 'flex', flexDirection: m.isAi ? 'row' : 'row-reverse', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: m.isAi ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: '#fff', flexShrink: 0, boxShadow: m.isAi ? '0 0 15px rgba(37,99,235,0.5)' : 'none' }}>
                                {m.isAi ? <i className="fas fa-robot"></i> : m.sender.charAt(0).toUpperCase()}
                            </div>
                            
                            <div style={{ maxWidth: '75%', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: m.isAi ? 'flex-start' : 'flex-end', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{m.sender} · {m.time}</span>
                                    
                                    {/* Delete Button */}
                                    <button onClick={() => handleDeleteAiMsg(m.id)} title="Delete Message" style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', opacity: 0.7, padding: '2px 4px', fontSize: '0.78rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#ef4444'} onMouseOut={e => e.target.style.color = '#64748b'}>
                                        <i className="far fa-trash-alt"></i>
                                    </button>
                                </div>
                                
                                <div style={{ background: m.isAi ? 'rgba(15,23,42,0.9)' : 'linear-gradient(135deg, #2563eb, #0284c7)', borderRadius: m.isAi ? '4px 18px 18px 18px' : '18px 4px 18px 18px', padding: '14px 18px', fontSize: '0.92rem', lineHeight: 1.6, border: m.isAi ? '1px solid rgba(56,189,248,0.25)' : 'none', color: '#fff' }}>
                                    <p style={{ margin: 0 }}>{m.text}</p>

                                    {/* AI Step-by-Step Instructions */}
                                    {m.steps && (
                                        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {m.steps.map((s, idx) => (
                                                <div key={idx} style={{ fontSize: '0.85rem', color: '#bae6fd' }}>{s}</div>
                                            ))}
                                        </div>
                                    )}

                                    {/* AI Navigation Action Button */}
                                    {m.action && (
                                        <div style={{ marginTop: '14px' }}>
                                            <button
                                                onClick={() => navigate(m.action.path)}
                                                className="btn blue-glow-btn"
                                                style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                                <i className={`fas ${m.action.icon}`}></i> {m.action.label}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* MODE 2: LIVE EVENT GROUP CHAT */}
                    {activeTab === 'group' && (
                        loading ? (
                            [0,1,2].map(i => <div key={i} className="skeleton" style={{ height: 60, borderRadius: '12px' }}></div>)
                        ) : messages.map((m, i) => {
                            const own = isOwn(m);
                            return (
                                <div key={m.id || i} style={{ display: 'flex', flexDirection: own ? 'row-reverse' : 'row', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: own ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#fff', flexShrink: 0 }}>
                                        {m.sender?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div style={{ maxWidth: '70%' }}>
                                        <div style={{ display: 'flex', justifyContent: own ? 'flex-end' : 'flex-start', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.sender} · {m.time}</span>
                                            
                                            {/* Delete Button */}
                                            <button onClick={() => handleDeleteGroupMsg(m.id)} title="Delete Message" style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', opacity: 0.7, padding: '2px 4px', fontSize: '0.75rem', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#ef4444'} onMouseOut={e => e.target.style.color = '#64748b'}>
                                                <i className="far fa-trash-alt"></i>
                                            </button>
                                        </div>
                                        <div style={{ background: own ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'rgba(255,255,255,0.06)', borderRadius: own ? '18px 4px 18px 18px' : '4px 18px 18px 18px', padding: '12px 16px', fontSize: '0.9rem', lineHeight: 1.55, border: own ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
                                            {m.text}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {/* Typing Animation */}
                    {isTyping && (
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fas fa-robot" style={{ color: '#38bdf8', fontSize: '0.85rem' }}></i>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '14px', padding: '10px 16px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <span className="typing-dot" style={{ backgroundColor: '#38bdf8' }}></span>
                                <span className="typing-dot" style={{ backgroundColor: '#38bdf8' }}></span>
                                <span className="typing-dot" style={{ backgroundColor: '#38bdf8' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef}></div>
                </div>

                {/* Input Bar */}
                <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.9)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(15,23,42,0.8)', borderRadius: '12px', padding: '0 16px', border: '1px solid rgba(56,189,248,0.25)' }}>
                            <input
                                type="text"
                                placeholder={activeTab === 'ai' ? "Ask Gatherly AI for guidance, exports, or website troubleshooting..." : "Type a message to event attendees..."}
                                value={text}
                                onChange={e => { setText(e.target.value); }}
                                className="form-input"
                                style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '12px 0', flex: 1, color: '#fff', fontSize: '0.95rem' }}
                            />
                        </div>
                        <button type="submit" className="btn blue-glow-btn" style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>Send</span>
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LiveChat;

