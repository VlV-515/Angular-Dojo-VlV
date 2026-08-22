import type { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

import { extractParams, matchRoute } from './match-route';
import { MOCK_ROUTES } from './routes';

/**
 * Intercepta peticiones que calzan con una ruta registrada en MOCK_ROUTES y
 * responde en memoria, sin red. Lo que no calza sigue de largo con next(req).
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const pathname = new URL(req.url, 'http://dojo.local').pathname;
  const route = MOCK_ROUTES.find(
    (candidate) => candidate.method === req.method && matchRoute(candidate.match, pathname),
  );

  if (!route) {
    return next(req);
  }

  const params = extractParams(route.match, pathname);
  const context = { request: req, params };
  const ms = typeof route.latencyMs === 'function' ? route.latencyMs(context) : (route.latencyMs ?? 0);

  return of(null).pipe(
    delay(Math.max(0, ms)),
    mergeMap(() => {
      if (route.shouldFail?.()) {
        return throwError(
          () =>
            new HttpErrorResponse({
              url: req.url,
              status: route.failStatus ?? 500,
              statusText: 'Mock API Error',
              error: { message: route.failMessage ?? 'Fallo simulado determinista.' },
            }),
        );
      }

      return of(
        new HttpResponse({
          url: req.url,
          status: 200,
          body: route.handler(context),
        }),
      );
    }),
  );
};
