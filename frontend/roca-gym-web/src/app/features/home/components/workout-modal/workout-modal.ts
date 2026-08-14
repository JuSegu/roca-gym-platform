import { Component, EventEmitter, Output, inject, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../../core/services/auth';

interface Exercise {
  id: number;
  name: string;
  targetSeries: number;
  targetReps: string;
  defaultWeight: string;
  image: string;
  restSeconds: number;
  completedSeries: boolean[];
}

@Component({
  selector: 'app-workout-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './workout-modal.html',
  styleUrl: './workout-modal.css',
})
export class WorkoutModal implements OnDestroy {
  private readonly auth = inject(Auth);

  @Output() close = new EventEmitter<void>();

  // Estado de finalización
  isFinished = signal(false);

  // Ejercicios de la rutina Pecho & Tríceps
  exercises = signal<Exercise[]>([
    {
      id: 1,
      name: 'Press de Banca Plano con Barra',
      targetSeries: 4,
      targetReps: '10 reps',
      defaultWeight: '80 kg',
      image: '/images/facilities/pesas.JPG',
      restSeconds: 90,
      completedSeries: [false, false, false, false],
    },
    {
      id: 2,
      name: 'Press Inclinado con Mancuernas',
      targetSeries: 4,
      targetReps: '12 reps',
      defaultWeight: '26 kg c/u',
      image: '/images/facilities/entrenamiento.jpg',
      restSeconds: 60,
      completedSeries: [false, false, false, false],
    },
    {
      id: 3,
      name: 'Fondos en Paralelas (Dips)',
      targetSeries: 3,
      targetReps: 'Fallo técnico',
      defaultWeight: 'Peso Corporal',
      image: '/images/facilities/ambiente.JPG',
      restSeconds: 60,
      completedSeries: [false, false, false],
    },
    {
      id: 4,
      name: 'Extensión de Tríceps en Polea Alta',
      targetSeries: 4,
      targetReps: '12 reps',
      defaultWeight: '35 kg',
      image: '/images/facilities/cardio.JPG',
      restSeconds: 45,
      completedSeries: [false, false, false, false],
    },
  ]);

  // Temporizador de descanso
  restTime = signal(60);
  initialRestTime = signal(60);
  isTimerRunning = signal(false);
  private timerInterval: any = null;

  toggleSerie(exerciseId: number, serieIndex: number): void {
    this.exercises.update((list) =>
      list.map((ex) => {
        if (ex.id === exerciseId) {
          const updatedSeries = [...ex.completedSeries];
          updatedSeries[serieIndex] = !updatedSeries[serieIndex];
          return { ...ex, completedSeries: updatedSeries };
        }
        return ex;
      })
    );

    // Iniciar temporizador de descanso automáticamente
    const currentEx = this.exercises().find((e) => e.id === exerciseId);
    if (currentEx) {
      this.startRestTimer(currentEx.restSeconds);
    }
  }

  updateWeight(exerciseId: number, weight: string): void {
    this.exercises.update((list) =>
      list.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, defaultWeight: weight } : exercise
      )
    );
  }

  startRestTimer(seconds: number): void {
    this.stopRestTimer();
    this.initialRestTime.set(seconds);
    this.restTime.set(seconds);
    this.isTimerRunning.set(true);

    this.timerInterval = setInterval(() => {
      this.restTime.update((t) => {
        if (t <= 1) {
          this.stopRestTimer();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  pauseRestTimer(): void {
    this.stopRestTimer();
  }

  resetRestTimer(): void {
    this.stopRestTimer();
    this.restTime.set(this.initialRestTime());
  }

  private stopRestTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isTimerRunning.set(false);
  }

  finishWorkout(): void {
    this.stopRestTimer();
    // Registrar el entrenamiento en Auth service (ej: 480 kcal, 55 minutos)
    this.auth.recordWorkout(480, 55);
    this.isFinished.set(true);
  }

  onClose(): void {
    this.stopRestTimer();
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.stopRestTimer();
  }
}
