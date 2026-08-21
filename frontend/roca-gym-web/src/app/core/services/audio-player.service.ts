import { Injectable, signal, computed } from '@angular/core';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  icon: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService {
  private audioCtx: AudioContext | null = null;
  private isGenerating = false;
  private intervalId: any = null;
  private cycleTimeoutId: any = null;
  private masterGain: GainNode | null = null;

  /** How long the radio plays before pausing (ms) */
  private readonly PLAY_DURATION_MS = 3 * 60 * 1000;  // 3 minutes
  /** How long the radio stays paused before resuming (ms) */
  private readonly PAUSE_DURATION_MS = 3 * 60 * 1000; // 3 minutes

  /** True once the user has interacted with the page (needed for autoplay policy) */
  private userInteracted = false;

  // Colección 100% Beast Mode centrada en el ritmo original
  readonly tracks: MusicTrack[] = [
    {
      id: 'phonk',
      title: 'Beast Mode Original',
      artist: 'ROCA Beast Labs',
      genre: 'Gym Phonk & 808 Original',
      bpm: 140,
      icon: '⚡',
      color: '#dc2626',
    },
    {
      id: 'beast_turbo',
      title: 'Beast Mode Turbo Push',
      artist: 'ROCA Beast Labs',
      genre: 'Beast Phonk 148 BPM',
      bpm: 148,
      icon: '🔥',
      color: '#ef4444',
    },
    {
      id: 'beast_deep',
      title: 'Beast Mode Heavy Iron',
      artist: 'ROCA Beast Labs',
      genre: 'Beast Sub 808 Deep',
      bpm: 134,
      icon: '🦍',
      color: '#b91c1c',
    },
    {
      id: 'beast_intense',
      title: 'Beast Mode Relentless',
      artist: 'ROCA Beast Labs',
      genre: 'Beast Double Pulse',
      bpm: 142,
      icon: '🔱',
      color: '#f87171',
    },
  ];

  // State signals
  readonly currentTrackIndex = signal<number>(0);
  readonly isPlaying = signal<boolean>(false);
  readonly isVisible = signal<boolean>(true);
  readonly isExpanded = signal<boolean>(false);
  readonly volume = signal<number>(0.5); // 0 to 1
  readonly visualizerBars = signal<number[]>([30, 60, 95, 45, 80, 65, 90, 50]);

  // Dynamic BPM Control
  readonly customBpm = signal<number>(140);

  readonly currentTrack = computed(() => this.tracks[this.currentTrackIndex()]);

  constructor() {
    this.startVisualizerLoop();
    this.setupAutoPlay();
  }

  /**
   * Attempts to autoplay immediately; if the browser blocks it (no prior interaction)
   * we attach a one-time listener on the first click/touch and start then.
   */
  private setupAutoPlay(): void {
    if (typeof window === 'undefined') return;

    // Try immediate autoplay (works in some browsers / PWAs)
    setTimeout(() => {
      try {
        this.play();
        this.scheduleCycle();
      } catch {
        // If autoplay is blocked, start on first user interaction
        const startOnInteraction = () => {
          if (!this.userInteracted) {
            this.userInteracted = true;
            this.play();
            this.scheduleCycle();
            window.removeEventListener('click', startOnInteraction);
            window.removeEventListener('touchstart', startOnInteraction);
            window.removeEventListener('keydown', startOnInteraction);
          }
        };
        window.addEventListener('click', startOnInteraction, { once: true });
        window.addEventListener('touchstart', startOnInteraction, { once: true });
        window.addEventListener('keydown', startOnInteraction, { once: true });
      }
    }, 800); // small delay to let Angular finish bootstrapping
  }

  /**
   * Runs the 3-min PLAY → 3-min PAUSE → repeat cycle.
   * Clears any previous cycle timer before scheduling a new one.
   */
  private scheduleCycle(): void {
    if (this.cycleTimeoutId) {
      clearTimeout(this.cycleTimeoutId);
      this.cycleTimeoutId = null;
    }
    // After PLAY_DURATION_MS, pause and then schedule resume
    this.cycleTimeoutId = setTimeout(() => {
      this.pause();
      this.cycleTimeoutId = setTimeout(() => {
        this.play();
        this.scheduleCycle(); // restart the whole cycle
      }, this.PAUSE_DURATION_MS);
    }, this.PLAY_DURATION_MS);
  }

  private initAudio(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = this.volume();
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      void this.audioCtx.resume();
    }
    return this.audioCtx;
  }


  play(): void {
    const ctx = this.initAudio();
    if (!ctx) return;
    this.isPlaying.set(true);
    this.startProceduralBeats();
  }

  pause(): void {
    this.isPlaying.set(false);
    this.stopProceduralBeats();
  }

  /**
   * Manual toggle: also resets the automatic cycle so the 3-min
   * countdown restarts from the moment the user presses play/pause.
   */
  togglePlay(): void {
    if (this.isPlaying()) {
      this.pause();
      // Cancel any scheduled cycle reset so it stays paused until the user resumes
      if (this.cycleTimeoutId) {
        clearTimeout(this.cycleTimeoutId);
        this.cycleTimeoutId = null;
      }
    } else {
      this.play();
      this.scheduleCycle(); // restart cycle from this moment
    }
  }

  nextTrack(): void {
    const next = (this.currentTrackIndex() + 1) % this.tracks.length;
    this.selectTrack(next);
  }

  prevTrack(): void {
    const prev = (this.currentTrackIndex() - 1 + this.tracks.length) % this.tracks.length;
    this.selectTrack(prev);
  }

  selectTrack(index: number): void {
    this.currentTrackIndex.set(index);
    this.customBpm.set(this.tracks[index].bpm);
    if (this.isPlaying()) {
      this.stopProceduralBeats();
      this.startProceduralBeats();
    }
  }

  setBpm(bpm: number): void {
    const clamped = Math.max(110, Math.min(170, Math.round(bpm)));
    this.customBpm.set(clamped);
    if (this.isPlaying()) {
      this.stopProceduralBeats();
      this.startProceduralBeats();
    }
  }

  setVolume(vol: number): void {
    const clamped = Math.max(0, Math.min(1, vol));
    this.volume.set(clamped);
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(clamped, this.audioCtx.currentTime);
    }
  }

  toggleVisibility(): void {
    if (this.isVisible()) {
      this.pause();
      this.isVisible.set(false);
    } else {
      this.isVisible.set(true);
    }
  }

  toggleExpanded(): void {
    this.isExpanded.update((v) => !v);
  }

  // --- Generador Procedural del Ritmo Beast Original ---
  private startProceduralBeats(): void {
    if (this.isGenerating) return;
    this.isGenerating = true;

    const track = this.currentTrack();
    const bpm = this.customBpm();
    const intervalMs = (60 / bpm) * 1000;
    let step = 0;

    this.intervalId = setInterval(() => {
      if (!this.isPlaying() || !this.audioCtx || !this.masterGain) return;
      const now = this.audioCtx.currentTime;
      const beat = step % 16;

      if (track.id === 'phonk') {
        // --- 1. BEAST MODE ORIGINAL (El ritmo exacto que te encantó) ---
        if (beat % 4 === 0) {
          this.triggerKick(now);
        }
        if (beat === 4 || beat === 12) {
          this.triggerSnare(now);
        }
        if (beat % 2 === 0) {
          this.triggerHiHat(now, beat % 4 === 0 ? 0.05 : 0.03);
        }
        if (beat === 0 || beat === 3 || beat === 6 || beat === 10 || beat === 14) {
          const freqs = [55, 65.41, 49, 73.42];
          const freq = freqs[Math.floor(step / 16) % freqs.length];
          this.triggerPhonkBass(now, freq);
        }

      } else if (track.id === 'beast_turbo') {
        // --- 2. BEAST MODE TURBO PUSH (Mismo ritmo Beast a tempo turbo) ---
        if (beat % 4 === 0 || (step % 32 >= 24 && beat === 14)) {
          this.triggerKick(now);
        }
        if (beat === 4 || beat === 12) {
          this.triggerSnare(now);
        }
        this.triggerHiHat(now, beat % 2 === 0 ? 0.045 : 0.025);
        if (beat === 0 || beat === 3 || beat === 6 || beat === 10 || beat === 14) {
          const freqs = [65.41, 73.42, 55.0, 82.41];
          const freq = freqs[Math.floor(step / 16) % freqs.length];
          this.triggerPhonkBass(now, freq);
        }

      } else if (track.id === 'beast_deep') {
        // --- 3. BEAST MODE HEAVY IRON (Mismo ritmo Beast con bajo más profundo) ---
        if (beat % 4 === 0) {
          this.triggerKick(now);
        }
        if (beat === 4 || beat === 12) {
          this.triggerSnare(now);
        }
        if (beat % 2 === 0) {
          this.triggerHiHat(now, 0.035);
        }
        if (beat === 0 || beat === 3 || beat === 6 || beat === 10 || beat === 14) {
          const freqs = [41.2, 49.0, 36.7, 55.0]; // Octava más profunda
          const freq = freqs[Math.floor(step / 16) % freqs.length];
          this.triggerPhonkBass(now, freq);
        }

      } else if (track.id === 'beast_intense') {
        // --- 4. BEAST MODE RELENTLESS (Mismo ritmo Beast con doble pulso de bajo) ---
        if (beat % 4 === 0 || beat === 10) {
          this.triggerKick(now);
        }
        if (beat === 4 || beat === 12) {
          this.triggerSnare(now);
        }
        if (beat % 2 === 0) {
          this.triggerHiHat(now, beat % 4 === 0 ? 0.05 : 0.03);
        }
        if (beat === 0 || beat === 2 || beat === 6 || beat === 8 || beat === 10 || beat === 14) {
          const freqs = [55, 58.27, 49, 65.41];
          const freq = freqs[Math.floor(step / 16) % freqs.length];
          this.triggerPhonkBass(now, freq);
        }
      }

      step++;
    }, intervalMs / 4);
  }

  private stopProceduralBeats(): void {
    this.isGenerating = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /** Cleans up all timers (call on service destroy or page unload) */
  cleanup(): void {
    this.stopProceduralBeats();
    if (this.cycleTimeoutId) {
      clearTimeout(this.cycleTimeoutId);
      this.cycleTimeoutId = null;
    }
  }

  // --- SÍNTESIS DE INSTRUMENTOS ORIGINALES BEAST ---

  private triggerKick(time: number): void {
    if (!this.audioCtx || !this.masterGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);

    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.25);
  }

  private triggerSnare(time: number): void {
    if (!this.audioCtx || !this.masterGain) return;
    const bufferSize = this.audioCtx.sampleRate * 0.1;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(time);
    whiteNoise.stop(time + 0.12);
  }

  private triggerHiHat(time: number, vol: number): void {
    if (!this.audioCtx || !this.masterGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime(8000, time);

    filter.type = 'highpass';
    filter.frequency.value = 7000;

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.05);
  }

  private triggerPhonkBass(time: number, freq: number): void {
    if (!this.audioCtx || !this.masterGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.85, time + 0.2);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.28);
  }

  // --- Sound FX for Gym Milestones ---
  playSetDoneSound(): void {
    const ctx = this.initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  playVictorySound(): void {
    const ctx = this.initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    notes.forEach((freq, i) => {
      const noteTime = now + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.25, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.35);
    });
  }

  playLevelUpSound(): void {
    const ctx = this.initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C major fanfare
    notes.forEach((freq, i) => {
      const noteTime = now + i * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.2, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.4);
    });
  }

  private startVisualizerLoop(): void {
    if (typeof window === 'undefined') return;
    setInterval(() => {
      if (this.isPlaying()) {
        const newBars = Array.from({ length: 8 }, () => Math.floor(25 + Math.random() * 75));
        this.visualizerBars.set(newBars);
      } else {
        this.visualizerBars.set([15, 15, 15, 15, 15, 15, 15, 15]);
      }
    }, 120);
  }
}
