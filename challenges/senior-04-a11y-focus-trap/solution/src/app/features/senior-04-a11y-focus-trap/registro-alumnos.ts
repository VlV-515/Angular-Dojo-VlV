import { Component, ElementRef, effect, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

const SELECTOR_FOCUSABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

@Component({
  selector: 'app-registro-alumnos',
  imports: [RouterLink],
  templateUrl: './registro-alumnos.html',
  styleUrl: './registro-alumnos.scss',
})
export class RegistroAlumnos {
  protected readonly dialogoAbierto = signal(false);

  private readonly dialogoRoot = viewChild<ElementRef<HTMLDivElement>>('dialogoRoot');
  private readonly primerCampo = viewChild<ElementRef<HTMLInputElement>>('primerCampo');

  /** Elemento que tenía el foco justo antes de abrir el diálogo (normalmente el trigger). */
  private elementoQueAbrio: HTMLElement | null = null;

  constructor() {
    // Cuando el diálogo se abre y ya está renderizado (primerCampo() resuelto), el foco
    // se mueve adentro. Fix del bug "el foco nunca entra al diálogo".
    effect(() => {
      if (!this.dialogoAbierto()) {
        return;
      }
      this.primerCampo()?.nativeElement.focus();
    });
  }

  protected abrirDialogo(): void {
    this.elementoQueAbrio = document.activeElement as HTMLElement | null;
    this.dialogoAbierto.set(true);
  }

  protected cerrarDialogo(): void {
    this.dialogoAbierto.set(false);
    // Fix del bug "el foco se pierde al cerrar": vuelve al elemento que abrió el diálogo.
    this.elementoQueAbrio?.focus();
    this.elementoQueAbrio = null;
  }

  protected guardar(): void {
    this.cerrarDialogo();
  }

  protected onDialogoKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      // Fix del bug "Escape no cierra el diálogo".
      event.preventDefault();
      this.cerrarDialogo();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const root = this.dialogoRoot()?.nativeElement;
    if (!root) {
      return;
    }

    const focusables = Array.from(root.querySelectorAll<HTMLElement>(SELECTOR_FOCUSABLES));
    if (focusables.length === 0) {
      return;
    }

    const primero = focusables[0];
    const ultimo = focusables[focusables.length - 1];
    const activo = document.activeElement;

    // Fix del bug "no hay trampa de foco": Tab desde el último control vuelve al primero,
    // y Shift+Tab desde el primero vuelve al último, sin escapar del diálogo.
    if (event.shiftKey && activo === primero) {
      event.preventDefault();
      ultimo.focus();
    } else if (!event.shiftKey && activo === ultimo) {
      event.preventDefault();
      primero.focus();
    }
  }
}
