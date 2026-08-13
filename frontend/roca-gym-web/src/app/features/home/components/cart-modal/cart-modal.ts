import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../../../core/services/cart';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [],
  templateUrl: './cart-modal.html',
  styleUrl: './cart-modal.css',
})
export class CartModal {
  readonly cart = inject(CartService);
  readonly auth = inject(Auth);

  isOrderPlaced = signal(false);

  closeCart(): void {
    this.isOrderPlaced.set(false);
    this.cart.closeCart();
  }

  checkout(): void {
    if (this.cart.items().length === 0) return;
    this.isOrderPlaced.set(true);
    this.cart.clearCart();
  }
}
