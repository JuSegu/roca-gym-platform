import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

/** Temporary access rule until Firebase custom claims replace the demo account. */
export const adminGuard: CanActivateFn = () => {
  // The server cannot read a browser localStorage session during SSR.
  if (typeof window === 'undefined') return true;

  const auth = inject(Auth);
  const router = inject(Router);
  const user = auth.currentUser();
  const isAdmin =
    user?.email?.toLowerCase() === 'admin@rocagym.com' ||
    user?.role === 'Administrador' ||
    user?.role === 'Admin';

  return isAdmin ? true : router.createUrlTree(['/login']);
};
