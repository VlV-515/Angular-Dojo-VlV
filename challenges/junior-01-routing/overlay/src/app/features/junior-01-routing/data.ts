export interface Tecnica {
  readonly id: string;
  readonly nombre: string;
  readonly cinturon: 'blanco' | 'azul' | 'negro';
  readonly descripcion: string;
}

export const TECNICAS: readonly Tecnica[] = [
  {
    id: 'kihon-dachi',
    nombre: 'Kihon dachi',
    cinturon: 'blanco',
    descripcion: 'Postura básica: pies al ancho de hombros, peso repartido por igual.',
  },
  {
    id: 'oi-zuki',
    nombre: 'Oi zuki',
    cinturon: 'blanco',
    descripcion: 'Golpe directo avanzando con el mismo lado del pie de apoyo.',
  },
  {
    id: 'mae-geri',
    nombre: 'Mae geri',
    cinturon: 'azul',
    descripcion: 'Patada frontal: rodilla arriba y extensión con el metatarso.',
  },
  {
    id: 'uke-waza',
    nombre: 'Uke waza',
    cinturon: 'azul',
    descripcion: 'Familia de bloqueos: alto, medio y bajo.',
  },
  {
    id: 'kata-heian',
    nombre: 'Kata Heian Shodan',
    cinturon: 'negro',
    descripcion: 'Primer kata formal: veintiún movimientos, cuatro direcciones.',
  },
];
