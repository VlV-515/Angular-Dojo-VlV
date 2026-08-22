import { failEvery } from '../fail-every';
import { latency } from '../latency';
import { DOJO_SEED } from '../random';
import type { MockRouteConfig } from '../types';

const pingShouldFail = failEvery(4);

/**
 * Rutas de ejemplo que prueban el mock API en sí mismo (ver mock-api.interceptor.spec.ts).
 * Los retos futuros agregan sus propias rutas en su propio archivo de fixtures.
 */
export const demoRoutes: MockRouteConfig[] = [
  {
    method: 'GET',
    match: '/api/dojo/status',
    latencyMs: latency(80, 160),
    handler: () => ({
      ok: true,
      semilla: DOJO_SEED,
      mensaje: 'Mock API del dojo, en memoria y determinista.',
    }),
  },
  {
    method: 'GET',
    match: '/api/dojo/ping',
    latencyMs: latency(150, 300),
    shouldFail: pingShouldFail,
    failStatus: 503,
    failMessage: 'Ping simulado caído (1 de cada 4 llamadas, a propósito).',
    handler: () => ({ pong: true }),
  },
];
