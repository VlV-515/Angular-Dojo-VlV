import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { mockApiInterceptor } from './mock-api.interceptor';

describe('mockApiInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mockApiInterceptor])),
        provideHttpClientTesting(),
      ],
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('responde /api/dojo/status con datos simulados', async () => {
    const http = TestBed.inject(HttpClient);
    const response = await firstValueFrom(
      http.get<{ ok: boolean; semilla: number }>('/api/dojo/status'),
    );
    expect(response.ok).toBe(true);
    expect(response.semilla).toBe(1337);
  });

  it('falla exactamente 1 de cada 4 llamadas a /api/dojo/ping, siempre en el mismo orden', async () => {
    const http = TestBed.inject(HttpClient);
    const outcomes: boolean[] = [];

    for (let i = 0; i < 8; i += 1) {
      try {
        await firstValueFrom(http.get('/api/dojo/ping'));
        outcomes.push(true);
      } catch {
        outcomes.push(false);
      }
    }

    expect(outcomes).toEqual([true, true, true, false, true, true, true, false]);
  });

  it('deja pasar las rutas que no reconoce', async () => {
    const http = TestBed.inject(HttpClient);
    const controller = TestBed.inject(HttpTestingController);

    const promise = firstValueFrom(http.get('/api/no-existe'));
    controller.expectOne('/api/no-existe').flush({ passthrough: true });

    await expect(promise).resolves.toEqual({ passthrough: true });
  });
});
