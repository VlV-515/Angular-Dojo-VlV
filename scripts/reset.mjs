#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { runGit } from './lib/branches.mjs';
import { REPO_ROOT } from './lib/paths.mjs';
import { confirm } from './lib/prompt.mjs';

const challengeMetaPath = join(REPO_ROOT, '.challenge.json');

if (!existsSync(challengeMetaPath)) {
  console.error('No hay un reto activo en esta rama (falta .challenge.json).');
  console.error('"npm run reset" solo tiene sentido dentro de una rama challenge/* o solution/*.');
  process.exit(1);
}

const { id } = JSON.parse(readFileSync(challengeMetaPath, 'utf8'));

console.log(
  `Esto va a descartar TODOS tus cambios sin commitear en "${id}" y restaurar los archivos originales.`,
);
const sure = await confirm('¿Seguro que quieres continuar?');

if (!sure) {
  console.log('Cancelado. No se tocó nada.');
  process.exit(0);
}

runGit(['checkout', '--', '.'], { cwd: REPO_ROOT });
runGit(['clean', '-fd'], { cwd: REPO_ROOT });

console.log(`Listo. "${id}" quedó como recién materializado.`);
