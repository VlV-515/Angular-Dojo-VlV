import { Component, ElementRef, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import type { ConsejoPractica } from '../../core/mock-api/fixtures/practica';

@Component({
  selector: 'app-panel-practica',
  imports: [],
  templateUrl: './panel-practica.html',
  styleUrl: './panel-practica.scss',
})
export class PanelPractica {
  private readonly http = inject(HttpClient);
  private readonly elementRef = inject(ElementRef);

  // Bug 2: acceso directo a `window` en un inicializador de campo, sin guardia de plataforma.
  // En el servidor esto revienta con "ReferenceError: window is not defined" antes de poder
  // renderizar nada de esta página.
  protected readonly visto = signal(window.localStorage.getItem('senior-03-visto') === '1');

  protected readonly consejo = signal<ConsejoPractica | null>(null);

  constructor() {
    // Bug 1 (NG0500/NG0501): un "widget" que mete HTML directo en el DOM del componente en vez
    // de dejar que Angular lo controle. Está guardado para no correr en el servidor (no revienta
    // como el bug 2), pero igual rompe la hidratación: en cuanto el navegador arranca, mete un
    // nodo extra al principio del componente y el DOM ya no calza, nodo a nodo, con el HTML que
    // mandó el servidor.
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      const host = this.elementRef.nativeElement as HTMLElement;
      host.insertAdjacentHTML('afterbegin', '<p class="bienvenida">¡Bienvenido de vuelta!</p>');
    }

    // Bug 3: esta petición corre en el servidor (para armar el HTML inicial) Y otra vez en el
    // cliente al arrancar — nada guarda el resultado del servidor para que el cliente lo
    // reutilice, así que es la misma llamada disparada dos veces.
    this.http.get<ConsejoPractica>('/api/dojo/practica').subscribe((data) => {
      this.consejo.set(data);
    });
  }

  protected marcarVisto(): void {
    window.localStorage.setItem('senior-03-visto', '1');
    this.visto.set(true);
  }
}
