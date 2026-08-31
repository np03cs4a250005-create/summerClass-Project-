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

        // Mouse tracking for subtle interactive reactivity
        const mouse = { x: width / 2, y: height / 2, radius: 160 };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Node Particle definition
        const particleCount = Math.min(Math.floor(window.innerWidth / 28), 55);
        const particles = [];

        const colors = ['#38bdf8', '#818cf8', '#34d399', '#c084fc', '#60a5fa'];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 2 + 1.2,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: Math.random() * 0.5 + 0.3,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }

        // Floating Nebula Glow Orbs
        const orbs = [
            { x: width * 0.25, y: height * 0.25, vx: 0.3, vy: 0.2, r: 320, color: 'rgba(56, 189, 248, 0.08)' },
            { x: width * 0.8, y: height * 0.4, vx: -0.25, vy: 0.35, r: 380, color: 'rgba(124, 58, 237, 0.07)' },
            { x: width * 0.5, y: height * 0.85, vx: 0.2, vy: -0.25, r: 350, color: 'rgba(52, 211, 153, 0.06)' }
        ];

        let tick = 0;

        const render = () => {
            tick++;
            ctx.clearRect(0, 0, width, height);

            // 1. Draw Floating Aurora Orbs
            for (let orb of orbs) {
                orb.x += orb.vx;
                orb.y += orb.vy;

                if (orb.x < -orb.r) orb.x = width + orb.r;
                if (orb.x > width + orb.r) orb.x = -orb.r;
                if (orb.y < -orb.r) orb.y = height + orb.r;
                if (orb.y > height + orb.r) orb.y = -orb.r;

                const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
                grad.addColorStop(0, orb.color);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
                ctx.fill();
            }

            // 2. Update and Draw Particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Mouse subtle repulsion
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    p.x -= (dx / dist) * force * 1.5;
                    p.y -= (dy / dist) * force * 1.5;
                }

                // Regular movement
                p.x += p.vx;
                p.y += p.vy;

                // Screen bounce/wrap
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                // Pulse alpha
                const currentAlpha = p.alpha + Math.sin(tick * p.pulseSpeed + p.pulseOffset) * 0.2;

                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                // 3. Connect close nodes with glowing neural filaments
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const distNodes = Math.hypot(p.x - p2.x, p.y - p2.y);

                    if (distNodes < 110) {
                        const lineAlpha = (1 - distNodes / 110) * 0.25;
                        ctx.strokeStyle = p.color;
                        ctx.globalAlpha = lineAlpha;
                        ctx.lineWidth = 1;
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
