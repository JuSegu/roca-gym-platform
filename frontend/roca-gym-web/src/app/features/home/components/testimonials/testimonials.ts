import { Component } from '@angular/core';

interface Testimonial {
  name: string;
  plan: string;
  time: string;
  text: string;
  rating: number;
  avatar: string;
  result: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  templateUrl: './testimonials.html',
})
export class Testimonials {
  readonly testimonials: Testimonial[] = [
    {
      name: 'Camila Rodríguez',
      plan: 'Plan 4 Meses',
      time: 'Miembro desde hace 8 meses',
      text: 'ROCA GYM cambió mi vida. Las instalaciones son increíbles, las máquinas siempre disponibles y el ambiente te da ganas de entrenar todos los días. Bajé 12 kg en 4 meses.',
      rating: 5,
      avatar: '💪',
      result: '-12 kg en 4 meses',
    },
    {
      name: 'Andrés Morales',
      plan: 'Plan Anual',
      time: 'Miembro desde hace 1 año',
      text: 'El mejor gym de la zona de Quiriguá. Nunca está lleno, los equipos son de primera y desde que usan la app puedo planear mis rutinas antes de llegar. Subí 8 kg de músculo.',
      rating: 5,
      avatar: '🏋️',
      result: '+8 kg músculo',
    },
    {
      name: 'Laura Jiménez',
      plan: 'Plan 3 Meses',
      time: 'Miembro desde hace 5 meses',
      text: 'La plataforma web es una pasada — puedo ver mis récords, hacer check-in con el QR y hasta pedir mis suplementos en línea. Nunca había visto algo así en un gym de barrio.',
      rating: 5,
      avatar: '🔥',
      result: 'Fuerza +40%',
    },
    {
      name: 'Santiago Pérez',
      plan: 'Plan Mensual',
      time: 'Miembro desde hace 3 meses',
      text: 'Vine de curiosidad y me quedé. El ambiente es muy motivador y la gente es seria. Los equipos de cardio y pesos libres son excelentes. La app me ayuda a llevar el seguimiento.',
      rating: 5,
      avatar: '⚡',
      result: 'Racha de 45 días',
    },
    {
      name: 'Valentina Cruz',
      plan: 'Plan 4 Meses',
      time: 'Miembro desde hace 6 meses',
      text: 'Lo que más me gusta es el sistema de rutinas de la app. Me dice exactamente qué ejercicios hacer, cuánto descansar y hasta detecta cuando rompo un récord. ¡Genial!',
      rating: 5,
      avatar: '🌟',
      result: '1RM Sentadilla +30 kg',
    },
    {
      name: 'Diego Hernández',
      plan: 'Plan Anual',
      time: 'Miembro desde hace 14 meses',
      text: 'El precio es muy justo para la calidad que ofrecen. Equipos nuevos, limpio, buena energía. El plan anual fue la mejor decisión que tomé para mi salud en todo el año.',
      rating: 5,
      avatar: '🏆',
      result: 'Cuerpo transformado',
    },
  ];
}
