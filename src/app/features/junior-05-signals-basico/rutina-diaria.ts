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
  protected readonly metaDiaria = signal(5);

  protected readonly metaTexto = computed(() => `Meta: ${this.metaDiaria()} repeticiones al día`);

  protected incrementar(): void {
    this.contador.update((valor) => valor + 1);
  }

  protected sumarRacha(): void {
    this.racha.update((valor) => valor + 1);
  }

  protected subirMeta(): void {
    this.metaDiaria.update((valor) => valor + 1);
  }
}
