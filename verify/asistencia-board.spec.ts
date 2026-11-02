import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AsistenciaBoard } from '../src/app/features/mid-01-zoneless-no-refresca/asistencia-board';

describe('AsistenciaBoard (mid-01-zoneless-no-refresca)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
  });

  it('al marcar presente a un alumno, la fila y el contador se actualizan', () => {
    const fixture = TestBed.createComponent(AsistenciaBoard);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('1 de 3 presentes');

    const boton = Array.from(root.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Marcar presente'),
    );
    expect(boton).toBeTruthy();
    boton!.click();
    fixture.detectChanges();

    expect(root.textContent).toContain('2 de 3 presentes');
  });

  it('al agregar un alumno nuevo, aparece en la lista', () => {
    const fixture = TestBed.createComponent(AsistenciaBoard);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    input.value = 'Diego Reyes';
    input.dispatchEvent(new Event('input'));

    const form = root.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();

    expect(root.textContent).toContain('Diego Reyes');
    expect(root.textContent).toContain('1 de 4 presentes');
  });

  it('el cronómetro avanza un segundo por tick, con temporizadores simulados', () => {
    jest.useFakeTimers();

    const fixture = TestBed.createComponent(AsistenciaBoard);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const boton = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Iniciar cronómetro'),
    );
    expect(boton).toBeTruthy();
    boton!.click();
    fixture.detectChanges();

    expect(root.textContent).toContain('0s transcurridos');

    jest.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(root.textContent).toContain('1s transcurridos');

    jest.advanceTimersByTime(2000);
    fixture.detectChanges();
    expect(root.textContent).toContain('3s transcurridos');

    jest.useRealTimers();
  });
});
