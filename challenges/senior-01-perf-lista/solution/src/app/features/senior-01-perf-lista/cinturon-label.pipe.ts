import { Pipe, PipeTransform } from '@angular/core';

const CINTURON_LABELS: Record<string, string> = {
  blanco: 'Cinturón blanco',
  azul: 'Cinturón azul',
  negro: 'Cinturón negro',
};

@Pipe({ name: 'cinturonLabel' })
export class CinturonLabelPipe implements PipeTransform {
  transform(cinturon: string): string {
    return CINTURON_LABELS[cinturon] ?? cinturon;
  }
}
