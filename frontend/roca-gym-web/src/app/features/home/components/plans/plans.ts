import { Component } from '@angular/core';

@Component({
  // Nombre del componente.
  // Lo utilizaremos cuando lo insertemos dentro de Home.
  selector: 'app-plans',

  // Este componente es independiente.
  standalone: true,

  // Por ahora no necesitamos importar otros componentes.
  imports: [],

  // HTML de la sección de planes.
  templateUrl: './plans.html',

  // Estilos propios del componente.
  styleUrl: './plans.css',
})
export class Plans {

  /*
    ============================================================
    PLANES DE ROCA GYM
    ============================================================

    Guardamos la información de los planes en un arreglo.

    Más adelante Angular podrá recorrer este arreglo
    automáticamente para crear las tarjetas.

    Esto es mejor que escribir cuatro tarjetas completas
    manualmente porque los precios y textos están centralizados.
  */

  plans = [
    {
      name: 'Mensual',
      price: '$75.000',
      description: 'Acceso durante un mes',
      promotion: '',
      featured: false,
    },

    {
      name: '3 Meses',
      price: '$225.000',
      description: 'Pagá 3, llevá 5',
      promotion: 'PROMOCIÓN',
      featured: false,
    },

    {
      name: '4 Meses',
      price: '$300.000',
      description: 'Pagá 4, llevá 8',
      promotion: 'MEJOR VALOR',
      featured: false,
    },

    {
      name: 'Anual',
      price: '$450.000',
      description: 'Entrenamiento durante todo el año',
      promotion: 'OFERTA ESPECIAL',
      featured: true,
    },
  ];
}
