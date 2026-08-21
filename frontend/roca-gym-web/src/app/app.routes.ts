import { Routes } from '@angular/router';

// Página principal
import { Home } from './features/home/home';

// Página de inicio de sesión
import { Login } from './features/auth/login/login';

// Página de registro
import { Register } from './features/auth/register/register';

// Recuperar contraseña
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { Admin } from './features/admin/admin';
import { adminGuard } from './core/guards/admin.guard';
import { NotFound } from './features/not-found/not-found';

export const routes: Routes = [
  // Página principal
  {
    path: '',
    component: Home,
  },

  // Inicio de sesión
  {
    path: 'login',
    component: Login,
  },

  // Crear cuenta
  {
    path: 'register',
    component: Register,
  },

  // Recuperar contraseña
  {
    path: 'forgot-password',
    component: ForgotPassword,
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [adminGuard],
  },

  // Ruta 404 — página no encontrada con branding ROCA GYM
  {
    path: '**',
    component: NotFound,
  },
];
