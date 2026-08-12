import React, { useState, useEffect, useRef } from 'react';

const SCENES = [
    {
        id: 1,
        title: '01. What is Gatherly?',
        duration: 12,
        subtitle: 'Gatherly is an all-in-one event management & community ecosystem.',
        narration: 'Gatherly unifies event hosting, instant ticketing, attendee live chat, and real-time door analytics into one seamless platform.',
        badge: 'PLATFORM OVERVIEW',
        accent: '#38bdf8'
    },
    {
        id: 2,
        title: '02. Contactless QR Passes & Check-in',
        duration: 12,
        subtitle: 'Instant QR badge generation with <50ms entrance verification.',
        narration: 'Gatherly generates encrypted digital QR passes instantly. Door scanners verify guests in under fifty milliseconds, eliminating check-in lines completely.',
        badge: 'SMART SCANNER',
        accent: '#4ade80'
    },
    {
        id: 3,
        title: '03. Real-Time Community Live Chat',
        duration: 12,
        subtitle: 'Keep your attendees connected with instant event chat channels.',
        narration: 'Keep your attendees engaged with real-time live chat channels, organizer announcements, interactive polls, and digital attendee certificates.',
        badge: 'COMMUNITY CHAT',
        accent: '#a855f7'
    },
    {
        id: 4,
        title: '04. Live Event Command & Analytics',
        duration: 12,
        subtitle: 'Track check-ins, remaining capacity, and revenue live.',
        narration: 'Event hosts get a live master dashboard to monitor real-time door check-ins, venue occupancy, ticket sales, and revenue from any device.',
        badge: 'LIVE DASHBOARD',
        accent: '#fbbf24'
    },
    {
        id: 5,
        title: '05. Ready to Connect People?',
        duration: 12,
        subtitle: 'Empower your next event with modern tech & unforgettable moments.',
        narration: 'From local meetups to global tech summits, Gatherly makes hosting effortless, stylish, and engaging. Host your next event with Gatherly today!',
        badge: 'GET STARTED',
        accent: '#60a5fa'
    }
];

const TOTAL_DURATION = SCENES.reduce((acc, s) => acc + s.duration, 0);

const DemoVideoPlayer = ({ autoPlay = false, isModal = false, onClose = null }) => {
    const canvasRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [activeSceneIndex, setActiveSceneIndex] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
    const [isSpeakingNarration, setIsSpeakingNarration] = useState(false);
    const [voices, setVoices] = useState([]);
    const containerRef = useRef(null);
    const lastSpokenKeyRef = useRef('');

    const audioCtxRef = useRef(null);

    useEffect(() => {
        const updateVoices = () => {
            if ('speechSynthesis' in window) {
                setVoices(window.speechSynthesis.getVoices());
            }
        };
        updateVoices();
        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = updateVoices;
        }
    }, []);

    const speakSceneNarration = (sceneIdx) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();

        if (isMuted || !isVoiceEnabled || !isPlaying) {
            setIsSpeakingNarration(false);
            return;
        }

        const scene = SCENES[sceneIdx];
        if (!scene || !scene.narration) return;

        const utterance = new SpeechSynthesisUtterance(scene.narration);
        utterance.rate = Math.max(1.05, Math.min(1.4, playbackSpeed * 1.1));
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voiceList = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
        const preferredVoice = voiceList.find(v =>
            (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Alex') || v.name.includes('David')) && v.lang.startsWith('en')
        ) || voiceList.find(v => v.lang.startsWith('en'));

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setIsSpeakingNarration(true);
        utterance.onend = () => setIsSpeakingNarration(false);
        utterance.onerror = () => setIsSpeakingNarration(false);

        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        const key = `${activeSceneIndex}_${isPlaying}_${isMuted}_${isVoiceEnabled}_${playbackSpeed}`;
        
        if (isPlaying && !isMuted && isVoiceEnabled) {
            if (lastSpokenKeyRef.current !== key) {
                lastSpokenKeyRef.current = key;
                speakSceneNarration(activeSceneIndex);
            }
        } else {
            lastSpokenKeyRef.current = '';
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            setIsSpeakingNarration(false);
        }
    }, [activeSceneIndex, isPlaying, isMuted, isVoiceEnabled, playbackSpeed]);

    const playBeep = (freq = 440, type = 'sine', duration = 0.15) => {
        if (isMuted) return;
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }
            const osc = audioCtxRef.current.createOscillator();
            const gain = audioCtxRef.current.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
            gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtxRef.current.destination);
            osc.start();
            osc.stop(audioCtxRef.current.currentTime + duration);
        } catch (e) {
            // Ignore audio context errors on restricted autoplay
        }
    };

    // Calculate current scene from playback time
    useEffect(() => {
        let accumulated = 0;
        for (let i = 0; i < SCENES.length; i++) {
            accumulated += SCENES[i].duration;
            if (currentTime <= accumulated) {
                if (activeSceneIndex !== i) {
                    setActiveSceneIndex(i);
                    playBeep(520 + i * 80, 'triangle', 0.2);
                }
                break;
            }
        }
    }, [currentTime]);

    // Timer Loop
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime((prev) => {
                    const next = prev + 0.1 * playbackSpeed;
                    if (next >= TOTAL_DURATION) {
                        setIsPlaying(false);
                        return TOTAL_DURATION;
                    }
                    return next;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying, playbackSpeed]);

    // Canvas Renderer for Video Frames
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const render = () => {
            const width = canvas.width;
            const height = canvas.height;
            const scene = SCENES[activeSceneIndex];
            const t = currentTime;

            // Background Gradient with dark cyber theme
            const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.8);
            grad.addColorStop(0, '#0f172a');
            grad.addColorStop(0.5, '#090d16');
            grad.addColorStop(1, '#030712');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            // Subtle Grid Overlay
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
            ctx.lineWidth = 1;
            const gridSize = 40;
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Animated Orbs
            const pulse = Math.sin(t * 2) * 20;
            const orbGrad = ctx.createRadialGradient(width * 0.8, height * 0.2, 10, width * 0.8, height * 0.2, 200 + pulse);
            orbGrad.addColorStop(0, 'rgba(37, 99, 235, 0.3)');
            orbGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = orbGrad;
            ctx.beginPath();
            ctx.arc(width * 0.8, height * 0.2, 200 + pulse, 0, Math.PI * 2);
            ctx.fill();

            // Render specific Scene UI Animations
            if (activeSceneIndex === 0) {
                // SCENE 1: Gatherly Logo & Ecosystem Nodes
                const centerX = width / 2;
                const centerY = height / 2 - 20;

                // Central Glow Box
                ctx.shadowColor = '#2563eb';
                ctx.shadowBlur = 30;
                ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(centerX - 90, centerY - 60, 180, 120, 20);
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Brand Icon
                ctx.fillStyle = '#ffffff';
                ctx.font = '900 36px "Font Awesome 6 Free", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Gatherly', centerX, centerY - 15);
                ctx.fillStyle = '#38bdf8';
                ctx.font = '600 14px Inter, system-ui';
                ctx.fillText('EVENT MANAGEMENT PLATFORM', centerX, centerY + 20);

                // Orbiting Nodes (Events, Tickets, Chat, Stats)
                const nodes = ['📅 Events', '🎟️ QR Passes', '💬 Live Chat', '📊 Analytics'];
                const radius = 180;
                nodes.forEach((label, idx) => {
                    const angle = (t * 0.8) + (idx * Math.PI / 2);
                    const nx = centerX + Math.cos(angle) * radius;
                    const ny = centerY + Math.sin(angle) * (radius * 0.5);

                    // Connecting Line
                    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(nx, ny);
                    ctx.stroke();

                    // Node Capsule
                    ctx.fillStyle = '#0f172a';
                    ctx.strokeStyle = '#38bdf8';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.roundRect(nx - 55, ny - 18, 110, 36, 18);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#f8fafc';
                    ctx.font = '600 12px Inter, system-ui';
                    ctx.textAlign = 'center';
                    ctx.fillText(label, nx, ny + 2);
                });

            } else if (activeSceneIndex === 1) {
                // SCENE 2: QR Pass & Instant Scanner Animation
                const cardX = width * 0.3;
                const cardY = height * 0.45;

                // QR Pass Card
                ctx.fillStyle = 'rgba(30, 58, 138, 0.85)';
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(cardX - 130, cardY - 110, 260, 220, 16);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#4ade80';
                ctx.font = '700 11px Inter';
                ctx.textAlign = 'left';
                ctx.fillText('VIP PASS • SUMMER SUMMIT', cardX - 110, cardY - 80);

                ctx.fillStyle = '#ffffff';
                ctx.font = '700 16px Inter';
                ctx.fillText('Alex Rivera', cardX - 110, cardY - 55);

                // Animated QR Pattern box
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.roundRect(cardX - 110, cardY - 35, 90, 90, 8);
                ctx.fill();

                // Mock QR blocks
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(cardX - 100, cardY - 25, 25, 25);
                ctx.fillRect(cardX - 55, cardY - 25, 25, 25);
                ctx.fillRect(cardX - 100, cardY + 20, 25, 25);
                ctx.fillRect(cardX - 65, cardY + 5, 15, 15);
                ctx.fillRect(cardX - 45, cardY + 20, 15, 15);

                // Side Details
                ctx.fillStyle = '#cbd5e1';
                ctx.font = '500 12px Inter';
                ctx.fillText('ID: #GATH-88492', cardX - 5, cardY - 20);
                ctx.fillText('Gate: Main Gate 4', cardX - 5, cardY);
                ctx.fillStyle = '#4ade80';
                ctx.fillText('✓ Scanned in 42ms', cardX - 5, cardY + 25);

                // Scanning Beam Graphic on Right
                const scanX = width * 0.7;
                const scanY = height * 0.45;

                ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
                ctx.strokeStyle = '#4ade80';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(scanX - 100, scanY - 100, 200, 200, 20);
                ctx.fill();
                ctx.stroke();

                // Moving Laser Beam
                const laserY = scanY - 80 + ((Math.sin(t * 5) + 1) * 80);
                ctx.strokeStyle = '#4ade80';
                ctx.lineWidth = 3;
                ctx.shadowColor = '#4ade80';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.moveTo(scanX - 80, laserY);
                ctx.lineTo(scanX + 80, laserY);
                ctx.stroke();
                ctx.shadowBlur = 0;

                ctx.fillStyle = '#4ade80';
                ctx.font = '700 13px Inter';
                ctx.textAlign = 'center';
                ctx.fillText('DOOR SCANNER ACTIVE', scanX, scanY + 75);

            } else if (activeSceneIndex === 2) {
                // SCENE 3: Live Chat & Community Feed
                const chatX = width / 2 - 180;
                const chatY = height / 2 - 110;

                ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
                ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(chatX, chatY, 360, 220, 16);
                ctx.fill();
                ctx.stroke();

                // Header bar
                ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
                ctx.beginPath();
                ctx.roundRect(chatX, chatY, 360, 40, [16, 16, 0, 0]);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.font = '700 13px Inter';
                ctx.textAlign = 'left';
                ctx.fillText('💬 Event Live Stream & Community Chat', chatX + 15, chatY + 25);

                // Messages popping up based on timeline
                const msgs = [
                    { sender: 'Sarah Chen', text: "Can't wait for the opening keynote!", time: '10:02 AM', color: '#2563eb' },
                    { sender: 'Marcus (Host)', text: 'Welcome everyone! Q&A opens at 10:30.', time: '10:03 AM', color: '#a855f7' },
                    { sender: 'David Miller', text: 'Where can we grab workshop slides?', time: '10:04 AM', color: '#0284c7' },
                ];

                msgs.forEach((m, idx) => {
                    const msgY = chatY + 55 + (idx * 48);
                    const opacity = Math.min(1, Math.max(0, (t % 8) - (idx * 1.2)));

                    ctx.fillStyle = `rgba(255, 255, 255, ${0.05 * opacity})`;
                    ctx.beginPath();
                    ctx.roundRect(chatX + 12, msgY, 336, 40, 8);
                    ctx.fill();

                    // Avatar circle
                    ctx.fillStyle = m.color;
                    ctx.beginPath();
                    ctx.arc(chatX + 30, msgY + 20, 12, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#ffffff';
                    ctx.font = '700 10px Inter';
                    ctx.textAlign = 'center';
                    ctx.fillText(m.sender[0], chatX + 30, msgY + 23);

                    ctx.fillStyle = '#e2e8f0';
                    ctx.font = '600 11px Inter';
                    ctx.textAlign = 'left';
                    ctx.fillText(m.sender, chatX + 50, msgY + 16);

                    ctx.fillStyle = '#94a3b8';
                    ctx.font = '400 10px Inter';
                    ctx.fillText(m.text, chatX + 50, msgY + 31);
                });

            } else if (activeSceneIndex === 3) {
                // SCENE 4: Live Analytics & Dashboard Controls
                const dashX = width / 2 - 200;
                const dashY = height / 2 - 110;

                ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(dashX, dashY, 400, 220, 16);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#f8fafc';
                ctx.font = '700 14px Inter';
                ctx.textAlign = 'left';
                ctx.fillText('📊 Live Event Operations Dashboard', dashX + 20, dashY + 30);

                // Progress Bar (Check-ins)
                const fillWidth = Math.min(360, (Math.sin(t * 1.5) + 1) * 0.5 * 360);
                ctx.fillStyle = 'rgba(255,255,255,0.08)';
                ctx.beginPath();
                ctx.roundRect(dashX + 20, dashY + 50, 360, 16, 8);
                ctx.fill();

                const barGrad = ctx.createLinearGradient(dashX + 20, 0, dashX + 380, 0);
                barGrad.addColorStop(0, '#2563eb');
                barGrad.addColorStop(1, '#fbbf24');
                ctx.fillStyle = barGrad;
                ctx.beginPath();
                ctx.roundRect(dashX + 20, dashY + 50, Math.max(16, fillWidth), 16, 8);
                ctx.fill();

                ctx.fillStyle = '#fbbf24';
                ctx.font = '600 11px Inter';
                ctx.fillText(`Live Venue Occupancy: ${Math.round((fillWidth / 360) * 100)}%`, dashX + 20, dashY + 84);

                // Metric Cards
                const metrics = [
                    { label: 'Total Checked In', val: `${Math.round(442 * (fillWidth / 360))}/500`, icon: '👥' },
                    { label: 'Ticket Revenue', val: `$${Math.round(12450 * (fillWidth / 360))}`, icon: '💰' }
                ];

                metrics.forEach((m, idx) => {
                    const bx = dashX + 20 + (idx * 185);
                    const by = dashY + 100;

                    ctx.fillStyle = 'rgba(255,255,255,0.04)';
                    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.roundRect(bx, by, 175, 90, 12);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#94a3b8';
                    ctx.font = '500 11px Inter';
                    ctx.fillText(`${m.icon} ${m.label}`, bx + 12, by + 28);

                    ctx.fillStyle = '#ffffff';
                    ctx.font = '800 18px Inter';
                    ctx.fillText(m.val, bx + 12, by + 62);
                });

            } else if (activeSceneIndex === 4) {
                // SCENE 5: Summary & Call To Action
                const centerX = width / 2;
                const centerY = height / 2;

                ctx.fillStyle = 'rgba(37, 99, 235, 0.15)';
                ctx.strokeStyle = '#60a5fa';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(centerX, centerY - 20, 70, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.font = '900 32px Inter';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('✨', centerX, centerY - 20);

                ctx.font = '800 24px Inter';
                ctx.fillText('Reimagine Your Events with Gatherly', centerX, centerY + 65);

                ctx.fillStyle = '#94a3b8';
                ctx.font = '500 13px Inter';
                ctx.fillText('Host summits, workshops, parties, and meetups in minutes.', centerX, centerY + 92);
            }

            // Animated Simulated Cursor
            const cursorX = (width * 0.2) + Math.cos(t * 1.5) * (width * 0.25);
            const cursorY = (height * 0.4) + Math.sin(t * 2) * (height * 0.2);

            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(cursorX, cursorY);
            ctx.lineTo(cursorX + 14, cursorY + 14);
            ctx.lineTo(cursorX + 8, cursorY + 16);
            ctx.lineTo(cursorX + 12, cursorY + 24);
            ctx.lineTo(cursorX + 8, cursorY + 25);
            ctx.lineTo(cursorX + 4, cursorY + 17);
            ctx.lineTo(cursorX, cursorY + 20);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [currentTime, activeSceneIndex]);

    const activeScene = SCENES[activeSceneIndex];
    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickPos = (e.clientX - rect.left) / rect.width;
        setCurrentTime(clickPos * TOTAL_DURATION);
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!isFullscreen) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            }
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    const handleTogglePlay = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (currentTime >= TOTAL_DURATION - 0.2) {
            setCurrentTime(0);
            setActiveSceneIndex(0);
            setIsPlaying(true);
        } else {
            setIsPlaying((prev) => !prev);
        }
    };

    return (
        <div ref={containerRef} className={`demo-video-wrapper ${isModal ? 'video-modal-view' : ''}`} style={{
            width: '100%',
            maxWidth: isFullscreen ? '100vw' : '1000px',
            margin: isModal ? '0' : '0 auto',
            borderRadius: isFullscreen ? '0' : '24px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #090d16, #04070d)',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 50px rgba(37, 99, 235, 0.25)',
            position: isFullscreen ? 'fixed' : 'relative',
            inset: isFullscreen ? 0 : 'auto',
            zIndex: isFullscreen ? 99999 : 1,
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            {/* Top Video Header / Title Bar */}
            <div style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                background: 'rgba(15, 23, 42, 0.95)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                zIndex: 10,
                gap: '16px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'rgba(56, 189, 248, 0.2)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#38bdf8',
                        flexShrink: 0,
                        padding: 0,
                        margin: 0
                    }}>
                        <i className="fas fa-play" style={{
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 1,
                            width: '100%',
                            height: '100%',
                            transform: 'translateX(1px)',
                            margin: 0,
                            padding: 0
                        }}></i>
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span>Gatherly Platform Video Walkthrough</span>
                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: activeScene.accent, border: `1px solid ${activeScene.accent}` }}>
                                {activeScene.badge}
                            </span>
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            Watch what Gatherly means for event hosts & attendees
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <button onClick={() => setIsVoiceEnabled(!isVoiceEnabled)} title={isVoiceEnabled ? "Mute Voice Explanation" : "Enable Voice Explanation"} style={{
                        background: isVoiceEnabled ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.06)',
                        border: isVoiceEnabled ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                        color: isVoiceEnabled ? '#38bdf8' : '#94a3b8',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: 600
                    }}>
                        <i className={`fas ${isVoiceEnabled ? 'fa-headset' : 'fa-volume-xmark'}`}></i>
                        <span>{isVoiceEnabled ? 'Voice ON' : 'Voice OFF'}</span>
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)} title={isMuted ? "Unmute Sound" : "Mute Sound"} style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: isMuted ? '#ef4444' : '#38bdf8',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}>
                        <i className={`fas ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
                    </button>
                    {isModal && onClose && (
                        <button onClick={onClose} style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            color: '#ef4444',
                            padding: '8px 14px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}>
                            <i className="fas fa-times" style={{ marginRight: '6px' }}></i> Close Video
                        </button>
                    )}
                </div>
            </div>

            {/* Main Video Viewport Canvas */}
            <div
                onClick={handleTogglePlay}
                title={isPlaying ? "Click video to pause" : "Click video to play"}
                style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', overflow: 'hidden', cursor: 'pointer' }}>
                <canvas
                    ref={canvasRef}
                    width={900}
                    height={506}
                    style={{ width: '100%', height: '100%', display: 'block' }}
                />

                {/* Big Play Overlay if paused */}
                {!isPlaying && (
                    <div onClick={handleTogglePlay} style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(5, 11, 26, 0.65)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 5
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 40px rgba(37, 99, 235, 0.8), 0 0 80px rgba(56, 189, 248, 0.4)',
                            transition: 'transform 0.2s',
                            marginBottom: '16px',
                            padding: 0,
                            margin: '0 0 16px 0'
                        }}>
                            <i className="fas fa-play" style={{
                                color: '#fff',
                                fontSize: '2.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: 1,
                                width: '100%',
                                height: '100%',
                                transform: 'translateX(2px)',
                                margin: 0,
                                padding: 0
                            }}></i>
                        </div>
                        <h3 style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.4rem', margin: '0 0 6px' }}>
                            Click to Play Demo Video
                        </h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
                            See how Gatherly simplifies event creation & live check-ins
                        </p>
                    </div>
                )}

                {/* Subtitle / Closed Caption Box Overlay */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90%',
                    maxWidth: '750px',
                    background: 'rgba(15, 23, 42, 0.88)',
                    border: `1px solid ${activeScene.accent}40`,
                    padding: '12px 20px',
                    borderRadius: '14px',
                    backdropFilter: 'blur(10px)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    zIndex: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ color: activeScene.accent, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span>{activeScene.title}</span>
                    </div>
                    <p style={{ margin: 0, color: '#f8fafc', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.4 }}>
                        "{activeScene.narration}"
                    </p>
                </div>
            </div>

            {/* Video Controls & Timeline Bar */}
            <div style={{ padding: '16px 24px', background: '#0b1329', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Timeline Progress Bar */}
                <div
                    onClick={handleSeek}
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: '16px'
                    }}>
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: `${(currentTime / TOTAL_DURATION) * 100}%`,
                        background: `linear-gradient(90deg, #2563eb, ${activeScene.accent})`,
                        borderRadius: '4px',
                        transition: 'width 0.1s linear'
                    }}></div>
                </div>

                {/* Controls Action Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    {/* Play/Pause & Skip Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={handleTogglePlay}
                            style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                                border: 'none',
                                color: '#fff',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 15px rgba(37, 99, 235, 0.4)',
                                padding: 0,
                                margin: 0
                            }}>
                            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: 1,
                                width: '100%',
                                height: '100%',
                                transform: isPlaying ? 'none' : 'translateX(2px)',
                                margin: 0,
                                padding: 0
                            }}></i>
                        </button>

                        <button
                            onClick={() => setCurrentTime((t) => Math.max(0, t - 5))}
                            title="Rewind 5 seconds"
                            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer' }}>
                            <i className="fas fa-rotate-left"></i>
                        </button>

                        <button
                            onClick={() => setCurrentTime((t) => Math.min(TOTAL_DURATION, t + 5))}
                            title="Skip forward 5 seconds"
                            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer' }}>
                            <i className="fas fa-rotate-right"></i>
                        </button>

                        <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600, fontFamily: 'monospace', marginLeft: '6px' }}>
                            {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
                        </span>
                    </div>

                    {/* Scene Quick Jump Tabs */}
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '4px 0' }}>
                        {SCENES.map((sc, idx) => (
                            <button
                                key={sc.id}
                                onClick={() => {
                                    let startTime = 0;
                                    for (let i = 0; i < idx; i++) startTime += SCENES[i].duration;
                                    setCurrentTime(startTime);
                                    setIsPlaying(true);
                                }}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: activeSceneIndex === idx ? `1px solid ${sc.accent}` : '1px solid rgba(255,255,255,0.08)',
                                    background: activeSceneIndex === idx ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255,255,255,0.03)',
                                    color: activeSceneIndex === idx ? '#fff' : '#94a3b8',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}>
                                {idx + 1}. {sc.badge}
                            </button>
                        ))}
                    </div>

                    {/* Speed & Fullscreen */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <select
                            value={playbackSpeed}
                            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#e2e8f0',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}>
                            <option value="0.75" style={{ background: '#0f172a' }}>0.75x Speed</option>
                            <option value="1" style={{ background: '#0f172a' }}>1.0x Speed</option>
                            <option value="1.25" style={{ background: '#0f172a' }}>1.25x Speed</option>
                            <option value="1.5" style={{ background: '#0f172a' }}>1.5x Speed</option>
                        </select>

                        <button
                            onClick={toggleFullscreen}
                            title="Fullscreen"
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#94a3b8',
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}>
                            <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoVideoPlayer;
