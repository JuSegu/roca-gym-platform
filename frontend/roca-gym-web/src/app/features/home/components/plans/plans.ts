import { Component } from '@angular/core';

export interface PlanItem {
  name: string;
  price: string;
  period: string;
  description: string;
  promotion: string;
  featured: boolean;
  benefits: string[];
}

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [],
  templateUrl: './plans.html',
  styleUrl: './plans.css',
})
export class Plans {

  plans: PlanItem[] = [
    {
      name: 'Plan Mensual',
      price: '$75.000',
      period: '/mes',
      description: 'Acceso total durante 30 días continuos para entrenar a tu ritmo.',
      promotion: '',
      featured: false,
      benefits: [
        'Acceso a todas las máquinas & peso libre',
        '1 Invitado diferente 2 veces al mes los fines de semana',
        '5% OFF en Tienda de Suplementos ROCA',
        'Vestidores, duchas y lockers',
      ],
    },
    {
      name: 'Plan 3 Meses',
      price: '$225.000',
      period: 'x 5 Meses',
      description: '¡Pagas 3 meses y entrenas 5 meses completos!',
      promotion: 'PROMOCIÓN 5X3',
      featured: false,
      benefits: [
        '5 meses de acceso continuo',
        '1 Invitado diferente 2 veces al mes los fines de semana',
        '5% OFF en Tienda de Suplementos ROCA',
        '1 Evaluación física inicial',
      ],
    },
    {
      name: 'Plan 4 Meses',
      price: '$300.000',
      period: 'x 8 Meses',
      description: '¡Pagas 4 meses y te llevas 8 meses de entrenamiento!',
      promotion: 'MEJOR VALOR',
      featured: false,
      benefits: [
        '8 meses de entrenamiento total',
        '1 Invitado diferente 2 veces al mes los fines de semana',
        '5% OFF en Tienda de Suplementos ROCA',
        '2 Evaluaciones físicas con entrenador',
      ],
    },
    {
      name: 'Plan Anual',
      price: '$450.000',
      period: '/año completo',
      description: 'Acceso ilimitado los 365 días del año con la mejor tarifa por mes.',
      promotion: 'MÁXIMO AHORRO',
      featured: true,
      benefits: [
        'Acceso los 365 días del año',
        '1 Invitado diferente 2 veces al mes los fines de semana',
        '5% OFF en Tienda de Suplementos ROCA',
        'Rutinas guiadas en la plataforma web',
      ],
    },
  ];

  selectPlan(plan: PlanItem): void {
    // Abrir WhatsApp para consultar sobre el plan
    const text = encodeURIComponent(
      `¡Hola ROCA GYM! 💪 Estoy interesado en el ${plan.name} (${plan.price} ${plan.period}). ¿Me pueden dar más información?`
    );
    window.open(`https://wa.me/573123456789?text=${text}`, '_blank');
  }
}
