export type ChallengeLevel = 'junior' | 'mid' | 'senior';
export type ChallengeBelt = 'blanco' | 'azul' | 'negro';
export type ChallengeStatus = 'ready' | 'draft' | 'coming-soon';

export interface ChallengeVerifyFlags {
  readonly unit: boolean;
  readonly e2e: boolean;
  readonly build: boolean;
}

export interface ChallengeBranches {
  readonly challenge: string;
  readonly solution: string;
}

export interface Challenge {
  readonly id: string;
  readonly level: ChallengeLevel;
  readonly belt: ChallengeBelt;
  readonly order: number;
  readonly title: string;
  readonly topic: string;
  readonly tags: readonly string[];
  readonly failureModes: readonly string[];
  readonly symptom: string;
  readonly timeMinutes: number;
  readonly bugs: number;
  readonly verify: ChallengeVerifyFlags;
  readonly status: ChallengeStatus;
  readonly shortSlug: string;
  readonly branch: ChallengeBranches;
}
