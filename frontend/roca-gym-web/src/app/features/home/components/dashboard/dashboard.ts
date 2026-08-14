import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../../core/services/auth';
import { DatabaseService } from '../../../../core/services/database';
import { WorkoutModal } from '../workout-modal/workout-modal';

interface ClassSession {
  id: number;
  name: string;
  category: string;
  time: string;
  trainer: string;
  capacity: string;
  isFull: boolean;
  booked: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [WorkoutModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly auth = inject(Auth);
  readonly db = inject(DatabaseService);

  // Pestaña activa del dashboard
  activeTab = signal<'home' | 'orders'>('home');

  // Estado reactivo de modales
  showQrModal = signal(false);
  showWorkoutModal = signal(false);

  // Mis compras filtradas por usuario actual
  myOrders = () => {
    const email = this.auth.currentUser()?.email;
    if (!email) return [];
    return this.db.orders().filter((o) => o.userEmail === email);
  };

  classes = signal<ClassSession[]>([
    {
      id: 1,
      name: 'Spinning Extreme',
      category: 'Cardio & Resistencia',
      time: '06:00 PM - 07:00 PM',
      trainer: 'Carlos Mendoza',
      capacity: '18 / 20 Cupos',
      isFull: false,
      booked: false,
    },
    {
      id: 2,
      name: 'CrossFit Power',
      category: 'Fuerza & Condicionamiento',
      time: '07:30 PM - 08:30 PM',
      trainer: 'Valeria Gómez',
      capacity: 'Lleno',
      isFull: true,
      booked: false,
    },
    {
      id: 3,
      name: 'Yoga & Recuperación',
      category: 'Movilidad & Flexibilidad',
      time: '08:30 PM - 09:30 PM',
      trainer: 'Sofía Ramos',
      capacity: '10 / 15 Cupos',
      isFull: false,
      booked: true,
    },
  ]);

  toggleQrModal(): void {
    this.showQrModal.update((v) => !v);
  }

  toggleWorkoutModal(): void {
    this.showWorkoutModal.update((v) => !v);
  }

  toggleBooking(classId: number): void {
    this.classes.update((items) =>
      items.map((item) => {
        if (item.id === classId && !item.isFull) {
          return { ...item, booked: !item.booked };
        }
        return item;
      })
    );
  }
}
