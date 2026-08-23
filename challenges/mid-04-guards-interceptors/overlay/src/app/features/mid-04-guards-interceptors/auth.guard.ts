import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { AuthState } from './auth-state';

/** Protege `/panel`: solo debe dejar pasar a quien tiene la sesión falsa iniciada. */
export const authGuard: CanActivateFn = () => {
  const authState = inject(AuthState);
  const router = inject(Router);

  // Bug: la condición está invertida. Debería redirigir cuando NO hay sesión y dejar pasar
  // cuando sí la hay — tal como está, hace justo lo contrario.
  if (authState.isAuthenticated()) {
    return router.createUrlTree(['/panel-entrada']);
  }

  return true;
};
