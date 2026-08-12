import React, { useEffect, useRef } from 'react';

const ParticleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let time = 0;

        // Mouse & Hold State for Cerebrium.ai Warp Effect
        const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, radius: 260 };
        const hold = {
            isHolding: false,
            x: -1000,
            y: -1000,
            targetX: -1000,
            targetY: -1000,
            energy: 0, // 0 to 1 smooth buildup
            holdDuration: 0
        };

        // Shockwaves & Burst Sparks arrays
        let shockwaves = [];
        let sparks = [];

        // 3D Perspective Grid Vertices for Matrix Warp
        const cols = 28;
        const rows = 18;

        const handleMouseMove = (e) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
            if (hold.isHolding) {
                hold.targetX = e.clientX;
                hold.targetY = e.clientY;
            }
        };

        const handleMouseDown = (e) => {
            // Ignore clicks on buttons/inputs/interactive elements so UI controls work normally
            if (e.target.closest('button, a, input, select, textarea, .holo-card, .btn')) {
                return;
            }
            hold.isHolding = true;
            hold.x = e.clientX;
            hold.y = e.clientY;
            hold.targetX = e.clientX;
            hold.targetY = e.clientY;

            // Spawn initial shockwave explosion ring
            shockwaves.push({
                x: e.clientX,
                y: e.clientY,
                r: 10,
                maxR: 450,
                alpha: 0.9,
                color: '#38bdf8',
                width: 4
            });

            // Spawn radial particle burst sparks
            for (let i = 0; i < 35; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 8 + 3;
                sparks.push({
                    x: e.clientX,
                    y: e.clientY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    r: Math.random() * 3 + 2,
                    color: ['#38bdf8', '#818cf8', '#f472b6', '#a855f7', '#fbbf24'][Math.floor(Math.random() * 5)],
                    alpha: 1.0,
                    decay: Math.random() * 0.02 + 0.015
                });
            }
        };

        const handleMouseUp = () => {
            if (!hold.isHolding) return;
            hold.isHolding = false;

            // Release Burst Shockwave Ring
            shockwaves.push({
                x: hold.x,
                y: hold.y,
                r: 20,
                maxR: 650,
                alpha: 1.0,
                color: '#f472b6',
                width: 6
            });

            // Release outwards fireworks particle burst
            for (let i = 0; i < 45; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 12 + 4;
                sparks.push({
                    x: hold.x,
                    y: hold.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    r: Math.random() * 3.5 + 1.5,
                    color: ['#38bdf8', '#a855f7', '#4ade80', '#fbbf24'][Math.floor(Math.random() * 4)],
                    alpha: 1.0,
                    decay: Math.random() * 0.025 + 0.01
                });
            }
        };

        const handleTouchStart = (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY, target: e.target });
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
            }
        };

        const handleTouchEnd = () => handleMouseUp();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Micro Floating Glass Dust Particles
        const particleCount = 70;
        const particles = Array.from({ length: particleCount }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            r: Math.random() * 2.5 + 1,
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
            time += 0.018;

            // Smooth mouse & hold position interpolation
            mouse.x += (mouse.targetX - mouse.x) * 0.08;
            mouse.y += (mouse.targetY - mouse.y) * 0.08;

            if (hold.isHolding) {
                hold.x += (hold.targetX - hold.x) * 0.12;
                hold.y += (hold.targetY - hold.y) * 0.12;
                hold.energy = Math.min(1.0, hold.energy + 0.06);
                hold.holdDuration += 0.02;

                // Continuously spawn shockwaves while holding
                if (Math.random() < 0.25) {
                    shockwaves.push({
                        x: hold.x,
                        y: hold.y,
                        r: 5,
                        maxR: 350 + hold.energy * 150,
                        alpha: 0.7,
                        color: ['#38bdf8', '#a855f7', '#ec4899', '#6366f1'][Math.floor(Math.random() * 4)],
                        width: 3
                    });
                }
            } else {
                hold.energy = Math.max(0.0, hold.energy - 0.04);
                hold.holdDuration = 0;
            }

            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);

            // 1. Cosmic Gradient Base
            const baseGrad = ctx.createLinearGradient(0, 0, w, h);
            baseGrad.addColorStop(0, '#05070f');
            baseGrad.addColorStop(0.5, '#080c1b');
            baseGrad.addColorStop(1, '#04050a');
            ctx.fillStyle = baseGrad;
            ctx.fillRect(0, 0, w, h);

            // 2. Cerebrium.ai 3D Gravitational Grid Mesh Distortion
            const cellW = w / cols;
            const cellH = h / rows;

            ctx.save();
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.08 + hold.energy * 0.25})`;
            ctx.lineWidth = 1 + hold.energy * 1.5;

            // Draw Deformable Horizontal Grid Lines
            for (let r = 0; r <= rows; r++) {
                ctx.beginPath();
                for (let c = 0; c <= cols; c++) {
                    let gx = c * cellW;
                    let gy = r * cellH;

                    if (hold.energy > 0.01) {
                        const dx = gx - hold.x;
                        const dy = gy - hold.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const maxDist = 420;

                        if (dist < maxDist) {
                            const pullFactor = (1 - dist / maxDist) * hold.energy * 90;
                            const angle = Math.atan2(dy, dx);

                            // Vortex Spiral Offset (Cerebrium 3D Warp)
                            const spiralAngle = angle + (1 - dist / maxDist) * Math.PI * 0.5;
                            gx -= Math.cos(spiralAngle) * pullFactor;
                            gy -= Math.sin(spiralAngle) * pullFactor;
                        }
                    }

                    if (c === 0) ctx.moveTo(gx, gy);
                    else ctx.lineTo(gx, gy);
                }
                ctx.stroke();
            }

            // Draw Deformable Vertical Grid Lines
            for (let c = 0; c <= cols; c++) {
                ctx.beginPath();
                for (let r = 0; r <= rows; r++) {
                    let gx = c * cellW;
                    let gy = r * cellH;

                    if (hold.energy > 0.01) {
                        const dx = gx - hold.x;
                        const dy = gy - hold.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const maxDist = 420;

                        if (dist < maxDist) {
                            const pullFactor = (1 - dist / maxDist) * hold.energy * 90;
                            const angle = Math.atan2(dy, dx);
                            const spiralAngle = angle + (1 - dist / maxDist) * Math.PI * 0.5;
                            gx -= Math.cos(spiralAngle) * pullFactor;
                            gy -= Math.sin(spiralAngle) * pullFactor;
                        }
                    }

                    if (r === 0) ctx.moveTo(gx, gy);
                    else ctx.lineTo(gx, gy);
                }
                ctx.stroke();
            }
            ctx.restore();

            // 3. Interactive Mouse & Hold Lens Flare Glow
            const activeX = hold.energy > 0.1 ? hold.x : mouse.x;
            const activeY = hold.energy > 0.1 ? hold.y : mouse.y;

            if (activeX > 0 && activeY > 0) {
                const glowRadius = mouse.radius + hold.energy * 250;
                const mouseGrad = ctx.createRadialGradient(activeX, activeY, 10, activeX, activeY, glowRadius);
                mouseGrad.addColorStop(0, `rgba(99, 102, 241, ${0.35 + hold.energy * 0.4})`);
                mouseGrad.addColorStop(0.3, `rgba(56, 189, 248, ${0.2 + hold.energy * 0.3})`);
                mouseGrad.addColorStop(0.6, `rgba(236, 72, 153, ${0.1 + hold.energy * 0.2})`);
                mouseGrad.addColorStop(1, 'transparent');

                ctx.fillStyle = mouseGrad;
                ctx.fillRect(0, 0, w, h);
            }

            // 4. Fluid 3D Wave Ribbons with Hold Displacement
            waves.forEach((wave, waveIdx) => {
                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = wave.width + hold.energy * 2;
                ctx.strokeStyle = wave.color;
                ctx.shadowBlur = 18 + hold.energy * 20;
                ctx.shadowColor = wave.shadow;

                const baseLineY = h * wave.yOffset;
                const step = 8;

                ctx.moveTo(0, baseLineY);

                for (let x = 0; x <= w + step; x += step) {
                    let waveY = Math.sin(x * wave.freq + time * (1 + waveIdx * 0.2)) * wave.amp +
                                Math.cos(x * (wave.freq * 1.5) - time * 0.8) * (wave.amp * 0.5);

                    // Pull waves towards hold center
                    if (hold.energy > 0.01) {
                        const hdx = x - hold.x;
                        const hdy = (baseLineY + waveY) - hold.y;
                        const hdist = Math.sqrt(hdx * hdx + hdy * hdy);
                        if (hdist < 380) {
                            const factor = (1 - hdist / 380);
                            waveY -= Math.sin(factor * Math.PI) * (70 * hold.energy);
                        }
                    }

                    ctx.lineTo(x, baseLineY + waveY);
                }

                ctx.stroke();
                ctx.restore();
            });

            // 5. Expand & Draw Cerebrium.ai Laser Shockwaves
            shockwaves.forEach((sw, idx) => {
                sw.r += 6 + (1 - sw.r / sw.maxR) * 8;
                sw.alpha -= 0.018;

                if (sw.alpha > 0) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
                    ctx.strokeStyle = sw.color;
                    ctx.globalAlpha = Math.max(0, sw.alpha);
                    ctx.lineWidth = sw.width;
                    ctx.shadowBlur = 25;
                    ctx.shadowColor = sw.color;
                    ctx.stroke();
                    ctx.restore();
                }
            });
            shockwaves = shockwaves.filter(sw => sw.alpha > 0 && sw.r < sw.maxR);

            // 6. Draw Explosion Burst Sparks
            sparks.forEach((sp) => {
                sp.x += sp.vx;
                sp.y += sp.vy;
                sp.vx *= 0.94;
                sp.vy *= 0.94;
                sp.alpha -= sp.decay;

                if (sp.alpha > 0) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(sp.x, sp.y, Math.max(0.5, sp.r), 0, Math.PI * 2);
                    ctx.fillStyle = sp.color;
                    ctx.globalAlpha = Math.max(0, sp.alpha);
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = sp.color;
                    ctx.fill();
                    ctx.restore();
                }
            });
            sparks = sparks.filter(sp => sp.alpha > 0);

            // 7. Floating Particles & Black-hole Vortex Gravity
            particles.forEach((p, i) => {
                // If holding, pull particles in spiral trajectory towards hold point
                if (hold.energy > 0.05) {
                    const pdx = hold.x - p.x;
                    const pdy = hold.y - p.y;
                    const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

                    if (pdist < 450) {
                        const pullForce = (1 - pdist / 450) * 0.8 * hold.energy;
                        const angle = Math.atan2(pdy, pdx);

                        // Tangential & Radial acceleration for spiral vortex
                        p.vx += (Math.cos(angle) * pullForce) + (-Math.sin(angle) * pullForce * 0.6);
                        p.vy += (Math.sin(angle) * pullForce) + (Math.cos(angle) * pullForce * 0.6);
                    }
                }

                p.x += p.vx;
                p.y += p.vy;

                // Damping
                p.vx *= 0.98;
                p.vy *= 0.98;

                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                p.pulse += 0.02;
                const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.2 + (hold.energy * 0.3);

                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.5, p.r + hold.energy * 1.5), 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
                ctx.shadowBlur = 12 + hold.energy * 15;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.globalAlpha = 1.0;

                // Constellation Links
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const pdx = p.x - p2.x;
                    const pdy = p.y - p2.y;
                    const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
                    const linkMax = 110 + hold.energy * 60;

                    if (pdist < linkMax) {
                        const lineAlpha = (1 - pdist / linkMax) * (0.18 + hold.energy * 0.3);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
                        ctx.lineWidth = 0.6 + hold.energy * 1.2;
                        ctx.stroke();
                    }
                }
            });

            // 8. Cerebrium HUD Laser Core & Rotating Rays during Hold
            if (hold.energy > 0.1) {
                ctx.save();
                ctx.translate(hold.x, hold.y);

                // Rotating Energy Spokes
                const rayCount = 8;
                for (let r = 0; r < rayCount; r++) {
                    const rayAngle = (time * 2) + (r * (Math.PI * 2 / rayCount));
                    const rayLen = 40 + Math.sin(time * 5 + r) * 15 + (hold.energy * 60);

                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(Math.cos(rayAngle) * rayLen, Math.sin(rayAngle) * rayLen);
                    ctx.strokeStyle = r % 2 === 0 ? 'rgba(56, 189, 248, 0.7)' : 'rgba(236, 72, 153, 0.7)';
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#38bdf8';
                    ctx.stroke();
                }

                // Core Pulse Circle
                ctx.beginPath();
                ctx.arc(0, 0, 14 + Math.sin(time * 8) * 4 + (hold.energy * 12), 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 30;
                ctx.shadowColor = '#38bdf8';
                ctx.fill();

                // Outer Cyber Ring
                ctx.beginPath();
                ctx.arc(0, 0, 32 + (hold.energy * 20), 0, Math.PI * 2);
                ctx.strokeStyle = '#38bdf8';
                ctx.setLineDash([8, 8]);
                ctx.lineWidth = 2;
                ctx.stroke();

                // Holographic Status Label
                ctx.setLineDash([]);
                ctx.fillStyle = '#38bdf8';
                ctx.font = '700 11px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`GATHERLY WARP ENGINE • ${Math.round(hold.energy * 100)}%`, 0, 52);

                ctx.restore();
            }

            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
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
