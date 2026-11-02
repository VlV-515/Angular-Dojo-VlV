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
    // authInterceptor va primero: agrega el header antes de que mockApiInterceptor decida si la
    // petición calza con una ruta simulada y responde sin llamar a next(req).
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, mockApiInterceptor])),
  ],
};
