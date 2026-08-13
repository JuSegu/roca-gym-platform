import { Injectable, signal, computed, inject } from '@angular/core';
import { Auth } from './auth';

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

  // Signal para los elementos en el carrito
  private readonly cartItemsSignal = signal<CartItem[]>([]);
  readonly items = this.cartItemsSignal.asReadonly();

  // Signal para la visibilidad del modal del carrito
  readonly isCartOpenSignal = signal<boolean>(false);
  readonly isCartOpen = this.isCartOpenSignal.asReadonly();

  // Signal de notificación/toast al añadir item
  readonly toastMessageSignal = signal<string | null>(null);

  // Computados
  readonly itemCount = computed(() =>
    this.cartItemsSignal().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.cartItemsSignal().reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  // Aplicar 15% de descuento VIP si el usuario está autenticado
  readonly discountRate = computed(() => (this.auth.isLoggedIn() ? 0.15 : 0));

  readonly discountAmount = computed(() => this.subtotal() * this.discountRate());

  readonly total = computed(() => this.subtotal() - this.discountAmount());

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
