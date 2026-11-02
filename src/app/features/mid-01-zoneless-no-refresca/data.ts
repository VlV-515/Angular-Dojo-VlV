export interface Alumno {
  readonly id: string;
  readonly nombre: string;
  presente: boolean;
}

export const ALUMNOS_SEED: readonly Alumno[] = [
  { id: 'a1', nombre: 'Ana Torres', presente: false },
  { id: 'a2', nombre: 'Beto Salas', presente: false },
  { id: 'a3', nombre: 'Carla Núñez', presente: true },
];
