import {
  Component,
  PLATFORM_ID,
  TransferState,
  afterNextRender,
  inject,
  makeStateKey,
  signal,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import type { ConsejoPractica } from '../../core/mock-api/fixtures/practica';

const CONSEJO_KEY = makeStateKey<ConsejoPractica>('senior-03-consejo');

@Component({
  selector: 'app-panel-practica',
  imports: [],
  templateUrl: './panel-practica.html',
  styleUrl: './panel-practica.scss',
})
export class PanelPractica {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly transferState = inject(TransferState);

  // Fix bug 2: arranca en un valor neutro; `window` solo se toca dentro de `afterNextRender`,
  // que por defecto solo se ejecuta en el navegador (nunca durante el render en el servidor).
  protected readonly visto = signal(false);

  // Fix bug 1 (NG0500/NG0501): en vez de meter HTML a mano con `insertAdjacentHTML` (que Angular
  // no controla ni sabe que existe), esto ahora es una señal más, pintada por el propio template
  // con `@if`. Arranca en `false` tanto en servidor como en el primer render del cliente — los
  // dos árboles calzan al hidratar — y solo después, dentro de `afterNextRender`, pasa a `true`;
  // ese cambio ya es una actualización normal de Angular, no parte de la hidratación.
  protected readonly mostrarBienvenida = signal(false);

  protected readonly consejo = signal<ConsejoPractica | null>(null);

  constructor() {
    afterNextRender(() => {
      this.visto.set(window.localStorage.getItem('senior-03-visto') === '1');
      this.mostrarBienvenida.set(true);
    });

    // Fix bug 3: si el servidor ya dejó el consejo guardado en el TransferState, el cliente lo
    // reutiliza tal cual al arrancar en vez de volver a pedirlo. Solo se hace la petición de
    // verdad cuando no hay nada guardado — es decir, en el propio servidor.
    const cacheado = this.transferState.get(CONSEJO_KEY, null);
    if (cacheado) {
      this.consejo.set(cacheado);
      this.transferState.remove(CONSEJO_KEY);
    } else {
      this.http.get<ConsejoPractica>('/api/dojo/practica').subscribe((data) => {
        this.consejo.set(data);
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(CONSEJO_KEY, data);
        }
      });
    }
  }

  protected marcarVisto(): void {
    window.localStorage.setItem('senior-03-visto', '1');
    this.visto.set(true);
  }
}
