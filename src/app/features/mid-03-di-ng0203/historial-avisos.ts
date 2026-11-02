import { Component, inject } from '@angular/core';

import { AvisosService } from './avisos.service';

@Component({
  selector: 'app-historial-avisos',
  imports: [],
  templateUrl: './historial-avisos.html',
  styleUrl: './historial-avisos.scss',
})
export class HistorialAvisos {
  private readonly avisos = inject(AvisosService);
  protected readonly historial = this.avisos.historial;
}
