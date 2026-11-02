import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { INVENTARIO, STOCK_MINIMO_POR_CATEGORIA } from './data';
import { ItemBadge } from './item-badge';
import { ItemDetail } from './item-detail';

@Component({
  selector: 'app-inventario-list',
  imports: [ItemBadge, ItemDetail, DecimalPipe],
  templateUrl: './inventario-list.html',
  styleUrl: './inventario-list.scss',
})
export class InventarioList {
  protected readonly items = INVENTARIO;

  protected stockMinimo(categoria: string): number {
    return STOCK_MINIMO_POR_CATEGORIA[categoria] ?? 0;
  }
}
