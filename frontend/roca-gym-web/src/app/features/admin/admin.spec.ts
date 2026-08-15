import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Admin } from './admin';
import { DatabaseService } from '../../core/services/database';

describe('Admin Component', () => {
  let component: Admin;
  let fixture: ComponentFixture<Admin>;
  let db: DatabaseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admin],
      providers: [provideRouter([]), DatabaseService],
    }).compileComponents();

    fixture = TestBed.createComponent(Admin);
    component = fixture.componentInstance;
    db = TestBed.inject(DatabaseService);
    fixture.detectChanges();
  });

  it('should create admin component', () => {
    expect(component).toBeTruthy();
    expect(component.activeTab()).toBe('qr');
  });

  it('should filter members based on search query', () => {
    component.searchQuery.set('María');
    expect(component.filteredMembers().length).toBe(1);
    expect(component.filteredMembers()[0].name).toBe('María López');

    component.searchQuery.set('');
    expect(component.filteredMembers().length).toBeGreaterThanOrEqual(4);
  });

  it('should grant access to members who are up to date', () => {
    component.processQrScan('RG-8829-4921');
    const result = component.scanResult();
    expect(result).toBeTruthy();
    expect(result?.success).toBeTrue();
    expect(result?.message).toContain('ACCESO CONCEDIDO');
  });

  it('should deny access to members with pending payments', () => {
    component.processQrScan('RG-3391-9920');
    const result = component.scanResult();
    expect(result).toBeTruthy();
    expect(result?.success).toBeFalse();
    expect(result?.message).toContain('ACCESO DENEGADO');
  });

  it('should update store order status through admin', () => {
    const orders = db.orders();
    if (orders.length > 0) {
      component.updateOrderStatus(orders[0].id, 'Entregado');
      const updated = db.orders().find((o) => o.id === orders[0].id);
      expect(updated?.status).toBe('Entregado');
    }
  });
});
