#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { hashDir } from './lib/hash.mjs';
import { REPO_ROOT } from './lib/paths.mjs';
import { readProgress, recordVerifyRun, writeProgress } from './lib/progress-store.mjs';

const challengeMetaPath = join(REPO_ROOT, '.challenge.json');

if (!existsSync(challengeMetaPath)) {
  console.error('No encontré .challenge.json en la raíz.');
  console.error('"npm run verify" corre dentro de una rama challenge/* o solution/* ya materializada, no en main.');
  process.exit(1);
}

const meta = JSON.parse(readFileSync(challengeMetaPath, 'utf8'));
const verifyDir = join(REPO_ROOT, 'verify');

if (!existsSync(verifyDir)) {
  console.error('No encontré la carpeta verify/. Esta rama parece incompleta.');
  process.exit(1);
}

const currentHashes = hashDir(verifyDir, { prefix: 'verify' });
const expectedHashes = meta.files ?? {};
const changed = Object.keys(expectedHashes).filter(
  (file) => expectedHashes[file] !== currentHashes[file],
);
const added = Object.keys(currentHashes).filter((file) => !(file in expectedHashes));

if (changed.length > 0 || added.length > 0) {
  console.error(`Los archivos de verify/ no coinciden con los originales de "${meta.id}":`);
  changed.forEach((file) => console.error(`  ~ modificado: ${file}`));
  added.forEach((file) => console.error(`  + agregado:   ${file}`));
  console.error('\nNo se puede confiar en un verify/ editado. Corre "npm run reset" para restaurarlo.');
  process.exit(1);
}

console.log(`Verificando "${meta.id}"...\n`);

const runners = [];
if (meta.verify?.build) runners.push('build');
if (meta.verify?.unit) runners.push('unit');
if (meta.verify?.e2e) runners.push('e2e');

const results = [];

for (const runner of runners) {
  console.log(`--- ${runner} ---`);
  try {
    if (runner === 'unit') {
      execFileSync('npx', ['jest', 'verify', '--config', 'jest.config.ts'], {
        cwd: REPO_ROOT,
        stdio: 'inherit',
      });
    } else if (runner === 'e2e') {
      execFileSync('npx', ['playwright', 'test', 'verify'], { cwd: REPO_ROOT, stdio: 'inherit' });
    } else if (runner === 'build') {
      execFileSync('npx', ['ng', 'build'], { cwd: REPO_ROOT, stdio: 'inherit' });
    }
    results.push({ runner, passed: true });
  } catch {
    results.push({ runner, passed: false });
  }
  console.log('');
}

const allPassed = results.length > 0 && results.every((result) => result.passed);

console.log('Resumen:');
for (const { runner, passed } of results) {
  console.log(`  ${passed ? '✅' : '❌'} ${runner}`);
}

const progress = readProgress();
writeProgress(recordVerifyRun(progress, meta.id, allPassed));

if (!allPassed) {
  console.log('\nTodavía no. Corre "npm run hint" si te atoraste.');
  process.exit(1);
}

console.log('\n¡Reto resuelto! 🥋');
