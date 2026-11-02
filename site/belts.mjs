// Cinturones del dojo: escalera de rangos y el escudo que los representa.
// Lo usan el sitio (logo, favicon, sección de cinturones) y scripts/build-belts.mjs
// (favicon estático y los SVG del README).

export const RANKS = [
  { id: 'blanco', name: 'Blanco', unlockedBy: null },
  { id: 'azul', name: 'Azul', unlockedBy: { level: 'junior', belt: 'blanco' } },
  { id: 'negro', name: 'Negro', unlockedBy: { level: 'mid', belt: 'azul' } },
  { id: 'maestro', name: 'Maestro', unlockedBy: { level: 'senior', belt: 'negro' } },
];

// Paleta Ayu: [relleno, borde] por tema; el nudo usa el acento del sitio.
const COLORS = {
  blanco: { light: ['#ffffff', '#c9ccd1'], dark: ['#e6e1cf', 'none'] },
  azul: { light: ['#399ee6', 'none'], dark: ['#59c2ff', 'none'] },
  negro: { light: ['#1f2430', 'none'], dark: ['#1f2430', '#565b66'] },
  maestro: { light: ['#1f2430', '#ffaa33'], dark: ['#1f2430', '#e6b450'] },
};
const KNOT = { light: '#ffaa33', dark: '#e6b450' };

function shieldRule(id, theme) {
  const [fill, stroke] = COLORS[id][theme];
  return `.s-${id}{fill:${fill};stroke:${stroke};stroke-width:3px}.k-${id}{fill:${KNOT[theme]}}`;
}

/** SVG autocontenido del escudo; sigue prefers-color-scheme por sí solo (sirve inline, como favicon o en GitHub). */
export function shieldSvg(id, { size, title } = {}) {
  const dims = size ? ` width="${size}" height="${size}"` : '';
  const label = title ? ` role="img" aria-label="${title}"` : ' aria-hidden="true"';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"${dims}${label}>` +
    `<style>${shieldRule(id, 'light')}@media (prefers-color-scheme: dark){${shieldRule(id, 'dark')}}</style>` +
    `<path class="s-${id}" stroke-linejoin="round" d="M32 3 L58 12 L54 47 L32 61 L10 47 L6 12 Z"/>` +
    '<path fill="#000" opacity="0.1" d="M32 3 L58 12 L54 47 L32 61 Z"/>' +
    `<rect class="k-${id}" x="8" y="27" width="48" height="9"/>` +
    `<rect class="k-${id}" x="27" y="24" width="10" height="15" rx="2"/>` +
    `<path class="k-${id}" d="M29 38 L23 52 L28 52 L32 41 Z M35 38 L41 52 L36 52 L32 41 Z"/>` +
    '</svg>'
  );
}

/** Índice en RANKS del cinturón actual: se sube nivel por nivel, completando todos sus retos. */
export function currentRankIndex(entries, solved) {
  let index = 0;
  for (const rank of RANKS.slice(1)) {
    const level = entries.filter((entry) => entry.level === rank.unlockedBy.level);
    if (level.length === 0 || !level.every((entry) => solved.has(entry.id))) break;
    index += 1;
  }
  return index;
}
