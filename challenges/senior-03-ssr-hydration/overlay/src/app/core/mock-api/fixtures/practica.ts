import { latency } from '../latency';
import type { MockRouteConfig } from '../types';

export interface ConsejoPractica {
  readonly consejo: string;
  /**
   * Identificador único por llamada (contador + token aleatorio). No sirve para nada de negocio:
   * es a propósito para que un e2e pueda notar, comparando el valor pintado antes y después de
   * hidratar, si el fixture se llamó una sola vez (el valor no cambia) o dos (cambia, porque el
   * cliente pidió y recibió uno nuevo).
   */
  readonly peticionId: string;
}

const CONSEJOS: readonly string[] = [
  'Practica kihon dachi frente al espejo, sin prisa.',
  'Respira antes de cada mae geri: el aire manda el golpe.',
  'Relaja los hombros en kata — la tensión de más resta velocidad.',
];

/** Contador de peticiones atendidas por ESTE fixture, en ESTE proceso de JS (server o browser). */
let hits = 0;

export function resetPracticaHitsParaTests(): void {
  hits = 0;
}

function siguienteConsejo(): ConsejoPractica {
  hits += 1;
  const consejo = CONSEJOS[(hits - 1) % CONSEJOS.length] ?? CONSEJOS[0];
  const peticionId = `${hits}-${Math.random().toString(36).slice(2, 8)}`;
  return { consejo, peticionId };
}

export const practicaRoutes: MockRouteConfig[] = [
  {
    method: 'GET',
    match: '/api/dojo/practica',
    latencyMs: latency(80, 160),
    handler: () => siguienteConsejo(),
  },
];
