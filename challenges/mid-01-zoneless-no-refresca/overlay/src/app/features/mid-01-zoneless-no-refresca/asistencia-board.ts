import { Component, computed, signal } from '@angular/core';

import { AlumnoRow } from './alumno-row';
import { ALUMNOS_SEED, type Alumno } from './data';

@Component({
  selector: 'app-asistencia-board',
  imports: [AlumnoRow],
  templateUrl: './asistencia-board.html',
  styleUrl: './asistencia-board.scss',
})
export class AsistenciaBoard {
  protected readonly alumnos = signal<Alumno[]>(ALUMNOS_SEED.map((a) => ({ ...a })));

  protected readonly total = computed(() => this.alumnos().length);
  protected readonly presentes = computed(() => this.alumnos().filter((a) => a.presente).length);

  // Bug: propiedad plana, no señal — escribirle no notifica a nadie.
  protected segundosTranscurridos = 0;

  // Bug: este computed lee `segundosTranscurridos` como propiedad, no como señal:
  // nunca vuelve a recalcularse aunque el número cambie.
  protected readonly cronometroTexto = computed(() => `${this.segundosTranscurridos}s transcurridos`);

  private cronometroId?: ReturnType<typeof setTimeout>;

  protected marcarPresente(id: string): void {
    // Bug: encuentra el alumno y muta el objeto en sitio, misma referencia de arreglo y de
    // objeto — ni el `computed` ni la fila `OnPush` se entera.
    const alumno = this.alumnos().find((a) => a.id === id);
    if (alumno) {
      alumno.presente = true;
    }
  }

  protected agregarAlumno(nombre: string): void {
    if (!nombre.trim()) {
      return;
    }
    // Bug: `.push` muta el arreglo interno de la señal por referencia; nunca se llama
    // `.set(...)` ni `.update(...)`, así que la plantilla nunca se entera del alumno nuevo.
    this.alumnos().push({ id: crypto.randomUUID(), nombre, presente: false });
  }

  protected iniciarCronometro(): void {
    const tick = (): void => {
      // Bug: escribe fuera de una señal dentro de un `setTimeout` — sin Zone.js nadie avisa a
      // Angular que debe repintar.
      this.segundosTranscurridos += 1;
      this.cronometroId = setTimeout(tick, 1000);
    };
    this.cronometroId = setTimeout(tick, 1000);
  }
}
