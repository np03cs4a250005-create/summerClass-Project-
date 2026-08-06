// Web Audio API — Premium UI Sound Effects Engine
// Robotic Click + Water Flow / Liquid Drip Click Sound
class SoundEffects {
    constructor() {
        this.audioCtx = null;
    }

    init() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    // ── Water Flow / Liquid Click Sound ─────────────────────────────────
    // Layered synthesis: noise burst (water rush) + resonant bubble pops +
    // wet reverb tail + pitch-falling water droplet tone
    playWaterClick() {
        try {
            this.init();
            const ctx = this.audioCtx;
            if (!ctx) return;
            const now = ctx.currentTime;

            // ─ Master wet/dry mixer ────────────────────────────────────────
            const master = ctx.createGain();
            master.gain.value = 0.78;
            master.connect(ctx.destination);

            // ─ Reverb (wet room) ──────────────────────────────────────────
            const convolver = ctx.createConvolver();
            const impulseLen = ctx.sampleRate * 0.55;
            const impulse = ctx.createBuffer(2, impulseLen, ctx.sampleRate);
            for (let c = 0; c < 2; c++) {
                const d = impulse.getChannelData(c);
                for (let i = 0; i < impulseLen; i++) {
                    d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLen, 2.2);
                }
            }
            convolver.buffer = impulse;
            const reverbGain = ctx.createGain();
            reverbGain.gain.value = 0.28;
            convolver.connect(reverbGain);
            reverbGain.connect(master);

            // ─ 1. Water Rush Noise Burst (short broadband splash) ─────────
            const rushLen = Math.floor(ctx.sampleRate * 0.11);
            const rushBuf = ctx.createBuffer(1, rushLen, ctx.sampleRate);
            const rushData = rushBuf.getChannelData(0);
            for (let i = 0; i < rushLen; i++) {
                rushData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / rushLen, 1.4);
            }
            const rush = ctx.createBufferSource();
            rush.buffer = rushBuf;

            // Bandpass centered at watery frequency
            const rushBp = ctx.createBiquadFilter();
            rushBp.type = 'bandpass';
            rushBp.frequency.setValueAtTime(1100, now);
            rushBp.frequency.exponentialRampToValueAtTime(400, now + 0.11);
            rushBp.Q.value = 0.7;

            const rushGain = ctx.createGain();
            rushGain.gain.setValueAtTime(0.55, now);
            rushGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

            rush.connect(rushBp);
            rushBp.connect(rushGain);
            rushGain.connect(master);
            rushGain.connect(convolver);
            rush.start(now);
            rush.stop(now + 0.12);

            // ─ 2. High Frequency Water Sparkle (sizzle layer) ─────────────
            const sparkLen = Math.floor(ctx.sampleRate * 0.06);
            const sparkBuf = ctx.createBuffer(1, sparkLen, ctx.sampleRate);
            const sparkData = sparkBuf.getChannelData(0);
            for (let i = 0; i < sparkLen; i++) {
                sparkData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / sparkLen, 2.5);
            }
            const spark = ctx.createBufferSource();
            spark.buffer = sparkBuf;

            const sparkHp = ctx.createBiquadFilter();
            sparkHp.type = 'highpass';
            sparkHp.frequency.value = 4200;

            const sparkGain = ctx.createGain();
            sparkGain.gain.setValueAtTime(0.22, now);
            sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

            spark.connect(sparkHp);
            sparkHp.connect(sparkGain);
            sparkGain.connect(master);
            spark.start(now);
            spark.stop(now + 0.07);

            // ─ 3. Bubble Pop 1 — primary drip ────────────────────────────
            const b1 = ctx.createOscillator();
            const b1g = ctx.createGain();
            const b1f = ctx.createBiquadFilter();
            b1.type = 'sine';
            b1.frequency.setValueAtTime(820, now);
            b1.frequency.exponentialRampToValueAtTime(260, now + 0.065);
            b1f.type = 'lowpass';
            b1f.frequency.value = 3200;
            b1g.gain.setValueAtTime(0.0, now);
            b1g.gain.linearRampToValueAtTime(0.42, now + 0.003);
            b1g.gain.exponentialRampToValueAtTime(0.001, now + 0.068);
            b1.connect(b1f); b1f.connect(b1g); b1g.connect(master);
            b1g.connect(convolver);
            b1.start(now); b1.stop(now + 0.07);

            // ─ 4. Bubble Pop 2 — secondary micro-drip ────────────────────
            const b2Start = now + 0.03;
            const b2 = ctx.createOscillator();
            const b2g = ctx.createGain();
            b2.type = 'sine';
            b2.frequency.setValueAtTime(1100, b2Start);
            b2.frequency.exponentialRampToValueAtTime(380, b2Start + 0.05);
            b2g.gain.setValueAtTime(0.0, b2Start);
            b2g.gain.linearRampToValueAtTime(0.28, b2Start + 0.004);
            b2g.gain.exponentialRampToValueAtTime(0.001, b2Start + 0.055);
            b2.connect(b2g); b2g.connect(master);
            b2g.connect(convolver);
            b2.start(b2Start); b2.stop(b2Start + 0.06);

            // ─ 5. Bubble Pop 3 — tiny high sparkle drip ──────────────────
            const b3Start = now + 0.055;
            const b3 = ctx.createOscillator();
            const b3g = ctx.createGain();
            b3.type = 'sine';
            b3.frequency.setValueAtTime(1600, b3Start);
            b3.frequency.exponentialRampToValueAtTime(520, b3Start + 0.035);
            b3g.gain.setValueAtTime(0.0, b3Start);
            b3g.gain.linearRampToValueAtTime(0.16, b3Start + 0.003);
            b3g.gain.exponentialRampToValueAtTime(0.001, b3Start + 0.038);
            b3.connect(b3g); b3g.connect(master);
            b3.start(b3Start); b3.stop(b3Start + 0.04);

            // ─ 6. Low Thump (water hit surface) ──────────────────────────
            const thump = ctx.createOscillator();
            const thumpG = ctx.createGain();
            thump.type = 'sine';
            thump.frequency.setValueAtTime(95, now);
            thump.frequency.exponentialRampToValueAtTime(38, now + 0.08);
            thumpG.gain.setValueAtTime(0.32, now);
            thumpG.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
            thump.connect(thumpG); thumpG.connect(master);
            thump.start(now); thump.stop(now + 0.1);

        } catch (e) {
            // Fallback silence
        }
    }

    // ── Keep original robotic click (legacy) ────────────────────────────
    playRoboticClick() {
        this.playWaterClick();
    }
}

export const soundFx = new SoundEffects();
