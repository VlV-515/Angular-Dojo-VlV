import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthState } from './auth-state';

@Component({
  selector: 'app-panel-entrada',
  imports: [RouterLink],
  templateUrl: './panel-entrada.html',
  styleUrl: './panel-entrada.scss',
})
export class PanelEntrada {
  protected readonly authState = inject(AuthState);

  protected alternarSesion(): void {
    if (this.authState.isAuthenticated()) {
      this.authState.cerrarSesion();
    } else {
      this.authState.iniciarSesion();
    }
  }
}
