import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

export async function ask(question) {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    return await rl.question(question);
  } finally {
    rl.close();
  }
}

export async function confirm(question) {
  const answer = await ask(`${question} (s/N) `);
  return ['s', 'si', 'sí', 'y', 'yes'].includes(answer.trim().toLowerCase());
}
