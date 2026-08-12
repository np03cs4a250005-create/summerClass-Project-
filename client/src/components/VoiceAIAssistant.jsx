import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAIResponse } from '../utils/aiKnowledgeEngine';

const VoiceAIAssistant = ({ isOpen: externalIsOpen, onClose: externalOnClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiReply, setAiReply] = useState(null);
    const [voiceMuted, setVoiceMuted] = useState(false);
    const [availableVoices, setAvailableVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [messages, setMessages] = useState([
        {
            sender: 'ai',
            text: "Hello! I am your Gatherly AI Voice Assistant. Tap the microphone and speak to me, or ask 'What does this website mean?' or 'Take me to tickets'!",
            action: null
        }
    ]);

    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Synchronize with external modal trigger if passed
    useEffect(() => {
        if (externalIsOpen !== undefined) {
            setIsOpen(externalIsOpen);
        }
    }, [externalIsOpen]);

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
                // Prefer natural English voices
                const pref = voices.find(v => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('David')) && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en')) || voices[0];
                if (pref) setSelectedVoice(pref);
            }
        };
        loadVoices();
        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
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
        if (voiceMuted || !('speechSynthesis' in window)) return;
        stopSpeaking();

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

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synthRef.current.speak(utterance);
    };

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            synthRef.current.cancel();
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
                    setTimeout(() => recognitionRef.current.start(), 200);
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
                bottom: '28px',
                right: '28px',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer'
            }}>
                {/* Always-Visible Glowing Voice Assistant Badge */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="voice-badge-banner"
                    style={{
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 58, 138, 0.9))',
                        border: '1.5px solid rgba(56, 189, 248, 0.5)',
                        borderRadius: '24px',
                        padding: '10px 18px',
                        color: '#f8fafc',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(37, 99, 235, 0.3)',
                        backdropFilter: 'blur(12px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.3s ease'
                    }}>
                    <span style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: isListening ? '#ef4444' : '#38bdf8',
                        boxShadow: isListening ? '0 0 12px #ef4444' : '0 0 12px #38bdf8',
                        display: 'inline-block'
                    }}></span>
                    <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fas fa-sparkles" style={{ color: '#38bdf8', fontSize: '0.8rem' }}></i>
                            AI Voice Assistant
                        </div>
                        <div style={{ fontSize: '0.73rem', color: '#94a3b8', fontWeight: 500 }}>
                            {isListening ? 'Listening...' : (isSpeaking ? 'AI Speaking...' : 'Talk or Ask Anything!')}
                        </div>
                    </div>
                </div>

                {/* Glowing Pulsing Cyber Microphone Orb Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    title="Talk to Gatherly Voice AI Assistant"
                    style={{
                        width: '66px',
                        height: '66px',
                        borderRadius: '50%',
                        background: isListening
                            ? 'radial-gradient(circle, #ef4444 0%, #991b1b 100%)'
                            : 'linear-gradient(135deg, #0284c7, #2563eb)',
                        border: '3px solid rgba(255, 255, 255, 0.8)',
                        color: '#ffffff',
                        fontSize: '1.6rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        boxShadow: isListening
                            ? '0 0 35px rgba(239, 68, 68, 0.9), 0 0 70px rgba(239, 68, 68, 0.5)'
                            : '0 0 30px rgba(37, 99, 235, 0.8), 0 0 60px rgba(56, 189, 248, 0.5)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        padding: 0,
                        margin: 0
                    }}>
                    <i className={`fas ${isListening ? 'fa-microphone fa-bounce' : 'fa-headset'}`} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        width: '100%',
                        height: '100%',
                        transform: isListening ? 'none' : 'translateX(3px)',
                        margin: 0,
                        padding: 0,
                        lineHeight: 1
                    }}></i>
                </button>
            </div>

            {/* AI Voice Assistant Full Interaction Modal Container */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '110px',
                    right: '28px',
                    width: 'calc(100vw - 56px)',
                    maxWidth: '440px',
                    height: '560px',
                    maxHeight: 'calc(100vh - 140px)',
                    background: 'radial-gradient(ellipse at 50% 0%, #0d2147 0%, #081126 60%, #040814 100%)',
                    border: '1.5px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '24px',
                    boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 50px rgba(37, 99, 235, 0.4)',
                    zIndex: 99999,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    backdropFilter: 'blur(20px)',
                    fontFamily: 'Inter, system-ui, sans-serif'
                }}>
                    {/* Assistant Header */}
                    <div style={{
                        padding: '16px 20px',
                        background: 'rgba(15, 23, 42, 0.95)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                            <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                boxShadow: '0 0 15px rgba(37, 99, 235, 0.6)',
                                flexShrink: 0
                            }}>
                                <i className="fas fa-robot" style={{ fontSize: '1.1rem' }}></i>
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    Gatherly Voice AI
                                </h4>
                                <span style={{ fontSize: '0.75rem', color: isListening ? '#ef4444' : (isSpeaking ? '#38bdf8' : '#4ade80'), fontWeight: 600, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    ● {isListening ? 'Listening...' : (isSpeaking ? 'Speaking Response...' : 'Voice Ready')}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            <button onClick={() => setVoiceMuted(!voiceMuted)} title={voiceMuted ? "Unmute AI Voice" : "Mute AI Voice"} style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: voiceMuted ? '#ef4444' : '#38bdf8',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                            }}>
                                <i className={`fas ${voiceMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
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

                    {/* Animated Visualizer Sound Waves */}
                    <div style={{
                        padding: '12px 20px',
                        background: 'rgba(0, 0, 0, 0.25)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        gap: '4px'
                    }}>
                        {[0.6, 1.2, 0.8, 1.5, 0.9, 1.3, 0.7, 1.1, 0.5].map((scale, i) => (
                            <div key={i} style={{
                                width: '4px',
                                height: isListening || isSpeaking ? `${24 * scale}px` : '6px',
                                background: isListening ? '#ef4444' : (isSpeaking ? '#38bdf8' : 'rgba(255,255,255,0.2)'),
                                borderRadius: '4px',
                                transition: 'all 0.15s ease'
                            }}></div>
                        ))}
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: '10px', fontWeight: 500 }}>
                            {isListening ? 'Speak your query clearly...' : (isSpeaking ? 'AI Voice Active' : 'Tap Mic to speak')}
                        </span>
                    </div>

                    {/* Chat Messages Body */}
                    <div style={{
                        flex: 1,
                        padding: '16px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        {messages.map((m, index) => (
                            <div key={index} style={{
                                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                background: m.sender === 'user'
                                    ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                                    : 'rgba(15, 23, 42, 0.85)',
                                border: m.sender === 'user' ? 'none' : '1px solid rgba(56, 189, 248, 0.2)',
                                padding: '12px 16px',
                                borderRadius: m.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                color: '#f8fafc',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                            }}>
                                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
                                    {m.text}
                                </p>

                                {m.steps && (
                                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                        {m.steps.map((st, sIdx) => (
                                            <div key={sIdx} style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
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
                                            marginTop: '12px',
                                            padding: '8px 14px',
                                            borderRadius: '8px',
                                            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                                            border: 'none',
                                            color: '#fff',
                                            fontSize: '0.82rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px'
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
                        padding: '8px 12px',
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
                                    padding: '5px 10px',
                                    borderRadius: '14px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#38bdf8',
                                    fontSize: '0.75rem',
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
                        padding: '14px 16px',
                        background: '#070d1a',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <button
                            onClick={toggleListening}
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: isListening ? '#ef4444' : 'linear-gradient(135deg, #2563eb, #0284c7)',
                                border: 'none',
                                color: '#fff',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: isListening ? '0 0 20px rgba(239,68,68,0.8)' : '0 0 15px rgba(37,99,235,0.5)'
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
                                borderRadius: '10px',
                                padding: '10px 14px',
                                color: '#f8fafc',
                                fontSize: '0.88rem',
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
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
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
