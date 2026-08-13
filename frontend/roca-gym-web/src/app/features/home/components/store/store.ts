import { Component, inject } from '@angular/core';
import { CartService } from '../../../../core/services/cart';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  priceFormatted: string;
  description: string;
  icon: string;
  popular?: boolean;
}

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [],
  templateUrl: './store.html',
  styleUrl: './store.css',
})
export class Store {
  readonly cart = inject(CartService);

  products: Product[] = [
    {
      id: 1,
      name: 'Proteína Whey Isolate',
      category: 'Suplementos',
      price: 55.00,
      priceFormatted: '$55 USD',
      description: 'Proteína aislada de máxima pureza para complementar tu recuperación muscular.',
      icon: '🥤',
      popular: true,
    },
    {
      id: 2,
      name: 'Creatina Monohidratada 500g',
      category: 'Rendimiento',
      price: 35.00,
      priceFormatted: '$35 USD',
      description: 'Aumenta tu fuerza explosiva y potencia en entrenamientos pesados.',
      icon: '⚡',
      popular: true,
    },
    {
      id: 3,
      name: 'Camiseta Official ROCA GYM',
      category: 'Ropa Deportiva',
      price: 25.00,
      priceFormatted: '$25 USD',
      description: 'Camiseta de alta transpiración con el sello de identidad ROCA.',
      icon: '👕',
    },
    {
      id: 4,
      name: 'Kit Accesorios & Straps',
      category: 'Accesorios',
      price: 30.00,
      priceFormatted: '$30 USD',
      description: 'Shaker de acero inox, straps para jalón y muñequeras de alta resistencia.',
      icon: '🎒',
    },
  ];

  addToCart(product: Product): void {
    this.cart.addItem(product);
  }
}