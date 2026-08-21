import { Component, EventEmitter, Output, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../../core/services/auth';
import { RoutineService } from '../../../../core/services/routine.service';
import { GamificationService } from '../../../../core/services/gamification.service';
import { AudioPlayerService } from '../../../../core/services/audio-player.service';

interface ActiveExercise {
  id: number;
  name: string;
  muscleGroup: string;
  targetSeries: number;
  targetReps: string;
  defaultWeight: string;
  image: string;
  restSeconds: number;
  notes: string;
  completedSeries: boolean[];
}

@Component({
  selector: 'app-workout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-modal.html',
  styleUrl: './workout-modal.css',
})
export class WorkoutModal implements OnInit, OnDestroy {
  readonly auth = inject(Auth);
  readonly routineService = inject(RoutineService);
  readonly gamification = inject(GamificationService);
  readonly audio = inject(AudioPlayerService);

  @Output() close = new EventEmitter<void>();

  isFinished = signal(false);
  activeRoutine = this.routineService.activeRoutine;
  exercises = signal<ActiveExercise[]>([]);

  // Rest Timer
  restTime = signal(60);
  initialRestTime = signal(60);
  isTimerRunning = signal(false);
  private timerInterval: any = null;

  ngOnInit(): void {
    const routine = this.activeRoutine();
    const exList: ActiveExercise[] = routine.exercises.map((ex) => ({
      ...ex,
      completedSeries: Array.from({ length: ex.targetSeries }, () => false),
    }));
    this.exercises.set(exList);
    this.initialRestTime.set(exList[0]?.restSeconds || 60);
    this.restTime.set(exList[0]?.restSeconds || 60);
  }

  toggleSerie(exerciseId: number, serieIndex: number): void {
    let wasNewlyCompleted = false;

    this.exercises.update((list) =>
      list.map((ex) => {
        if (ex.id === exerciseId) {
          const updatedSeries = [...ex.completedSeries];
          updatedSeries[serieIndex] = !updatedSeries[serieIndex];
          if (updatedSeries[serieIndex]) wasNewlyCompleted = true;
          return { ...ex, completedSeries: updatedSeries };
        }
        return ex;
      })
    );

    if (wasNewlyCompleted) {
      this.audio.playSetDoneSound();
    }

    const currentEx = this.exercises().find((e) => e.id === exerciseId);
    if (currentEx) {
      this.startRestTimer(currentEx.restSeconds);
    }
  }

  updateWeight(exerciseId: number, weight: string): void {
    this.exercises.update((list) =>
      list.map((ex) => (ex.id === exerciseId ? { ...ex, defaultWeight: weight } : ex))
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
    const routine = this.activeRoutine();

    // 1. Record in Auth service
    this.auth.recordWorkout(routine.estimatedCalories, routine.durationMinutes);

    // 2. Award XP in Gamification service
    this.gamification.addXp(180, `Rutina completada: ${routine.name}`);

    // 3. Evaluate Achievements
    const user = this.auth.currentUser();
    if (user) {
      this.gamification.evaluateStats(user.stats);
    }

    // 4. Play Victory fanfare
    this.audio.playVictorySound();

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
