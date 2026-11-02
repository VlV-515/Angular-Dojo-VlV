import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-rutina-diaria',
  imports: [],
  templateUrl: './rutina-diaria.html',
  styleUrl: './rutina-diaria.scss',
})
export class RutinaDiaria {
  protected readonly contador = signal(0);
  protected readonly racha = signal(0);

  // Bug: `metaDiaria` es una propiedad plana, no una señal.
  protected metaDiaria = 5;

  // Bug: este `computed` solo lee `metaDiaria` como propiedad de la clase (no una señal), así
  // que no tiene ninguna dependencia reactiva. Angular lo calcula una vez y lo deja en caché
  // para siempre: no importa cuántas veces cambie `metaDiaria` después, el texto no se actualiza.
  protected readonly metaTexto = computed(() => `Meta: ${this.metaDiaria} repeticiones al día`);

  protected incrementar(): void {
    // Bug: esto copia el valor actual de la señal a una variable local (que por desgracia se
    // llama igual) y le suma 1 ahí mismo. Nunca se llama a `.set()` ni a `.update()` sobre la
    // señal `contador`, así que el estado real del componente nunca cambia.
    let contador = this.contador();
    contador = contador + 1;
  }

  protected sumarRacha(): void {
    // Bug: `.update()` sí se está llamando, pero la función que recibe regresa el mismo valor
    // que entra — un no-op. Debería sumar 1.
    this.racha.update((valor) => valor);
  }

  protected subirMeta(): void {
    this.metaDiaria += 1;
  }
}
