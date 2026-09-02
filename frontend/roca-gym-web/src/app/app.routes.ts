import { Routes } from '@angular/router';

// Página principal
import { Home } from './features/home/home';
import { NotFound } from './features/not-found/not-found';

export const routes: Routes = [
  // Página principal
  {
    path: '',
    component: Home,
  },

  // Ruta 404 — página no encontrada con branding ROCA GYM
  {
    path: '**',
    component: NotFound,
  },
];
