import { Injectable, signal, computed, inject } from '@angular/core';
import { GamificationService } from './gamification.service';

export interface WarmupExercise {
  name: string;
  durationOrReps: string;
  notes: string;
  icon: string;
}

export interface CardioFinisher {
  machine: string;
  durationMinutes: number;
  protocol: string;
  estimatedCalories: number;
  tips: string;
}

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

export interface MuscleTargetGroup {
  name: string;
  seriesCount: number;
  color: string;
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
  muscleTargets: MuscleTargetGroup[];
  warmupMinutes: number;
  warmupExercises: WarmupExercise[];
  exercises: ExerciseItem[];
  cardioFinisher: CardioFinisher;
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

  // Catálogo completo de rutinas guiadas estilo Symmetry Pro con 3 fases
  readonly routines: WorkoutRoutine[] = [
    {
      id: 'leg_power',
      name: 'Pierna Completa: Fuerza & Hipertrofia 360°',
      tag: 'Cuádriceps · Isquios · Glúteos · Gemelos',
      focus: 'Desarrollo masivo de tren inferior con estímulo neuromuscular profundo',
      level: 'Avanzado',
      durationMinutes: 75,
      estimatedCalories: 640,
      icon: '🦵',
      muscleTargets: [
        { name: 'Cuádriceps', seriesCount: 9, color: '#ef4444' },
        { name: 'Glúteos & Cadera', seriesCount: 8, color: '#f59e0b' },
        { name: 'Isquiotibiales', seriesCount: 7, color: '#3b82f6' },
        { name: 'Gemelos / Sóleo', seriesCount: 4, color: '#10b981' },
      ],
      warmupMinutes: 10,
      warmupExercises: [
        {
          name: 'Movilidad de Tobillo & Rotación de Cadera 90/90',
          durationOrReps: '3 minutos',
          notes: 'Abrir rango de flexión dorsal de tobillo para máxima profundidad de sentadilla.',
          icon: '🔄',
        },
        {
          name: 'Sentadillas Profundas en Vacío (Air Squats)',
          durationOrReps: '2 series × 15 reps',
          notes: 'Pausa de 2 segundos en el punto más profundo para activar líquido sinovial.',
          icon: '🧘',
        },
        {
          name: 'Puente de Glúteos Isométrico + Caminatas de Monstruo',
          durationOrReps: '2 series × 12 reps',
          notes: 'Activación del glúteo medio y estabilizadores pélvicos antes de la carga pesada.',
          icon: '🔥',
        },
      ],
      exercises: [
        {
          id: 301,
          name: 'Sentadilla Libre con Barra Trasera',
          muscleGroup: 'Cuádriceps & Cadena Posterior',
          targetSeries: 5,
          targetReps: '6-8',
          restSeconds: 120,
          defaultWeight: '110 kg',
          image: '/images/facilities/pesas.webp',
          notes: 'Profundidad paralela o profunda, barra clavada en trapecios y mirada al frente.',
        },
        {
          id: 302,
          name: 'Prensa Inclinada 45° a Rango Completo',
          muscleGroup: 'Cuádriceps & Glúteos',
          targetSeries: 4,
          targetReps: '10-12',
          restSeconds: 90,
          defaultWeight: '220 kg',
          image: '/images/facilities/entrenamiento.webp',
          notes: 'Colocación media de pies, bajada en 3 segundos sin despegar la espalda baja.',
        },
        {
          id: 303,
          name: 'Hip Thrust Pesado con Barra & Cojín',
          muscleGroup: 'Glúteo Mayor',
          targetSeries: 4,
          targetReps: '8-10',
          restSeconds: 90,
          defaultWeight: '130 kg',
          image: '/images/facilities/ambiente.webp',
          notes: 'Bloqueo arriba de 2 segundos apretando glúteos al máximo en retroversión pélvica.',
        },
        {
          id: 304,
          name: 'Peso Muerto Rumano con Mancuernas',
          muscleGroup: 'Isquiotibiales & Glúteos',
          targetSeries: 4,
          targetReps: '10-12',
          restSeconds: 60,
          defaultWeight: '32 kg c/u',
          image: '/images/facilities/pesas.webp',
          notes: 'Lleva la cadera hacia atrás sintiendo el estiramiento máximo en isquios.',
        },
        {
          id: 305,
          name: 'Curl Femoral Tumbado en Máquina',
          muscleGroup: 'Isquiotibiales',
          targetSeries: 3,
          targetReps: '12-15',
          restSeconds: 45,
          defaultWeight: '45 kg',
          image: '/images/facilities/cardio-zone.webp',
          notes: 'Mantén la pelvis pegada al banco en todo el recorrido.',
        },
        {
          id: 306,
          name: 'Elevación de Talones de Pie en Máquina Smith',
          muscleGroup: 'Gemelos',
          targetSeries: 4,
          targetReps: '15-20',
          restSeconds: 45,
          defaultWeight: '75 kg',
          image: '/images/facilities/pesas.webp',
          notes: 'Pausa de 2 segundos en contracción máxima arriba y 2s estirando abajo.',
        },
      ],
      cardioFinisher: {
        machine: 'Caminadora Inclinada o Escaladora StairMaster en ROCA GYM',
        durationMinutes: 15,
        protocol: 'Inclinación 12% · Velocidad 4.8 a 5.2 km/h',
        estimatedCalories: 130,
        tips: 'Cardio LISS de baja intensidad para drenar ácido láctico acumulado y maximizar el flujo sanguíneo de recuperación.',
      },
    },
    {
      id: 'push_hypertrophy',
      name: 'Push Day: Pecho Titán, Hombro 3D & Tríceps',
      tag: 'Pectorales · Deltoides · Tríceps',
      focus: 'Apertura de caja torácica, densidad de clavícula y herradura de tríceps',
      level: 'Intermedio',
      durationMinutes: 65,
      estimatedCalories: 520,
      icon: '💥',
      muscleTargets: [
        { name: 'Pectoral Mayor', seriesCount: 8, color: '#ef4444' },
        { name: 'Pectoral Superior', seriesCount: 4, color: '#f59e0b' },
        { name: 'Deltoides Lateral & Anterior', seriesCount: 6, color: '#3b82f6' },
        { name: 'Tríceps Braquial', seriesCount: 7, color: '#10b981' },
      ],
      warmupMinutes: 8,
      warmupExercises: [
        {
          name: 'Dislocaciones de Hombro con Banda Elástica o Pica',
          durationOrReps: '2 series × 15 reps',
          notes: 'Lubricación del manguito rotador y escápulas.',
          icon: '🔄',
        },
        {
          name: 'Face Pulls Ligeros en Polea Alta',
          durationOrReps: '2 series × 20 reps',
          notes: 'Activación del deltoides posterior para estabilizar el press de banca.',
          icon: '🎯',
        },
        {
          name: 'Flexiones de Pecho (Push-Ups) con Pausa',
          durationOrReps: '2 series × 10 reps',
          notes: 'Despertar la conexión neuromuscular del pectoral.',
          icon: '💪',
        },
      ],
      exercises: [
        {
          id: 101,
          name: 'Press de Banca Plano con Barra Olímpica',
          muscleGroup: 'Pectoral Medio & General',
          targetSeries: 4,
          targetReps: '6-8',
          restSeconds: 90,
          defaultWeight: '85 kg',
          image: '/images/facilities/pesas.webp',
          notes: 'Retracción escapular, arco lumbar fisiológico y barra tocando el esternón.',
        },
        {
          id: 102,
          name: 'Press Inclinado con Mancuernas a 30°',
          muscleGroup: 'Pectoral Superior (Haz Clavicular)',
          targetSeries: 4,
          targetReps: '8-10',
          restSeconds: 60,
          defaultWeight: '28 kg c/u',
          image: '/images/facilities/entrenamiento.webp',
          notes: 'Baja sintiendo el estiramiento profundo del pectoral superior.',
        },
        {
          id: 103,
          name: 'Press Militar de Pie con Barra Olímpica',
          muscleGroup: 'Deltoides Anterior & Core',
          targetSeries: 4,
          targetReps: '8-10',
          restSeconds: 75,
          defaultWeight: '55 kg',
          image: '/images/facilities/pesas.webp',
          notes: 'Glúteos y abdomen apretados, bloquea la barra sobre la coronilla.',
        },
        {
          id: 104,
          name: 'Elevaciones Laterales Pesadas con Mancuerna',
          muscleGroup: 'Deltoides Lateral (Anchura de Hombros)',
          targetSeries: 4,
          targetReps: '12-15',
          restSeconds: 45,
          defaultWeight: '14 kg c/u',
          image: '/images/facilities/ambiente.webp',
          notes: 'Codos ligeramente guiando el movimiento, sin balanceo de cadera.',
        },
        {
          id: 105,
          name: 'Fondos en Paralelas Lastrados o Libres',
          muscleGroup: 'Tríceps & Pectoral Inferior',
          targetSeries: 3,
          targetReps: '10-12',
          restSeconds: 60,
          defaultWeight: 'Peso Corporal +10kg',
          image: '/images/facilities/entrenamiento.webp',
          notes: 'Torso inclinado 15° hacia adelante para proteger los hombros.',
        },
        {
          id: 106,
          name: 'Extensión de Tríceps en Polea con Cuerda',
          muscleGroup: 'Tríceps (Cabeza Lateral)',
          targetSeries: 4,
          targetReps: '12-15',
          restSeconds: 45,
          defaultWeight: '35 kg',
          image: '/images/facilities/cardio-zone.webp',
          notes: 'Abre la cuerda al final de la extensión bloqueando el tríceps.',
        },
      ],
      cardioFinisher: {
        machine: 'Air Bike Assault o Elíptica en ROCA GYM',
        durationMinutes: 12,
        protocol: 'Intervalos HIIT: 30s explosivos / 30s suaves',
        estimatedCalories: 140,
        tips: 'Acelera el metabolismo y eleva el VO2 Máximo para quemar grasa residual.',
      },
    },
    {
      id: 'pull_density',
      name: 'Pull Day: Espalda en V, Bíceps & Trapecio',
      tag: 'Dorsales · Romboides · Bíceps · Antebrazo',
      focus: 'Amplitud de alas, densidad de espalda media y pico de bíceps',
      level: 'Avanzado',
      durationMinutes: 70,
      estimatedCalories: 560,
      icon: '🦍',
      muscleTargets: [
        { name: 'Dorsal Ancho (Amplitud)', seriesCount: 8, color: '#3b82f6' },
        { name: 'Espalda Media & Romboides', seriesCount: 7, color: '#ef4444' },
        { name: 'Bíceps (Braquial & Corto)', seriesCount: 7, color: '#10b981' },
        { name: 'Deltoides Posterior & Trapecio', seriesCount: 5, color: '#f59e0b' },
      ],
      warmupMinutes: 8,
      warmupExercises: [
        {
          name: 'Colgadas Pasivas y Activas en Barra (Dead Hangs)',
          durationOrReps: '3 rondas × 30 segundos',
          notes: 'Descompresión de columna lumbar y activación escapular.',
          icon: '🧗',
        },
        {
          name: 'Pullover Ligero en Polea Alta con Brazos Rectos',
          durationOrReps: '2 series × 15 reps',
          notes: 'Aislar y conectar la mente con los dorsales anchos.',
          icon: '⚡',
        },
      ],
      exercises: [
        {
          id: 201,
          name: 'Peso Muerto Convencional desde el Suelo',
          muscleGroup: 'Cadena Posterior & Espalda',
          targetSeries: 4,
          targetReps: '5-7',
          restSeconds: 120,
          defaultWeight: '140 kg',
          image: '/images/facilities/pesas.webp',
          notes: 'Cinturón ajustado, empuje de piernas contra el suelo y bloqueo firme arriba.',
        },
        {
          id: 202,
          name: 'Dominadas Pronas con Agarre Ancho',
          muscleGroup: 'Dorsal Ancho (Alas)',
          targetSeries: 4,
          targetReps: '8-10',
          restSeconds: 90,
          defaultWeight: '+5 kg / Corporal',
          image: '/images/facilities/entrenamiento.webp',
          notes: 'Desde bloqueo articular abajo hasta mentón sobre la barra.',
        },
        {
          id: 203,
          name: 'Remo con Barra T o Pendlay a 45°',
          muscleGroup: 'Espalda Media & Trapecio',
          targetSeries: 4,
          targetReps: '8-10',
          restSeconds: 75,
          defaultWeight: '75 kg',
          image: '/images/facilities/ambiente.webp',
          notes: 'Aprieta las escápulas durante 1 segundo completo en contracción.',
        },
        {
          id: 204,
          name: 'Remo Unilateral con Mancuerna Pesada (Kroc Row)',
          muscleGroup: 'Dorsal Inferior',
          targetSeries: 3,
          targetReps: '10-12',
          restSeconds: 60,
          defaultWeight: '38 kg',
          image: '/images/facilities/pesas.webp',
          notes: 'Lleva el codo hacia el bolsillo del pantalón.',
        },
        {
          id: 205,
          name: 'Curl de Bíceps con Barra Z en Banco Scott',
          muscleGroup: 'Bíceps Braquial',
          targetSeries: 4,
          targetReps: '10-12',
          restSeconds: 45,
          defaultWeight: '34 kg',
          image: '/images/facilities/entrenamiento.webp',
          notes: 'Aislamiento estricto sin levantar los codos del soporte.',
        },
        {
          id: 206,
          name: 'Curl Martillo Cruzado con Mancuerna',
          muscleGroup: 'Braquial & Antebrazo',
          targetSeries: 3,
          targetReps: '12-15',
          restSeconds: 45,
          defaultWeight: '16 kg c/u',
          image: '/images/facilities/pesas.webp',
          notes: 'Engrosa la masa del brazo y potencia el agarre de fuerza.',
        },
      ],
      cardioFinisher: {
        machine: 'Remadora Concept2 en ROCA GYM',
        durationMinutes: 12,
        protocol: 'Remo a ritmo constante (2:05 min/500m split)',
        estimatedCalories: 135,
        tips: 'Estimula la resistencia cardiovascular complementando el tirón de espalda.',
      },
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
    if (!this.isBrowser()) return 'leg_power';
    return localStorage.getItem(this.ACTIVE_ROUTINE_KEY) || 'leg_power';
  }

  private loadStoredPRs(): PersonalRecord[] {
    const defaults: PersonalRecord[] = [
      { id: 'pr_1', exercise: 'Press de Banca Plano', oneRepMax: 105, weightUsed: 95, reps: 3, date: '14 Feb 2026', notes: 'Con buena pausa en el pecho' },
      { id: 'pr_2', exercise: 'Sentadilla Trasera con Barra', oneRepMax: 145, weightUsed: 130, reps: 4, date: '18 Feb 2026', notes: 'Profundidad reglamentaria' },
      { id: 'pr_3', exercise: 'Peso Muerto Convencional', oneRepMax: 185, weightUsed: 170, reps: 3, date: '10 Feb 2026', notes: 'Agarre mixto con cinturón' },
      { id: 'pr_4', exercise: 'Press Militar de Pie', oneRepMax: 72, weightUsed: 65, reps: 4, date: '08 Feb 2026', notes: 'Bloqueo estricto arriba' },
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

    this.gamification.addXp(120, `Nuevo Récord Personal en ${exercise}`);
    return newRecord;
  }

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
