import { Injectable, signal, computed, inject } from '@angular/core';
import { Auth } from './auth';
import { DatabaseService, StoreOrder } from './database';
import { GamificationService } from './gamification.service';

export interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  priceFormatted: string;
  quantity: number;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly auth = inject(Auth);
  private readonly db = inject(DatabaseService);
  private readonly gamification = inject(GamificationService);

  private readonly cartItemsSignal = signal<CartItem[]>([]);
  readonly items = this.cartItemsSignal.asReadonly();

  readonly isCartOpenSignal = signal<boolean>(false);
  readonly isCartOpen = this.isCartOpenSignal.asReadonly();

  readonly toastMessageSignal = signal<string | null>(null);
  readonly lastOrderSignal = signal<StoreOrder | null>(null);

  readonly itemCount = computed(() =>
    this.cartItemsSignal().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.cartItemsSignal().reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  // 5% de descuento para cualquier miembro con plan activo
  readonly discountRate = computed(() => (this.auth.isLoggedIn() ? 0.05 : 0));
  readonly discountAmount = computed(() => this.subtotal() * this.discountRate());
  readonly total = computed(() => this.subtotal() - this.discountAmount());

  formatCOP(amount: number): string {
    return '$' + Math.round(amount).toLocaleString('es-CO') + ' COP';
  }

  toggleCart(): void {
    this.isCartOpenSignal.update((open) => !open);
  }

  openCart(): void {
    this.isCartOpenSignal.set(true);
  }

  closeCart(): void {
    this.isCartOpenSignal.set(false);
  }

  addItem(product: { id: number; name: string; category: string; price: number; priceFormatted: string; icon: string }): void {
    this.cartItemsSignal.update((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          priceFormatted: product.priceFormatted,
          quantity: 1,
          icon: product.icon,
        },
      ];
    });

    this.showToast(`¡${product.name} añadido al carrito!`);
  }

  updateQuantity(productId: number, delta: number): void {
    this.cartItemsSignal.update((current) =>
      current
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  }

  removeItem(productId: number): void {
    this.cartItemsSignal.update((current) => current.filter((item) => item.id !== productId));
  }

  checkout(): StoreOrder | null {
    if (this.cartItemsSignal().length === 0) return null;

    const user = this.auth.currentUser();
    const order = this.db.createOrder({
      userEmail: user ? user.email : 'invitado@rocagym.com',
      userName: user ? user.name : 'Cliente Invitado',
      items: this.cartItemsSignal().map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        icon: i.icon,
      })),
      subtotal: this.subtotal(),
      discount: this.discountAmount(),
      total: this.total(),
    });

    this.lastOrderSignal.set(order);
    this.clearCart();

    // Recompensar con XP y desbloqueo de logro de nutrición
    this.gamification.unlockBadge('vip_supplements');
    this.gamification.addXp(100, 'Pedido en tienda ROCA completado');

    return order;
  }

  clearCart(): void {
    this.cartItemsSignal.set([]);
  }

  private showToast(message: string): void {
    this.toastMessageSignal.set(message);
    setTimeout(() => {
      if (this.toastMessageSignal() === message) {
        this.toastMessageSignal.set(null);
      }
    }, 3000);
  }
}
