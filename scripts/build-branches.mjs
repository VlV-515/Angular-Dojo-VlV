#!/usr/bin/env node
import { parseArgs } from 'node:util';

import { buildCatalogEntries, writeCatalog } from './lib/catalog.mjs';
import { commitWorktree, materializeChallenge, removeWorktree } from './lib/branches.mjs';

const { values } = parseArgs({
  options: {
    'dry-run': { type: 'boolean', default: false },
    push: { type: 'boolean', default: false },
    only: { type: 'string' },
    keep: { type: 'boolean', default: false },
  },
});

const { entries, errors } = buildCatalogEntries();
if (errors.length > 0) {
  console.error('No genero ramas: el catálogo tiene errores. Corre "npm run catalog" para verlos.');
  process.exit(1);
}
writeCatalog(entries);

const ready = entries.filter((entry) => entry.status === 'ready');
const targets = values.only ? ready.filter((entry) => entry.id === values.only) : ready;

if (targets.length === 0) {
  console.error(`No hay retos "ready" que coincidan con --only=${values.only ?? '(todos)'}.`);
  process.exit(1);
}

const dryRun = values['dry-run'];
console.log(
  dryRun
    ? 'Modo --dry-run: materializa en carpetas temporales, no crea ramas ni toca remotos.\n'
    : 'Generando ramas locales desde el tag base-v1 (sin push).\n',
);

const results = [];

for (const entry of targets) {
  for (const variant of /** @type {const} */ (['challenge', 'solution'])) {
    const { dir, branchName } = materializeChallenge({ entry, variant, real: !dryRun });

    if (!dryRun) {
      commitWorktree(dir, branchName);
    }

    console.log(`${dryRun ? '[dry-run] ' : '[ok]      '}${branchName.padEnd(32)} <- ${dir}`);
    results.push({ branchName, dir });

    if (!values.keep) {
      removeWorktree(dir);
    }
  }
}

if (values.push) {
  console.log('\n--push no está implementado todavía: revisa las ramas locales y publícalas cuando quieras.');
}

console.log(
  `\nListo. ${results.length} rama(s) ${dryRun ? 'materializada(s) en temporal' : 'creada(s)/actualizada(s) localmente'}.`,
);
