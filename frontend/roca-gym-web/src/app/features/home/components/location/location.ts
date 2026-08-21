import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location.html',
  styleUrl: './location.css',
})
export class Location {
  // Horarios para los 7 días de la semana
  readonly schedules = [
    {
      days: 'Lunes a Viernes',
      hours: '5:00 AM – 10:00 PM',
      tag: 'Jornada Continua',
      tagColor: 'bg-green-500/15 text-green-400 border-green-500/30',
      icon: '🏋️‍♂️',
    },
    {
      days: 'Sábados',
      hours: '6:00 AM – 8:00 PM',
      tag: 'Fin de Semana',
      tagColor: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
      icon: '⚡',
    },
    {
      days: 'Domingos & Festivos',
      hours: '7:00 AM – 4:00 PM',
      tag: 'Recuperación & Cardio',
      tagColor: 'bg-red-500/15 text-red-400 border-red-500/30',
      icon: '🔥',
    },
  ];

  readonly transportOptions = [
    {
      title: 'En TransMilenio / Metro',
      desc: 'A solo 2 cuadras de la estación principal. Acceso directo por puente peatonal.',
      icon: '🚇',
    },
    {
      title: 'En Vehículo / Moto',
      desc: 'Parqueadero privado y vigilado gratis las primeras 2 horas para miembros activos.',
      icon: '🚗',
    },
    {
      title: 'En Bicicleta',
      desc: 'Bicicletero cerrado con candado de seguridad y lockers dentro del gimnasio.',
      icon: '🚲',
    },
  ];
}
