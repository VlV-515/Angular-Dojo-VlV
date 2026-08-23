import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthState } from './auth-state';

/** Agrega el token falso de `AuthState` como header `Authorization` a las peticiones salientes. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthState);
  const token = authState.token();

  if (!token) {
    return next(req);
  }

  const clonado = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

  return next(clonado);
};
