import { Component, computed, input } from '@angular/core';

import { INVENTARIO } from './data';

@Component({
  selector: 'app-item-detail',
  imports: [],
  templateUrl: './item-detail.html',
  styleUrl: './item-detail.scss',
})
export class ItemDetail {
  readonly id = input.required<string>();
  protected readonly item = computed(() => INVENTARIO.find((i) => i.id === this.id()));
}
