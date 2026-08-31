import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AnimatedCerebriumBackground from '../components/AnimatedCerebriumBackground';

// ─── 1. Memory Match Card Game Component ───
const MemoryGame = ({ onScoreEarned }) => {
    const CARD_ITEMS = [
        { icon: 'fa-brain', name: 'AI Core', color: '#38bdf8' },
        { icon: 'fa-microchip', name: 'Quantum', color: '#c084fc' },
        { icon: 'fa-cloud', name: 'Cloud Host', color: '#34d399' },
        { icon: 'fa-vr-cardboard', name: 'Metaverse', color: '#fbbf24' },
        { icon: 'fa-cubes', name: 'Gatherly', color: '#60a5fa' },
        { icon: 'fa-shield-halved', name: 'Security', color: '#f87171' },
    ];

    const generateCards = () => {
        const deck = [...CARD_ITEMS, ...CARD_ITEMS].map((item, idx) => ({
            id: idx,
            ...item,
            isFlipped: false,
            isMatched: false
        }));
        return deck.sort(() => Math.random() - 0.5);
    };

    const [cards, setCards] = useState(generateCards);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [gameWon, setGameWon] = useState(false);

    const handleCardClick = (idx) => {
        if (flippedIndices.length === 2 || cards[idx].isFlipped || cards[idx].isMatched) return;

        const newCards = [...cards];
        newCards[idx].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedIndices, idx];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            const [firstIdx, secondIdx] = newFlipped;
            if (cards[firstIdx].name === cards[secondIdx].name) {
                // Match found
                setTimeout(() => {
                    setCards(prev => {
                        const updated = [...prev];
                        updated[firstIdx].isMatched = true;
                        updated[secondIdx].isMatched = true;
                        return updated;
                    });
                    setMatches(m => {
                        const total = m + 1;
                        if (total === CARD_ITEMS.length) {
                            setGameWon(true);
                            onScoreEarned(150, 'Cyber Memory Master');
                        }
                        return total;
                    });
                    setFlippedIndices([]);
                }, 400);
            } else {
                // No match
                setTimeout(() => {
                    setCards(prev => {
                        const resetCards = [...prev];
                        resetCards[firstIdx].isFlipped = false;
                        resetCards[secondIdx].isFlipped = false;
                        return resetCards;
                    });
                    setFlippedIndices([]);
                }, 800);
            }
        }
    };

    const restart = () => {
        setCards(generateCards());
        setFlippedIndices([]);
        setMoves(0);
        setMatches(0);
        setGameWon(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '14px' }}>
                    <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Moves: <strong style={{ color: '#38bdf8' }}>{moves}</strong></span>
                    <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Matches: <strong style={{ color: '#34d399' }}>{matches} / {CARD_ITEMS.length}</strong></span>
                </div>
                <button onClick={restart} className="btn btn-sm btn-secondary" style={{ borderRadius: '10px', fontSize: '0.8rem', padding: '6px 14px' }}>
                    <i className="fas fa-rotate-right" style={{ marginRight: '6px' }}></i> Restart
                </button>
            </div>

            {gameWon && (
                <div style={{ background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(37, 99, 235, 0.2))', border: '1.5px solid #34d399', borderRadius: '16px', padding: '14px 20px', textAlign: 'center', marginBottom: '16px', width: '100%', boxSizing: 'border-box' }}>
                    <h4 style={{ margin: '0 0 4px', color: '#34d399', fontSize: '1.1rem' }}>🎉 Hack Complete! +150 Points</h4>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1' }}>You matched all security cores in {moves} moves!</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', width: '100%', maxWidth: '420px' }}>
                {cards.map((card, idx) => (
                    <div
                        key={card.id}
                        onClick={() => handleCardClick(idx)}
                        style={{
                            height: '75px',
                            borderRadius: '12px',
                            background: card.isFlipped || card.isMatched
                                ? 'rgba(15, 23, 42, 0.9)'
                                : 'linear-gradient(135deg, #1e293b, #0f172a)',
                            border: card.isMatched
                                ? `2px solid ${card.color}`
                                : (card.isFlipped ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.12)'),
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: card.isMatched ? `0 0 15px ${card.color}40` : 'none',
                            transform: card.isFlipped || card.isMatched ? 'scale(1.02)' : 'scale(1)'
                        }}>
                        {card.isFlipped || card.isMatched ? (
                            <>
                                <i className={`fas ${card.icon}`} style={{ fontSize: '1.4rem', color: card.color, marginBottom: '4px' }}></i>
                                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#e2e8f0' }}>{card.name}</span>
                            </>
                        ) : (
                            <i className="fas fa-shield-halved" style={{ fontSize: '1.3rem', color: '#475569' }}></i>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── 2. Cyber Paddle Pong Mini-Game Component ───
const CyberPongGame = ({ onScoreEarned }) => {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (!isPlaying) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animationFrameId;
        let paddleWidth = 70;
        let paddleHeight = 10;
        let paddleX = (canvas.width - paddleWidth) / 2;
        let ballX = canvas.width / 2;
        let ballY = canvas.height - 30;
        let dx = 3;
        let dy = -3;
        let currentScore = 0;

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            if (relativeX > 0 && relativeX < canvas.width) {
                paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, relativeX - paddleWidth / 2));
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                const rect = canvas.getBoundingClientRect();
                const relativeX = e.touches[0].clientX - rect.left;
                if (relativeX > 0 && relativeX < canvas.width) {
                    paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, relativeX - paddleWidth / 2));
                }
            }
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('touchmove', handleTouchMove);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Ball
            ctx.beginPath();
            ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.closePath();

            // Paddle
            ctx.beginPath();
            ctx.roundRect(paddleX, canvas.height - paddleHeight - 6, paddleWidth, paddleHeight, 5);
            ctx.fillStyle = '#34d399';
            ctx.shadowColor = '#34d399';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.closePath();

            // Bounce off left / right walls
            if (ballX + dx > canvas.width - 6 || ballX + dx < 6) {
                dx = -dx;
            }

            // Bounce off top wall
            if (ballY + dy < 6) {
                dy = -dy;
            } else if (ballY + dy > canvas.height - paddleHeight - 12) {
                // Check if hit paddle
                if (ballX > paddleX - 4 && ballX < paddleX + paddleWidth + 4) {
                    dy = -dy;
                    currentScore += 10;
                    setScore(currentScore);
                    // Slight speed increase
                    dx = dx > 0 ? dx + 0.15 : dx - 0.15;
                    dy = dy > 0 ? dy + 0.15 : dy - 0.15;
                } else if (ballY + dy > canvas.height - 6) {
                    // Game Over
                    setIsPlaying(false);
                    setGameOver(true);
                    if (currentScore > 0) {
                        onScoreEarned(currentScore, 'Cyber Pong Champ');
                    }
                    cancelAnimationFrame(animationFrameId);
                    return;
                }
            }

            ballX += dx;
            ballY += dy;
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isPlaying]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Live Score: <strong style={{ color: '#34d399' }}>{score} pts</strong></span>
                <span style={{ fontSize: '0.78rem', color: '#38bdf8' }}>🖱️ Move mouse / swipe to bounce</span>
            </div>

            <canvas
                ref={canvasRef}
                width={360}
                height={220}
                style={{
                    background: 'radial-gradient(ellipse at center, #0f172a 0%, #030712 100%)',
                    border: '1.5px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '18px',
                    boxShadow: '0 0 30px rgba(56, 189, 248, 0.2)',
                    cursor: 'crosshair',
                    touchAction: 'none'
                }}
            />

            <div style={{ marginTop: '14px', display: 'flex', gap: '12px' }}>
                {!isPlaying && (
                    <button
                        onClick={() => { setScore(0); setGameOver(false); setIsPlaying(true); }}
                        className="btn btn-primary"
                        style={{ borderRadius: '12px', padding: '10px 24px', fontWeight: 700, boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)' }}>
                        <i className="fas fa-play" style={{ marginRight: '6px' }}></i> {gameOver ? 'Play Again' : 'Start Pong'}
                    </button>
                )}
                {isPlaying && (
                    <button
                        onClick={() => setIsPlaying(false)}
                        className="btn btn-secondary"
                        style={{ borderRadius: '12px', padding: '10px 20px', fontSize: '0.88rem' }}>
                        Pause
                    </button>
                )}
            </div>
        </div>
    );
};

// ─── 3. Lucky Prize Spinner Component ───
const LuckySpinner = ({ onScoreEarned }) => {
    const PRIZES = [
        { label: '+50 XP Points', value: 50, color: '#38bdf8' },
        { label: 'VIP Pass Badge', value: 200, color: '#fbbf24' },
        { label: '+100 XP Points', value: 100, color: '#34d399' },
        { label: 'Free Drink Token', value: 75, color: '#c084fc' },
        { label: '+250 Jackpot', value: 250, color: '#f472b6' },
        { label: 'Swag Bag Voucher', value: 120, color: '#60a5fa' }
    ];

    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [wonPrize, setWonPrize] = useState(null);

    const handleSpin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setWonPrize(null);

        const randomIndex = Math.floor(Math.random() * PRIZES.length);
        const extraTurns = 5 + Math.floor(Math.random() * 3);
        const degreesPerSlice = 360 / PRIZES.length;
        const targetDeg = extraTurns * 360 + randomIndex * degreesPerSlice;

        setRotation(prev => prev + targetDeg);

        setTimeout(() => {
            setIsSpinning(false);
            const prize = PRIZES[randomIndex];
            setWonPrize(prize);
            onScoreEarned(prize.value, prize.label);
        }, 3200);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Pointer Indicator */}
            <div style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '20px solid #fbbf24', zIndex: 10, filter: 'drop-shadow(0 0 8px #fbbf24)' }}></div>

            {/* Glowing Wheel Container */}
            <div style={{
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                border: '4px solid rgba(56, 189, 248, 0.5)',
                boxShadow: '0 0 35px rgba(56, 189, 248, 0.3)',
                background: 'conic-gradient(#38bdf8 0deg 60deg, #fbbf24 60deg 120deg, #34d399 120deg 180deg, #c084fc 180deg 240deg, #f472b6 240deg 300deg, #60a5fa 300deg 360deg)',
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 3.2s cubic-bezier(0.15, 0.9, 0.25, 1)',
                display: 'grid',
                placeItems: 'center',
                margin: '10px 0 20px',
                position: 'relative'
            }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#090d16', border: '3px solid #fff', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '1.2rem', boxShadow: '0 0 15px rgba(0,0,0,0.8)' }}>
                    <i className="fas fa-gift" style={{ color: '#fbbf24' }}></i>
                </div>
            </div>

            {wonPrize && (
                <div style={{ background: 'rgba(251, 191, 36, 0.15)', border: '1.5px solid #fbbf24', borderRadius: '14px', padding: '12px 20px', textAlign: 'center', marginBottom: '14px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 800 }}>SPIN RESULT</span>
                    <h4 style={{ margin: '2px 0 0', color: '#fff', fontSize: '1.1rem' }}>🎉 You Won: {wonPrize.label}!</h4>
                </div>
            )}

            <button
                disabled={isSpinning}
                onClick={handleSpin}
                className="btn btn-primary"
                style={{ borderRadius: '12px', padding: '12px 28px', fontWeight: 800, fontSize: '0.95rem', background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: '#090d16', boxShadow: '0 0 25px rgba(251, 191, 36, 0.4)' }}>
                {isSpinning ? 'Spinning...' : '🎰 Spin the Wheel'}
            </button>
        </div>
    );
};

// ─── Main Gamification & Files Lounge ───
const GamificationFiles = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('arcade'); // 'arcade', 'leaderboard', 'files'
    const [selectedGame, setSelectedGame] = useState('memory'); // 'memory', 'pong', 'spinner'

    const [userPoints, setUserPoints] = useState(() => {
        const saved = localStorage.getItem('gatherly_user_points');
        return saved ? parseInt(saved, 10) : 350;
    });

    const [leaderboard, setLeaderboard] = useState([
        { id: 1, name: 'Sarah Jenkins', points: 680, badge: 'VIP Master', avatar: 'S', color: '#38bdf8' },
        { id: 2, name: 'Alex Rivera', points: 540, badge: 'Event Champion', avatar: 'A', color: '#c084fc' },
        { id: 3, name: user?.name || 'You (Active Player)', points: userPoints, badge: 'Cyber Challenger', avatar: 'U', color: '#34d399', isUser: true },
        { id: 4, name: 'Ramesh Adhikari', points: 450, badge: 'Gold Volunteer', avatar: 'R', color: '#fbbf24' },
        { id: 5, name: 'Elena Rostova', points: 390, badge: 'Tech Enthusiast', avatar: 'E', color: '#f472b6' }
    ]);

    const [files, setFiles] = useState([
        { id: 'f-1', name: 'Global_Summit_2026_Brochure.pdf', size: '2.8 MB', category: 'Documentation', icon: 'fa-file-pdf', color: '#ef4444' },
        { id: 'f-2', name: 'Main_Hall_A_Blueprint.png', size: '5.4 MB', category: 'Blueprint', icon: 'fa-file-image', color: '#38bdf8' },
        { id: 'f-3', name: 'Opening_Keynote_SlideDeck.pptx', size: '14.2 MB', category: 'Presentation', icon: 'fa-file-powerpoint', color: '#fbbf24' },
        { id: 'f-4', name: 'VIP_Attendee_CheckIn_List.csv', size: '840 KB', category: 'Data Sheet', icon: 'fa-file-csv', color: '#34d399' }
    ]);

    const handleScoreEarned = (pointsToAdd, gameTitle) => {
        const updated = userPoints + pointsToAdd;
        setUserPoints(updated);
        localStorage.setItem('gatherly_user_points', String(updated));
        showToast(`🎮 +${pointsToAdd} XP earned from ${gameTitle}!`, 'success');

        // Update leaderboard
        setLeaderboard(prev => {
            const list = prev.map(p => p.isUser ? { ...p, points: updated } : p);
            return list.sort((a, b) => b.points - a.points);
        });
    };

    const handleDownloadFile = (fileName) => {
        showToast(`📥 Downloading "${fileName}"...`, 'info');
    };

    return (
        <div style={{
            minHeight: '100vh',
            padding: '24px 20px 60px',
            backgroundColor: '#030712',
            backgroundImage: `
                radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.25) 0%, rgba(37, 99, 235, 0.12) 35%, transparent 65%),
                radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.18) 0%, transparent 50%),
                radial-gradient(circle at 10% 60%, rgba(20, 184, 166, 0.15) 0%, transparent 45%),
                linear-gradient(to right, rgba(56, 189, 248, 0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(56, 189, 248, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 48px 48px, 48px 48px',
            backgroundAttachment: 'fixed',
            color: '#f8fafc'
        }}>
            {/* Cerebrium Canvas Animated Background */}
            <AnimatedCerebriumBackground />

            {/* Top Navigation Bar with Back to Home & Portal Switcher */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 24px',
                borderRadius: '20px',
                background: 'rgba(9, 14, 28, 0.85)',
                border: '1.5px solid rgba(56, 189, 248, 0.3)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(20px)'
            }}>
                <button
                    onClick={() => navigate('/')}
                    className="btn btn-secondary"
                    style={{
                        borderRadius: '12px',
                        padding: '8px 18px',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        background: 'rgba(56, 189, 248, 0.12)',
                        color: '#38bdf8',
                        border: '1.5px solid rgba(56, 189, 248, 0.35)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                    <i className="fas fa-arrow-left"></i> Back to Home
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-cubes brand-logo" style={{ color: '#38bdf8', fontSize: '1.3rem' }}></i>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.3px' }}>Gatherly Arcade Lounge</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {user ? (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn blue-glow-btn"
                            style={{ borderRadius: '12px', padding: '8px 18px', fontSize: '0.88rem', fontWeight: 700 }}>
                            <i className="fas fa-th-large" style={{ marginRight: '6px' }}></i> Dashboard
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="btn blue-glow-btn"
                            style={{ borderRadius: '12px', padding: '8px 18px', fontSize: '0.88rem', fontWeight: 700 }}>
                            <i className="fas fa-right-to-bracket" style={{ marginRight: '6px' }}></i> Sign In
                        </button>
                    )}
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Hero Banner with Cerebrium Cyber Aesthetic */}
                <div className="page-hero anim-fade-down" style={{
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(124, 58, 237, 0.2) 50%, rgba(56, 189, 248, 0.15) 100%)',
                    border: '1.5px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '26px',
                    padding: '32px',
                    marginBottom: '28px',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)'
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '20px', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(124, 58, 237, 0.6)', border: '1px solid rgba(255, 255, 255, 0.25)', flexShrink: 0, animation: 'floatUpDown 3s ease-in-out infinite' }}>
                            <i className="fas fa-gamepad" style={{ color: '#fff', fontSize: '1.8rem' }}></i>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                <h1 className="page-hero-title" style={{ fontSize: '1.9rem', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>Gamification & Arcade Lounge</h1>
                                <span style={{ background: 'rgba(251, 191, 36, 0.18)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)', padding: '3px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.5px' }}>🎮 LIVE ARCADE</span>
                            </div>
                            <p className="page-hero-sub" style={{ margin: 0, fontSize: '0.95rem', color: '#94a3b8' }}>Play retro mini-games, earn event leaderboard XP, unlock prizes, and access shared summit media files</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(15, 23, 42, 0.75)', border: '1.5px solid rgba(56, 189, 248, 0.35)', padding: '12px 22px', borderRadius: '20px', boxShadow: '0 0 25px rgba(56, 189, 248, 0.15)' }}>
                        <i className="fas fa-trophy" style={{ color: '#fbbf24', fontSize: '1.4rem' }}></i>
                        <div>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Your Total Points</span>
                            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8' }}>{userPoints.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>XP</span></div>
                        </div>
                        <button onClick={() => navigate('/qr')} title="Issue Certificates" className="btn btn-sm btn-primary" style={{ marginLeft: '10px', borderRadius: '10px', fontSize: '0.8rem' }}>
                            <i className="fas fa-award"></i> Claim Certificate
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                <button
                    onClick={() => setActiveTab('arcade')}
                    style={{
                        padding: '10px 22px',
                        borderRadius: '14px',
                        border: activeTab === 'arcade' ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                        background: activeTab === 'arcade' ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(56, 189, 248, 0.2))' : 'rgba(15, 23, 42, 0.6)',
                        color: activeTab === 'arcade' ? '#ffffff' : '#94a3b8',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                    <i className="fas fa-gamepad" style={{ color: '#38bdf8' }}></i> Arcade Games Lounge
                </button>

                <button
                    onClick={() => setActiveTab('leaderboard')}
                    style={{
                        padding: '10px 22px',
                        borderRadius: '14px',
                        border: activeTab === 'leaderboard' ? '1.5px solid #fbbf24' : '1px solid rgba(255,255,255,0.08)',
                        background: activeTab === 'leaderboard' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                        color: activeTab === 'leaderboard' ? '#ffffff' : '#94a3b8',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                    <i className="fas fa-ranking-star" style={{ color: '#fbbf24' }}></i> Points Leaderboard
                </button>

                <button
                    onClick={() => setActiveTab('files')}
                    style={{
                        padding: '10px 22px',
                        borderRadius: '14px',
                        border: activeTab === 'files' ? '1.5px solid #34d399' : '1px solid rgba(255,255,255,0.08)',
                        background: activeTab === 'files' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                        color: activeTab === 'files' ? '#ffffff' : '#94a3b8',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                    <i className="fas fa-folder-open" style={{ color: '#34d399' }}></i> Shared Event Files
                </button>
            </div>

            {/* TAB 1: Arcade Games Lounge */}
            {activeTab === 'arcade' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    {/* Game Selector Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {[
                            { id: 'memory', title: 'Cyber Security Match', desc: 'Flip and match crypto tech security badges against the clock', icon: 'fa-brain', color: '#38bdf8', reward: '+150 XP' },
                            { id: 'pong', title: 'Retro Cyber Paddle Pong', desc: 'Bounce the cyber photon particle and challenge high reflex scores', icon: 'fa-table-tennis-paddle-ball', color: '#34d399', reward: '+10 XP / hit' },
                            { id: 'spinner', title: 'Lucky Prize Spinner', desc: 'Spin the high-tech wheel to unlock VIP perks & summit bonuses', icon: 'fa-gift', color: '#fbbf24', reward: 'Up to +250 XP' }
                        ].map(g => (
                            <div
                                key={g.id}
                                onClick={() => setSelectedGame(g.id)}
                                style={{
                                    background: selectedGame === g.id
                                        ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)'
                                        : 'rgba(15, 23, 42, 0.75)',
                                    border: selectedGame === g.id ? `2px solid ${g.color}` : '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '20px',
                                    padding: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s ease',
                                    boxShadow: selectedGame === g.id ? `0 0 25px ${g.color}30` : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${g.color}22`, border: `1px solid ${g.color}50`, display: 'grid', placeItems: 'center', color: g.color, fontSize: '1.3rem', flexShrink: 0 }}>
                                    <i className={`fas ${g.icon}`}></i>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>{g.title}</h4>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: g.color, background: `${g.color}20`, padding: '2px 8px', borderRadius: '10px' }}>{g.reward}</span>
                                    </div>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>{g.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Active Arcade Game Display Console */}
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.88)',
                        border: '1.5px solid rgba(56, 189, 248, 0.35)',
                        borderRadius: '24px',
                        padding: '28px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(16px)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-desktop" style={{ color: '#38bdf8' }}></i>
                                {selectedGame === 'memory' && 'Cyber Security Card Match'}
                                {selectedGame === 'pong' && 'Retro Cyber Paddle Pong'}
                                {selectedGame === 'spinner' && 'Lucky Prize Wheel Spinner'}
                            </h3>
                            <span style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
                                Interactive Game Ready
                            </span>
                        </div>

                        {selectedGame === 'memory' && <MemoryGame onScoreEarned={handleScoreEarned} />}
                        {selectedGame === 'pong' && <CyberPongGame onScoreEarned={handleScoreEarned} />}
                        {selectedGame === 'spinner' && <LuckySpinner onScoreEarned={handleScoreEarned} />}
                    </div>
                </div>
            )}

            {/* TAB 2: Leaderboard */}
            {activeTab === 'leaderboard' && (
                <div style={{
                    background: 'rgba(15, 23, 42, 0.88)',
                    border: '1.5px solid rgba(251, 191, 36, 0.35)',
                    borderRadius: '24px',
                    padding: '28px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(16px)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-trophy" style={{ color: '#fbbf24' }}></i>
                                Summit Leaderboard & XP Standings
                            </h3>
                            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Play games, complete tasks, and check into sessions to rank up</p>
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fbbf24', background: 'rgba(251, 191, 36, 0.18)', padding: '6px 14px', borderRadius: '14px' }}>
                            Top 5 Champions
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {leaderboard.map((item, idx) => (
                            <div
                                key={item.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px 20px',
                                    background: item.isUser ? 'rgba(37, 99, 235, 0.2)' : 'rgba(9, 13, 22, 0.75)',
                                    border: item.isUser ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '16px',
                                    boxShadow: item.isUser ? '0 0 20px rgba(56, 189, 248, 0.2)' : 'none'
                                }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: idx === 0 ? '#fbbf24' : (idx === 1 ? '#94a3b8' : (idx === 2 ? '#d97706' : '#64748b')), width: '28px' }}>
                                        #{idx + 1}
                                    </span>
                                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${item.color}22`, border: `1px solid ${item.color}50`, display: 'grid', placeItems: 'center', color: item.color, fontWeight: 900, fontSize: '1rem' }}>
                                        {item.avatar}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>{item.name}</h4>
                                            {item.isUser && <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.2)', padding: '2px 6px', borderRadius: '8px' }}>YOU</span>}
                                        </div>
                                        <span style={{ fontSize: '0.78rem', color: item.color, fontWeight: 700 }}>{item.badge}</span>
                                    </div>
                                </div>

                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: item.color }}>
                                    {item.points.toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>XP</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 3: Shared Event File Vault */}
            {activeTab === 'files' && (
                <div style={{
                    background: 'rgba(15, 23, 42, 0.88)',
                    border: '1.5px solid rgba(52, 211, 153, 0.35)',
                    borderRadius: '24px',
                    padding: '28px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(16px)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-folder-open" style={{ color: '#34d399' }}></i>
                                Shared Event Media & Documentation Vault
                            </h3>
                            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Official brochures, blueprints, slides, and rosters</p>
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399', background: 'rgba(52, 211, 153, 0.18)', padding: '6px 14px', borderRadius: '14px' }}>
                            {files.length} Available Files
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        {files.map(f => (
                            <div
                                key={f.id}
                                style={{
                                    background: 'rgba(9, 13, 22, 0.75)',
                                    border: `1.5px solid ${f.color}40`,
                                    borderRadius: '18px',
                                    padding: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    gap: '14px'
                                }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: `${f.color}20`, border: `1px solid ${f.color}50`, display: 'grid', placeItems: 'center', color: f.color, fontSize: '1.3rem', flexShrink: 0 }}>
                                        <i className={`fas ${f.icon}`}></i>
                                    </div>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</h4>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.72rem', color: f.color, fontWeight: 700 }}>{f.category}</span>
                                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>•</span>
                                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{f.size}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDownloadFile(f.name)}
                                    className="btn btn-secondary btn-sm"
                                    style={{ width: '100%', borderRadius: '10px', justifyContent: 'center', fontSize: '0.84rem' }}>
                                    <i className="fas fa-download" style={{ marginRight: '6px' }}></i> Download Asset
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default GamificationFiles;
