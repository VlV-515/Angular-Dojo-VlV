import { existsSync, readFileSync, writeFileSync } from 'node:fs';

import { PROGRESS_PATH } from './paths.mjs';

export function readProgress() {
  if (!existsSync(PROGRESS_PATH)) {
    return {};
  }
  try {
    return JSON.parse(readFileSync(PROGRESS_PATH, 'utf8'));
  } catch {
    return {};
  }
}

export function writeProgress(progress) {
  writeFileSync(PROGRESS_PATH, `${JSON.stringify(progress, null, 2)}\n`, 'utf8');
}

function entryOrDefault(progress, id) {
  const now = new Date().toISOString();
  return (
    progress[id] ?? {
      status: 'started',
      attempts: 0,
      hintsShown: 0,
      firstStartedAt: now,
    }
  );
}

export function touchStarted(progress, id) {
  const entry = entryOrDefault(progress, id);
  entry.lastStartedAt = new Date().toISOString();
  progress[id] = entry;
  return progress;
}

export function recordVerifyRun(progress, id, allPassed) {
  const now = new Date().toISOString();
  const entry = entryOrDefault(progress, id);
  entry.attempts = (entry.attempts ?? 0) + 1;
  entry.lastVerifyAt = now;
  entry.status = allPassed ? 'passed' : 'in-progress';
  if (allPassed) {
    entry.passedAt = entry.passedAt ?? now;
  }
  progress[id] = entry;
  return progress;
}

export function recordHintShown(progress, id) {
  const entry = entryOrDefault(progress, id);
  entry.hintsShown = (entry.hintsShown ?? 0) + 1;
  entry.lastHintAt = new Date().toISOString();
  progress[id] = entry;
  return progress;
}
