import { Component, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';

import type { Ficha } from '../../core/mock-api/fixtures/fichas';

const OPCIONES_FICHA = [
  { id: 'zenkutsu-dachi', etiqueta: 'Zenkutsu dachi' },
  { id: 'gyaku-zuki', etiqueta: 'Gyaku zuki' },
  { id: 'ushiro-geri', etiqueta: 'Ushiro geri' },
  { id: 'sanchin-dachi', etiqueta: 'Sanchin dachi' },
  { id: 'kata-fantasma', etiqueta: 'Kata fantasma (no existe)' },
] as const;

@Component({
  selector: 'app-ficha-tecnica',
  imports: [],
  templateUrl: './ficha-tecnica.html',
  styleUrl: './ficha-tecnica.scss',
})
export class FichaTecnica {
  protected readonly opciones = OPCIONES_FICHA;

  protected readonly seleccionado = signal<string>(OPCIONES_FICHA[0].id);

  // La función de request lee `this.seleccionado()`: httpResource vuelve a pedir datos cada
  // vez que esa señal cambia, porque su reactividad depende de qué señales se leen aquí adentro.
  protected readonly ficha = httpResource<Ficha>(
    () => `/api/dojo/ficha-tecnica/${this.seleccionado()}`,
  );

  protected seleccionar(id: string): void {
    this.seleccionado.set(id);
  }

  protected reintentar(): void {
    this.ficha.reload();
  }
}
