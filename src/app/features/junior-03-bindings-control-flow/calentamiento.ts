import { Component, computed, signal } from '@angular/core';

export interface ItemCalentamiento {
  readonly id: string;
  nombre: string;
  hecho: boolean;
}

const ITEMS_INICIALES: readonly ItemCalentamiento[] = [
  { id: 'estiramiento', nombre: 'Estiramiento de piernas', hecho: false },
  { id: 'saltos', nombre: 'Saltos de tijera', hecho: false },
  { id: 'sombra', nombre: 'Combate a la sombra', hecho: false },
];

@Component({
  selector: 'app-calentamiento',
  imports: [],
  templateUrl: './calentamiento.html',
  styleUrl: './calentamiento.scss',
})
export class Calentamiento {
  protected readonly items = signal<ItemCalentamiento[]>(ITEMS_INICIALES.map((item) => ({ ...item })));

  protected readonly todosListos = computed(() => this.items().every((item) => item.hecho));
  protected readonly total = computed(() => this.items().length);
  protected readonly hechos = computed(() => this.items().filter((item) => item.hecho).length);

  protected readonly nuevoNombre = signal('');

  protected marcar(id: string): void {
    this.items.update((lista) =>
      lista.map((item) => (item.id === id ? { ...item, hecho: !item.hecho } : item)),
    );
  }

  protected quitar(id: string): void {
    this.items.update((lista) => lista.filter((item) => item.id !== id));
  }

  protected renombrar(id: string, event: Event): void {
    const nombre = (event.target as HTMLInputElement).value;
    this.items.update((lista) =>
      lista.map((item) => (item.id === id ? { ...item, nombre } : item)),
    );
  }

  protected onNuevoNombreInput(event: Event): void {
    this.nuevoNombre.set((event.target as HTMLInputElement).value);
  }

  protected agregar(): void {
    const nombre = this.nuevoNombre().trim();
    if (!nombre) {
      return;
    }
    this.items.update((lista) => [
      ...lista,
      { id: crypto.randomUUID(), nombre, hecho: false },
    ]);
    this.nuevoNombre.set('');
  }
}
