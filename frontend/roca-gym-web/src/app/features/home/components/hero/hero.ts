import { Component, signal, OnDestroy, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

export interface TourScene {
  id: string;
  step: string;
  title: string;
  tagline: string;
  image: string;
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

  // Escenas cinematográficas del recorrido virtual ROCA GYM
  readonly scenes: TourScene[] = [
    {
      id: 'entrance',
      step: '01 / 04',
      title: 'Entrada & Recepción Principal',
      tagline: 'Acceso digital biométrico y ambiente de alto rendimiento',
      image: '/images/tour/tour-01-entrance.webp',
    },
    {
      id: 'machines',
      step: '02 / 04',
      title: 'Circuito de Máquinas de Fuerza',
      tagline: 'Maquinaria pesada biomecánica para aislamiento muscular',
      image: '/images/tour/tour-02-machines.webp',
    },
    {
      id: 'freeweights',
      step: '03 / 04',
      title: 'Zona de Peso Libre & Mancuernas',
      tagline: 'Racks completos de mancuernas y bancas olímpicas',
      image: '/images/tour/tour-03-freeweights.webp',
    },
    {
      id: 'powerzone',
      step: '04 / 04',
      title: 'Jaulas de Potencia & Sentadillas',
      tagline: 'Plataformas de levantamiento olímpico y barras calibradas',
      image: '/images/tour/tour-04-powerzone.webp',
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
    }, 4500);
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
