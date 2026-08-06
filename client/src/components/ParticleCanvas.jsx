import React, { useEffect, useRef } from 'react';

const ParticleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let time = 0;

        const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, radius: 240 };

        const handleMouseMove = (e) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.targetX = -1000;
            mouse.targetY = -1000;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Micro Floating Glass Dust Particles
        const particleCount = 55;
        const particles = Array.from({ length: particleCount }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.45,
            r: Math.random() * 2.2 + 1,
            color: ['#818cf8', '#38bdf8', '#f472b6', '#c084fc', '#fbbf24'][Math.floor(Math.random() * 5)],
            alpha: Math.random() * 0.6 + 0.2,
            pulse: Math.random() * Math.PI,
        }));

        // Noomo 3D Wave Ribbon Specifications
        const waves = [
            { color: 'rgba(99, 102, 241, 0.45)', shadow: 'rgba(99, 102, 241, 0.8)', speed: 0.012, amp: 65, freq: 0.003, yOffset: 0.35, width: 3 },
            { color: 'rgba(56, 189, 248, 0.40)', shadow: 'rgba(56, 189, 248, 0.8)', speed: 0.016, amp: 80, freq: 0.0025, yOffset: 0.48, width: 2.5 },
            { color: 'rgba(236, 72, 153, 0.35)', shadow: 'rgba(236, 72, 153, 0.7)', speed: 0.009, amp: 95, freq: 0.002, yOffset: 0.62, width: 3 },
            { color: 'rgba(168, 85, 247, 0.30)', shadow: 'rgba(168, 85, 247, 0.7)', speed: 0.014, amp: 55, freq: 0.0035, yOffset: 0.75, width: 2 },
            { color: 'rgba(251, 191, 36, 0.25)', shadow: 'rgba(251, 191, 36, 0.6)', speed: 0.018, amp: 70, freq: 0.0028, yOffset: 0.25, width: 1.8 },
        ];

        const draw = () => {
            time += 0.015;

            // Smooth mouse interpolation
            mouse.x += (mouse.targetX - mouse.x) * 0.08;
            mouse.y += (mouse.targetY - mouse.y) * 0.08;

            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);

            // 1. Deep Noomo Cosmic Obsidian Gradient Base
            const baseGrad = ctx.createLinearGradient(0, 0, w, h);
            baseGrad.addColorStop(0, '#05070f');
            baseGrad.addColorStop(0.5, '#080c1b');
            baseGrad.addColorStop(1, '#04050a');
            ctx.fillStyle = baseGrad;
            ctx.fillRect(0, 0, w, h);

            // 2. Interactive Ambient Mouse Glow Aura (Noomo Spotlight Lens Flare)
            if (mouse.x > 0 && mouse.y > 0) {
                const mouseGrad = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, mouse.radius);
                mouseGrad.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
                mouseGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.15)');
                mouseGrad.addColorStop(0.7, 'rgba(236, 72, 153, 0.08)');
                mouseGrad.addColorStop(1, 'transparent');

                ctx.fillStyle = mouseGrad;
                ctx.fillRect(0, 0, w, h);
            }

            // 3. Noomo Interactive 3D Fluid Liquid Wave Mesh
            waves.forEach((wave, waveIdx) => {
                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = wave.width;
                ctx.strokeStyle = wave.color;
                ctx.shadowBlur = 18;
                ctx.shadowColor = wave.shadow;

                const baseLineY = h * wave.yOffset;
                const step = 8;

                ctx.moveTo(0, baseLineY);

                for (let x = 0; x <= w + step; x += step) {
                    // Sine/Cosine Fluid Equations
                    let waveY = Math.sin(x * wave.freq + time * (1 + waveIdx * 0.2)) * wave.amp +
                                Math.cos(x * (wave.freq * 1.5) - time * 0.8) * (wave.amp * 0.5);

                    // Interactive Mouse Wave Distortion
                    const dx = x - mouse.x;
                    const dy = (baseLineY + waveY) - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        const factor = (1 - dist / mouse.radius);
                        waveY -= Math.sin(factor * Math.PI) * 45;
                    }

                    ctx.lineTo(x, baseLineY + waveY);
                }

                ctx.stroke();

                // Draw translucent gradient fill beneath bottom wave
                if (waveIdx === 2 || waveIdx === 3) {
                    ctx.lineTo(w, h);
                    ctx.lineTo(0, h);
                    ctx.closePath();
                    ctx.fillStyle = wave.color.replace(/[\d\.]+\)$/, '0.05)');
                    ctx.fill();
                }
                ctx.restore();
            });

            // 4. Floating Micro Dust Particles & Constellation Links
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                p.pulse += 0.02;
                const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.2;

                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.5, p.r), 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
                ctx.shadowBlur = 12;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.globalAlpha = 1.0;

                // Draw Constellation Lines between nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const pdx = p.x - p2.x;
                    const pdy = p.y - p2.y;
                    const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

                    if (pdist < 110) {
                        const lineAlpha = (1 - pdist / 110) * 0.18;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            });

            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
};

export default ParticleCanvas;
