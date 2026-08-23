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

  // Bug: `HttpHeaders` es inmutable — `.set(...)` devuelve un objeto de headers *nuevo*, no
  // modifica `req.headers` en el sitio. Falta aplicar ese resultado sobre la petición con
  // `req.clone({...})` y mandar la petición clonada a `next(...)`. Tal como está, lo que sigue
  // de largo hacia `next()` es el `req` original, sin el header.
  req.headers.set('Authorization', `Bearer ${token}`);

  return next(req);
};
