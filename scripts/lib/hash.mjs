import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

function listFilesRecursive(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listFilesRecursive(full));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

export function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

/** Hashea todos los archivos de un directorio. Claves con '/', estables entre SO. */
export function hashDir(dir, { prefix = '' } = {}) {
  const hashes = {};
  for (const file of listFilesRecursive(dir)) {
    const rel = relative(dir, file).split('\\').join('/');
    hashes[prefix ? `${prefix}/${rel}` : rel] = sha256File(file);
  }
  return hashes;
}
