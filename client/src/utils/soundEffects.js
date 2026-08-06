// Web Audio API Synthesized Premium Satisfying Haptic UI Click Generator
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
    }

    playRoboticClick() {
        try {
            this.init();
            if (!this.audioCtx) return;

            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            const ctx = this.audioCtx;
            const now = ctx.currentTime;
            const duration = 0.038; // 38ms crisp, ultra-satisfying tactile click

            // 1. Primary Smooth Sine Pop
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(780, now);
            osc.frequency.exponentialRampToValueAtTime(160, now + duration);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2200, now);

            gain.gain.setValueAtTime(0.22, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            // 2. Warm Sub Haptic Bump Layer
            const subOsc = ctx.createOscillator();
            const subGain = ctx.createGain();

            subOsc.type = 'triangle';
            subOsc.frequency.setValueAtTime(160, now);
            subOsc.frequency.exponentialRampToValueAtTime(45, now + duration);

            subGain.gain.setValueAtTime(0.14, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            subOsc.connect(subGain);
            subGain.connect(ctx.destination);

            // 3. Crisp High Micro-Transient
            const snapOsc = ctx.createOscillator();
            const snapGain = ctx.createGain();

            snapOsc.type = 'sine';
            snapOsc.frequency.setValueAtTime(2400, now);
            snapOsc.frequency.exponentialRampToValueAtTime(500, now + 0.008);

            snapGain.gain.setValueAtTime(0.08, now);
            snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

            snapOsc.connect(snapGain);
            snapGain.connect(ctx.destination);

            // Start & Stop
            osc.start(now);
            subOsc.start(now);
            snapOsc.start(now);

            osc.stop(now + duration);
            subOsc.stop(now + duration);
            snapOsc.stop(now + 0.01);
        } catch (e) {
            // Audio Context safety fallback
        }
    }
}

export const soundFx = new SoundEffects();
