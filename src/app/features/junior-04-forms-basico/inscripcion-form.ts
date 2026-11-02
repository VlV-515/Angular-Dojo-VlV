import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface InscripcionValue {
  readonly nombre: string;
  readonly cinturon: string;
  readonly aceptoReglamento: boolean;
}

@Component({
  selector: 'app-inscripcion-form',
  imports: [ReactiveFormsModule],
  templateUrl: './inscripcion-form.html',
  styleUrl: './inscripcion-form.scss',
})
export class InscripcionForm {
  protected readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cinturon: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    aceptoReglamento: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  });

  protected readonly controlNombre = this.form.controls.nombre;
  protected readonly controlCinturon = this.form.controls.cinturon;
  protected readonly controlAcepto = this.form.controls.aceptoReglamento;

  protected enviado: InscripcionValue | null = null;

  protected onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.enviado = this.form.getRawValue();
  }
}
