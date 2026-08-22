import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TECNICAS } from './data';

@Component({
  selector: 'app-tecnicas-detail',
  imports: [RouterLink],
  templateUrl: './tecnicas-detail.html',
  styleUrl: './tecnicas-detail.scss',
})
export class TecnicasDetail {
  readonly id = input.required<string>();
  protected readonly tecnica = computed(() => TECNICAS.find((t) => t.id === this.id()));
}
