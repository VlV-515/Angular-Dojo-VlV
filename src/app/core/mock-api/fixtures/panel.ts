import { HttpErrorResponse } from '@angular/common/http';

import { latency } from '../latency';
import type { MockRouteConfig, MockRouteContext } from '../types';

/** Token falso que se espera en el header `Authorization` de las peticiones al panel. */
export const TOKEN_ESPERADO = 'dojo-fake-token';

export interface DatoPanel {
  readonly id: string;
  readonly titulo: string;
}

const DATOS_PANEL: readonly DatoPanel[] = [
  { id: 'progreso', titulo: 'Progreso de cinturones' },
  { id: 'racha', titulo: 'Racha de retos resueltos esta semana' },
  { id: 'proximo', titulo: 'Próximo reto sugerido: mid-05' },
];

function tieneTokenValido(ctx: MockRouteContext): boolean {
  return ctx.request.headers.get('Authorization') === `Bearer ${TOKEN_ESPERADO}`;
}

export const panelRoutes: MockRouteConfig[] = [
  {
    method: 'GET',
    match: '/api/dojo/panel-datos',
    latencyMs: latency(60, 120),
    // No se usa `shouldFail` porque no recibe el contexto de la petición: el chequeo del token
    // vive aquí, en el propio handler, y lanza directo un `HttpErrorResponse` cuando falta o es
    // incorrecto (el interceptor del mock API atrapa ese throw igual que si viniera de
    // `shouldFail` + `failStatus`).
    handler: (ctx) => {
      if (!tieneTokenValido(ctx)) {
        throw new HttpErrorResponse({
          url: ctx.request.url,
          status: 401,
          statusText: 'Mock API Error',
          error: { message: 'Sesión inválida: falta el token de autorización esperado.' },
        });
      }
      return DATOS_PANEL;
    },
  },
];
