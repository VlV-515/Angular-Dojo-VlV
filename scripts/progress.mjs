#!/usr/bin/env node
import { readCatalog } from './lib/catalog.mjs';
import { readProgress } from './lib/progress-store.mjs';

const catalog = readCatalog();
const progress = readProgress();

if (catalog.length === 0) {
  console.log('No hay catálogo. Corre "npm run catalog" primero.');
  process.exit(0);
}

const belts = ['blanco', 'azul', 'negro'];
const icons = { pendiente: '⏳', 'en progreso': '🟡', aprobado: '✅' };

function estadoDe(id) {
  const entry = progress[id];
  if (!entry) return 'pendiente';
  return entry.status === 'passed' ? 'aprobado' : 'en progreso';
}

console.log('Progreso — Angular Dojo VlV\n');

for (const belt of belts) {
  const challenges = catalog
    .filter((entry) => entry.belt === belt && entry.status === 'ready')
    .sort((a, b) => a.order - b.order);
  if (challenges.length === 0) continue;

  const passed = challenges.filter((entry) => estadoDe(entry.id) === 'aprobado').length;
  console.log(`Cinturón ${belt} (${passed}/${challenges.length})`);
  for (const entry of challenges) {
    const estado = estadoDe(entry.id);
    console.log(`  ${icons[estado]} ${entry.id.padEnd(28)} ${estado}`);
  }
  if (passed === challenges.length) {
    console.log(`  → ¡Cinturón ${belt} completo!`);
  }
  console.log('');
}
