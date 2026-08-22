import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import type { ResultadoBusqueda } from '../../core/mock-api/fixtures/buscador';

@Component({
  selector: 'app-buscador',
  imports: [],
  templateUrl: './buscador.html',
  styleUrl: './buscador.scss',
})
export class Buscador {
  private readonly http = inject(HttpClient);

  protected readonly resultados = signal<ResultadoBusqueda[]>([]);

  private readonly consultas = new Subject<string>();

  constructor() {
    this.consultas
      .pipe(
        // Bug: `mergeMap` deja correr todas las peticiones en paralelo, sin cancelar la
        // anterior — la última respuesta en llegar gana, sin importar cuál se pidió al final.
        mergeMap((q) =>
          this.http.get<ResultadoBusqueda[]>('/api/dojo/buscar-tecnicas', { params: { q } }),
        ),
        // Bug: sin debounceTime, cada tecla dispara su propia petición.
        // Bug: sin takeUntilDestroyed, esta suscripción nunca se cierra sola.
      )
      .subscribe((resultados) => {
        this.resultados.set(resultados);
      });
  }

  protected buscar(q: string): void {
    this.consultas.next(q);
  }
}
