import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { mockApiInterceptor } from './core/mock-api/mock-api.interceptor';
import { authInterceptor } from './features/mid-04-guards-interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    // Bug: el orden importa. `mockApiInterceptor` responde (o falla) las rutas que reconoce sin
    // llamar nunca a `next(req)`, así que si va antes que `authInterceptor` en el arreglo, este
    // último —el que agregaría el token— jamás llega a ejecutarse para esas rutas.
    provideHttpClient(withFetch(), withInterceptors([mockApiInterceptor, authInterceptor])),
  ],
};
