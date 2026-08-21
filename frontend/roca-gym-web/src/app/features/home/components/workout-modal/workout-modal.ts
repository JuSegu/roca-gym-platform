import { Component, EventEmitter, Output, inject, signal, computed, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../../core/services/auth';
import { RoutineService } from '../../../../core/services/routine.service';
import { GamificationService } from '../../../../core/services/gamification.service';
import { AudioPlayerService } from '../../../../core/services/audio-player.service';

export interface SetEntry {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface ActiveExercise {
  id: number;
  name: string;
  muscleGroup: string;
  targetSeries: number;
  targetReps: string;
  defaultWeight: string;
  image: string;
  restSeconds: number;
  notes: string;
  sets: SetEntry[];
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

  // Navegación de Fases del Entrenamiento (Estilo Symmetry Pro)
  currentPhase = signal<'warmup' | 'lifting' | 'cardio' | 'summary'>('warmup');

  isFinished = signal(false);
  activeRoutine = this.routineService.activeRoutine;
  exercises = signal<ActiveExercise[]>([]);

  // Cronómetros
  elapsedSeconds = signal(0);
  private workoutClockInterval: any = null;

  // Calentamiento
  warmupTimerSeconds = signal(600); // 10 min
  isWarmupRunning = signal(false);
  private warmupInterval: any = null;

  // Cardio Finisher
  cardioSeconds = signal(900); // 15 min
  isCardioRunning = signal(false);
  private cardioInterval: any = null;

  // Temporizador de Descanso
  restTime = signal(60);
  initialRestTime = signal(60);
  isTimerRunning = signal(false);
  private timerInterval: any = null;

  // Alerta de PR en vivo
  newPrCelebration = signal<string | null>(null);

  // Métricas Computadas
  totalSetsCompleted = computed(() => {
    return this.exercises().reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
      0
    );
  });

  totalTargetSets = computed(() => {
    return this.exercises().reduce((acc, ex) => acc + ex.sets.length, 0);
  });

  totalVolumeKg = computed(() => {
    return this.exercises().reduce((acc, ex) => {
      return (
        acc +
        ex.sets
          .filter((s) => s.completed)
          .reduce((sAcc, s) => sAcc + s.weight * s.reps, 0)
      );
    }, 0);
  });

  estimatedCalories = computed(() => {
    const base = Math.floor(this.elapsedSeconds() * 0.12);
    const setBonus = this.totalSetsCompleted() * 20;
    const cardioBonus = this.currentPhase() === 'summary' ? this.activeRoutine().cardioFinisher.estimatedCalories : 0;
    return base + setBonus + cardioBonus;
  });

  formattedWorkoutTime = computed(() => {
    const total = this.elapsedSeconds();
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  // Puntuación de Simetría AI (Inspirada en Symmetry App)
  symmetryScore = computed(() => {
    const volume = this.totalVolumeKg();
    const sets = this.totalSetsCompleted();
    const base = 75;
    const volumeFactor = Math.min(15, Math.floor(volume / 400));
    const setFactor = Math.min(10, sets * 1.5);
    const overall = Math.min(99, Math.round(base + volumeFactor + setFactor));

    return {
      overall,
      potential: Math.min(98, overall + 6),
      vTaper: Math.min(96, overall - 2),
      muscleDensity: Math.min(99, overall + 2),
      rank: overall >= 92 ? 'TITÁN SIMÉTRICO 🔥' : overall >= 85 ? 'DIAMANTE I' : overall >= 78 ? 'PLATINO II' : 'ORO III',
    };
  });

  ngOnInit(): void {
    const routine = this.activeRoutine();
    const exList: ActiveExercise[] = routine.exercises.map((ex) => {
      const defaultWeightNum = parseInt(ex.defaultWeight) || 60;
      const targetRepsNum = parseInt(ex.targetReps) || 10;

      const sets: SetEntry[] = Array.from({ length: ex.targetSeries }, (_, i) => ({
        setNumber: i + 1,
        weight: defaultWeightNum,
        reps: targetRepsNum,
        completed: false,
      }));

      return {
        ...ex,
        sets,
      };
    });

    this.exercises.set(exList);
    this.initialRestTime.set(exList[0]?.restSeconds || 60);
    this.restTime.set(exList[0]?.restSeconds || 60);
    this.warmupTimerSeconds.set(routine.warmupMinutes * 60);
    this.cardioSeconds.set(routine.cardioFinisher.durationMinutes * 60);

    // Iniciar cronómetro general
    this.workoutClockInterval = setInterval(() => {
      this.elapsedSeconds.update((s) => s + 1);
    }, 1000);
  }

  setPhase(phase: 'warmup' | 'lifting' | 'cardio' | 'summary'): void {
    this.currentPhase.set(phase);
    if (phase === 'lifting') {
      this.audio.playSetDoneSound();
    }
  }

  // Controles de Calentamiento
  startWarmupTimer(): void {
    this.isWarmupRunning.set(true);
    this.warmupInterval = setInterval(() => {
      this.warmupTimerSeconds.update((s) => {
        if (s <= 1) {
          clearInterval(this.warmupInterval);
          this.isWarmupRunning.set(false);
          this.audio.playLevelUpSound();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  pauseWarmupTimer(): void {
    if (this.warmupInterval) {
      clearInterval(this.warmupInterval);
      this.warmupInterval = null;
    }
    this.isWarmupRunning.set(false);
  }

  formatSeconds(secs: number): string {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  // Controles de Cardio Finisher
  startCardioTimer(): void {
    this.isCardioRunning.set(true);
    this.cardioInterval = setInterval(() => {
      this.cardioSeconds.update((s) => {
        if (s <= 1) {
          clearInterval(this.cardioInterval);
          this.isCardioRunning.set(false);
          this.audio.playLevelUpSound();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  pauseCardioTimer(): void {
    if (this.cardioInterval) {
      clearInterval(this.cardioInterval);
      this.cardioInterval = null;
    }
    this.isCardioRunning.set(false);
  }

  // Controles de Series de Levantamiento
  toggleSet(exerciseId: number, setIndex: number): void {
    let completedNow = false;
    let exerciseName = '';
    let currentWeight = 0;
    let currentReps = 0;

    this.exercises.update((list) =>
      list.map((ex) => {
        if (ex.id === exerciseId) {
          exerciseName = ex.name;
          const updatedSets = ex.sets.map((s, idx) => {
            if (idx === setIndex) {
              const newState = !s.completed;
              if (newState) {
                completedNow = true;
                currentWeight = s.weight;
                currentReps = s.reps;
              }
              return { ...s, completed: newState };
            }
            return s;
          });
          return { ...ex, sets: updatedSets };
        }
        return ex;
      })
    );

    if (completedNow) {
      this.audio.playSetDoneSound();
      this.gamification.addXp(35, `Serie completada en ${exerciseName}`);

      // Comprobar si califica como PR
      if (currentWeight >= 75) {
        this.routineService.addPersonalRecord(
          exerciseName,
          currentWeight,
          currentReps,
          `En entrenamiento en vivo: ${currentWeight}kg x ${currentReps}`
        );
        this.newPrCelebration.set(`🏆 ¡NUEVO RÉCORD: ${currentWeight} KG EN ${exerciseName.toUpperCase()}! (+100 XP)`);
        setTimeout(() => this.newPrCelebration.set(null), 4000);
      }

      const currentEx = this.exercises().find((e) => e.id === exerciseId);
      if (currentEx) {
        this.startRestTimer(currentEx.restSeconds);
      }
    }
  }

  addSet(exerciseId: number): void {
    this.exercises.update((list) =>
      list.map((ex) => {
        if (ex.id === exerciseId) {
          const lastSet = ex.sets[ex.sets.length - 1];
          const newSet: SetEntry = {
            setNumber: ex.sets.length + 1,
            weight: lastSet ? lastSet.weight : 50,
            reps: lastSet ? lastSet.reps : 10,
            completed: false,
          };
          return { ...ex, sets: [...ex.sets, newSet], targetSeries: ex.sets.length + 1 };
        }
        return ex;
      })
    );
  }

  adjustRest(seconds: number): void {
    this.restTime.update((t) => Math.max(0, t + seconds));
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
          this.audio.playLevelUpSound();
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
    if (this.workoutClockInterval) {
      clearInterval(this.workoutClockInterval);
      this.workoutClockInterval = null;
    }
    if (this.warmupInterval) clearInterval(this.warmupInterval);
    if (this.cardioInterval) clearInterval(this.cardioInterval);

    const durationMins = Math.max(1, Math.round(this.elapsedSeconds() / 60));
    const calories = this.estimatedCalories();
    const routine = this.activeRoutine();

    // 1. Persistir en Auth
    this.auth.recordWorkout(calories, durationMins);

    // 2. Entregar XP Masivo
    this.gamification.addXp(350, `Rutina completada: ${routine.name}`);

    // 3. Evaluar Logros
    const user = this.auth.currentUser();
    if (user) {
      this.gamification.evaluateStats(user.stats);
    }

    // 4. Fanfarria de Victoria
    this.audio.playVictorySound();

    this.currentPhase.set('summary');
    this.isFinished.set(true);
  }

  onClose(): void {
    this.stopRestTimer();
    if (this.workoutClockInterval) clearInterval(this.workoutClockInterval);
    if (this.warmupInterval) clearInterval(this.warmupInterval);
    if (this.cardioInterval) clearInterval(this.cardioInterval);
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.stopRestTimer();
    if (this.workoutClockInterval) clearInterval(this.workoutClockInterval);
    if (this.warmupInterval) clearInterval(this.warmupInterval);
    if (this.cardioInterval) clearInterval(this.cardioInterval);
  }
}
