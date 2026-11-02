import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

import type { DatoPanel } from '../../core/mock-api/fixtures/panel';

@Component({
  selector: 'app-panel',
  imports: [RouterLink],
  templateUrl: './panel.html',
  styleUrl: './panel.scss',
})
export class Panel {
  private readonly http = inject(HttpClient);

  protected readonly datos = signal<readonly DatoPanel[]>([]);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.http.get<DatoPanel[]>('/api/dojo/panel-datos').subscribe({
      next: (datos) => this.datos.set(datos),
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.message ?? 'No se pudo cargar el panel.');
      },
    });
  }
}
