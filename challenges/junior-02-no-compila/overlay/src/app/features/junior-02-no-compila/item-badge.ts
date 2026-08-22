import { Component, input } from '@angular/core';

@Component({
  selector: 'app-item-badge',
  imports: [],
  templateUrl: './item-badge.html',
  styleUrl: './item-badge.scss',
})
export class ItemBadge {
  readonly nivel = input.required<number>();
}
