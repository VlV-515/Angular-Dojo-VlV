import { Component, computed, signal } from '@angular/core';

import { CinturonLabelPipe } from './cinturon-label.pipe';
import { generarAlumnos, type Alumno } from './data';

const ALTO_FILA = 32;
const ALTO_CONTENEDOR = 480;
const FILAS_DE_COLCHON = 8;

@Component({
  selector: 'app-padron-list',
  imports: [CinturonLabelPipe],
  templateUrl: './padron-list.html',
  styleUrl: './padron-list.scss',
})
export class PadronList {
  private readonly alumnos = generarAlumnos();

  protected readonly altoFila = ALTO_FILA;
  protected readonly altoContenedor = ALTO_CONTENEDOR;

  protected readonly filtro = signal('');
  protected readonly scrollTop = signal(0);

  protected readonly alumnosFiltrados = computed(() => {
    const f = this.filtro().trim().toLowerCase();
    return f ? this.alumnos.filter((a) => a.nombre.toLowerCase().includes(f)) : this.alumnos;
  });

  protected readonly resumenEstadistico = computed(() => {
    const datos = this.alumnosFiltrados();
    const enRacha = datos.filter((a) => a.racha >= 5).length;
    const promedioRacha = datos.length
      ? datos.reduce((acc, a) => acc + a.racha, 0) / datos.length
      : 0;
    return { total: datos.length, enRacha, promedioRacha };
  });

  protected readonly alturaTotal = computed(() => this.alumnosFiltrados().length * ALTO_FILA);

  protected readonly indiceInicial = computed(() =>
    Math.max(0, Math.floor(this.scrollTop() / ALTO_FILA) - FILAS_DE_COLCHON),
  );

  protected readonly desplazamiento = computed(() => this.indiceInicial() * ALTO_FILA);

  protected readonly filasVisibles = computed(() => {
    const datos = this.alumnosFiltrados();
    const inicio = this.indiceInicial();
    const cantidad = Math.ceil(ALTO_CONTENEDOR / ALTO_FILA) + FILAS_DE_COLCHON * 2;
    return datos.slice(inicio, inicio + cantidad);
  });

  protected onScroll(event: Event): void {
    this.scrollTop.set((event.target as HTMLElement).scrollTop);
  }

  protected onFiltroChange(valor: string): void {
    this.filtro.set(valor);
    this.scrollTop.set(0);
  }

  protected resumenRacha(a: Alumno): string {
    return a.racha >= 5 ? 'En racha' : 'Sin racha';
  }
}
