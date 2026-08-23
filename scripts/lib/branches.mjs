import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { hashDir } from './hash.mjs';
import { REPO_ROOT } from './paths.mjs';

export function runGit(args, options = {}) {
  return execFileSync('git', args, {
    cwd: options.cwd ?? REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function freshTempPath(base) {
  ensureDir(base);
  const dir = mkdtempSync(join(base, 'tmp-'));
  // mkdtemp crea el directorio; git worktree add necesita crearlo él mismo.
  rmSync(dir, { recursive: true, force: true });
  return dir;
}

/**
 * Materializa un reto (challenge|solution) en un worktree desconectado de `base-v1`.
 * `real: true` crea/actualiza además la rama local `entry.branch[variant]`.
 * Devuelve { dir, branchName }; quien llama es responsable de limpiar con removeWorktree.
 */
export function materializeChallenge({ entry, variant, real }) {
  const slug = entry.id;
  const challengeDir = join(REPO_ROOT, 'challenges', slug);
  const base = real ? join(REPO_ROOT, '.worktrees') : join(tmpdir(), 'angular-dojo-worktrees');
  const dir = freshTempPath(base);
  const branchName = entry.branch[variant];

  if (real) {
    runGit(['worktree', 'add', '-B', branchName, dir, 'base-v1']);
  } else {
    runGit(['worktree', 'add', '--detach', dir, 'base-v1']);
  }

  // La fuente (challenges/, y el propio generador) no viaja a las ramas.
  rmSync(join(dir, 'challenges'), { recursive: true, force: true });
  rmSync(join(dir, 'scripts', 'build-branches.mjs'), { force: true });

  cpSync(join(challengeDir, 'overlay'), dir, { recursive: true });
  if (variant === 'solution') {
    cpSync(join(challengeDir, 'solution'), dir, { recursive: true });
  }

  const verifyDest = join(dir, 'verify');
  ensureDir(verifyDest);
  cpSync(join(challengeDir, 'verify'), verifyDest, { recursive: true });

  cpSync(join(challengeDir, 'CHALLENGE.md'), join(dir, 'CHALLENGE.md'));

  ensureDir(join(dir, '.dojo'));
  cpSync(join(challengeDir, 'HINTS.md'), join(dir, '.dojo', 'HINTS.md'));

  cpSync(join(REPO_ROOT, 'challenges.json'), join(dir, 'challenges.json'));

  const challengeMeta = {
    id: entry.id,
    level: entry.level,
    belt: entry.belt,
    variant,
    branch: entry.branch,
    verify: entry.verify,
    files: hashDir(join(challengeDir, 'verify'), { prefix: 'verify' }),
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(join(dir, '.challenge.json'), `${JSON.stringify(challengeMeta, null, 2)}\n`, 'utf8');

  const nodeModulesLink = join(dir, 'node_modules');
  if (!existsSync(nodeModulesLink)) {
    symlinkSync(join(REPO_ROOT, 'node_modules'), nodeModulesLink, 'dir');
  }

  return { dir, branchName };
}

export function commitWorktree(dir, branchName) {
  runGit(['add', '-A'], { cwd: dir });
  runGit(['commit', '--quiet', '-m', `chore(dojo): materializa ${branchName}`], { cwd: dir });
}

export function removeWorktree(dir) {
  try {
    runGit(['worktree', 'remove', '--force', dir]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Publica una rama local a `origin` con --force-with-lease (nunca --force a secas). */
export function pushBranch(branchName) {
  runGit(['push', '--force-with-lease', 'origin', `refs/heads/${branchName}:refs/heads/${branchName}`]);
}
