import { Injectable, signal, computed } from '@angular/core';

export interface UserStats {
  attendances: number;
  calories: number;
  workoutHours: number;
  streak: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  role: string;
  plan: string;
  activeSince: string;
  stats: UserStats;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly STORAGE_KEY = 'roca_gym_user_session';
  private readonly USERS_DB_KEY = 'roca_gym_users_db';

  private readonly defaultStats: UserStats = {
    attendances: 18,
    calories: 14850,
    workoutHours: 24.5,
    streak: 4,
  };

  private readonly defaultTestUser: UserProfile = {
    name: 'Julián Roca',
    email: 'admin@rocagym.com',
    role: 'Miembro VIP',
    plan: 'Plan Anual Premium',
    activeSince: 'Enero 2026',
    stats: { ...this.defaultStats },
  };

  private readonly currentUserSignal = signal<UserProfile | null>(this.loadStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);

  constructor() {
    this.initUserDb();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private loadStoredUser(): UserProfile | null {
    if (!this.isBrowser()) return null;
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  private saveUserSession(user: UserProfile | null): void {
    if (!this.isBrowser()) return;
    try {
      if (user) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error saving user session', e);
    }
  }

  private initUserDb(): void {
    if (!this.isBrowser()) return;
    try {
      const db = localStorage.getItem(this.USERS_DB_KEY);
      if (!db) {
        const initialUsers = [
          {
            ...this.defaultTestUser,
            password: '12345678',
          },
        ];
        localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(initialUsers));
      }
    } catch (e) {
      console.error('Error initializing user db', e);
    }
  }

  login(email: string, password: string): boolean {
    if (email === 'admin@rocagym.com' && password === '12345678') {
      this.currentUserSignal.set(this.defaultTestUser);
      this.saveUserSession(this.defaultTestUser);
      return true;
    }

    if (this.isBrowser()) {
      try {
        const dbStr = localStorage.getItem(this.USERS_DB_KEY);
        if (dbStr) {
          const users: Array<UserProfile & { password?: string }> = JSON.parse(dbStr);
          const found = users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
          );
          if (found) {
            const { password: _, ...cleanProfile } = found;
            const profile: UserProfile = {
              ...cleanProfile,
              stats: cleanProfile.stats || { ...this.defaultStats },
            };
            this.currentUserSignal.set(profile);
            this.saveUserSession(profile);
            return true;
          }
        }
      } catch (e) {
        console.error('Login error', e);
      }
    }

    return false;
  }

  register(data: { name: string; email: string; phone?: string; password: string; plan: string }): boolean {
    const newProfile: UserProfile = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.plan.includes('VIP') ? 'Miembro VIP' : 'Miembro Activo',
      plan: data.plan,
      activeSince: 'Hoy',
      stats: {
        attendances: 1,
        calories: 450,
        workoutHours: 1.0,
        streak: 1,
      },
    };

    if (this.isBrowser()) {
      try {
        const dbStr = localStorage.getItem(this.USERS_DB_KEY);
        const users = dbStr ? JSON.parse(dbStr) : [];
        users.push({ ...newProfile, password: data.password });
        localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(users));
      } catch (e) {
        console.error('Register db save error', e);
      }
    }

    this.currentUserSignal.set(newProfile);
    this.saveUserSession(newProfile);
    return true;
  }

  recordWorkout(caloriesBurned: number, durationMinutes: number): void {
    const current = this.currentUserSignal();
    if (!current) return;

    const hoursAdded = parseFloat((durationMinutes / 60).toFixed(1));
    const updatedStats: UserStats = {
      attendances: current.stats.attendances + 1,
      calories: current.stats.calories + caloriesBurned,
      workoutHours: parseFloat((current.stats.workoutHours + hoursAdded).toFixed(1)),
      streak: current.stats.streak + 1,
    };

    const updatedUser: UserProfile = {
      ...current,
      stats: updatedStats,
    };

    this.currentUserSignal.set(updatedUser);
    this.saveUserSession(updatedUser);
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.saveUserSession(null);
  }
}