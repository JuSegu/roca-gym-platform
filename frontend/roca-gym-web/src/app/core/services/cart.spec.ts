import { TestBed } from '@angular/core/testing';
import { CartService } from './cart';
import { Auth } from './auth';
import { DatabaseService } from './database';

describe('CartService', () => {
  let service: CartService;
  let authService: Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService, Auth, DatabaseService],
    });
    service = TestBed.inject(CartService);
    authService = TestBed.inject(Auth);
    service.clearCart();
  });

  it('should be created and start empty', () => {
    expect(service).toBeTruthy();
    expect(service.items().length).toBe(0);
    expect(service.itemCount()).toBe(0);
    expect(service.subtotal()).toBe(0);
  });

  it('should add items and calculate subtotal correctly', () => {
    const product = {
      id: 1,
      name: 'Proteína Whey Isolate',
      category: 'Suplementos',
      price: 55.0,
      priceFormatted: '$55 USD',
      icon: '🥤',
    };

    service.addItem(product);
    expect(service.items().length).toBe(1);
    expect(service.itemCount()).toBe(1);
    expect(service.subtotal()).toBe(55.0);

    service.addItem(product);
    expect(service.items().length).toBe(1);
    expect(service.itemCount()).toBe(2);
    expect(service.subtotal()).toBe(110.0);
  });

  it('should update quantity and remove items when quantity hits zero', () => {
    const product = {
      id: 2,
      name: 'Creatina 500g',
      category: 'Suplementos',
      price: 35.0,
      priceFormatted: '$35 USD',
      icon: '⚡',
    };

    service.addItem(product);
    expect(service.items()[0].quantity).toBe(1);

    service.updateQuantity(2, 2);
    expect(service.items()[0].quantity).toBe(3);

    service.updateQuantity(2, -3);
    expect(service.items().length).toBe(0);
  });

  it('should apply 15% VIP discount for logged in users', () => {
    authService.login('admin@rocagym.com', '12345678');

    service.addItem({
      id: 1,
      name: 'Proteína',
      category: 'Suplementos',
      price: 100.0,
      priceFormatted: '$100 USD',
      icon: '🥤',
    });

    expect(service.subtotal()).toBe(100.0);
    expect(service.discountRate()).toBe(0.15);
    expect(service.discountAmount()).toBe(15.0);
    expect(service.total()).toBe(85.0);
  });

  it('should checkout and return a valid store order', () => {
    service.addItem({
      id: 1,
      name: 'Proteína',
      category: 'Suplementos',
      price: 50.0,
      priceFormatted: '$50 USD',
      icon: '🥤',
    });

    const order = service.checkout();
    expect(order).toBeTruthy();
    expect(order?.items.length).toBe(1);
    expect(order?.pickupCode).toMatch(/^REC-/);
    expect(service.items().length).toBe(0);
  });
});
