import { Component, inject, signal, computed } from '@angular/core';
import { CartService } from '../../../../core/services/cart';

export interface Product {
  id: number;
  name: string;
  category: 'Suplementos' | 'Indumentaria' | 'Accesorios';
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

  selectedCategory = signal<string>('Todos');

  categories = ['Todos', 'Suplementos', 'Indumentaria', 'Accesorios'];

  products: Product[] = [
    {
      id: 1,
      name: 'Proteína Whey Isolate 2kg',
      category: 'Suplementos',
      price: 55.00,
      priceFormatted: '$55 USD',
      description: 'Aislado de suero premium 90% proteína con enzimas digestivas.',
      icon: '🥤',
      popular: true,
    },
    {
      id: 2,
      name: 'Creatina Monohidratada 500g',
      category: 'Suplementos',
      price: 35.00,
      priceFormatted: '$35 USD',
      description: 'Creatina micronizada Creapure® para fuerza explosiva y volumen.',
      icon: '⚡',
      popular: true,
    },
    {
      id: 3,
      name: 'Pre-Entreno Nitro Blast 300g',
      category: 'Suplementos',
      price: 38.00,
      priceFormatted: '$38 USD',
      description: 'Energía extrema, bombeo muscular y enfoque láser sin bajón.',
      icon: '🔥',
    },
    {
      id: 4,
      name: 'BCAA + Glutamina Recovery',
      category: 'Suplementos',
      price: 28.00,
      priceFormatted: '$28 USD',
      description: 'Aminoácidos ramificados 4:1:1 para recuperación intra-entreno.',
      icon: '🧪',
    },
    {
      id: 5,
      name: 'Camiseta Oversized ROCA Black',
      category: 'Indumentaria',
      price: 25.00,
      priceFormatted: '$25 USD',
      description: 'Algodón pesado de alto gramaje con estampado serigrafiado.',
      icon: '👕',
      popular: true,
    },
    {
      id: 6,
      name: 'Hoodie ROCA GYM Heavyweight',
      category: 'Indumentaria',
      price: 48.00,
      priceFormatted: '$48 USD',
      description: 'Buzo térmico con capucha reforzada y corte atleta.',
      icon: '🧥',
    },
    {
      id: 7,
      name: 'Cinturón de Levantamiento Cuero',
      category: 'Accesorios',
      price: 45.00,
      priceFormatted: '$45 USD',
      description: 'Hebilla de acero y cuero genuino 10mm para sentadillas y peso muerto.',
      icon: '🏋️',
      popular: true,
    },
    {
      id: 8,
      name: 'Kit Straps + Shaker Térmico',
      category: 'Accesorios',
      price: 30.00,
      priceFormatted: '$30 USD',
      description: 'Shaker de acero inoxidable 750ml y straps de agarre reforzados.',
      icon: '🎒',
    },
  ];

  filteredProducts = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'Todos') return this.products;
    return this.products.filter((p) => p.category === cat);
  });

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  addToCart(product: Product): void {
    this.cart.addItem(product);
  }
}