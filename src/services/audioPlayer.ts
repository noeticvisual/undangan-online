/**
 * Romantic Audio Engine for Wedding Invitation
 * Supports multi-track selection:
 * 1. Pachelbel's Canon in D (Romantic Harp & Acoustic Strings)
 * 2. Gending Jawa Tradisional (Laras Pelog/Slendro Gamelan & Gong)
 * 3. Clair de Lune (Dreamy Romantic Piano Nocturne)
 * 4. Adagio Cantabile (Orchestral String Quartet Romance)
 * 5. Melodi Akustik Senja (Acoustic Fingerstyle Ballad)
 * 6. Custom MP3 / Audio Stream URL (via HTML5 Audio with instant synth fallback)
 */

import { MusicTrack } from '../types/wedding';

export const AVAILABLE_WEDDING_TRACKS: MusicTrack[] = [
  {
    id: 'canon_in_d',
    title: 'Canon in D (Acoustic Harp)',
    artist: 'Johann Pachelbel · Strings & Harp Ensemble',
    genre: 'canon',
    description: 'Arpeggio harpa dan senar romantis klasik, pilihan paling sakral untuk prosesi akad dan resepsi.',
    durationFormatted: '03:45',
  },
  {
    id: 'gamelan_jawa',
    title: 'Gending Kebo Giro (Laras Pelog)',
    artist: 'Gamelan Temanten Jawa Klasik',
    genre: 'gamelan',
    description: 'Nuansa adat Jawa luhur dengan genta perunggu, tabuhan kendhang lembut, dan dengung gong ageng yang khidmat.',
    durationFormatted: '04:12',
  },
  {
    id: 'clair_de_lune',
    title: 'Clair de Lune (Romantic Piano)',
    artist: 'Claude Debussy · Grand Piano Solo',
    genre: 'piano',
    description: 'Petikan tuts piano lembut dan puitis, menciptakan atmosfer syahdu, intim, dan penuh kehangatan.',
    durationFormatted: '04:30',
  },
  {
    id: 'adagio_strings',
    title: 'Adagio Cantabile (Royal Strings)',
    artist: 'Chamber Orchestra String Quartet',
    genre: 'strings',
    description: 'Harmoni gesekan biola dan selo megah bernuansa royal ballroom pernikahan eropa mewah.',
    durationFormatted: '03:55',
  },
  {
    id: 'acoustic_senja',
    title: 'Melodi Senja Akustik',
    artist: 'Fingerstyle Romantic Guitar',
    genre: 'acoustic',
    description: 'Petikan senar gitar kayu akustik yang hangat dan bersahaja, cocok untuk resepsi bertema taman botani.',
    durationFormatted: '03:20',
  },
  {
    id: 'custom_url',
    title: 'Audio Kustom (Tautan MP3 Sendiri)',
    artist: 'Pilihan Pengantin',
    genre: 'custom',
    description: 'Gunakan lagu favorit pilihan Anda sendiri melalui tautan URL audio MP3 atau direct streaming.',
    durationFormatted: 'Kustom',
  },
];

class RomanticWeddingSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private currentTrackId = 'canon_in_d';
  private customAudioUrl = '';
  private audioElement: HTMLAudioElement | null = null;
  private volume = 0.45;
  private noteIndex = 0;
  private listeners: Array<(state: { isPlaying: boolean; trackId: string; volume: number }) => void> = [];

  // 1. Canon in D Chords (Frequencies in Hz)
  private readonly canonPattern: number[][] = [
    [293.66, 369.99, 440.00, 587.33], // D maj (D4, F#4, A4, D5)
    [220.00, 277.18, 329.63, 440.00], // A maj (A3, C#4, E4, A4)
    [246.94, 293.66, 369.99, 493.88], // B min (B3, D4, F#4, B4)
    [185.00, 220.00, 277.18, 369.99], // F# min (F#3, A3, C#4, F#4)
    [196.00, 246.94, 293.66, 392.00], // G maj (G3, B3, D4, G4)
    [220.00, 293.66, 369.99, 440.00], // D/F# (A3, D4, F#4, A4)
    [196.00, 246.94, 293.66, 392.00], // G maj (G3, B3, D4, G4)
    [220.00, 277.18, 329.63, 440.00], // A maj (A3, C#4, E4, A4)
  ];

  // 2. Gamelan Laras Pelog/Slendro tuning with Gong Ageng
  private readonly gamelanPattern: { notes: number[]; isGong: boolean }[] = [
    { notes: [261.63, 311.13, 392.00, 523.25], isGong: true },   // Slendro 1 (Nem) + Low Gong
    { notes: [293.66, 349.23, 440.00, 587.33], isGong: false },  // Slendro 2 (Gulu)
    { notes: [329.63, 392.00, 493.88, 659.25], isGong: false },  // Slendro 3 (Dhadha)
    { notes: [261.63, 329.63, 392.00, 523.25], isGong: false },  // Slendro 5 (Lima)
    { notes: [293.66, 349.23, 440.00, 587.33], isGong: true },   // Pelog Nem + Gong
    { notes: [329.63, 392.00, 523.25, 659.25], isGong: false },  // Pelog Barang
    { notes: [261.63, 329.63, 440.00, 523.25], isGong: false },  // Saron Kenong
    { notes: [220.00, 277.18, 329.63, 440.00], isGong: false },  // Bonang Panembung
  ];

  // 3. Clair de Lune Piano Arpeggios (Db major impressionist)
  private readonly pianoPattern: number[][] = [
    [277.18, 349.23, 415.30, 554.37], // Db maj (Db4, F4, Ab4, Db5)
    [311.13, 369.99, 466.16, 622.25], // Eb min (Eb4, Gb4, Bb4, Eb5)
    [261.63, 329.63, 392.00, 523.25], // C min7b5
    [277.18, 349.23, 415.30, 698.46], // Db maj7 (Db4, F4, Ab4, F5)
    [233.08, 277.18, 349.23, 466.16], // Bb min (Bb3, Db4, F4, Bb4)
    [207.65, 261.63, 311.13, 415.30], // Ab maj (Ab3, C4, Eb4, Ab4)
    [185.00, 233.08, 277.18, 369.99], // Gb maj (Gb3, Bb3, Db4, Gb4)
    [207.65, 261.63, 329.63, 415.30], // Ab dom7 (Ab3, C4, E4, Ab4)
  ];

  // 4. Romantic Adagio String Chords
  private readonly stringsPattern: number[][] = [
    [146.83, 220.00, 293.66, 440.00], // D minor/major warm cello + violin
    [164.81, 246.94, 329.63, 493.88], // E minor
    [130.81, 196.00, 261.63, 392.00], // C major
    [174.61, 261.63, 349.23, 523.25], // F major
    [196.00, 293.66, 392.00, 587.33], // G major
    [146.83, 220.00, 293.66, 440.00], // D major
    [164.81, 246.94, 329.63, 493.88], // B minor
    [110.00, 164.81, 220.00, 329.63], // A major low cello
  ];

  // 5. Acoustic Fingerstyle Progression (G - Em - C - D)
  private readonly acousticPattern: number[][] = [
    [196.00, 246.94, 293.66, 392.00], // G maj
    [164.81, 246.94, 329.63, 392.00], // E min7
    [130.81, 196.00, 261.63, 329.63], // C maj9
    [146.83, 220.00, 293.66, 440.00], // D sus4
    [196.00, 293.66, 392.00, 493.88], // G maj add9
    [164.81, 196.00, 293.66, 392.00], // Em7
    [130.81, 246.94, 261.63, 392.00], // C maj7
    [146.83, 220.00, 329.63, 440.00], // D6
  ];

  constructor() {
    // Attempt to load saved track and custom URL
    if (typeof window !== 'undefined') {
      try {
        const savedTrack = localStorage.getItem('niskala_audio_track');
        if (savedTrack) this.currentTrackId = savedTrack;
        const savedUrl = localStorage.getItem('niskala_audio_custom_url');
        if (savedUrl) this.customAudioUrl = savedUrl;
        const savedVol = localStorage.getItem('niskala_audio_volume');
        if (savedVol) this.volume = parseFloat(savedVol);
      } catch {
        // LocalStorage blocked
      }
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private notify() {
    this.listeners.forEach((cb) =>
      cb({
        isPlaying: this.isPlaying,
        trackId: this.currentTrackId,
        volume: this.volume,
      })
    );
  }

  public subscribe(listener: (state: { isPlaying: boolean; trackId: string; volume: number }) => void) {
    this.listeners.push(listener);
    listener({
      isPlaying: this.isPlaying,
      trackId: this.currentTrackId,
      volume: this.volume,
    });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // --- Voice Synthesis Renderers ---

  // 1. Harp Pluck (Canon in D)
  private playHarpPluck(freq: number, time: number, duration: number = 2.4) {
    if (!this.ctx || !this.masterGain) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, time);

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

  // 2. Gamelan Bronze Bell & Deep Gong
  private playGamelanChime(freq: number, time: number, isGong: boolean) {
    if (!this.ctx || !this.masterGain) return;

    if (isGong) {
      // Deep resonant gong (low fundamental ~55Hz with sub bass decay)
      const gongOsc = this.ctx.createOscillator();
      const gongGain = this.ctx.createGain();
      gongOsc.type = 'sine';
      gongOsc.frequency.setValueAtTime(55, time);
      gongGain.gain.setValueAtTime(0.0001, time);
      gongGain.gain.exponentialRampToValueAtTime(0.35, time + 0.08);
      gongGain.gain.exponentialRampToValueAtTime(0.0001, time + 4.5);
      gongOsc.connect(gongGain);
      gongGain.connect(this.masterGain);
      gongOsc.start(time);
      gongOsc.stop(time + 4.6);
    }

    // Metallic bronze chime overtone
    const chime1 = this.ctx.createOscillator();
    const chime2 = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();

    chime1.type = 'triangle';
    chime1.frequency.setValueAtTime(freq, time);

    // Inharmonic overtone typical of bronze gamelan metallophone
    chime2.type = 'sine';
    chime2.frequency.setValueAtTime(freq * 2.76, time);

    chimeGain.gain.setValueAtTime(0.0001, time);
    chimeGain.gain.exponentialRampToValueAtTime(0.14, time + 0.02);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, time + 2.8);

    chime1.connect(chimeGain);
    chime2.connect(chimeGain);
    chimeGain.connect(this.masterGain);

    chime1.start(time);
    chime2.start(time);
    chime1.stop(time + 2.9);
    chime2.stop(time + 2.9);
  }

  // 3. Romantic Piano Note (Clair de Lune)
  private playPianoNote(freq: number, time: number, duration: number = 2.8) {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const noteGain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 4.5, time);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.5, time + duration);

    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.exponentialRampToValueAtTime(0.2, time + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.1);
    osc2.stop(time + duration + 0.1);
  }

  // 4. Lush String Swell (Adagio Cantabile)
  private playStringSwell(freq: number, time: number, duration: number = 3.6) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    // Warm orchestral lowpass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, time);

    // Slow gentle bow attack and long release
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.12, time + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration + 0.1);
  }

  // 5. Acoustic Fingerstyle Pluck
  private playAcousticGuitar(freq: number, time: number, duration: number = 2.2) {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 3, time); // Wooden overtone

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.19, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.1);
    osc2.stop(time + duration + 0.1);
  }

  // --- Scheduler Loop ---
  private scheduleLoop = () => {
    if (!this.isPlaying) return;

    // If custom audio element is playing, we don't synthesize
    if (this.currentTrackId === 'custom_url' && this.audioElement && !this.audioElement.paused) {
      this.timerId = window.setTimeout(this.scheduleLoop, 1000);
      return;
    }

    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    switch (this.currentTrackId) {
      case 'gamelan_jawa': {
        const item = this.gamelanPattern[this.noteIndex % this.gamelanPattern.length];
        item.notes.forEach((freq, idx) => {
          this.playGamelanChime(freq, now + idx * 0.45, idx === 0 && item.isGong);
        });
        this.noteIndex++;
        this.timerId = window.setTimeout(this.scheduleLoop, 2000);
        break;
      }
      case 'clair_de_lune': {
        const chord = this.pianoPattern[this.noteIndex % this.pianoPattern.length];
        chord.forEach((freq, idx) => {
          this.playPianoNote(freq, now + idx * 0.38, 3.2);
        });
        this.noteIndex++;
        this.timerId = window.setTimeout(this.scheduleLoop, 1800);
        break;
      }
      case 'adagio_strings': {
        const chord = this.stringsPattern[this.noteIndex % this.stringsPattern.length];
        chord.forEach((freq) => {
          this.playStringSwell(freq, now, 3.8);
        });
        this.noteIndex++;
        this.timerId = window.setTimeout(this.scheduleLoop, 2600);
        break;
      }
      case 'acoustic_senja': {
        const chord = this.acousticPattern[this.noteIndex % this.acousticPattern.length];
        chord.forEach((freq, idx) => {
          this.playAcousticGuitar(freq, now + idx * 0.28, 2.4);
        });
        this.noteIndex++;
        this.timerId = window.setTimeout(this.scheduleLoop, 1400);
        break;
      }
      case 'canon_in_d':
      default: {
        const chord = this.canonPattern[this.noteIndex % this.canonPattern.length];
        chord.forEach((freq, idx) => {
          this.playHarpPluck(freq, now + idx * 0.32, 2.6);
        });
        this.noteIndex++;
        this.timerId = window.setTimeout(this.scheduleLoop, 1500);
        break;
      }
    }
  };

  // --- Public Control APIs ---

  public start() {
    try {
      this.initContext();
      this.isPlaying = true;

      // Handle custom MP3 URL if selected
      if (this.currentTrackId === 'custom_url' && this.customAudioUrl) {
        if (!this.audioElement) {
          this.audioElement = new Audio();
          this.audioElement.loop = true;
          this.audioElement.crossOrigin = 'anonymous';
          this.audioElement.volume = this.volume;
        }
        this.audioElement.src = this.customAudioUrl;
        this.audioElement.play().catch(() => {
          // If custom URL fails to play (CORS, 404, etc.), fallback seamlessly to Canon in D synth!
          this.scheduleLoop();
        });
      } else {
        this.scheduleLoop();
      }

      this.notify();
    } catch {
      // Audio playback prevented by browser
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.notify();
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

  public setVolume(newVolume: number) {
    this.volume = Math.max(0, Math.min(1, newVolume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    try {
      localStorage.setItem('niskala_audio_volume', this.volume.toString());
    } catch {
      // Ignore
    }
    this.notify();
  }

  public setTrack(trackId: string, customUrl?: string) {
    const wasPlaying = this.isPlaying;
    this.stop();

    this.currentTrackId = trackId;
    this.noteIndex = 0;

    if (customUrl !== undefined) {
      this.customAudioUrl = customUrl;
      try {
        localStorage.setItem('niskala_audio_custom_url', customUrl);
      } catch {
        // Ignore
      }
    }

    try {
      localStorage.setItem('niskala_audio_track', trackId);
    } catch {
      // Ignore
    }

    if (wasPlaying) {
      this.start();
    } else {
      this.notify();
    }
  }

  public nextTrack(): MusicTrack {
    const currentIndex = AVAILABLE_WEDDING_TRACKS.findIndex((t) => t.id === this.currentTrackId);
    const nextIndex = (currentIndex + 1) % AVAILABLE_WEDDING_TRACKS.length;
    const nextTrack = AVAILABLE_WEDDING_TRACKS[nextIndex];
    this.setTrack(nextTrack.id);
    return nextTrack;
  }

  public prevTrack(): MusicTrack {
    const currentIndex = AVAILABLE_WEDDING_TRACKS.findIndex((t) => t.id === this.currentTrackId);
    const prevIndex = (currentIndex - 1 + AVAILABLE_WEDDING_TRACKS.length) % AVAILABLE_WEDDING_TRACKS.length;
    const prevTrack = AVAILABLE_WEDDING_TRACKS[prevIndex];
    this.setTrack(prevTrack.id);
    return prevTrack;
  }

  public getCurrentTrack(): MusicTrack {
    return (
      AVAILABLE_WEDDING_TRACKS.find((t) => t.id === this.currentTrackId) ||
      AVAILABLE_WEDDING_TRACKS[0]
    );
  }

  public getVolume(): number {
    return this.volume;
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public getCustomUrl(): string {
    return this.customAudioUrl;
  }
}

export const weddingMusicEngine = new RomanticWeddingSynth();
