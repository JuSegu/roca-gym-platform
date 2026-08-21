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
  private masterGain: GainNode | null = null;

  readonly tracks: MusicTrack[] = [
    {
      id: 'phonk',
      title: 'Beast Mode Phonk Drift',
      artist: 'ROCA Audio Labs',
      genre: 'Gym Phonk & 808',
      bpm: 140,
      icon: '⚡',
      color: '#dc2626',
    },
    {
      id: 'metal',
      title: 'Heavy Iron Adrenaline',
      artist: 'Titan Riffs',
      genre: 'Heavy Metal Workout',
      bpm: 160,
      icon: '🎸',
      color: '#ef4444',
    },
    {
      id: 'synth',
      title: 'Cyberpunk Hypertrophy',
      artist: 'Neon Pump',
      genre: 'Dark Synthwave',
      bpm: 128,
      icon: '🌌',
      color: '#b91c1c',
    },
    {
      id: 'hardstyle',
      title: 'Pure Discipline Euphoria',
      artist: 'K-Hardstyle Arena',
      genre: 'Hardstyle Energy',
      bpm: 150,
      icon: '🔊',
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

  readonly currentTrack = computed(() => this.tracks[this.currentTrackIndex()]);

  constructor() {
    this.startVisualizerLoop();
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

  togglePlay(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
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

  nextTrack(): void {
    const next = (this.currentTrackIndex() + 1) % this.tracks.length;
    this.currentTrackIndex.set(next);
    if (this.isPlaying()) {
      this.stopProceduralBeats();
      this.startProceduralBeats();
    }
  }

  prevTrack(): void {
    const prev = (this.currentTrackIndex() - 1 + this.tracks.length) % this.tracks.length;
    this.currentTrackIndex.set(prev);
    if (this.isPlaying()) {
      this.stopProceduralBeats();
      this.startProceduralBeats();
    }
  }

  selectTrack(index: number): void {
    this.currentTrackIndex.set(index);
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

  // --- Web Audio Procedural Beats Synthesizer ---
  private startProceduralBeats(): void {
    if (this.isGenerating) return;
    this.isGenerating = true;

    const track = this.currentTrack();
    const intervalMs = (60 / track.bpm) * 1000;
    let step = 0;

    this.intervalId = setInterval(() => {
      if (!this.isPlaying() || !this.audioCtx || !this.masterGain) return;
      const now = this.audioCtx.currentTime;
      const beat = step % 16;

      // Kick drum on beats 0, 4, 8, 12 (4/4 rhythm)
      if (beat % 4 === 0) {
        this.triggerKick(now);
      }

      // Snare / Clap on beats 4, 12
      if (beat === 4 || beat === 12) {
        this.triggerSnare(now);
      }

      // Hi-hats on eighth notes
      if (beat % 2 === 0) {
        this.triggerHiHat(now, beat % 4 === 0 ? 0.05 : 0.03);
      }

      // Bass notes according to track genre
      if (track.id === 'phonk' && (beat === 0 || beat === 3 || beat === 6 || beat === 10 || beat === 14)) {
        const freqs = [55, 65.41, 49, 73.42];
        const freq = freqs[Math.floor(step / 16) % freqs.length];
        this.triggerPhonkBass(now, freq);
      } else if (track.id === 'metal' && beat % 2 === 0) {
        this.triggerDistortedRiff(now, 43.65);
      } else if (track.id === 'synth' && beat % 2 === 0) {
        const freqs = [65.4, 77.78, 87.31, 98.0];
        const freq = freqs[(step % 8)];
        this.triggerSynthBass(now, freq);
      } else if (track.id === 'hardstyle' && (beat === 0 || beat === 4 || beat === 8 || beat === 12)) {
        this.triggerHardstyleReverse(now);
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
    // Noise buffer for snap
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

  private triggerDistortedRiff(time: number, freq: number): void {
    if (!this.audioCtx || !this.masterGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.15);
  }

  private triggerSynthBass(time: number, freq: number): void {
    if (!this.audioCtx || !this.masterGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.12);
  }

  private triggerHardstyleReverse(time: number): void {
    if (!this.audioCtx || !this.masterGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, time);
    osc.frequency.linearRampToValueAtTime(150, time + 0.15);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.2);
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
