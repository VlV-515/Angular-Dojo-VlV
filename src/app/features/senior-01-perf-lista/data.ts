export interface Alumno {
  readonly id: string;
  readonly nombre: string;
  readonly cinturon: 'blanco' | 'azul' | 'negro';
  readonly racha: number;
}

const CINTURONES: readonly Alumno['cinturon'][] = ['blanco', 'azul', 'negro'];

/**
 * Genera los alumnos en tiempo de ejecución en vez de guardarlos como arreglo literal: así el
 * bundle solo paga por esta función (unas pocas líneas), no por diez mil objetos.
 */
export function generarAlumnos(total = 10_000): Alumno[] {
  const alumnos: Alumno[] = [];
  for (let i = 0; i < total; i += 1) {
    const indice = String(i).padStart(5, '0');
    alumnos.push({
      id: `alumno-${indice}`,
      nombre: `Alumno ${indice}`,
      cinturon: CINTURONES[i % CINTURONES.length],
      racha: i % 10,
    });
  }
  return alumnos;
}
