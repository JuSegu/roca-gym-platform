import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

/** Temporary access rule until Firebase custom claims replace the demo account. */
export const adminGuard: CanActivateFn = () => {
  // The server cannot read a browser localStorage session during SSR.
  if (typeof window === 'undefined') return true;

  const auth = inject(Auth);
  const router = inject(Router);
  return auth.currentUser()?.email === 'admin@rocagym.com'
    ? true
    : router.createUrlTree(['/login']);
};
