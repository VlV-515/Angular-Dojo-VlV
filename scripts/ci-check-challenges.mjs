#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

import { buildCatalogEntries, writeCatalog } from './lib/catalog.mjs';
import { materializeChallenge, removeWorktree } from './lib/branches.mjs';

const { entries, errors } = buildCatalogEntries();
if (errors.length > 0) {
  console.error('Catálogo inválido:');
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}
writeCatalog(entries);

const ready = entries.filter((entry) => entry.status === 'ready');
if (ready.length === 0) {
  console.error('No hay retos en estado "ready" para validar.');
  process.exit(1);
}

const plan = [
  ['challenge', false], // en estado roto, verify debe FALLAR
  ['solution', true], // en estado solución, verify debe PASAR
];

const rows = [];
let allOk = true;

for (const entry of ready) {
  for (const [variant, expectPass] of plan) {
    const { dir } = materializeChallenge({ entry, variant, real: false });

    let passed = false;
    let output = '';
    try {
      output = execFileSync('node', ['scripts/verify.mjs'], { cwd: dir, encoding: 'utf8' });
      passed = true;
    } catch (error) {
      passed = false;
      output = `${error.stdout ?? ''}${error.stderr ?? ''}`;
    }

    removeWorktree(dir);

    const invariantOk = passed === expectPass;
    allOk &&= invariantOk;
    rows.push({ id: entry.id, variant, expectPass, passed, invariantOk, output });
  }
}

console.log('\nInvariante de calidad por reto (roto debe FALLAR, solución debe PASAR):\n');
const idWidth = Math.max(...rows.map((row) => row.id.length), 2);

for (const row of rows) {
  const mark = row.invariantOk ? '✅' : '❌';
  const expected = row.expectPass ? 'PASA' : 'FALLA';
  const actual = row.passed ? 'PASA' : 'FALLA';
  console.log(
    `${mark} ${row.id.padEnd(idWidth)}  ${row.variant.padEnd(9)}  esperado=${expected.padEnd(5)}  real=${actual.padEnd(5)}`,
  );
  if (!row.invariantOk) {
    console.log(`\n--- salida de ${row.id} (${row.variant}) ---\n${row.output}\n`);
  }
}

if (!allOk) {
  console.error('\nAlgún reto rompe el invariante. Revisa la salida de arriba.');
  process.exit(1);
}

console.log('\nTodos los retos cumplen el invariante.');
