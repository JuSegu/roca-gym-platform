import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  inject,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * ROCA GYM — Idle Screensaver
 * Aparece tras 10 minutos de inactividad del usuario.
 * Inspirado en el estilo cinematográfico de Rockstar Games / GTA VI.
 * Clic, toque o tecla para desactivar.
 */
@Component({
  selector: 'app-idle-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './idle-screen.html',
  styleUrl: './idle-screen.css',
})
export class IdleScreen implements OnInit, OnDestroy {
  /** Tiempo de inactividad antes de mostrar el screensaver (ms) */
  private readonly IDLE_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutos

  /** Si el screensaver está visible */
  readonly isVisible = signal<boolean>(false);

  /** Índice de la escena de fondo actual */
  readonly currentScene = signal<number>(0);

  /** Fase de animación de entrada del logo */
  readonly logoPhase = signal<'hidden' | 'subtitle' | 'title' | 'full'>('hidden');

  private idleTimer: any = null;
  private sceneTimer: any = null;
  private logoTimer: any = null;

  /** Escenas de fondo que rotan en el screensaver */
  readonly scenes = [
    { image: '/images/facilities/zona_entrenamiento.webp', label: 'Zona de Entrenamiento' },
    { image: '/images/facilities/pesos_libres.webp',       label: 'Pesos Libres & Mancuernas' },
    { image: '/images/facilities/maquinas.webp',           label: 'Maquinaria Biomecánica' },
    { image: '/images/facilities/cardio.webp',             label: 'Zona de Cardio' },
    { image: '/images/facilities/ambiente.webp',           label: 'Ambiente & Comunidad' },
  ];

  ngOnInit(): void {
    this.resetIdleTimer();
  }

  ngOnDestroy(): void {
    this.clearAllTimers();
  }

  // ─── Escucha eventos de actividad del usuario ───────────────────────────────
  @HostListener('document:mousemove')
  @HostListener('document:mousedown')
  @HostListener('document:keydown')
  @HostListener('document:touchstart')
  @HostListener('document:scroll')
  @HostListener('document:wheel')
  onUserActivity(): void {
    if (this.isVisible()) {
      this.dismiss();
    } else {
      this.resetIdleTimer();
    }
  }

  // ─── Gestión del temporizador de inactividad ────────────────────────────────
  private resetIdleTimer(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
    this.idleTimer = setTimeout(() => this.showScreensaver(), this.IDLE_TIMEOUT_MS);
  }

  private showScreensaver(): void {
    this.isVisible.set(true);
    this.currentScene.set(0);
    this.logoPhase.set('hidden');
    this.startLogoAnimation();
    this.startSceneRotation();
  }

  dismiss(): void {
    this.isVisible.set(false);
    this.logoPhase.set('hidden');
    this.clearScreensaverTimers();
    this.resetIdleTimer();
  }

  // ─── Animación escalonada del logo (estilo Rockstar/GTA VI) ─────────────────
  private startLogoAnimation(): void {
    // 1. Subtítulo aparece primero (600ms)
    this.logoTimer = setTimeout(() => {
      this.logoPhase.set('subtitle');
      // 2. Título ROCA (1.4s)
      setTimeout(() => {
        this.logoPhase.set('title');
        // 3. GYM + tagline completo (2.6s)
        setTimeout(() => {
          this.logoPhase.set('full');
        }, 1200);
      }, 800);
    }, 600);
  }

  // ─── Rotación de escenas de fondo ──────────────────────────────────────────
  private startSceneRotation(): void {
    this.sceneTimer = setInterval(() => {
      if (this.isVisible()) {
        const next = (this.currentScene() + 1) % this.scenes.length;
        this.currentScene.set(next);
      }
    }, 5000);
  }

  private clearScreensaverTimers(): void {
    if (this.sceneTimer) { clearInterval(this.sceneTimer); this.sceneTimer = null; }
    if (this.logoTimer)  { clearTimeout(this.logoTimer);   this.logoTimer = null; }
  }

  private clearAllTimers(): void {
    this.clearScreensaverTimers();
    if (this.idleTimer) { clearTimeout(this.idleTimer); this.idleTimer = null; }
  }
}
