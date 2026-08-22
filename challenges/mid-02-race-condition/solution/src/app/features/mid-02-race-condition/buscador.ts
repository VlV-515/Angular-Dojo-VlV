import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

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
        debounceTime(250),
        switchMap((q) =>
          q.trim()
            ? this.http.get<ResultadoBusqueda[]>('/api/dojo/buscar-tecnicas', { params: { q } })
            : of<ResultadoBusqueda[]>([]),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((resultados) => {
        this.resultados.set(resultados);
      });
  }

  protected buscar(q: string): void {
    this.consultas.next(q);
  }
}
