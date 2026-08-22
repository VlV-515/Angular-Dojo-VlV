import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { CATALOG_PATH, CHALLENGES_DIR } from './paths.mjs';

export const LEVELS = ['junior', 'mid', 'senior'];
export const BELT_BY_LEVEL = { junior: 'blanco', mid: 'azul', senior: 'negro' };
export const BELT_ORDER = ['blanco', 'azul', 'negro'];
export const STATUSES = ['ready', 'draft', 'coming-soon'];

const SLUG_PATTERN = /^(junior|mid|senior)-(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$/;

export function parseSlug(slug) {
  const match = SLUG_PATTERN.exec(slug);
  if (!match) {
    return null;
  }
  const [, level, orderStr, shortSlug] = match;
  return { level, order: Number.parseInt(orderStr, 10), shortSlug };
}

export function listChallengeSlugs() {
  if (!existsSync(CHALLENGES_DIR)) {
    return [];
  }
  return readdirSync(CHALLENGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== '_template')
    .map((entry) => entry.name)
    .sort();
}

export function readMeta(slug) {
  const metaPath = join(CHALLENGES_DIR, slug, 'meta.json');
  return JSON.parse(readFileSync(metaPath, 'utf8'));
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === 'string' && item.trim().length > 0)
  );
}

export function validateMeta(slug, meta) {
  const errors = [];
  const parsed = parseSlug(slug);

  if (!parsed) {
    errors.push(`${slug}: el nombre de carpeta no cumple el patrón <nivel>-<NN>-<slug-corto>`);
    return errors;
  }

  if (!isNonEmptyString(meta.id) || meta.id !== slug) {
    errors.push(`${slug}: meta.id debe ser igual al nombre de la carpeta (id="${meta.id}")`);
  }
  if (!LEVELS.includes(meta.level)) {
    errors.push(`${slug}: level inválido ("${meta.level}"), debe ser uno de ${LEVELS.join(', ')}`);
  } else if (meta.level !== parsed.level) {
    errors.push(
      `${slug}: level ("${meta.level}") no coincide con el prefijo de la carpeta ("${parsed.level}")`,
    );
  }
  if (BELT_BY_LEVEL[meta.level] && meta.belt !== BELT_BY_LEVEL[meta.level]) {
    errors.push(
      `${slug}: belt ("${meta.belt}") no corresponde a level "${meta.level}" (debería ser "${BELT_BY_LEVEL[meta.level]}")`,
    );
  }
  if (!Number.isInteger(meta.order) || meta.order < 1) {
    errors.push(`${slug}: order debe ser un entero >= 1`);
  } else if (meta.order !== parsed.order) {
    errors.push(`${slug}: order (${meta.order}) no coincide con el número de la carpeta (${parsed.order})`);
  }
  if (!isNonEmptyString(meta.title)) {
    errors.push(`${slug}: falta title`);
  }
  if (!isNonEmptyString(meta.topic)) {
    errors.push(`${slug}: falta topic`);
  }
  if (!isStringArray(meta.tags)) {
    errors.push(`${slug}: tags debe ser un arreglo de strings no vacío`);
  }
  if (!isStringArray(meta.failureModes)) {
    errors.push(`${slug}: failureModes debe ser un arreglo de strings no vacío`);
  }
  if (!Number.isInteger(meta.timeMinutes) || meta.timeMinutes <= 0) {
    errors.push(`${slug}: timeMinutes debe ser un entero positivo`);
  }
  if (!Number.isInteger(meta.bugs) || meta.bugs < 0) {
    errors.push(`${slug}: bugs debe ser un entero >= 0`);
  }
  if (typeof meta.verify !== 'object' || meta.verify === null) {
    errors.push(`${slug}: falta verify {unit, e2e, build}`);
  } else {
    for (const key of ['unit', 'e2e', 'build']) {
      if (typeof meta.verify[key] !== 'boolean') {
        errors.push(`${slug}: verify.${key} debe ser boolean`);
      }
    }
    if (!meta.verify.unit && !meta.verify.e2e && !meta.verify.build) {
      errors.push(`${slug}: verify necesita al menos un runner en true`);
    }
  }
  if (!STATUSES.includes(meta.status)) {
    errors.push(`${slug}: status inválido ("${meta.status}"), debe ser uno de ${STATUSES.join(', ')}`);
  }

  return errors;
}

function toCatalogEntry(slug, meta) {
  const parsed = parseSlug(slug);
  return {
    id: meta.id,
    level: meta.level,
    belt: meta.belt,
    order: meta.order,
    title: meta.title,
    topic: meta.topic,
    tags: meta.tags,
    failureModes: meta.failureModes,
    symptom: meta.failureModes.join(' · '),
    timeMinutes: meta.timeMinutes,
    bugs: meta.bugs,
    verify: meta.verify,
    status: meta.status,
    shortSlug: parsed.shortSlug,
    branch: {
      challenge: `challenge/${meta.level}/${parsed.shortSlug}`,
      solution: `solution/${meta.level}/${parsed.shortSlug}`,
    },
  };
}

/** Lee challenges/*, valida y arma las entradas del catálogo. No escribe nada a disco. */
export function buildCatalogEntries() {
  const errors = [];
  const entries = [];

  for (const slug of listChallengeSlugs()) {
    let meta;
    try {
      meta = readMeta(slug);
    } catch (error) {
      errors.push(`${slug}: no se pudo leer meta.json (${error.message})`);
      continue;
    }
    const metaErrors = validateMeta(slug, meta);
    if (metaErrors.length > 0) {
      errors.push(...metaErrors);
      continue;
    }
    entries.push(toCatalogEntry(slug, meta));
  }

  entries.sort((a, b) => {
    const beltDiff = BELT_ORDER.indexOf(a.belt) - BELT_ORDER.indexOf(b.belt);
    return beltDiff !== 0 ? beltDiff : a.order - b.order;
  });

  return { entries, errors };
}

export function writeCatalog(entries) {
  writeFileSync(CATALOG_PATH, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');
}

export function readCatalog() {
  if (!existsSync(CATALOG_PATH)) {
    return [];
  }
  return JSON.parse(readFileSync(CATALOG_PATH, 'utf8'));
}
