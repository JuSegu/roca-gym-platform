import { Injectable, signal, computed, inject } from '@angular/core';
import { AudioPlayerService } from './audio-player.service';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Rutinas' | 'Fuerza' | 'Constancia' | 'Comunidad';
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  progress: number;
  maxProgress: number;
}

export interface LeaderboardMember {
  rank: number;
  name: string;
  avatar: string;
  plan: string;
  league: string;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

export interface LeagueInfo {
  name: string;
  icon: string;
  color: string;
  minXp: number;
  maxXp: number;
  badge: string;
}

@Injectable({
  providedIn: 'root',
})
export class GamificationService {
  private readonly audio = inject(AudioPlayerService);
  private readonly GAMIFICATION_KEY = 'roca_gym_gamification_data';

  // Available Leagues
  readonly leagues: LeagueInfo[] = [
    { name: 'Liga Bronce', icon: '🥉', color: 'text-amber-600 border-amber-600/30 bg-amber-950/20', minXp: 0, maxXp: 499, badge: 'Iniciado' },
    { name: 'Liga Plata', icon: '🥈', color: 'text-slate-300 border-slate-400/30 bg-slate-800/30', minXp: 500, maxXp: 1499, badge: 'Guerrero' },
    { name: 'Liga Oro', icon: '🥇', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-950/30', minXp: 1500, maxXp: 3499, badge: 'Titán' },
    { name: 'Liga Diamante', icon: '💎', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30', minXp: 3500, maxXp: 6999, badge: 'Élite' },
    { name: 'Leyenda ROCA', icon: '👑', color: 'text-red-500 border-red-500/40 bg-red-950/40', minXp: 7000, maxXp: 99999, badge: 'Inmortal' },
  ];

  // Default badges list
  private readonly initialBadges: Badge[] = [
    {
      id: 'first_workout',
      title: 'Primer Paso de Hierro',
      description: 'Completa tu primera sesión de entrenamiento en la plataforma.',
      icon: '🏋️‍♂️',
      category: 'Rutinas',
      unlocked: false,
      xpReward: 100,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: 'streak_3',
      title: 'Chispa de Fuego',
      description: 'Mantén una racha de entrenamiento de al menos 3 días consecutivos.',
      icon: '🔥',
      category: 'Constancia',
      unlocked: false,
      xpReward: 150,
      progress: 0,
      maxProgress: 3,
    },
    {
      id: 'streak_7',
      title: 'Disciplina Espartana',
      description: 'Alcanza una racha legendaria de 7 días seguidos de entrenamiento.',
      icon: '⚡',
      category: 'Constancia',
      unlocked: false,
      xpReward: 300,
      progress: 0,
      maxProgress: 7,
    },
    {
      id: 'bench_100',
      title: 'Titán del Press',
      description: 'Registra un récord de 1RM de 100 kg o más en Press de Banca.',
      icon: '🦍',
      category: 'Fuerza',
      unlocked: false,
      xpReward: 250,
      progress: 0,
      maxProgress: 100,
    },
    {
      id: 'squat_140',
      title: 'Columnas de Roca',
      description: 'Registra un récord de 1RM de 140 kg o más en Sentadilla.',
      icon: '🦵',
      category: 'Fuerza',
      unlocked: false,
      xpReward: 250,
      progress: 0,
      maxProgress: 140,
    },
    {
      id: 'deadlift_180',
      title: 'Levantador Olímpico',
      description: 'Registra un récord de 1RM de 180 kg o más en Peso Muerto.',
      icon: '🔱',
      category: 'Fuerza',
      unlocked: false,
      xpReward: 350,
      progress: 0,
      maxProgress: 180,
    },
    {
      id: 'hours_10',
      title: 'Guerrero Incansable',
      description: 'Acumula más de 10 horas totales de entrenamiento en sala.',
      icon: '⏱️',
      category: 'Rutinas',
      unlocked: false,
      xpReward: 200,
      progress: 0,
      maxProgress: 10,
    },
    {
      id: 'vip_supplements',
      title: 'Nutrición de Élite',
      description: 'Realiza tu primer pedido de suplementos o accesorios en la tienda oficial.',
      icon: '🥤',
      category: 'Comunidad',
      unlocked: false,
      xpReward: 120,
      progress: 0,
      maxProgress: 1,
    },
  ];

  // State Signals
  readonly userXp = signal<number>(this.loadStoredXp());
  readonly badges = signal<Badge[]>(this.loadStoredBadges());
  readonly recentUnlockedBadge = signal<Badge | null>(null);

  // Computations
  readonly currentLeague = computed(() => {
    const xp = this.userXp();
    return this.leagues.find((l) => xp >= l.minXp && xp <= l.maxXp) || this.leagues[0];
  });

  readonly nextLeague = computed(() => {
    const xp = this.userXp();
    const idx = this.leagues.findIndex((l) => xp >= l.minXp && xp <= l.maxXp);
    return idx < this.leagues.length - 1 ? this.leagues[idx + 1] : null;
  });

  readonly leagueProgressPercent = computed(() => {
    const current = this.currentLeague();
    const next = this.nextLeague();
    if (!next) return 100;
    const range = next.minXp - current.minXp;
    const progress = this.userXp() - current.minXp;
    return Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
  });

  readonly unlockedCount = computed(() => this.badges().filter((b) => b.unlocked).length);

  // Leaderboard ranking calculation
  readonly leaderboard = computed<LeaderboardMember[]>(() => {
    const xp = this.userXp();
    const baseAthletes = [
      { name: 'Camilo "La Bestia" Vargas', avatar: '🦁', plan: 'Plan Anual VIP', league: 'Leyenda ROCA', xp: 8450, streak: 28 },
      { name: 'Valentina Restrepo', avatar: '⚡', plan: 'Plan Anual VIP', league: 'Liga Diamante', xp: 5200, streak: 15 },
      { name: 'Mateo González', avatar: '🐺', plan: 'Plan Trimestral Pro', league: 'Liga Diamante', xp: 3900, streak: 12 },
      { name: 'Sara Morales', avatar: '🦅', plan: 'Plan Mensual', league: 'Liga Oro', xp: 2800, streak: 8 },
      { name: 'Daniel Rincón', avatar: '🔥', plan: 'Plan Trimestral Pro', league: 'Liga Oro', xp: 2100, streak: 6 },
      { name: 'Andrea Castro', avatar: '💪', plan: 'Plan Mensual', league: 'Liga Plata', xp: 1200, streak: 4 },
      { name: 'Santiago Mejía', avatar: '🥊', plan: 'Plan Mensual', league: 'Liga Bronce', xp: 350, streak: 2 },
    ];

    // Combine current user with base athletes
    const all = [
      ...baseAthletes,
      {
        name: 'Tú (Atleta ROCA)',
        avatar: '👑',
        plan: 'Plan Activo',
        league: this.currentLeague().name,
        xp: xp,
        streak: Math.max(1, Math.floor(xp / 100)),
        isCurrentUser: true,
      },
    ];

    // Sort descending by XP
    all.sort((a, b) => b.xp - a.xp);

    return all.map((member, index) => ({
      rank: index + 1,
      ...member,
    }));
  });

  constructor() {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private loadStoredXp(): number {
    if (!this.isBrowser()) return 240;
    try {
      const saved = localStorage.getItem(this.GAMIFICATION_KEY + '_xp');
      return saved ? parseInt(saved, 10) : 240;
    } catch {
      return 240;
    }
  }

  private loadStoredBadges(): Badge[] {
    if (!this.isBrowser()) return this.initialBadges;
    try {
      const saved = localStorage.getItem(this.GAMIFICATION_KEY + '_badges');
      return saved ? JSON.parse(saved) : this.initialBadges;
    } catch {
      return this.initialBadges;
    }
  }

  private saveState(): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(this.GAMIFICATION_KEY + '_xp', this.userXp().toString());
      localStorage.setItem(this.GAMIFICATION_KEY + '_badges', JSON.stringify(this.badges()));
    } catch (e) {
      console.error('Error saving gamification state', e);
    }
  }

  addXp(amount: number, reason: string): void {
    const oldLeague = this.currentLeague();
    this.userXp.update((current) => current + amount);
    this.saveState();

    const newLeague = this.currentLeague();
    if (newLeague.name !== oldLeague.name) {
      this.audio.playLevelUpSound();
    }
  }

  unlockBadge(badgeId: string): void {
    const badge = this.badges().find((b) => b.id === badgeId);
    if (!badge || badge.unlocked) return;

    this.badges.update((list) =>
      list.map((b) =>
        b.id === badgeId
          ? {
              ...b,
              unlocked: true,
              progress: b.maxProgress,
              unlockedAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
            }
          : b
      )
    );

    this.addXp(badge.xpReward, `Logro Desbloqueado: ${badge.title}`);
    this.saveState();

    // Trigger Victory SFX and Notification
    this.audio.playVictorySound();
    this.recentUnlockedBadge.set(badge);
    setTimeout(() => {
      if (this.recentUnlockedBadge()?.id === badgeId) {
        this.recentUnlockedBadge.set(null);
      }
    }, 4500);
  }

  evaluateStats(stats: { attendances: number; streak: number; workoutHours: number }, maxBench = 0, maxSquat = 0, maxDeadlift = 0): void {
    if (stats.attendances >= 1) this.unlockBadge('first_workout');
    if (stats.streak >= 3) this.unlockBadge('streak_3');
    if (stats.streak >= 7) this.unlockBadge('streak_7');
    if (stats.workoutHours >= 10) this.unlockBadge('hours_10');
    if (maxBench >= 100) this.unlockBadge('bench_100');
    if (maxSquat >= 140) this.unlockBadge('squat_140');
    if (maxDeadlift >= 180) this.unlockBadge('deadlift_180');
  }
}
