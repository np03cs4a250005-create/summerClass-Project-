import React, { useState, useEffect } from 'react';
import { feedbackAPI, eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const AVATAR_COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#c084fc', '#60a5fa', '#f472b6'];

const DEFAULT_FEEDBACKS = [
    { id: 'fb-1', eventName: 'Global Tech Conference', attendeeName: 'Priya Shrestha', rating: 5, comment: 'The Global Tech Conference exceeded all my expectations! The AI keynote session was top-notch and the QR badge scanning made entry seamless.', reply: 'Thank you Priya! We are thrilled you enjoyed the AI keynote session.', createdAt: '2026-08-06' },
    { id: 'fb-2', eventName: 'Global Tech Conference', attendeeName: 'Rajesh Poudel', rating: 5, comment: 'Outstanding venue organization and networking lounge. Met incredible startup founders and investors!', reply: 'Appreciate your feedback Rajesh!', createdAt: '2026-08-05' },
    { id: 'fb-3', eventName: 'Creative UX Summit', attendeeName: 'Kamala Tamang', rating: 4, comment: 'Great UX design summit. Would love to see more hands-on workshop breakout rooms next year!', reply: '', createdAt: '2026-08-04' },
    { id: 'fb-4', eventName: 'Developer AI Hackathon', attendeeName: 'Dipesh Gurung', rating: 5, comment: 'Smooth ticket reservation and instant digital pass downloads. 10/10 event management platform!', reply: 'Thanks Dipesh! Glad the pass download was instant.', createdAt: '2026-08-03' },
];

const StarRating = ({ rating, onChange = null }) => {
    const [hoverStar, setHoverStar] = useState(0);

    return (
        <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2, 3, 4, 5].map(star => (
                <i key={star}
                    className={`fas fa-star`}
                    onClick={() => onChange && onChange(star)}
                    onMouseEnter={() => onChange && setHoverStar(star)}
                    onMouseLeave={() => onChange && setHoverStar(0)}
                    style={{
                        color: star <= (hoverStar || rating) ? '#fbbf24' : 'rgba(255,255,255,0.2)',
                        fontSize: onChange ? '1.5rem' : '1rem',
                        cursor: onChange ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                        filter: star <= (hoverStar || rating) ? 'drop-shadow(0 0 6px rgba(251,191,36,0.7))' : 'none',
                        transform: onChange && star <= hoverStar ? 'scale(1.2)' : 'scale(1)'
                    }}
                ></i>
            ))}
        </div>
    );
};

const SentimentBar = ({ ratings }) => {
    const total = ratings.length;
    if (!total) return null;
    const avg = ratings.reduce((a, b) => a + b, 0) / total;
    const dist = [5, 4, 3, 2, 1].map(s => ({ star: s, count: ratings.filter(r => r === s).length }));

    return (
        <div style={{ marginBottom: '8px' }}>
            {dist.map(d => (
                <div key={d.star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.8rem' }}>
                    <span style={{ width: 12, color: '#94a3b8', fontWeight: 600 }}>{d.star}</span>
                    <i className="fas fa-star" style={{ color: '#fbbf24', fontSize: '0.75rem' }}></i>
                    <div className="bar-track" style={{ flex: 1, height: 6 }}>
                        <div className="bar-fill" style={{ width: total ? `${(d.count / total) * 100}%` : '0%', height: '100%', background: 'linear-gradient(90deg, #fbbf24, #f59e0b)' }}></div>
                    </div>
                    <span style={{ width: 22, textAlign: 'right', color: '#94a3b8', fontWeight: 600 }}>{d.count}</span>
                </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ margin: 0, fontSize: '2.4rem', fontWeight: 800, color: '#fbbf24' }}>
                    {avg.toFixed(1)}<span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 400 }}> / 5.0</span>
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
                    <StarRating rating={Math.round(avg)} />
                </div>
            </div>
        </div>
    );
};

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState(DEFAULT_FEEDBACKS);
    const [eventsList, setEventsList] = useState([]);
    const [selectedEventName, setSelectedEventName] = useState('Global Tech Conference');
    const [loading, setLoading] = useState(true);
    const [replies, setReplies] = useState({});
    const [filterRating, setFilterRating] = useState('All');

    // Submit Review Modal state
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const { user } = useAuth();
    const { showToast } = useToast();

    const loadFeedbacks = async () => {
        try {
            setLoading(true);
            const [fbRes, evRes] = await Promise.all([
                feedbackAPI.getAll().catch(() => ({ data: [] })),
                eventsAPI.getAll().catch(() => ({ data: [] }))
            ]);

            if (evRes.data && Array.isArray(evRes.data) && evRes.data.length > 0) {
                setEventsList(evRes.data);
                setSelectedEventName(evRes.data[0]?.name || evRes.data[0]?.title || 'Global Tech Conference');
            }

            if (fbRes.data && Array.isArray(fbRes.data) && fbRes.data.length > 0) {
                setFeedbacks(fbRes.data);
            } else {
                setFeedbacks(DEFAULT_FEEDBACKS);
            }
        } catch {
            setFeedbacks(DEFAULT_FEEDBACKS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadFeedbacks(); }, []);

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        const reviewerName = name.trim() || user?.name || 'Verified Attendee';
        const newReview = {
            id: 'fb-' + Date.now(),
            eventName: selectedEventName,
            attendeeName: reviewerName,
            rating: rating,
            comment: comment,
            reply: '',
            createdAt: new Date().toLocaleDateString()
        };

        try {
            await feedbackAPI.create(newReview);
        } catch {
            // Local state fallback
        }

        setFeedbacks([newReview, ...feedbacks]);
        setShowModal(false);
        setComment('');
        setName('');
        setRating(5);
        showToast(`Thank you! Review for "${selectedEventName}" recorded.`, 'success');
    };

    const handleReply = async (id) => {
        const replyText = replies[id];
        if (!replyText?.trim()) return;

        try {
            await feedbackAPI.reply(id, replyText);
        } catch {
            // Local state fallback
        }

        setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, reply: replyText } : f));
        showToast('Reply posted successfully!', 'success');
        setReplies({ ...replies, [id]: '' });
    };

    const ratings = feedbacks.map(f => f.rating);
    const filteredFeedbacks = feedbacks.filter(f => filterRating === 'All' || f.rating === parseInt(filterRating));

    const sentimentColor = (r) => r >= 4 ? '#34d399' : r === 3 ? '#fbbf24' : '#ef4444';
    const sentimentLabel = (r) => r >= 4 ? 'Positive' : r === 3 ? 'Neutral' : 'Critical';

    return (
        <div>
            {/* Hero Header */}
            <div className="page-hero anim-fade-down" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(251,191,36,0.4)', flexShrink: 0, animation: 'floatUpDown 3s ease-in-out infinite' }}>
                        <i className="fas fa-star" style={{ color: '#fff', fontSize: '1.4rem' }}></i>
                    </div>
                    <div>
                        <h1 className="page-hero-title">Attendee Reviews & Feedback</h1>
                        <p className="page-hero-sub">Read verified event reviews, rate your experience, and share organizer feedback</p>
                    </div>
                </div>

                <button onClick={() => setShowModal(true)} className="btn blue-glow-btn" style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-pen"></i> Write a Review
                </button>
            </div>

            {/* Layout Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: '22px', alignItems: 'start', marginTop: '8px' }}>

                {/* Rating Summary Card */}
                <div className="blue-card-glass anim-slide-left" style={{ padding: '26px', borderRadius: '20px' }}>
                    <h3 style={{ margin: '0 0 18px', fontWeight: 700, color: '#f8fafc' }}>
                        <i className="fas fa-chart-pie" style={{ marginRight: '10px', color: '#fbbf24' }}></i>Rating Summary
                    </h3>

                    {loading ? <div className="skeleton" style={{ height: 140 }}></div> : <SentimentBar ratings={ratings} />}

                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                            <p style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem', color: '#34d399' }}>{ratings.filter(r => r >= 4).length}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Positive</p>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                            <p style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem', color: '#ef4444' }}>{ratings.filter(r => r <= 2).length}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Critical</p>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 10px', fontWeight: 600 }}>Filter Reviews</p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {['All', '5', '4', '3', '2'].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setFilterRating(star)}
                                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.25)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', background: filterRating === star ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'rgba(15,23,42,0.6)', color: '#fff' }}>
                                    {star === 'All' ? 'All' : `${star} ★`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Review Cards Feed */}
                <div>
                    {loading ? (
                        <div className="events-grid">
                            {[0, 1, 2].map(i => <div key={i} className="skeleton" style={{ height: 180, borderRadius: '18px' }}></div>)}
                        </div>
                    ) : filteredFeedbacks.length === 0 ? (
                        <div className="blue-card-glass" style={{ padding: '50px', textAlign: 'center', borderRadius: '20px' }}>
                            <i className="fas fa-comment-slash" style={{ fontSize: '3rem', color: '#64748b', marginBottom: '14px', display: 'block' }}></i>
                            <h3 style={{ margin: '0 0 8px', color: '#fff' }}>No reviews found for filter</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Be the first to share your experience!</p>
                            <button className="btn blue-glow-btn" style={{ marginTop: '16px' }} onClick={() => setShowModal(true)}>Write Review</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {filteredFeedbacks.map((fb, i) => {
                                const avatarBg = AVATAR_COLORS[i % AVATAR_COLORS.length];
                                const initials = fb.attendeeName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'A';
                                const sColor = sentimentColor(fb.rating);

                                return (
                                    <div key={fb.id || i} className="blue-card-glass anim-fade-up" style={{ animationDelay: `${i * 80}ms`, borderRadius: '18px', padding: '22px', borderLeft: `4px solid ${sColor}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: '#fff', boxShadow: `0 0 12px ${avatarBg}60` }}>
                                                    {initials}
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <strong style={{ fontSize: '0.95rem', color: '#f8fafc' }}>{fb.attendeeName}</strong>
                                                        {fb.eventName && (
                                                            <span style={{ fontSize: '0.7rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '2px 8px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', fontWeight: 700 }}>
                                                                <i className="fas fa-calendar-check" style={{ marginRight: '4px' }}></i>{fb.eventName}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{fb.createdAt || 'Verified Guest'}</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <StarRating rating={fb.rating} />
                                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: sColor, background: `${sColor}20`, padding: '2px 10px', borderRadius: '20px' }}>{sentimentLabel(fb.rating)}</span>
                                            </div>
                                        </div>

                                        <p style={{ fontStyle: 'italic', color: '#e2e8f0', lineHeight: 1.6, fontSize: '0.92rem', margin: '12px 0 16px', padding: '14px', background: 'rgba(15,23,42,0.6)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                            "{fb.comment}"
                                        </p>

                                        {fb.reply ? (
                                            <div style={{ background: 'rgba(37,99,235,0.15)', borderLeft: '3px solid #38bdf8', padding: '12px 16px', borderRadius: '10px', fontSize: '0.88rem' }}>
                                                <strong style={{ color: '#38bdf8', fontSize: '0.82rem', display: 'block', marginBottom: '4px' }}>
                                                    <i className="fas fa-reply" style={{ marginRight: '6px' }}></i>Organizer Official Response:
                                                </strong>
                                                <p style={{ margin: 0, color: '#e2e8f0' }}>{fb.reply}</p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Write an official organizer reply..."
                                                    value={replies[fb.id] || ''}
                                                    onChange={e => setReplies({ ...replies, [fb.id]: e.target.value })}
                                                    className="form-input"
                                                    style={{ flex: 1, height: '38px', fontSize: '0.85rem', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.25)' }}
                                                />
                                                <button className="btn blue-glow-btn" onClick={() => handleReply(fb.id)} style={{ padding: '0 16px', borderRadius: '8px', fontSize: '0.85rem' }}>
                                                    Reply
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Submit Review Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="blue-card-glass anim-scale-in" style={{ width: '100%', maxWidth: '480px', padding: '30px', borderRadius: '22px', border: '1px solid rgba(56,189,248,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>Submit Event Review</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleAddReview}>
                            {eventsList.length > 0 && (
                                <div className="input-group" style={{ marginBottom: '16px' }}>
                                    <label style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>Associated Event</label>
                                    <select
                                        value={selectedEventName}
                                        onChange={e => setSelectedEventName(e.target.value)}
                                        className="form-input"
                                        style={{ width: '100%', height: '42px', background: 'rgba(15,23,42,0.95)', color: '#fff', borderRadius: '10px' }}>
                                        {eventsList.map(ev => (
                                            <option key={ev.id} value={ev.name || ev.title}>{ev.name || ev.title}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="input-group">
                                <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Your Name (Optional)</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Alex Rivera" className="form-input" style={{ width: '100%', height: '42px', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '10px' }} />
                            </div>

                            <div className="input-group" style={{ marginTop: '16px' }}>
                                <label style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Select Rating</label>
                                <div style={{ background: 'rgba(15,23,42,0.8)', padding: '12px', borderRadius: '10px', display: 'flex', justifyContent: 'center', border: '1px solid rgba(56,189,248,0.25)' }}>
                                    <StarRating rating={rating} onChange={r => setRating(r)} />
                                </div>
                            </div>

                            <div className="input-group" style={{ marginTop: '16px' }}>
                                <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Your Review / Feedback *</label>
                                <textarea value={comment} onChange={e => setComment(e.target.value)} required rows="4" placeholder="Describe your experience at the event..." className="form-textarea" style={{ width: '100%', background: 'rgba(15,23,42,0.8)', color: '#fff', borderRadius: '10px', padding: '12px' }}></textarea>
                            </div>

                            <button type="submit" className="btn blue-glow-btn" style={{ width: '100%', height: '46px', marginTop: '22px', borderRadius: '10px', fontWeight: 600 }}>
                                <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i> Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Feedback;

