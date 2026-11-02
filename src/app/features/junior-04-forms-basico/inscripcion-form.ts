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
    // Bug: le falta Validators.requiredTrue. Sin él, este control siempre es válido sin
    // importar su valor, así que nunca bloquea al formulario aunque nadie lo haya aceptado.
    aceptoReglamento: new FormControl(false, { nonNullable: true }),
  });

  protected readonly controlNombre = this.form.controls.nombre;
  protected readonly controlCinturon = this.form.controls.cinturon;

  // Bug: el checkbox de "acepto el reglamento" se maneja a mano con esta bandera y un
  // (change), en vez de conectarse al control reactivo `aceptoReglamento` del FormGroup. El
  // control real del formulario nunca se entera de si la persona marcó el checkbox o no.
  protected aceptoManual = false;

  protected onAceptoChange(event: Event): void {
    this.aceptoManual = (event.target as HTMLInputElement).checked;
  }

  // Bug: se captura una sola vez, al construir el componente. En ese momento el formulario
  // todavía está vacío, así que onSubmit() siempre reenvía estos datos "congelados" sin
  // importar lo que la persona haya escrito después.
  private readonly datosCapturados = this.form.getRawValue();

  protected enviado: InscripcionValue | null = null;

  protected onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.enviado = this.datosCapturados;
  }
}
