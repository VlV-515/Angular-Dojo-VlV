import { Component, effect, signal } from '@angular/core';
import { interval } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Contador de recursos abiertos por instancias de `PanelEnVivo`. No es parte del bug: es la
 * forma en la que los tests de este reto comprueban si algo se quedó vivo después de destruir
 * el componente. En una app real usarías DevTools / un profiler de memoria en su lugar.
 */
export const recursosAbiertos = { listeners: 0, subscripciones: 0, efectos: 0 };

if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>)['__dojoRecursosAbiertos'] = recursosAbiertos;
}

@Component({
  selector: 'app-panel-en-vivo',
  imports: [],
  templateUrl: './panel-en-vivo.html',
  styleUrl: './panel-en-vivo.scss',
})
export class PanelEnVivo {
  protected readonly enLinea = signal(typeof navigator === 'undefined' || navigator.onLine);
  protected readonly segundos = signal(0);

  private readonly onlineHandler = (): void => this.enLinea.set(true);
  private readonly offlineHandler = (): void => this.enLinea.set(false);

  constructor() {
    // Bug: este listener nunca se remueve al destruir el componente.
    window.addEventListener('online', this.onlineHandler);
    window.addEventListener('offline', this.offlineHandler);
    recursosAbiertos.listeners += 1;

    // Bug: sin `takeUntilDestroyed()`, esta suscripción sigue viva para siempre, incluso
    // después de que el componente se destruya.
    interval(1000)
      .pipe(
        tap({
          subscribe: () => {
            recursosAbiertos.subscripciones += 1;
          },
        }),
      )
      .subscribe(() => this.segundos.update((s) => s + 1));

    // Bug: este efecto abre un recurso (aquí, simulado con el contador) pero nunca registra
    // una limpieza con `onCleanup`, ni con `DestroyRef`.
    effect(() => {
      recursosAbiertos.efectos += 1;
    });
  }
}
