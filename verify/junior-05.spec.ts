import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { RutinaDiaria } from '../src/app/features/junior-05-signals-basico/rutina-diaria';

describe('RutinaDiaria (junior-05-signals-basico)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
  });

  it('el contador de repeticiones se muestra como número y sube al hacer click', () => {
    const fixture = TestBed.createComponent(RutinaDiaria);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const valorContador = root.querySelectorAll('p.valor')[0] as HTMLElement;
    expect(valorContador.textContent?.trim()).toBe('0');

    const boton = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('+1 repetición'),
    );
    expect(boton).toBeTruthy();
    boton!.click();
    fixture.detectChanges();

    expect(valorContador.textContent?.trim()).toBe('1');
  });

  it('la racha sube al hacer click en "Sumar día de racha"', () => {
    const fixture = TestBed.createComponent(RutinaDiaria);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('0 días seguidos');

    const boton = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Sumar día de racha'),
    );
    expect(boton).toBeTruthy();
    boton!.click();
    fixture.detectChanges();

    expect(root.textContent).toContain('1 días seguidos');
  });

  it('la meta diaria en pantalla sube al hacer click en "Subir meta"', () => {
    const fixture = TestBed.createComponent(RutinaDiaria);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Meta: 5 repeticiones al día');

    const boton = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Subir meta'),
    );
    expect(boton).toBeTruthy();
    boton!.click();
    fixture.detectChanges();

    expect(root.textContent).toContain('Meta: 6 repeticiones al día');
  });
});
