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
    const order = this.cart.checkout();
    if (order) this.isOrderPlaced.set(true);
  }
}
