import { Component, computed, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';

import type { Challenge, ChallengeBelt } from '../../core/models/challenge';

interface BeltGroup {
  readonly belt: ChallengeBelt;
  readonly label: string;
  readonly challenges: readonly Challenge[];
}

const BELT_LABELS: Record<ChallengeBelt, string> = {
  blanco: 'Cinturón blanco · junior',
  azul: 'Cinturón azul · mid',
  negro: 'Cinturón negro · senior',
};

const BELT_ORDER: readonly ChallengeBelt[] = ['blanco', 'azul', 'negro'];

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly catalog = httpResource<Challenge[]>(() => 'challenges.json', {
    defaultValue: [],
  });

  protected readonly copiedId = signal<string | null>(null);

  protected readonly totalChallenges = computed(() => this.catalog.value()?.length ?? 0);

  protected readonly belts = computed<readonly BeltGroup[]>(() => {
    const challenges = this.catalog.value() ?? [];
    return BELT_ORDER.map((belt) => ({
      belt,
      label: BELT_LABELS[belt],
      challenges: challenges
        .filter((challenge) => challenge.belt === belt)
        .slice()
        .sort((a, b) => a.order - b.order),
    })).filter((group) => group.challenges.length > 0);
  });

  protected async copyCommand(challenge: Challenge): Promise<void> {
    const command = `git fetch origin && git switch ${challenge.branch.challenge}`;
    try {
      await navigator.clipboard.writeText(command);
      this.copiedId.set(challenge.id);
      setTimeout(() => {
        if (this.copiedId() === challenge.id) {
          this.copiedId.set(null);
        }
      }, 2000);
    } catch {
      this.copiedId.set(null);
    }
  }
}
