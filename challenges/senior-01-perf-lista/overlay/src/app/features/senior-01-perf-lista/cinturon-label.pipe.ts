import { Pipe, PipeTransform } from '@angular/core';

const CINTURON_LABELS: Record<string, string> = {
  blanco: 'Cinturón blanco',
  azul: 'Cinturón azul',
  negro: 'Cinturón negro',
};

@Pipe({
  name: 'cinturonLabel',
  // Bug: sin razón para serlo, este pipe corre en cada ciclo de detección de cambios para
  // cada una de las diez mil filas, en vez de memoizar por valor de entrada como un pipe puro.
  pure: false,
})
export class CinturonLabelPipe implements PipeTransform {
  transform(cinturon: string): string {
    return CINTURON_LABELS[cinturon] ?? cinturon;
  }
}
