import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TECNICAS } from './data';

@Component({
  selector: 'app-tecnicas-list',
  imports: [RouterLink],
  templateUrl: './tecnicas-list.html',
  styleUrl: './tecnicas-list.scss',
})
export class TecnicasList {
  protected readonly tecnicas = TECNICAS;
}
