import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import type { Alumno } from './data';

@Component({
  selector: 'app-alumno-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './alumno-row.html',
  styleUrl: './alumno-row.scss',
})
export class AlumnoRow {
  @Input({ required: true }) alumno!: Alumno;
  @Output() readonly marcarPresente = new EventEmitter<string>();
}
