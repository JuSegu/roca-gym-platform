import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../../core/services/cart';
import { Auth } from '../../../../core/services/auth';
import { PaymentMethod } from '../../../../core/services/database';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-modal.html',
  styleUrl: './cart-modal.css',
})
export class CartModal {
  readonly cart = inject(CartService);
  readonly auth = inject(Auth);

  isOrderPlaced = signal(false);
  isProcessing = signal(false);

  selectedPaymentMethod = signal<PaymentMethod>('Nequi / Daviplata');
  customerName = signal('');
  customerPhone = signal('');

  readonly paymentOptions: { id: PaymentMethod; title: string; icon: string; desc: string }[] = [
    {
      id: 'Nequi / Daviplata',
      title: 'Nequi / Daviplata',
      icon: '📱',
      desc: 'Transferencia instantánea sin costo a la cuenta oficial de ROCA GYM.',
    },
    {
      id: 'PSE / Bancolombia',
      title: 'PSE / Transferencia',
      icon: '🏦',
      desc: 'Débito seguro desde cualquier banco colombiano (Bancolombia, Davivienda, etc).',
    },
    {
      id: 'Tarjeta de Crédito / Débito',
      title: 'Tarjeta Visa / Mastercard',
      icon: '💳',
      desc: 'Procesamiento seguro con pasarela cifrada de 256 bits.',
    },
    {
      id: 'Efectivo o Datáfono en Recepción',
      title: 'Pago en Recepción Sede Calle 80',
      icon: '🏢',
      desc: 'Paga al retirar tus suplementos con efectivo o datáfono.',
    },
  ];

  setPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod.set(method);
  }

  closeCart(): void {
    this.isOrderPlaced.set(false);
    this.isProcessing.set(false);
    this.cart.closeCart();
  }

  processCheckout(): void {
    if (this.cart.itemCount() === 0) return;
    this.isProcessing.set(true);

    setTimeout(() => {
      const order = this.cart.checkout(this.selectedPaymentMethod());
      this.isProcessing.set(false);
      if (order) {
        this.isOrderPlaced.set(true);
      }
    }, 1200);
  }

  resetOrder(): void {
    this.isOrderPlaced.set(false);
    this.cart.closeCart();
  }

  getWhatsAppShareUrl(): string {
    const order = this.cart.lastOrderSignal();
    if (!order) return 'https://wa.me/573123456789';
    const text = encodeURIComponent(
      `¡Hola ROCA GYM! 💪 Acabo de generar mi orden en la web:\n` +
      `📦 Orden: ${order.id}\n` +
      `🔑 Código de Retiro: ${order.pickupCode}\n` +
      `💰 Total: ${this.cart.formatCOP(order.total)}\n` +
      `💳 Método: ${order.paymentMethod}\n` +
      `📍 Sede: Calle 80 #92-49 Bogotá\n` +
      `Por favor confirmar preparación de mi pedido.`
    );
    return `https://wa.me/573123456789?text=${text}`;
  }
}
