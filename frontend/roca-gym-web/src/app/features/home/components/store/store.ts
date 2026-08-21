import { Component, inject, signal, computed } from '@angular/core';
import { CartService } from '../../../../core/services/cart';

export interface Product {
  id: number;
  name: string;
  category: 'Suplementos' | 'Indumentaria' | 'Accesorios';
  price: number;
  priceFormatted: string;
  description: string;
  image: string;
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
      name: 'Proteína Whey Isolate (2 Lb / 1 Kg)',
      category: 'Suplementos',
      price: 165000,
      priceFormatted: '$165.000 COP',
      description: 'Aislado de suero premium 90% proteína pura, cero azúcar y rápida absorción muscular.',
      image: '/images/products/whey-protein.jpg',
      icon: '🥤',
      popular: true,
    },
    {
      id: 2,
      name: 'Creatina Monohidratada (300g)',
      category: 'Suplementos',
      price: 110000,
      priceFormatted: '$110.000 COP',
      description: 'Creatina 100% micronizada de alta pureza para fuerza explosiva y aumento de masa magra.',
      image: '/images/products/creatine.jpg',
      icon: '⚡',
      popular: true,
    },
    {
      id: 3,
      name: 'Pre-Entreno Nitro Beast (300g)',
      category: 'Suplementos',
      price: 95000,
      priceFormatted: '$95.000 COP',
      description: 'Fórmula explosiva con cafeína, beta-alanina y citrulina para máxima potencia en cada serie.',
      image: '/images/products/preworkout.jpg',
      icon: '🔥',
      popular: true,
    },
    {
      id: 4,
      name: 'BCAA + Glutamina Recovery (300g)',
      category: 'Suplementos',
      price: 85000,
      priceFormatted: '$85.000 COP',
      description: 'Aminoácidos esenciales 4:1:1 con electrolitos para recuperación intra y post entrenamiento.',
      image: '/images/products/creatine.jpg',
      icon: '🧪',
    },
    {
      id: 5,
      name: 'Camiseta Oversized ROCA Black',
      category: 'Indumentaria',
      price: 65000,
      priceFormatted: '$65.000 COP',
      description: 'Algodón pesado prémium, corte drop-shoulder con logo de alta durabilidad.',
      image: '/images/products/tshirt.jpg',
      icon: '👕',
      popular: true,
    },
    {
      id: 6,
      name: 'Hoodie ROCA GYM Heavyweight',
      category: 'Indumentaria',
      price: 130000,
      priceFormatted: '$130.000 COP',
      description: 'Buzo térmico grueso con capota estructurada y corte atlético para entrenar o calle.',
      image: '/images/products/tshirt.jpg',
      icon: '🧥',
    },
    {
      id: 7,
      name: 'Cinturón de Levantamiento Cuero 10mm',
      category: 'Accesorios',
      price: 95000,
      priceFormatted: '$95.000 COP',
      description: 'Cuero genuino de alta resistencia con doble hebilla de acero para sentadilla y peso muerto.',
      image: '/images/products/belt.jpg',
      icon: '🏋️',
      popular: true,
    },
    {
      id: 8,
      name: 'Kit Straps de Agarre + Shaker ROCA',
      category: 'Accesorios',
      price: 45000,
      priceFormatted: '$45.000 COP',
      description: 'Shaker libre de BPA con mezclador anti-grumos y correas de agarre con almohadilla de neopreno.',
      image: '/images/products/shaker-straps.jpg',
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