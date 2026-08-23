import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AvisosService,
  PREFIJO_AVISO,
} from '../src/app/features/mid-03-di-ng0203/avisos.service';
import { HistorialAvisos } from '../src/app/features/mid-03-di-ng0203/historial-avisos';
import { PanelAvisos } from '../src/app/features/mid-03-di-ng0203/panel-avisos';

describe('PanelAvisos (mid-03-di-ng0203)', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('programar un recordatorio no debe tronar con NG0203 al cumplirse el plazo', () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });

    jest.useFakeTimers();

    const fixture = TestBed.createComponent(PanelAvisos);
    fixture.detectChanges();

    const boton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    boton.click();

    // Sobre overlay/ el callback del setTimeout llama a inject() fuera de contexto de inyección
    // y Angular lanza NG0203 en cuanto el timer se cumple. jest.advanceTimersByTime ejecuta ese
    // callback de forma síncrona, así que la excepción se propaga hasta aquí.
    expect(() => jest.advanceTimersByTime(1500)).not.toThrow();

    const avisos = TestBed.inject(AvisosService);
    expect(avisos.historial()).toContain('Recordatorio: revisa tu entrenamiento de hoy');
  });

  it('el historial refleja los avisos que ya registró el servicio raíz', () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });

    const avisos = TestBed.inject(AvisosService);
    avisos.registrar('Aviso de prueba');

    const fixture = TestBed.createComponent(HistorialAvisos);
    fixture.detectChanges();

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Aviso de prueba');
  });

  it('usa el prefijo que configura la ruta, no uno propio sin proveer', () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), { provide: PREFIJO_AVISO, useValue: '🔔 ' }],
    });

    const fixture = TestBed.createComponent(PanelAvisos);
    fixture.detectChanges();

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('🔔 Panel de avisos');
  });
});
