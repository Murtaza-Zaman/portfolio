/**
 * genesisAudio.js — Precision Glass & Crystal Audio Engine
 *
 * Designed for the single-screen 3D crystal preloader:
 * - 0.0s: Deep pure sub-bass emergence
 * - 1.0s: Ambient glass harmonic resonance
 * - 2.5s: Precision metallic monogram lock
 * - 3.5s: Gentle atmospheric transition
 */

class CrystalAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.droneOsc = null;
    this.droneGain = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch {
      // AudioContext blocked or unsupported
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted && this.droneGain && this.ctx) {
      this.droneGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
    }
  }

  // Phase 1: Pure Sub-Bass Emergence
  startCrystalEmergence() {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === "suspended") this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(42, now);
      osc.frequency.exponentialRampToValueAtTime(52, now + 1.2);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(80, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.04, now + 0.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      this.droneOsc = osc;
      this.droneGain = gain;
    } catch {
      // Ignored
    }
  }

  // Phase 2: Glass Harmonic Resonance
  triggerGlassResonance() {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === "suspended") this.ctx.resume();
      const now = this.ctx.currentTime;
      const freqs = [659.25, 987.77, 1318.51]; // E5, B5, E6 pristine glass chord

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.001, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.015, now + idx * 0.05 + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.85);
      });
    } catch {
      // Ignored
    }
  }

  // Phase 3: Monogram Metallic Lock
  triggerMonogramLock() {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === "suspended") this.ctx.resume();
      const now = this.ctx.currentTime;

      // Clean metallic ping
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = "sine";
      clickOsc.frequency.setValueAtTime(1760, now);
      clickOsc.frequency.exponentialRampToValueAtTime(2640, now + 0.04);

      clickGain.gain.setValueAtTime(0.03, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);

      clickOsc.start(now);
      clickOsc.stop(now + 0.14);

      // Deep glass bell body
      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bellOsc.type = "sine";
      bellOsc.frequency.setValueAtTime(523.25, now);
      bellGain.gain.setValueAtTime(0.02, now);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      bellOsc.connect(bellGain);
      bellGain.connect(this.ctx.destination);

      bellOsc.start(now);
      bellOsc.stop(now + 0.55);
    } catch {
      // Ignored
    }
  }

  // Phase 4: Horizon Transition
  triggerTransitionRelease() {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === "suspended") this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.5);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch {
      // Ignored
    }
  }

  destroy() {
    try {
      if (this.droneOsc) {
        this.droneOsc.stop();
        this.droneOsc.disconnect();
      }
      if (this.ctx && this.ctx.state !== "closed") {
        this.ctx.close();
      }
    } catch {
      // Ignored
    }
  }
}

export const crystalAudio = new CrystalAudioEngine();
export const precisionAudio = crystalAudio;
export const genesisAudio = crystalAudio;
