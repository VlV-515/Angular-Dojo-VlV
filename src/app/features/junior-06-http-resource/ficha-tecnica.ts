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

  // Bug: la función de request de httpResource no lee `this.seleccionado()` -- siempre pide la
  // primera ficha de la lista, sin importar qué botón se presione. La reactividad de
  // httpResource depende exclusivamente de qué señales se leen dentro de esta función.
  protected readonly ficha = httpResource<Ficha>(
    () => `/api/dojo/ficha-tecnica/${OPCIONES_FICHA[0].id}`,
  );

  protected seleccionar(id: string): void {
    this.seleccionado.set(id);
  }

  // Bug: esto vuelve a poner en la señal el mismo valor que ya tenía. Angular no notifica nada
  // cuando una señal "cambia" al mismo valor, así que nunca se dispara una recarga.
  protected reintentar(): void {
    this.seleccionado.set(this.seleccionado());
  }
}
