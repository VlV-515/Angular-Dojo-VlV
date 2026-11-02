import { Component, inject } from '@angular/core';

import { AvisosService } from './avisos.service';

@Component({
  selector: 'app-historial-avisos',
  imports: [],
  // Bug 2: este `providers` crea una instancia de AvisosService distinta a la del resto del
  // árbol de inyección (la del componente padre, la de cualquier botón que registre avisos).
  // Este componente nunca ve lo que registran sus vecinos, aunque a simple vista todos parezcan
  // usar "el mismo" servicio.
  providers: [AvisosService],
  templateUrl: './historial-avisos.html',
  styleUrl: './historial-avisos.scss',
})
export class HistorialAvisos {
  private readonly avisos = inject(AvisosService);
  protected readonly historial = this.avisos.historial;
}
