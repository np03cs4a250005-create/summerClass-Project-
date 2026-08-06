import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────
// Gatherly Suite — Web Audio API Synthwave Background Music Engine
// 4 Tracks: Cyber Banger | Deep Space | Neon Pulse | Void Rave
// ─────────────────────────────────────────────────────────────────────

const TRACKS = [
    { name: 'Cyber Banger', color: '#818cf8', shadow: 'rgba(129,140,248,0.8)', bpm: 130 },
    { name: 'Deep Space',   color: '#38bdf8', shadow: 'rgba(56,189,248,0.8)',   bpm: 90  },
    { name: 'Neon Pulse',   color: '#f472b6', shadow: 'rgba(244,114,182,0.8)', bpm: 145 },
    { name: 'Void Rave',    color: '#a78bfa', shadow: 'rgba(167,139,250,0.8)', bpm: 155 },
];

// Note frequencies
const NOTE = {
    C3: 130.81, D3: 146.83, Eb3: 155.56, F3: 174.61, G3: 196.00, Ab3: 207.65, Bb3: 233.08,
    C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, G4: 392.00, Ab4: 415.30,
    A4: 440.00, Bb4: 466.16, B4: 493.88,
    C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, G5: 783.99, Ab5: 830.61,
};

// ─── Track Patterns ───────────────────────────────────────────────────
const TRACK_PATTERNS = {
    0: { // Cyber Banger
        bassNotes: [NOTE.C3, NOTE.C3, NOTE.G3, NOTE.Bb3, NOTE.C3, NOTE.F3, NOTE.G3, NOTE.Bb3],
        arpNotes:  [NOTE.C5, NOTE.Eb5, NOTE.G5, NOTE.Bb3*4, NOTE.C5, NOTE.F5, NOTE.G5, NOTE.Eb5],
        padNotes:  [[NOTE.C4, NOTE.Eb4, NOTE.G4], [NOTE.F4, NOTE.Ab4, NOTE.C5]],
        kick: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        snare:[0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
        hihat:[1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    },
    1: { // Deep Space
        bassNotes: [NOTE.C3, null, NOTE.G3, null, NOTE.F3, null, NOTE.Bb3, null],
        arpNotes:  [NOTE.C5, null, NOTE.G5, null, NOTE.Eb5, null, NOTE.F5, null],
        padNotes:  [[NOTE.C4, NOTE.G4], [NOTE.F4, NOTE.C5], [NOTE.G4, NOTE.D5]],
        kick: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        snare:[0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat:[1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    },
    2: { // Neon Pulse
        bassNotes: [NOTE.C3, NOTE.Eb3, NOTE.G3, NOTE.C3, NOTE.F3, NOTE.Ab3, NOTE.Bb3, NOTE.G3],
        arpNotes:  [NOTE.C5, NOTE.Eb5, NOTE.G5, NOTE.C5, NOTE.F5, NOTE.Ab5, NOTE.Bb3*4, NOTE.G5],
        padNotes:  [[NOTE.C4, NOTE.Eb4, NOTE.G4, NOTE.Bb4]],
        kick: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
        snare:[0,1,0,1, 0,1,0,1, 0,1,0,1, 0,1,0,1],
        hihat:[1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    },
    3: { // Void Rave
        bassNotes: [NOTE.C3, NOTE.C3, NOTE.F3, NOTE.G3, NOTE.Ab3, NOTE.G3, NOTE.F3, NOTE.C3],
        arpNotes:  [NOTE.C5, NOTE.Eb5, NOTE.F5, NOTE.G5, NOTE.Ab5, NOTE.G5, NOTE.F5, NOTE.Eb5],
        padNotes:  [[NOTE.C4, NOTE.Eb4, NOTE.Ab4], [NOTE.F4, NOTE.Ab4, NOTE.C5], [NOTE.G4, NOTE.Bb4, NOTE.D5]],
        kick: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,1,0],
        snare:[0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,1],
        hihat:[1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    },
};

// ─── Audio Synthesis Helpers ──────────────────────────────────────────
function createReverb(actx, decay = 2.5) {
    const convolver = actx.createConvolver();
    const rate = actx.sampleRate;
    const length = rate * decay;
    const buf = actx.createBuffer(2, length, rate);
    for (let c = 0; c < 2; c++) {
        const d = buf.getChannelData(c);
        for (let i = 0; i < length; i++) {
            d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 1.5);
        }
    }
    convolver.buffer = buf;
    return convolver;
}

function playKick(actx, dst, when) {
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.connect(gain); gain.connect(dst);
    osc.frequency.setValueAtTime(180, when);
    osc.frequency.exponentialRampToValueAtTime(30, when + 0.25);
    gain.gain.setValueAtTime(1.1, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + 0.35);
    osc.start(when); osc.stop(when + 0.35);
}

function playSnare(actx, dst, when) {
    // Noise burst
    const bufLen = actx.sampleRate * 0.12;
    const buf = actx.createBuffer(1, bufLen, actx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;
    const src = actx.createBufferSource();
    src.buffer = buf;
    const filter = actx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2200;
    const gain = actx.createGain();
    src.connect(filter); filter.connect(gain); gain.connect(dst);
    gain.gain.setValueAtTime(0.45, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + 0.12);
    src.start(when); src.stop(when + 0.12);

    // Snare tone
    const toneOsc = actx.createOscillator();
    const toneGain = actx.createGain();
    toneOsc.connect(toneGain); toneGain.connect(dst);
    toneOsc.frequency.setValueAtTime(210, when);
    toneOsc.frequency.exponentialRampToValueAtTime(120, when + 0.08);
    toneGain.gain.setValueAtTime(0.35, when);
    toneGain.gain.exponentialRampToValueAtTime(0.001, when + 0.1);
    toneOsc.start(when); toneOsc.stop(when + 0.1);
}

function playHihat(actx, dst, when, open = false) {
    const bufLen = actx.sampleRate * (open ? 0.18 : 0.04);
    const buf = actx.createBuffer(1, bufLen, actx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;
    const src = actx.createBufferSource();
    src.buffer = buf;
    const hp = actx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 7000;
    const gain = actx.createGain();
    src.connect(hp); hp.connect(gain); gain.connect(dst);
    gain.gain.setValueAtTime(0.13, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + bufLen / actx.sampleRate);
    src.start(when); src.stop(when + bufLen / actx.sampleRate);
}

function playBass(actx, dst, freq, when, dur) {
    if (!freq) return;
    const osc = actx.createOscillator();
    const dist = actx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
        const x = (i * 2) / 256 - 1;
        curve[i] = (Math.PI + 200) * x / (Math.PI + 200 * Math.abs(x));
    }
    dist.curve = curve;
    const gain = actx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, when);
    osc.connect(dist); dist.connect(gain); gain.connect(dst);
    gain.gain.setValueAtTime(0.38, when);
    gain.gain.setValueAtTime(0.32, when + dur * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, when + dur);
    osc.start(when); osc.stop(when + dur);
}

function playArp(actx, dst, reverb, freq, when, dur) {
    if (!freq) return;
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    const reverbGain = actx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, when);
    osc.connect(gain); gain.connect(dst);
    osc.connect(reverbGain); reverbGain.connect(reverb);
    gain.gain.setValueAtTime(0.18, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + dur * 0.8);
    reverbGain.gain.setValueAtTime(0.12, when);
    reverbGain.gain.exponentialRampToValueAtTime(0.001, when + dur);
    osc.start(when); osc.stop(when + dur);
}

function playPad(actx, dst, reverb, freqs, when, dur) {
    freqs.forEach((freq, i) => {
        const osc1 = actx.createOscillator();
        const osc2 = actx.createOscillator();
        const gain = actx.createGain();
        const rvGain = actx.createGain();
        osc1.type = 'sine'; osc2.type = 'sine';
        osc1.frequency.setValueAtTime(freq, when);
        osc2.frequency.setValueAtTime(freq * 1.003, when); // Detune for chorus
        osc1.connect(gain); osc2.connect(gain);
        gain.connect(dst);
        osc1.connect(rvGain); osc2.connect(rvGain); rvGain.connect(reverb);
        const att = 0.6, rel = 0.8;
        gain.gain.setValueAtTime(0.001, when);
        gain.gain.linearRampToValueAtTime(0.055 / freqs.length, when + att);
        gain.gain.setValueAtTime(0.055 / freqs.length, when + dur - rel);
        gain.gain.linearRampToValueAtTime(0.001, when + dur);
        rvGain.gain.setValueAtTime(0.001, when);
        rvGain.gain.linearRampToValueAtTime(0.06 / freqs.length, when + att);
        rvGain.gain.linearRampToValueAtTime(0.001, when + dur);
        osc1.start(when); osc1.stop(when + dur);
        osc2.start(when); osc2.stop(when + dur);
    });
}

// ─── Main Component ────────────────────────────────────────────────────
const BackgroundMusic = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [volume, setVolume] = useState(0.45);
    const [isExpanded, setIsExpanded] = useState(false);
    const [beat, setBeat] = useState(0);
    const [visualizer, setVisualizer] = useState(Array(16).fill(0));

    const actxRef = useRef(null);
    const masterGainRef = useRef(null);
    const reverbRef = useRef(null);
    const schedulerRef = useRef(null);
    const nextNoteRef = useRef(0);
    const stepRef = useRef(0);
    const lookahead = 0.1;
    const scheduleAheadTime = 0.3;

    const track = TRACKS[currentTrack];
    const pattern = TRACK_PATTERNS[currentTrack];
    const bps = track.bpm / 60;
    const stepDur = 1 / bps / 4; // 16th note

    const initAudio = useCallback(() => {
        if (!actxRef.current) {
            actxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            masterGainRef.current = actxRef.current.createGain();
            masterGainRef.current.gain.value = volume;
            masterGainRef.current.connect(actxRef.current.destination);
            reverbRef.current = createReverb(actxRef.current, 2.8);
            reverbRef.current.connect(masterGainRef.current);
        }
        if (actxRef.current.state === 'suspended') actxRef.current.resume();
    }, [volume]);

    const scheduleStep = useCallback(() => {
        const actx = actxRef.current;
        const master = masterGainRef.current;
        const reverb = reverbRef.current;
        if (!actx || !master || !reverb) return;

        while (nextNoteRef.current < actx.currentTime + scheduleAheadTime) {
            const when = nextNoteRef.current;
            const step = stepRef.current % 16;
            const p = TRACK_PATTERNS[currentTrack];
            const bassNote = p.bassNotes[step % p.bassNotes.length];
            const arpNote = p.arpNotes[step % p.arpNotes.length];

            // Drums
            if (p.kick[step]) playKick(actx, master, when);
            if (p.snare[step]) playSnare(actx, master, when);
            if (p.hihat[step]) playHihat(actx, master, when, step % 8 === 4);

            // Bass (every 2 steps)
            if (step % 2 === 0) {
                playBass(actx, master, bassNote, when, stepDur * 1.8);
            }

            // Arpeggio
            playArp(actx, master, reverb, arpNote, when, stepDur * 0.9);

            // Pad (every bar = 16 steps)
            if (step === 0) {
                const padChord = p.padNotes[Math.floor(stepRef.current / 16) % p.padNotes.length];
                playPad(actx, reverb, reverb, padChord, when, stepDur * 14);
            }

            setBeat(step);
            nextNoteRef.current += stepDur;
            stepRef.current++;
        }
    }, [currentTrack, stepDur]);

    // Visualizer animation
    useEffect(() => {
        if (!isPlaying) {
            setVisualizer(Array(16).fill(0));
            return;
        }
        const iv = setInterval(() => {
            setVisualizer(prev => prev.map(() => Math.random() * 0.7 + 0.05));
        }, 80);
        return () => clearInterval(iv);
    }, [isPlaying]);

    // Scheduler loop
    useEffect(() => {
        if (isPlaying) {
            schedulerRef.current = setInterval(scheduleStep, lookahead * 1000);
        } else {
            clearInterval(schedulerRef.current);
        }
        return () => clearInterval(schedulerRef.current);
    }, [isPlaying, scheduleStep]);

    // Volume sync
    useEffect(() => {
        if (masterGainRef.current) masterGainRef.current.gain.value = volume;
    }, [volume]);

    const togglePlay = () => {
        initAudio();
        if (!isPlaying) {
            nextNoteRef.current = actxRef.current.currentTime + 0.05;
            stepRef.current = 0;
        }
        setIsPlaying(p => !p);
    };

    const switchTrack = (idx) => {
        setCurrentTrack(idx);
        stepRef.current = 0;
        if (actxRef.current) nextNoteRef.current = actxRef.current.currentTime + 0.05;
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            fontFamily: "'Inter', 'Outfit', sans-serif",
        }}>
            {/* Expanded Panel */}
            {isExpanded && (
                <div style={{
                    background: 'rgba(8, 10, 24, 0.92)',
                    backdropFilter: 'blur(24px)',
                    border: `1px solid ${track.color}55`,
                    borderRadius: '20px',
                    padding: '20px',
                    marginBottom: '12px',
                    width: '280px',
                    boxShadow: `0 0 40px ${track.color}33, 0 8px 32px rgba(0,0,0,0.6)`,
                    animation: 'fadeUpIn 0.3s ease',
                }}>
                    {/* Track title + visualizer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <div style={{
                            width: '10px', height: '10px', borderRadius: '50%',
                            background: track.color,
                            boxShadow: `0 0 12px ${track.color}`,
                            animation: isPlaying ? 'pulse 1s infinite' : 'none',
                        }} />
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px' }}>
                            {track.name}
                        </span>
                        <span style={{ color: track.color, fontSize: '11px', marginLeft: 'auto', opacity: 0.8 }}>
                            {track.bpm} BPM
                        </span>
                    </div>

                    {/* Waveform Visualizer */}
                    <div style={{
                        display: 'flex', gap: '3px', alignItems: 'flex-end',
                        height: '40px', marginBottom: '16px',
                        padding: '0 2px',
                    }}>
                        {visualizer.map((h, i) => (
                            <div key={i} style={{
                                flex: 1,
                                height: `${h * 100}%`,
                                minHeight: '3px',
                                background: `linear-gradient(to top, ${track.color}, ${track.color}44)`,
                                borderRadius: '2px',
                                boxShadow: isPlaying ? `0 0 6px ${track.color}88` : 'none',
                                transition: 'height 0.07s ease',
                            }} />
                        ))}
                    </div>

                    {/* Track Selector */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                        {TRACKS.map((t, i) => (
                            <button key={i} onClick={() => switchTrack(i)} style={{
                                background: currentTrack === i
                                    ? `linear-gradient(90deg, ${t.color}22, ${t.color}11)`
                                    : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${currentTrack === i ? t.color + '88' : '#ffffff15'}`,
                                borderRadius: '10px',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.2s',
                            }}>
                                <div style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: currentTrack === i ? t.color : '#ffffff33',
                                    boxShadow: currentTrack === i ? `0 0 8px ${t.color}` : 'none',
                                    flexShrink: 0,
                                }} />
                                <span style={{ color: currentTrack === i ? t.color : '#888', fontSize: '12px', fontWeight: 600 }}>
                                    {t.name}
                                </span>
                                <span style={{ color: '#555', fontSize: '10px', marginLeft: 'auto' }}>{t.bpm} BPM</span>
                            </button>
                        ))}
                    </div>

                    {/* Volume Slider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '14px' }}>🔊</span>
                        <input
                            type="range" min="0" max="1" step="0.01"
                            value={volume}
                            onChange={e => setVolume(parseFloat(e.target.value))}
                            style={{
                                flex: 1,
                                accentColor: track.color,
                                cursor: 'pointer',
                                height: '4px',
                            }}
                        />
                        <span style={{ color: '#888', fontSize: '11px', minWidth: '28px' }}>
                            {Math.round(volume * 100)}%
                        </span>
                    </div>
                </div>
            )}

            {/* Main Control Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                {/* Expand toggle */}
                <button onClick={() => setIsExpanded(p => !p)} style={{
                    width: '42px', height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(8, 10, 24, 0.88)',
                    border: `1px solid ${track.color}44`,
                    cursor: 'pointer',
                    color: '#888',
                    fontSize: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.2s',
                    boxShadow: isExpanded ? `0 0 20px ${track.color}33` : 'none',
                }}>
                    {isExpanded ? '▾' : '♬'}
                </button>

                {/* Play / Pause */}
                <button onClick={togglePlay} style={{
                    width: '52px', height: '52px',
                    borderRadius: '16px',
                    background: isPlaying
                        ? `linear-gradient(135deg, ${track.color}, ${track.color}aa)`
                        : `linear-gradient(135deg, rgba(99,102,241,0.3), rgba(56,189,248,0.2))`,
                    border: `2px solid ${track.color}`,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px',
                    boxShadow: isPlaying
                        ? `0 0 28px ${track.shadow}, 0 0 12px ${track.color}55`
                        : `0 4px 16px rgba(0,0,0,0.5)`,
                    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: isPlaying ? 'scale(1.08)' : 'scale(1)',
                    backdropFilter: 'blur(16px)',
                }}>
                    {isPlaying ? '⏸' : '▶'}
                </button>
            </div>

            <style>{`
                @keyframes fadeUpIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.5; transform: scale(1.35); }
                }
            `}</style>
        </div>
    );
};

export default BackgroundMusic;
