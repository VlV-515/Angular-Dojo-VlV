import { Component, computed, signal } from '@angular/core';

import { CinturonLabelPipe } from './cinturon-label.pipe';
// Bug: ALUMNOS es un arreglo LITERAL de diez mil objetos en data.ts — viaja completo dentro
// del bundle de esta feature, sin importar si se usa o no.
import { ALUMNOS, type Alumno } from './data';

@Component({
  selector: 'app-padron-list',
  imports: [CinturonLabelPipe],
  templateUrl: './padron-list.html',
  styleUrl: './padron-list.scss',
})
export class PadronList {
  protected readonly filtro = signal('');

  protected readonly alumnosFiltrados = computed(() => {
    const f = this.filtro().trim().toLowerCase();
    return f ? ALUMNOS.filter((a) => a.nombre.toLowerCase().includes(f)) : ALUMNOS;
  });

  protected readonly resumenEstadistico = computed(() => {
    const datos = this.alumnosFiltrados();
    const enRacha = datos.filter((a) => a.racha >= 5).length;
    const promedioRacha = datos.length
      ? datos.reduce((acc, a) => acc + a.racha, 0) / datos.length
      : 0;
    return { total: datos.length, enRacha, promedioRacha };
  });

  protected resumenRacha(a: Alumno): string {
    // Bug: crea un `computed()` nuevo en cada llamada — y esto se llama una vez por fila en
    // cada ciclo de detección de cambios. El grafo de señales crece sin parar.
    return computed(() => (a.racha >= 5 ? 'En racha' : 'Sin racha'))();
  }
}
