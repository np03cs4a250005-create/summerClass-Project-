import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundFx } from '../utils/soundEffects';

// ─────────────────────────────────────────────────────────────────────────────
// Gatherly Cyber Arcade — 3 Games: Tic-Tac-Toe, Memory Match, Cyber Snake
// ─────────────────────────────────────────────────────────────────────────────

const WINNING_COMBOS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
];

// ── GAME 1: TIC-TAC-TOE (vs AI + 2-Player) ───────────────────────────────────
const TicTacToe = () => {
    const [board, setBoard]           = useState(Array(9).fill(null));
    const [isXTurn, setIsXTurn]       = useState(true);
    const [winner, setWinner]         = useState(null);
    const [winLine, setWinLine]       = useState([]);
    const [mode, setMode]             = useState('ai');        // 'ai' | '2p'
    const [scores, setScores]         = useState({ X: 0, O: 0, D: 0 });
    const [p1Name, setP1Name]         = useState('Player 1');
    const [p2Name, setP2Name]         = useState('Player 2');
    const [showNameSetup, setShowNameSetup] = useState(false);

    const checkWin = (b) => {
        for (let [a, c, d] of WINNING_COMBOS) {
            if (b[a] && b[a] === b[c] && b[a] === b[d]) return { w: b[a], line: [a, c, d] };
        }
        if (b.every(v => v)) return { w: 'D', line: [] };
        return null;
    };

    const aiMove = useCallback((b) => {
        for (let [a, c, d] of WINNING_COMBOS) {
            const vals = [b[a], b[c], b[d]];
            if (vals.filter(v => v === 'O').length === 2 && vals.includes(null))
                return [a,c,d][vals.indexOf(null)];
        }
        for (let [a, c, d] of WINNING_COMBOS) {
            const vals = [b[a], b[c], b[d]];
            if (vals.filter(v => v === 'X').length === 2 && vals.includes(null))
                return [a,c,d][vals.indexOf(null)];
        }
        if (b[4] === null) return 4;
        const corners = [0,2,6,8].filter(i => b[i] === null);
        if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
        const open = b.map((v,i) => v === null ? i : -1).filter(v => v >= 0);
        return open.length ? open[Math.floor(Math.random() * open.length)] : null;
    }, []);

    const handleClick = (idx) => {
        if (board[idx] || winner) return;
        soundFx.playWaterClick();
        const nb = [...board];
        nb[idx] = isXTurn ? 'X' : 'O';
        setBoard(nb);
        const res = checkWin(nb);
        if (res) {
            setWinner(res.w);
            setWinLine(res.line);
            setScores(s => ({ ...s, [res.w]: (s[res.w] || 0) + 1 }));
            return;
        }
        if (mode === 'ai' && isXTurn) {
            setIsXTurn(false);
        } else {
            setIsXTurn(t => !t);
        }
    };

    useEffect(() => {
        if (mode === 'ai' && !isXTurn && !winner) {
            const t = setTimeout(() => {
                const idx = aiMove(board);
                if (idx !== null) {
                    soundFx.playWaterClick();
                    const nb = [...board]; nb[idx] = 'O'; setBoard(nb);
                    const res = checkWin(nb);
                    if (res) { setWinner(res.w); setWinLine(res.line); setScores(s => ({ ...s, [res.w]: (s[res.w]||0)+1 })); }
                    else setIsXTurn(true);
                }
            }, 500);
            return () => clearTimeout(t);
        }
    }, [isXTurn, board, winner, mode, aiMove]);

    const reset = () => { setBoard(Array(9).fill(null)); setIsXTurn(true); setWinner(null); setWinLine([]); };

    const statusMsg = () => {
        if (winner === 'D') return '🤝 Draw! Great match!';
        if (winner === 'X') return mode === 'ai' ? '🎉 You Win!' : `🎉 ${p1Name} Wins!`;
        if (winner === 'O') return mode === 'ai' ? '🤖 AI Wins!' : `🏆 ${p2Name} Wins!`;
        if (mode === 'ai') return isXTurn ? '👉 Your Turn (X)' : '🤖 AI Thinking...';
        return isXTurn ? `👉 ${p1Name}'s Turn (X)` : `👉 ${p2Name}'s Turn (O)`;
    };

    const COLORS = { X: '#38bdf8', O: '#f472b6' };

    return (
        <div>
            {/* Mode selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', justifyContent: 'center' }}>
                {[{ v: 'ai', label: '🤖 vs AI' }, { v: '2p', label: '👥 2 Players' }].map(({ v, label }) => (
                    <button key={v} onClick={() => { setMode(v); reset(); if (v === '2p') setShowNameSetup(true); }}
                        style={{ padding: '7px 18px', borderRadius: '10px', border: `1px solid ${mode === v ? '#818cf8' : 'rgba(255,255,255,0.1)'}`, background: mode === v ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)', color: mode === v ? '#818cf8' : '#94a3b8', cursor: 'pointer', fontWeight: 700, fontSize: '0.84rem' }}>
                        {label}
                    </button>
                ))}
            </div>

            {/* Name setup for 2P */}
            {mode === '2p' && showNameSetup && (
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '14px', marginBottom: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <input value={p1Name} onChange={e => setP1Name(e.target.value)} placeholder="Player 1 (X)" className="form-input" style={{ flex: 1, minWidth: '100px', padding: '8px 12px', fontSize: '0.85rem' }} />
                    <input value={p2Name} onChange={e => setP2Name(e.target.value)} placeholder="Player 2 (O)" className="form-input" style={{ flex: 1, minWidth: '100px', padding: '8px 12px', fontSize: '0.85rem' }} />
                    <button onClick={() => setShowNameSetup(false)} style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(99,102,241,0.3)', border: '1px solid #818cf8', color: '#818cf8', cursor: 'pointer', fontWeight: 700 }}>✔</button>
                </div>
            )}

            {/* Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                {[
                    { label: mode === 'ai' ? 'YOU (X)' : `${p1Name} (X)`, val: scores.X, color: COLORS.X },
                    { label: 'DRAWS', val: scores.D, color: '#fbbf24' },
                    { label: mode === 'ai' ? 'AI (O)' : `${p2Name} (O)`, val: scores.O, color: COLORS.O },
                ].map(({ label, val, color }) => (
                    <div key={label} style={{ textAlign: 'center', background: 'rgba(0,0,0,0.25)', borderRadius: '10px', padding: '8px' }}>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>{label}</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color }}>{val}</div>
                    </div>
                ))}
            </div>

            {/* Status */}
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: winner ? '#fbbf24' : isXTurn ? COLORS.X : COLORS.O }}>{statusMsg()}</span>
            </div>

            {/* Board */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', width: '252px', margin: '0 auto 18px' }}>
                {board.map((cell, i) => {
                    const win = winLine.includes(i);
                    return (
                        <button key={i} onClick={() => handleClick(i)}
                            disabled={!!cell || !!winner || (mode === 'ai' && !isXTurn)}
                            style={{ height: '78px', borderRadius: '14px', border: win ? '2px solid #fbbf24' : `1px solid ${cell ? (COLORS[cell] + '55') : 'rgba(255,255,255,0.1)'}`, background: win ? 'rgba(251,191,36,0.18)' : cell === 'X' ? 'rgba(56,189,248,0.15)' : cell === 'O' ? 'rgba(244,114,182,0.15)' : 'rgba(15,23,42,0.7)', color: cell ? COLORS[cell] : 'transparent', fontSize: '2rem', fontWeight: 900, cursor: !cell && !winner ? 'pointer' : 'default', transition: 'all 0.18s', boxShadow: win ? '0 0 18px rgba(251,191,36,0.5)' : cell ? `0 0 12px ${COLORS[cell]}44` : 'none' }}>
                            {cell || ''}
                        </button>
                    );
                })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={reset} style={{ padding: '9px 22px', borderRadius: '10px', background: 'rgba(56,189,248,0.15)', border: '1px solid #38bdf8', color: '#38bdf8', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fas fa-redo"></i> New Game
                </button>
            </div>
        </div>
    );
};

// ── GAME 2: MEMORY MATCH ───────────────────────────────────────────────────────
const EMOJIS = ['🚀','🌟','🎮','⚡','🎯','🔮','🌈','🦄'];
const makeCards = () => {
    const deck = [...EMOJIS, ...EMOJIS].map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }));
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

const MemoryMatch = () => {
    const [cards, setCards]   = useState(makeCards);
    const [flipped, setFlipped] = useState([]);
    const [moves, setMoves]   = useState(0);
    const [matched, setMatched] = useState(0);
    const [locked, setLocked] = useState(false);
    const [best, setBest]     = useState(null);

    const handleCardClick = (idx) => {
        if (locked || cards[idx].flipped || cards[idx].matched || flipped.length === 2) return;
        soundFx.playWaterClick();
        const newCards = cards.map((c, i) => i === idx ? { ...c, flipped: true } : c);
        setCards(newCards);
        const newFlipped = [...flipped, idx];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            setLocked(true);
            const [a, b] = newFlipped;
            if (newCards[a].emoji === newCards[b].emoji) {
                setTimeout(() => {
                    setCards(prev => prev.map((c, i) => i === a || i === b ? { ...c, matched: true } : c));
                    setMatched(m => m + 1);
                    setFlipped([]);
                    setLocked(false);
                }, 400);
            } else {
                setTimeout(() => {
                    setCards(prev => prev.map((c, i) => i === a || i === b ? { ...c, flipped: false } : c));
                    setFlipped([]);
                    setLocked(false);
                }, 900);
            }
        }
    };

    const reset = () => {
        if (matched === 8 && (best === null || moves < best)) setBest(moves);
        setCards(makeCards()); setFlipped([]); setMoves(0); setMatched(0); setLocked(false);
    };

    const won = matched === 8;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '6px 14px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 700 }}>MOVES</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>{moves}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '6px 14px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 700 }}>PAIRS</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>{matched}/8</div>
                    </div>
                    {best && (
                        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '6px 14px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 700 }}>BEST</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>{best}</div>
                        </div>
                    )}
                </div>
                <button onClick={reset} style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(56,189,248,0.15)', border: '1px solid #38bdf8', color: '#38bdf8', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>
                    <i className="fas fa-redo"></i> New Game
                </button>
            </div>

            {won && (
                <div style={{ textAlign: 'center', marginBottom: '12px', padding: '10px', background: 'rgba(52,211,153,0.15)', border: '1px solid #34d399', borderRadius: '12px' }}>
                    <span style={{ color: '#34d399', fontWeight: 800 }}>🎉 You matched all pairs in {moves} moves!</span>
                </div>
            )}

            {/* 3D Flip Card styles injected via style tag */}
            <style>{`
                .flip-card { perspective: 600px; }
                .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.45s cubic-bezier(0.4,0,0.2,1); transform-style: preserve-3d; }
                .flip-card.flipped .flip-card-inner,
                .flip-card.matched .flip-card-inner { transform: rotateY(180deg); }
                .flip-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
                .flip-back { transform: rotateY(180deg); }
            `}</style>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', maxWidth: '296px', margin: '0 auto' }}>
                {cards.map((card, i) => (
                    <div
                        key={card.id}
                        className={`flip-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
                        onClick={() => handleCardClick(i)}
                        style={{ height: '64px', cursor: !card.flipped && !card.matched ? 'pointer' : 'default' }}
                    >
                        <div className="flip-card-inner">
                            {/* FRONT — Hidden face (question mark) */}
                            <div className="flip-face flip-front" style={{
                                background: 'rgba(15,23,42,0.9)',
                                border: '1px solid rgba(99,102,241,0.3)',
                                fontSize: '1.5rem',
                                boxShadow: 'inset 0 0 12px rgba(99,102,241,0.1)',
                            }}>❓</div>
                            {/* BACK — Revealed emoji face */}
                            <div className="flip-face flip-back" style={{
                                background: card.matched ? 'rgba(52,211,153,0.18)' : 'rgba(99,102,241,0.22)',
                                border: card.matched ? '2px solid #34d399' : '2px solid #818cf8',
                                fontSize: '1.5rem',
                                boxShadow: card.matched ? '0 0 14px rgba(52,211,153,0.5)' : '0 0 14px rgba(99,102,241,0.4)',
                            }}>{card.emoji}</div>
                        </div>
                    </div>
                ))}
            </div>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.78rem', marginTop: '12px' }}>
                Flip cards to find matching pairs!
            </p>
        </div>
    );
};

// ── GAME 3: CYBER SNAKE ────────────────────────────────────────────────────────
const COLS = 16, ROWS = 12;
const DIR = { UP: [0,-1], DOWN: [0,1], LEFT: [-1,0], RIGHT: [1,0] };

const randFood = (snake) => {
    let pos;
    do { pos = [Math.floor(Math.random()*COLS), Math.floor(Math.random()*ROWS)]; }
    while (snake.some(s => s[0] === pos[0] && s[1] === pos[1]));
    return pos;
};

const CyberSnake = () => {
    const initSnake = [[8,6],[7,6],[6,6]];
    const [snake, setSnake]   = useState(initSnake);
    const [dir, setDir]       = useState(DIR.RIGHT);
    const [food, setFood]     = useState([12, 4]);
    const [running, setRunning] = useState(false);
    const [dead, setDead]     = useState(false);
    const [score, setScore]   = useState(0);
    const [best, setBest]     = useState(0);
    const dirRef              = useRef(DIR.RIGHT);
    const snakeRef            = useRef(initSnake);
    const foodRef             = useRef([12,4]);

    const reset = () => {
        const s = [[8,6],[7,6],[6,6]];
        snakeRef.current = s; dirRef.current = DIR.RIGHT; foodRef.current = [12,4];
        setSnake(s); setDir(DIR.RIGHT); setFood([12,4]); setDead(false); setScore(0); setRunning(false);
    };

    useEffect(() => {
        const handleKey = (e) => {
            const map = { ArrowUp: DIR.UP, ArrowDown: DIR.DOWN, ArrowLeft: DIR.LEFT, ArrowRight: DIR.RIGHT, w: DIR.UP, s: DIR.DOWN, a: DIR.LEFT, d: DIR.RIGHT };
            const nd = map[e.key];
            if (!nd) return;
            e.preventDefault();
            const cur = dirRef.current;
            // Prevent reversing
            if (nd[0] === -cur[0] && nd[1] === -cur[1]) return;
            dirRef.current = nd;
            setDir(nd);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    useEffect(() => {
        if (!running || dead) return;
        const iv = setInterval(() => {
            const s = snakeRef.current;
            const d = dirRef.current;
            const head = [s[0][0] + d[0], s[0][1] + d[1]];
            // Wall collision
            if (head[0] < 0 || head[0] >= COLS || head[1] < 0 || head[1] >= ROWS) {
                setDead(true); setRunning(false);
                setScore(sc => { setBest(b => Math.max(b, sc)); return sc; });
                return;
            }
            // Self collision
            if (s.some(seg => seg[0] === head[0] && seg[1] === head[1])) {
                setDead(true); setRunning(false);
                setScore(sc => { setBest(b => Math.max(b, sc)); return sc; });
                return;
            }
            const ate = head[0] === foodRef.current[0] && head[1] === foodRef.current[1];
            const newSnake = ate ? [head, ...s] : [head, ...s.slice(0,-1)];
            snakeRef.current = newSnake;
            setSnake([...newSnake]);
            if (ate) {
                soundFx.playWaterClick();
                const newFood = randFood(newSnake);
                foodRef.current = newFood;
                setFood(newFood);
                setScore(sc => sc + 10);
            }
        }, 200);
        return () => clearInterval(iv);
    }, [running, dead]);

    const cellSize = 22;
    const isHead = (x, y) => snake.length > 0 && snake[0][0] === x && snake[0][1] === y;
    const isSnake = (x, y) => snake.some((s, i) => i > 0 && s[0] === x && s[1] === y);
    const isFood = (x, y) => food[0] === x && food[1] === y;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '6px 14px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 700 }}>SCORE</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>{score}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '6px 14px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 700 }}>BEST</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>{best}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {!running && !dead && (
                        <button onClick={() => setRunning(true)} style={{ padding: '8px 18px', borderRadius: '10px', background: 'rgba(52,211,153,0.2)', border: '1px solid #34d399', color: '#34d399', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>
                            ▶ Start
                        </button>
                    )}
                    {running && (
                        <button onClick={() => setRunning(false)} style={{ padding: '8px 18px', borderRadius: '10px', background: 'rgba(251,191,36,0.2)', border: '1px solid #fbbf24', color: '#fbbf24', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>
                            ⏸ Pause
                        </button>
                    )}
                    <button onClick={reset} style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(56,189,248,0.15)', border: '1px solid #38bdf8', color: '#38bdf8', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>
                        <i className="fas fa-redo"></i> Reset
                    </button>
                </div>
            </div>

            {dead && (
                <div style={{ textAlign: 'center', marginBottom: '10px', padding: '8px', background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: '10px' }}>
                    <span style={{ color: '#ef4444', fontWeight: 800 }}>💀 Game Over! Score: {score}</span>
                </div>
            )}

            {/* Grid */}
            <div style={{ position: 'relative', display: 'inline-block', border: '2px solid rgba(52,211,153,0.3)', borderRadius: '10px', overflow: 'hidden', background: 'rgba(5,10,20,0.9)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`, gridTemplateRows: `repeat(${ROWS}, ${cellSize}px)`, gap: 0 }}>
                    {Array.from({ length: COLS * ROWS }, (_, i) => {
                        const x = i % COLS, y = Math.floor(i / COLS);
                        const head = isHead(x, y), body = isSnake(x, y), fd = isFood(x, y);
                        return (
                            <div key={i} style={{
                                width: cellSize, height: cellSize,
                                background: head ? '#34d399' : body ? '#10b981' : fd ? 'transparent' : 'transparent',
                                borderRadius: head ? '6px' : body ? '4px' : 0,
                                boxShadow: head ? '0 0 8px rgba(52,211,153,0.8)' : body ? '0 0 4px rgba(16,185,129,0.5)' : 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: fd ? '14px' : '0',
                                border: (x + y) % 2 === 0 ? '1px solid rgba(255,255,255,0.02)' : '1px solid transparent',
                            }}>
                                {fd ? '🍎' : ''}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* D-pad for mobile */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '12px', gap: '4px' }}>
                <button onClick={() => { if(running){ dirRef.current = DIR.UP; setDir(DIR.UP); }}} style={dpadStyle}>▲</button>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => { if(running){ dirRef.current = DIR.LEFT; setDir(DIR.LEFT); }}} style={dpadStyle}>◀</button>
                    <button onClick={() => { if(running){ dirRef.current = DIR.DOWN; setDir(DIR.DOWN); }}} style={dpadStyle}>▼</button>
                    <button onClick={() => { if(running){ dirRef.current = DIR.RIGHT; setDir(DIR.RIGHT); }}} style={dpadStyle}>▶</button>
                </div>
                <p style={{ color: '#475569', fontSize: '0.72rem', margin: '4px 0 0' }}>Arrow Keys / WASD or D-pad</p>
            </div>
        </div>
    );
};

const dpadStyle = { width: 38, height: 38, borderRadius: '8px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };

// ── MAIN ARCADE SHELL ─────────────────────────────────────────────────────────
const GAMES = [
    { id: 'ttt',   label: '✖️ Tic-Tac-Toe',  icon: 'fa-th',      color: '#818cf8', component: TicTacToe  },
    { id: 'mem',   label: '🃏 Memory Match',  icon: 'fa-clone',   color: '#f472b6', component: MemoryMatch },
    { id: 'snake', label: '🐍 Cyber Snake',   icon: 'fa-dragon',  color: '#34d399', component: CyberSnake  },
];

const CyberArcadeGame = ({ onClose }) => {
    const [activeGame, setActiveGame] = useState('ttt');
    const game = GAMES.find(g => g.id === activeGame);
    const GameComponent = game.component;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(16px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div className="anim-scale-in" style={{ width: '100%', maxWidth: '600px', background: 'linear-gradient(135deg, rgba(8,10,24,0.97), rgba(12,15,30,0.97))', borderRadius: '24px', border: `1px solid ${game.color}44`, boxShadow: `0 30px 80px rgba(0,0,0,0.9), 0 0 50px ${game.color}22`, overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '12px', background: `linear-gradient(135deg, ${game.color}, ${game.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${game.color}55` }}>
                            <i className={`fas ${game.icon}`} style={{ color: '#fff', fontSize: '1rem' }}></i>
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Gatherly Cyber Arcade 🎮</h3>
                            <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748b' }}>3 mini-games to play while you explore!</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', color: '#64748b', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Game Tab Selector */}
                <div style={{ display: 'flex', gap: '6px', padding: '12px 22px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {GAMES.map(g => (
                        <button key={g.id} onClick={() => setActiveGame(g.id)}
                            style={{ flex: 1, padding: '8px 6px', borderRadius: '10px', border: `1px solid ${activeGame === g.id ? g.color : 'rgba(255,255,255,0.08)'}`, background: activeGame === g.id ? `${g.color}22` : 'rgba(255,255,255,0.03)', color: activeGame === g.id ? g.color : '#64748b', cursor: 'pointer', fontWeight: 700, fontSize: '0.74rem', transition: 'all 0.2s', whiteSpace: 'nowrap', boxShadow: activeGame === g.id ? `0 0 14px ${g.color}33` : 'none' }}>
                            {g.label}
                        </button>
                    ))}
                </div>

                {/* Active Game */}
                <div style={{ padding: '20px 22px' }}>
                    <GameComponent />
                </div>

                {/* Footer */}
                <div style={{ padding: '12px 22px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center' }}>
                    <button onClick={onClose} style={{ padding: '9px 28px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
                        Close Arcade
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CyberArcadeGame;
