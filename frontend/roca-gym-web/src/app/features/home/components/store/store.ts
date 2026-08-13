import { Component } from '@angular/core';

@Component({
  // Selector utilizado cuando insertemos
  // este componente dentro de Home.
  selector: 'app-store',

  // Componente independiente de Angular.
  standalone: true,

  // Por ahora no necesitamos importar
  // otros componentes.
  imports: [],

  // HTML de la tienda.
  templateUrl: './store.html',

  // CSS específico de la tienda.
  styleUrl: './store.css',
})
export class Store {}