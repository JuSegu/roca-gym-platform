import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../../core/services/auth';
import { DatabaseService } from '../../../../core/services/database';
import { GamificationService } from '../../../../core/services/gamification.service';
import { RoutineService } from '../../../../core/services/routine.service';
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
  imports: [CommonModule, FormsModule, WorkoutModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly auth = inject(Auth);
  readonly db = inject(DatabaseService);
  readonly gamification = inject(GamificationService);
  readonly routineService = inject(RoutineService);

  // Active Tab
  activeTab = signal<'home' | 'routines' | 'gamification' | 'prs' | 'orders'>('home');

  // Modals
  showQrModal = signal(false);
  showWorkoutModal = signal(false);

  // 1RM Calculator State
  calcExercise = signal<string>('Press de Banca Plano');
  calcWeight = signal<number>(80);
  calcReps = signal<number>(6);
  prSuccessMsg = signal<string | null>(null);

  calculated1RM = computed(() =>
    this.routineService.calculateOneRepMax(this.calcWeight(), this.calcReps())
  );

  calculatedPercentages = computed(() =>
    this.routineService.getPercentagesTable(this.calculated1RM())
  );

  // Filtered orders
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
      booked: false,
    },
  ]);

  calcPercentage(value: number, target: number): number {
    if (!target || target <= 0) return 0;
    return Math.min(100, Math.round((value / target) * 100));
  }

  toggleQrModal(): void {
    this.showQrModal.update((v) => !v);
  }

  toggleWorkoutModal(): void {
    this.showWorkoutModal.update((v) => !v);
  }

  startSpecificRoutine(routineId: string): void {
    this.routineService.setActiveRoutine(routineId);
    this.showWorkoutModal.set(true);
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

  saveCalculatedPR(): void {
    const exercise = this.calcExercise();
    const weight = this.calcWeight();
    const reps = this.calcReps();

    this.routineService.addPersonalRecord(exercise, weight, reps, `Calculado: ${weight}kg x ${reps} reps`);

    this.prSuccessMsg.set(`¡Récord guardado: ${this.calculated1RM()} kg en ${exercise}! (+120 XP)`);
    setTimeout(() => {
      this.prSuccessMsg.set(null);
    }, 4000);
  }
}
