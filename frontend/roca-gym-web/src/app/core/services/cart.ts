import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  priceFormatted: string;
  quantity: number;
  icon: string;
}

export type PaymentMethod = 'Nequi / Daviplata' | 'Transferencia Bancaria' | 'Efectivo en Recepción';

export interface StoreOrder {
  id: string;
  userName: string;
  customerPhone: string;
  items: { id: number; name: string; price: number; quantity: number; icon: string }[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  pickupCode: string;
  transactionRef: string;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
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

  // Sin descuento de miembro (ya no hay login)
  readonly discountRate = computed(() => 0);
  readonly discountAmount = computed(() => 0);
  readonly total = computed(() => this.subtotal());

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

  checkout(
    paymentMethod: PaymentMethod = 'Nequi / Daviplata',
    transactionRef?: string,
    customerInfo?: { name?: string; phone?: string; email?: string }
  ): StoreOrder | null {
    if (this.cartItemsSignal().length === 0) return null;

    const finalName = customerInfo?.name?.trim() || 'Cliente ROCA';
    const finalPhone = customerInfo?.phone?.trim() || '+57 300 000 0000';

    const order: StoreOrder = {
      id: 'ORD-' + Date.now().toString(36).toUpperCase(),
      userName: finalName,
      customerPhone: finalPhone,
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
      paymentMethod,
      pickupCode: 'REC-' + Math.floor(100 + Math.random() * 900),
      transactionRef: transactionRef || (paymentMethod === 'Efectivo en Recepción' ? 'PAGO-RECEPCION' : 'APROB-' + Math.floor(100000 + Math.random() * 900000)),
      date: new Date(),
    };

    this.lastOrderSignal.set(order);
    this.clearCart();

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
