import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { InscripcionForm } from '../src/app/features/junior-04-forms-basico/inscripcion-form';

function escribir(el: HTMLInputElement, valor: string): void {
  el.value = valor;
  el.dispatchEvent(new Event('input'));
}

function seleccionar(el: HTMLSelectElement, valor: string): void {
  el.value = valor;
  el.dispatchEvent(new Event('change'));
}

function marcar(el: HTMLInputElement, marcado: boolean): void {
  el.checked = marcado;
  el.dispatchEvent(new Event('change'));
}

describe('InscripcionForm (junior-04-forms-basico)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('el botón de enviar está deshabilitado mientras el formulario está incompleto', () => {
    const fixture = TestBed.createComponent(InscripcionForm);
    fixture.detectChanges();

    const boton = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    expect(boton.disabled).toBe(true);
  });

  it('el formulario no se marca como válido si nadie aceptó el reglamento', () => {
    const fixture = TestBed.createComponent(InscripcionForm);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const inputNombre = root.querySelector('input[type="text"]') as HTMLInputElement;
    const select = root.querySelector('select') as HTMLSelectElement;

    escribir(inputNombre, 'Karateca de prueba');
    seleccionar(select, 'azul');
    // El checkbox de "acepto el reglamento" se deja sin marcar, a propósito.
    fixture.detectChanges();

    expect(root.textContent).toContain('Formulario incompleto');
    expect(root.textContent).not.toContain('Listo para enviar');
  });

  it('al enviar, se guardan los datos actuales del formulario, no los del momento en que se creó', () => {
    const fixture = TestBed.createComponent(InscripcionForm);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const inputNombre = root.querySelector('input[type="text"]') as HTMLInputElement;
    const select = root.querySelector('select') as HTMLSelectElement;
    const checkbox = root.querySelector('input[type="checkbox"]') as HTMLInputElement;
    const form = root.querySelector('form') as HTMLFormElement;

    escribir(inputNombre, 'Karateca de prueba');
    seleccionar(select, 'azul');
    marcar(checkbox, true);
    fixture.detectChanges();

    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(root.textContent).toContain('Karateca de prueba');
    expect(root.textContent).toContain('aceptado: true');
  });
});
