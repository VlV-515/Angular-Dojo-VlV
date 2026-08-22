/**
 * Fabrica un predicado que devuelve `true` exactamente en la llamada
 * n, 2n, 3n... Determinista: no depende de Math.random, solo de un contador.
 */
export function failEvery(n: number): () => boolean {
  let calls = 0;
  return () => {
    calls += 1;
    return n > 0 && calls % n === 0;
  };
}
