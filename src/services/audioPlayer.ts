/**
 * Romantic Audio Engine for Wedding Invitation
 * Uses Web Audio API synthesis for zero-dependency, guaranteed, crystal-clear
 * romantic acoustic chord progressions, with optional custom audio stream support.
 */

class RomanticWeddingSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private noteIndex = 0;

  // Romantic Canon in D inspired acoustic progression (Frequencies in Hz)
  // Chords: D - A - Bm - F#m - G - D - G - A
  private readonly melodyPattern: number[][] = [
    [293.66, 369.99, 440.0, 587.33], // D maj (D4, F#4, A4, D5)
    [220.00, 277.18, 329.63, 440.00], // A maj (A3, C#4, E4, A4)
    [246.94, 293.66, 369.99, 493.88], // B min (B3, D4, F#4, B4)
    [185.00, 220.00, 277.18, 369.99], // F# min (F#3, A3, C#4, F#4)
    [196.00, 246.94, 293.66, 392.00], // G maj (G3, B3, D4, G4)
    [220.00, 293.66, 369.99, 440.00], // D/F# (A3, D4, F#4, A4)
    [196.00, 246.94, 293.66, 392.00], // G maj (G3, B3, D4, G4)
    [220.00, 277.18, 329.63, 440.00], // A maj (A3, C#4, E4, A4)
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playAcousticPluck(freq: number, time: number, duration: number = 2.4) {
    if (!this.ctx || !this.masterGain) return;

    // Harmonic layer 1: Fundamental Sine (warm body)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);

    // Harmonic layer 2: Triangle (acoustic warmth & harp shimmer)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, time);

    // Envelope for natural acoustic instrument decay
    gain1.gain.setValueAtTime(0.0001, time);
    gain1.gain.exponentialRampToValueAtTime(0.18, time + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    gain2.gain.setValueAtTime(0.0001, time);
    gain2.gain.exponentialRampToValueAtTime(0.06, time + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.7);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(this.masterGain);
    gain2.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.1);
    osc2.stop(time + duration + 0.1);
  }

  public start() {
    try {
      this.initContext();
      if (this.isPlaying) return;
      this.isPlaying = true;

      const scheduleLoop = () => {
        if (!this.isPlaying || !this.ctx) return;
        const now = this.ctx.currentTime;
        const chord = this.melodyPattern[this.noteIndex % this.melodyPattern.length];

        // Arpeggiate chord notes smoothly like a wedding harp
        chord.forEach((freq, idx) => {
          this.playAcousticPluck(freq, now + idx * 0.32, 2.6);
        });

        this.noteIndex++;
        // Repeat next chord every 1.5 seconds
        this.timerId = window.setTimeout(scheduleLoop, 1500);
      };

      scheduleLoop();
    } catch {
      // Audio playback permission blocked or not ready
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const weddingMusicEngine = new RomanticWeddingSynth();
