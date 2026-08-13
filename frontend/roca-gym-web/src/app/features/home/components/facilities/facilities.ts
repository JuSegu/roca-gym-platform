import { Component } from '@angular/core';

@Component({
  // Nombre que utilizaremos para insertar este componente
  // dentro de otros templates HTML.
  selector: 'app-facilities',

  // Este componente funciona de manera independiente.
  // Angular moderno utiliza mucho este enfoque.
  standalone: true,

  // No necesitamos importar otros componentes todavía.
  imports: [],

  // HTML que contiene la estructura visual de la sección.
  templateUrl: './facilities.html',

  // CSS específico de este componente.
  styleUrl: './facilities.css',
})
export class Facilities {}