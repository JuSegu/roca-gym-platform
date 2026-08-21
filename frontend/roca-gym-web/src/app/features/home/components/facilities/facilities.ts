import { Component, signal, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

export interface FacilityCard {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  colsSpan: string; // e.g. 'lg:col-span-2' or 'lg:col-span-1'
  slides: {
    image: string;
    caption: string;
  }[];
  currentSlide: number;
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
  private timer: any = null;

  // Estado reactivo de las 4 tarjetas de instalaciones con múltiples slides cada una
  facilities = signal<FacilityCard[]>([
    {
      id: 'training',
      category: 'Entrenamiento',
      title: 'Zona de Fuerza & Alto Impacto',
      subtitle: 'Maquinaria pesada biomecánica, poleas y estaciones guiadas para hipertrofia.',
      colsSpan: 'lg:col-span-2 min-h-[420px]',
      currentSlide: 0,
      slides: [
        {
          image: '/images/tour/tour-02-machines.jpg',
          caption: 'Circuito de Máquinas de Alto Impacto',
        },
        {
          image: '/images/tour/tour-04-powerzone.jpg',
          caption: 'Jaulas de Potencia & Sentadilla',
        },
        {
          image: '/images/facilities/community.jpg',
          caption: 'Entrenamiento Funcional & Peso Muerto',
        },
      ],
    },
    {
      id: 'freeweights',
      category: 'Fuerza Pura',
      title: 'Zona de Pesas & Mancuernas',
      subtitle: 'Racks completos de mancuernas hasta 50kg y bancas olímpicas.',
      colsSpan: 'lg:col-span-1 min-h-[420px]',
      currentSlide: 0,
      slides: [
        {
          image: '/images/tour/tour-03-freeweights.jpg',
          caption: 'Racks de Mancuernas & Peso Libre',
        },
        {
          image: '/images/facilities/pesas.JPG',
          caption: 'Bancas de Competición Planas e Inclinadas',
        },
      ],
    },
    {
      id: 'cardio',
      category: 'Resistencia',
      title: 'Zona de Cardio & Rendimiento',
      subtitle: 'Cintas curvas Woodway, Air Bikes, remos Concept2 y escaladoras.',
      colsSpan: 'lg:col-span-1 min-h-[360px]',
      currentSlide: 0,
      slides: [
        {
          image: '/images/facilities/cardio-zone.jpg',
          caption: 'Cintas Curvas, Air Bikes & Remos',
        },
        {
          image: '/images/facilities/cardio.JPG',
          caption: 'Resistencia & Quema Calórica',
        },
      ],
    },
    {
      id: 'community',
      category: 'Comunidad ROCA',
      title: 'Tu Próximo Entrenamiento',
      subtitle: 'Ambiente motivacional con la mejor energía, luces neón y asesoría.',
      colsSpan: 'lg:col-span-2 min-h-[360px]',
      currentSlide: 0,
      slides: [
        {
          image: '/images/facilities/community.jpg',
          caption: 'Comunidad Activa & Levantamientos en Equipo',
        },
        {
          image: '/images/tour/tour-01-entrance.jpg',
          caption: 'Recepción & Entrada Biométrica Moderna',
        },
        {
          image: '/images/facilities/ambiente.JPG',
          caption: 'Ambiente Exclusivo y Sonido Envolvente',
        },
      ],
    },
  ]);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startSlideshowTimer();
    }
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private startSlideshowTimer(): void {
    this.timer = setInterval(() => {
      this.facilities.update((items) =>
        items.map((card) => ({
          ...card,
          currentSlide: (card.currentSlide + 1) % card.slides.length,
        }))
      );
    }, 4000);
  }

  nextSlide(cardIndex: number, event?: Event): void {
    if (event) event.stopPropagation();
    this.facilities.update((items) =>
      items.map((card, idx) =>
        idx === cardIndex
          ? { ...card, currentSlide: (card.currentSlide + 1) % card.slides.length }
          : card
      )
    );
  }

  prevSlide(cardIndex: number, event?: Event): void {
    if (event) event.stopPropagation();
    this.facilities.update((items) =>
      items.map((card, idx) =>
        idx === cardIndex
          ? {
              ...card,
              currentSlide:
                (card.currentSlide - 1 + card.slides.length) % card.slides.length,
            }
          : card
      )
    );
  }

  setSlide(cardIndex: number, slideIndex: number, event?: Event): void {
    if (event) event.stopPropagation();
    this.facilities.update((items) =>
      items.map((card, idx) =>
        idx === cardIndex ? { ...card, currentSlide: slideIndex } : card
      )
    );
  }
}