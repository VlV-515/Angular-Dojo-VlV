#!/usr/bin/env node
import { buildCatalogEntries, writeCatalog } from './lib/catalog.mjs';

const { entries, errors } = buildCatalogEntries();

if (errors.length > 0) {
  console.error('El catálogo no se generó. Errores de esquema en challenges/*/meta.json:\n');
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

writeCatalog(entries);

console.log(`challenges.json generado con ${entries.length} reto(s).`);
for (const entry of entries) {
  console.log(`  · [${entry.belt}] ${entry.id} — ${entry.title} (${entry.status})`);
}
