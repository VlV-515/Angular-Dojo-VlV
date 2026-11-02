import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TECNICAS } from './data';

@Component({
  selector: 'app-tecnicas-detail',
  imports: [RouterLink],
  templateUrl: './tecnicas-detail.html',
  styleUrl: './tecnicas-detail.scss',
})
export class TecnicasDetail {
  protected readonly tecnica = TECNICAS[0];
}
