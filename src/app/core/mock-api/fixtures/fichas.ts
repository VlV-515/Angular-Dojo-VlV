import { latency } from '../latency';
import type { MockRouteConfig } from '../types';

export interface Ficha {
  readonly id: string;
  readonly nombre: string;
  readonly cinturon: string;
  readonly descripcion: string;
  readonly puntosClave: readonly string[];
  readonly consultas: number;
}

interface FichaBase {
  readonly id: string;
  readonly nombre: string;
  readonly cinturon: string;
  readonly descripcion: string;
  readonly puntosClave: readonly string[];
}

const FICHAS_BASE: readonly FichaBase[] = [
  {
    id: 'zenkutsu-dachi',
    nombre: 'Zenkutsu dachi',
    cinturon: 'blanco',
    descripcion: 'Postura larga hacia adelante, base de los desplazamientos básicos.',
    puntosClave: ['Pierna delantera flexionada', 'Pierna trasera extendida', 'Cadera al frente'],
  },
  {
    id: 'gyaku-zuki',
    nombre: 'Gyaku zuki',
    cinturon: 'blanco',
    descripcion: 'Golpe recto con el puño contrario a la pierna adelantada.',
    puntosClave: [
      'Rotación de cadera',
      'Puño recto al centro',
      'Brazo de retracción pegado al costado',
    ],
  },
  {
    id: 'ushiro-geri',
    nombre: 'Ushiro geri',
    cinturon: 'azul',
    descripcion: 'Patada hacia atrás en línea recta, con el talón como punto de impacto.',
    puntosClave: ['Mirar por encima del hombro', 'Cadera alineada con el objetivo', 'Extensión recta de la pierna'],
  },
  {
    id: 'sanchin-dachi',
    nombre: 'Sanchin dachi',
    cinturon: 'negro',
    descripcion: 'Postura de reloj de arena usada en katas de estilo interno.',
    puntosClave: ['Rodillas hacia adentro', 'Tensión abdominal constante', 'Pies en triángulo'],
  },
];

// Cuenta cuántas veces se sirvió cada ficha. No es aleatorio ni depende del reloj: sirve para
// que los tests puedan comprobar, de forma determinista, si una recarga disparó una petición
// nueva de verdad o no.
const contadorPorId = new Map<string, number>();

function contarConsulta(id: string): number {
  const siguiente = (contadorPorId.get(id) ?? 0) + 1;
  contadorPorId.set(id, siguiente);
  return siguiente;
}

function buscarFicha(id: string): FichaBase | undefined {
  return FICHAS_BASE.find((f) => f.id === id);
}

export const fichasRoutes: MockRouteConfig[] = [
  {
    method: 'GET',
    match: /^\/api\/dojo\/ficha-tecnica\/(?<id>[a-z0-9-]+)$/,
    // Latencia fija y pequeña, pero perceptible: alcanza para observar el estado de carga en
    // los tests, sin volverlos lentos.
    latencyMs: latency(200, 260),
    handler: (ctx): Ficha => {
      const id = ctx.params['id'] ?? '';
      const base = buscarFicha(id);
      if (!base) {
        // A propósito: "kata-fantasma" no está en FICHAS_BASE, así que pedirla siempre falla,
        // de forma determinista (no depende de contadores ni de Math.random como failEvery).
        throw new Error(`No existe una ficha con id "${id}".`);
      }
      return { ...base, consultas: contarConsulta(id) };
    },
  },
];
