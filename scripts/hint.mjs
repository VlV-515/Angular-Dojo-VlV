#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { REPO_ROOT } from './lib/paths.mjs';
import { readProgress, recordHintShown, writeProgress } from './lib/progress-store.mjs';

const challengeMetaPath = join(REPO_ROOT, '.challenge.json');
const hintsPath = join(REPO_ROOT, '.dojo', 'HINTS.md');

if (!existsSync(challengeMetaPath) || !existsSync(hintsPath)) {
  console.error('No hay un reto activo en esta rama (falta .challenge.json o .dojo/HINTS.md).');
  console.error('Corre "npm run play" para elegir un reto primero.');
  process.exit(1);
}

const { id } = JSON.parse(readFileSync(challengeMetaPath, 'utf8'));

const sections = readFileSync(hintsPath, 'utf8')
  .split(/^##\s+/m)
  .slice(1)
  .map((block) => block.trim())
  .filter(Boolean);

if (sections.length === 0) {
  console.error('HINTS.md no tiene pistas en formato "## Pista N".');
  process.exit(1);
}

const progress = readProgress();
const shown = progress[id]?.hintsShown ?? 0;

if (shown >= sections.length) {
  console.log(`Ya viste las ${sections.length} pistas de este reto:\n`);
  sections.forEach((section) => console.log(`## ${section}\n`));
  process.exit(0);
}

console.log(`Pista ${shown + 1} de ${sections.length}:\n`);
console.log(`## ${sections[shown]}\n`);

writeProgress(recordHintShown(progress, id));
