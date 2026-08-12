import React, { useState, useEffect, useRef } from 'react';

const STEPS = [
    {
        step: '01',
        title: 'Create & Customize',
        desc: 'Set up your event title, schedule, venue map, and ticket types in just a few clicks with custom branding and instant publishing.',
        icon: 'fa-wand-magic-sparkles',
        badge: 'EVENT SETUP',
        accent: '#38bdf8'
    },
    {
        step: '02',
        title: 'Send Smart QR Passes',
        desc: 'Attendees register online and instantly receive dynamic digital badges on their devices with <50ms entrance scanner verification.',
        icon: 'fa-qrcode',
        badge: 'SMART TICKETING',
        accent: '#4ade80'
    },
    {
        step: '03',
        title: 'Welcome Your Community',
        desc: 'Scan passes at entry with high precision while watching live check-in stats, room occupancy gauges, and revenue update real-time.',
        icon: 'fa-users-gear',
        badge: 'LIVE CHECK-IN',
        accent: '#a855f7'
    }
];

const SwipableStepCards = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [swipingIndex, setSwipingIndex] = useState(null);
    const [swipeDirection, setSwipeDirection] = useState('right');
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [viewMode, setViewMode] = useState('stack');

    const touchStartX = useRef(null);

    const handleNext = () => {
        if (swipingIndex !== null) return;
        setSwipeDirection('right');
        setSwipingIndex(activeIndex);

        setTimeout(() => {
            setActiveIndex((prev) => (prev + 1) % STEPS.length);
            setSwipingIndex(null);
        }, 380);
    };

    const handlePrev = () => {
        if (swipingIndex !== null) return;
        setSwipeDirection('left');
        setSwipingIndex(activeIndex);

        setTimeout(() => {
            setActiveIndex((prev) => (prev - 1 + STEPS.length) % STEPS.length);
            setSwipingIndex(null);
        }, 380);
    };

    useEffect(() => {
        let timer;
        if (isAutoPlay && viewMode === 'stack') {
            timer = setInterval(() => {
                handleNext();
            }, 4500);
        }
        return () => clearInterval(timer);
    }, [isAutoPlay, activeIndex, swipingIndex, viewMode]);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;

        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                handleNext();
            } else {
                handlePrev();
            }
        }
        touchStartX.current = null;
    };

    return (
        <div style={{ width: '100%', maxWidth: '950px', margin: '0 auto' }}>
            <div style={{
                display: 'flex',
                justify: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '32px'
            }}>
                <div style={{ display: 'inline-flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    <button
                        onClick={() => setViewMode('stack')}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            background: viewMode === 'stack' ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'transparent',
                            color: viewMode === 'stack' ? '#ffffff' : '#94a3b8',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease',
                            boxShadow: viewMode === 'stack' ? '0 0 15px rgba(37, 99, 235, 0.5)' : 'none'
                        }}>
                        <i className="fas fa-layer-group"></i> Card View
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            background: viewMode === 'grid' ? 'linear-gradient(135deg, #2563eb, #0284c7)' : 'transparent',
                            color: viewMode === 'grid' ? '#ffffff' : '#94a3b8',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease',
                            boxShadow: viewMode === 'grid' ? '0 0 15px rgba(37, 99, 235, 0.5)' : 'none'
                        }}>
                        <i className="fas fa-grip-horizontal"></i> Grid View
                    </button>
                </div>

                {viewMode === 'stack' && (
                    <button
                        onClick={() => setIsAutoPlay(!isAutoPlay)}
                        title={isAutoPlay ? "Pause Auto Swipe" : "Enable Auto Swipe"}
                        style={{
                            background: isAutoPlay ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.06)',
                            border: isAutoPlay ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                            color: isAutoPlay ? '#38bdf8' : '#94a3b8',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                        <i className={`fas ${isAutoPlay ? 'fa-pause' : 'fa-play'}`}></i>
                        {isAutoPlay ? 'Auto Swipe ON' : 'Auto Swipe OFF'}
                    </button>
                )}
            </div>

            {viewMode === 'stack' ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '560px',
                            height: '320px',
                            perspective: '1000px',
                            margin: '0 auto 24px'
                        }}>
                        {STEPS.map((s, idx) => {
                            const total = STEPS.length;
                            const pos = (idx - activeIndex + total) % total;
                            const isSwiping = swipingIndex === idx;

                            let transformStyle = '';
                            let opacityVal = 1;
                            let zIndexVal = 1;
                            let filterVal = 'none';

                            if (isSwiping) {
                                transformStyle = swipeDirection === 'right'
                                    ? 'translateX(130%) rotate(18deg) scale(0.95)'
                                    : 'translateX(-130%) rotate(-18deg) scale(0.95)';
                                opacityVal = 0;
                                zIndexVal = 10;
                            } else if (pos === 0) {
                                transformStyle = 'translateY(0px) scale(1) rotate(0deg)';
                                opacityVal = 1;
                                zIndexVal = 3;
                            } else if (pos === 1) {
                                transformStyle = 'translateY(18px) scale(0.94) rotate(2deg)';
                                opacityVal = 0.75;
                                zIndexVal = 2;
                                filterVal = 'brightness(0.7)';
                            } else {
                                transformStyle = 'translateY(36px) scale(0.88) rotate(4deg)';
                                opacityVal = 0.45;
                                zIndexVal = 1;
                                filterVal = 'brightness(0.4)';
                            }

                            return (
                                <div
                                    key={s.step}
                                    onClick={() => pos !== 0 && handleNext()}
                                    className="blue-card-glass"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        padding: '32px',
                                        borderRadius: '24px',
                                        textAlign: 'left',
                                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(9, 13, 22, 0.95))',
                                        border: `1.5px solid ${pos === 0 ? s.accent : 'rgba(56, 189, 248, 0.2)'}`,
                                        boxShadow: pos === 0
                                            ? `0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 35px ${s.accent}33`
                                            : '0 10px 30px rgba(0,0,0,0.5)',
                                        transform: transformStyle,
                                        opacity: opacityVal,
                                        zIndex: zIndexVal,
                                        filter: filterVal,
                                        transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        cursor: pos === 0 ? 'grab' : 'pointer',
                                        userSelect: 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justify: 'space-between'
                                    }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                            <span style={{
                                                fontSize: '0.8rem',
                                                fontWeight: 800,
                                                color: s.accent,
                                                letterSpacing: '1.5px',
                                                background: `${s.accent}18`,
                                                border: `1px solid ${s.accent}40`,
                                                padding: '4px 14px',
                                                borderRadius: '20px'
                                            }}>
                                                {s.badge}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                            <div style={{
                                                width: '52px',
                                                height: '52px',
                                                borderRadius: '16px',
                                                background: `linear-gradient(135deg, ${s.accent}30, rgba(37, 99, 235, 0.2))`,
                                                border: `1px solid ${s.accent}50`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: `0 0 15px ${s.accent}40`,
                                                flexShrink: 0,
                                                padding: 0,
                                                margin: 0
                                            }}>
                                                <i className={`fas ${s.icon}`} style={{
                                                    fontSize: '1.5rem',
                                                    color: s.accent,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    lineHeight: 1,
                                                    margin: 0,
                                                    padding: 0,
                                                    width: '100%',
                                                    height: '100%'
                                                }}></i>
                                            </div>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                                                {s.title}
                                            </h3>
                                        </div>

                                        <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: 1.65, margin: 0 }}>
                                            {s.desc}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginTop: '16px' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
                                            Card {idx + 1} of 3 • Tap or Swipe to Next
                                        </span>
                                        <i className="fas fa-hand-pointer" style={{ color: s.accent, fontSize: '0.9rem' }}></i>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px' }}>
                        <button
                            onClick={handlePrev}
                            title="Previous Step Card"
                            style={{
                                width: '46px',
                                height: '46px',
                                borderRadius: '14px',
                                background: 'rgba(15, 23, 42, 0.8)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                color: '#f8fafc',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
                            }}>
                            <i className="fas fa-arrow-left"></i>
                        </button>

                        <button
                            onClick={handleNext}
                            style={{
                                padding: '12px 28px',
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                                border: 'none',
                                color: '#ffffff',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                boxShadow: '0 0 25px rgba(37, 99, 235, 0.6)',
                                transition: 'all 0.2s ease'
                            }}>
                            <span>Swipe Next</span>
                            <i className="fas fa-arrow-right-long"></i>
                        </button>

                        <button
                            onClick={handleNext}
                            title="Next Step Card"
                            style={{
                                width: '46px',
                                height: '46px',
                                borderRadius: '14px',
                                background: 'rgba(15, 23, 42, 0.8)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                color: '#f8fafc',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
                            }}>
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {STEPS.map((s, idx) => (
                        <div
                            key={s.step}
                            className="blue-card-glass"
                            style={{
                                padding: '32px 24px',
                                borderRadius: '20px',
                                textAlign: 'left',
                                position: 'relative',
                                border: `1.5px solid ${s.accent}40`,
                                background: 'rgba(15, 23, 42, 0.8)'
                            }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: s.accent, letterSpacing: '1.5px', marginBottom: '16px', background: `${s.accent}18`, display: 'inline-block', padding: '4px 12px', borderRadius: '20px' }}>
                                {s.badge}
                            </div>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: `${s.accent}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px',
                                padding: 0,
                                margin: '0 0 16px 0'
                            }}>
                                <i className={`fas ${s.icon}`} style={{
                                    fontSize: '1.4rem',
                                    color: s.accent,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justify: 'center',
                                    lineHeight: 1,
                                    margin: 0,
                                    padding: 0,
                                    width: '100%',
                                    height: '100%'
                                }}></i>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: '#f8fafc' }}>{s.title}</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.93rem', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SwipableStepCards;
