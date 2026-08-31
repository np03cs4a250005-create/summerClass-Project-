import React, { useEffect, useRef } from 'react';

const AnimatedCerebriumBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        // Smooth Mouse lerp for Cerebrium Cursor Spotlight
        const mouse = { x: width / 2, y: height * 0.35, targetX: width / 2, targetY: height * 0.35, radius: 260 };

        const handleMouseMove = (e) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Grid Configuration
        const gridSize = 46;

        // Laser Scanning Light Beams (Cerebrium signature traveling light rays)
        const beams = [];
        const maxBeams = 10;

        const createBeam = () => {
            const isHorizontal = Math.random() > 0.5;
            const speed = (Math.random() * 2.5 + 2.0) * (Math.random() > 0.5 ? 1 : -1);
            if (isHorizontal) {
                const row = Math.floor(Math.random() * Math.ceil(height / gridSize));
                return {
                    isHorizontal: true,
                    x: speed > 0 ? -120 : width + 120,
                    y: row * gridSize,
                    len: Math.random() * 140 + 100,
                    speed,
                    color: Math.random() > 0.4 ? '#38bdf8' : '#818cf8',
                    alpha: Math.random() * 0.6 + 0.4
                };
            } else {
                const col = Math.floor(Math.random() * Math.ceil(width / gridSize));
                return {
                    isHorizontal: false,
                    x: col * gridSize,
                    y: speed > 0 ? -120 : height + 120,
                    len: Math.random() * 140 + 100,
                    speed,
                    color: Math.random() > 0.4 ? '#38bdf8' : '#34d399',
                    alpha: Math.random() * 0.6 + 0.4
                };
            }
        };

        for (let i = 0; i < maxBeams; i++) {
            beams.push(createBeam());
        }

        // Floating Stardust Particles
        const particleCount = Math.min(Math.floor(width / 32), 45);
        const particles = [];
        const colors = ['#38bdf8', '#818cf8', '#a855f7', '#34d399', '#67e8f9'];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 1.8 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: Math.random() * 0.6 + 0.2,
                twinkleSpeed: Math.random() * 0.03 + 0.015,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }

        let tick = 0;

        const render = () => {
            tick++;
            ctx.clearRect(0, 0, width, height);

            // Interpolate mouse smoothly
            mouse.x += (mouse.targetX - mouse.x) * 0.08;
            mouse.y += (mouse.targetY - mouse.y) * 0.08;

            // 1. Draw Top Horizon Volumetric Glowing Cone (Cerebrium signature spotlight)
            const topHorizonGrad = ctx.createRadialGradient(
                width / 2, -60, 20,
                width / 2, 80, width * 0.75
            );
            const horizonPulse = 0.22 + Math.sin(tick * 0.015) * 0.05;
            topHorizonGrad.addColorStop(0, `rgba(56, 189, 248, ${horizonPulse * 1.2})`);
            topHorizonGrad.addColorStop(0.35, `rgba(124, 58, 237, ${horizonPulse * 0.7})`);
            topHorizonGrad.addColorStop(0.7, `rgba(37, 99, 235, ${horizonPulse * 0.3})`);
            topHorizonGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = topHorizonGrad;
            ctx.fillRect(0, 0, width, height * 0.85);

            // 2. Draw Interactive Mouse Spotlight Glow Flare
            const mouseGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius);
            mouseGrad.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
            mouseGrad.addColorStop(0.5, 'rgba(124, 58, 237, 0.06)');
            mouseGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = mouseGrad;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
            ctx.fill();

            // 3. Draw Cyber Matrix Grid Lines
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';

            // Vertical Grid Lines
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal Grid Lines
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // 4. Update and Render Scanning Light Beams (Laser Rays on Grid)
            for (let i = 0; i < beams.length; i++) {
                const b = beams[i];
                if (b.isHorizontal) {
                    b.x += b.speed;
                    const isOffscreen = b.speed > 0 ? b.x - b.len > width : b.x + b.len < 0;
                    if (isOffscreen) {
                        beams[i] = createBeam();
                        continue;
                    }

                    const grad = ctx.createLinearGradient(b.x - b.speed * (b.len / 2), b.y, b.x, b.y);
                    grad.addColorStop(0, 'transparent');
                    grad.addColorStop(0.8, b.color);
                    grad.addColorStop(1, '#ffffff');

                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 1.6;
                    ctx.shadowColor = b.color;
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.moveTo(b.x - b.speed * (b.len / 2), b.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                    ctx.shadowBlur = 0; // reset
                } else {
                    b.y += b.speed;
                    const isOffscreen = b.speed > 0 ? b.y - b.len > height : b.y + b.len < 0;
                    if (isOffscreen) {
                        beams[i] = createBeam();
                        continue;
                    }

                    const grad = ctx.createLinearGradient(b.x, b.y - b.speed * (b.len / 2), b.x, b.y);
                    grad.addColorStop(0, 'transparent');
                    grad.addColorStop(0.8, b.color);
                    grad.addColorStop(1, '#ffffff');

                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 1.6;
                    ctx.shadowColor = b.color;
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.moveTo(b.x, b.y - b.speed * (b.len / 2));
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                    ctx.shadowBlur = 0; // reset
                }
            }

            // 5. Draw Glowing Grid Crosshair Intersections Near Mouse
            for (let x = 0; x < width; x += gridSize) {
                for (let y = 0; y < height; y += gridSize) {
                    const distToMouse = Math.hypot(x - mouse.x, y - mouse.y);
                    if (distToMouse < mouse.radius * 0.8) {
                        const alpha = (1 - distToMouse / (mouse.radius * 0.8)) * 0.45;
                        ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
                        ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
                    }
                }
            }

            // 6. Draw Ambient Floating Cyber Stardust Particles & Connecting Filaments
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Mouse interaction
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    const force = (140 - dist) / 140;
                    p.x -= (dx / dist) * force * 1.2;
                    p.y -= (dy / dist) * force * 1.2;
                }

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                const currentAlpha = p.alpha + Math.sin(tick * p.twinkleSpeed + p.twinkleOffset) * 0.25;

                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                // Faint Constellation Links
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dNodes = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dNodes < 95) {
                        ctx.strokeStyle = p.color;
                        ctx.globalAlpha = (1 - dNodes / 95) * 0.2;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            ctx.globalAlpha = 1.0;
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
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
                zIndex: 0
            }}
        />
    );
};

export default AnimatedCerebriumBackground;
