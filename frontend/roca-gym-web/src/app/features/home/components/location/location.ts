import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location.html',
  styleUrl: './location.css',
})
export class Location {
  readonly address = 'Calle 80 #92-49';
  readonly mapsUrl = 'https://maps.google.com/?q=Calle+80+%2392-49';
  readonly wazeUrl = 'https://waze.com/ul?q=Calle+80+%2392-49';

  // Horarios exactos para los 7 días de la semana
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
      hours: '8:00 AM – 3:00 PM',
      tag: 'Fin de Semana',
      tagColor: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
      icon: '⚡',
    },
    {
      days: 'Domingos',
      hours: '8:00 AM – 1:00 PM',
      tag: 'Domingo Activo',
      tagColor: 'bg-red-500/15 text-red-400 border-red-500/30',
      icon: '🔥',
    },
    {
      days: 'Festivos',
      hours: '8:00 AM – 2:00 PM',
      tag: 'Día Festivo',
      tagColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      icon: '🏆',
    },
  ];

  readonly transportOptions = [
    {
      title: 'En TransMilenio',
      desc: 'Te puedes bajar en la estación Quirigua y llegas caminando directo sobre la Calle 80.',
      icon: '🚇',
    },
    {
      title: 'En Moto',
      desc: 'Puedes parquear tu moto sin ningún problema al frente del gimnasio mientras entrenas.',
      icon: '🏍️',
    },
    {
      title: 'A Pie / Bicicleta',
      desc: 'Acceso directo y seguro sobre el corredor principal de la Calle 80 #92-49.',
      icon: '🚲',
    },
  ];
}
