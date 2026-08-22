import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { mockApiInterceptor } from '../src/app/core/mock-api/mock-api.interceptor';
import { Buscador } from '../src/app/features/mid-02-race-condition/buscador';

describe('Buscador (mid-02-race-condition)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(withFetch(), withInterceptors([mockApiInterceptor])),
      ],
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('muestra los resultados de la última consulta, aunque la respuesta de una más corta y lenta llegue después', () => {
    jest.useFakeTimers();

    const fixture = TestBed.createComponent(Buscador);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    // "ma" es corta y genérica: el mock la hace responder lento (360-420ms), a propósito.
    input.value = 'ma';
    input.dispatchEvent(new Event('input'));

    jest.advanceTimersByTime(260);

    // "mae geri" es larga y específica: el mock responde rápido (40-80ms).
    input.value = 'mae geri';
    input.dispatchEvent(new Event('input'));

    // Deja tiempo de sobra para que ambas peticiones, si llegaran, ya hayan resuelto.
    jest.advanceTimersByTime(1000);
    fixture.detectChanges();

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Mae geri');
    expect(texto).not.toContain('Mawashi geri');
  });
});
