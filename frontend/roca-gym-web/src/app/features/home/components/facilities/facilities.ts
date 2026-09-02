import { Component, signal, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

export interface FacilityCard {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  colsSpan: string;
  video: string;
}

@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './facilities.html',
  styleUrl: './facilities.css',
})
export class Facilities implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  // Tarjetas de instalaciones con videos reales del gym
  facilities = signal<FacilityCard[]>([
    {
      id: 'training',
      category: 'Entrenamiento',
      title: 'Zona de Fuerza & Alto Impacto',
      subtitle: 'Maquinaria pesada biomecánica, poleas y estaciones guiadas para hipertrofia.',
      colsSpan: 'lg:col-span-2 min-h-[420px]',
      video: '/videos/hero-bg.mp4',
    },
    {
      id: 'freeweights',
      category: 'Fuerza Pura',
      title: 'Zona de Pesas & Mancuernas',
      subtitle: 'Racks completos de mancuernas hasta 50kg y bancas olímpicas.',
      colsSpan: 'lg:col-span-1 min-h-[420px]',
      video: '/videos/facility-1.mp4',
    },
    {
      id: 'cardio',
      category: 'Resistencia',
      title: 'Zona de Cardio & Rendimiento',
      subtitle: 'Cintas curvas Woodway, Air Bikes, remos Concept2 y escaladoras.',
      colsSpan: 'lg:col-span-1 min-h-[360px]',
      video: '/videos/facility-2.mp4',
    },
    {
      id: 'community',
      category: 'Comunidad ROCA',
      title: 'Tu Próximo Entrenamiento',
      subtitle: 'Ambiente motivacional con la mejor energía, luces neón y asesoría.',
      colsSpan: 'lg:col-span-2 min-h-[360px]',
      video: '/videos/facility-3.mp4',
    },
  ]);

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}