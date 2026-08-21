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
  private distortionCurve: Float32Array<ArrayBuffer> | null = null;

  // Catálogo 100% Beast / Gym Phonk & Heavy 808
  readonly tracks: MusicTrack[] = [
    {
      id: 'phonk_drift',
      title: 'Beast Mode Phonk Drift',
      artist: 'ROCA Beast Labs',
      genre: 'Raw Drift Phonk & 808',
      bpm: 140,
      icon: '⚡',
      color: '#dc2626',
    },
    {
      id: 'phonk_brazil',
      title: 'Montagem Brazilian Beast',
      artist: 'Favela Pump',
      genre: 'Brazilian Gym Phonk',
      bpm: 135,
      icon: '🇧🇷',
      color: '#ef4444',
    },
    {
      id: 'phonk_shadow',
      title: 'Shadow Beast Aggressive',
      artist: 'KSLV Dark Pulse',
      genre: 'Dark Phonk / Hyper-Pump',
      bpm: 145,
      icon: '👹',
      color: '#b91c1c',
    },
    {
      id: 'phonk_titan',
      title: 'Titan 808 Beast Trap',
      artist: 'Iron Olympus',
      genre: 'Heavy 808 Sub Trap',
      bpm: 132,
      icon: '🔱',
      color: '#f87171',
    },
  ];

  // State signals
  readonly currentTrackIndex = signal<number>(0);
  readonly isPlaying = signal<boolean>(false);
  readonly isVisible = signal<boolean>(true);
  readonly isExpanded = signal<boolean>(false);
  readonly volume = signal<number>(0.6); // 0 to 1
  readonly visualizerBars = signal<number[]>([30, 60, 95, 45, 80, 65, 90, 50]);

  readonly currentTrack = computed(() => this.tracks[this.currentTrackIndex()]);

  constructor() {
    this.startVisualizerLoop();
  }

  private makeDistortionCurve(amount = 20): Float32Array<ArrayBuffer> {
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
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
        this.distortionCurve = this.makeDistortionCurve(15);
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

  // --- Web Audio Synthesizer: 100% BEAST / PHONK / HEAVY 808 ---
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

      if (track.id === 'phonk_drift') {
        // --- 1. BEAST MODE PHONK DRIFT (140 BPM) ---
        // Heavy 808 Kick on beats 0, 4, 8, 12 + Cowbell melody
        if (beat % 4 === 0) {
          this.trigger808Kick(now, 160, 40, 0.6);
        }
        if (beat === 4 || beat === 12) {
          this.triggerPhonkSnare(now);
        }
        // Rolling fast Hi-hats
        if (beat % 2 === 0 || (step % 32 >= 16 && beat % 1 === 0)) {
          this.triggerHiHat(now, 0.04);
        }
        // 808 Gliding Bassline
        if (beat === 0 || beat === 3 || beat === 6 || beat === 10 || beat === 14) {
          const bassNotes = [43.65, 49.0, 55.0, 65.41]; // F1, G1, A1, C2
          const note = bassNotes[Math.floor(step / 8) % bassNotes.length];
          this.triggerDistorted808Bass(now, note, 0.32);
        }
        // Memphis Cowbell Melody
        if (beat === 0 || beat === 2 || beat === 3 || beat === 6 || beat === 8 || beat === 11 || beat === 14) {
          const cowbellNotes = [587.33, 659.25, 783.99, 880.0, 1046.5]; // D5, E5, G5, A5, C6
          const note = cowbellNotes[(step + beat) % cowbellNotes.length];
          this.triggerPhonkCowbell(now, note);
        }

      } else if (track.id === 'phonk_brazil') {
        // --- 2. MONTAGEM BRAZILIAN BEAST (135 BPM) ---
        // Syncopated Brazilian Baile/Phonk rhythm (0, 3, 6, 10, 12)
        if (beat === 0 || beat === 3 || beat === 6 || beat === 10 || beat === 12) {
          this.triggerPunchyKick(now, 0.55);
        }
        if (beat === 4 || beat === 12 || beat === 15) {
          this.triggerBrazilianClap(now);
        }
        if (beat % 2 === 0) {
          this.triggerHiHat(now, 0.035);
        }
        // Bouncing low-mid 808
        if (beat === 0 || beat === 3 || beat === 8 || beat === 11) {
          const notes = [65.41, 73.42, 65.41, 87.31];
          this.triggerDistorted808Bass(now, notes[(step % 4)], 0.35);
        }
        // Resonant Vocal-like synth stab
        if (beat === 2 || beat === 6 || beat === 10 || beat === 14) {
          this.triggerPhonkCowbell(now, 440 * 1.5);
        }

      } else if (track.id === 'phonk_shadow') {
        // --- 3. SHADOW BEAST AGGRESSIVE (145 BPM) ---
        // Fast aggressive pumping kicks
        if (beat % 4 === 0 || beat === 14) {
          this.trigger808Kick(now, 175, 45, 0.65);
        }
        if (beat === 4 || beat === 12) {
          this.triggerPhonkSnare(now);
        }
        // High speed triple-hats
        this.triggerHiHat(now, beat % 4 === 0 ? 0.05 : 0.025);

        // Aggressive Saw Glide Sub
        if (beat % 2 === 0) {
          const notes = [49.0, 55.0, 58.27, 73.42];
          const note = notes[Math.floor(step / 4) % notes.length];
          this.triggerDistorted808Bass(now, note, 0.4);
        }
        // High dark cowbell arpeggio
        if (beat === 1 || beat === 3 || beat === 5 || beat === 7 || beat === 9 || beat === 11 || beat === 13) {
          const arps = [783.99, 880.0, 1046.5, 1174.66];
          this.triggerPhonkCowbell(now, arps[(step % arps.length)]);
        }

      } else if (track.id === 'phonk_titan') {
        // --- 4. TITAN 808 BEAST TRAP (132 BPM) ---
        // Half-time Heavy Trap Kick on beat 0 and beat 10
        if (beat === 0 || beat === 8 || beat === 11) {
          this.triggerDeepSubDrop(now);
        }
        if (beat === 8) {
          this.triggerPhonkSnare(now);
        }
        // Rapid fire Trap Hats
        if (beat % 2 === 0 || (beat >= 12)) {
          this.triggerHiHat(now, 0.03);
        }
        // Deep warm 808 Sub Rumble
        if (beat === 0 || beat === 6 || beat === 11) {
          const lowNotes = [36.71, 41.2, 43.65, 48.99]; // D1, E1, F1, G1
          this.triggerDistorted808Bass(now, lowNotes[Math.floor(step / 8) % lowNotes.length], 0.45);
        }
        // Slow melodic bell
        if (beat === 0 || beat === 4 || beat === 8 || beat === 12) {
          const melody = [587.33, 523.25, 440.0, 392.0];
          this.triggerPhonkCowbell(now, melody[Math.floor(step / 4) % melody.length]);
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

  // --- PHONK & BEAST DRUM SYNTHESIZERS ---

  private trigger808Kick(time: number, startFreq = 160, endFreq = 40, vol = 0.55): void {
    if (!this.audioCtx || !this.masterGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.12);

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.28);
  }

  private triggerPunchyKick(time: number, vol = 0.5): void {
    if (!this.audioCtx || !this.masterGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.frequency.setValueAtTime(220, time);
    osc.frequency.exponentialRampToValueAtTime(50, time + 0.08);

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.18);
  }

  private triggerDeepSubDrop(time: number): void {
    if (!this.audioCtx || !this.masterGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + 0.35);

    gain.gain.setValueAtTime(0.65, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.45);
  }

  private triggerPhonkSnare(time: number): void {
    if (!this.audioCtx || !this.masterGain) return;
    // Tone component
    const osc = this.audioCtx.createOscillator();
    const oscGain = this.audioCtx.createGain();
    osc.frequency.setValueAtTime(220, time);
    osc.frequency.exponentialRampToValueAtTime(140, time + 0.08);
    oscGain.gain.setValueAtTime(0.3, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.1);

    // Noise component (crisp snap)
    const bufferSize = this.audioCtx.sampleRate * 0.15;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 1.8;

    const noiseGain = this.audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.28, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.15);
  }

  private triggerBrazilianClap(time: number): void {
    if (!this.audioCtx || !this.masterGain) return;
    const bufferSize = this.audioCtx.sampleRate * 0.12;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1200;

    const noiseGain = this.audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.35, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.1);
  }

  private triggerHiHat(time: number, vol = 0.04): void {
    if (!this.audioCtx || !this.masterGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime(9000, time);

    filter.type = 'highpass';
    filter.frequency.value = 7500;

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.045);
  }

  // --- MEMPHIS & DRIFT PHONK COWBELL SYNTH ---
  private triggerPhonkCowbell(time: number, freq: number): void {
    if (!this.audioCtx || !this.masterGain) return;

    // Dual square wave with bandpass resonance (Authentic Phonk Cowbell recipe)
    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const bandpass = this.audioCtx.createBiquadFilter();

    osc1.type = 'square';
    osc2.type = 'square';

    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 1.505, time); // Ring modulation detune

    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(freq * 1.2, time);
    bandpass.Q.value = 4.0;

    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc1.connect(bandpass);
    osc2.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.18);
    osc2.stop(time + 0.18);
  }

  // --- DISTORTED 808 GLIDE BASS ---
  private triggerDistorted808Bass(time: number, freq: number, vol = 0.35): void {
    if (!this.audioCtx || !this.masterGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const waveshaper = this.audioCtx.createWaveShaper();

    if (this.distortionCurve) {
      waveshaper.curve = this.distortionCurve;
    }

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.9, time + 0.25);

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.28);

    osc.connect(waveshaper);
    waveshaper.connect(gain);
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
