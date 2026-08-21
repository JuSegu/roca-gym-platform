import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';

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
  private readonly router = inject(Router);
  readonly auth = inject(Auth);

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
        '1 Evaluación física inicial',
        '5% OFF en Tienda ROCA',
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
        '2 Evaluaciones físicas con entrenador',
        '10% OFF en Tienda ROCA',
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
        '15% OFF en suplementos y tienda',
        'Rutinas guiadas en la plataforma',
      ],
    },
  ];

  selectPlan(plan: PlanItem): void {
    if (this.auth.isLoggedIn()) {
      alert(`¡Excelente! Has seleccionado el ${plan.name}. Tu plan está activo.`);
    } else {
      this.router.navigate(['/register'], {
        queryParams: { plan: plan.name },
      });
    }
  }
}
