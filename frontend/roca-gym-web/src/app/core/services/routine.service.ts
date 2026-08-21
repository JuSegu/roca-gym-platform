import { Injectable, signal, computed, inject } from '@angular/core';
import { GamificationService } from './gamification.service';

export interface ExerciseItem {
  id: number;
  name: string;
  muscleGroup: string;
  targetSeries: number;
  targetReps: string;
  restSeconds: number;
  defaultWeight: string;
  image: string;
  notes: string;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  tag: string;
  focus: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Élite';
  durationMinutes: number;
  estimatedCalories: number;
  icon: string;
  exercises: ExerciseItem[];
}

export interface PersonalRecord {
  id: string;
  exercise: string;
  oneRepMax: number; // in kg
  weightUsed: number;
  reps: number;
  date: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RoutineService {
  private readonly gamification = inject(GamificationService);
  private readonly PRS_KEY = 'roca_gym_personal_records';
  private readonly ACTIVE_ROUTINE_KEY = 'roca_gym_active_routine_id';

  // Library of routines
  readonly routines: WorkoutRoutine[] = [
    {
      id: 'push_hypertrophy',
      name: 'Push Day: Pecho, Hombro & Tríceps',
      tag: 'Hipertrofia & Fuerza',
      focus: 'Pectoral mayor, deltoides anterior/lateral y tríceps braquial',
      level: 'Intermedio',
      durationMinutes: 55,
      estimatedCalories: 480,
      icon: '💥',
      exercises: [
        {
          id: 1,
          name: 'Press de Banca Plano con Barra',
          muscleGroup: 'Pecho',
          targetSeries: 4,
          targetReps: '8-10',
          restSeconds: 90,
          defaultWeight: '80 kg',
          image: '/images/facilities/pesas.JPG',
          notes: 'Mantén la retracción escapular y baja la barra controlada hasta el esternón.',
        },
        {
          id: 2,
          name: 'Press Inclinado con Mancuernas',
          muscleGroup: 'Pecho Superior',
          targetSeries: 4,
          targetReps: '10-12',
          restSeconds: 60,
          defaultWeight: '26 kg c/u',
          image: '/images/facilities/entrenamiento.jpg',
          notes: 'Banco a 30° de inclinación para enfocar el haz clavicular.',
        },
        {
          id: 3,
          name: 'Elevaciones Laterales Pesadas',
          muscleGroup: 'Hombros',
          targetSeries: 4,
          targetReps: '12-15',
          restSeconds: 45,
          defaultWeight: '14 kg c/u',
          image: '/images/facilities/pesas.JPG',
          notes: 'Codos ligeramente flexionados, sin balanceo de cadera.',
        },
        {
          id: 4,
          name: 'Fondos en Paralelas (Dips)',
          muscleGroup: 'Tríceps & Pecho',
          targetSeries: 3,
          targetReps: 'Fallo Técnico',
          restSeconds: 60,
          defaultWeight: 'Peso Corporal',
          image: '/images/facilities/ambiente.JPG',
          notes: 'Torso inclinado hacia adelante para activar más fibras pectorales.',
        },
        {
          id: 5,
          name: 'Extensión de Tríceps en Polea Alta',
          muscleGroup: 'Tríceps',
          targetSeries: 4,
          targetReps: '12-15',
          restSeconds: 45,
          defaultWeight: '35 kg',
          image: '/images/facilities/cardio.JPG',
          notes: 'Bloquea los codos pegados a las costillas en todo el rango.',
        },
      ],
    },
    {
      id: 'pull_density',
      name: 'Pull Day: Espalda, Bíceps & Trapecio',
      tag: 'Densidad & Amplitud',
      focus: 'Dorsal ancho, romboides, trapecio y bíceps',
      level: 'Avanzado',
      durationMinutes: 60,
      estimatedCalories: 520,
      icon: '🦍',
      exercises: [
        {
          id: 201,
          name: 'Peso Muerto Convencional',
          muscleGroup: 'Espalda & Cadena Posterior',
          targetSeries: 4,
          targetReps: '6-8',
          restSeconds: 120,
          defaultWeight: '140 kg',
          image: '/images/facilities/pesas.JPG',
          notes: 'Espalda completamente neutra y empuje con las piernas.',
        },
        {
          id: 202,
          name: 'Dominadas Lastradas / Pronas',
          muscleGroup: 'Dorsal Ancho',
          targetSeries: 4,
          targetReps: '8-10',
          restSeconds: 90,
          defaultWeight: '+10 kg',
          image: '/images/facilities/entrenamiento.jpg',
          notes: 'Rango completo desde bloqueo abajo hasta mentón sobre la barra.',
        },
        {
          id: 203,
          name: 'Remo con Barra T o Pendlay',
          muscleGroup: 'Espalda Media',
          targetSeries: 4,
          targetReps: '10-12',
          restSeconds: 60,
          defaultWeight: '65 kg',
          image: '/images/facilities/ambiente.JPG',
          notes: 'Aprieta las escápulas durante 1 segundo en el punto máximo de contracción.',
        },
        {
          id: 204,
          name: 'Curl de Bíceps con Barra Z',
          muscleGroup: 'Bíceps',
          targetSeries: 4,
          targetReps: '10-12',
          restSeconds: 45,
          defaultWeight: '32 kg',
          image: '/images/facilities/pesas.JPG',
          notes: 'Fase excéntrica de 3 segundos.',
        },
        {
          id: 205,
          name: 'Face Pulls en Polea',
          muscleGroup: 'Deltoides Posterior & Manguito',
          targetSeries: 3,
          targetReps: '15-20',
          restSeconds: 45,
          defaultWeight: '25 kg',
          image: '/images/facilities/cardio.JPG',
          notes: 'Salud articular de hombros y rotación externa.',
        },
      ],
    },
    {
      id: 'leg_power',
      name: 'Leg Day: Cuádriceps, Isquios & Glúteos',
      tag: 'Potencia & Volumen',
      focus: 'Cuádriceps, isquiotibiales, glúteo mayor y pantorrillas',
      level: 'Avanzado',
      durationMinutes: 65,
      estimatedCalories: 580,
      icon: '🦵',
      exercises: [
        {
          id: 301,
          name: 'Sentadilla Libre con Barra Trasera',
          muscleGroup: 'Pierna Completa',
          targetSeries: 5,
          targetReps: '6-8',
          restSeconds: 120,
          defaultWeight: '110 kg',
          image: '/images/facilities/pesas.JPG',
          notes: 'Profundidad paralela o por debajo, rodillas alineadas con la punta de los pies.',
        },
        {
          id: 302,
          name: 'Prensa Inclinada 45°',
          muscleGroup: 'Cuádriceps & Glúteos',
          targetSeries: 4,
          targetReps: '10-12',
          restSeconds: 75,
          defaultWeight: '220 kg',
          image: '/images/facilities/entrenamiento.jpg',
          notes: 'No bloquees las rodillas arriba para mantener tensión continua.',
        },
        {
          id: 303,
          name: 'Hip Thrust con Barra',
          muscleGroup: 'Glúteos',
          targetSeries: 4,
          targetReps: '10-12',
          restSeconds: 75,
          defaultWeight: '130 kg',
          image: '/images/facilities/ambiente.JPG',
          notes: 'Pausa de 2 segundos arriba con retroversión pélvica.',
        },
        {
          id: 304,
          name: 'Curl Femoral Tumbado en Máquina',
          muscleGroup: 'Isquiotibiales',
          targetSeries: 4,
          targetReps: '12-15',
          restSeconds: 45,
          defaultWeight: '45 kg',
          image: '/images/facilities/cardio.JPG',
          notes: 'Control total de la bajada sin despegar la pelvis.',
        },
        {
          id: 305,
          name: 'Elevación de Talones en Máquina Smith',
          muscleGroup: 'Gemelos',
          targetSeries: 4,
          targetReps: '15-20',
          restSeconds: 45,
          defaultWeight: '70 kg',
          image: '/images/facilities/pesas.JPG',
          notes: 'Estiramiento profundo abajo de 2 segundos.',
        },
      ],
    },
    {
      id: 'full_body_beast',
      name: 'Full Body Explosivo: Acondicionamiento ROCA',
      tag: 'Metabólico & Fuerza',
      focus: 'Activación neuromuscular de cuerpo entero',
      level: 'Intermedio',
      durationMinutes: 50,
      estimatedCalories: 510,
      icon: '⚡',
      exercises: [
        {
          id: 401,
          name: 'Clean & Push Press con Barra',
          muscleGroup: 'Cuerpo Completo',
          targetSeries: 4,
          targetReps: '6-8',
          restSeconds: 90,
          defaultWeight: '50 kg',
          image: '/images/facilities/pesas.JPG',
          notes: 'Extensión triple de tobillos, rodillas y cadera.',
        },
        {
          id: 402,
          name: 'Sentadilla Goblet con Mancuerna',
          muscleGroup: 'Piernas & Core',
          targetSeries: 4,
          targetReps: '12',
          restSeconds: 60,
          defaultWeight: '32 kg',
          image: '/images/facilities/entrenamiento.jpg',
          notes: 'Pecho alto y codos rozando el interior de las rodillas.',
        },
        {
          id: 403,
          name: 'Remo Invertido en Anillas o TRX',
          muscleGroup: 'Espalda & Core',
          targetSeries: 4,
          targetReps: '12-15',
          restSeconds: 45,
          defaultWeight: 'Peso Corporal',
          image: '/images/facilities/ambiente.JPG',
          notes: 'Mantén el cuerpo como una tabla rígida.',
        },
        {
          id: 404,
          name: 'Kettlebell Swings Rusos',
          muscleGroup: 'Cadena Posterior & Cardio',
          targetSeries: 4,
          targetReps: '20',
          restSeconds: 45,
          defaultWeight: '24 kg',
          image: '/images/facilities/cardio.JPG',
          notes: 'Bisagra de cadera explosiva sin flexionar los brazos.',
        },
      ],
    },
  ];

  // State Signals
  readonly activeRoutineId = signal<string>(this.loadActiveRoutineId());
  readonly personalRecords = signal<PersonalRecord[]>(this.loadStoredPRs());

  readonly activeRoutine = computed(() => {
    const id = this.activeRoutineId();
    return this.routines.find((r) => r.id === id) || this.routines[0];
  });

  constructor() {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private loadActiveRoutineId(): string {
    if (!this.isBrowser()) return 'push_hypertrophy';
    return localStorage.getItem(this.ACTIVE_ROUTINE_KEY) || 'push_hypertrophy';
  }

  private loadStoredPRs(): PersonalRecord[] {
    const defaults: PersonalRecord[] = [
      { id: 'pr_1', exercise: 'Press de Banca Plano', oneRepMax: 105, weightUsed: 95, reps: 3, date: '14 Feb 2026', notes: 'Con buena pausa en el pecho' },
      { id: 'pr_2', exercise: 'Sentadilla Trasera con Barra', oneRepMax: 145, weightUsed: 130, reps: 4, date: '18 Feb 2026', notes: 'Profundidad reglamentaria' },
      { id: 'pr_3', exercise: 'Peso Muerto Convencional', oneRepMax: 185, weightUsed: 170, reps: 3, date: '10 Feb 2026', notes: 'Agarre mixto con cinturón' },
      { id: 'pr_4', exercise: 'Press Militar de Pie', oneRepMax: 72, weightUsed: 65, reps: 4, date: '08 Feb 2026', notes: 'Bloqueo estricto arriba' },
      { id: 'pr_5', exercise: 'Dominadas Lastradas', oneRepMax: 42, weightUsed: 35, reps: 2, date: '05 Feb 2026', notes: 'Lastre en cinturón' },
    ];

    if (!this.isBrowser()) return defaults;
    try {
      const saved = localStorage.getItem(this.PRS_KEY);
      return saved ? JSON.parse(saved) : defaults;
    } catch {
      return defaults;
    }
  }

  setActiveRoutine(routineId: string): void {
    this.activeRoutineId.set(routineId);
    if (this.isBrowser()) {
      localStorage.setItem(this.ACTIVE_ROUTINE_KEY, routineId);
    }
  }

  /**
   * Calculates estimated 1RM using Brzycki formula: Weight / (1.0278 - 0.0278 * Reps)
   */
  calculateOneRepMax(weight: number, reps: number): number {
    if (reps <= 1) return weight;
    const oneRm = weight / (1.0278 - 0.0278 * reps);
    return Math.round(oneRm * 10) / 10;
  }

  addPersonalRecord(exercise: string, weightUsed: number, reps: number, notes?: string): PersonalRecord {
    const oneRepMax = this.calculateOneRepMax(weightUsed, reps);
    const newRecord: PersonalRecord = {
      id: 'PR-' + Date.now(),
      exercise,
      oneRepMax,
      weightUsed,
      reps,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      notes,
    };

    this.personalRecords.update((list) => {
      // Replace existing PR if it's the same exercise and higher, or append
      const existing = list.findIndex((p) => p.exercise.toLowerCase() === exercise.toLowerCase());
      if (existing >= 0) {
        const updated = [...list];
        updated[existing] = newRecord;
        return updated;
      }
      return [newRecord, ...list];
    });

    if (this.isBrowser()) {
      localStorage.setItem(this.PRS_KEY, JSON.stringify(this.personalRecords()));
    }

    // Award XP and check achievements
    this.gamification.addXp(120, `Nuevo Récord Personal en ${exercise}`);

    // Evaluate PR based achievements
    const benchPR = this.personalRecords().find((p) => p.exercise.includes('Banca'))?.oneRepMax || 0;
    const squatPR = this.personalRecords().find((p) => p.exercise.includes('Sentadilla'))?.oneRepMax || 0;
    const deadliftPR = this.personalRecords().find((p) => p.exercise.includes('Peso Muerto'))?.oneRepMax || 0;

    this.gamification.evaluateStats({ attendances: 1, streak: 1, workoutHours: 1 }, benchPR, squatPR, deadliftPR);

    return newRecord;
  }

  /**
   * Generates percentage breakdown table for a given 1RM
   */
  getPercentagesTable(oneRepMax: number): { percent: number; weight: number; repsEstimated: string }[] {
    const table = [
      { percent: 100, repsEstimated: '1 RM' },
      { percent: 95, repsEstimated: '2 RM' },
      { percent: 90, repsEstimated: '3-4 RM' },
      { percent: 85, repsEstimated: '5-6 RM' },
      { percent: 80, repsEstimated: '7-8 RM' },
      { percent: 75, repsEstimated: '9-10 RM' },
      { percent: 70, repsEstimated: '11-12 RM' },
      { percent: 65, repsEstimated: '15 RM' },
    ];

    return table.map((row) => ({
      percent: row.percent,
      weight: Math.round((oneRepMax * (row.percent / 100)) * 10) / 10,
      repsEstimated: row.repsEstimated,
    }));
  }
}
