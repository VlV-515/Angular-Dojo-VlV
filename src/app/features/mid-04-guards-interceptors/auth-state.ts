import { Injectable, computed, signal } from '@angular/core';

import { TOKEN_ESPERADO } from '../../core/mock-api/fixtures/panel';

/**
 * Estado de sesión falso, solo en memoria: una señal con el token (o `null` si no hay sesión).
 * No hay backend real detrás — es un sandbox de aprendizaje para guards e interceptors.
 */
@Injectable({ providedIn: 'root' })
export class AuthState {
  private readonly _token = signal<string | null>(null);

  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);

  iniciarSesion(): void {
    this._token.set(TOKEN_ESPERADO);
  }

  cerrarSesion(): void {
    this._token.set(null);
  }
}
