import { latency } from '../latency';
import type { MockRouteConfig } from '../types';

export interface ResultadoBusqueda {
  readonly id: string;
  readonly nombre: string;
  readonly cinturon: string;
}

const TECNICAS_BUSCABLES: readonly ResultadoBusqueda[] = [
  { id: 'kihon-dachi', nombre: 'Kihon dachi', cinturon: 'blanco' },
  { id: 'oi-zuki', nombre: 'Oi zuki', cinturon: 'blanco' },
  { id: 'mae-geri', nombre: 'Mae geri', cinturon: 'azul' },
  { id: 'uke-waza', nombre: 'Uke waza', cinturon: 'azul' },
  { id: 'kata-heian', nombre: 'Kata Heian Shodan', cinturon: 'negro' },
  { id: 'mawashi-geri', nombre: 'Mawashi geri', cinturon: 'azul' },
];

function buscar(q: string): ResultadoBusqueda[] {
  const query = q.trim().toLowerCase();
  if (!query) {
    return [];
  }
  return TECNICAS_BUSCABLES.filter((t) => t.nombre.toLowerCase().includes(query));
}

function leerQuery(ctx: { readonly request: { readonly params: { get(name: string): string | null } } }): string {
  return ctx.request.params.get('q') ?? '';
}

export const buscadorRoutes: MockRouteConfig[] = [
  {
    method: 'GET',
    match: '/api/dojo/buscar-tecnicas',
    // A propósito: las consultas CORTAS (más resultados, más genéricas) tardan más que las
    // largas y específicas. Así, si no se cancela la petición vieja, su respuesta lenta llega
    // tarde y pisa a la respuesta correcta — la condición de carrera se reproduce siempre igual.
    latencyMs: (ctx) => {
      const longitud = leerQuery(ctx).trim().length;
      if (longitud <= 2) return latency(360, 420);
      if (longitud <= 4) return latency(180, 240);
      return latency(40, 80);
    },
    handler: (ctx) => buscar(leerQuery(ctx)),
  },
];
