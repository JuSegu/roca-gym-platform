import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, PaymentMethod } from '../../../../core/services/cart';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-modal.html',
  styleUrl: './cart-modal.css',
})
export class CartModal {
  readonly cart = inject(CartService);

  isOrderPlaced = signal(false);
  isProcessing = signal(false);
  errorMessage = signal<string | null>(null);

  selectedPaymentMethod = signal<PaymentMethod>('Nequi / Daviplata');
  
  // Datos del cliente (siempre invitado, ya no hay login)
  guestName = signal('');
  guestPhone = signal('');
  guestEmail = signal('');

  readonly paymentOptions: { id: PaymentMethod; title: string; icon: string; desc: string }[] = [
    {
      id: 'Nequi / Daviplata',
      title: 'Nequi / Daviplata',
      icon: '📲',
      desc: 'Transfiere al número de ROCA GYM y presenta el comprobante en recepción.',
    },
    {
      id: 'Transferencia Bancaria',
      title: 'Transferencia Bancaria',
      icon: '🏦',
      desc: 'Pago por PSE, Bancolombia, Davivienda u otro banco colombiano.',
    },
    {
      id: 'Efectivo en Recepción',
      title: 'Efectivo en Sede',
      icon: '💵',
      desc: 'Paga en efectivo cuando retires tu pedido en Calle 80 #92-49.',
    },
  ];

  setPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod.set(method);
  }

  closeCart(): void {
    this.isOrderPlaced.set(false);
    this.isProcessing.set(false);
    this.errorMessage.set(null);
    this.cart.closeCart();
  }

  processCheckout(): void {
    if (this.cart.itemCount() === 0) return;

    // Validar nombre y celular
    if (!this.guestName().trim() || this.guestName().trim().length < 3) {
      this.errorMessage.set('Por favor ingresa tu nombre completo para identificar tu pedido.');
      return;
    }
    if (!this.guestPhone().trim() || this.guestPhone().trim().length < 7) {
      this.errorMessage.set('Por favor ingresa tu número de celular o WhatsApp de contacto.');
      return;
    }

    this.errorMessage.set(null);
    this.isProcessing.set(true);

    setTimeout(() => {
      const order = this.cart.checkout(
        this.selectedPaymentMethod(),
        undefined,
        {
          name: this.guestName().trim(),
          phone: this.guestPhone().trim(),
          email: this.guestEmail().trim() || 'cliente@rocagym.com',
        }
      );

      this.isProcessing.set(false);
      if (order) {
        this.isOrderPlaced.set(true);
      }
    }, 1000);
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
      `👤 Cliente: ${order.userName}\n` +
      `📱 Teléfono: ${order.customerPhone || 'N/A'}\n` +
      `🔑 Código de Retiro: ${order.pickupCode}\n` +
      `💰 Total: ${this.cart.formatCOP(order.total)}\n` +
      `💳 Método: ${order.paymentMethod}\n` +
      `📍 Sede: Calle 80 #92-49 Bogotá\n` +
      `Por favor confirmar preparación de mi pedido.`
    );
    return `https://wa.me/573123456789?text=${text}`;
  }
}
