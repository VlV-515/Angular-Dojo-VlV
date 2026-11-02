import { Injectable, InjectionToken, signal } from '@angular/core';

/**
 * Prefijo visual que antecede el título del panel. Normalmente lo configura la ruta que monta
 * este feature (ver `app.routes.ts`); si nadie lo provee, cae en el valor de fábrica de acá
 * abajo. No es parte del bug — es la pieza que un bug en otro archivo termina ignorando.
 */
export const PREFIJO_AVISO = new InjectionToken<string>('PREFIJO_AVISO', {
  factory: () => '📋 ',
});

@Injectable({ providedIn: 'root' })
export class AvisosService {
  private readonly _historial = signal<readonly string[]>([]);
  readonly historial = this._historial.asReadonly();

  registrar(mensaje: string): void {
    this._historial.update((actual) => [...actual, mensaje]);
  }
}
