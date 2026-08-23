import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Calentamiento } from '../src/app/features/junior-03-bindings-control-flow/calentamiento';

describe('Calentamiento (junior-03-bindings-control-flow)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('un ejercicio recién cargado (sin hacer) no aparece marcado como completado', () => {
    const fixture = TestBed.createComponent(Calentamiento);
    fixture.detectChanges();

    const primerItem = fixture.nativeElement.querySelector('.item') as HTMLElement;
    expect(primerItem).toBeTruthy();
    expect(primerItem.classList.contains('completado')).toBe(false);
  });

  it('no muestra el banner de "completo" mientras falten ejercicios por hacer', () => {
    const fixture = TestBed.createComponent(Calentamiento);
    fixture.detectChanges();

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).not.toContain('Calentamiento completo');
  });

  it('al marcar un ejercicio como hecho, el contador de arriba se actualiza', () => {
    const fixture = TestBed.createComponent(Calentamiento);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('0 de 3 hechos');

    const checkbox = root.querySelector('input[type="checkbox"]') as HTMLInputElement;
    checkbox.click();
    fixture.detectChanges();

    expect(root.textContent).toContain('1 de 3 hechos');
  });

  it('al quitar un ejercicio, el nombre de las filas que quedan no se mezcla con otro', () => {
    const fixture = TestBed.createComponent(Calentamiento);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const nombres = Array.from(root.querySelectorAll<HTMLInputElement>('.nombre'));
    expect(nombres.map((input) => input.value)).toEqual([
      'Estiramiento de piernas',
      'Saltos de tijera',
      'Combate a la sombra',
    ]);

    // Deja el foco en la fila del medio ("Saltos de tijera") y quita la primera fila.
    nombres[1].focus();
    expect(document.activeElement).toBe(nombres[1]);

    const primerBotonQuitar = root.querySelector<HTMLButtonElement>('.quitar');
    primerBotonQuitar!.click();
    fixture.detectChanges();

    // El input que tenía el foco debe seguir mostrando el ejercicio al que pertenecía
    // ("Saltos de tijera"), no el de la fila que quedó destruida al reindexar por posición.
    expect((document.activeElement as HTMLInputElement).value).toBe('Saltos de tijera');

    document.body.removeChild(fixture.nativeElement);
  });

  it('al escribir un nuevo ejercicio y presionar "Agregar", aparece en la lista', () => {
    const fixture = TestBed.createComponent(Calentamiento);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const input = root.querySelector('.nuevo') as HTMLInputElement;
    input.value = 'Sombra con guardia baja';
    input.dispatchEvent(new Event('input'));

    const form = root.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();

    expect(root.textContent).toContain('Sombra con guardia baja');
  });
});
