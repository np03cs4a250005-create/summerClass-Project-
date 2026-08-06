import React, { useEffect, useRef } from 'react';

const ParticleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            time += 0.012;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const w = canvas.width;
            const h = canvas.height;

            // 1. Cerebrium AI Deep Radial Glow Nebula
            const grad = ctx.createRadialGradient(w * 0.5, h * 0.35, 10, w * 0.5, h * 0.35, Math.max(w, h) * 0.7);
            grad.addColorStop(0, 'rgba(99, 102, 241, 0.38)');
            grad.addColorStop(0.35, 'rgba(56, 189, 248, 0.16)');
            grad.addColorStop(0.7, 'rgba(15, 23, 42, 0.92)');
            grad.addColorStop(1, '#030712');

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // 2. Cerebrium AI Perspective Cyber Grid Lines
            ctx.save();
            ctx.lineWidth = 1;

            const horizonY = h * 0.45;

            // Horizontal Perspective Grid Lines
            for (let y = horizonY; y < h; y += Math.pow((y - horizonY) / 16, 1.4) + 8) {
                const alpha = Math.min(0.45, (y - horizonY) / (h - horizonY));
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.strokeStyle = `rgba(99, 102, 241, ${alpha * 0.55})`;
                ctx.stroke();
            }

            // Vertical Perspective Vanishing Lines (Converging to Center Horizon)
            const vanishX = w * 0.5;
            const numLines = 40;
            for (let i = -numLines; i <= numLines; i++) {
                const targetX = vanishX + i * 65;
                ctx.beginPath();
                ctx.moveTo(vanishX, horizonY);
                ctx.lineTo(targetX, h);
                const alpha = Math.max(0.04, 0.35 - Math.abs(i) * 0.008);
                ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.45})`;
                ctx.stroke();
            }
            ctx.restore();

            // 3. Floating Cerebrium Light Sparks & Glowing Cyber Nodes
            const sparkCount = 40;
            for (let i = 0; i < sparkCount; i++) {
                const sx = (Math.sin(time * 0.7 + i * 1.7) * 0.5 + 0.5) * w;
                const sy = (Math.cos(time * 0.5 + i * 2.2) * 0.5 + 0.5) * h;
                const sr = Math.sin(time * 2 + i) * 1.5 + 2;
                const salpha = Math.abs(Math.sin(time * 1.2 + i)) * 0.65 + 0.25;

                ctx.beginPath();
                ctx.arc(sx, sy, Math.max(0.8, sr), 0, Math.PI * 2);
                ctx.fillStyle = i % 2 === 0 ? `rgba(129, 140, 248, ${salpha})` : `rgba(56, 189, 248, ${salpha})`;
                ctx.shadowBlur = 16;
                ctx.shadowColor = i % 2 === 0 ? 'rgba(99, 102, 241, 0.9)' : 'rgba(56, 189, 248, 0.9)';
                ctx.fill();
            }

            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            window.removeEventListener('resize', resize);
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
