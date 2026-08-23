import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideRouter, UrlTree } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import type { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { mockApiInterceptor } from '../src/app/core/mock-api/mock-api.interceptor';
import type { DatoPanel } from '../src/app/core/mock-api/fixtures/panel';
import { AuthState } from '../src/app/features/mid-04-guards-interceptors/auth-state';
import { authGuard } from '../src/app/features/mid-04-guards-interceptors/auth.guard';
import { authInterceptor } from '../src/app/features/mid-04-guards-interceptors/auth.interceptor';

describe('authGuard (mid-04-guards-interceptors)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
  });

  it('deja pasar cuando hay sesión iniciada', () => {
    TestBed.inject(AuthState).iniciarSesion();

    const resultado = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    expect(resultado).toBe(true);
  });

  it('redirige a /panel-entrada cuando NO hay sesión iniciada', () => {
    const resultado = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    expect(resultado).toBeInstanceOf(UrlTree);
    expect((resultado as UrlTree).toString()).toBe('/panel-entrada');
  });
});

describe('authInterceptor + fixture del panel (mid-04-guards-interceptors)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        // Orden correcto a propósito: este test aísla el bug del interceptor (¿de verdad clona
        // la petición con el header?), no el bug de orden en app.config.ts (eso lo cubre el e2e).
        provideHttpClient(withFetch(), withInterceptors([authInterceptor, mockApiInterceptor])),
      ],
    });
  });

  it('responde con los datos del panel cuando hay sesión iniciada', async () => {
    TestBed.inject(AuthState).iniciarSesion();
    const http = TestBed.inject(HttpClient);

    const datos = await firstValueFrom(http.get<DatoPanel[]>('/api/dojo/panel-datos'));

    expect(datos.length).toBeGreaterThan(0);
  });

  it('falla con 401 cuando NO hay sesión iniciada', async () => {
    const http = TestBed.inject(HttpClient);

    await expect(firstValueFrom(http.get('/api/dojo/panel-datos'))).rejects.toBeInstanceOf(
      HttpErrorResponse,
    );
  });
});
