import { Injectable, inject, signal, computed } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  icon: string;
}

export interface StoreOrder {
  id: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  date: string;
  status: 'Pendiente en recepción' | 'Entregado' | 'Cancelado';
  pickupCode: string;
}

export interface AttendanceRecord {
  id: string;
  userEmail: string;
  userName: string;
  userPlan: string;
  timestamp: string;
  status: 'Concedido' | 'Denegado';
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  // This keeps the demo working today and is the single switch for Firestore migration.
  readonly firebase = inject(FirebaseService);
  private readonly ORDERS_KEY = 'roca_gym_orders_db';
  private readonly ATTENDANCES_KEY = 'roca_gym_attendances_db';
  private readonly GYM_CAPACITY_KEY = 'roca_gym_current_capacity';

  // Configuración de Firebase preparada para cuando se ingresen las API Keys de producción
  readonly firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "roca-gym-platform.firebaseapp.com",
    projectId: "roca-gym-platform",
    storageBucket: "roca-gym-platform.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
  };

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Signals reactivos para almacenamiento en vivo
  private readonly ordersSignal = signal<StoreOrder[]>(this.loadOrders());
  readonly orders = this.ordersSignal.asReadonly();

  private readonly attendancesSignal = signal<AttendanceRecord[]>(this.loadAttendances());
  readonly attendances = this.attendancesSignal.asReadonly();

  // Aforo actual del gimnasio
  private readonly currentCapacitySignal = signal<number>(this.loadCapacity());
  readonly currentCapacity = this.currentCapacitySignal.asReadonly();
  readonly maxCapacity = 80;

  constructor() {}

  private loadOrders(): StoreOrder[] {
    if (!this.isBrowser()) return this.getDefaultOrders();
    try {
      const saved = localStorage.getItem(this.ORDERS_KEY);
      return saved ? JSON.parse(saved) : this.getDefaultOrders();
    } catch {
      return this.getDefaultOrders();
    }
  }

  private loadAttendances(): AttendanceRecord[] {
    if (!this.isBrowser()) return this.getDefaultAttendances();
    try {
      const saved = localStorage.getItem(this.ATTENDANCES_KEY);
      return saved ? JSON.parse(saved) : this.getDefaultAttendances();
    } catch {
      return this.getDefaultAttendances();
    }
  }

  private loadCapacity(): number {
    if (!this.isBrowser()) return 42;
    try {
      const saved = localStorage.getItem(this.GYM_CAPACITY_KEY);
      return saved ? parseInt(saved, 10) : 42;
    } catch {
      return 42;
    }
  }

  private saveOrders(orders: StoreOrder[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders', e);
    }
  }

  private saveAttendances(attendances: AttendanceRecord[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(this.ATTENDANCES_KEY, JSON.stringify(attendances));
    } catch (e) {
      console.error('Error saving attendances', e);
    }
  }

  private saveCapacity(cap: number): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(this.GYM_CAPACITY_KEY, cap.toString());
    } catch (e) {
      console.error('Error saving capacity', e);
    }
  }

  createOrder(orderData: Omit<StoreOrder, 'id' | 'date' | 'status' | 'pickupCode'>): StoreOrder {
    const randomId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const pickupCode = 'REC-' + Math.floor(100 + Math.random() * 900);
    const newOrder: StoreOrder = {
      ...orderData,
      id: randomId,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Pendiente en recepción',
      pickupCode,
    };

    this.ordersSignal.update((current) => [newOrder, ...current]);
    this.saveOrders(this.ordersSignal());
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: 'Pendiente en recepción' | 'Entregado' | 'Cancelado'): void {
    this.ordersSignal.update((current) =>
      current.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    this.saveOrders(this.ordersSignal());
  }

  recordAttendance(email: string, name: string, plan: string, status: 'Concedido' | 'Denegado' = 'Concedido'): AttendanceRecord {
    const record: AttendanceRecord = {
      id: 'ATT-' + Date.now(),
      userEmail: email,
      userName: name,
      userPlan: plan,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      status,
    };

    this.attendancesSignal.update((current) => [record, ...current]);
    this.saveAttendances(this.attendancesSignal());

    if (status === 'Concedido') {
      this.currentCapacitySignal.update((c) => Math.min(c + 1, this.maxCapacity));
      this.saveCapacity(this.currentCapacitySignal());
    }

    return record;
  }

  private getDefaultOrders(): StoreOrder[] {
    return [
      {
        id: 'ORD-9842',
        userEmail: 'admin@rocagym.com',
        userName: 'Julián Roca',
        items: [
          { id: 1, name: 'Proteína Whey Isolate', price: 55, quantity: 1, icon: '🥤' },
          { id: 2, name: 'Creatina Monohidratada 500g', price: 35, quantity: 1, icon: '⚡' },
        ],
        subtotal: 90,
        discount: 13.5,
        total: 76.5,
        date: 'Hoy, 10:30 AM',
        status: 'Pendiente en recepción',
        pickupCode: 'REC-884',
      },
    ];
  }

  private getDefaultAttendances(): AttendanceRecord[] {
    return [
      {
        id: 'ATT-101',
        userEmail: 'admin@rocagym.com',
        userName: 'Julián Roca',
        userPlan: 'Plan Anual Premium',
        timestamp: '07:15 AM',
        status: 'Concedido',
      },
      {
        id: 'ATT-102',
        userEmail: 'maria@email.com',
        userName: 'María López',
        userPlan: 'Plan Trimestral Pro',
        timestamp: '08:00 AM',
        status: 'Concedido',
      },
    ];
  }
}
