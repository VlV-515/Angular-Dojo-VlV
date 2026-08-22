export type RandomFn = () => number;

/**
 * PRNG mulberry32: determinista dada una semilla fija. No usar para nada
 * criptográfico, solo para fabricar datos y tiempos reproducibles en el mock API.
 */
export function createSeededRandom(seed: number): RandomFn {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const DOJO_SEED = 1337;

export const dojoRandom: RandomFn = createSeededRandom(DOJO_SEED);
