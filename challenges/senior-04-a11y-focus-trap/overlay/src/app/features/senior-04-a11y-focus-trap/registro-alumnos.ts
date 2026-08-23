import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro-alumnos',
  imports: [RouterLink],
  templateUrl: './registro-alumnos.html',
  styleUrl: './registro-alumnos.scss',
})
export class RegistroAlumnos {
  protected readonly dialogoAbierto = signal(false);

  protected abrirDialogo(): void {
    // Bug: el diálogo se abre pero el foco nunca se mueve hacia adentro. Con teclado o
    // lector de pantalla, la persona sigue "parada" sobre el botón que acaba de apretar.
    this.dialogoAbierto.set(true);
  }

  protected cerrarDialogo(): void {
    // Bug: no se restaura el foco al botón que abrió el diálogo. Cuando el diálogo
    // desaparece del DOM, el foco se pierde hacia <body>.
    this.dialogoAbierto.set(false);
  }

  protected guardar(): void {
    this.cerrarDialogo();
  }
}
