import { Component } from '@angular/core';

import { INVENTARIO, STOCK_MINIMO_POR_CATEGORIA } from './data';
import { ItemDetail } from './item-detail';
// Bug 1: falta importar ItemBadge aquí y agregarlo a `imports:` — se usa en la plantilla.

@Component({
  selector: 'app-inventario-list',
  imports: [ItemDetail],
  templateUrl: './inventario-list.html',
  styleUrl: './inventario-list.scss',
})
export class InventarioList {
  protected readonly items = INVENTARIO;

  protected stockMinimo(categoria: string): number {
    // Bug 6: acceso con punto a un Record<string, number> (index signature).
    return STOCK_MINIMO_POR_CATEGORIA.categoria ?? 0;
  }
}
