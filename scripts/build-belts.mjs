#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { RANKS, shieldSvg } from '../site/belts.mjs';
import { REPO_ROOT } from './lib/paths.mjs';

const beltsDir = join(REPO_ROOT, 'docs', 'belts');
mkdirSync(beltsDir, { recursive: true });

for (const rank of RANKS) {
  writeFileSync(join(beltsDir, `${rank.id}.svg`), `${shieldSvg(rank.id, { title: `Cinturón ${rank.name}` })}\n`);
}

// Favicon por defecto (antes de que el sitio calcule tu cinturón).
writeFileSync(join(REPO_ROOT, 'site', 'favicon.svg'), `${shieldSvg('blanco')}\n`);

console.log(`Listo: ${RANKS.length} escudos en docs/belts/ y site/favicon.svg.`);
