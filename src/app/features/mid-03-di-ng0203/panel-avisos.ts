import { Component, InjectionToken, inject } from '@angular/core';

import { AvisosService } from './avisos.service';
import { HistorialAvisos } from './historial-avisos';

// Bug 3: esto DEBERÍA ser un `import { PREFIJO_AVISO } from './avisos.service'`. En cambio,
// alguien volvió a declarar un token con el mismo nombre "de pizarrón" — pero es una instancia
// de `InjectionToken` completamente distinta a la que exporta `avisos.service.ts`. Nadie provee
// esta copia en ningún lado, así que siempre resuelve a su valor de fábrica, sin importar lo que
// configure la ruta en `app.routes.ts`.
const PREFIJO_AVISO = new InjectionToken<string>('PREFIJO_AVISO', {
  factory: () => '📋 ',
});

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
      // Bug 1: `inject()` se llama aquí, dentro de un callback de `setTimeout` que corre mucho
      // después de que el constructor de `PanelAvisos` ya terminó. Para ese momento no hay
      // ningún contexto de inyección activo → Angular lanza NG0203.
      const avisos = inject(AvisosService);
      avisos.registrar('Recordatorio: revisa tu entrenamiento de hoy');
    }, 1500);
  }
}
