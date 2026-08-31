import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAIResponse } from '../utils/aiKnowledgeEngine';

const VoiceAIAssistant = ({ isOpen: externalIsOpen, onClose: externalOnClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiReply, setAiReply] = useState(null);
    const [voiceMuted, setVoiceMuted] = useState(() => {
        return localStorage.getItem('gatherly_ai_voice_muted') === 'true';
    });
    const [availableVoices, setAvailableVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [messages, setMessages] = useState([
        {
            sender: 'ai',
            text: "Hello! I am your Gatherly AI Voice Assistant. Tap the microphone and speak to me, or ask 'What does this website mean?' or 'Take me to tickets'!",
            action: null
        }
    ]);

    const voiceMutedRef = useRef(voiceMuted);
    const recognitionRef = useRef(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Keep voiceMutedRef synchronized
    useEffect(() => {
        voiceMutedRef.current = voiceMuted;
    }, [voiceMuted]);

    // Synchronize with external modal trigger if passed
    useEffect(() => {
        if (externalIsOpen !== undefined) {
            setIsOpen(externalIsOpen);
        }
    }, [externalIsOpen]);

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            try {
                window.speechSynthesis.cancel();
            } catch (e) {}
        }
        setIsSpeaking(false);
    };

    const toggleVoiceMute = () => {
        const nextState = !voiceMuted;
        setVoiceMuted(nextState);
        voiceMutedRef.current = nextState;
        localStorage.setItem('gatherly_ai_voice_muted', String(nextState));
        if (nextState) {
            stopSpeaking();
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        if (externalOnClose) externalOnClose();
        stopSpeaking();
    };

    // Load Web Speech Synthesis Voices
    useEffect(() => {
        const loadVoices = () => {
            if ('speechSynthesis' in window) {
                const voices = window.speechSynthesis.getVoices();
                setAvailableVoices(voices);
                const pref = voices.find(v => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('David')) && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en')) || voices[0];
                if (pref) setSelectedVoice(pref);
            }
        };
        loadVoices();
        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
        return () => {
            stopSpeaking();
        };
    }, []);

    // Initialize Web Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
                setTranscript('Listening for your voice...');
                stopSpeaking();
            };

            recognition.onresult = (event) => {
                let current = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    current += event.results[i][0].transcript;
                }
                setTranscript(current);
            };

            recognition.onerror = (event) => {
                console.warn('Speech Recognition Error:', event.error);
                setIsListening(false);
                if (event.error !== 'no-speech') {
                    setTranscript('Voice recognition paused. Try tapping the microphone again.');
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    // Auto-scroll messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isListening]);

    // Speak AI Response using SpeechSynthesis
    const speakText = (text) => {
        if (voiceMutedRef.current || voiceMuted || !('speechSynthesis' in window)) {
            stopSpeaking();
            return;
        }
        stopSpeaking();
        if (!text || !text.trim()) return;

        // Clean markdown formatting for spoken output
        const cleanSpeechText = text
            .replace(/\*\*/g, '')
            .replace(/\[.*?\]\(.*?\)/g, '')
            .replace(/•/g, '')
            .replace(/#/g, '');

        const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
            if (voiceMutedRef.current) {
                stopSpeaking();
            } else {
                setIsSpeaking(true);
            }
        };
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        try {
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            setIsSpeaking(false);
        }
    };

    // Toggle Mic Recording
    const toggleListening = () => {
        if (isListening) {
            if (recognitionRef.current) recognitionRef.current.stop();
            setIsListening(false);
        } else {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                } catch (e) {
                    recognitionRef.current.stop();
                    setTimeout(() => {
                        try { recognitionRef.current.start(); } catch (err) {}
                    }, 200);
                }
            } else {
                alert('Web Speech Recognition API is not supported in this browser version. Please use Google Chrome or Edge.');
            }
        }
    };

    // Process Voice / Text Intent
    const handleProcessIntent = (userQueryText) => {
        if (!userQueryText || !userQueryText.trim()) return;

        const q = userQueryText.trim();
        setMessages(prev => [...prev, { sender: 'user', text: q }]);

        // Fetch intent from AI Knowledge Engine
        const res = getAIResponse(q);
        setAiReply(res);

        const aiMsg = {
            sender: 'ai',
            text: res.text,
            steps: res.steps,
            action: res.action
        };

        setMessages(prev => [...prev, aiMsg]);
        speakText(res.text);

        // Voice Navigation Auto-Trigger
        const lowerQ = q.toLowerCase();
        if (lowerQ.includes('go to tickets') || lowerQ.includes('show tickets') || lowerQ.includes('open tickets')) {
            navigate('/tickets');
        } else if (lowerQ.includes('go to events') || lowerQ.includes('open events')) {
            navigate('/events');
        } else if (lowerQ.includes('go to reports') || lowerQ.includes('open reports')) {
            navigate('/reports');
        } else if (lowerQ.includes('go home') || lowerQ.includes('home page')) {
            navigate('/');
        } else if (lowerQ.includes('go to chat') || lowerQ.includes('open chat') || lowerQ.includes('live chat')) {
            navigate('/realtime');
        }

        setTranscript('');
    };

    // Handle Mic Auto-submit on transcript completion
    useEffect(() => {
        if (!isListening && transcript && transcript !== 'Listening for your voice...' && !transcript.startsWith('Voice recognition')) {
            handleProcessIntent(transcript);
        }
    }, [isListening]);

    return (
        <>
            {/* Floating Cyber Voice Orb Button & Badge (Bottom-Right) */}
            <div className="voice-assistant-orb-btn" style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
            }}>
                {/* Glowing Voice Assistant Badge */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="voice-badge-banner"
                    style={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        color: '#f8fafc',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(12px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                    }}>
                    <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isListening ? '#ef4444' : (voiceMuted ? '#64748b' : '#38bdf8'),
                        boxShadow: isListening ? '0 0 10px #ef4444' : (voiceMuted ? 'none' : '0 0 10px #38bdf8'),
                        display: 'inline-block'
                    }}></span>
                    <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fas fa-robot" style={{ color: '#38bdf8', fontSize: '0.8rem' }}></i>
                            Gatherly AI
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            {voiceMuted ? 'Voice Muted' : (isListening ? 'Listening...' : (isSpeaking ? 'Speaking...' : 'Ask Anything!'))}
                        </div>
                    </div>
                </div>

                {/* Cyber Microphone Orb Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    title="Talk to Gatherly Voice AI Assistant"
                    style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        background: isListening
                            ? 'radial-gradient(circle, #ef4444 0%, #991b1b 100%)'
                            : (voiceMuted ? 'linear-gradient(135deg, #475569, #334155)' : 'linear-gradient(135deg, #0284c7, #2563eb)'),
                        border: '2px solid rgba(255, 255, 255, 0.7)',
                        color: '#ffffff',
                        fontSize: '1.3rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isListening
                            ? '0 0 25px rgba(239, 68, 68, 0.8)'
                            : '0 0 20px rgba(37, 99, 235, 0.6)',
                        transition: 'all 0.25s ease',
                        position: 'relative',
                        padding: 0,
                        margin: 0
                    }}>
                    <i className={`fas ${isListening ? 'fa-microphone fa-bounce' : (voiceMuted ? 'fa-volume-xmark' : 'fa-headset')}`}></i>
                </button>
            </div>

            {/* AI Voice Assistant Modal */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '90px',
                    right: '24px',
                    width: 'calc(100vw - 48px)',
                    maxWidth: '420px',
                    height: '520px',
                    maxHeight: 'calc(100vh - 120px)',
                    background: 'radial-gradient(ellipse at 50% 0%, #0d2147 0%, #081126 60%, #040814 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '20px',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85)',
                    zIndex: 99999,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    backdropFilter: 'blur(20px)',
                    fontFamily: 'Inter, system-ui, sans-serif'
                }}>
                    {/* Assistant Header */}
                    <div style={{
                        padding: '14px 18px',
                        background: 'rgba(15, 23, 42, 0.95)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                flexShrink: 0
                            }}>
                                <i className="fas fa-robot" style={{ fontSize: '1rem' }}></i>
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    Gatherly Voice AI
                                </h4>
                                <span style={{ fontSize: '0.72rem', color: voiceMuted ? '#f87171' : (isListening ? '#ef4444' : (isSpeaking ? '#38bdf8' : '#4ade80')), fontWeight: 600, display: 'block' }}>
                                    ● {voiceMuted ? 'Voice Muted (Text Only)' : (isListening ? 'Listening...' : (isSpeaking ? 'Speaking...' : 'Voice Ready'))}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            {/* Functional Working Mute Toggle Button */}
                            <button
                                onClick={toggleVoiceMute}
                                title={voiceMuted ? "Unmute AI Voice (Voice is currently OFF)" : "Mute AI Voice (Voice is currently ON)"}
                                style={{
                                    background: voiceMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                                    border: voiceMuted ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
                                    color: voiceMuted ? '#f87171' : '#38bdf8',
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s ease'
                                }}>
                                <i className={`fas ${voiceMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
                                <span>{voiceMuted ? 'Muted' : 'Voice ON'}</span>
                            </button>

                            <button onClick={handleClose} style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#94a3b8',
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    </div>

                    {/* Visualizer Sound Waves */}
                    <div style={{
                        padding: '10px 18px',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                    }}>
                        {[0.6, 1.2, 0.8, 1.5, 0.9, 1.3, 0.7, 1.1, 0.5].map((scale, i) => (
                            <div key={i} style={{
                                width: '3px',
                                height: isListening || isSpeaking ? `${20 * scale}px` : '5px',
                                background: isListening ? '#ef4444' : (isSpeaking ? '#38bdf8' : 'rgba(255,255,255,0.2)'),
                                borderRadius: '3px',
                                transition: 'all 0.15s ease'
                            }}></div>
                        ))}
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '8px', fontWeight: 500 }}>
                            {voiceMuted ? 'Voice output is muted' : (isListening ? 'Speak clearly into your microphone' : (isSpeaking ? 'AI Voice Active' : 'Tap Mic to speak'))}
                        </span>
                    </div>

                    {/* Chat Messages Body */}
                    <div style={{
                        flex: 1,
                        padding: '14px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        {messages.map((m, index) => (
                            <div key={index} style={{
                                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                background: m.sender === 'user'
                                    ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                                    : 'rgba(15, 23, 42, 0.85)',
                                border: m.sender === 'user' ? 'none' : '1px solid rgba(56, 189, 248, 0.2)',
                                padding: '10px 14px',
                                borderRadius: m.sender === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                color: '#f8fafc'
                            }}>
                                <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5 }}>
                                    {m.text}
                                </p>

                                {m.steps && (
                                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                        {m.steps.map((st, sIdx) => (
                                            <div key={sIdx} style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '3px' }}>
                                                {st}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {m.action && (
                                    <button
                                        onClick={() => {
                                            navigate(m.action.path);
                                            handleClose();
                                        }}
                                        style={{
                                            marginTop: '10px',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                                            border: 'none',
                                            color: '#fff',
                                            fontSize: '0.78rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                        <i className={`fas ${m.action.icon}`}></i> {m.action.label}
                                    </button>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Voice Prompts */}
                    <div style={{
                        padding: '6px 10px',
                        background: 'rgba(0,0,0,0.2)',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        gap: '6px',
                        overflowX: 'auto'
                    }}>
                        {[
                            'What does this website mean?',
                            'How do QR passes work?',
                            'Take me to Tickets',
                            'Open Live Chat'
                        ].map((prompt, pIdx) => (
                            <button
                                key={pIdx}
                                onClick={() => handleProcessIntent(prompt)}
                                style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#38bdf8',
                                    fontSize: '0.72rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}>
                                🗣️ "{prompt}"
                            </button>
                        ))}
                    </div>

                    {/* Mic Button & Manual Voice Command Input Bar */}
                    <div style={{
                        padding: '12px 14px',
                        background: '#070d1a',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <button
                            onClick={toggleListening}
                            title={isListening ? "Stop listening" : "Tap to speak"}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: isListening ? '#ef4444' : 'linear-gradient(135deg, #2563eb, #0284c7)',
                                border: 'none',
                                color: '#fff',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                            <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                        </button>

                        <input
                            type="text"
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleProcessIntent(transcript);
                                }
                            }}
                            placeholder={isListening ? 'Listening...' : 'Type or speak a voice command...'}
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                color: '#f8fafc',
                                fontSize: '0.85rem',
                                outline: 'none'
                            }}
                        />

                        <button
                            onClick={() => handleProcessIntent(transcript)}
                            disabled={!transcript.trim()}
                            style={{
                                background: transcript.trim() ? '#38bdf8' : 'rgba(255,255,255,0.05)',
                                border: 'none',
                                color: transcript.trim() ? '#0f172a' : '#64748b',
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                cursor: transcript.trim() ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700
                            }}>
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default VoiceAIAssistant;
