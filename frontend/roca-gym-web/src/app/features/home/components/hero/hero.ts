import { Component, signal, OnDestroy, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

export interface TourScene {
  id: string;
  step: string;
  title: string;
  tagline: string;
  video: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private timer: any = null;

  // Escenas cinematográficas del recorrido virtual ROCA GYM (videos reales)
  readonly scenes: TourScene[] = [
    {
      id: 'entrance',
      step: '01 / 04',
      title: 'Recorrido del Gym',
      tagline: 'Acceso digital biométrico y ambiente de alto rendimiento',
      video: '/videos/hero-bg.mp4',
    },
    {
      id: 'machines',
      step: '02 / 04',
      title: 'Zona de Máquinas',
      tagline: 'Maquinaria pesada biomecánica para aislamiento muscular',
      video: '/videos/facility-1.mp4',
    },
    {
      id: 'freeweights',
      step: '03 / 04',
      title: 'Peso Libre & Mancuernas',
      tagline: 'Racks completos de mancuernas y bancas olímpicas',
      video: '/videos/facility-2.mp4',
    },
    {
      id: 'powerzone',
      step: '04 / 04',
      title: 'Zona de Potencia',
      tagline: 'Plataformas de levantamiento olímpico y barras calibradas',
      video: '/videos/facility-3.mp4',
    },
  ];

  readonly currentSceneIndex = signal<number>(0);
  readonly isAutoPlaying = signal<boolean>(true);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startTourAutoplay();
    }
  }

  ngOnDestroy(): void {
    this.stopTourAutoplay();
  }

  private startTourAutoplay(): void {
    this.stopTourAutoplay();
    this.timer = setInterval(() => {
      if (this.isAutoPlaying()) {
        const next = (this.currentSceneIndex() + 1) % this.scenes.length;
        this.currentSceneIndex.set(next);
      }
    }, 8000); // Longer interval for videos
  }

  private stopTourAutoplay(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  selectScene(index: number): void {
    this.currentSceneIndex.set(index);
    if (isPlatformBrowser(this.platformId)) {
      this.startTourAutoplay();
    }
  }

  nextScene(): void {
    const next = (this.currentSceneIndex() + 1) % this.scenes.length;
    this.selectScene(next);
  }

  prevScene(): void {
    const prev = (this.currentSceneIndex() - 1 + this.scenes.length) % this.scenes.length;
    this.selectScene(prev);
  }
}
