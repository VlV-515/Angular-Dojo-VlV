import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url)); // <repo>/scripts/lib

export const REPO_ROOT = dirname(dirname(HERE));
export const CHALLENGES_DIR = join(REPO_ROOT, 'challenges');
export const CATALOG_PATH = join(REPO_ROOT, 'challenges.json');
export const PROGRESS_PATH = join(REPO_ROOT, '.dojo-progress.json');
