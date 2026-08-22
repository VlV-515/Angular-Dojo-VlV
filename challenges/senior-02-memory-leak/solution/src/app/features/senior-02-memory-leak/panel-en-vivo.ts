import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  private readonly destroyRef = inject(DestroyRef);

  protected readonly enLinea = signal(typeof navigator === 'undefined' || navigator.onLine);
  protected readonly segundos = signal(0);

  private readonly onlineHandler = (): void => this.enLinea.set(true);
  private readonly offlineHandler = (): void => this.enLinea.set(false);

  constructor() {
    window.addEventListener('online', this.onlineHandler);
    window.addEventListener('offline', this.offlineHandler);
    recursosAbiertos.listeners += 1;
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('online', this.onlineHandler);
      window.removeEventListener('offline', this.offlineHandler);
      recursosAbiertos.listeners -= 1;
    });

    interval(1000)
      .pipe(
        tap({
          subscribe: () => {
            recursosAbiertos.subscripciones += 1;
          },
          unsubscribe: () => {
            recursosAbiertos.subscripciones -= 1;
          },
        }),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.segundos.update((s) => s + 1));

    effect((onCleanup) => {
      recursosAbiertos.efectos += 1;
      onCleanup(() => {
        recursosAbiertos.efectos -= 1;
      });
    });
  }
}
