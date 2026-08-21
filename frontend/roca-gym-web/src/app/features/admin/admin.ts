import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatabaseService, StoreOrder, AttendanceRecord } from '../../core/services/database';

interface GymMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: 'Al día' | 'Pendiente' | 'Inactivo';
  lastAccess: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  readonly db = inject(DatabaseService);

  // Pestaña activa en el panel admin
  activeTab = signal<'qr' | 'members' | 'orders' | 'metrics'>('qr');

  // Input de búsqueda para Escáner QR
  qrInput = signal('RG-8829-4921');
  scanResult = signal<{
    success: boolean;
    name: string;
    email: string;
    plan: string;
    status: string;
    message: string;
  } | null>(null);

  // Búsqueda de miembros
  searchQuery = signal('');

  // Base de miembros activos del gimnasio
  members = signal<GymMember[]>([
    {
      id: 'RG-8829-4921',
      name: 'Julián Roca',
      email: 'admin@rocagym.com',
      phone: '+57 312 492 8821',
      plan: 'Plan Anual',
      status: 'Al día',
      lastAccess: 'Hoy, 07:15 AM',
    },
    {
      id: 'RG-5510-1022',
      name: 'María López',
      email: 'maria@email.com',
      phone: '+57 310 882 1022',
      plan: 'Plan 4 Meses (Promo 8 meses)',
      status: 'Al día',
      lastAccess: 'Hoy, 08:00 AM',
    },
    {
      id: 'RG-3391-9920',
      name: 'Carlos Mendoza',
      email: 'carlos@email.com',
      phone: '+57 315 771 9920',
      plan: 'Plan Mensual',
      status: 'Pendiente',
      lastAccess: 'Ayer, 06:30 PM',
    },
    {
      id: 'RG-1102-4419',
      name: 'Sofía Ramos',
      email: 'sofia@email.com',
      phone: '+57 320 664 4419',
      plan: 'Plan Anual',
      status: 'Al día',
      lastAccess: 'Hace 2 días',
    },
    {
      id: 'RG-7741-2098',
      name: 'Mateo Silva',
      email: 'mateo@email.com',
      phone: '+57 318 553 2098',
      plan: 'Plan 3 Meses',
      status: 'Al día',
      lastAccess: 'Hoy, 11:45 AM',
    },
    {
      id: 'RG-9904-3311',
      name: 'Valentina Torres',
      email: 'valentina@email.com',
      phone: '+57 301 994 3311',
      plan: 'Plan Mensual',
      status: 'Inactivo',
      lastAccess: 'Hace 1 semana',
    },
  ]);

  filteredMembers = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.members();
    return this.members().filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q)
    );
  });

  // Métricas financieras y operativas
  // Datos para la gráfica de ingresos de los últimos 7 días
  incomeChartData = [
    { day: 'Lun', amount: 150000, height: '30%' },
    { day: 'Mar', amount: 320000, height: '64%' },
    { day: 'Mie', amount: 210000, height: '42%' },
    { day: 'Jue', amount: 180000, height: '36%' },
    { day: 'Vie', amount: 450000, height: '90%' },
    { day: 'Sab', amount: 500000, height: '100%' },
    { day: 'Dom', amount: 120000, height: '24%' },
  ];

  totalStoreRevenueCOP = computed(() =>
    this.db.orders().reduce((acc, o) => acc + o.total, 0)
  );

  pendingOrdersCount = computed(() =>
    this.db.orders().filter((o) => o.status === 'Pendiente en recepción').length
  );

  formatCOP(amount: number): string {
    return '$' + Math.round(amount).toLocaleString('es-CO') + ' COP';
  }

  processQrScan(customCode?: string): void {
    const code = (customCode || this.qrInput()).trim().toUpperCase();

    const member = this.members().find((m) => m.id === code || m.email.toLowerCase() === code.toLowerCase());

    if (member) {
      if (member.status === 'Al día') {
        this.scanResult.set({
          success: true,
          name: member.name,
          email: member.email,
          plan: member.plan,
          status: member.status,
          message: 'ACCESO CONCEDIDO - Bienvenid@ a ROCA GYM',
        });
        this.db.recordAttendance(member.email, member.name, member.plan, 'Concedido');
      } else {
        this.scanResult.set({
          success: false,
          name: member.name,
          email: member.email,
          plan: member.plan,
          status: member.status,
          message: 'ACCESO DENEGADO - Cuota o Plan Pendiente de Pago',
        });
        this.db.recordAttendance(member.email, member.name, member.plan, 'Denegado');
      }
    } else {
      this.scanResult.set({
        success: false,
        name: 'Desconocido',
        email: code,
        plan: 'Sin Plan',
        status: 'No registrado',
        message: 'CÓDIGO QR NO ENCONTRADO O INVÁLIDO',
      });
    }
  }

  updateOrderStatus(orderId: string, status: 'Pendiente en recepción' | 'Entregado' | 'Cancelado'): void {
    this.db.updateOrderStatus(orderId, status);
  }
}
