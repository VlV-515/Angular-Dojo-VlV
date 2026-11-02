import { Component, inject } from '@angular/core';

import { AvisosService, PREFIJO_AVISO } from './avisos.service';
import { HistorialAvisos } from './historial-avisos';

@Component({
  selector: 'app-panel-avisos',
  imports: [HistorialAvisos],
  templateUrl: './panel-avisos.html',
  styleUrl: './panel-avisos.scss',
})
export class PanelAvisos {
  private readonly avisos = inject(AvisosService);
  protected readonly prefijo = inject(PREFIJO_AVISO);

  protected programarRecordatorio(): void {
    setTimeout(() => {
      // Arreglado: `avisos` ya se capturó como campo de la clase (con `inject()` corriendo
      // dentro de un contexto de inyección válido, al construir el componente). Acá adentro
      // solo lo usamos, no lo volvemos a inyectar.
      this.avisos.registrar('Recordatorio: revisa tu entrenamiento de hoy');
    }, 1500);
  }
}
