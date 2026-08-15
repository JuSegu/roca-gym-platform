import { TestBed } from '@angular/core/testing';
import { DatabaseService } from './database';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatabaseService],
    });
    service = TestBed.inject(DatabaseService);
  });

  it('should be created with initial state', () => {
    expect(service).toBeTruthy();
    expect(service.maxCapacity).toBe(80);
    expect(service.orders().length).toBeGreaterThanOrEqual(1);
    expect(service.attendances().length).toBeGreaterThanOrEqual(1);
  });

  it('should create an order with unique ID and pickup code', () => {
    const newOrder = service.createOrder({
      userEmail: 'test@rocagym.com',
      userName: 'Test User',
      items: [{ id: 1, name: 'Creatina', price: 35, quantity: 1, icon: '⚡' }],
      subtotal: 35,
      discount: 0,
      total: 35,
    });

    expect(newOrder.id).toMatch(/^ORD-/);
    expect(newOrder.pickupCode).toMatch(/^REC-/);
    expect(newOrder.status).toBe('Pendiente en recepción');
    expect(service.orders().some((o) => o.id === newOrder.id)).toBeTrue();
  });

  it('should update order status correctly', () => {
    const order = service.orders()[0];
    service.updateOrderStatus(order.id, 'Entregado');
    const updated = service.orders().find((o) => o.id === order.id);
    expect(updated?.status).toBe('Entregado');
  });

  it('should record attendance and increment capacity when granted', () => {
    const initialCap = service.currentCapacity();
    const record = service.recordAttendance(
      'socio@rocagym.com',
      'Socio VIP',
      'Plan Anual VIP',
      'Concedido'
    );

    expect(record.status).toBe('Concedido');
    expect(service.attendances()[0].id).toBe(record.id);
    expect(service.currentCapacity()).toBe(initialCap + 1);
  });
});
