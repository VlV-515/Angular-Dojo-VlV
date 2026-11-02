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

  protected readonly segundosTranscurridos = signal(0);
  protected readonly cronometroTexto = computed(
    () => `${this.segundosTranscurridos()}s transcurridos`,
  );

  private cronometroId?: ReturnType<typeof setTimeout>;

  protected marcarPresente(id: string): void {
    this.alumnos.update((lista) =>
      lista.map((alumno) => (alumno.id === id ? { ...alumno, presente: true } : alumno)),
    );
  }

  protected agregarAlumno(nombre: string): void {
    if (!nombre.trim()) {
      return;
    }
    this.alumnos.update((lista) => [
      ...lista,
      { id: crypto.randomUUID(), nombre, presente: false },
    ]);
  }

  protected iniciarCronometro(): void {
    const tick = (): void => {
      this.segundosTranscurridos.update((s) => s + 1);
      this.cronometroId = setTimeout(tick, 1000);
    };
    this.cronometroId = setTimeout(tick, 1000);
  }
}
