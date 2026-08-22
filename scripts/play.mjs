#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { runGit } from './lib/branches.mjs';
import { readCatalog } from './lib/catalog.mjs';
import { REPO_ROOT } from './lib/paths.mjs';
import { ask } from './lib/prompt.mjs';
import { readProgress, touchStarted, writeProgress } from './lib/progress-store.mjs';

const { values } = parseArgs({
  options: {
    list: { type: 'boolean', default: false },
    slug: { type: 'string' },
  },
});

const catalog = readCatalog().filter((entry) => entry.status === 'ready');

if (catalog.length === 0) {
  console.log('Todavía no hay retos listos. Corre "npm run catalog" después de crear uno en challenges/.');
  process.exit(0);
}

const progress = readProgress();

function estadoDe(id) {
  const entry = progress[id];
  if (!entry) return 'pendiente';
  return entry.status === 'passed' ? 'aprobado' : 'en progreso';
}

function printTable(entries) {
  console.log('');
  entries.forEach((entry, index) => {
    console.log(
      `${String(index + 1).padStart(2)}) [${entry.belt.padEnd(6)}] ${entry.topic.padEnd(18)} "${entry.symptom}" · ${entry.timeMinutes} min · ${estadoDe(entry.id)} · ${entry.id}`,
    );
  });
  console.log('');
}

if (values.list) {
  printTable(catalog);
  process.exit(0);
}

async function checkout(entry) {
  const status = runGit(['status', '--porcelain']);
  if (status.trim().length > 0) {
    console.error('\nTienes cambios sin commitear. Guarda o descarta antes de cambiar de reto.\n');
    process.exit(1);
  }

  const branch = entry.branch.challenge;
  try {
    runGit(['switch', branch]);
  } catch {
    try {
      runGit(['fetch', 'origin', branch]);
      runGit(['switch', branch]);
    } catch {
      console.error(`\nNo encontré la rama "${branch}" ni local ni en origin.`);
      console.error('Si estás desarrollando el dojo localmente, corre primero: npm run build:branches\n');
      process.exit(1);
    }
  }

  writeProgress(touchStarted(progress, entry.id));

  console.log(`\nListo. Estás en la rama ${branch}.\n`);
  const briefPath = join(REPO_ROOT, 'CHALLENGE.md');
  if (existsSync(briefPath)) {
    console.log(readFileSync(briefPath, 'utf8'));
  } else {
    console.log('No encontré CHALLENGE.md en la raíz. ¿La rama se materializó bien?');
  }
}

if (values.slug) {
  const entry = catalog.find((candidate) => candidate.id === values.slug);
  if (!entry) {
    console.error(`No hay un reto "ready" con id "${values.slug}".`);
    process.exit(1);
  }
  await checkout(entry);
  process.exit(0);
}

console.log('Angular Dojo VlV — elige un reto\n');
printTable(catalog);

const answer = await ask('Número de reto (o "q" para salir): ');
if (answer.trim().toLowerCase() === 'q' || answer.trim() === '') {
  process.exit(0);
}

const chosen = catalog[Number.parseInt(answer, 10) - 1];
if (!chosen) {
  console.error('Opción inválida.');
  process.exit(1);
}

await checkout(chosen);
