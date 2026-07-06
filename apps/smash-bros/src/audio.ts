// All sound effects are synthesized with WebAudio — no audio assets needed.

class Sfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  muted = false;

  /** Browsers require a user gesture before audio can start. */
  ensure(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    try {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
    } catch {
      this.ctx = null;
    }
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.5;
    return this.muted;
  }

  private tone(
    freq: number,
    dur: number,
    opts: {
      type?: OscillatorType;
      vol?: number;
      slide?: number;
      delay?: number;
    } = {},
  ): void {
    if (!this.ctx || !this.master || this.muted) return;
    const t0 = this.ctx.currentTime + (opts.delay ?? 0);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = opts.type ?? 'square';
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.slide) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(30, freq + opts.slide),
        t0 + dur,
      );
    }
    gain.gain.setValueAtTime(opts.vol ?? 0.18, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain).connect(this.master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  private noise(dur: number, vol = 0.25, delay = 0, lowpass = 4000): void {
    if (!this.ctx || !this.master || this.muted) return;
    const t0 = this.ctx.currentTime + delay;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = lowpass;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    src.connect(filter).connect(gain).connect(this.master);
    src.start(t0);
  }

  menuMove(): void {
    this.tone(520, 0.06, { type: 'square', vol: 0.1 });
  }

  confirm(): void {
    this.tone(660, 0.08, { vol: 0.12 });
    this.tone(990, 0.12, { vol: 0.12, delay: 0.07 });
  }

  back(): void {
    this.tone(440, 0.1, { vol: 0.1, slide: -200 });
  }

  jump(): void {
    this.tone(300, 0.12, { type: 'triangle', vol: 0.12, slide: 260 });
  }

  whiff(): void {
    this.noise(0.06, 0.06, 0, 2500);
  }

  hit(power: number): void {
    // Bigger knockback => deeper, louder crunch.
    const p = Math.min(1, power / 180);
    this.noise(0.1 + p * 0.15, 0.2 + p * 0.3, 0, 900 + p * 2200);
    this.tone(180 - p * 90, 0.12 + p * 0.1, {
      type: 'sawtooth',
      vol: 0.16 + p * 0.14,
      slide: -80,
    });
  }

  shieldHit(): void {
    this.tone(220, 0.1, { type: 'sine', vol: 0.18, slide: -60 });
    this.noise(0.05, 0.08, 0, 1200);
  }

  shieldBreak(): void {
    this.noise(0.4, 0.4, 0, 2000);
    this.tone(880, 0.5, { type: 'sawtooth', vol: 0.2, slide: -700 });
  }

  ko(): void {
    this.noise(0.5, 0.5, 0, 1500);
    this.tone(120, 0.5, { type: 'sawtooth', vol: 0.3, slide: -80 });
    this.tone(60, 0.6, { type: 'sine', vol: 0.35, slide: -30 });
  }

  countdown(): void {
    this.tone(440, 0.12, { type: 'square', vol: 0.15 });
  }

  go(): void {
    this.tone(880, 0.35, { type: 'square', vol: 0.2 });
    this.tone(1320, 0.35, { type: 'square', vol: 0.1, delay: 0.02 });
  }

  gameEnd(): void {
    this.tone(523, 0.14, { vol: 0.16 });
    this.tone(659, 0.14, { vol: 0.16, delay: 0.12 });
    this.tone(784, 0.3, { vol: 0.16, delay: 0.24 });
  }
}

export const sfx = new Sfx();
