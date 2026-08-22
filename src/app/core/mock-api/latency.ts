import { dojoRandom, type RandomFn } from './random';

/**
 * Devuelve un retraso en milisegundos. Con un solo argumento es fijo;
 * con rango [min, max] se elige con el generador con semilla fija,
 * así que para una misma secuencia de llamadas el resultado es siempre igual.
 */
export function latency(min = 150, max = min, random: RandomFn = dojoRandom): number {
  if (max <= min) {
    return Math.max(0, min);
  }
  return Math.round(min + random() * (max - min));
}
