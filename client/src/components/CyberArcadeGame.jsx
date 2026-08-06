import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/soundEffects';

const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

const CyberArcadeGame = ({ onClose }) => {
    // Tic Tac Toe State
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [winner, setWinner] = useState(null); // 'X' (Player), 'O' (Computer), 'Draw', null
    const [scores, setScores] = useState({ player: 0, ai: 0, draws: 0 });
    const [winningLine, setWinningLine] = useState([]);

    // Check winner
    const checkWin = (currentBoard) => {
        for (let combo of WINNING_COMBOS) {
            const [a, b, c] = combo;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return { winner: currentBoard[a], combo };
            }
        }
        if (currentBoard.every(cell => cell !== null)) {
            return { winner: 'Draw', combo: [] };
        }
        return null;
    };

    // Computer AI move logic
    const makeComputerMove = (currentBoard) => {
        // 1. Check if AI can win immediately
        for (let combo of WINNING_COMBOS) {
            const [a, b, c] = combo;
            const values = [currentBoard[a], currentBoard[b], currentBoard[c]];
            if (values.filter(v => v === 'O').length === 2 && values.includes(null)) {
                return combo[values.indexOf(null)];
            }
        }

        // 2. Block Player from winning
        for (let combo of WINNING_COMBOS) {
            const [a, b, c] = combo;
            const values = [currentBoard[a], currentBoard[b], currentBoard[c]];
            if (values.filter(v => v === 'X').length === 2 && values.includes(null)) {
                return combo[values.indexOf(null)];
            }
        }

        // 3. Take Center if open
        if (currentBoard[4] === null) return 4;

        // 4. Take Corners if available
        const corners = [0, 2, 6, 8].filter(i => currentBoard[i] === null);
        if (corners.length > 0) {
            return corners[Math.floor(Math.random() * corners.length)];
        }

        // 5. Take any open space
        const openSpaces = currentBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);
        if (openSpaces.length > 0) {
            return openSpaces[Math.floor(Math.random() * openSpaces.length)];
        }

        return null;
    };

    // Handle Player Click
    const handleCellClick = (index) => {
        if (board[index] || !isPlayerTurn || winner) return;

        soundFx.playRoboticClick();
        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);

        const winResult = checkWin(newBoard);
        if (winResult) {
            setWinner(winResult.winner);
            setWinningLine(winResult.combo);
            if (winResult.winner === 'X') setScores(s => ({ ...s, player: s.player + 1 }));
            else if (winResult.winner === 'Draw') setScores(s => ({ ...s, draws: s.draws + 1 }));
            return;
        }

        setIsPlayerTurn(false);
    };

    // AI turn trigger
    useEffect(() => {
        if (!isPlayerTurn && !winner) {
            const timer = setTimeout(() => {
                const aiIndex = makeComputerMove(board);
                if (aiIndex !== null) {
                    soundFx.playRoboticClick();
                    const newBoard = [...board];
                    newBoard[aiIndex] = 'O';
                    setBoard(newBoard);

                    const winResult = checkWin(newBoard);
                    if (winResult) {
                        setWinner(winResult.winner);
                        setWinningLine(winResult.combo);
                        if (winResult.winner === 'O') setScores(s => ({ ...s, ai: s.ai + 1 }));
                        else if (winResult.winner === 'Draw') setScores(s => ({ ...s, draws: s.draws + 1 }));
                    } else {
                        setIsPlayerTurn(true);
                    }
                }
            }, 450);
            return () => clearTimeout(timer);
        }
    }, [isPlayerTurn, board, winner]);

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsPlayerTurn(true);
        setWinner(null);
        setWinningLine([]);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="blue-card-glass anim-scale-in" style={{ width: '100%', maxWidth: '520px', padding: '28px', borderRadius: '24px', border: '1px solid rgba(56, 189, 248, 0.35)', boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 40px rgba(37, 99, 235, 0.3)' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 42, height: 42, borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(37,99,235,0.5)' }}>
                            <i className="fas fa-gamepad" style={{ color: '#fff', fontSize: '1.2rem' }}></i>
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Gatherly Cyber Arcade</h3>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>Play mini-games against Gatherly AI computer while loading!</p>
                        </div>
                    </div>

                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Scoreboard */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px', background: 'rgba(15,23,42,0.8)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(56,189,248,0.2)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: '#7dd3fc', fontWeight: 600, display: 'block' }}>YOU (PLAYER)</span>
                        <strong style={{ fontSize: '1.4rem', color: '#38bdf8' }}>{scores.player}</strong>
                    </div>
                    <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block' }}>DRAWS</span>
                        <strong style={{ fontSize: '1.4rem', color: '#fbbf24' }}>{scores.draws}</strong>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: '#f472b6', fontWeight: 600, display: 'block' }}>COMPUTER AI</span>
                        <strong style={{ fontSize: '1.4rem', color: '#f472b6' }}>{scores.ai}</strong>
                    </div>
                </div>

                {/* Game Turn Status */}
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    {winner ? (
                        <div style={{ padding: '8px 16px', borderRadius: '20px', background: winner === 'X' ? 'rgba(56,189,248,0.2)' : winner === 'O' ? 'rgba(244,114,182,0.2)' : 'rgba(251,191,36,0.2)', border: `1px solid ${winner === 'X' ? '#38bdf8' : winner === 'O' ? '#f472b6' : '#fbbf24'}`, display: 'inline-block' }}>
                            <strong style={{ color: winner === 'X' ? '#38bdf8' : winner === 'O' ? '#f472b6' : '#fbbf24', fontSize: '0.95rem' }}>
                                {winner === 'X' ? '🎉 Victory! You defeated Gatherly AI!' : winner === 'O' ? '🤖 Computer AI won this round!' : '🤝 Game Draw! Great match!'}
                            </strong>
                        </div>
                    ) : (
                        <span style={{ fontSize: '0.85rem', color: isPlayerTurn ? '#38bdf8' : '#f472b6', fontWeight: 600 }}>
                            {isPlayerTurn ? '👉 Your Turn (Click any cell)' : '🤖 Computer AI thinking...'}
                        </span>
                    )}
                </div>

                {/* Tic-Tac-Toe Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '280px', margin: '0 auto 24px' }}>
                    {board.map((cell, idx) => {
                        const isWinningCell = winningLine.includes(idx);
                        return (
                            <button
                                key={idx}
                                onClick={() => handleCellClick(idx)}
                                disabled={!!cell || !isPlayerTurn || !!winner}
                                style={{
                                    height: '84px',
                                    borderRadius: '16px',
                                    border: isWinningCell ? '2px solid #fbbf24' : '1px solid rgba(56, 189, 248, 0.25)',
                                    background: isWinningCell ? 'rgba(251,191,36,0.2)' : cell === 'X' ? 'rgba(37,99,235,0.25)' : cell === 'O' ? 'rgba(244,114,182,0.2)' : 'rgba(15,23,42,0.7)',
                                    color: cell === 'X' ? '#38bdf8' : cell === 'O' ? '#f472b6' : 'transparent',
                                    fontSize: '2.2rem',
                                    fontWeight: 900,
                                    cursor: !cell && isPlayerTurn && !winner ? 'pointer' : 'default',
                                    transition: 'all 0.2s ease',
                                    boxShadow: isWinningCell ? '0 0 20px rgba(251,191,36,0.6)' : cell ? `0 0 15px ${cell === 'X' ? 'rgba(56,189,248,0.4)' : 'rgba(244,114,182,0.4)'}` : 'none'
                                }}
                            >
                                {cell || ''}
                            </button>
                        );
                    })}
                </div>

                {/* Footer Controls */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button onClick={resetGame} className="btn blue-glow-btn" style={{ padding: '10px 24px', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-redo"></i> Play Again
                    </button>
                    <button onClick={onClose} className="btn" style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>
                        Close Arcade
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CyberArcadeGame;
