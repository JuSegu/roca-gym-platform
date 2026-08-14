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
      description: 'Acceso total durante 30 días sin permanencia obligatoria.',
      promotion: '',
      featured: false,
      benefits: ['Acceso a todas las máquinas', 'Zona de pesas libres & cardio', 'Vestidores y lockers'],
    },
    {
      name: 'Plan 3 Meses',
      price: '$225.000',
      period: 'x 5 Meses',
      description: '¡Pagas 3 meses y entrenas 5 meses completos!',
      promotion: 'PROMOCIÓN 5X3',
      featured: false,
      benefits: ['5 meses de acceso total', '1 Evaluación física inicial', '5% OFF en Tienda ROCA'],
    },
    {
      name: 'Plan 4 Meses',
      price: '$300.000',
      period: 'x 8 Meses',
      description: '¡Pagas 4 meses y te llevas 8 meses de entrenamiento!',
      promotion: 'MEJOR VALOR',
      featured: false,
      benefits: ['8 meses de acceso continuo', '2 Evaluaciones físicas', '10% OFF en Tienda ROCA'],
    },
    {
      name: 'Plan Anual VIP',
      price: '$450.000',
      period: '/año completo',
      description: 'Acceso ilimitado los 365 días del año con estatus VIP.',
      promotion: 'OFERTA ESPECIAL',
      featured: true,
      benefits: ['Acceso 365 días + 24/7', '15% OFF Exclusivo en Tienda', '1 Pase de invitado al mes', 'Rutinas personalizadas'],
    },
  ];

  selectPlan(plan: PlanItem): void {
    if (this.auth.isLoggedIn()) {
      alert(`¡Excelente! Has seleccionado el ${plan.name}. Tu membresía está activa.`);
    } else {
      this.router.navigate(['/register'], {
        queryParams: { plan: plan.name },
      });
    }
  }
}
