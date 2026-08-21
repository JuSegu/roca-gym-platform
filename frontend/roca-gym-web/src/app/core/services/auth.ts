import { Injectable, computed, inject, signal } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FirebaseService } from '../firebase/firebase.service';

export interface UserStats {
  attendances: number;
  calories: number;
  workoutHours: number;
  streak: number;
}

export interface UserProfile {
  uid?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  plan: string;
  activeSince: string;
  qrCode?: string;
  stats: UserStats;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly firebase = inject(FirebaseService);
  private readonly STORAGE_KEY = 'roca_gym_user_session';
  private readonly USERS_DB_KEY = 'roca_gym_users_db';

  private readonly initialEmptyStats: UserStats = {
    attendances: 0,
    calories: 0,
    workoutHours: 0,
    streak: 0,
  };

  private readonly defaultTestUser: UserProfile = {
    name: 'Julián Roca',
    email: 'admin@rocagym.com',
    role: 'Administrador',
    plan: 'Plan Anual',
    activeSince: 'Hoy',
    qrCode: 'RG-8829-4921',
    stats: { ...this.initialEmptyStats },
  };

  private readonly currentUserSignal = signal<UserProfile | null>(this.loadStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);

  constructor() {
    if (this.firebase.auth) {
      onAuthStateChanged(this.firebase.auth, async (firebaseUser) => {
        if (!firebaseUser) {
          this.currentUserSignal.set(null);
          return;
        }
        const profile = await this.loadFirebaseProfile(firebaseUser.uid, firebaseUser.email ?? '');
        this.currentUserSignal.set(profile);
        this.saveUserSession(profile);
      });
    } else {
      this.initUserDb();
    }
  }

  private generateUserQr(name: string): string {
    const hash = Math.floor(1000 + Math.random() * 9000);
    const hash2 = Math.floor(1000 + Math.random() * 9000);
    return `RG-${hash}-${hash2}`;
  }

  private async loadFirebaseProfile(uid: string, email: string): Promise<UserProfile> {
    if (this.firebase.firestore) {
      try {
        const snapshot = await getDoc(doc(this.firebase.firestore, 'users', uid));
        if (snapshot.exists()) {
          const data = snapshot.data() as UserProfile;
          return {
            ...data,
            stats: data.stats || { ...this.initialEmptyStats },
            qrCode: data.qrCode || this.generateUserQr(data.name || email),
          };
        }
      } catch (error) {
        console.warn('Firebase profile could not be loaded', error);
      }
    }

    const isInitialAdmin = email.toLowerCase() === 'admin@rocagym.com';
    return {
      uid,
      name: email.split('@')[0] || 'Miembro ROCA',
      email,
      role: isInitialAdmin ? 'Administrador' : 'Miembro Activo',
      plan: isInitialAdmin ? 'Plan Anual' : 'Plan Mensual',
      activeSince: 'Hoy',
      qrCode: isInitialAdmin ? 'RG-8829-4921' : this.generateUserQr(email),
      stats: { ...this.initialEmptyStats },
    };
  }

  async loginWithFirebase(email: string, password: string): Promise<void> {
    if (!this.firebase.auth) throw new Error('Firebase no está disponible en este navegador.');
    const credential = await signInWithEmailAndPassword(this.firebase.auth, email, password);
    const profile = await this.loadFirebaseProfile(credential.user.uid, credential.user.email ?? email);
    this.currentUserSignal.set(profile);
    this.saveUserSession(profile);
  }

  async registerWithFirebase(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    plan: string;
  }): Promise<void> {
    if (!this.firebase.auth) throw new Error('Firebase no está disponible en este navegador.');
    const credential = await createUserWithEmailAndPassword(this.firebase.auth, data.email, data.password);
    const isInitialAdmin = data.email.toLowerCase() === 'admin@rocagym.com';
    const profile: UserProfile = {
      uid: credential.user.uid,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: isInitialAdmin ? 'Administrador' : 'Miembro Activo',
      plan: isInitialAdmin ? 'Plan Anual' : data.plan,
      activeSince: 'Hoy',
      qrCode: isInitialAdmin ? 'RG-8829-4921' : this.generateUserQr(data.name),
      stats: { ...this.initialEmptyStats },
    };

    if (this.firebase.firestore) {
      await setDoc(doc(this.firebase.firestore, 'users', credential.user.uid), profile);
    }
    this.currentUserSignal.set(profile);
    this.saveUserSession(profile);
  }

  async requestPasswordReset(email: string): Promise<void> {
    if (!this.firebase.auth) throw new Error('Firebase no está disponible en este navegador.');
    await sendPasswordResetEmail(this.firebase.auth, email);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private loadStoredUser(): UserProfile | null {
    if (!this.isBrowser()) return null;
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as UserProfile;
        // Garantizar que las estadísticas sean las reales y no valores ficticios residuales
        return {
          ...parsed,
          qrCode: parsed.qrCode || (parsed.email === 'admin@rocagym.com' ? 'RG-8829-4921' : this.generateUserQr(parsed.name)),
          stats: parsed.stats || { ...this.initialEmptyStats },
        };
      }
      return null;
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
              qrCode: cleanProfile.qrCode || this.generateUserQr(cleanProfile.name),
              stats: cleanProfile.stats || { ...this.initialEmptyStats },
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
    const isInitialAdmin = data.email.toLowerCase() === 'admin@rocagym.com';
    const newProfile: UserProfile = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: isInitialAdmin ? 'Administrador' : 'Miembro Activo',
      plan: isInitialAdmin ? 'Plan Anual' : data.plan,
      activeSince: 'Hoy',
      qrCode: isInitialAdmin ? 'RG-8829-4921' : this.generateUserQr(data.name),
      stats: { ...this.initialEmptyStats },
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

    const currentStats = current.stats || { ...this.initialEmptyStats };
    const hoursAdded = parseFloat((durationMinutes / 60).toFixed(1));
    const updatedStats: UserStats = {
      attendances: currentStats.attendances + 1,
      calories: currentStats.calories + caloriesBurned,
      workoutHours: parseFloat((currentStats.workoutHours + hoursAdded).toFixed(1)),
      streak: currentStats.streak + 1,
    };

    const updatedUser: UserProfile = {
      ...current,
      stats: updatedStats,
    };

    this.currentUserSignal.set(updatedUser);
    this.saveUserSession(updatedUser);

    // Si está conectado a Firebase Firestore, guardar también en la nube
    if (this.firebase.firestore && current.uid) {
      void setDoc(doc(this.firebase.firestore, 'users', current.uid), updatedUser, { merge: true });
    }
  }

  logout(): void {
    if (this.firebase.auth) {
      void signOut(this.firebase.auth);
    }
    this.currentUserSignal.set(null);
    this.saveUserSession(null);
  }
}
